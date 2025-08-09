/**
 * @file Sistema de auto-respuesta por palabras clave con cooldown.
 * Aquí puedes definir qué acciones tomar cuando un mensaje contiene ciertas palabras.
 */

/**
 * Array de objetos 'responder'. Cada objeto define las palabras clave y la acción a realizar.
 * - keywords: Array de palabras (en minúsculas) que activarán la respuesta.
 * - action: Función asíncrona que se ejecutará.
 * - options: (Opcional) Configuraciones adicionales.
 *   - exact: Si es true, el mensaje debe ser exactamente igual a una de las keywords.
 */
const responders = [
  {
    keywords: ['hola', 'buenas', 'buenos dias'],
    action: async (sock, m) => {
      await sock.sendMessage(m.key.remoteJid, { text: '👋 ¡Hola! ¿En qué puedo ayudarte hoy?' });
    }
  },
  {
    keywords: ['gogeta', 'bot fachero'],
    action: async (sock, m) => {
      // Asegúrate de tener esta imagen en la carpeta /media/gogeta.jpg
      await sock.sendMessage(m.key.remoteJid, {
        image: { url: './media/gogeta.jpg' },
        caption: '¡El guerrero definitivo a tu servicio!'
      });
    }
  },
  {
    keywords: ['epico', 'que pro'],
    action: async (sock, m) => {
      // Asegúrate de tener este video en la carpeta /media/epic.mp4
      await sock.sendMessage(m.key.remoteJid, {
        video: { url: './media/epic.mp4' },
        caption: '¡Esto es épico!',
        gifPlayback: true
      });
    }
  }
];

const autoResponderCooldowns = {};
const COOLDOWN_DURATION = 30 * 1000; // 30 segundos en milisegundos

export async function handleAutoResponder(sock, m, body) {
  const chatId = m.key.remoteJid;
  const now = Date.now();

  // Verifica si el chat está en cooldown para las respuestas automáticas
  const lastResponseTime = autoResponderCooldowns[chatId];
  if (lastResponseTime && (now - lastResponseTime < COOLDOWN_DURATION)) {
    return false; // En cooldown, no hacer nada y permitir que continúe el flujo de comandos.
  }

  const lowerBody = body.toLowerCase();
  for (const responder of responders) {
    if (responder.keywords.some(kw => lowerBody.includes(kw))) {
      await responder.action(sock, m);
      autoResponderCooldowns[chatId] = now; // Establecer el cooldown para este chat
      return true; // Indica que se envió una respuesta
    }
  }
  return false; // No se encontró ninguna palabra clave
}