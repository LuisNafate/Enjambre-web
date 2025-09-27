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


