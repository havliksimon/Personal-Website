import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'dist/index.html');

const { render } = await import(path.join(root, 'dist-ssr/entry-server.js'));

const html = render().replace(/<link\b[^>]*\brel="preload"[^>]*>/gi, '');
const template = await readFile(indexPath, 'utf8');

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Prerender: root placeholder not found in dist/index.html');
}

if (/<link\b[^>]*\brel="preload"/i.test(html)) {
  throw new Error('Prerender: hoistable preload link survived cleanup');
}

await writeFile(indexPath, template.replace('<div id="root"></div>', `<div id="root">${html}</div>`));

const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
console.log(`Prerendered ${(html.length / 1024).toFixed(1)} kB of HTML (~${words} words) into dist/index.html`);
