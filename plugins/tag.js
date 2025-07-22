// plugins/tag.js

export async function tagCommand(sock, m) {
  const jid = m.key.remoteJid;
  const groupMetadata = await sock.groupMetadata(jid);
  const participantes = groupMetadata.participants;

  const mentions = participantes.map(p => p.id);
  const texto = participantes.map(p => `@${p.id.split("@")[0]}`).join(" ");

  await sock.sendMessage(jid, {
    text: `📢 *Mención a todos los miembros:*\n\n${texto}`,
    mentions
  });
}
