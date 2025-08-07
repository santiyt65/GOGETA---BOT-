import fetch from 'node-fetch';

export default async function (sock, m) {
    try {
        await sock.sendMessage(m.key.remoteJid, { text: "😂 Buscando un meme..." });

        const res = await fetch('https://meme-api.com/gimme/memesenespanol');
        const json = await res.json();

        if (!json.url) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se pudo obtener un meme en este momento, intenta de nuevo." });
        }

        await sock.sendMessage(m.key.remoteJid, {
            image: { url: json.url },
            caption: `*${json.title}*`
        });
    } catch (e) {
        console.error("❌ Error en el comando .meme:", e);
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al buscar el meme." });
    }
}