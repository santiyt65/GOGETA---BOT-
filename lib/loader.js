import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadPlugins() {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

  const plugins = {};

  for (const file of files) {
    const filePath = pathToFileURL(path.join(pluginsDir, file)).href;
    try {
      const plugin = await import(filePath);
      const commandName = file.replace('.js', '');

      // Check if the plugin has a required export (e.g., a 'default' function)
      if (typeof plugin.default !== 'function') {
        console.warn(`⚠️ Plugin "${file}" does not have a default export and will be skipped.`);
        continue; // Skip this plugin
      }
      plugins[commandName] = plugin.default || plugin;
    } catch (err) {
      console.error(`❌ Error al cargar el plugin "${file}":`, err);
    }
  }

  return plugins;
}
