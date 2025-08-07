import { getUser, saveUser } from './database.js';

function getRequiredXP(level) {
    return level * 100;
}

export async function checkLevelUp(sock, jid) {
    const user = getUser(jid);
    const requiredXP = getRequiredXP(user.level);

    if (user.xp >= requiredXP) {
        user.level++;
        user.xp -= requiredXP;
        saveUser(jid, user);

        sock.sendMessage(jid, {
            text: `
🎉 ¡Subiste de Nivel! 🎉

¡Felicidades @${jid.split('@')[0]}! Ahora eres nivel ${user.level}.
            `.trim(),
            mentions: [jid]
        });
    }
}

export function addXP(jid, xp) {
    const user = getUser(jid);
    user.xp += xp;
    saveUser(jid, user); // Guarda la XP ganada
}