import { readFile } from "fs/promises";
import path from "path";

export async function adminMenu(sock, m) {
  const texto = `
⚙️ *Comandos de Administración:*

🛠️ .ban – Banea a un usuario.
🛡️ .unban – Desbanea a un usuario.
🔇 .mute – Silencia al grupo.
📊 .reset ranking – Reinicia los rankings de juegos.
  `.trim();

  try {
    const imagePath = path.join("./media", "menu-admin.jpg");
    const buffer = await readFile(imagePath);

    await sock.sendMessage(m.key.remoteJid, {
      image: buffer,
      caption: texto,
      buttons: [
        { buttonId: ".menus", buttonText: { displayText: "🏠 Menú Principal" }, type: 1 },
        { buttonId: ".menujuegos", buttonText: { displayText: "🎮 Juegos" }, type: 1 },
        { buttonId: ".menuimagenes", buttonText: { displayText: "🖼️ Imágenes" }, type: 1 },
      ],
      footer: "Gogeta-Bot 🔥",
    });
  } catch (err) {
    console.error("❌ Error al enviar menú de admin:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: texto,
    });
  }
}
