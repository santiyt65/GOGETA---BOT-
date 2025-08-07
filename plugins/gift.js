import { getUser, saveUser } from '../lib/database.js';

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const recipientJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const characterIndex = parseInt(args[0], 10) - 1;

    if (!recipientJid) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes mencionar al usuario a quien quieres regalar. Ejemplo: *.gift @usuario <número_personaje>*" });
    }

    if (isNaN(characterIndex)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes especificar el número del personaje que quieres regalar. Ejemplo: *.gift @usuario <número_personaje>*" });
    }

    const user = getUser(sender);
    if (characterIndex < 0 || characterIndex >= user.collection.length) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ Número de personaje inválido. Usa *.collection* para verificar los números." });
    }

    const characterToGift = user.collection[characterIndex];
    if (!characterToGift) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ El personaje que intentas regalar no existe en tu colección." });
    }

    const recipient = getUser(recipientJid);

    // Remove the character from the sender's collection
    user.collection.splice(characterIndex, 1);
    saveUser(sender, user);

    // Add the character to the recipient's collection
    recipient.collection.push(characterToGift);
    saveUser(recipientJid, recipient);

    const message = `
🎁 ¡Regalo Enviado! 🎁

*@${sender.split('@')[0]}* ha regalado a *@${recipientJid.split('@')[0]}* el personaje *${characterToGift.name}*.

¡Disfruten sus personajes!
    `.trim();

    await sock.sendMessage(m.key.remoteJid, {
        text: message,
        mentions: [sender, recipientJid]
    });
}