const opciones = ["piedra", "papel", "tijera"];

export async function pptCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const jugador = body.trim().split(" ")[1]?.toLowerCase();

  if (!opciones.includes(jugador)) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `✊ *Juguemos Piedra, Papel o Tijera* 🖐️\n\nUsa el comando así:\n.ppt piedra\n.ppt papel\n.ppt tijera`,
    });
    return;
  }

  const bot = opciones[Math.floor(Math.random() * opciones.length)];

  let resultado = "";
  if (jugador === bot) {
    resultado = "🤝 ¡Empate!";
  } else if (
    (jugador === "piedra" && bot === "tijera") ||
    (jugador === "papel" && bot === "piedra") ||
    (jugador === "tijera" && bot === "papel")
  ) {
    resultado = "🎉 ¡Ganaste!";
  } else {
    resultado = "💀 ¡Perdiste!";
  }

  await sock.sendMessage(m.key.remoteJid, {
    text: `👤 Tú elegiste: *${jugador}*\n🤖 Yo elegí: *${bot}*\n\n${resultado}`,
  });
}
