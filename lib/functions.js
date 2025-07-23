import fs from "fs";
import { owner, configFile } from "../config.js"; // Ajusta el path si es diferente

let plugins = {};
let config = JSON.parse(fs.readFileSync(configFile));
let antiPrivado = config.antiPrivado;

// Guardar configuración persistente
function guardarConfig() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

export async function handleCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const command = body.trim().toLowerCase();

  // Recargar plugins si aún no están cargados
  if (Object.keys(plugins).length === 0) {
    plugins = await cargarPlugins();
  }

  try {
    // ✅ Bloqueo automático si está activado y es privado
    if (
      antiPrivado &&
      !m.key.remoteJid.endsWith("@g.us") &&
      !owner.includes(m.key.remoteJid)
    ) {
      await sock.sendMessage(m.key.remoteJid, {
        text: "🚫 *No acepto mensajes privados.* Contacta por grupo o espera a que te agregue.",
      });
      await sock.updateBlockStatus(m.key.remoteJid, "block");
      return;
    }

    // ✅ Comando .ping
    if (command === ".ping") {
      await sock.sendMessage(m.key.remoteJid, { text: "🏓 ¡Pong! Gogeta-Bot activo." });

    // ✅ Comando .menu
    } else if (command === ".menu") {
      await plugins.menuCommand(sock, m);

    // ✅ Comando .info
    } else if (command === ".info") {
      await sock.sendMessage(m.key.remoteJid, {
        text: "🤖 *Gogeta - Bot*\nCreado por NICOLAS\nUrl: Servida por Chat GPT\nVersión inicial"
      });

    // ✅ Comando .juegos
    } else if (command === ".juegos") {
      await sock.sendMessage(m.key.remoteJid, {
        text: "🎮 *JUEGOS DISPONIBLES*\n\n1. .adivina\n2. .ppt\n3. .ahorcado\n4. .trivia\n5. .matemática"
      });

    // ✅ Comando .adivina
    } else if (command === ".adivina") {
      await plugins.adivinaCommand(sock, m);

    // ✅ Comando .tag
    } else if (command === ".tag") {
      await plugins.tagCommand(sock, m);

    // ✅ Comando .update
    } else if (command === ".update") {
      plugins = await cargarPlugins();
      await sock.sendMessage(m.key.remoteJid, { text: "🔄 Plugins recargados con éxito." });

    // ✅ Comando .antipriv (solo para el dueño)
    } else if (command === ".antipriv") {
      const isOwner = owner.includes(m.key.remoteJid) || owner.includes(m.key.participant);
      if (isOwner) {
        config.antiPrivado = !config.antiPrivado;
        antiPrivado = config.antiPrivado;
        guardarConfig();

        const estado = antiPrivado ? "activado ✅" : "desactivado ❌";
        await sock.sendMessage(m.key.remoteJid, { text: `🛡️ AntiPriv ha sido *${estado}*` });
      } else {
        await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo el dueño puede usar este comando." });
      }
    }

  } catch (err) {
    console.error("❌ Error ejecutando el comando:", err);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Error al ejecutar el comando." });
  }
}

// 🔄 Función para cargar dinámicamente los plugins
async function cargarPlugins() {
  try {
    const { adivinaCommand } = await import(`../plugins/adivina.js?update=${Date.now()}`);
    const { tagCommand } = await import(`../plugins/tag.js?update=${Date.now()}`);
    const { menuCommand } = await import(`../plugins/menu.js?update=${Date.now()}`);
    return { adivinaCommand, tagCommand, menuCommand };
  } catch (e) {
    console.error("❌ Error al cargar plugins:", e);
    return {};
  }
}
