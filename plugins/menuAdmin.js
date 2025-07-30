export async function menuAdminCommand(sock, m) {
  const texto = `
🛠️ *Menú de Administración:*
  
- 🔇 .mute @user
- 🔊 .unmute @user
- 🚫 .ban @user
- ✅ .unban @user
- ♻️ .reset ranking
- 🔒 .antipriv

Usa cada comando con responsabilidad.
  `;

  await sock.sendMessage(m.key.remoteJid, {
    text: texto,
  });
}