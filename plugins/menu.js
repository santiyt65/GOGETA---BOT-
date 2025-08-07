import { readFile } from "fs/promises";
import path from "path";

export default async function (sock, m) {
  const texto = `
🔥 *Gogeta-Bot* 🔥

📌 *Comandos Principales:*
➤ .profile [@usuario]
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
        { buttonId: ".menugacha", buttonText: { displayText: "⛩️ Gacha" }, type: 1 },
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
