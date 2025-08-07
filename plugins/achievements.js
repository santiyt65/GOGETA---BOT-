import { getUser } from '../lib/database.js';
import { achievementsData } from '../lib/achievements.js';

export default async function (sock, m) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);

    if (user.achievements.length === 0) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Aún no has desbloqueado ningún logro. ¡Sigue jugando!" });
    }

    let achievementsText = "🏆 *Tus Logros* 🏆\n\n";
    user.achievements.forEach(achievementId => {
        const achievement = achievementsData[achievementId];
        achievementsText += `*${achievementId}*: ${achievement.description}\n`;
    });

    await sock.sendMessage(m.key.remoteJid, {
        text: achievementsText,
        mentions: [sender]
    });
}