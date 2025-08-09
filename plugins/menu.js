import { generateMenuText } from '../lib/menu.js';

/**
 * Manejador para el comando .menu
 * @type {import('../lib/functions.js').CommandHandler}
 */
const handler = async (sock, m, args) => {
  // La comprobación del comando ya la hace el manejador principal (handleCommand),
  // por lo que no es necesaria aquí.
  const menuText = generateMenuText();
  await sock.sendMessage(m.key.remoteJid, { text: menuText }, { quoted: m });
};

handler.command = 'menu';
handler.help = 'Muestra el menú de comandos unificado.';

export default handler;