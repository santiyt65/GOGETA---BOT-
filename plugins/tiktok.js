import fetch from 'node-fetch';

export default async function(sock, m, args) {
    const url = args[0];
    if (!url || !/tiktok\.com/.test(url)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Por favor, proporciona un enlace de TikTok válido.\nEjemplo: `.tiktok https://www.tiktok.com/@user/video/...`" });
    }

    try {
        await sock.sendMessage(m.key.remoteJid, { text: `🕺 Descargando video de TikTok...` }, { quoted: m });

        // Usamos una API de terceros para obtener el enlace sin marca de agua
        const apiResponse = await fetch(`https://tik-tok-api.v-ps.workers.dev/?url=${encodeURIComponent(url)}`);
        const json = await apiResponse.json();

        if (!json.success || !json.data || !json.data.no_watermark) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se pudo obtener el video. Asegúrate de que el enlace sea correcto." });
        }

        await sock.sendMessage(m.key.remoteJid, { video: { url: json.data.no_watermark }, caption: json.data.title || "✅ ¡Video de TikTok descargado!" }, { quoted: m });

    } catch (e) {
        console.error("❌ Error en el comando .tiktok:", e);
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al descargar desde TikTok. El servicio podría estar caído." });
    }
}