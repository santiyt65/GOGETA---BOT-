// plugins/trivia.js
import { addXP, checkLevelUp } from '../lib/leveling.js';

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

export default async function (sock, m) {
    const jid = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId;

    // --- Manejar la respuesta de un botón ---
    if (buttonId && buttonId.startsWith("trivia_")) {
        if (!usuariosJugando[sender]) return; // Ignorar si el usuario no está jugando

        const respuestaUsuario = buttonId.replace("trivia_", "");
        const correcta = usuariosJugando[sender].respuestaCorrecta;
        delete usuariosJugando[sender]; // Limpiar estado del jugador

        if (respuestaUsuario === correcta) {
            await sock.sendMessage(jid, { text: `✅ ¡Correcto! La respuesta era *${correcta}*.` });
            addXP(sender, 75);
            await checkLevelUp(sock, sender);
        } else {
            await sock.sendMessage(jid, { text: `❌ Incorrecto. La respuesta correcta era *${correcta}*.` });
        }
        return;
    }

    // --- Iniciar una nueva partida ---
    if (usuariosJugando[sender]) {
        return await sock.sendMessage(jid, {
            text: "⚠️ Ya tienes una pregunta activa. Responde primero antes de comenzar otra.",
        });
    }

    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    usuariosJugando[sender] = {
        respuestaCorrecta: preguntaAleatoria.respuesta,
    };

    const botones = preguntaAleatoria.opciones.map((opcion) => ({
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
