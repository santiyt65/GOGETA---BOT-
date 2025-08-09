import fetch from 'node-fetch';

export default async function(sock, m, args) {
    const url = args[0];
    if (!url || !/instagram\.com/.test(url)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Por favor, proporciona un enlace de Instagram válido.\nEjemplo: `.instagram https://www.instagram.com/p/C.../`" });
    }

    try {
        await sock.sendMessage(m.key.remoteJid, { text: `📸 Descargando contenido de Instagram...` }, { quoted: m });

        // Usamos una API de terceros para obtener el enlace directo
        const apiResponse = await fetch(`https://ig-api.v-ps.workers.dev/?url=${encodeURIComponent(url)}`);
        const json = await apiResponse.json();

        if (!json.success || !json.data || json.data.length === 0) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se pudo obtener el contenido. Asegúrate de que el enlace sea público y correcto." });
        }

        const media = json.data[0];

        if (media.type === 'video') {
            await sock.sendMessage(m.key.remoteJid, { video: { url: media.url }, caption: "✅ ¡Video de Instagram descargado!" }, { quoted: m });
        } else {
            await sock.sendMessage(m.key.remoteJid, { image: { url: media.url }, caption: "✅ ¡Imagen de Instagram descargada!" }, { quoted: m });
        }

    } catch (e) {
        console.error("❌ Error en el comando .instagram:", e);
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al descargar desde Instagram. El servicio podría estar caído." });
    }
}