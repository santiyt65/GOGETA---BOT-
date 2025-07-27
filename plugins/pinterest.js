import fetch from 'node-fetch';

export async function pinterestCommand(sock, m, searchTerm) {
  const chatId = m.key.remoteJid;
  
  try {
    await sock.sendMessage(chatId, { text: `🔄 Buscando imágenes de *${searchTerm}* en Pinterest...` });

    const api1 = `https://pinterest-api.vercel.app/api/pins?q=${encodeURIComponent(searchTerm)}`;
    const api2 = `https://piny.vercel.app/api/search/${encodeURIComponent(searchTerm)}`;

    let results = [];

    // Intenta primera API
    try {
      const res1 = await fetch(api1);
      const json1 = await res1.json();
      if (json1 && Array.isArray(json1)) results = json1;
    } catch {}

    // Fallback si falla la primera
    if (results.length === 0) {
      const res2 = await fetch(api2);
      const json2 = await res2.json();
      if (json2 && json2.data) results = json2.data;
    }

    if (!results.length) {
      await sock.sendMessage(chatId, { text: "❌ No se encontraron imágenes." });
      return;
    }

    const images = results.slice(0, 5); // hasta 5 resultados
    for (const img of images) {
      await sock.sendMessage(chatId, {
        image: { url: img.url || img },
        caption: `🔍 Resultado de: *${searchTerm}*`,
      });
    }

  } catch (e) {
    console.error("❌ Error en pinterestCommand:", e);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error buscando imágenes." });
  }
}
