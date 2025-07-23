import { readFile } from "fs/promises";
import path from "path";

export async function menuCommand(sock, m) {
  const texto = `
🔥 *Gogeta-Bot* 🔥

📌 *Comandos disponibles:*

➤ .infobot  
➤ .infocreador  
➤ .menus
  `;

  try {
    const imagePath = path.join("./media", "menu.jpg"); // Asegúrate de que el archivo exista
    const buffer = await readFile(imagePath);

    await sock.sendMessage(m.key.remoteJid, {
      image: buffer,
      caption: texto.trim(),
    });
  } catch (err) {
    console.error("❌ Error al enviar el menú con imagen:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: texto.trim(), // Envía solo texto si hay error con la imagen
    });
  }
}
