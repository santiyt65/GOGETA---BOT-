import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from "@whiskeysockets/baileys";
import makeQR from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { handleCommand } from "./lib/functions.js";

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    browser: ["Gogeta-Bot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    try {
      await handleCommand(sock, m);
    } catch (e) {
      console.error("❌ Error en handleCommand:", e);
    }
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("📱 Escanea este QR para conectar tu bot:");
      makeQR.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("🔌 Conexión cerrada. Reconectar:", shouldReconnect);
      if (shouldReconnect) startSock();
    } else if (connection === "open") {
      console.log("✅ Conectado con éxito a WhatsApp.");
    }
  });
};

startSock();
