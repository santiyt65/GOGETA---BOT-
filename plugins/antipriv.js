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
