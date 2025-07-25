import fetch from "node-fetch";

export async function pinterestCommand(sock, m, texto) {
  if (!texto) {
    await sock.sendMessage(m.key.remoteJid, {
      text: "❌ Escribe algo para buscar.\n\nEjemplo: .pinterest goku"
    }, { quoted: m });
    return;
  }

  const esperando = await sock.sendMessage(m.key.remoteJid, {
    text: `🔄 Buscando imágenes de *${texto}*...`
  }, { quoted: m });

  let resultados = [];

  // 🌐 Fuente 1: Pinterest API
  try {
    const res = await fetch(`https://pinterest-api.vercel.app/api/pin?query=${encodeURIComponent(texto)}`);
    const data = await res.json();
    if (data?.data?.length > 0) {
      resultados = data.data.slice(0, 5);
    }
  } catch (e) {
    console.error("❌ Fuente 1 falló:", e);
  }

  // 🌐 Fuente 2: Zeks API
  if (resultados.length === 0) {
    try {
      const apikey = "tu_api_key_zeks"; // OPCIONAL
      const res2 = await fetch(`https://api.zeks.xyz/pinterest?apikey=${apikey}&q=${encodeURIComponent(texto)}`);
      const data2 = await res2.json();
      if (data2?.status === true && data2.result) {
        resultados = [data2.result];
      }
    } catch (e) {
      console.error("❌ Fuente 2 falló:", e);
    }
  }

  // ❌ Sin resultados
  if (resultados.length === 0) {
    await sock.sendMessage(m.key.remoteJid, {
      text: "❌ No encontré imágenes para eso.",
      edit: esperando.key
    });
    return;
  }

  // ✅ Mostrar miniaturas con botones
  for (const [index, url] of resultados.entries()) {
    await sock.sendMessage(m.key.remoteJid, {
      image: { url },
      caption: `🔍 Resultado ${index + 1} de *${texto}*`,
      buttons: [{
        buttonId: `.pinver ${encodeURIComponent(url)}`,
        buttonText: { displayText: "📎 Ver imagen" },
        type: 1
      }],
      headerType: 4
    }, { quoted: m });
  }
}

// Comando .pinver para mostrar imagen grande
export async function pinverCommand(sock, m, texto) {
  if (!texto) return;
  const url = decodeURIComponent(texto);
  await sock.sendMessage(m.key.remoteJid, {
    image: { url },
    caption: `📸 Imagen desde Pinterest`
  }, { quoted: m });
}

export const command = ["pinterest", "pin", "pinver"];
export const tags = ["buscadores"];
export const help = ["pinterest <texto>"];

