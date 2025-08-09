// plugins/tag.js
import { isAdmin } from '../lib/functions.js';

export default async function (sock, m) {
    const jid = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, { text: 'Este comando solo se puede usar en grupos.' });
    }

    if (m.key.remoteJid.endsWith("@g.us")) {
        const isUserAdmin = await isAdmin(sock, sender, m.key.remoteJid);
        if (!isUserAdmin) {
            return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo los administradores pueden usar este comando." });
        }
    }

    const groupMetadata = await sock.groupMetadata(jid);
    const participantes = groupMetadata.participants;

    const mentions = participantes.map(p => p.id);
    const texto = '📢 *Mención a todos los miembros:*\n\n' + participantes.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

    await sock.sendMessage(jid, {
        text: texto,
        mentions
    });
}
