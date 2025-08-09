import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default async function (sock, m) {
    // The message object that contains the media.
    // It can be the current message 'm' or the message it's replying to.
    let messageToProcess = m;

    // Check if the message is a reply (extendedTextMessage) and has a quoted message.
    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quotedMessage) {
        // If it's a reply, we need to build a temporary WAMessage object
        // for the quoted message to pass to downloadMediaMessage.
        messageToProcess = {
            key: {
                remoteJid: m.key.remoteJid,
                id: m.message.extendedTextMessage.contextInfo.stanzaId,
                participant: m.message.extendedTextMessage.contextInfo.participant,
            },
            message: quotedMessage
        };
    }

    // Extract the actual media message (image or video) from the message to process.
    const mediaContent = messageToProcess.message?.imageMessage || messageToProcess.message?.videoMessage;

    if (mediaContent) {
        // Check video duration
        if (mediaContent.seconds && mediaContent.seconds > 10) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ El video es muy largo para un sticker. Máximo 10 segundos." });
        }

        await sock.sendMessage(m.key.remoteJid, { text: "⚙️ Creando sticker..." });
        try {
            const buffer = await downloadMediaMessage(messageToProcess, "buffer", {});
            await sock.sendMessage(m.key.remoteJid, { sticker: buffer });
        } catch (e) {
            console.error("❌ Error creando sticker:", e);
            await sock.sendMessage(m.key.remoteJid, { text: "❌ No se pudo crear el sticker." });
        }
    } else {
        await sock.sendMessage(m.key.remoteJid, { text: "Responde a una imagen o video con *.sticker* para convertirlo." });
    }
}