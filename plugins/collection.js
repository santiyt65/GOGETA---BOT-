import { getUser } from '../lib/database.js';

export default async function (sock, m) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);

    if (user.collection.length === 0) {
        await sock.sendMessage(m.key.remoteJid, { text: "📭 Tu colección está vacía. Usa *.claim* para obtener tu primer personaje." });
        return;
    }

    let collectionText = `*---  collezione di @${sender.split('@')[0]} ---*\n\n`;
    user.collection.forEach((char, index) => {
        collectionText += `*${index + 1}.* ${char.name} (*${char.rarity}*) - Valor: ${char.value} 💰\n`;
    });
    collectionText += `\nPara vender un personaje, usa *.sell <número>*`;

    await sock.sendMessage(m.key.remoteJid, {
        text: collectionText,
        mentions: [sender]
    });
}