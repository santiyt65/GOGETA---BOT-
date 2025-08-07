import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// --- Configuración ---
const TOTAL_PAGES_TO_FETCH = 5; // Cada página tiene 25 personajes. 5 páginas = 125 personajes.
const OUTPUT_FILE = path.resolve('./data/characters.json');
const CLASSES = ["Luchador", "Mago", "Tanque", "Asesino"];

/**
 * Asigna rareza, valor y clase basados en el ranking de favoritos de MyAnimeList.
 * @param {number} favorites - El número de favoritos del personaje.
 * @returns {{rarity: string, value: number, class: string}}
 */
function assignAttributes(favorites) {
    const randomClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
    if (favorites > 50000) {
        return { rarity: "Legendary", value: Math.floor(5000 + Math.random() * 2000), class: randomClass };
    }
    if (favorites > 10000) {
        return { rarity: "Epic", value: Math.floor(1200 + Math.random() * 800), class: randomClass };
    }
    if (favorites > 2000) {
        return { rarity: "Rare", value: Math.floor(400 + Math.random() * 300), class: randomClass };
    }
    if (favorites > 500) {
        return { rarity: "Uncommon", value: Math.floor(150 + Math.random() * 100), class: randomClass };
    }
    return { rarity: "Common", value: Math.floor(50 + Math.random() * 50), class: randomClass };
}

async function fetchCharacters() {
    console.log("🚀 Iniciando la obtención de personajes desde la API de Jikan...");
    let allCharacters = [];

    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
        try {
            console.log(`📄 Obteniendo página ${page} de ${TOTAL_PAGES_TO_FETCH}...`);
            const response = await fetch(`https://api.jikan.moe/v4/characters?page=${page}&order_by=favorites&sort=desc`);
            if (!response.ok) {
                console.error(`❌ Error en la página ${page}: ${response.statusText}`);
                continue;
            }
            const data = await response.json();
            allCharacters.push(...data.data);
            // Esperar un poco para no saturar la API
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Falló la obtención de la página ${page}:`, error);
        }
    }

    console.log(`✅ Se obtuvieron un total de ${allCharacters.length} personajes.`);
    return allCharacters;
}

async function main() {
    const charactersFromApi = await fetchCharacters();
    if (charactersFromApi.length === 0) {
        console.log("No se obtuvieron personajes. Abortando.");
        return;
    }

    const structuredData = {
        "Common": [],
        "Uncommon": [],
        "Rare": [],
        "Epic": [],
        "Legendary": []
    };

    for (const char of charactersFromApi) {
        const { rarity, value, class: charClass } = assignAttributes(char.favorites);
        const characterData = {
            name: char.name,
            value: value,
            image: char.images.jpg.image_url,
            class: charClass
        };
        structuredData[rarity].push(characterData);
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(structuredData, null, 2));
    console.log(`\n🎉 ¡Éxito! El archivo ${OUTPUT_FILE} ha sido actualizado con nuevos personajes.`);
}

main();