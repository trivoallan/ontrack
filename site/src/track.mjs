// The reference track, as npm installed the release this repository depends
// on. The catalogue pages (content.config.ts), the sidebar and the track page
// read it from here.
import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// From the working directory, not from this file: the build bundles this
// module for the MDX page that imports it, and moves it.
// ponytail: assumes the build runs in site/, as `npm run build` does.
const root = pathToFileURL(`${process.cwd()}/../node_modules/trivoallan/`);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

export const version = JSON.parse(read('package.json')).version;

// The README groups the questions by domain, in its "What you get" table:
// `| **Agents** (0017, 0022, 0026) | …`. A question it does not place goes
// under "Other".
const domainOf = new Map();
for (const [, name, numbers] of read('README.md').matchAll(/^\| \*\*(.+?)\*\* \(([\d, ]+)\) \|/gm)) {
  for (const number of numbers.split(/,\s*/)) domainOf.set(`ADR-${number}`, name);
}

export const questions = readdirSync(new URL('adr/', root))
  .filter((name) => name.endsWith('.md'))
  .sort()
  .map((file) => {
    const source = read(`adr/${file}`);
    const adr = file.slice(0, 8);
    return {
      file,
      adr,
      id: file.replace(/\.md$/, '').toLowerCase(),
      title: source.match(/^title:\s*(.*)$/m)?.[1] ?? file,
      checked: /^check:\s*\S/m.test(source),
      domain: domainOf.get(adr) ?? 'Other',
    };
  });

// The colour Starlight gives the nth card of a grid, so that a domain's badge
// matches its card in "What you get", which lists the domains in this order.
const cardColour = (index) => ['orange', 'purple', 'green', 'red', 'blue', 'purple', 'green', 'red'][index % 8];

// The domains in the README's order, each with its questions in number order.
export const domains = [...new Set([...domainOf.values(), ...questions.map((q) => q.domain)])]
  .map((name, index) => ({ name, color: cardColour(index), questions: questions.filter((q) => q.domain === name) }))
  .filter((domain) => domain.questions.length);
