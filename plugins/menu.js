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

  // Ruta de la imagen (ajústala según tu estructura de carpetas)
  const imagenMenu = await readFile(path.join("./media", "menu.jpg")); // Asegúrate de que este archivo exista

  await sock.sendMessage(m.key.remoteJid, {
    image: imagenMenu,
    caption: texto.trim(),
  });
}
