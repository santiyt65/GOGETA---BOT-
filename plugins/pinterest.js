import fetch from "node-fetch";

export async function pinterestCommand(sock, m, args) {
  const searchTerm = args.trim();
  if (!searchTerm) {
    return await sock.sendMessage(m.key.remoteJid, { text: "❗️ Por favor ingresa un término para buscar en Pinterest. Ejemplo:\n.pinterest gatitos" });
  }

  try {
    // URL de búsqueda en Pinterest (versión web)
    const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTerm)}`;

    // Fetch a la página de Pinterest
    const res = await fetch(url);
    const html = await res.text();

    // Extraer URLs de imágenes desde el html (simple extracción con regex)
    const regex = /"url":"(https:\\/\\/i.pinimg.com\\/[^"]+)"/g;
    let match;
    const images = [];

    while ((match = regex.exec(html)) !== null) {
      let imgUrl = match[1].replace(/\\/g, ""); // quitar barras invertidas
      if (!images.includes(imgUrl)) images.push(imgUrl);
      if (images.length >= 5) break; // máximo 5 imágenes
    }

    if (images.length === 0) {
      return await sock.sendMessage(m.key.remoteJid, { text: `❌ No se encontraron imágenes para: ${searchTerm}` });
    }

    // Enviar las imágenes una por una (puede ser en grupo o privado)
    for (const img of images) {
      await sock.sendMessage(m.key.remoteJid, {
        image: { url: img },
        caption: `🔍 Resultado para: ${searchTerm}`,
      });
    }

  } catch (e) {
    console.error("Error en pinterestCommand:", e);
    await sock.sendMessage(m.key.remoteJid, { text: "❌ Ocurrió un error buscando en Pinterest." });
  }
}
