// plugins/ppt.js
export async function pptCommand(sock, m, command) {
  // Si el comando es .ppt solo muestra los botones para elegir
  if (command === ".ppt") {
    const buttons = [
      { buttonId: "piedra", buttonText: { displayText: "✊ Piedra" }, type: 1 },
      { buttonId: "papel", buttonText: { displayText: "✋ Papel" }, type: 1 },
      { buttonId: "tijera", buttonText: { displayText: "✌️ Tijera" }, type: 1 },
    ];

    await sock.sendMessage(m.key.remoteJid, {
      text: "🎮 *Piedra, Papel o Tijera*\nElige una opción:",
      buttons,
      footer: "🔥 Gogeta - Bot 🔥",
      headerType: 1,
    });
    return;
  }

  // Si el comando es piedra, papel o tijera, resolvemos el juego
  if (["piedra", "papel", "tijera"].includes(command)) {
    const opciones = ["piedra", "papel", "tijera"];
    const eleccionBot = opciones[Math.floor(Math.random() * opciones.length)];

    let resultado = "";

    if (command === eleccionBot) {
      resultado = "🤝 Empate!";
    } else if (
      (command === "piedra" && eleccionBot === "tijera") ||
      (command === "papel" && eleccionBot === "piedra") ||
      (command === "tijera" && eleccionBot === "papel")
    ) {
      resultado = "🎉 ¡Ganaste!";
    } else {
      resultado = "😢 Perdiste!";
    }

    await sock.sendMessage(m.key.remoteJid, {
      text: `Tu eliges: *${command}*\nYo elijo: *${eleccionBot}*\n\n${resultado}`,
    });
  }
}
