import { menuData } from '../lib/menu.js';

/**
 * Manejador para el comando .menu
 * @type {import('../lib/functions.js').CommandHandler}
 */
const handler = async (sock, m, args) => {
  // Crear los botones a partir de las categorías del menú
  const buttons = menuData.map(category => ({
    buttonId: `menu_${category.category}`, // ID único para cada botón
    buttonText: { displayText: category.category },
    type: 1
  }));

  const menuMessage = {
    text: `╭───[ *GOGETA - BOT* ]───╮\n│\n│  ¡Hola! 👋 Soy un bot multifuncional.\n│  Selecciona una categoría para ver los comandos.\n│\n╰─────────────────╯`,
    footer: 'Hecho por NICOLAS-SANILO',
    buttons: buttons,
    headerType: 1
  };

  await sock.sendMessage(m.key.remoteJid, menuMessage, { quoted: m });
};

handler.command = 'menu';
handler.help = 'Muestra el menú de comandos interactivo.';

export default handler;