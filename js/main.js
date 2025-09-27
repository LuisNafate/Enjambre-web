// Importamos las funciones que necesitamos del módulo de Spotify
import { getArtist, getAlbums, getTopTracks } from './spotify-api.js';

const artistId = '1ZdhAl62G6ZlEKqIwUAfZR'; // ID Enjambre

const currentPage = window.location.pathname.split("/").pop();

// Este evento se dispara cuando el contenido del HTML ha sido cargado
document.addEventListener('DOMContentLoaded', () => {
  
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'albumes.html') {
        loadAlbumsPage();
    } else if (currentPage === 'top-canciones.html') {
        loadTopTracksPage();
    }
});

// Función para cargar la página de inicio
const loadHomePage = async () => {
    const artist = await getArtist(artistId);
    const artistInfoDiv = document.getElementById('artist-info');

    // Creamos el HTML con los datos del artista
    artistInfoDiv.innerHTML = `
        <h1>${artist.name}</h1>
        <img src="${artist.images[0].url}" alt="${artist.name}" width="300">
        <p><strong>Géneros:</strong> ${artist.genres.join(', ')}</p>
        <p><strong>Popularidad:</strong> ${artist.popularity} / 100</p>
        <p><strong>Seguidores en Spotify:</strong> ${artist.followers.total.toLocaleString()}</p>
    `;
};