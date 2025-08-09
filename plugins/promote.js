import { isAdmin } from '../lib/functions.js';

export default async function(sock, m, args) {
  // 1. Verificar si el comando se usa en un grupo
  if (!m.key.remoteJid.endsWith("@g.us")) {
    return await sock.sendMessage(m.key.remoteJid, { text: "Este comando solo se puede usar en grupos." });
  }

  const groupId = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;

  // 2. Verificar si el que envía el comando es admin
  const isSenderAdmin = await isAdmin(sock, groupId, sender);
  if (!isSenderAdmin) {
    return await sock.sendMessage(groupId, { text: "🚫 Solo los administradores pueden usar este comando." });
  }

  // 3. Verificar si el bot es admin
  const botId = sock.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
  const isBotAdmin = await isAdmin(sock, groupId, botId);
  if (!isBotAdmin) {
      return await sock.sendMessage(groupId, { text: "🤖 Necesito ser administrador para poder ascender a otros." });
  }

  // 4. Obtener el usuario a ascender (desde la mención)
  const userToPromote = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!userToPromote) {
    return await sock.sendMessage(groupId, { text: "Debes mencionar al usuario que quieres ascender. Ejemplo: `.promote @usuario`" });
  }

  // 5. Ejecutar la promoción
  try {
    await sock.groupParticipantsUpdate(
      groupId,
      [userToPromote],
      "promote"
    );
    await sock.sendMessage(groupId, { text: `✅ @${userToPromote.split('@')[0]} ahora es administrador.`, mentions: [userToPromote] });
  } catch (error) {
    console.error("Error en el comando .promote:", error);
    await sock.sendMessage(groupId, { text: "❌ Ocurrió un error al intentar ascender al usuario." });
  }
}