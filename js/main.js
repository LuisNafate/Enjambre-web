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