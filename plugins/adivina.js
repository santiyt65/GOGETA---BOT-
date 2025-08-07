// plugins/adivina.js

const partidas = new Map();

export default async function (sock, m) {
  const jid = m.key.remoteJid;

  if (partidas.has(jid)) {
    await sock.sendMessage(jid, { text: "🎲 Ya hay una partida activa. Escribí un número del 1 al 10 para adivinar." });
    return;
  }
  
  const numeroSecreto = Math.floor(Math.random() * 10) + 1;
  
  const listener = async ({ messages }) => {
    // Solo procesar mensajes del mismo chat y que no sean del bot
    const mensaje = messages[0];
    if (!mensaje.message || mensaje.key.fromMe || mensaje.key.remoteJid !== jid) return;

    const texto = mensaje.message.conversation || mensaje.message.extendedTextMessage?.text || "";
    const intento = parseInt(texto.trim());

    // Ignorar si no es un número para no ser muy "ruidoso" en el chat
    if (isNaN(intento)) return;

    const juego = partidas.get(jid);
    if (intento === juego.numeroSecreto) {
      await sock.sendMessage(jid, { text: `🎉 ¡Correcto! El número era *${juego.numeroSecreto}*.` });
      // Limpieza: se elimina el oyente y se borra el estado del juego
      sock.ev.off("messages.upsert", juego.listener);
      partidas.delete(jid);
    } else {
      await sock.sendMessage(jid, { text: "❌ Incorrecto. Intentá otra vez." });
    }
  };

  // Guardar el estado del juego junto con la función del oyente para poder eliminarla después
  partidas.set(jid, { numeroSecreto, listener });

  // Registrar el oyente
  sock.ev.on("messages.upsert", listener);

  await sock.sendMessage(jid, {
    text: "🎯 ¡Estoy pensando en un número del 1 al 10!\nEscribí tu respuesta..."
  });
}
