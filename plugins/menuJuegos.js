import { readFile } from "fs/promises";
import path from "path";

export async function juegosMenu(sock, m) {
  const texto = `
🎮 *Juegos Disponibles:*

🔹 .ahorcado – Adivina la palabra antes de morir.
🔹 .trivia – Preguntas rápidas de conocimiento.
🔹 .matematica – Reta tu rapidez con cuentas.
🔹 .ppt – Piedra, papel o tijera contra el bot.
🔹 .femboy – Elige un femboy aleatorio del grupo.
  `.trim();

  try {
    const imagePath = path.join("./media", "menu-juegos.jpg");
    const buffer = await readFile(imagePath);

    await sock.sendMessage(m.key.remoteJid, {
      image: buffer,
      caption: texto,
      buttons: [
        { buttonId: ".menus", buttonText: { displayText: "🏠 Menú Principal" }, type: 1 },
        { buttonId: ".menuimagenes", buttonText: { displayText: "🖼️ Imágenes" }, type: 1 },
        { buttonId: ".menuadmin", buttonText: { displayText: "⚙️ Admin" }, type: 1 },
      ],
      footer: "Gogeta-Bot 🔥",
    });
  } catch (err) {
    console.error("❌ Error al enviar menú de juegos:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: texto,
    });
  }
}
