import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as loader from "./lib/loader.js";
import { handleCommand } from "./lib/functions.js";
import chalk from "chalk";

async function startBot() {
  // Cargar sesión
  const { state, saveCreds } = await useMultiFileAuthState("session");

  // Obtener versión más reciente de Baileys
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(chalk.blueBright(`[🤖 BOT] Usando versión Baileys:`), version, isLatest ? "(última)" : "");

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    logger: { level: "silent" },
  });

  // Guardar credenciales cuando cambian
  sock.ev.on("creds.update", saveCreds);

  // Reconexión automática
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.redBright("[⚠️ Desconectado]"), shouldReconnect ? "Reconectando..." : "Sesión cerrada.");
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log(chalk.greenBright("[✅ Conectado correctamente]"));
    }
  });

  // Cargar plugins desde loader.js
  await loader.cargarPlugins();

  // Manejar mensajes entrantes
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;

    try {
      await handleCommand(sock, m);
    } catch (err) {
      console.error(chalk.redBright("[❌ ERROR al manejar el mensaje]:\n"), err);
    }
  });
}

startBot();
