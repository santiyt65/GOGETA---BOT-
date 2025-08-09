import ytdl from '@distube/ytdl-core';
import ytsr from 'youtube-sr';

/**
 * Descarga el audio de un video de YouTube y lo envía.
 * @type {import('../lib/functions.js').CommandHandler}
 */
export default async function (sock, m, args) {
    const query = args.join(' ');
    if (!query) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Por favor, proporciona un enlace de YouTube o un término de búsqueda.\nEjemplo: `.ytmp3 lofi hip hop`" });
    }

    try {
        await sock.sendMessage(m.key.remoteJid, { text: `🎶 Buscando y descargando audio para: *${query}*...` }, { quoted: m });

        let videoUrl;
        if (ytdl.validateURL(query)) {
            videoUrl = query;
        } else {
            const searchResults = await ytsr.search(query, { limit: 1, type: 'video' });
            if (!searchResults || searchResults.length === 0) {
                return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se encontraron resultados para tu búsqueda." });
            }
            videoUrl = searchResults[0].url;
        }

        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoLength = parseInt(videoInfo.videoDetails.lengthSeconds, 10);
        if (videoLength > 600) { // Limitar a 10 minutos (600 segundos)
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ El audio es demasiado largo. El límite es de 10 minutos." });
        }

        const stream = ytdl(videoUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        await sock.sendMessage(m.key.remoteJid, { audio: stream, mimetype: 'audio/mp4' }, { quoted: m });

    } catch (e) {
        console.error("❌ Error en el comando .ytmp3:", e);
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al descargar el audio. Asegúrate de que el enlace sea válido." });
    }
}