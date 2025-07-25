const preguntasActivas = {};

export async function matematicaCommand(sock, m) {
  const chatId = m.key.remoteJid;

  // Generar operación aleatoria
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const operaciones = ["+", "-", "*"];
  const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];

  let pregunta = `${a} ${operacion} ${b}`;
  let resultado;

  switch (operacion) {
    case "+": resultado = a + b; break;
    case "-": resultado = a - b; break;
    case "*": resultado = a * b; break;
  }

  // Generar respuestas falsas
  const opciones = [resultado];
  while (opciones.length < 3) {
    let falsa = resultado + Math.floor(Math.random() * 5) - 2;
    if (!opciones.includes(falsa)) opciones.push(falsa);
  }

  // Mezclar opciones
  opciones.sort(() => Math.random() - 0.5);

  // Guardar respuesta
  preguntasActivas[chatId] = resultado;

  // Enviar pregunta con botones
  await sock.sendMessage(chatId, {
    text: `🧮 ¿Cuánto es *${pregunta}*?`,
    buttons: opciones.map(op => ({
      buttonId: `mat-${op}`,
      buttonText: { displayText: op.toString() },
      type: 1
    })),
    footer: "Responde con el botón correcto",
    headerType: 1
  });
}

export async function responderMatematica(sock, m, idBoton) {
  const chatId = m.key.remoteJid;
  const respuesta = parseInt(idBoton.split("-")[1]);

  const correcta = preguntasActivas[chatId];
  if (respuesta === correcta) {
    await sock.sendMessage(chatId, { text: `✅ ¡Correcto! ${respuesta} es la respuesta.` });
  } else {
    await sock.sendMessage(chatId, { text: `❌ Incorrecto. La respuesta correcta era ${correcta}.` });
  }

  delete preguntasActivas[chatId];
}
