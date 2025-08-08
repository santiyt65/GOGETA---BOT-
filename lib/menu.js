/**
 * @file Centralized menu generator for Gogeta-Bot.
 * @author Gemini Code Assist
 */

// Define la estructura del menú en un array de objetos.
// Cada objeto es una categoría con sus comandos.
const menuData = [
  {
    category: "🤖 Comandos Generales",
    commands: [
      { cmd: ".menu", desc: "Muestra este menú de comandos." },
      { cmd: ".ping", desc: "Mide la latencia y velocidad del bot." },
      { cmd: ".info", desc: "Muestra información sobre el bot." },
    ],
  },
  {
    category: "🎉 Comandos de Diversión",
    commands: [
      { cmd: ".sticker", desc: "Convierte una imagen/video en sticker." },
      { cmd: ".claim", desc: "Reclama un personaje (juego)." },
    ],
  },
  // Puedes añadir más categorías aquí en el futuro
];

/**
 * Genera el texto del menú formateado para WhatsApp.
 * @returns {string} El texto completo del menú.
 */
export const generateMenuText = () => {
  let menuText = `╭───[ *GOGETA - BOT* ]───╮\n│\n`;
  menuText += `│  ¡Hola! 👋 Soy un bot multifuncional.\n│  Usa el prefijo \`.\` para interactuar.\n│\n`;

  menuData.forEach(cat => {
    menuText += `├─「 *${cat.category}* 」\n`;
    cat.commands.forEach(cmd => {
      menuText += `│  ◦ \`${cmd.cmd}\`\n`;
    });
    menuText += `│\n`;
  });

  menuText += `╰───› Hecho por NICOLAS-SANILO`;
  return menuText;
};