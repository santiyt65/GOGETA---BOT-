import { getUser, saveUser } from '../lib/database.js';

// Almacenará las propuestas de intercambio pendientes.
const pendingTrades = {};
const TRADE_TIMEOUT = 120 * 1000; // 2 minutos para aceptar

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const subCommand = args[0]?.toLowerCase();

    // --- Aceptar un intercambio ---
    if (subCommand === 'accept') {
        const trade = pendingTrades[sender];
        if (!trade) {
            return await sock.sendMessage(m.key.remoteJid, { text: "🤷‍♀️ No tienes ninguna propuesta de intercambio pendiente." });
        }

        // Limpiar el timeout para que no se cancele automáticamente
        clearTimeout(trade.timeoutId);

        const initiator = getUser(trade.initiator);
        const target = getUser(sender); // El que acepta

        // Doble verificación por si los personajes fueron vendidos mientras tanto
        if (!initiator.collection[trade.initiatorCharIndex] || !target.collection[trade.targetCharIndex]) {
            delete pendingTrades[sender];
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ Error: Uno de los personajes ya no está disponible. El intercambio ha sido cancelado." });
        }

        // El intercambio
        const initiatorChar = initiator.collection[trade.initiatorCharIndex];
        const targetChar = target.collection[trade.targetCharIndex];

        initiator.collection[trade.initiatorCharIndex] = targetChar;
        target.collection[trade.targetCharIndex] = initiatorChar;

        saveUser(trade.initiator, initiator);
        saveUser(sender, target);

        delete pendingTrades[sender];

        const successText = `
🤝 ¡Intercambio completado! 🤝

*@${trade.initiator.split('@')[0]}* entregó a *${initiatorChar.name}*
*@${sender.split('@')[0]}* entregó a *${targetChar.name}*

¡Disfruten sus nuevos personajes!
        `.trim();

        return await sock.sendMessage(m.key.remoteJid, { text: successText, mentions: [trade.initiator, sender] });
    }

    // --- Rechazar un intercambio ---
    if (subCommand === 'reject') {
        const trade = pendingTrades[sender];
        if (!trade) {
            return await sock.sendMessage(m.key.remoteJid, { text: "🤷‍♀️ No tienes ninguna propuesta de intercambio pendiente." });
        }
        clearTimeout(trade.timeoutId);
        delete pendingTrades[sender];
        return await sock.sendMessage(m.key.remoteJid, { text: `🙅‍♂️ @${sender.split('@')[0]} ha rechazado el intercambio con @${trade.initiator.split('@')[0]}.`, mentions: [sender, trade.initiator] });
    }

    // --- Proponer un intercambio ---
    const targetJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!targetJid) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario con quien quieres intercambiar. Ejemplo:\n*.trade @usuario <tu_nº_personaje> <su_nº_personaje>*" });
    }

    if (targetJid === sender) {
        return await sock.sendMessage(m.key.remoteJid, { text: "🤦‍♂️ No puedes intercambiar contigo mismo." });
    }

    const initiatorCharIndex = parseInt(args[0], 10) - 1;
    const targetCharIndex = parseInt(args[1], 10) - 1;

    if (isNaN(initiatorCharIndex) || isNaN(targetCharIndex)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Formato incorrecto. Ejemplo:\n*.trade @usuario <tu_nº_personaje> <su_nº_personaje>*" });
    }

    const initiator = getUser(sender);
    const target = getUser(targetJid);

    if (initiatorCharIndex < 0 || initiatorCharIndex >= initiator.collection.length || targetCharIndex < 0 || targetCharIndex >= target.collection.length) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ Número de personaje inválido. Usa *.collection* para verificar los números." });
    }

    const initiatorChar = initiator.collection[initiatorCharIndex];
    const targetChar = target.collection[targetCharIndex];

    // Crear la propuesta de intercambio
    const timeoutId = setTimeout(() => {
        if (pendingTrades[targetJid]) {
            delete pendingTrades[targetJid];
            sock.sendMessage(m.key.remoteJid, { text: `⏳ El tiempo para el intercambio ha expirado.`, mentions: [sender, targetJid] });
        }
    }, TRADE_TIMEOUT);

    pendingTrades[targetJid] = { initiator: sender, initiatorCharIndex, targetCharIndex, timeoutId };

    const proposalText = `
🔄 *Propuesta de Intercambio* 🔄

*@${sender.split('@')[0]}* quiere intercambiar su personaje:
➤ *${initiatorChar.name}* (${initiatorChar.rarity})

Por tu personaje:
➤ *${targetChar.name}* (${targetChar.rarity})

*@${targetJid.split('@')[0]}*, tienes 2 minutos para responder con *.trade accept* o *.trade reject*.
    `.trim();

    await sock.sendMessage(m.key.remoteJid, { text: proposalText, mentions: [sender, targetJid] });
}