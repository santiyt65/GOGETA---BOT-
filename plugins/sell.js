import { getUser, saveUser } from '../lib/database.js';
import { checkAchievements } from '../lib/achievements.js';
import { addXP, checkLevelUp } from '../lib/leveling.js';
import classData from '../classes.json' assert { type: 'json' };

const VENTA_MINIMA_PARA_LOGRO = 5;

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);
    const indexToSell = parseInt(args[0], 10) - 1;

    if (isNaN(indexToSell) || indexToSell < 0 || indexToSell >= user.collection.length) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ Número de personaje inválido. Usa *.collection* para ver los números correctos." });
    }

    const [soldCharacter] = user.collection.splice(indexToSell, 1);
    let saleValue = soldCharacter.value;
    let bonusMessage = "";

    // Aplicar bonus de clase "Luchador"
    if (soldCharacter.class && classData[soldCharacter.class]?.bonus.type === 'SELL_VALUE_INCREASE') {
        const bonus = classData[soldCharacter.class].bonus.value;
        const bonusAmount = Math.floor(saleValue * bonus);
        saleValue += bonusAmount;
        bonusMessage = `\n✨ ¡Bonus de clase *${soldCharacter.class}*! +${bonusAmount} monedas.`;
    }

    user.balance += saleValue;
    saveUser(sender, user);

    addXP(sender, 25);
    await checkLevelUp(sock, sender);

    const message = `✅ ¡Venta exitosa!

Vendiste a *${soldCharacter.name}* por ${saleValue} monedas.${bonusMessage}

Tu nuevo balance es: ${user.balance} 💰
    `.trim();

    await sock.sendMessage(m.key.remoteJid, { text: message });
}