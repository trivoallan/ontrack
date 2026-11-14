import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/cli.mjs';
import { formatApply, planActions } from '../src/apply.mjs';
import { buildPlan } from '../src/plan.mjs';
import { adr, cleanup, makeProject, withAgents } from './helpers/project.mjs';

after(cleanup);

const bin = fileURLToPath(new URL('../bin/ontrack.mjs', import.meta.url));

async function run(root, ...argv) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s) => { stdout += s; } },
    stderr: { write: (s) => { stderr += s; } },
  };
  const code = await main(argv, io);
  return { code, stdout, stderr };
}

const read = (root, rel) => readFileSync(path.join(root, rel), 'utf8');

function snapshot(root) {
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
  const git = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
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
  const example = /```\n(dry run: [\s\S]*?)```/.exec(readme)[1];
  const source = { namespace: 'platform' };
  const unchanged = (name) => ({ name, category: 'unchanged' });
  const out = formatApply({
    dryRun: true,
    actions: [
      { kind: 'imported', source, adr: { name: 'SDR-0015.md', title: 'Observability' } },
      { kind: 'moved', source, file: 'SDR-0006.md' },
      { kind: 'moved', source, file: 'SDR-0010.md' },
    ],
    links: [{ file: 'docs/arc42.md', line: 12, old: 'adr/SDR-0006.md', new: 'adr/platform/SDR-0006.md' }],
    remaining: [{
      namespace: 'platform',
      migration: [],
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
