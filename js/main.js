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

// Función para cargar la página de top canciones
const loadTopTracksPage = async () => {
    const tracks = await getTopTracks(artistId);
    const tracksListOl = document.getElementById('tracks-list');
    
    // Por cada canción, creamos un elemento de lista y lo añadimos
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('li');
        trackItem.innerHTML = `
            <strong>${index + 1}. ${track.name}</strong> (Álbum: ${track.album.name})
            <br>
            <audio controls src="${track.preview_url}">
                Tu navegador no soporta el elemento de audio.
            </audio>
        `;
        tracksListOl.appendChild(trackItem);
    });
};