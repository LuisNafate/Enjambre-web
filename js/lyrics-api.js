
/**
 * Función para obtener la letra de una canción.
 * @param {string} artist - El nombre del artista.
 * @param {string} title - El título de la canción.
 * @returns {Promise<string|null>} - La letra de la canción o null si no se encuentra.
 */
const getLyrics = async (artist, title) => {
    try {
        //al fin agarro la api 
        const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);

        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.lyrics;
    } catch (error) {
        console.error("Error al obtener la letra:", error);
        return null;
    }
};

export { getLyrics };