import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/cli.ts';
import { formatApply, planActions } from '../src/apply.ts';
import { buildPlan, formatPlan } from '../src/plan.ts';
import type { PlannedAdr, TrackPlan } from '../src/plan.ts';
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

const formatPlanOf = (root: string) => formatPlan(buildPlan(root));
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
  const root = withAgents(makeProject({ tracks: { platform: { 'A.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1) } }));
  const before = snapshot(root);
  const r = await run(root, 'apply');
  assert.equal(r.stdout, 'platform: 1 unchanged\n');
  assert.equal(r.code, 0);
  assert.deepEqual(snapshot(root), before);
});

// Importing new ADRs

test('new ADR imported byte for byte', async () => {
  const content = `${adr(1, 'proposed', 'Observability')}\nbinary-ish é text\n`;
  const root = makeProject({ tracks: { platform: { 'ADR-0015.md': content } } });
  const r = await run(root, 'apply');
  assert.equal(read(root, 'docs/adr/platform/ADR-0015.md'), content);
  assert.equal(r.stdout, 'platform: 1 imported\n  imported      ADR-0015  Observability\nAGENTS.md: instructions block created\n');
  assert.equal(r.code, 0);
});

test('next step on stderr while ADRs are proposed, in a shell form and a prompt form', async () => {
  const root = makeProject({ tracks: { platform: { 'A.md': adr(1), 'B.md': adr(1) } } });
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

test('next step names the package when the project does not install ontrack, since npx would run the unrelated `ontrack`', async () => {
  const root = makeProject({ tracks: { platform: { 'A.md': adr(1) } } });
  rmSync(path.join(root, 'node_modules/.bin/ontrack'));
  const r = await run(root, 'apply');
  assert.equal(
    r.stderr,
    'next: 1 proposed ADR to rule\n  from a shell:  claude "$(npx -p @trivoallan/ontrack ontrack review)"\n  as a prompt:   Run `npx -p @trivoallan/ontrack ontrack review` and follow its output.\n',
  );
  assert.ok(read(root, 'AGENTS.md').includes('run `npx -p @trivoallan/ontrack ontrack review [adr]`'));
});

test('next step once nothing is proposed: the revised ADRs to rule again', async () => {
  const root = withAgents(makeProject({ tracks: { platform: { 'A.md': adr(2), 'B.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1, 'accepted') } }));
  assert.match((await run(root, 'apply')).stderr, /^next: 1 proposed ADR to rule$/m);
  writeFileSync(path.join(root, 'docs/adr/platform/B.md'), adr(1, 'accepted'));
  assert.match((await run(root, 'apply')).stderr, /^next: 1 revised ADR to rule again\n {2}from a shell: /);
});

// Flat-layout migration

test('outside git: flat files renamed with identical content', async () => {
  const root = makeProject({ tracks: { platform: { 'ADR-0006.md': adr(1) } }, local: { 'docs/adr/ADR-0006.md': adr(1, 'accepted') } });
  const r = await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'docs/adr/ADR-0006.md')), false);
  assert.equal(read(root, 'docs/adr/platform/ADR-0006.md'), adr(1, 'accepted'));
  assert.match(r.stdout, /^ {2}moved {9}ADR-0006\.md$/m);
  assert.equal(r.code, 0);
});

test('inside git: flat files moved with git mv', async () => {
  const root = makeProject({ tracks: { platform: { 'ADR-0006.md': adr(1) } }, local: { 'docs/adr/ADR-0006.md': adr(1, 'accepted') } });
  const git = (...args: string[]) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  git('init', '-q');
  git('add', 'docs');
  const commit = git('-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'init');
  assert.equal(commit.status, 0, commit.stderr);
  await run(root, 'apply');
  assert.match(git('status', '--porcelain').stdout, /^R {2}docs\/adr\/ADR-0006\.md -> docs\/adr\/platform\/ADR-0006\.md$/m);
  assert.equal(read(root, 'docs/adr/platform/ADR-0006.md'), adr(1, 'accepted'));
});

test('inside git: an untracked flat file falls back to a rename', async () => {
  const root = makeProject({ tracks: { platform: { 'ADR-0006.md': adr(1) } }, local: { 'docs/adr/ADR-0006.md': adr(1) } });
  spawnSync('git', ['init', '-q'], { cwd: root });
  await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'docs/adr/platform/ADR-0006.md')), true);
  assert.equal(existsSync(path.join(root, 'docs/adr/ADR-0006.md')), false);
});

// Links

test('links broken by the migration are listed, files untouched', async () => {
  const arc42 = 'Intro\n'.repeat(11) + 'See [commits](adr/ADR-0006.md#context).\n';
  const root = makeProject({
    tracks: { platform: { 'ADR-0006.md': adr(1) } },
    local: { 'docs/adr/ADR-0006.md': adr(1), 'docs/arc42.md': arc42 },
  });
  const r = await run(root, 'apply');
  assert.match(r.stdout, /^links to update:\n {2}docs\/arc42\.md:12 {2}adr\/ADR-0006\.md → adr\/platform\/ADR-0006\.md$/m);
  assert.equal(read(root, 'docs/arc42.md'), arc42);
});

// Rulings are never overwritten

test('revised ADR left alone, exit 2, listed under remaining', async () => {
  const root = makeProject({
    tracks: { platform: { 'NEW.md': adr(1), 'REV.md': adr(2, 'proposed', 'Commits') } },
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
    tracks: { platform: { 'A.md': adr(1) } },
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

test('confirm without a name is a usage error, and writes nothing', async () => {
  const root = makeProject({ tracks: { platform: { 'ADR-0003.md': adr(2, 'proposed') } } });
  const r = await run(root, 'apply', '--confirm');
  assert.match(r.stderr, /^ontrack\[E001\]: Not enough arguments following: confirm$/m);
  assert.equal(r.code, 1);
  assert.equal(existsSync(path.join(root, 'docs/adr/platform/ADR-0003.md')), false);
});

test('confirm one ADR: only the revision line changes', async () => {
  const local = '---\nstatus: accepted\nrevision: 0\nauthors:\n- Jane\n---\n\nDecision text.\n';
  const root = makeProject({
    tracks: { platform: { 'ADR-0003.md': adr(2, 'proposed', 'Architecture') } },
    local: { 'docs/adr/platform/ADR-0003.md': local },
  });
  const r = await run(root, 'apply', '--confirm', 'ADR-0003');
  assert.equal(read(root, 'docs/adr/platform/ADR-0003.md'), local.replace('revision: 0', 'revision: 2'));
  assert.match(r.stdout, /^ {2}confirmed {5}ADR-0003 {2}Architecture \(revision 2\)$/m);
  assert.equal(r.code, 0);
});

test('a flat undetermined ADR is confirmed at its new place', async () => {
  const root = makeProject({ tracks: { platform: { 'U.md': adr(3) } }, local: { 'docs/adr/U.md': adr(0) } });
  await run(root, 'apply', '--confirm', 'U.md');
  assert.equal(read(root, 'docs/adr/platform/U.md'), adr(3));
});

test('confirm a name that is not undetermined: code 1, nothing written', async () => {
  const root = makeProject({
    tracks: { platform: { 'NEW.md': adr(1), 'ADR-0006.md': adr(2) } },
    local: { 'docs/adr/platform/ADR-0006.md': adr(1) },
  });
  const before = snapshot(root);
  const r = await run(root, 'apply', '--confirm', 'ADR-0006');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /ADR-0006/);
  assert.deepEqual(snapshot(root), before);
});

test('confirm all skips undetermined ADRs whose upstream has no revision', async () => {
  const root = makeProject({
    tracks: { platform: { 'A.md': adr(2), 'B.md': adr() } },
    local: { 'docs/adr/platform/A.md': adr(0), 'docs/adr/platform/B.md': adr(0) },
  });
  const r = await run(root, 'apply', '--confirm', 'all');
  assert.equal(read(root, 'docs/adr/platform/A.md'), adr(2));
  assert.equal(read(root, 'docs/adr/platform/B.md'), adr(0));
  assert.equal(r.code, 2);
});

test('an existing target aborts before any write', () => {
  const root = makeProject({ tracks: { platform: { 'A.md': adr(1), 'B.md': adr(1) } }, local: { 'docs/adr/A.md': adr(1) } });
  const plan = buildPlan(root);
  // Simulate a race: the target of the move appears after the plan was built.
  mkdirSync(path.join(root, 'docs/adr/platform'), { recursive: true });
  writeFileSync(path.join(root, 'docs/adr/platform/A.md'), 'x');
  assert.throws(() => planActions(root, plan), /docs\/adr\/platform\/A\.md already exists/);
});

test('a mistyped option writes nothing', async () => {
  const root = makeProject({ tracks: { platform: { 'NEW.md': adr(1) } } });
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
    tracks: { platform: { 'A.md': adr(2), 'B.md': adr(4), 'N.md': adr(1) } },
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
    'AGENTS.md: instructions block to create',
    '',
  ].join('\n'));
  assert.equal(r.code, 2);
});

test('the commands reference example is what formatApply prints', () => {
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  const example = /```\n(dry run: [\s\S]*?)```/.exec(reference)?.[1];
  const track: TrackPlan = { namespace: 'platform', adrDir: 'node_modules/platform/adr', adrs: [], migration: [] };
  const unchanged = (name: string): PlannedAdr => ({ name, category: 'unchanged', title: null });
  const to = (name: string) => `docs/adr/platform/${name}`;
  const out = formatApply({
    dryRun: true,
    actions: [
      { kind: 'imported', track, adr: { name: 'ADR-0015.md', category: 'new', title: 'Observability' }, from: 'node_modules/platform/adr/ADR-0015.md', to: to('ADR-0015.md') },
      { kind: 'moved', track, file: 'ADR-0006.md', from: 'docs/adr/ADR-0006.md', to: to('ADR-0006.md') },
      { kind: 'moved', track, file: 'ADR-0010.md', from: 'docs/adr/ADR-0010.md', to: to('ADR-0010.md') },
    ],
    links: [{ file: 'docs/arc42.md', line: 12, old: 'adr/ADR-0006.md', new: 'adr/platform/ADR-0006.md' }],
    remaining: [{
      ...track,
      adrs: [
        unchanged('ADR-0006.md'),
        { name: 'ADR-0010.md', category: 'revised', title: 'Forge and CI', from: 3, to: 4 },
        unchanged('ADR-0015.md'),
      ],
    }],
  });
  assert.equal(out, example);
});

// Idempotence, through the real bin

test('apply twice: the second run writes nothing and exits like plan', () => {
  const root = makeProject({
    tracks: { platform: { 'N.md': adr(1), 'F.md': adr(1), 'R.md': adr(2) } },
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
  makeProject({ tracks: { trivoallan: { 'ADR-0006-commits.md': upstream } }, local: { [at]: local } });

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

test('check removed when the track has none', async () => {
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

// Own ADRs migration

const git = (root: string, ...args: string[]) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });

test('own ADRs move to docs/adr/local/ with git, links listed, then nothing is left', async () => {
  const own = adr() + '[commits](platform/ADR-0006.md) [queue](ADR-0002-queue.md)\n';
  const root = makeProject({
    tracks: { platform: { 'ADR-0006.md': adr(1, 'accepted') } },
    local: {
      'docs/adr/ADR-0001-cache.md': own,
      'docs/adr/ADR-0002-queue.md': adr(undefined, 'accepted'),
      'docs/adr/platform/ADR-0006.md': adr(1, 'accepted'),
      'docs/index.md': 'a\nb\nc\n[cache](adr/ADR-0001-cache.md)\n',
    },
  });
  git(root, 'init', '-q');
  git(root, 'add', '.');
  git(root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'init');
  const dry = await run(root, 'apply', '--dry-run');
  assert.match(dry.stdout, /^dry run: nothing written\nlocal: 2 moved\n  moved         ADR-0001-cache\.md\n/);
  assert.ok(existsSync(path.join(root, 'docs/adr/ADR-0001-cache.md')));

  const r = await run(root, 'apply');
  assert.match(r.stdout, /^local: 2 moved\n  moved         ADR-0001-cache\.md\n  moved         ADR-0002-queue\.md\nlinks to update:\n/);
  assert.match(r.stdout, /  docs\/index\.md:4  adr\/ADR-0001-cache\.md → adr\/local\/ADR-0001-cache\.md\n/);
  assert.match(r.stdout, /  docs\/adr\/local\/ADR-0001-cache\.md:\d+  platform\/ADR-0006\.md → \.\.\/platform\/ADR-0006\.md\n/);
  assert.doesNotMatch(r.stdout, /ADR-0002-queue\.md →/);
  assert.equal(read(root, 'docs/adr/local/ADR-0001-cache.md'), own);
  assert.match(git(root, 'status', '--short').stdout, /^R  docs\/adr\/ADR-0001-cache\.md -> docs\/adr\/local\/ADR-0001-cache\.md$/m);
  assert.doesNotMatch(formatPlanOf(root), /migration/);
});

test('own ADRs move without any track', async () => {
  const root = makeProject({ local: { 'docs/adr/ADR-0001-cache.md': adr(undefined, 'accepted') } });
  const r = await run(root, 'apply');
  assert.match(r.stdout, /^local: 1 moved\n  moved         ADR-0001-cache\.md\n/);
  assert.ok(existsSync(path.join(root, 'docs/adr/local/ADR-0001-cache.md')));
  assert.ok(!existsSync(path.join(root, 'docs/adr/ADR-0001-cache.md')));
});

test('an own ADR already in docs/adr/local/ stops apply before any write', async () => {
  const root = makeProject({
    tracks: { platform: { 'ADR-0006.md': adr(1) } },
    local: { 'docs/adr/ADR-0001-cache.md': adr(), 'docs/adr/local/ADR-0001-cache.md': adr() },
  });
  const r = await run(root, 'apply');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /docs\/adr\/local\/ADR-0001-cache\.md already exists, docs\/adr\/ADR-0001-cache\.md cannot move there/);
  assert.ok(!existsSync(path.join(root, 'docs/adr/platform/ADR-0006.md')));
});

// Namespace rename

const renamed = () =>
  makeProject({
    tracks: { engineering: { 'A.md': adr(1), 'B.md': adr(1), 'N.md': adr(1) } },
    local: {
      'docs/adr/old/A.md': `${adr(1, 'accepted')}[b](B.md) [n](../local/L.md)\n`,
      'docs/adr/old/B.md': adr(1, 'accepted'),
      'docs/adr/local/L.md': [
        '---',
        'status: accepted',
        'supersedes: [old/A, L0, "old/B"]',
        '---',
        '',
        '[a](../old/A.md)',
        '',
      ].join('\n'),
      'docs/adr/local/M.md': ['---', 'status: accepted', 'supersedes:', '  - old/B', '  - local/L', '---', ''].join('\n'),
    },
  });

test('rename: folder moved first, rulings kept, references listed, never rewritten', async () => {
  const root = renamed();
  const before = read(root, 'docs/adr/old/A.md');
  const local = read(root, 'docs/adr/local/L.md');
  const r = await run(root, 'apply');
  assert.equal(
    r.stdout.split('AGENTS.md')[0],
    [
      'engineering: 1 renamed, 1 imported',
      '  renamed       docs/adr/old/ → docs/adr/engineering/',
      '  imported      N',
      'links to update:',
      '  docs/adr/local/L.md:6  ../old/A.md → ../engineering/A.md',
      'supersedes to update:',
      '  docs/adr/local/L.md:3  old/A → engineering/A',
      '  docs/adr/local/L.md:3  old/B → engineering/B',
      '  docs/adr/local/M.md:4  old/B → engineering/B',
      '',
    ].join('\n'),
  );
  assert.equal(existsSync(path.join(root, 'docs/adr/old')), false);
  assert.equal(read(root, 'docs/adr/engineering/A.md'), before);
  assert.equal(read(root, 'docs/adr/local/L.md'), local);
  assert.match(formatPlanOf(root), /^engineering: 3 unchanged\n/);
});

test('rename inside git: every file reported renamed', async () => {
  const root = renamed();
  git(root, 'init', '-q');
  git(root, 'add', '.');
  git(root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'init');
  await run(root, 'apply');
  const status = git(root, 'status', '--short').stdout;
  assert.match(status, /^R  docs\/adr\/old\/A\.md -> docs\/adr\/engineering\/A\.md$/m);
  assert.match(status, /^R  docs\/adr\/old\/B\.md -> docs\/adr\/engineering\/B\.md$/m);
});

test('dry run of a rename: renamed line, nothing moves', async () => {
  const root = renamed();
  const before = snapshot(root);
  const r = await run(root, 'apply', '--dry-run');
  assert.match(r.stdout, /^dry run: nothing written\nengineering: 1 renamed, 1 imported\n {2}renamed {7}docs\/adr\/old\/ → docs\/adr\/engineering\/\n/);
  assert.deepEqual(snapshot(root), before);
});

test('a rename onto an existing folder aborts before any write', () => {
  const root = renamed();
  const plan = buildPlan(root);
  mkdirSync(path.join(root, 'docs/adr/engineering'));
  assert.throws(() => planActions(root, plan), /docs\/adr\/engineering already exists, docs\/adr\/old cannot move there/);
});
