const palabras = ["goku", "naruto", "luffy", "tanjiro", "pikachu", "itachi"];

const juegos = {}; // almacenará el estado por chat

export async function ahorcadoCommand(sock, m) {
  const chatId = m.key.remoteJid;

  if (juegos[chatId]) {
    await sock.sendMessage(chatId, {
      text: `❗ Ya hay un juego en curso.\nPalabra: ${mostrarProgreso(juegos[chatId])}\nErrores: ${juegos[chatId].errores.join(", ")}`,
    });
    return;
  }

  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  juegos[chatId] = {
    palabra,
    progreso: Array(palabra.length).fill("_"),
    errores: [],
    intentos: 6,
  };

  await sock.sendMessage(chatId, {
    text: `🎮 *Ahorcado iniciado*\n\nPalabra: ${mostrarProgreso(juegos[chatId])}\n\nEscribe una letra para intentar.`,
  });

  // escucha letras en el chat por 60 segundos (esto se puede mejorar con un middleware)
  setTimeout(() => {
    if (juegos[chatId]) {
      delete juegos[chatId];
      sock.sendMessage(chatId, { text: "⏱️ Tiempo agotado. Juego finalizado." });
    }
  }, 60000);
}

// Ayuda para mostrar palabra
function mostrarProgreso(juego) {
  return juego.progreso.join(" ");
}
