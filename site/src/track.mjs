// The tracks this repository depends on, as npm installed the releases it
// depends on, found by the same discovery as `ontrack plan`. The catalogue
// pages (content.config.ts), the sidebar and the track pages read them from
// here.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { discoverTracks } from '../../src/tracks.ts';

// From the working directory, not from this file: the build bundles this
// module for the MDX page that imports it, and moves it.
// ponytail: assumes the build runs in site/, as `npm run build` does.
const repository = path.resolve(process.cwd(), '..');

// The colour Starlight gives the nth card of a grid, so that a domain's badge
// matches its card in "What you get", which lists the domains in this order.
const cardColour = (index) => ['orange', 'purple', 'green', 'red', 'blue', 'purple', 'green', 'red'][index % 8];

// `git+https://github.com/owner/repo.git` → `owner/repo`.
// ponytail: GitHub only, as both tracks are; another forge needs its raw URL.
const githubRepo = (pkg, packageName) => {
  const url = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  const found = url?.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  if (!found) throw new Error(`track ${packageName}: its package.json names no GitHub repository`);
  return found[1];
};

const readTrack = (track) => {
  const root = path.join(repository, 'node_modules', track.namespace);
  const read = (file) => readFileSync(path.join(root, file), 'utf8');
  const pkg = JSON.parse(read('package.json'));
  const readme = existsSync(path.join(root, 'README.md')) ? read('README.md') : '';

  // The README may group the conventions by domain, in a table:
  // `| **Agents** (0017, 0022, 0026) | …`. A convention it does not place goes
  // under "Other". A README with no such table groups nothing.
  const domainOf = new Map();
  for (const [, name, numbers] of readme.matchAll(/^\| \*\*(.+?)\*\* \(([\d, ]+)\) \|/gm)) {
    for (const number of numbers.split(/,\s*/)) domainOf.set(`ADR-${number}`, name);
  }

  const conventions = readdirSync(track.adrDir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((file) => {
      const source = readFileSync(path.join(track.adrDir, file), 'utf8');
      const adr = file.slice(0, 8);
      return {
        file,
        adr,
        id: file.replace(/\.md$/, '').toLowerCase(),
        title: source.match(/^title:\s*(.*)$/m)?.[1] ?? file,
        domain: domainOf.size ? domainOf.get(adr) ?? 'Other' : null,
      };
    });

  // The domains in the README's order, each with its conventions in number
  // order; one domain with no name when the README has no table.
  const domains = [...new Set([...domainOf.values(), ...conventions.map((q) => q.domain)])]
    .map((name, index) => ({
      name,
      slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'conventions',
      color: cardColour(index),
      conventions: conventions.filter((q) => q.domain === name),
    }))
    .filter((domain) => domain.conventions.length);

  return {
    alias: track.namespace,
    // The package name without its scope: the track's place on the site,
    // whatever alias this repository installs it under.
    name: track.packageName.replace(/^@[^/]+\//, ''),
    packageName: track.packageName,
    version: pkg.version,
    github: githubRepo(pkg, track.packageName),
    root,
    adrDir: track.adrDir,
    conventions,
    domains,
  };
};

export const tracks = discoverTracks(repository).map(readTrack);

export const trackNamed = (name) => {
  const track = tracks.find((t) => t.name === name);
  if (!track) throw new Error(`no installed track is named ${name}`);
  return track;
};

// The track a file of the catalogue belongs to, if any.
export const trackOf = (file) => tracks.find((t) => file.startsWith(t.adrDir + path.sep));
