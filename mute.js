// plugins/mute.js

export default async function (sock, m, args) {
  const sender = m.key.participant || m.key.remoteJid;
  const userToMute = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  if (!userToMute) {
    return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario que quieres silenciar. Ejemplo: *.mute @usuario*" });
  }

  if (m.key.remoteJid.endsWith("@g.us")) {
    const isUserAdmin = await isAdmin(sock, sender, m.key.remoteJid);
    if (!isUserAdmin) {
      return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo los administradores pueden usar este comando." });
    }
  }

  // Silenciar al usuario (código para silenciar al usuario)
  await sock.sendMessage(m.key.remoteJid, { text: `@${userToMute.split('@')[0]} ha sido silenciado.`, mentions: [userToMute] });
}

// En tu archivo lib/functions.js, asegúrate de tener la función isAdmin (como se mencionó anteriormente)