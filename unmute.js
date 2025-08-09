// plugins/unmute.js

export default async function (sock, m, args) {
  const sender = m.key.participant || m.key.remoteJid;
  const userToUnmute = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  if (!userToUnmute) {
    return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario que quieres activar el audio. Ejemplo: *.unmute @usuario*" });
  }

  if (m.key.remoteJid.endsWith("@g.us")) {
    const isUserAdmin = await isAdmin(sock, sender, m.key.remoteJid);
    if (!isUserAdmin) {
      return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo los administradores pueden usar este comando." });
    }
  }

  // Activar el audio del usuario (código para activar el audio del usuario)
  await sock.sendMessage(m.key.remoteJid, { text: `@${userToUnmute.split('@')[0]} se le ha activado el audio.`, mentions: [userToUnmute] });
}

// En tu archivo lib/functions.js, asegúrate de tener la función isAdmin (como se mencionó anteriormente)