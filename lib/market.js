import fs from 'fs';
import path from 'path';

const marketPath = path.resolve('./data/market.json');

/**
 * Lee los datos del mercado desde el archivo.
 * @returns {Array} Una lista de los anuncios.
 */
function readMarket() {
    try {
        if (!fs.existsSync(marketPath)) {
            fs.writeFileSync(marketPath, '[]', 'utf8');
        }
        const data = fs.readFileSync(marketPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el mercado.", error);
        return [];
    }
}

/**
 * Escribe los datos del mercado en el archivo.
 * @param {Array} marketData La lista de anuncios a guardar.
 */
function writeMarket(marketData) {
    fs.writeFileSync(marketPath, JSON.stringify(marketData, null, 2));
}

export function getListings() {
    return readMarket();
}

export function findListing(listingId) {
    const market = readMarket();
    return market.find(l => l.listingId === listingId) || null;
}

export function addListing(sellerJid, character, price) {
    const market = readMarket();
    const newListing = {
        listingId: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sellerJid,
        character,
        price: parseInt(price, 10),
        listedAt: Date.now()
    };
    market.push(newListing);
    writeMarket(market);
    return newListing;
}

export function removeListing(listingId) {
    let market = readMarket();
    const initialLength = market.length;
    market = market.filter(l => l.listingId !== listingId);
    if (market.length < initialLength) {
        writeMarket(market);
        return true; // Se eliminó con éxito
    }
    return false; // No se encontró
}