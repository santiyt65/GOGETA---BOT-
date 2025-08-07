import fetch from 'node-fetch';

export default async function (sock, m, args) {
  const chatId = m.key.remoteJid;
  const searchTerm = args.join(' ');

  if (!searchTerm) {
    return await sock.sendMessage(chatId, { text: "Por favor, escribe qué quieres buscar. Ejemplo: *.pinterest goku*" });
  }
  
  try {
    await sock.sendMessage(chatId, { text: `🔄 Buscando imágenes de *${searchTerm}* en Pinterest...` });

    const api = `https://piny.vercel.app/api/search/${encodeURIComponent(searchTerm)}`;
    const response = await fetch(api);
    const json = await response.json();

    if (!json.status || !json.data || json.data.length === 0) {
      await sock.sendMessage(chatId, { text: "❌ No se encontraron imágenes." });
      return;
    }

    // Enviar hasta 5 imágenes
    const imagesToSend = json.data.slice(0, 5);
    for (const imageUrl of imagesToSend) {
      await sock.sendMessage(chatId, {
        image: { url: imageUrl },
        caption: `🔍 Resultado para: *${searchTerm}*`,
      });
    }

  } catch (e) {
    console.error("❌ Error en el comando pinterest:", e);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Ocurrió un error al buscar las imágenes." });
  }
}
