const palabras = ["goku", "naruto", "luffy", "tanjiro", "pikachu", "itachi"];

const juegos = new Map(); // Usaremos un Map para gestionar las partidas por chat

// Función de ayuda para mostrar el progreso de la palabra (ej: g _ k u)
function mostrarProgreso(juego) {
  return juego.progreso.join(" ");
}

export default async function (sock, m) {
  const chatId = m.key.remoteJid;

  if (juegos.has(chatId)) {
    await sock.sendMessage(chatId, {
      text: `❗ Ya hay un juego en curso.\nPalabra: ${mostrarProgreso(juegos.get(chatId))}\nErrores: ${juegos.get(chatId).errores.join(", ")}`,
    });
    return;
  }

  const palabra = palabras[Math.floor(Math.random() * palabras.length)];

  const listener = async ({ messages }) => {
    const mensaje = messages[0];
    if (!mensaje.message || mensaje.key.fromMe || mensaje.key.remoteJid !== chatId) return;

    const texto = (mensaje.message.conversation || mensaje.message.extendedTextMessage?.text || "").trim().toLowerCase();
    const juego = juegos.get(chatId);

    if (!juego) {
      sock.ev.off("messages.upsert", listener);
      return;
    }

    if (texto.length !== 1 || !/^[a-z]$/.test(texto)) {
      return; // Ignorar mensajes que no sean una sola letra
    }

    if (juego.letrasIntentadas.has(texto)) {
      await sock.sendMessage(chatId, { text: `Ya intentaste con la letra "${texto}". Intenta con otra.` });
      return;
    }

    juego.letrasIntentadas.add(texto);

    if (juego.palabra.includes(texto)) {
      for (let i = 0; i < juego.palabra.length; i++) {
        if (juego.palabra[i] === texto) juego.progreso[i] = texto;
      }
    } else {
      juego.errores.push(texto);
      juego.intentos--;
    }

    if (!juego.progreso.includes("_")) {
      await sock.sendMessage(chatId, { text: `🎉 ¡Felicidades! Adivinaste la palabra: *${juego.palabra}*` });
      sock.ev.off("messages.upsert", listener);
      juegos.delete(chatId);
    } else if (juego.intentos <= 0) {
      await sock.sendMessage(chatId, { text: `💀 Perdiste. La palabra era *${juego.palabra}*.` });
      sock.ev.off("messages.upsert", listener);
      juegos.delete(chatId);
    } else {
      await sock.sendMessage(chatId, { text: `Palabra: ${mostrarProgreso(juego)}\nErrores: ${juego.errores.join(", ")}\nIntentos restantes: ${juego.intentos}` });
    }
  };

  juegos.set(chatId, { palabra, progreso: Array(palabra.length).fill("_"), errores: [], intentos: 6, letrasIntentadas: new Set(), listener });
  sock.ev.on("messages.upsert", listener);

  await sock.sendMessage(chatId, { text: `🎮 *Ahorcado iniciado*\n\nPalabra: ${mostrarProgreso(juegos.get(chatId))}\n\nEscribe una letra para intentar.` });

  setTimeout(() => {
    const juego = juegos.get(chatId);
    if (juego) {
      sock.ev.off("messages.upsert", juego.listener);
      juegos.delete(chatId);
      sock.sendMessage(chatId, { text: `⏱️ Tiempo agotado. El juego del ahorcado ha finalizado. La palabra era *${juego.palabra}*.` });
    }
  }, 120000); // 2 minutos de tiempo límite
}
