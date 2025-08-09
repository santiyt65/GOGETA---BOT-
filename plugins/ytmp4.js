import ytdl from '@distube/ytdl-core';
import ytsr from 'youtube-sr';

/**
 * Descarga un video de YouTube y lo envía.
 * @type {import('../lib/functions.js').CommandHandler}
 */
export default async function (sock, m, args) {
    const query = args.join(' ');
    if (!query) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Por favor, proporciona un enlace de YouTube o un término de búsqueda.\nEjemplo: `.ytmp4 goku vs jiren`" });
    }

    try {
        await sock.sendMessage(m.key.remoteJid, { text: `🎬 Buscando y descargando video para: *${query}*...` }, { quoted: m });

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
        if (videoLength > 300) { // Limitar a 5 minutos (300 segundos)
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ El video es demasiado largo. El límite para videos es de 5 minutos." });
        }

        const format = ytdl.chooseFormat(videoInfo.formats, { quality: '18', filter: 'videoandaudio' });
        const stream = ytdl(videoUrl, { format });

        await sock.sendMessage(m.key.remoteJid, { video: stream, caption: `*${videoInfo.videoDetails.title}*` }, { quoted: m });

    } catch (e) {
        console.error("❌ Error en el comando .ytmp4:", e);
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al descargar el video. Asegúrate de que el enlace sea válido o intenta con otro." });
    }
}