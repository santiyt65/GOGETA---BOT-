import fs from "fs";
import { exec } from "child_process";
import path from "path";

const configFile = path.resolve("./config/config.json");
let config = JSON.parse(fs.readFileSync(configFile));
let antiPrivado = config.antiPrivado;

let plugins = {};

function guardarConfig() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

export async function handleCommand(sock, m) {
  const body = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
  const buttonResponse = m.message?.buttonsResponseMessage?.selectedButtonId || "";
  const commandRaw = buttonResponse || body.trim();
  const command = commandRaw.toLowerCase();

  if (Object.keys(plugins).length === 0) {
    plugins = await cargarPlugins();
  }

  try {
    const isOwner = owner.includes(m.key.remoteJid) || owner.includes(m.key.participant);

    if (
      antiPrivado &&
      !m.key.remoteJid.endsWith("@g.us") &&
      !isOwner
    ) {
      await sock.sendMessage(m.key.remoteJid, {
        text: "🚫 *No acepto mensajes privados.* Contacta por grupo o espera a que te agregue.",
      });
      await sock.updateBlockStatus(m.key.remoteJid, "block");
      return;
    }

    // [ ... Tu código de comandos aquí sin cambios ... ]

  } catch (err) {
    console.error("❌ Error ejecutando el comando:", err);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Error al ejecutar el comando." });
  }
}

async function cargarPlugins() {
  const modules = [
    "adivina",
    "ppt",
    "tag",
    "ahorcado",
    "trivia",
    "matematica",
    "pinterest",
    "femboy"
  ];

  const loaded = {};
  for (const mod of modules) {
    try {
      const plugin = await import(`../plugins/${mod}.js`);
      const funcName = `${mod}Command`;
      if (plugin[funcName]) {
        loaded[funcName] = plugin[funcName];
      } else {
        console.warn(`⚠️ El plugin '${mod}' no exporta la función '${funcName}'`);
      }
    } catch (e) {
      console.error(`❌ Error al cargar plugin '${mod}':`, e.message);
    }
  }

  return loaded;
}