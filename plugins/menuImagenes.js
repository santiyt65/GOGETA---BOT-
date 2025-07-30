import { readFile } from "fs/promises";
import path from "path";

export async function imagenesMenu(sock, m) {
  const texto = `
📷 *Comandos de Imágenes:*

🔍 .pinterest [nombre] – Busca imágenes desde Pinterest.

Ejemplo:
.pinterest goku
  `.trim();

  try {
    const imagePath = path.join("./media", "menu-imagenes.jpg");
    const buffer = await readFile(imagePath);

    await sock.sendMessage(m.key.remoteJid, {
      image: buffer,
      caption: texto,
      buttons: [
        { buttonId: ".menus", buttonText: { displayText: "🏠 Menú Principal" }, type: 1 },
        { buttonId: ".menujuegos", buttonText: { displayText: "🎮 Juegos" }, type: 1 },
        { buttonId: ".menuadmin", buttonText: { displayText: "⚙️ Admin" }, type: 1 },
      ],
      footer: "Gogeta-Bot 🔥",
    });
  } catch (err) {
    console.error("❌ Error al enviar menú de imágenes:", err);
    await sock.sendMessage(m.key.remoteJid, {
      text: texto,
    });
  }
}
