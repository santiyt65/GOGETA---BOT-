// main.js
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import makeQR from 'qrcode-terminal';
import { handleCommand } from './lib/functions.js'; // Asegurate de tener esta función
import { loadPlugins } from './lib/loader.js';      // Tu loader de plugins
let plugins = {}; // Aquí almacenaremos los plugins cargados

const startSock = async () => {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeWASocket({
    version,
    auth: state,
    logger: undefined
  });

  // Mostrar el QR manualmente
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 Escaneá el código QR para iniciar sesión:');
      makeQR.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado con éxito');
    } else if (connection === 'close') {
      console.log('❌ Conexión cerrada. Reconectando...');
      startSock();
    }
  });

  // Guardar credenciales
  sock.ev.on('creds.update', saveCreds);

  // Cargar plugins
  plugins = await loadPlugins();

  // Manejar comandos entrantes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    if (!messages || !messages[0]?.message) return;

    const m = messages[0];
    try {
      await handleCommand(sock, m, plugins);
    } catch (err) {
      console.error('❌ Error al manejar comando:', err);
    }
  });
};

startSock();
