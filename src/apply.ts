import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Link } from './links.ts';
import { checkLines, formatPlan, hasPendingChanges, label, row, stem } from './plan.ts';
import type { CheckChange, Plan, PlannedAdr, TrackPlan } from './plan.ts';
import { setCheckLine, setRevision } from './revision.ts';
import { OntrackError } from './errors.ts';

// An undetermined ADR whose upstream copy carries a revision to adopt.
type ConfirmableAdr = PlannedAdr & { to: number };
// An up-to-date ADR whose check line differs from its track's.
type SyncableAdr = PlannedAdr & { check: CheckChange };
type Target = { track: TrackPlan; to: string };
export type Action =
  | (Target & { kind: 'renamed'; from: string })
  | (Target & { kind: 'imported'; adr: PlannedAdr; from: string })
  | (Target & { kind: 'moved'; file: string; from: string })
  | (Target & { kind: 'confirmed'; adr: ConfirmableAdr })
  | (Target & { kind: 'synced'; adr: SyncableAdr })
  | (Target & { kind: 'pruned'; adr: PlannedAdr });
type Kind = Action['kind'];

const KINDS: Kind[] = ['renamed', 'imported', 'moved', 'confirmed', 'synced', 'pruned'];
const syncable = (adr: PlannedAdr): adr is SyncableAdr => adr.check !== undefined;
const confirmable = (adr: PlannedAdr): adr is ConfirmableAdr =>
  adr.category === 'undetermined' && typeof adr.to === 'number';

/**
 * The actions `apply` would take on `plan`, checked before anything is
 * written. Throws on a `--confirm` name it cannot honor or a taken target.
 */
export function planActions(
  root: string,
  plan: Plan,
  { prune = false, confirm = [] }: { prune?: boolean; confirm?: string[] } = {},
): Action[] {
  const all = confirm.includes('all');
  const wanted = new Set(confirm.filter((n) => n !== 'all').map(stem));
  const confirmed = new Set<string>();
  const actions: Action[] = [];

  for (const track of plan) {
    const dir = path.join(root, 'docs', 'adr', track.namespace);
    const at = (name: string) => path.join(dir, name);
    if (track.rename) actions.push({ kind: 'renamed', track, from: path.join(root, 'docs', 'adr', track.rename), to: dir });
    for (const adr of track.adrs) {
      if (adr.category === 'new') {
        actions.push({ kind: 'imported', track, adr, from: path.join(track.adrDir, adr.name), to: at(adr.name) });
      } else if (adr.category === 'removed' && prune) {
        actions.push({ kind: 'pruned', track, adr, to: at(adr.name) });
      } else if (confirmable(adr) && (all || wanted.has(stem(adr.name)))) {
        actions.push({ kind: 'confirmed', track, adr, to: at(adr.name) });
        confirmed.add(stem(adr.name));
      } else if (syncable(adr)) {
        actions.push({ kind: 'synced', track, adr, to: at(adr.name) });
      }
    }
    for (const file of track.migration) {
      actions.push({ kind: 'moved', track, file, from: path.join(root, 'docs', 'adr', file), to: at(file) });
    }
  }

  for (const name of wanted) {
    if (!confirmed.has(name)) {
      throw new OntrackError('E205', `cannot confirm "${name}": it is not an undetermined ADR with an upstream revision`);
    }
  }
  for (const a of actions) {
    if ((a.kind === 'imported' || a.kind === 'moved' || a.kind === 'renamed') && existsSync(a.to)) {
      const rel = (file: string) => path.relative(root, file).split(path.sep).join('/');
      const moved = a.kind === 'imported' ? '' : `, ${rel(a.from)} cannot move there`;
      throw new OntrackError('E204', `${rel(a.to)} already exists${moved}; nothing was written`);
    }
  }
  return actions.sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind));
}

function insideGitWorkTree(root: string): boolean {
  const r = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: root, encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim() === 'true';
}

/** Executes checked actions, in order: rename, import, move, confirm, sync, prune. */
export function runActions(root: string, actions: Action[]): void {
  const git = insideGitWorkTree(root);
  for (const a of actions) {
    if (a.kind !== 'pruned') mkdirSync(path.dirname(a.to), { recursive: true });
    if (a.kind === 'imported') copyFileSync(a.from, a.to);
    if (a.kind === 'moved' || a.kind === 'renamed') {
      const mv = git && spawnSync('git', ['mv', a.from, a.to], { cwd: root });
      if (!mv || mv.status !== 0) renameSync(a.from, a.to);
    }
    if (a.kind === 'confirmed') writeFileSync(a.to, setRevision(readFileSync(a.to, 'utf8'), a.adr.to));
    if (a.kind === 'synced') writeFileSync(a.to, setCheckLine(readFileSync(a.to, 'utf8'), a.adr.check.to));
    if (a.kind === 'pruned') rmSync(a.to);
  }
}

/** The plan `actions` would leave, without running them (for `--dry-run`). */
export function planAfter(plan: Plan, actions: Action[]): Plan {
  const done = new Set(actions.flatMap((a) => (a.kind === 'imported' || a.kind === 'confirmed' || a.kind === 'synced' ? [a.adr] : [])));
  const pruned = new Set(actions.flatMap((a) => (a.kind === 'pruned' ? [a.adr] : [])));
  return plan.map((track) => ({
    ...track,
    adrs: track.adrs
      .filter((adr) => !pruned.has(adr))
      .map((adr): PlannedAdr => (done.has(adr) ? { ...adr, category: 'unchanged' } : adr)),
    migration: [],
    rename: undefined,
  }));
}

const folder = (dir: string) => `docs/adr/${dir}/`;

function actionLine(a: Action): string {
  if (a.kind === 'renamed') return row('renamed', `${folder(a.track.rename ?? '')} → ${folder(a.track.namespace)}`);
  if (a.kind === 'moved') return row('moved', a.file);
  if (a.kind === 'confirmed') return row('confirmed', `${label(a.adr)} (revision ${a.adr.to})`);
  return row(a.kind, label(a.adr));
}

/** The `apply` output (see docs/commands.md). */
export function formatApply({
  actions,
  links,
  supersedes = [],
  agents = [],
  remaining,
  dryRun,
}: {
  actions: Action[];
  links: Link[];
  supersedes?: Link[];
  agents?: string[];
  remaining: Plan;
  dryRun?: boolean;
}): string {
  const lines = dryRun ? ['dry run: nothing written'] : [];
  const tracks = [...new Set(actions.map((a) => a.track.namespace))];
  for (const namespace of tracks) {
    const mine = actions.filter((a) => a.track.namespace === namespace);
    const counts = KINDS.map((k): [Kind, number] => [k, mine.filter((a) => a.kind === k).length]).filter(([, n]) => n > 0);
    lines.push(`${namespace}: ${counts.map(([k, n]) => `${n} ${k}`).join(', ')}`);
    lines.push(...mine.flatMap((a) => [actionLine(a), ...(a.kind === 'synced' ? checkLines(a.adr) : [])]));
  }
  if (links.length > 0) {
    lines.push('links to update:');
    for (const l of links) lines.push(`  ${l.file}:${l.line}  ${l.old} → ${l.new}`);
  }
  if (supersedes.length > 0) {
    lines.push('supersedes to update:');
    for (const l of supersedes) lines.push(`  ${l.file}:${l.line}  ${l.old} → ${l.new}`);
  }
  lines.push(...agents);
  let out = lines.length > 0 ? `${lines.join('\n')}\n` : '';
  if (hasPendingChanges(remaining)) out += `remaining:\n${formatPlan(remaining)}`;
  return out;
}
