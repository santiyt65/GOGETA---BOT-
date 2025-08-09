// plugins/register.js

import { getUser, saveUser } from '../lib/database.js';

export default async function (sock, m, args) {
    const sender = m.key.participant || m.key.remoteJid;
    const user = getUser(sender);

    if (user.registered) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Ya estás registrado." });
    }

    const [name, ageStr] = args;
    const age = parseInt(ageStr, 10);

    if (!name || isNaN(age)) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Usa: *.register <nombre> <edad>*" });
    }

    if (age < 5 || age > 99) {
        return await sock.sendMessage(m.key.remoteJid, { text: "Edad inválida. Debe estar entre 5 y 99 años." });
    }

    // Registrar al usuario
    user.registered = true;
    user.name = name;
    user.age = age;
    saveUser(sender, user);

    await sock.sendMessage(m.key.remoteJid, {
        text: `
🎉 ¡Registro exitoso! 🎉

Nombre: ${name}
Edad: ${age} años
        `.trim()
    });
}