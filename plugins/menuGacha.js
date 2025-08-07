export default async function (sock, m) {
    const texto = `
⛩️ *Menú Gacha de Personajes* ⛩️

Consigue personajes, véndelos y compite para ser el mejor coleccionista.

➤ *.claim* - Reclama un personaje aleatorio (1 por hora).
➤ *.collection* - Muestra tu colección de personajes.
➤ *.sell <número>* - Vende un personaje de tu colección.
➤ *.balance* - Muestra tu cantidad de monedas.
➤ *.trade @usuario <tu_nº> <su_nº>* - Propone un intercambio.
➤ *.trade accept | reject* - Acepta o rechaza un intercambio.
➤ *.market* - Muestra los personajes en venta.
➤ *.market sell <nº> <precio>* - Vende un personaje en el mercado.
➤ *.gift @usuario <nº>* - Regala un personaje a otro usuario.
➤ *.achievements* - Muestra tu lista de logros.
➤ *.daily* - Reclama tu recompensa diaria.
➤ *.market buy <ID>* - Compra un personaje del mercado.
➤ *.market remove <ID>* - Retira tu personaje del mercado.
➤ *.top* - Muestra el ranking de los más ricos.
    `.trim();

    await sock.sendMessage(m.key.remoteJid, { text: texto });
}