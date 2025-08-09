export default async function(sock, m) {
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.key.participant || m.key.remoteJid;
    const percentage = Math.floor(Math.random() * 101);
    const targetName = `@${target.split('@')[0]}`;

    let message = `🏳️‍🌈 *Calculadora de Homosexualidad* 🏳️‍🌈\n\n`;
    message += `El nivel de homosexualidad de ${targetName} es del *${percentage}%*.\n\n`;

    if (percentage < 10) {
        message += "Hmm, bastante hetero.";
    } else if (percentage < 40) {
        message += "Se nota una ligera curiosidad... 😏";
    } else if (percentage < 70) {
        message += "¡Le gustan los hombres! 🕺";
    } else if (percentage < 90) {
        message += "¡Super gay! 💅";
    } else {
        message += "¡Nivel de homosexualidad legendario! 👑";
    }

    await sock.sendMessage(m.key.remoteJid, {
        text: message,
        mentions: [target]
    });
}