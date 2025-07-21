// plugins/adivina.js

const partidas = new Map();

export async function adivinaCommand(sock, m) {
  const jid = m.key.remoteJid;

  if (partidas.has(jid)) {
    await sock.sendMessage(jid, { text: "🎲 Ya hay una partida activa. Escribí un número del 1 al 10 para adivinar." });
    return;
  }

  const numeroSecreto = Math.floor(Math.random() * 10) + 1;
  partidas.set(jid, numeroSecreto);

  await sock.sendMessage(jid, {
    text: "🎯 ¡Estoy pensando en un número del 1 al 10!\nEscribí tu respuesta..."
  });

  // Esperar mensajes del usuario
  const listener = async ({ messages }) => {
    const mensaje = messages[0];
    if (!mensaje.message || mensaje.key.fromMe || mensaje.key.remoteJid !== jid) return;

    const texto = mensaje.message.conversation || mensaje.message.extendedTextMessage?.text || "";
    const intento = parseInt(texto.trim());

    if (isNaN(intento)) {
      await sock.sendMessage(jid, { text: "❌ Eso no es un número. Intentá de nuevo." });
      return;
    }

    const numero = partidas.get(jid);
    if (intento === numero) {
      await sock.sendMessage(jid, { text: `🎉 ¡Correcto! El número era *${numero}*.` });
      partidas.delete(jid);
      sock.ev.off("messages.upsert", listener);
    } else {
      await sock.sendMessage(jid, { text: "❌ Incorrecto. Intentá otra vez." });
    }
  };

  sock.ev.on("messages.upsert", listener);
}
