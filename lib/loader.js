import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function cargarPlugins() {
  const plugins = {};
  const pluginsPath = path.join(__dirname, "../plugins");

  const archivos = fs.readdirSync(pluginsPath).filter(file => file.endsWith(".js"));

  for (const archivo of archivos) {
    try {
      const ruta = path.join(pluginsPath, archivo);
      const modulo = await import(`file://${ruta}`);

      // Convertimos nombre archivo: "menu.js" → "menuCommand"
      const nombreBase = path.basename(archivo, ".js");
      const nombreFuncion = nombreBase + "Command";

      if (modulo[nombreFuncion]) {
        plugins[nombreFuncion] = modulo[nombreFuncion];
        console.log(`✅ Plugin '${nombreBase}' cargado correctamente`);
      } else {
        console.warn(`⚠️ El plugin '${nombreBase}' no exporta la función '${nombreFuncion}'`);
      }

    } catch (error) {
      console.error(`❌ Error al cargar plugin '${archivo}':`, error.message);
    }
  }

  return plugins;
}
