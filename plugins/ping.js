export default async function (sock, m) {
  const startTime = Date.now();
  // Enviamos un mensaje de "Pong!" para medir el tiempo de respuesta.
  await sock.sendMessage(m.key.remoteJid, { text: '🏓 Pong!' });
  const endTime = Date.now();
  await sock.sendMessage(m.key.remoteJid, { text: `*Latencia:* ${endTime - startTime}ms` });
}