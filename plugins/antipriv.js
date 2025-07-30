import config from "../config/config.json" assert { type: "json" };
import { guardarConfig } from "../lib/functions.js";
import { owner } from "../config/config.json";

export async function antiprivCommand(sock, m) {
  const command = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
  const from = m.key.remoteJid;
  const sender = m.key.participant || from;

  if (command.trim().toLowerCase() === ".antipriv") {
    const isOwner = owner.includes(sender) || owner.includes(from);

    if (isOwner) {
      config.antiPrivado = !config.antiPrivado;
      guardarConfig();

      const estado = config.antiPrivado ? "activado ✅" : "desactivado ❌";
      await sock.sendMessage(from, { text: `🛡️ AntiPriv ha sido *${estado}*` });
    } else {
      await sock.sendMessage(from, { text: "🚫 Solo el dueño puede usar este comando." });
    }
    return;
  }

  // Bloquear privados si está activado y no es grupo ni dueño
  if (
    config.antiPrivado &&
    !from.endsWith("@g.us") &&
    !owner.includes(from)
  ) {
    await sock.sendMessage(from, {
      text: "🚫 *No acepto mensajes privados.* Contacta por grupo o espera a que te agregue.",
    });
    await sock.updateBlockStatus(from, "block");
  }
}