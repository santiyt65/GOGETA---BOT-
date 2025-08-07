export default async function (sock, m) {
  const texto = `
🎮 *Menú de Juegos:*

- 🎲 .trivia
- ✂️ .ppt
- 🔢 .matematica
- 📏 .ahorcado
- 🎯 .adivina

¡Disfrutá y competí con tus amigos!
  `;

  await sock.sendMessage(m.key.remoteJid, {
    text: texto,
  });
}