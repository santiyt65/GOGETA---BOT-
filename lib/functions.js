import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { owner } from "../config.js";

const GACHA_COOLDOWN = 5 * 1000; // 5 segundos de cooldown

const configFile = path.resolve("./config/config.json");
// Cargar la configuración. Asegurarse de que el archivo exista.
if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, JSON.stringify({ antiPrivado: false }, null, 2));
export let config = JSON.parse(fs.readFileSync(configFile));

export function saveConfig() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}


export async function handleCommand(sock, m, plugins) {
  const body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    "";
  
  if (!body || m.key.fromMe) return;

  // Manejo especial para respuestas de botones de juegos interactivos
  const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId;
  if (buttonId && buttonId.startsWith("trivia_")) {
      if (plugins.trivia) {
          return await plugins.trivia(sock, m, []); // Llama directamente al plugin de trivia
      }
  }

  const prefix = "."; // Define tu prefijo
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const sender = m.key.participant || m.key.remoteJid;
  try {
      //Cooldown functionality - prevents spam
      if (isGachaCommand(command) && isOnCooldown(sender, command)) {
           return;  // Exit if command is on cooldown
      }

    const isOwner = owner.some(o => sender.startsWith(o.replace(/[\s-]/g, '')));

    if (
      config.antiPrivado &&
      !m.key.remoteJid.endsWith("@g.us") &&
      !isOwner
    ) {
      await sock.sendMessage(m.key.remoteJid, {
        text: "🚫 *No acepto mensajes privados.* Contacta por grupo o espera a que te agregue.",
      });
      await sock.updateBlockStatus(m.key.remoteJid, "block");
      return;
    }

    const plugin = plugins[command];
    if (plugin) {
      await plugin(sock, m, args);
    }

    //Record command usage for cooldown
     recordCommandUsage(sender, command);

  } catch (err) {
    console.error("❌ Error ejecutando el comando:", err);
    await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Error al ejecutar el comando." });
  }
}

//Object to store the last usage time for each command by user
const commandCooldowns = {};

//Helper function to track command usage and time
function recordCommandUsage(userId, command) {
     if (!commandCooldowns[userId]) {
          commandCooldowns[userId] = {};
     }
     commandCooldowns[userId][command] = Date.now();
}

//Helper function to check if a command is on cooldown for a user
function isOnCooldown(userId, command) {
     if (commandCooldowns[userId] && commandCooldowns[userId][command]) {
          const lastUsed = commandCooldowns[userId][command];
          const now = Date.now();
          if (now - lastUsed < GACHA_COOLDOWN) {
               return true;  //Is on cooldown
          }
     }
     return false; //Not on cooldown
}

// Simple check, extend this as your bot grows to include more gacha commands dynamically
function isGachaCommand(command) {
    const gachaCommands = ['claim', 'daily', 'market', 'gift', 'trade', 'sell', 'collection', 'profile', 'top', 'balance', 'menugacha', 'achievements'];
    return gachaCommands.includes(command);
}
