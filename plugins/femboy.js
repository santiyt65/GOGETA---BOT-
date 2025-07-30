export async function femboyCommand(sock, m) {
  const groupMetadata = m.key.remoteJid.endsWith("@g.us")
    ? await sock.groupMetadata(m.key.remoteJid)
    : null;

  if (!groupMetadata) {
    await sock.sendMessage(m.key.remoteJid, {
      text: "❌ Este comando solo funciona en grupos.",
    });
    return;
  }

  const participantes = groupMetadata.participants.filter(p => p.id !== sock.user.id);
  const aleatorio = participantes[Math.floor(Math.random() * participantes.length)];

  const frases = [
    "🌸 ¡Hoy el femboy del grupo es @user!",
    "💅 @user fue coronado como el femboy supremo.",
    "✨ ¡@user se lleva el premio al más kawaii del grupo!",
    "👀 ¿@user? ¡Claramente un femboy profesional!"
  ];

  const texto = frases[Math.floor(Math.random() * frases.length)].replace("@user", "@" + aleatorio.id.split("@")[0]);

  await sock.sendMessage(m.key.remoteJid, {
    text: texto,
    mentions: [aleatorio.id]
  });
}