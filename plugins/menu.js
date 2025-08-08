import { generateMenuText } from '../lib/menu.js';

/**
 * Manejador para el comando .menu
 * @type {import('../lib/functions.js').CommandHandler}
 */
const handler = async (sock, m, { command }) => {
  // Asegurarse de que solo se active con el comando 'menu'
  if (command !== 'menu') return;

  const menuText = generateMenuText();
  await sock.sendMessage(m.key.remoteJid, { text: menuText }, { quoted: m });
};

handler.command = 'menu';
handler.help = 'Muestra el menú de comandos unificado.';

export default handler;