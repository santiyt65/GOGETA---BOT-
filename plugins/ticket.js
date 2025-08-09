// plugins/ticket.js

import { createTicket, closeTicket, getTickets } from '../lib/tickets.js';

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const subCommand = args[0]?.toLowerCase();

    switch (subCommand) {
        case 'new':
            return await createNewTicket(sock, m, sender, args.slice(1).join(' '));
        case 'close':
            return await closeExistingTicket(sock, m, sender, args.slice(1).join(' '));
        case 'list':
            return await listTickets(sock, m, sender);
        default:
            return await sock.sendMessage(m.key.remoteJid, { text: "Usa *.ticket new <descripcion>*, *.ticket close <ticketId>*, o *.ticket list*." });
    }
}

async function createNewTicket(sock, m, sender, description) {
    if (!description) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes proporcionar una descripción para el ticket. Usa: *.ticket new <descripcion>*" });
    }

    const newTicket = createTicket(sender, description);

    await sock.sendMessage(m.key.remoteJid, {
        text: `
🎉 ¡Ticket Creado! 🎉

*Ticket ID:* ${newTicket.ticketId}
*Descripción:* ${newTicket.description}
*Estado:* Abierto
        `.trim()
    });
}

async function closeExistingTicket(sock, m, sender, ticketId) {
    if (!ticketId) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Debes proporcionar el ID del ticket a cerrar. Usa: *.ticket close <ticketId>*" });
    }

    const closed = closeTicket(ticketId);
    if (closed) {
        await sock.sendMessage(m.key.remoteJid, { text: `✅ Ticket ${ticketId} cerrado.` });
    } else {
        await sock.sendMessage(m.key.remoteJid, { text: "❌ No se encontró ningún ticket con ese ID o ya estaba cerrado." });
    }
}

async function listTickets(sock, m, sender) {
    const tickets = getTickets();
    if (tickets.length === 0) {
        return await sock.sendMessage(m.key.remoteJid, { text: "No hay tickets registrados." });
    }

    let listText = "🎫 *Lista de Tickets* 🎫\n\n";
    tickets.forEach(ticket => {
        listText += `*Ticket ID:* ${ticket.ticketId}\n*Usuario:* ${ticket.userId}\n*Estado:* ${ticket.status}\n*Descripción:* ${ticket.description}\n\n`;
    });

    await sock.sendMessage(m.key.remoteJid, { text: listText.trim() });
}