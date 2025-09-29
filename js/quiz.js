
import { getAlbums, getAlbumTracks } from './spotify-api.js';
import { getLyrics } from './lyrics-api.js';

const artistId = '1ZdhAl62G6ZlEKqIwUAfZR'; // ID Enjambre

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const lyricSnippetEl = document.getElementById('lyric-snippet');
const answerButtonsEl = document.getElementById('answer-buttons');
const scoreTextEl = document.getElementById('score-text');
const feedbackEl = document.getElementById('feedback');

// Estado del juego
let topTracks = [];
let currentQuestionIndex = 0;
let score = 0;

// lista de eventos
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    startQuiz(); // Reinicia el juego
});

async function startQuiz() {
    // nombres exactos que no agarra
    const albumesIncluidos = [
        "Próximos Prójimos",
        "Imperfecto Extraño",
        "Daltónico",
        "Consuelo en Domingo",
        "Noches de salon",
        "Enjambre y los huespedes del orbe",
        
        // aqui agrego los albumes pq le da ansiedad a la api si pongo todos
    ];

    // Resetea el estado del juego
    score = 0;
    currentQuestionIndex = 0;
    feedbackEl.textContent = '';
    
    startScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    
    lyricSnippetEl.innerHTML = '<p>Buscando canciones de los albumes seleccionados...</p>';
    answerButtonsEl.innerHTML = '';


    // Obtenemos todos los álbumes del artista.
    const todosLosAlbumes = await getAlbums(artistId);

    // Filtramos para quedarnos solo con los que están en nuestra lista 'albumesIncluidos'.
    const albumesSeleccionados = todosLosAlbumes.filter(album => 
        albumesIncluidos.includes(album.name)
    );

    if (albumesSeleccionados.length === 0) {
        lyricSnippetEl.innerHTML = '<p>No se encontró ninguno de tus álbumes seleccionados en Spotify. Revisa los nombres.</p>';
        return;
    }

    // === 3. CONSTRUIR LA LISTA DE CANCIONES ===

    // Obtenemos las canciones de esos álbumes.
    const trackPromises = albumesSeleccionados.map(album => getAlbumTracks(album.id));
    const albumTracksArrays = await Promise.all(trackPromises);

    // Juntamos todas las canciones en un solo gran array y lo mezclamos.
    topTracks = albumTracksArrays.flat().sort(() => Math.random() - 0.5);

    if (topTracks.length < 3) {
        lyricSnippetEl.innerHTML = '<p>No se encontraron suficientes canciones en los álbumes seleccionados.</p>';
        return;
    }

    displayNextQuestion();
}

// Muestra la siguiente pregunta
async function displayNextQuestion() {
    if (currentQuestionIndex >= topTracks.length) {
        showResults();
        return;
    }

    feedbackEl.textContent = '';
    answerButtonsEl.innerHTML = ''; // Limpia los botones anteriores

    const track = topTracks[currentQuestionIndex];
    const lyrics = await getLyrics(track.artists[0].name, track.name);

    // Si no se encuentran letras, salta a la siguiente canción
    if (!lyrics) {
        console.warn(`Letra no encontrada para "${track.name}", saltando pregunta.`);
        currentQuestionIndex++;
        displayNextQuestion();
        return;
    }

    // Prepara las opciones de respuesta
    const correctAnswer = track.name;
    const options = [correctAnswer];
    while (options.length < 4) {
        const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];
        if (!options.includes(randomTrack.name)) {
            options.push(randomTrack.name);
        }
    }
    options.sort(() => Math.random() - 0.5); // Mezcla las opciones

    // fragmento de letra
    const lyricLines = lyrics.split('\n').filter(line => line.trim() !== '');
    const snippet = lyricLines.slice(0, 4).join('<br>');
    lyricSnippetEl.innerHTML = `<p>"${snippet}..."</p>`;

    // botones
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('quiz-btn');
        button.addEventListener('click', () => selectAnswer(option, correctAnswer));
        answerButtonsEl.appendChild(button);
    });
}

// Maneja la selección de una respuesta
function selectAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
        feedbackEl.textContent = '¡Correcto!';
        feedbackEl.style.color = 'var(--spotify-green)';
    } else {
        feedbackEl.textContent = `Incorrecto. La respuesta era "${correctAnswer}"`;
        feedbackEl.style.color = '#ff4d4d';
    }

    Array.from(answerButtonsEl.children).forEach(button => button.disabled = true);
    currentQuestionIndex++;
    setTimeout(displayNextQuestion, 2000);
}

// muestra los resultados
function showResults() {
    questionScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    scoreTextEl.textContent = `${score} / ${topTracks.length}`;
}