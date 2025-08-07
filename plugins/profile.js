import { getUser } from '../lib/database.js';

function getRank(balance) {
    if (balance < 500) return "Novato 🥉";
    if (balance < 2000) return "Coleccionista 🥈";
    if (balance < 10000) return "Maestro 🥇";
    if (balance < 50000) return "Magnate 💎";
    return "Leyenda 👑";
}

export default async function (sock, m) {
    const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const targetJid = mentionedJid || m.key.participant || m.key.remoteJid;
    
    const user = getUser(targetJid);
    const collectionValue = user.collection.reduce((sum, char) => sum + char.value, 0);
    const totalWealth = user.balance + collectionValue;
    const rank = getRank(totalWealth);

    const profileText = `
👤 *Perfil de @${targetJid.split('@')[0]}* 👤

*Rango:* ${rank}
*Nivel:* ${user.level}
*XP:* ${user.xp}
-----------------------------------
💰 *Monedas:* ${user.balance}

🖼️ *Personajes en Colección:* ${user.collection.length}
💎 *Valor de la Colección:* ${collectionValue}

👑 *Riqueza Total (Monedas + Valor):* ${totalWealth}
-----------------------------------
Usa *.collection* para ver tus personajes.
    `.trim();

    await sock.sendMessage(m.key.remoteJid, {
        text: profileText,
        mentions: [targetJid]
    });
}