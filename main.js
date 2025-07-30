import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import Pino from "pino";
import makeQR from "qrcode-terminal";
import { handleCommand } from "./lib/functions.js";
import { cargarPlugins } from "./lib/loader.js";

const logger = Pino({ level: "silent" });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger, // Logger compatible con Baileys
    auth: state,
    printQRInTerminal: false, // Ya no se usa automáticamente
  });

  // Mostrar QR manualmente
  sock.ev.on("connection.update", (update) => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) {
      makeQR.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Reconectando...");
        startBot();
      } else {
        console.log("🚪 Sesión cerrada. Iniciá sesión de nuevo.");
      }
    } else if (connection === "open") {
      console.log("✅ Conexión exitosa.");
    }
  });

  // Guardar sesión automáticamente
  sock.ev.on("creds.update", saveCreds);

  // Carga dinámica de plugins y guardamos en variable global para handleCommand
  const plugins = await cargarPlugins();

  // Escuchar comandos y pasar plugins a handleCommand si es necesario
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    // Pasa sock, mensaje y plugins
    await handleCommand(sock, m, plugins);
  });
}

startBot();
