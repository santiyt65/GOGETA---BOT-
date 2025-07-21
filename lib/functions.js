let plugins = {};

export async function handleCommand(sock, m) {
  const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
  const command = body.trim().toLowerCase();

  // Recargar plugins si aún no están cargados
  if (Object.keys(plugins).length === 0) {
    plugins = await cargarPlugins();
  }

  if (command === ".ping") {
    await sock.sendMessage(m.key.remoteJid, { text: "🏓 ¡Pong! Gogeta-Bot activo." });

  } else if (command === ".menu") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "📜 *MENÚ DE GOGETA - BOT*\n\n.comandos\n.info\n.ping\n.juegos\n.update"
    });

  } else if (command === ".info") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "🤖 *Gogeta - Bot*\nCreado por ChatGPT\nVersión inicial"
    });

  } else if (command === ".juegos") {
    await sock.sendMessage(m.key.remoteJid, {
      text: "🎮 *JUEGOS DISPONIBLES*\n\n1. .adivina\n2. .ppt\n3. .ahorcado\n4. .trivia\n5. .matemática"
    });

  } else if (command === ".adivina") {
    await plugins.adivinaCommand(sock, m);

  } else if (command === ".update") {
    plugins = await cargarPlugins();
    await sock.sendMessage(m.key.remoteJid, { text: "🔄 Plugins recargados con éxito." });
  }
}

// Función para cargar dinámicamente los plugins
async function cargarPlugins() {
  const { adivinaCommand } = await import(`../plugins/adivina.js?update=${Date.now()}`);
  return { adivinaCommand };
}
