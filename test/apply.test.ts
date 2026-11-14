import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/cli.ts';
import { formatApply, planActions } from '../src/apply.ts';
import { buildPlan } from '../src/plan.ts';
import type { PlannedAdr, SourcePlan } from '../src/plan.ts';
import { adr, cleanup, makeProject, withAgents } from './helpers/project.ts';

after(cleanup);

const bin = fileURLToPath(new URL('../bin/ontrack.ts', import.meta.url));

async function run(root: string, ...argv: string[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(argv, io);
  return { code, stdout, stderr };
}

const read = (root: string, rel: string) => readFileSync(path.join(root, rel), 'utf8');

function snapshot(root: string) {
  return Object.fromEntries(
    readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile() && !path.join(e.parentPath, e.name).includes(`${path.sep}.git${path.sep}`))
      .map((e) => {
        const file = path.join(e.parentPath, e.name);
        return [path.relative(root, file), readFileSync(file).toString('base64')];
      }),
  );
}

// Same plan as plan

test('nothing to apply: same output as plan, exit 0', async () => {
  const root = withAgents(makeProject({ sources: { platform: { 'A.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1) } }));
  const before = snapshot(root);
  const r = await run(root, 'apply');
  assert.equal(r.stdout, 'platform: 1 unchanged\n');
  assert.equal(r.code, 0);
  assert.deepEqual(snapshot(root), before);
});

// Importing new ADRs

test('new ADR imported byte for byte', async () => {
  const content = `${adr(1, 'proposed', 'Observability')}\nbinary-ish é text\n`;
  const root = makeProject({ sources: { platform: { 'SDR-0015.md': content } } });
  const r = await run(root, 'apply');
  assert.equal(read(root, 'docs/adr/platform/SDR-0015.md'), content);
  assert.equal(r.stdout, 'platform: 1 imported\n  imported      SDR-0015  Observability\nAGENTS.md: rules block created\n');
  assert.equal(r.code, 0);
});

test('next step on stderr while ADRs are proposed, in a shell form and a prompt form', async () => {
  const root = makeProject({ sources: { platform: { 'A.md': adr(1), 'B.md': adr(1) } } });
  const first = await run(root, 'apply');
  assert.equal(
    first.stderr,
    'next: 2 proposed ADRs to rule\n  from a shell:  claude "$(npx ontrack review)"\n  as a prompt:   Run `npx ontrack review` and follow its output.\n',
  );
  assert.doesNotMatch(first.stdout, /next:/);
  writeFileSync(path.join(root, 'docs/adr/platform/A.md'), adr(1, 'accepted'));
  const second = await run(root, 'apply');
  assert.match(second.stderr, /^next: 1 proposed ADR to rule$/m);
  writeFileSync(path.join(root, 'docs/adr/platform/B.md'), adr(1, 'accepted'));
  assert.equal((await run(root, 'apply')).stderr, '');
});

test('next step once nothing is proposed: the revised ADRs to rule again', async () => {
  const root = withAgents(makeProject({ sources: { platform: { 'A.md': adr(2), 'B.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1, 'accepted') } }));
  assert.match((await run(root, 'apply')).stderr, /^next: 1 proposed ADR to rule$/m);
  writeFileSync(path.join(root, 'docs/adr/platform/B.md'), adr(1, 'accepted'));
  assert.match((await run(root, 'apply')).stderr, /^next: 1 revised ADR to rule again\n {2}from a shell: /);
});

// Flat-layout migration

test('outside git: flat files renamed with identical content', async () => {
  const root = makeProject({ sources: { platform: { 'SDR-0006.md': adr(1) } }, local: { 'docs/adr/SDR-0006.md': adr(1, 'accepted') } });
  const r = await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'docs/adr/SDR-0006.md')), false);
  assert.equal(read(root, 'docs/adr/platform/SDR-0006.md'), adr(1, 'accepted'));
  assert.match(r.stdout, /^ {2}moved {9}SDR-0006\.md$/m);
  assert.equal(r.code, 0);
});

test('inside git: flat files moved with git mv', async () => {
  const root = makeProject({ sources: { platform: { 'SDR-0006.md': adr(1) } }, local: { 'docs/adr/SDR-0006.md': adr(1, 'accepted') } });
  const git = (...args: string[]) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  git('init', '-q');
  git('add', 'docs');
  const commit = git('-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'init');
  assert.equal(commit.status, 0, commit.stderr);
  await run(root, 'apply');
  assert.match(git('status', '--porcelain').stdout, /^R {2}docs\/adr\/SDR-0006\.md -> docs\/adr\/platform\/SDR-0006\.md$/m);
  assert.equal(read(root, 'docs/adr/platform/SDR-0006.md'), adr(1, 'accepted'));
});

test('inside git: an untracked flat file falls back to a rename', async () => {
  const root = makeProject({ sources: { platform: { 'SDR-0006.md': adr(1) } }, local: { 'docs/adr/SDR-0006.md': adr(1) } });
  spawnSync('git', ['init', '-q'], { cwd: root });
  await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'docs/adr/platform/SDR-0006.md')), true);
  assert.equal(existsSync(path.join(root, 'docs/adr/SDR-0006.md')), false);
});

// Links

test('links broken by the migration are listed, files untouched', async () => {
  const arc42 = 'Intro\n'.repeat(11) + 'See [commits](adr/SDR-0006.md#context).\n';
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(1) } },
    local: { 'docs/adr/SDR-0006.md': adr(1), 'docs/arc42.md': arc42 },
  });
  const r = await run(root, 'apply');
  assert.match(r.stdout, /^links to update:\n {2}docs\/arc42\.md:12 {2}adr\/SDR-0006\.md → adr\/platform\/SDR-0006\.md$/m);
  assert.equal(read(root, 'docs/arc42.md'), arc42);
});

// Verdicts are never overwritten

test('revised ADR left alone, exit 2, listed under remaining', async () => {
  const root = makeProject({
    sources: { platform: { 'NEW.md': adr(1), 'REV.md': adr(2, 'proposed', 'Commits') } },
    local: { 'docs/adr/platform/REV.md': adr(1, 'accepted') },
  });
  const r = await run(root, 'apply', '--confirm', 'all', '--prune');
  assert.equal(read(root, 'docs/adr/platform/REV.md'), adr(1, 'accepted'));
  assert.equal(r.code, 2);
  assert.match(r.stdout, /^ {2}imported {6}NEW$/m);
  assert.match(r.stdout, /^remaining:\nplatform: 1 revised, 1 unchanged\n {2}revised {7}REV {2}Commits \(revision 1 → 2\)$/m);
});

// Pruning

test('removed ADRs stay without --prune and go with it', async () => {
  const project = () => makeProject({
    sources: { platform: { 'A.md': adr(1) } },
    local: { 'docs/adr/platform/A.md': adr(1), 'docs/adr/platform/OLD.md': adr(1, 'accepted', 'Hosting') },
  });
  const kept = project();
  assert.equal((await run(kept, 'apply')).code, 2);
  assert.equal(existsSync(path.join(kept, 'docs/adr/platform/OLD.md')), true);

  const pruned = project();
  const r = await run(pruned, 'apply', '--prune');
  assert.equal(existsSync(path.join(pruned, 'docs/adr/platform/OLD.md')), false);
  assert.match(r.stdout, /^ {2}pruned {8}OLD {2}Hosting$/m);
  assert.equal(r.code, 0);
});

// Confirming

test('confirm one ADR: only the revision line changes', async () => {
  const local = '---\nstatus: accepted\nrevision: 0\nauthors:\n- Jane\n---\n\nDecision text.\n';
  const root = makeProject({
    sources: { platform: { 'SDR-0003.md': adr(2, 'proposed', 'Architecture') } },
    local: { 'docs/adr/platform/SDR-0003.md': local },
  });
  const r = await run(root, 'apply', '--confirm', 'SDR-0003');
  assert.equal(read(root, 'docs/adr/platform/SDR-0003.md'), local.replace('revision: 0', 'revision: 2'));
  assert.match(r.stdout, /^ {2}confirmed {5}SDR-0003 {2}Architecture \(revision 2\)$/m);
  assert.equal(r.code, 0);
});

test('a flat undetermined ADR is confirmed at its new place', async () => {
  const root = makeProject({ sources: { platform: { 'U.md': adr(3) } }, local: { 'docs/adr/U.md': adr(0) } });
  await run(root, 'apply', '--confirm', 'U.md');
  assert.equal(read(root, 'docs/adr/platform/U.md'), adr(3));
});

test('confirm a name that is not undetermined: code 1, nothing written', async () => {
  const root = makeProject({
    sources: { platform: { 'NEW.md': adr(1), 'SDR-0006.md': adr(2) } },
    local: { 'docs/adr/platform/SDR-0006.md': adr(1) },
  });
  const before = snapshot(root);
  const r = await run(root, 'apply', '--confirm', 'SDR-0006');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /SDR-0006/);
  assert.deepEqual(snapshot(root), before);
});

test('confirm all skips undetermined ADRs whose upstream has no revision', async () => {
  const root = makeProject({
    sources: { platform: { 'A.md': adr(2), 'B.md': adr() } },
    local: { 'docs/adr/platform/A.md': adr(0), 'docs/adr/platform/B.md': adr(0) },
  });
  const r = await run(root, 'apply', '--confirm', 'all');
  assert.equal(read(root, 'docs/adr/platform/A.md'), adr(2));
  assert.equal(read(root, 'docs/adr/platform/B.md'), adr(0));
  assert.equal(r.code, 2);
});

test('an existing target aborts before any write', () => {
  const root = makeProject({ sources: { platform: { 'A.md': adr(1), 'B.md': adr(1) } }, local: { 'docs/adr/A.md': adr(1) } });
  const plan = buildPlan(root);
  // Simulate a race: the target of the move appears after the plan was built.
  mkdirSync(path.join(root, 'docs/adr/platform'), { recursive: true });
  writeFileSync(path.join(root, 'docs/adr/platform/A.md'), 'x');
  assert.throws(() => planActions(root, plan), /docs\/adr\/platform\/A\.md already exists/);
});

test('a mistyped option writes nothing', async () => {
  const root = makeProject({ sources: { platform: { 'NEW.md': adr(1) } } });
  const before = snapshot(root);
  const r = await run(root, 'apply', '--prunee');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /prunee/);
  assert.equal(r.stdout, '');
  assert.deepEqual(snapshot(root), before);
});

// Dry run

test('dry run of confirm all names both ADRs and writes nothing', async () => {
  const root = makeProject({
    sources: { platform: { 'A.md': adr(2), 'B.md': adr(4), 'N.md': adr(1) } },
    local: { 'docs/adr/platform/A.md': adr(0), 'docs/adr/B.md': adr() },
  });
  const before = snapshot(root);
  const r = await run(root, 'apply', '--confirm', 'all', '--dry-run');
  assert.deepEqual(snapshot(root), before);
  assert.equal(r.stdout, [
    'dry run: nothing written',
    'platform: 1 imported, 1 moved, 2 confirmed',
    '  imported      N',
    '  moved         B.md',
    '  confirmed     A (revision 2)',
    '  confirmed     B (revision 4)',
    'AGENTS.md: rules block to create',
    '',
  ].join('\n'));
  assert.equal(r.code, 2);
});

test('the README example is what formatApply prints', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const example = /```\n(dry run: [\s\S]*?)```/.exec(readme)?.[1];
  const source: SourcePlan = { namespace: 'platform', adrDir: 'node_modules/platform/adr', adrs: [], migration: [] };
  const unchanged = (name: string): PlannedAdr => ({ name, category: 'unchanged', title: null });
  const to = (name: string) => `docs/adr/platform/${name}`;
  const out = formatApply({
    dryRun: true,
    actions: [
      { kind: 'imported', source, adr: { name: 'SDR-0015.md', category: 'new', title: 'Observability' }, from: 'node_modules/platform/adr/SDR-0015.md', to: to('SDR-0015.md') },
      { kind: 'moved', source, file: 'SDR-0006.md', from: 'docs/adr/SDR-0006.md', to: to('SDR-0006.md') },
      { kind: 'moved', source, file: 'SDR-0010.md', from: 'docs/adr/SDR-0010.md', to: to('SDR-0010.md') },
    ],
    links: [{ file: 'docs/arc42.md', line: 12, old: 'adr/SDR-0006.md', new: 'adr/platform/SDR-0006.md' }],
    remaining: [{
      ...source,
      adrs: [
        unchanged('SDR-0006.md'),
        { name: 'SDR-0010.md', category: 'revised', title: 'Forge and CI', from: 3, to: 4 },
        unchanged('SDR-0015.md'),
      ],
    }],
  });
  assert.equal(out, example);
});

// Idempotence, through the real bin

test('apply twice: the second run writes nothing and exits like plan', () => {
  const root = makeProject({
    sources: { platform: { 'N.md': adr(1), 'F.md': adr(1), 'R.md': adr(2) } },
    local: { 'docs/adr/F.md': adr(1), 'docs/adr/platform/R.md': adr(1) },
  });
  const first = spawnSync(process.execPath, [bin, 'apply'], { cwd: root, encoding: 'utf8' });
  assert.equal(first.status, 2, first.stderr);
  const between = snapshot(root);
  const second = spawnSync(process.execPath, [bin, 'apply'], { cwd: root, encoding: 'utf8' });
  const plan = spawnSync(process.execPath, [bin, 'plan'], { cwd: root, encoding: 'utf8' });
  assert.deepEqual(snapshot(root), between);
  assert.equal(second.status, plan.status);
  assert.equal(second.stdout, plan.stdout);
});

// Synchronizing checks

const ruled = (...extra: string[]) => ['---', 'status: accepted', 'revision: 1', ...extra, 'traits:', '  commits:', '    tool: commitlint', '---', '', 'Body.', ''].join('\n');
const shipped = (revision: number, ...extra: string[]) => ['---', 'status: proposed', `revision: ${revision}`, ...extra, 'traits:', '  commits:', '    tool:', '---', '', 'Body.', ''].join('\n');
const FILE = 'docs/adr/trivoallan/ADR-0006-commits.md';
const synced = (local: string, upstream: string, at = FILE) =>
  makeProject({ sources: { trivoallan: { 'ADR-0006-commits.md': upstream } }, local: { [at]: local } });

test('check added to a ruled ADR: one line after revision, then unchanged', async () => {
  const root = synced(ruled(), shipped(1, 'check: npx commitlint --last'));
  await run(root, 'apply');
  assert.equal(read(root, FILE), ruled('check: npx commitlint --last'));
  assert.equal(buildPlan(root)[0].adrs[0].category, 'unchanged');
  const again = await run(root, 'apply');
  assert.equal(again.stdout, 'trivoallan: 1 unchanged\n');
  assert.equal(again.code, 0);
});

test('check replaced in place, comment included', async () => {
  const root = synced(ruled('check: exit 0'), shipped(1, 'check: exit 1  # stricter'));
  await run(root, 'apply');
  assert.equal(read(root, FILE), ruled('check: exit 1  # stricter'));
});

test('check removed when the source has none', async () => {
  const root = synced(ruled('check: exit 0'), shipped(1));
  await run(root, 'apply');
  assert.equal(read(root, FILE), ruled());
});

test('CRLF local copy: the inserted line ends with CRLF', async () => {
  const root = synced(ruled().replaceAll('\n', '\r\n'), shipped(1, 'check: exit 0'));
  await run(root, 'apply');
  assert.equal(read(root, FILE), ruled('check: exit 0').replaceAll('\n', '\r\n'));
});

test('flat-layout copy: moved, then synchronized', async () => {
  const root = synced(ruled(), shipped(1, 'check: exit 0'), 'docs/adr/ADR-0006-commits.md');
  await run(root, 'apply');
  assert.equal(read(root, FILE), ruled('check: exit 0'));
  assert.equal(existsSync(path.join(root, 'docs/adr/ADR-0006-commits.md')), false);
});

test('revised ADR does not get the new check', async () => {
  const root = synced(ruled(), shipped(2, 'check: exit 0'));
  const r = await run(root, 'apply');
  assert.equal(read(root, FILE), ruled());
  assert.equal(r.code, 2);
});

test('only a check to synchronize: synced with its lines, exit 0; dry run writes nothing', async () => {
  const root = withAgents(synced(ruled('check: exit 0'), shipped(1, 'check: exit 1')));
  const before = snapshot(root);
  const expected = 'trivoallan: 1 synced\n  synced        ADR-0006-commits\n    - check: exit 0\n    + check: exit 1\n';
  const dry = await run(root, 'apply', '--dry-run');
  assert.equal(dry.stdout, `dry run: nothing written\n${expected}`);
  assert.equal(dry.code, 0);
  assert.deepEqual(snapshot(root), before);
  const r = await run(root, 'apply');
  assert.equal(r.stdout, expected);
  assert.equal(r.code, 0);
});
