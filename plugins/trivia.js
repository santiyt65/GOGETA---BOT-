// plugins/trivia.js

const preguntas = [
  {
    pregunta: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Marte", "Tierra", "Júpiter"],
    respuesta: "Júpiter"
  },
  {
    pregunta: "¿Cuántos colores tiene el arcoíris?",
    opciones: ["5", "7", "6"],
    respuesta: "7"
  },
  {
    pregunta: "¿Quién pintó la Mona Lisa?",
    opciones: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh"],
    respuesta: "Leonardo da Vinci"
  }
  // Puedes agregar más preguntas aquí
];

const usuariosJugando = {}; // Para llevar control de quién está jugando

export async function triviaCommand(sock, m) {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;

  // Si el usuario ya está jugando, no permitir otra partida
  if (usuariosJugando[sender]) {
    await sock.sendMessage(jid, {
      text: "⚠️ Ya tienes una pregunta activa. Responde primero antes de comenzar otra.",
    });
    return;
  }

  const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
  usuariosJugando[sender] = {
    respuestaCorrecta: preguntaAleatoria.respuesta,
  };

  const botones = preguntaAleatoria.opciones.map((opcion, index) => ({
    buttonId: `trivia_${opcion}`,
    buttonText: { displayText: opcion },
    type: 1
  }));

  await sock.sendMessage(jid, {
    text: `🧠 *Trivia:*\n\n${preguntaAleatoria.pregunta}`,
    buttons: botones,
    footer: "Selecciona una respuesta:",
    headerType: 1
  });
}

// Para manejar la respuesta de los botones
export async function handleTriviaResponse(sock, m) {
  const sender = m.key.participant || m.key.remoteJid;
  const selected = m.message?.buttonsResponseMessage?.selectedButtonId;

  if (!selected || !selected.startsWith("trivia_") || !usuariosJugando[sender]) return;

  const respuestaUsuario = selected.replace("trivia_", "");
  const correcta = usuariosJugando[sender].respuestaCorrecta;
  delete usuariosJugando[sender]; // Elimina el estado del jugador

  if (respuestaUsuario === correcta) {
    await sock.sendMessage(m.key.remoteJid, { text: `✅ ¡Correcto! La respuesta era *${correcta}*.` });
  } else {
    await sock.sendMessage(m.key.remoteJid, { text: `❌ Incorrecto. La respuesta correcta era *${correcta}*.` });
  }
}
