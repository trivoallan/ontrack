import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { formatPlan, hasPendingChanges, label, row, stem } from './plan.mjs';
import { setRevision } from './revision.mjs';

const KINDS = ['imported', 'moved', 'confirmed', 'pruned'];

/**
 * The actions `apply` would take on `plan`, checked before anything is
 * written. Throws on a `--confirm` name it cannot honor or a taken target.
 */
export function planActions(root, plan, { prune = false, confirm = [] } = {}) {
  const all = confirm.includes('all');
  const wanted = new Set(confirm.filter((n) => n !== 'all').map(stem));
  const confirmed = new Set();
  const actions = [];

  for (const source of plan) {
    const dir = path.join(root, 'docs', 'adr', source.namespace);
    const at = (name) => path.join(dir, name);
    for (const adr of source.adrs) {
      if (adr.category === 'new') {
        actions.push({ kind: 'imported', source, adr, from: path.join(source.adrDir, adr.name), to: at(adr.name) });
      } else if (adr.category === 'removed' && prune) {
        actions.push({ kind: 'pruned', source, adr, to: at(adr.name) });
      } else if (adr.category === 'undetermined' && adr.to !== null && (all || wanted.has(stem(adr.name)))) {
        actions.push({ kind: 'confirmed', source, adr, to: at(adr.name) });
        confirmed.add(stem(adr.name));
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

function insideGitWorkTree(root) {
  const r = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: root, encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim() === 'true';
}

/** Executes checked actions, in order: import, move, confirm, prune. */
export function runActions(root, actions) {
  const git = insideGitWorkTree(root);
  for (const a of actions) {
    if (a.kind !== 'pruned') mkdirSync(path.dirname(a.to), { recursive: true });
    if (a.kind === 'imported') copyFileSync(a.from, a.to);
    if (a.kind === 'moved') {
      const mv = git && spawnSync('git', ['mv', a.from, a.to], { cwd: root });
      if (!mv || mv.status !== 0) renameSync(a.from, a.to);
    }
    if (a.kind === 'confirmed') writeFileSync(a.to, setRevision(readFileSync(a.to, 'utf8'), a.adr.to));
    if (a.kind === 'pruned') rmSync(a.to);
  }
}

/** The plan `actions` would leave, without running them (for `--dry-run`). */
export function planAfter(plan, actions) {
  const done = new Set(actions.filter((a) => a.adr && a.kind !== 'pruned').map((a) => a.adr));
  const pruned = new Set(actions.filter((a) => a.kind === 'pruned').map((a) => a.adr));
  return plan.map((source) => ({
    ...source,
    adrs: source.adrs
      .filter((adr) => !pruned.has(adr))
      .map((adr) => (done.has(adr) ? { ...adr, category: 'unchanged' } : adr)),
    migration: [],
  }));
}

function actionLine(a) {
  if (a.kind === 'moved') return row('moved', a.file);
  if (a.kind === 'confirmed') return row('confirmed', `${label(a.adr)} (revision ${a.adr.to})`);
  return row(a.kind, label(a.adr));
}

/** The `apply` output (see README). */
export function formatApply({ actions, links, remaining, dryRun }) {
  const lines = dryRun ? ['dry run: nothing written'] : [];
  const sources = [...new Set(actions.map((a) => a.source.namespace))];
  for (const namespace of sources) {
    const mine = actions.filter((a) => a.source.namespace === namespace);
    const counts = KINDS.map((k) => [k, mine.filter((a) => a.kind === k).length]).filter(([, n]) => n > 0);
    lines.push(`${namespace}: ${counts.map(([k, n]) => `${n} ${k}`).join(', ')}`);
    lines.push(...mine.map(actionLine));
  }
  if (links.length > 0) {
    lines.push('links to update:');
    for (const l of links) lines.push(`  ${l.file}:${l.line}  ${l.old} → ${l.new}`);
  }
  let out = `${lines.join('\n')}\n`;
  if (hasPendingChanges(remaining)) out += `remaining:\n${formatPlan(remaining)}`;
  return out;
}
