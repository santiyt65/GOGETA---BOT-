import fetch from "node-fetch";

export async function pinterestCommand(sock, m) {
  const texto = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
  const query = texto.replace(".pinterest", "").trim();

  if (!query) {
    await sock.sendMessage(m.key.remoteJid, {
      text: "🔍 Escribe algo después de `.pinterest` para buscar una imagen.\n\nEjemplo:\n`.pinterest naruto`",
    });
    return;
  }

  try {
    const res = await fetch(`https://api-deni.replit.app/pinterest?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data || !data.result || data.result.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: "❌ No se encontraron imágenes. Prueba con otra palabra.",
      });
      return;
    }

    const random = data.result[Math.floor(Math.random() * data.result.length)];

    await sock.sendMessage(m.key.remoteJid, {
      image: { url: random },
      caption: `🔎 Resultado de búsqueda en Pinterest:\n👉 *${query}*`,
    });

  } catch (err) {
    console.error("Error en pinterestCommand:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: "⚠️ Error al buscar la imagen. Intenta más tarde.",
    });
  }
}
