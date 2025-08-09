export default async function(sock, m) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length < 2) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar a dos personas para calcular su compatibilidad.\nEjemplo: `.ship @usuario1 @usuario2`" });
    }

    const user1 = mentioned[0];
    const user2 = mentioned[1];
    const name1 = user1.split('@')[0];
    const name2 = user2.split('@')[0];

    const shipName = name1.slice(0, Math.ceil(name1.length / 2)) + name2.slice(Math.floor(name2.length / 2));
    const percentage = Math.floor(Math.random() * 101);

    let message = `💖 *Calculadora de Amor* 💖\n\n`;
    message += `La compatibilidad entre @${name1} y @${name2} es del *${percentage}%*.\n`;
    message += `Su nombre de ship podría ser: *${shipName}*.\n\n`;

    if (percentage < 20) {
        message += "💔 Mejor que sigan siendo amigos...";
    } else if (percentage < 50) {
        message += "🤔 Hay potencial, pero se necesita trabajo.";
    } else if (percentage < 80) {
        message += "😍 ¡Una pareja prometedora!";
    } else {
        message += "💍 ¡Están destinados a estar juntos! ¡Que suene la marcha nupcial!";
    }

    await sock.sendMessage(m.key.remoteJid, {
        text: message,
        mentions: [user1, user2]
    });
}