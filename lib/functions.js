export async function handleCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const command = body.trim().toLowerCase();

  if (command === ".ping") {
    await sock.sendMessage(m.key.remoteJid, { text: "🏓 ¡Pong! Gogeta-Bot activo." });
  } else if (command === ".menu") {
    await sock.sendMessage(m.key.remoteJid, { text: "📜 *MENÚ DE GOGETA - BOT*\n\n.comandos\n.info\n.ping" });
  } else if (command === ".info") {
    await sock.sendMessage(m.key.remoteJid, { text: "🤖 *Gogeta - Bot*\nCreado por ChatGPT\nVersión inicial" });
  }
}
import { menuCommand } from "../plugins/menu.js";

if (command === ".menus") {
  await menuCommand(sock, m);
}
