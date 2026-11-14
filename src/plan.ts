import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { compareRevision, readCheckLine, readRevision, readStatus, readTitle } from './revision.ts';
import type { Comparison } from './revision.ts';
import { discoverSources } from './sources.ts';
import type { Source } from './sources.ts';

export type Category = 'revised' | 'new' | 'removed' | 'undetermined' | 'unreadable' | 'check' | 'unchanged';
/** The `check:` line of the local copy (`from`) and of the source (`to`); null when absent. */
export type CheckChange = { from: string | null; to: string | null };
/**
 * `from` is set when revised, `to` when revised or undetermined, `check` when check.
 * `status` is the verdict of the repository's copy: set when there is one, null when it states none.
 */
export type PlannedAdr = {
  name: string;
  category: Category;
  title: string | null;
  from?: number | null;
  to?: number | null;
  check?: CheckChange;
  status?: string | null;
};
export type SourcePlan = { namespace: string; adrDir: string; adrs: PlannedAdr[]; migration: string[] };
export type Plan = SourcePlan[];

const ORDER: Category[] = ['revised', 'new', 'removed', 'undetermined', 'unreadable', 'check', 'unchanged'];
const CATEGORY: Record<Comparison, Category> = {
  stale: 'revised',
  'up-to-date': 'unchanged',
  undetermined: 'undetermined',
  unreadable: 'unreadable',
};

// `*.md` files placed directly in `dir` (subdirectories ignored), sorted.
export function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function sourceFiles(source: Source): string[] {
  try {
    return markdownFiles(source.adrDir);
  } catch {
    throw new Error(`source "${source.namespace}" has no readable ADR directory ${source.adrDir}`);
  }
}

function planSource(root: string, source: Source): SourcePlan {
  const adrRoot = path.join(root, 'docs', 'adr');
  const localDir = path.join(adrRoot, source.namespace);
  const shipped = sourceFiles(source);
  const adrs: PlannedAdr[] = [];
  const migration: string[] = [];

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
    const adr: PlannedAdr = { name: file, category: CATEGORY[result], title, status: readStatus(local) };
    if (adr.category === 'revised') adr.from = readRevision(local);
    if (adr.category === 'revised' || adr.category === 'undetermined') adr.to = readRevision(upstream);
    if (adr.category === 'unchanged') {
      // The check line follows the source; the verdict stays the repository's.
      const check = { from: readCheckLine(local), to: readCheckLine(upstream) };
      if (check.from !== check.to) Object.assign(adr, { category: 'check', check });
    }
    adrs.push(adr);
  }

  for (const file of existsSync(localDir) ? markdownFiles(localDir) : []) {
    if (shipped.includes(file)) continue;
    const local = readFileSync(path.join(localDir, file), 'utf8');
    adrs.push({ name: file, category: 'removed', title: readTitle(local, stem(file)), status: readStatus(local) });
  }
  adrs.sort((a, b) => a.name.localeCompare(b.name));
  return { namespace: source.namespace, adrDir: source.adrDir, adrs, migration };
}

/** What importing each source would change, as data. Reads only. */
export function buildPlan(root: string): Plan {
  return discoverSources(root).map((source) => planSource(root, source));
}

/** True when anything in the plan needs a human. */
export function hasPendingChanges(plan: { adrs: { category: Category }[]; migration: unknown[] }[]): boolean {
  return plan.some(
    (s) => s.migration.length > 0 || s.adrs.some((a) => a.category !== 'unchanged'),
  );
}

export const stem = (file: string) => file.replace(/\.md$/, '');
export const row = (category: string, text: string) => `  ${category.padEnd(12)}  ${text}`;
/** An ADR's name, followed by its title when the name carries no slug of its own. */
export const label = (adr: PlannedAdr) => {
  const name = stem(adr.name);
  return name + (adr.title && !/\d-./.test(name) ? `  ${adr.title}` : '');
};

/** The `- ` / `+ ` lines under a `check` ADR: the line that goes, the line that comes. */
export const checkLines = (adr: PlannedAdr): string[] =>
  Object.entries({ '-': adr.check?.from, '+': adr.check?.to })
    .filter(([, line]) => line != null)
    .map(([sign, line]) => `    ${sign} ${line}`);

/**
 * The contract output (see docs/commands.md). With `all`, the unchanged ADRs
 * get a line too and every ADR line carries the repository's verdict.
 */
export function formatPlan(plan: Plan, { all = false } = {}): string {
  if (plan.length === 0) return 'no ontrack source found\n';
  const lines: string[] = [];
  for (const source of plan) {
    const counts = ORDER.map((category): [Category, number] => [
      category,
      source.adrs.filter((a) => a.category === category).length,
    ]).filter(([category, n]) => n > 0 || category === 'unchanged');
    lines.push(`${source.namespace}: ${counts.map(([c, n]) => `${n} ${c}`).join(', ')}`);

    for (const adr of source.adrs) {
      if (adr.category === 'unchanged' && !all) continue;
      const revision = adr.category === 'revised' ? ` (revision ${adr.from} → ${adr.to})` : '';
      const verdict = all ? `${(adr.status ?? '-').padEnd(10)}  ` : '';
      lines.push(row(adr.category, verdict + label(adr) + revision), ...checkLines(adr));
    }

    if (source.migration.length > 0) {
      const n = source.migration.length;
      lines.push(`migration: ${n} file${n === 1 ? '' : 's'} docs/adr/ → docs/adr/${source.namespace}/`);
      for (const file of source.migration) lines.push(row('move', file));
    }
  }
  return `${lines.join('\n')}\n`;
}
