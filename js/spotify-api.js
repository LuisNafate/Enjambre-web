const clientId = 'd8275661e4084cb5b21ba2904530747b';
const clientSecret = 'c586885f0893465bbcbde9386516abf8';

// Función para obtener el token de acceso de Spotify
const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    return data.access_token; // Devuelve el token de acceso
};

/**
 * Función para obtener datos de un artista específico por su ID.
 * @param {string} artistId - El ID del artista en Spotify.
 * @returns {Promise<Object>} - Los datos del artista.
 */
const getArtist = async (artistId) => {
    const token = await _getToken(); // Obtiene el token primero
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data;
};

/**
 * Función para obtener los álbumes de un artista.
 * @param {string} artistId - El ID del artista en Spotify.
 * @returns {Promise<Object>} - La lista de álbumes del artista.
 */
const getAlbums = async (artistId) => {
    const token = await _getToken();
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=20`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.items;
};

/**
 * Función para obtener las canciones más populares de un artista.
 * @param {string} artistId - El ID del artista en Spotify.
 * @returns {Promise<Object>} - La lista de las canciones más populares.
 */
const getTopTracks = async (artistId) => {
    const token = await _getToken();
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.tracks;
};

// Exportamos las funciones para poder usarlas en main.js
export { getArtist, getAlbums, getTopTracks };



