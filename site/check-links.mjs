// Fails when a built page links to a page or file the build did not produce.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { base } from './astro.config.mjs';

const dist = fileURLToPath(new URL('dist', import.meta.url));

const exists = (path) =>
  existsSync(path) && (statSync(path).isFile() || existsSync(join(path, 'index.html')));

const broken = [];
for (const name of readdirSync(dist, { recursive: true })) {
  if (!name.endsWith('.html')) continue;
  const page = join(dist, name);
  for (const [, link] of readFileSync(page, 'utf8').matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const path = decodeURI(link.replace(/[?#].*$/, ''));
    // Skip same-page fragments and anything with a scheme or a host.
    if (!path || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) continue;
    let target;
    if (!path.startsWith('/')) target = join(dirname(page), path);
    else if (path === base || path.startsWith(`${base}/`)) target = join(dist, path.slice(base.length));
    if (!target || !exists(target)) broken.push(`${relative(dist, page)}: ${link}`);
  }
}

if (broken.length) {
  console.error(`${broken.length} broken internal link(s):\n  ${broken.join('\n  ')}`);
  process.exit(1);
}
console.log('check-links: every internal link resolves');
