import { getUser, saveUser } from '../lib/database.js';

const DAILY_REWARD = 200; // Monedas que se dan como recompensa diaria
const COOLDOWN = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export default async function (sock, m) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);
    const now = Date.now();

    if (now - user.lastDaily < COOLDOWN) {
        const timeLeft = new Date(user.lastDaily + COOLDOWN - now).toISOString().substr(11, 8);
        await sock.sendMessage(m.key.remoteJid, { text: `⏳ Debes esperar ${timeLeft} para reclamar tu recompensa diaria.` });
        return;
    }

    user.balance += DAILY_REWARD;
    user.lastDaily = now;
    saveUser(sender, user);

    const message = `
🎁 ¡Recompensa Diaria Reclamada! 🎁

Has recibido ${DAILY_REWARD} monedas.

Tu nuevo balance es: ${user.balance} 💰
    `.trim();

    await sock.sendMessage(m.key.remoteJid, {
        text: message,
        mentions: [sender]
    });
}