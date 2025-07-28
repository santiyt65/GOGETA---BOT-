import { readFile } from "fs/promises";
import path from "path";

export async function menuCommand(sock, m) {
  const texto = `
🔥 *Gogeta-Bot* 🔥

📌 *Menú Principal de Comandos:*

➤ .infobot  
➤ .infocreador  
➤ .menus
  `.trim();

  try {
    const imagePath = path.join("./media", "menu.jpg"); // Imagen principal del menú
    const buffer = await readFile(imagePath);

    await sock.sendMessage(m.key.remoteJid, {
      image: buffer,
      caption: texto,
      buttons: [
        { buttonId: ".menujuegos", buttonText: { displayText: "🎮 Juegos" }, type: 1 },
        { buttonId: ".menuimagenes", buttonText: { displayText: "🖼️ Imágenes" }, type: 1 },
        { buttonId: ".menuadmin", buttonText: { displayText: "⚙️ Admin" }, type: 1 },
      ],
      footer: "Selecciona una categoría 👇",
    });
  } catch (err) {
    console.error("❌ Error al enviar el menú principal:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: texto,
    });
  }
}
