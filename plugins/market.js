import { getUser, saveUser } from '../lib/database.js';
import { getListings, addListing, findListing, removeListing } from '../lib/market.js';

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const subCommand = args[0]?.toLowerCase();

    switch (subCommand) {
        case 'sell':
            return await sellOnMarket(sock, m, sender, args.slice(1));
        case 'buy':
            return await buyFromMarket(sock, m, sender, args.slice(1));
        case 'remove':
            return await removeFromMarket(sock, m, sender, args.slice(1));
        default:
            return await viewMarket(sock, m);
    }
}

async function viewMarket(sock, m) {
    const listings = getListings();
    if (listings.length === 0) {
        return await sock.sendMessage(m.key.remoteJid, { text: "🛒 El mercado está vacío actualmente." });
    }

    let marketText = "🛒 *Mercado Global de Personajes* 🛒\n\n";
    listings.forEach(listing => {
        marketText += `-----------------------------------\n`;
        marketText += `👤 *Vendedor:* @${listing.sellerJid.split('@')[0]}\n`;
        marketText += `✨ *Personaje:* ${listing.character.name} (${listing.character.rarity})\n`;
        marketText += `💰 *Precio:* ${listing.price} monedas\n`;
        marketText += `🆔 *ID Anuncio:* \`${listing.listingId}\`\n`;
    });
    marketText += `-----------------------------------\n\nPara comprar, usa *.market buy <ID Anuncio>*`;

    await sock.sendMessage(m.key.remoteJid, {
        text: marketText.trim(),
        mentions: [...new Set(listings.map(l => l.sellerJid))]
    });
}

async function sellOnMarket(sock, m, sender, args) {
    const user = getUser(sender);
    const charIndex = parseInt(args[0], 10) - 1;
    const price = parseInt(args[1], 10);

    if (isNaN(charIndex) || isNaN(price) || price <= 0) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Formato incorrecto. Usa: *.market sell <nº_personaje> <precio>*" });
    }

    if (charIndex < 0 || charIndex >= user.collection.length) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ Número de personaje inválido." });
    }

    const [characterToSell] = user.collection.splice(charIndex, 1);
    const newListing = addListing(sender, characterToSell, price);

    saveUser(sender, user);

    await sock.sendMessage(m.key.remoteJid, {
        text: `✅ ¡Tu personaje *${characterToSell.name}* ha sido puesto en el mercado por ${price} monedas!\n\n🆔 *ID Anuncio:* \`${newListing.listingId}\``
    });
}

async function buyFromMarket(sock, m, buyerJid, args) {
    const listingId = args[0];
    if (!listingId) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes proporcionar el ID del anuncio. Ejemplo: *.market buy <ID Anuncio>*" });
    }

    const listing = findListing(listingId);
    if (!listing) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se encontró ningún anuncio con ese ID." });
    }

    if (listing.sellerJid === buyerJid) {
        return await sock.sendMessage(m.key.remoteJid, { text: "🤦‍♂️ No puedes comprar tu propio personaje." });
    }

    const buyer = getUser(buyerJid);
    if (buyer.balance < listing.price) {
        return await sock.sendMessage(m.key.remoteJid, { text: `💰 No tienes suficientes monedas. Necesitas ${listing.price} y tienes ${buyer.balance}.` });
    }

    if (!removeListing(listingId)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "🏃‍♂️ ¡Demasiado tarde! Alguien más compró este personaje justo ahora." });
    }

    const seller = getUser(listing.sellerJid);

    buyer.balance -= listing.price;
    seller.balance += listing.price;
    buyer.collection.push(listing.character);

    saveUser(buyerJid, buyer);
    saveUser(listing.sellerJid, seller);

    const successText = `🎉 ¡Compra Exitosa! 🎉\n\n*@${buyerJid.split('@')[0]}* ha comprado *${listing.character.name}* de *@${listing.sellerJid.split('@')[0]}* por ${listing.price} monedas.`.trim();

    await sock.sendMessage(m.key.remoteJid, {
        text: successText,
        mentions: [buyerJid, listing.sellerJid]
    });
}

async function removeFromMarket(sock, m, sender, args) {
    const listingId = args[0];
    if (!listingId) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes proporcionar el ID del anuncio que quieres retirar. Ejemplo: *.market remove <ID Anuncio>*" });
    }

    const listing = findListing(listingId);
    if (!listing) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ No se encontró ningún anuncio con ese ID." });
    }

    if (listing.sellerJid !== sender) {
        return await sock.sendMessage(m.key.remoteJid, { text: "🚫 No puedes retirar un anuncio que no es tuyo." });
    }

    if (removeListing(listingId)) {
        const user = getUser(sender);
        user.collection.push(listing.character);
        saveUser(sender, user);

        await sock.sendMessage(m.key.remoteJid, { text: `✅ Has retirado a *${listing.character.name}* del mercado. Vuelve a estar en tu colección.` });
    } else {
        await sock.sendMessage(m.key.remoteJid, { text: "❌ Ocurrió un error al intentar retirar el personaje." });
    }
}