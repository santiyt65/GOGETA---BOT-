export async function menuCommand(sock, m) {
  const texto = `
🔥 *Gogeta-Bot* 🔥

📌 Comandos disponibles:

➤ .infobot
➤ .infocreador
➤ .menus
  `;

  await sock.sendMessage(m.key.remoteJid, { text: texto.trim() });
}
