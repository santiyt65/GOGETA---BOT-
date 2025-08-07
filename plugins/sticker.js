import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default async function (sock, m) {
    const message = m.message;
    const messageType = Object.keys(message)[0];

    const isQuotedImage = messageType === 'extendedTextMessage' && message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;
    const isQuotedVideo = messageType === 'extendedTextMessage' && message.extendedTextMessage.contextInfo?.quotedMessage?.videoMessage;

    const targetMessage = isQuotedImage || isQuotedVideo 
        ? message.extendedTextMessage.contextInfo.quotedMessage 
        : message;

    if (targetMessage.imageMessage || targetMessage.videoMessage) {
        if (targetMessage.videoMessage && targetMessage.videoMessage.seconds > 10) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ El video es muy largo para un sticker. Máximo 10 segundos." });
        }

        await sock.sendMessage(m.key.remoteJid, { text: "⚙️ Creando sticker..." });
        try {
            const buffer = await downloadMediaMessage(targetMessage, "buffer", {});
            await sock.sendMessage(m.key.remoteJid, { sticker: buffer });
        } catch (e) {
            console.error("❌ Error creando sticker:", e);
            await sock.sendMessage(m.key.remoteJid, { text: "❌ No se pudo crear el sticker." });
        }
    } else {
        await sock.sendMessage(m.key.remoteJid, { text: "Responde a una imagen o video con *.sticker* para convertirlo." });
    }
}