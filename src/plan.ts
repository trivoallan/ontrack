import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { compareRevision, readCheckLine, readRevision, readStatus, readTitle } from './revision.ts';
import type { Comparison } from './revision.ts';
import { discoverTracks } from './tracks.ts';
import type { Track } from './tracks.ts';
import { OntrackError } from './errors.ts';

/** The namespace of the ADRs a repository writes for itself. */
export const OWN = 'local';

export type Category = 'revised' | 'new' | 'removed' | 'undetermined' | 'unreadable' | 'check' | 'unchanged';
/** The `check:` line of the local copy (`from`) and of the track (`to`); null when absent. */
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
/** `rename` is the namespace of the folder `apply` moves to `docs/adr/<namespace>/`, when the alias changed. */
export type TrackPlan = { namespace: string; adrDir: string; adrs: PlannedAdr[]; migration: string[]; rename?: string };
export type Plan = TrackPlan[];

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

function trackFiles(track: Track): string[] {
  try {
    return markdownFiles(track.adrDir);
  } catch {
    throw new OntrackError('E111', `track "${track.namespace}" has no readable ADR directory ${track.adrDir}`);
  }
}

function planTrack(root: string, track: Track, shipped: string[], rename?: string): TrackPlan {
  const adrRoot = path.join(root, 'docs', 'adr');
  // A pending rename is classified as if it were done: against the old folder.
  const localDir = path.join(adrRoot, rename ?? track.namespace);
  const adrs: PlannedAdr[] = [];
  const migration: string[] = [];

  for (const file of shipped) {
    const upstream = readFileSync(path.join(track.adrDir, file), 'utf8');
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
      // The check line follows the track; the verdict stays the repository's.
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
  return { namespace: track.namespace, adrDir: track.adrDir, adrs, migration, ...(rename ? { rename } : {}) };
}

const rel = (dir: string) => `docs/adr/${dir}/`;

/**
 * For each track with no folder of its own, the orphan folder of docs/adr/
 * (neither local nor an installed alias) that holds at least one file it
 * ships: the folder of the alias it was installed under before. Throws when
 * a track has two candidates, or a folder two tracks.
 */
function findRenames(adrRoot: string, tracks: Track[], shipped: Map<Track, string[]>): Map<Track, string> {
  const renames = new Map<Track, string>();
  if (!existsSync(adrRoot)) return renames;
  const taken = new Set([OWN, ...tracks.map((t) => t.namespace)]);
  const orphans = readdirSync(adrRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !taken.has(entry.name))
    .map((entry) => ({ name: entry.name, files: new Set(markdownFiles(path.join(adrRoot, entry.name))) }));
  const owner = new Map<string, Track>();
  for (const track of tracks) {
    if (existsSync(path.join(adrRoot, track.namespace))) continue;
    const files = shipped.get(track) ?? [];
    const candidates = orphans.filter((o) => files.some((f) => o.files.has(f))).map((o) => o.name);
    if (candidates.length > 1) {
      throw new OntrackError('E112', `track "${track.namespace}" could be renamed from ${candidates.map(rel).join(' or ')}; remove the folder that is not its own`);
    }
    if (candidates.length === 0) continue;
    const [old] = candidates;
    const other = owner.get(old);
    if (other) {
      throw new OntrackError('E113', `${rel(old)} could be renamed to tracks "${other.namespace}" and "${track.namespace}"; create the folder of the one it is not`);
    }
    owner.set(old, track);
    renames.set(track, old);
  }
  return renames;
}

/** What importing each track would change, as data. Reads only. */
export function buildPlan(root: string): Plan {
  const tracks = discoverTracks(root);
  const adrRoot = path.join(root, 'docs', 'adr');
  const files = new Map(tracks.map((track) => [track, trackFiles(track)]));
  const renames = findRenames(adrRoot, tracks, files);
  const plan = tracks.map((track) => planTrack(root, track, files.get(track) ?? [], renames.get(track)));
  // The repository's own ADRs still placed directly in docs/adr/: the root
  // files no track ships. They move to docs/adr/local/, as a last entry
  // that has no ADR to classify.
  const shipped = new Set([...files.values()].flat());
  const own = existsSync(adrRoot) ? markdownFiles(adrRoot).filter((file) => !shipped.has(file)) : [];
  if (own.length > 0) plan.push({ namespace: OWN, adrDir: path.join(adrRoot, OWN), adrs: [], migration: own });
  return plan;
}

/** True when anything in the plan needs a human. */
export function hasPendingChanges(plan: { adrs: { category: Category }[]; migration: unknown[]; rename?: string }[]): boolean {
  return plan.some(
    (s) => s.rename !== undefined || s.migration.length > 0 || s.adrs.some((a) => a.category !== 'unchanged'),
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
  const lines: string[] = plan.some((s) => s.namespace !== OWN) ? [] : ['no track found'];
  for (const track of plan) {
    const counts = ORDER.map((category): [Category, number] => [
      category,
      track.adrs.filter((a) => a.category === category).length,
    ]).filter(([category, n]) => n > 0 || category === 'unchanged');
    if (track.namespace !== OWN) lines.push(`${track.namespace}: ${counts.map(([c, n]) => `${n} ${c}`).join(', ')}`);

    for (const adr of track.adrs) {
      if (adr.category === 'unchanged' && !all) continue;
      const revision = adr.category === 'revised' ? ` (revision ${adr.from} → ${adr.to})` : '';
      const verdict = all ? `${(adr.status ?? '-').padEnd(10)}  ` : '';
      lines.push(row(adr.category, verdict + label(adr) + revision), ...checkLines(adr));
    }

    if (track.rename) lines.push(`rename: ${rel(track.rename)} → ${rel(track.namespace)}`);
    if (track.migration.length > 0) {
      const n = track.migration.length;
      lines.push(`migration: ${n} file${n === 1 ? '' : 's'} docs/adr/ → docs/adr/${track.namespace}/`);
      for (const file of track.migration) lines.push(row('move', file));
    }
  }
  return `${lines.join('\n')}\n`;
}
