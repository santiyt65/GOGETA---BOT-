if (command === ".antipriv") {
  const isOwner = owner.includes(m.key.participant) || owner.includes(m.key.remoteJid);
  
  if (isOwner) {
    config.antiPrivado = !config.antiPrivado;
    antiPrivado = config.antiPrivado;
    guardarConfig();

    const estado = antiPrivado ? "activado ✅" : "desactivado ❌";
    await sock.sendMessage(m.key.remoteJid, { text: `🛡️ AntiPriv ha sido *${estado}*` });
  } else {
    await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo el dueño puede usar este comando." });
  }
  return;
}
if (antiPrivado && !m.key.remoteJid.endsWith("@g.us") && !owner.includes(m.key.remoteJid)) {
  await sock.sendMessage(m.key.remoteJid, {
    text: "🚫 *No acepto mensajes privados.* Contacta por grupo o espera a que te agregue.",
  });
  await sock.updateBlockStatus(m.key.remoteJid, "block");
  return;
}
