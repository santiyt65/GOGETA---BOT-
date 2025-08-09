// plugins/ban.js

export default async function (sock, m, args) {
  const sender = m.key.participant || m.key.remoteJid;
  const userToBan = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  if (!userToBan) {
    return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario que quieres expulsar. Ejemplo: *.ban @usuario*" });
  }

  if (m.key.remoteJid.endsWith("@g.us")) {
    const isUserAdmin = await isAdmin(sock, sender, m.key.remoteJid);
    if (!isUserAdmin) {
      return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo los administradores pueden usar este comando." });
    }
  }

  // Expulsar al usuario (código para expulsar al usuario)
  await sock.sendMessage(m.key.remoteJid, { text: `@${userToBan.split('@')[0]} ha sido expulsado del grupo.`, mentions: [userToBan] });
}

// En tu archivo lib/functions.js, asegúrate de tener la función isAdmin (como se mencionó anteriormente)