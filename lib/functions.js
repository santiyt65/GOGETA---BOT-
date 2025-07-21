import { adivinaCommand } from "../plugins/adivina.js";

export async function handleCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const command = body.trim().toLowerCase();

  if (command === ".ping") {
    await sock.sendMessage(m.key.remoteJid, { text: "🏓 ¡Pong! Gogeta-Bot activo." });

  } else if (command === ".menu") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "📜 *MENÚ DE GOGETA - BOT*\n\n.comandos\n.info\n.ping\n.juegos"
    });

  } else if (command === ".info") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "🤖 *Gogeta - Bot*\nCreado por ChatGPT\nVersión inicial"
    });

  } else if (command === ".juegos") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "🎮 *JUEGOS DISPONIBLES*\n\n1. .adivina\n2. .ppt\n3. .ahorcado\n4. .trivia\n5. .matemática"
    });

  } else if (command === ".adivina") {
    await adivinaCommand(sock, m);
  }
}
