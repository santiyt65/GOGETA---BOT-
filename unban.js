// plugins/unban.js

export default async function (sock, m, args) {
  const sender = m.key.participant || m.key.remoteJid;
  const userToUnban = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  if (!userToUnban) {
    return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario que quieres readmitir. Ejemplo: *.unban @usuario*" });
  }

  if (m.key.remoteJid.endsWith("@g.us")) {
    const isUserAdmin = await isAdmin(sock, sender, m.key.remoteJid);
    if (!isUserAdmin) {
      return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo los administradores pueden usar este comando." });
    }
  }

  // Readmitir al usuario (código para readmitir al usuario)
  await sock.sendMessage(m.key.remoteJid, { text: `@${userToUnban.split('@')[0]} ha sido readmitido al grupo.`, mentions: [userToUnban] });
}

// En tu archivo lib/functions.js, asegúrate de tener la función isAdmin (como se mencionó anteriormente)