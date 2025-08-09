// plugins/formarpareja.js

export default async function (sock, m) {
  const jid = m.key.remoteJid;

  if (!jid.endsWith('@g.us')) {
    return await sock.sendMessage(jid, { text: 'Este comando solo se puede usar en grupos.' });
  }

  const groupMetadata = await sock.groupMetadata(jid);
  const participantes = groupMetadata.participants.filter(p => p.id !== sock.user.id);

  if (participantes.length < 2) {
    return await sock.sendMessage(jid, { text: 'No hay suficientes miembros en el grupo para formar parejas.' });
  }

  // Mezclar los participantes aleatoriamente
  for (let i = participantes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participantes[i], participantes[j]] = [participantes[j], participantes[i]];
  }

  let parejas = [];
  for (let i = 0; i < participantes.length; i += 2) {
    const miembro1 = participantes[i];
    const miembro2 = participantes[i + 1] || participantes[0]; // Si hay un número impar, el último se empareja con el primero
    parejas.push(`@${miembro1.id.split("@")[0]} ❤️ @${miembro2.id.split("@")[0]}`);
  }

  const texto = '🎉 *Parejas formadas aleatoriamente:*\n\n' + parejas.join("\n");

  const mentions = participantes.map(p => p.id);

  await sock.sendMessage(jid, {
    text: texto,
    mentions
  });
}