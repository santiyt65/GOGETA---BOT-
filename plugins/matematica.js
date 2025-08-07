import { addXP, checkLevelUp } from '../lib/leveling.js';

const preguntasActivas = {};

export default async function (sock, m) {
  const chatId = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId;

  // --- Manejar la respuesta de un botón ---
  if (buttonId && buttonId.startsWith("mat-")) {
    const respuestaUsuario = parseInt(buttonId.split("-")[1]);
    const correcta = preguntasActivas[chatId];

    if (correcta === undefined) return; // No hay juego activo o ya se respondió

    if (respuestaUsuario === correcta) {
      await sock.sendMessage(chatId, { text: `✅ ¡Correcto! La respuesta era *${correcta}*.` });
      addXP(sender, 20); // Dar 20 XP por respuesta correcta
      await checkLevelUp(sock, sender);
    } else {
      await sock.sendMessage(chatId, { text: `❌ Incorrecto. La respuesta correcta era *${correcta}*.` });
    }
    delete preguntasActivas[chatId]; // Limpiar el juego
    return;
  }

  // --- Iniciar una nueva partida ---
  if (preguntasActivas[chatId]) {
    return await sock.sendMessage(chatId, { text: "⚠️ Ya hay una pregunta de matemáticas activa en este chat." });
  }

  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const resultado = a + b; // Simplificamos a solo sumas por ahora

  preguntasActivas[chatId] = resultado;

  const opciones = new Set([resultado]);
  while (opciones.size < 3) {
    opciones.add(resultado + (Math.floor(Math.random() * 10) - 5) || 1);
  }

  await sock.sendMessage(chatId, {
    text: `🧮 ¿Cuánto es *${a} + ${b}*?`,
    buttons: Array.from(opciones).sort(() => Math.random() - 0.5).map(op => ({
      buttonId: `mat-${op}`,
      buttonText: { displayText: op.toString() },
      type: 1
    })),
    footer: "Selecciona la respuesta correcta"
  });
}
