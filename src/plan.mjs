import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { compareRevision, readRevision, readTitle } from './revision.mjs';
import { discoverSources } from './sources.mjs';

const ORDER = ['revised', 'new', 'removed', 'undetermined', 'unreadable', 'unchanged'];
const CATEGORY = { stale: 'revised', 'up-to-date': 'unchanged' };

// `*.md` files placed directly in `dir` (subdirectories ignored), sorted.
export function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function sourceFiles(source) {
  try {
    return markdownFiles(source.adrDir);
  } catch {
    throw new Error(`source "${source.namespace}" has no readable ADR directory ${source.adrDir}`);
  }
}

function planSource(root, source) {
  const adrRoot = path.join(root, 'docs', 'adr');
  const localDir = path.join(adrRoot, source.namespace);
  const shipped = sourceFiles(source);
  const adrs = [];
  const migration = [];

  for (const file of shipped) {
    const upstream = readFileSync(path.join(source.adrDir, file), 'utf8');
    const title = readTitle(upstream, stem(file));
    let localPath = path.join(localDir, file);
    if (!existsSync(localPath)) {
      localPath = path.join(adrRoot, file);
      if (!existsSync(localPath)) {
        adrs.push({ name: file, category: 'new', title });
        continue;
      }
      migration.push(file);
    }
    const local = readFileSync(localPath, 'utf8');
    const result = compareRevision(local, upstream);
    const adr = { name: file, category: CATEGORY[result] ?? result, title };
    if (adr.category === 'revised') adr.from = readRevision(local);
    if (adr.category === 'revised' || adr.category === 'undetermined') adr.to = readRevision(upstream);
    adrs.push(adr);
  }

  for (const file of existsSync(localDir) ? markdownFiles(localDir) : []) {
    if (shipped.includes(file)) continue;
    const title = readTitle(readFileSync(path.join(localDir, file), 'utf8'), stem(file));
    adrs.push({ name: file, category: 'removed', title });
  }
  adrs.sort((a, b) => a.name.localeCompare(b.name));
  return { namespace: source.namespace, adrDir: source.adrDir, adrs, migration };
}

/** What importing each source would change, as data. Reads only. */
export function buildPlan(root) {
  return discoverSources(root).map((source) => planSource(root, source));
}

/** True when anything in the plan needs a human. */
export function hasPendingChanges(plan) {
  return plan.some(
    (s) => s.migration.length > 0 || s.adrs.some((a) => a.category !== 'unchanged'),
  );
}

export const stem = (file) => file.replace(/\.md$/, '');
export const row = (category, text) => `  ${category.padEnd(12)}  ${text}`;
/** An ADR's name, followed by its title when the name carries no slug of its own. */
export const label = (adr) => {
  const name = stem(adr.name);
  return name + (adr.title && !/\d-./.test(name) ? `  ${adr.title}` : '');
};

/** The contract output (see README). */
export function formatPlan(plan) {
  if (plan.length === 0) return 'no ontrack source found\n';
  const lines = [];
  for (const source of plan) {
    const counts = ORDER.map((category) => [
      category,
      source.adrs.filter((a) => a.category === category).length,
    ]).filter(([category, n]) => n > 0 || category === 'unchanged');
    lines.push(`${source.namespace}: ${counts.map(([c, n]) => `${n} ${c}`).join(', ')}`);

    for (const adr of source.adrs) {
      if (adr.category === 'unchanged') continue;
      const revision = adr.category === 'revised' ? ` (revision ${adr.from} → ${adr.to})` : '';
      lines.push(row(adr.category, label(adr) + revision));
    }

    if (source.migration.length > 0) {
      const n = source.migration.length;
      lines.push(`migration: ${n} file${n === 1 ? '' : 's'} docs/adr/ → docs/adr/${source.namespace}/`);
      for (const file of source.migration) lines.push(row('move', file));
    }
  }
  return `${lines.join('\n')}\n`;
}
