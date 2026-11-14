import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Link } from './links.ts';
import { checkLines, formatPlan, hasPendingChanges, label, row, stem } from './plan.ts';
import type { CheckChange, Plan, PlannedAdr, SourcePlan } from './plan.ts';
import { setCheckLine, setRevision } from './revision.ts';

// An undetermined ADR whose upstream copy carries a revision to adopt.
type ConfirmableAdr = PlannedAdr & { to: number };
// An up-to-date ADR whose check line differs from its source's.
type SyncableAdr = PlannedAdr & { check: CheckChange };
type Target = { source: SourcePlan; to: string };
export type Action =
  | (Target & { kind: 'imported'; adr: PlannedAdr; from: string })
  | (Target & { kind: 'moved'; file: string; from: string })
  | (Target & { kind: 'confirmed'; adr: ConfirmableAdr })
  | (Target & { kind: 'synced'; adr: SyncableAdr })
  | (Target & { kind: 'pruned'; adr: PlannedAdr });
type Kind = Action['kind'];

const KINDS: Kind[] = ['imported', 'moved', 'confirmed', 'synced', 'pruned'];
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

  for (const source of plan) {
    const dir = path.join(root, 'docs', 'adr', source.namespace);
    const at = (name: string) => path.join(dir, name);
    for (const adr of source.adrs) {
      if (adr.category === 'new') {
        actions.push({ kind: 'imported', source, adr, from: path.join(source.adrDir, adr.name), to: at(adr.name) });
      } else if (adr.category === 'removed' && prune) {
        actions.push({ kind: 'pruned', source, adr, to: at(adr.name) });
      } else if (confirmable(adr) && (all || wanted.has(stem(adr.name)))) {
        actions.push({ kind: 'confirmed', source, adr, to: at(adr.name) });
        confirmed.add(stem(adr.name));
      } else if (syncable(adr)) {
        actions.push({ kind: 'synced', source, adr, to: at(adr.name) });
      }
    }
    for (const file of source.migration) {
      actions.push({ kind: 'moved', source, file, from: path.join(root, 'docs', 'adr', file), to: at(file) });
    }
  }

  for (const name of wanted) {
    if (!confirmed.has(name)) {
      throw new Error(`cannot confirm "${name}": it is not an undetermined ADR with an upstream revision`);
    }
  }
  for (const a of actions) {
    if ((a.kind === 'imported' || a.kind === 'moved') && existsSync(a.to)) {
      throw new Error(`${path.relative(root, a.to)} already exists; nothing was written`);
    }
  }
  return actions.sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind));
}

function insideGitWorkTree(root: string): boolean {
  const r = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: root, encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim() === 'true';
}

/** Executes checked actions, in order: import, move, confirm, sync, prune. */
export function runActions(root: string, actions: Action[]): void {
  const git = insideGitWorkTree(root);
  for (const a of actions) {
    if (a.kind !== 'pruned') mkdirSync(path.dirname(a.to), { recursive: true });
    if (a.kind === 'imported') copyFileSync(a.from, a.to);
    if (a.kind === 'moved') {
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
  return plan.map((source) => ({
    ...source,
    adrs: source.adrs
      .filter((adr) => !pruned.has(adr))
      .map((adr): PlannedAdr => (done.has(adr) ? { ...adr, category: 'unchanged' } : adr)),
    migration: [],
  }));
}

function actionLine(a: Action): string {
  if (a.kind === 'moved') return row('moved', a.file);
  if (a.kind === 'confirmed') return row('confirmed', `${label(a.adr)} (revision ${a.adr.to})`);
  return row(a.kind, label(a.adr));
}

/** The `apply` output (see README). */
export function formatApply({
  actions,
  links,
  agents = [],
  remaining,
  dryRun,
}: {
  actions: Action[];
  links: Link[];
  agents?: string[];
  remaining: Plan;
  dryRun?: boolean;
}): string {
  const lines = dryRun ? ['dry run: nothing written'] : [];
  const sources = [...new Set(actions.map((a) => a.source.namespace))];
  for (const namespace of sources) {
    const mine = actions.filter((a) => a.source.namespace === namespace);
    const counts = KINDS.map((k): [Kind, number] => [k, mine.filter((a) => a.kind === k).length]).filter(([, n]) => n > 0);
    lines.push(`${namespace}: ${counts.map(([k, n]) => `${n} ${k}`).join(', ')}`);
    lines.push(...mine.flatMap((a) => [actionLine(a), ...(a.kind === 'synced' ? checkLines(a.adr) : [])]));
  }
  if (links.length > 0) {
    lines.push('links to update:');
    for (const l of links) lines.push(`  ${l.file}:${l.line}  ${l.old} → ${l.new}`);
  }
  lines.push(...agents);
  let out = lines.length > 0 ? `${lines.join('\n')}\n` : '';
  if (hasPendingChanges(remaining)) out += `remaining:\n${formatPlan(remaining)}`;
  return out;
}
