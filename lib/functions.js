import fs from "fs";
import { exec } from "child_process";
import { owner, configFile } from "../config.js";

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

  if (Object.keys(plugins).length === 0) {
    plugins = await cargarPlugins();
  }

  try {
    // 🚫 Bloqueo de mensajes privados
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
        text: "🤖 *Gogeta - Bot*\nCreado por NICOLAS\nRepositorio: github.com/santiyt65/GOGETA---BOT-\nVersión actualizada"
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

    // 🔄 Comando .update (recarga plugins sin reiniciar)
    } else if (command === ".update") {
      plugins = await cargarPlugins();
      await sock.sendMessage(m.key.remoteJid, { text: "🔄 Plugins recargados con éxito." });

    // 🛡️ Comando .antipriv (activar/desactivar)
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

    // ✅ Comando .actualizar desde GitHub
    } else if (command === ".actualizar") {
      const isOwner = owner.includes(m.key.remoteJid) || owner.includes(m.key.participant);
      if (!isOwner) {
        await sock.sendMessage(m.key.remoteJid, { text: "🚫 Solo el dueño puede usar este comando." });
        return;
      }

      await sock.sendMessage(m.key.remoteJid, {
        text: "📥 Descargando la última versión desde GitHub...",
      });

      const repoURL = "https://github.com/santiyt65/GOGETA---BOT-.git";
      const folderTemp = "actualizacion_temp";

      const comando = `
        rm -rf ${folderTemp} &&
        git clone ${repoURL} ${folderTemp} &&
        cp -r ${folderTemp}/* ./ &&
        rm -rf ${folderTemp}
      `;

      exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error durante la actualización:", error);
          sock.sendMessage(m.key.remoteJid, {
            text: `⚠️ Error al actualizar desde GitHub:\n${error.message}`,
          });
          return;
        }

        console.log("✅ Actualización completada:", stdout || stderr);
        sock.sendMessage(m.key.remoteJid, {
          text: "✅ Bot actualizado correctamente desde GitHub.\n♻️ Reiniciando...",
        });

        setTimeout(() => process.exit(0), 2000);
      });
    }

  } catch (err) {
    console.error("❌ Error ejecutando el comando:", err);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Error al ejecutar el comando." });
  }
}

// 🔁 Función para cargar plugins dinámicamente
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

