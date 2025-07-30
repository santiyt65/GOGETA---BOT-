export async function menuImagenesCommand(sock, m) {
  const texto = `
🖼️ *Menú de Imágenes:*

- 🌸 .femboy
- 🐉 .pinterest goku
- 🎴 .anime
- 💋 .waifu
- 👀 .nsfw

Disfrutá las imágenes con responsabilidad 😏
  `;

  await sock.sendMessage(m.key.remoteJid, {
    text: texto,
  });
}
