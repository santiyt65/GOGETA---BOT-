import fetch from 'node-fetch';

export async function pinterestCommand(sock, m, command) {
  try {
    const texto = command.split(' ').slice(1).join(' ');
    if (!texto) {
      await sock.sendMessage(m.key.remoteJid, { text: "📌 *Escribe algo para buscar en Pinterest.*\n\nEjemplo: `.pinterest Goku`" }, { quoted: m });
      return;
    }

    const res = await fetch(`https://pinterest-api.vercel.app/api/pin?query=${encodeURIComponent(texto)}`);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      await sock.sendMessage(m.key.remoteJid, { text: "❌ No encontré resultados." }, { quoted: m });
      return;
    }

    const imagen = data.data[Math.floor(Math.random() * data.data.length)];
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: imagen },
      caption: `🔍 *Resultado de:* ${texto}`
    }, { quoted: m });
  } catch (e) {
    console.error("❌ Error en pinterestCommand:", e);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Error al buscar en Pinterest." }, { quoted: m });
  }
}
