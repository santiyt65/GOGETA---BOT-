import fs from 'fs';
import path from 'path';

const ticketsPath = path.resolve('./data/tickets.json');

/**
 * Lee los tickets desde el archivo.
 * @returns {Array} Los tickets existentes.
 */
function readTickets() {
    try {
        if (!fs.existsSync(ticketsPath)) {
            fs.writeFileSync(ticketsPath, '[]', 'utf8');
        }
        const data = fs.readFileSync(ticketsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo los tickets.", error);
        return [];
    }
}

/**
 * Escribe los tickets en el archivo.
 * @param {Array} tickets La lista de tickets a guardar.
 */
function writeTickets(tickets) {
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2));
}

/**
 * Crea un nuevo ticket.
 * @param {string} userId El ID del usuario que crea el ticket.
 * @param {string} description La descripción del problema.
 * @returns {object} El nuevo ticket creado.
 */
export function createTicket(userId, description) {
    const tickets = readTickets();
    const newTicket = {
        ticketId: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId,
        description,
        status: 'open', // open, closed
        createdAt: Date.now()
    };
    tickets.push(newTicket);
    writeTickets(tickets);
    return newTicket;
}

/**
 * Cierra un ticket existente.
 * @param {string} ticketId El ID del ticket a cerrar.
 * @returns {boolean} True si el ticket se cerró correctamente, false si no se encontró.
 */
export function closeTicket(ticketId) {
    const tickets = readTickets();
    const ticketIndex = tickets.findIndex(t => t.ticketId === ticketId);
    if (ticketIndex === -1) return false;

    tickets[ticketIndex].status = 'closed';
    writeTickets(tickets);
    return true;
}

export function getTickets() {
    return readTickets();
}