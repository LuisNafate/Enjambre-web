import { getArtist, getAlbums, getTopTracks } from './spotify-api.js';

const artistId = '1ZdhAl62G6ZlEKqIwUAfZR'; // ID Enjambre
const currentPage = window.location.pathname.split("/").pop();

document.addEventListener('DOMContentLoaded', () => {
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'albumes.html') {
        loadAlbumsPage();
    } else if (currentPage === 'top-canciones.html') {
        loadTopTracksPage();
    }
});

const loadHomePage = async () => {
    // Obtenemos los datos del artista y sus álbumes al mismo tiempo
    const [artist, albums] = await Promise.all([
        getArtist(artistId),
        getAlbums(artistId)
    ]);

    // 1. Rellenar el Hero y la sección "About"
    document.getElementById('artist-name-hero').textContent = artist.name;
    document.getElementById('artist-name-about').textContent = artist.name;
    // 2. Rellenar las estadísticas
    document.getElementById('artist-followers').textContent = artist.followers.total.toLocaleString();
    document.getElementById('artist-popularity').textContent = `${artist.popularity} / 100`;
    document.getElementById('artist-genres').textContent = artist.genres.slice(0, 3).join(', ');
    // 3. Rellenar la tarjeta del último lanzamiento
    const latestAlbum = albums[0]; 
    const latestAlbumCard = document.getElementById('latest-album-card');
    latestAlbumCard.innerHTML = `
        <img src="${latestAlbum.images[1].url}" alt="${latestAlbum.name}">
        <h3>${latestAlbum.name}</h3>
        <p>Lanzamiento: ${latestAlbum.release_date}</p>
        <p>${latestAlbum.total_tracks} canciones</p>
    `;
};

// Función para cargar la página de álbumes
const loadAlbumsPage = async () => {
    const albums = await getAlbums(artistId);
    const albumsListDiv = document.getElementById('albums-list');

    // Por cada álbum, creamos una tarjeta y la añadimos a la lista
    albums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.className = 'card';
        albumCard.innerHTML = `
            <img src="${album.images[1].url}" alt="${album.name}">
            <h3>${album.name}</h3>
            <p>Lanzamiento: ${album.release_date}</p>
            <p>${album.total_tracks} canciones</p>
        `;
        albumsListDiv.appendChild(albumCard);
    });
};

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
};

// Función para cargar la página de top canciones
const loadTopTracksPage = async () => {
    const tracks = await getTopTracks(artistId);
    const tracksContainer = document.getElementById('tracks-container');
    
    // Limpiamos el mensaje de "Cargando..."
    tracksContainer.innerHTML = ''; 

    tracks.forEach((track, index) => {
        const trackCard = document.createElement('div');
        trackCard.className = 'track-card';

        trackCard.innerHTML = `
            <div class="track-rank">${index + 1}</div>
            <img class="track-album-art" src="${track.album.images[2].url}" alt="Portada de ${track.album.name}">
            <div class="track-info">
                <h3>${track.name}</h3>
                <p>${track.album.name} • ${formatDuration(track.duration_ms)}</p>
            </div>
            <div class="track-player-link">
                ${track.preview_url ? `<audio controls src="${track.preview_url}"></audio>` : '<p>Preview no disponible</p>'}
                <a href="${track.external_urls.spotify}" target="_blank" class="spotify-link">
                    Escuchar en Spotify
                </a>
            </div>
        `;

        // Añadimos la tarjeta al contenedor
        tracksContainer.appendChild(trackCard);
    });
};