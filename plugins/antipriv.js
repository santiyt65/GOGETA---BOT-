import { config, saveConfig } from "../lib/functions.js";
import { owner } from "../config.js";

export default async function (sock, m) {
  const sender = m.key.participant || m.key.remoteJid;
  const isOwner = owner.some(o => sender.startsWith(o.replace(/[\s-]/g, '')));

  if (!isOwner) {
    return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo el dueño puede usar este comando." });
  }

  // Cambiar el estado
  config.antiPrivado = !config.antiPrivado;
  saveConfig(); // Guardar la nueva configuración

  const estado = config.antiPrivado ? "activado ✅" : "desactivado ❌";
  await sock.sendMessage(m.key.remoteJid, { text: `🛡️ La función Anti-Privado ha sido *${estado}*.` });
}