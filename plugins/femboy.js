export const command = ['femboy'];
export const description = 'Elige al femboy del grupo al azar';

export async function handler(sock, m, args, { participants, isGroup, sender }) {
  if (!isGroup) {
    await sock.sendMessage(m.chat, { text: '❌ Este comando solo funciona en grupos.' });
    return;
  }

  const miembros = participants.filter(p => !p.admin && p.id !== sock.user.id);
  if (miembros.length === 0) {
    await sock.sendMessage(m.chat, { text: '😔 No hay suficientes miembros para elegir un femboy.' });
    return;
  }

  const elegido = miembros[Math.floor(Math.random() * miembros.length)];

  const frases = [
    '🌈 @usuario fue elegido como el femboy del grupo hoy. ¡Felicidades, princesa! 💅',
    '💖 Atención: @usuario es oficialmente el femboy del día. ¡No lo arruines! 😘',
    '✨ @usuario, tu energía femenina es imparable hoy. ¡Deslumbra, reina! 👠',
    '😳 @usuario... no hay duda, hoy sos el femboy. ¡A lucirse! 🌸',
    '💋 Con un toque de glamour, @usuario fue coronado como el femboy supremo. 💫'
  ];

  const frase = frases[Math.floor(Math.random() * frases.length)].replace('@usuario', `@${elegido.id.split('@')[0]}`);

  await sock.sendMessage(m.chat, {
    text: frase,
    mentions: [elegido.id]
  });
}
