import fs from "fs";
import path from "path";
import { owner } from "../config.js";
import { handleAutoResponder } from "./autoResponder.js";
import { getUser } from "./database.js";
import { menuData } from "./menu.js";

// --- Configuración ---
const COMMAND_COOLDOWN = 5 * 1000; // 5 segundos de cooldown para comandos generales
const configFile = path.resolve("./data/config.json"); // Movido a /data para persistencia en Render

// Cargar la configuración. Asegurarse de que el directorio y el archivo existan.
if (!fs.existsSync(path.dirname(configFile))) {
  fs.mkdirSync(path.dirname(configFile), { recursive: true });
}
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, JSON.stringify({ antiPrivado: false }, null, 2));
}
export let config = JSON.parse(fs.readFileSync(configFile));

/**
 * Guarda la configuración actual en el archivo JSON.
 */
export function saveConfig() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

/**
 * Verifica si el usuario es administrador en el grupo.
 * @param {import('@whiskeysockets/baileys').WASocket} sock El socket de WhatsApp.
 * @param {string} groupId El JID del grupo.
 * @param {string} jid El JID del usuario.
 * @returns {Promise<boolean>} True si el usuario es administrador, false de lo contrario.
 */
export async function isAdmin(sock, groupId, jid) {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const participant = groupMetadata.participants.find(p => p.id === jid);
    return participant?.admin === 'superadmin' || participant?.admin === 'admin';
  } catch (error) {
    console.error("Error al obtener metadatos del grupo:", error);
    return false;
  }
}

/**
 * Extrae el cuerpo del texto de un mensaje de Baileys.
 * @param {import('@whiskeysockets/baileys').WAMessage} m El objeto del mensaje.
 * @returns {string} El cuerpo del texto del mensaje.
 */
function getMessageBody(m) {
  return (
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.listResponseMessage?.singleSelectReply.selectedRowId ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ""
  );
}

/**
 * Procesa las respuestas de botones de juegos interactivos.
 * @returns {Promise<boolean>} True si se manejó una respuesta de botón, false de lo contrario.
 */
async function handleButtonResponse(sock, m, plugins) {
    const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId;
    if (!buttonId) return false;

    // --- Manejo del menú interactivo ---
    if (buttonId.startsWith('menu_')) {
        const categoryName = buttonId.replace('menu_', '');
        const category = menuData.find(cat => cat.category === categoryName);

        if (category) {
            let categoryText = `╭───[ *${category.category}* ]───╮\n│\n`;
            category.commands.forEach(cmd => {
                categoryText += `│  ◦ \`${cmd.cmd}\`\n│    *${cmd.desc}*\n`;
            });
            categoryText += `│\n╰─────────────────╯`;

            const backButton = {
                text: categoryText,
                footer: 'Haz clic para volver al menú principal',
                buttons: [{ buttonId: '.menu', buttonText: { displayText: '⬅️ Volver al Menú' }, type: 1 }],
                headerType: 1
            };

            await sock.sendMessage(m.key.remoteJid, backButton);
        }
        return true; // Se manejó la respuesta del menú
    }

    const gameMappings = {
        'trivia_': 'trivia',
        'mat-': 'matematica',
        'piedra': 'ppt',
        'papel': 'ppt',
        'tijera': 'ppt'
    };

    for (const prefix in gameMappings) {
        if (buttonId.startsWith(prefix)) {
            const pluginName = gameMappings[prefix];
            if (plugins[pluginName]) {
                await plugins[pluginName](sock, m, []);
                return true; // Se manejó la respuesta
            }
        }
    }
    return false;
}

// --- Sistema de Cooldown ---
const commandCooldowns = new Map();

function isOnCooldown(userId, command) {
    const key = `${userId}-${command}`;
    const lastTime = commandCooldowns.get(key);
    if (lastTime && (Date.now() - lastTime < COMMAND_COOLDOWN)) {
        return true;
    }
    return false;
}

function recordCommandUsage(userId, command) {
    const key = `${userId}-${command}`;
    commandCooldowns.set(key, Date.now());
}

/**
 * El corazón del bot. Procesa todos los mensajes entrantes.
 * @param {import('@whiskeysockets/baileys').WASocket} sock El socket de Baileys.
 * @param {import('@whiskeysockets/baileys').proto.IWebMessageInfo} m El objeto del mensaje.
 * @param {object} plugins Un objeto que contiene todos los plugins cargados.
 */
export async function handleCommand(sock, m, plugins) {
  // 1. Extraer contenido y validaciones iniciales
  const body = getMessageBody(m);
  if (!body || m.key.fromMe) return;

  // 2. Manejar interacciones que no son comandos de prefijo
  if (await handleButtonResponse(sock, m, plugins)) return;
  if (await handleAutoResponder(sock, m, body)) return;

  // 3. Procesar como un comando con prefijo
  const prefix = ".";
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const sender = m.key.participant || m.key.remoteJid;

  try {
    // 4. Validaciones previas a la ejecución del comando
    const user = getUser(sender);
    const isOwner = owner.some(o => sender.startsWith(o.replace(/[\s-]/g, '')));

    // Bloqueo de mensajes privados si está activado
    if (config.antiPrivado && !m.key.remoteJid.endsWith("@g.us") && !isOwner) {
      await sock.sendMessage(m.key.remoteJid, { text: "🚫 *No acepto mensajes privados.*" });
      await sock.updateBlockStatus(sender, "block");
      return;
    }

    // Requerir registro para usar comandos (excepto .register)
    if (!user.registered && command !== 'register') {
      return await sock.sendMessage(m.key.remoteJid, { text: "Debes registrarte primero usando el comando `.register <nombre> <edad>`" });
    }

    // Cooldown para evitar spam
    if (isOnCooldown(sender, command) && !isOwner) {
        // Opcional: enviar un mensaje de cooldown
        // await sock.sendMessage(m.key.remoteJid, { text: "⏳ Por favor, espera un momento antes de usar este comando de nuevo." });
        return;
    }

    // 5. Ejecutar el plugin
    const plugin = plugins[command];
    if (plugin) {
      await plugin(sock, m, args);
      recordCommandUsage(sender, command); // Registrar uso solo si el comando es exitoso
    }

  } catch (err) {
    console.error(`❌ Error ejecutando el comando ".${command}":`, err);
    await sock.sendMessage(m.key.remoteJid, { text: `⚠️ Ocurrió un error inesperado al procesar tu solicitud.` });
  }
}
