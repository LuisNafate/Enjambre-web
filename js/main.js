// Importamos las funciones que necesitamos del módulo de Spotify
import { getArtist, getAlbums, getTopTracks } from './spotify-api.js';

const artistId = '1ZdhAl62G6ZlEKqIwUAfZR'; // ID Enjambre

// Obtenemos la ruta del archivo actual para saber en qué página estamos
const currentPage = window.location.pathname.split("/").pop();

// Este evento se dispara cuando el contenido del HTML ha sido cargado
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos en qué página estamos y ejecutamos el código correspondiente
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'albumes.html') {
        loadAlbumsPage();
    } else if (currentPage === 'top-canciones.html') {
        loadTopTracksPage();
    }
});