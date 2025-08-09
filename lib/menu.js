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
      { cmd: ".register <nombre> <edad>", desc: "Te registra en el bot." },
      { cmd: ".menu", desc: "Muestra este menú de comandos." },
      { cmd: ".ping", desc: "Mide la velocidad del bot." },
      { cmd: ".info", desc: "Muestra información sobre el bot." },
      { cmd: ".profile [@usuario]", desc: "Muestra el perfil de un usuario." },
    ],
  },
  {
    category: "⛩️ Gacha & Economía",
    commands: [
      { cmd: ".daily", desc: "Reclama tu recompensa diaria." },
      { cmd: ".claim", desc: "Reclama un personaje aleatorio." },
      { cmd: ".balance", desc: "Muestra tu balance de monedas." },
      { cmd: ".collection", desc: "Muestra tu colección de personajes." },
      { cmd: ".sell <nº>", desc: "Vende un personaje de tu colección." },
      { cmd: ".gift @usuario <nº>", desc: "Regala un personaje a otro usuario." },
      { cmd: ".top", desc: "Muestra el ranking de los más ricos." },
      { cmd: ".achievements", desc: "Muestra tus logros desbloqueados." },
    ],
  },
  {
    category: "🔄 Intercambios & Mercado",
    commands: [
      { cmd: ".trade @usuario <tu_nº> <su_nº>", desc: "Propone un intercambio." },
      { cmd: ".trade accept | reject", desc: "Acepta o rechaza un intercambio." },
      { cmd: ".market", desc: "Muestra los personajes en venta." },
      { cmd: ".market sell <nº> <precio>", desc: "Vende un personaje en el mercado." },
      { cmd: ".market buy <ID>", desc: "Compra un personaje del mercado." },
      { cmd: ".market remove <ID>", desc: "Retira tu personaje del mercado." },
    ],
  },
  {
    category: "🎮 Juegos",
    commands: [
      { cmd: ".ppt", desc: "Juega Piedra, Papel o Tijera." },
      { cmd: ".adivina", desc: "Adivina el número que estoy pensando." },
      { cmd: ".trivia", desc: "Responde una pregunta de trivia." },
      { cmd: ".matematica", desc: "Resuelve un problema matemático." },
      { cmd: ".ahorcado", desc: "Juega al ahorcado." },
    ],
  },
  {
    category: "🎉 Comandos de Diversión",
    commands: [
      { cmd: ".sticker", desc: "Convierte una imagen/video en sticker." },
      { cmd: ".formarpareja", desc: "Forma parejas aleatorias en el grupo." },
      { cmd: ".femboy", desc: "Elige al femboy del grupo." },
      { cmd: ".meme", desc: "Envía un meme al azar." },
      { cmd: ".pinterest <búsqueda>", desc: "Busca imágenes en Pinterest." },
    ],
  },
  {
    category: "📥 Descargas",
    commands: [
      { cmd: ".ytmp3 <búsqueda/url>", desc: "Descarga el audio de un video de YouTube." },
      { cmd: ".ytmp4 <búsqueda/url>", desc: "Descarga un video de YouTube." },
    ],
  },
  {
    category: "🛠️ Administración (Solo Admins)",
    commands: [
      { cmd: ".tag", desc: "Menciona a todos en el grupo." },
      { cmd: ".antipriv", desc: "Activa/desactiva el anti-privado (Solo Owner)." },
    ],
  },
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