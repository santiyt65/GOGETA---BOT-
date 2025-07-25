let partidas = {};

const palabras = ["javascript", "gogeta", "dragon", "baileys", "codigo", "robot", "ahorcado"];

function generarEstado(palabra, letras) {
  return palabra
    .split("")
    .map(l => (letras.includes(l) ? l : "_"))
    .join(" ");
}

function obtenerIntentosEmoji(intentos) {
  const rojo = "🔴".repeat(6 - intentos);
  const verde = "🟢".repeat(intentos);
  return rojo + verde;
}

function letrasBotones(letrasUsadas) {
  const todas = "abcdefghijklmnopqrstuvwxyz".split("");
  const disponibles = todas.filter(l => !letrasUsadas.includes(l));

  let bloques = [];
  for (let i = 0; i < disponibles.length; i += 3) {
    const grupo = disponibles.slice(i, i + 3);
    bloques.push({
      buttons: grupo.map(l => ({
        buttonId: `.letra ${l}`,
        buttonText: { displayText: l.toUpperCase() },
        type: 1
      })),
    });
  }

  return bloques;
}

export async function ahorcadoCommand(sock, m) {
  const jid = m.key.remoteJid;

  if (partidas[jid]) {
    await sock.sendMessage(jid, { text: "❗ Ya hay un juego en curso. Usa `.terminar` para cancelar." });
    return;
  }

  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  partidas[jid] = {
    palabra,
    letrasUsadas: [],
    intentos: 6,
  };

  const estado = generarEstado(palabra, []);
  const emoji = obtenerIntentosEmoji(6);

  await sock.sendMessage(jid, {
    text: `🎮 *AHORCADO INICIADO*\n\n📖 Palabra: ${estado}\n❤️ Vidas: ${emoji}\n\nToca una letra para jugar.`,
    buttons: letrasBotones([])[0].buttons,
    footer: "Gogeta - Bot",
    headerType: 1
  });
}

export async function manejarLetraBoton(sock, m, letra) {
  const jid = m.key.remoteJid;
  const partida = partidas[jid];
  if (!partida || partida.intentos <= 0) return;

  if (partida.letrasUsadas.includes(letra)) {
    await sock.sendMessage(jid, { text: `❗ Ya usaste la letra *${letra.toUpperCase()}*.` });
    return;
  }

  partida.letrasUsadas.push(letra);

  if (!partida.palabra.includes(letra)) {
    partida.intentos--;
  }

  const estado = generarEstado(partida.palabra, partida.letrasUsadas);
  const emoji = obtenerIntentosEmoji(partida.intentos);

  if (estado.indexOf("_") === -1) {
    await sock.sendMessage(jid, { text: `🎉 ¡Ganaste! La palabra era: *${partida.palabra}*` });
    delete partidas[jid];
    return;
  }

  if (partida.intentos <= 0) {
    await sock.sendMessage(jid, { text: `💀 Perdiste. La palabra era: *${partida.palabra}*` });
    delete partidas[jid];
    return;
  }

  const botones = letrasBotones(partida.letrasUsadas)[0].buttons;

  await sock.sendMessage(jid, {
    text: `📖 Palabra: ${estado}\n❤️ Vidas: ${emoji}\n\nToca otra letra.`,
    buttons: botones,
    footer: "Gogeta - Bot",
    headerType: 1
  });
}

export async function terminarAhorcado(sock, m) {
  const jid = m.key.remoteJid;
  if (partidas[jid]) {
    delete partidas[jid];
    await sock.sendMessage(jid, { text: "🛑 Ahorcado cancelado." });
  } else {
    await sock.sendMessage(jid, { text: "⚠️ No hay un juego en curso." });
  }
}
