import { getUser, saveUser } from './database.js';

export const achievementsData = {
    "PRIMER_PERSONAJE": { description: "Reclama tu primer personaje.", reward: 50 },
    "COLECCIONISTA_NOVATO": { description: "Obtén 10 personajes en tu colección.", reward: 100 },
    "VENDEDOR_ESTRELLA": { description: "Vende 5 personajes en el mercado.", reward: 150 },
    "COMERCIANTE_HÁBIL": { description: "Realiza 3 intercambios exitosos.", reward: 200 },
    "RUTINA_DIARIA": { description: "Reclama la recompensa diaria 3 días seguidos.", reward: 250 },
    "MAGNATE": { description: "Alcanza un balance de 10,000 monedas.", reward: 500 }
};

export async function grantAchievement(sock, jid, achievementId) {
    const user = getUser(jid);

    if (user.achievements.includes(achievementId)) {
        return; // El usuario ya tiene este logro.
    }

    const achievement = achievementsData[achievementId];
    if (!achievement) return;

    user.achievements.push(achievementId);
    if (achievement.reward) {
        user.balance += achievement.reward;
    }
    saveUser(jid, user);

    let message = `🏆 ¡Nuevo Logro Desbloqueado! 🏆\n\n*${achievementId.replace(/_/g, ' ')}*: ${achievement.description}`;
    if (achievement.reward) {
        message += `\n\n*Recompensa:* ${achievement.reward} 💰`;
    }

    await sock.sendMessage(jid, {
        text: message,
        mentions: [jid]
    });
}

export async function checkAchievements(sock, jid) {
    const user = getUser(jid);

    // Logros basados en estado actual
    if (user.collection.length >= 1 && !user.achievements.includes("PRIMER_PERSONAJE")) {
        await grantAchievement(sock, jid, "PRIMER_PERSONAJE");
    }

    if (user.collection.length >= 10 && !user.achievements.includes("COLECCIONISTA_NOVATO")) {
        await grantAchievement(sock, jid, "COLECCIONISTA_NOVATO");
    }

    if (user.balance >= 10000 && !user.achievements.includes("MAGNATE")) {
        await grantAchievement(sock, jid, "MAGNATE");
    }

    // Otros logros como VENDEDOR_ESTRELLA, COMERCIANTE_HÁBIL, etc.,
    // deberían ser verificados directamente en sus respectivos comandos (sell, trade)
    // para un control más preciso.
}