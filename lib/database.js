import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./data/database.json');

/**
 * Lee la base de datos desde el archivo.
 * @returns {object} La base de datos completa.
 */
function readDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo la base de datos, se creará una nueva.", error);
        return {};
    }
}

/**
 * Escribe la base de datos en el archivo.
 * @param {object} db La base de datos completa para guardar.
 */
function writeDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

/**
 * Obtiene los datos de un usuario o crea un perfil nuevo.
 * @param {string} jid El JID del usuario.
 * @returns {object} Los datos del usuario.
 */
export function getUser(jid) {
    const db = readDB();
    if (!db[jid]) {
        db[jid] = { 
            registered: false, // Nuevo campo para indicar si está registrado
            name: '',          // Nuevo campo para el nombre
            age: null,         // Nuevo campo para la edad
            balance: 100,
            collection: [],
            lastClaim: 0,
            achievements: [],
            level: 1,
            xp: 0,
        };
        writeDB(db);
    }
    // Asegura que los usuarios antiguos tengan el objeto de estadísticas para compatibilidad
    if (!db[jid].stats) {
        db[jid].stats = { sales: 0, trades: 0, dailyClaims: 0 };
    }
    return db[jid];
}

/**
 * Guarda los datos actualizados de un usuario.
 * @param {string} jid El JID del usuario.
 * @param {object} userData Los nuevos datos del usuario.
 */
export function saveUser(jid, userData) {
    const db = readDB();
    db[jid] = userData;
    writeDB(db);
}

/**
 * Obtiene la base de datos completa.
 * @returns {object} La base de datos completa.
 */
export function getDatabase() {
    return readDB();
}