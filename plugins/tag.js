// plugins/tag.js

export default async function (sock, m) {
  const jid = m.key.remoteJid;

  if (!jid.endsWith('@g.us')) {
    return await sock.sendMessage(jid, { text: 'Este comando solo se puede usar en grupos.' });
  }

  const groupMetadata = await sock.groupMetadata(jid);
  const participantes = groupMetadata.participants;

  const mentions = participantes.map(p => p.id);
  const texto = '📢 *Mención a todos los miembros:*\n\n' + participantes.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

  await sock.sendMessage(jid, {
    text: texto,
    mentions
  });
}

