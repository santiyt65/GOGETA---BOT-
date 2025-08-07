import { getDatabase } from '../lib/database.js';

export default async function (sock, m) {
    const db = getDatabase();
    const users = Object.entries(db);

    if (users.length === 0) {
        await sock.sendMessage(m.key.remoteJid, { text: "Aún no hay datos en el ranking." });
        return;
    }

    // Ordenar usuarios por balance
    users.sort(([, a], [, b]) => b.balance - a.balance);

    let leaderboardText = "🏆 *Top 5 - Ranking de Riqueza* 🏆\n\n";
    const topUsers = users.slice(0, 5);

    topUsers.forEach(([jid, data], index) => {
        leaderboardText += `*${index + 1}.* @${jid.split('@')[0]} - ${data.balance} 💰\n`;
    });

    await sock.sendMessage(m.key.remoteJid, { text: leaderboardText, mentions: topUsers.map(([jid]) => jid) });
}