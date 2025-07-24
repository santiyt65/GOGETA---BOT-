const opcionesValidas = ["piedra", "papel", "tijera"];

export async function pptCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const partes = body.trim().toLowerCase().split(" ");
  const eleccionUsuario = partes[1];

  // Si no eligió ninguna opción, mostramos los botones
  if (!eleccionUsuario || !opcionesValidas.includes(eleccionUsuario)) {
    const opciones = [
      { buttonId: ".ppt piedra", buttonText: { displayText: "🪨 Piedra" }, type: 1 },
      { buttonId: ".ppt papel", buttonText: { displayText: "📄 Papel" }, type: 1 },
      { buttonId: ".ppt tijera", buttonText: { displayText: "✂️ Tijera" }, type: 1 },
    ];

    await sock.sendMessage(m.key.remoteJid, {
      text: "🕹️ Elige una opción para jugar *Piedra, Papel o Tijera*:",
      buttons: opciones,
      footer: "Gogeta - Bot",
      headerType: 1,
    });
    return;
  }

  // Bot elige al azar
  const eleccionBot = opcionesValidas[Math.floor(Math.random() * 3)];

  // Resultado
  let resultado = "";
  if (eleccionUsuario === eleccionBot) {
    resultado = "🤝 ¡Empate!";
  } else if (
    (eleccionUsuario === "piedra" && eleccionBot === "tijera") ||
    (eleccionUsuario === "papel" && eleccionBot === "piedra") ||
    (eleccionUsuario === "tijera" && eleccionBot === "papel")
  ) {
    resultado = "🎉 ¡Ganaste!";
  } else {
    resultado = "😢 ¡Perdiste!";
  }

  await sock.sendMessage(m.key.remoteJid, {
    text: `🪨 *Tú*: ${eleccionUsuario}\n🤖 *Bot*: ${eleccionBot}\n\n${resultado}`,
  });
}
