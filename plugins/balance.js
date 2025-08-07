import { getUser } from '../lib/database.js';

export default async function (sock, m) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);

    await sock.sendMessage(m.key.remoteJid, {
        text: `*Balance de @${sender.split('@')[0]}*\n\n💰 Tienes ${user.balance} monedas.`,
        mentions: [sender]
    });
}