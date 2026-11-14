import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPlan, formatPlan, hasPendingChanges } from '../src/plan.ts';
import type { Plan } from '../src/plan.ts';
import { main } from '../src/cli.ts';
import { adr, cleanup, makeProject, makeTree, withAgents } from './helpers/project.ts';
import type { Files } from './helpers/project.ts';

after(cleanup);

const categories = (plan: Plan) =>
  Object.fromEntries(plan[0].adrs.map((a) => [a.name, a.category]));

async function plan(root: string) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['plan'], io);
  return { code, stdout, stderr };
}

// Source ADRs and their local copy

test('namespaced copy wins over a flat one', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(2) } },
    local: { 'docs/adr/platform/SDR-0006.md': adr(2), 'docs/adr/SDR-0006.md': adr(1) },
  });
  const [s] = buildPlan(root);
  assert.equal(s.adrs[0].category, 'unchanged');
  assert.deepEqual(s.migration, []);
});

test('subdirectories of the source ADR directory are ignored', () => {
  const root = makeProject({ sources: { platform: { 'templates/example.md': adr(1) } } });
  assert.deepEqual(buildPlan(root)[0].adrs, []);
});

// Classification

test('new, revised, unchanged, undetermined and unreadable', () => {
  const root = makeProject({
    sources: {
      platform: {
        'A.md': adr(1),
        'B.md': adr(2),
        'C.md': adr(3),
        'D.md': adr(1),
        'E.md': adr(1),
      },
    },
    local: {
      'docs/adr/platform/B.md': adr(1, 'accepted'),
      'docs/adr/platform/C.md': adr(3, 'accepted'),
      'docs/adr/platform/D.md': adr(0),
      'docs/adr/platform/E.md': 'no frontmatter',
    },
  });
  const p = buildPlan(root);
  assert.deepEqual(categories(p), {
    'A.md': 'new', 'B.md': 'revised', 'C.md': 'unchanged', 'D.md': 'undetermined', 'E.md': 'unreadable',
  });
  assert.deepEqual(p[0].adrs.find((a) => a.name === 'B.md'), { name: 'B.md', category: 'revised', title: null, from: 1, to: 2 });
});

test('an ADR shipped no more is removed', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(1) } },
    local: { 'docs/adr/platform/SDR-0006.md': adr(1), 'docs/adr/platform/SDR-0012.md': adr(1) },
  });
  assert.equal(categories(buildPlan(root))['SDR-0012.md'], 'removed');
});

test("the project's own ADR is ignored", () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(1) } },
    local: { 'docs/adr/0001-use-postgres.md': adr(1), 'docs/adr/platform/SDR-0006.md': adr(1) },
  });
  const out = formatPlan(buildPlan(root));
  assert.doesNotMatch(out, /postgres/);
  assert.equal(out, 'platform: 1 unchanged\n');
});

// Flat-layout migration

test('historical downstream repository', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(1), 'SDR-0010.md': adr(1) } },
    local: { 'docs/adr/SDR-0010.md': adr(1), 'docs/adr/SDR-0006.md': adr(1) },
  });
  const out = formatPlan(buildPlan(root));
  assert.equal(out, [
    'platform: 2 unchanged',
    'migration: 2 files docs/adr/ → docs/adr/platform/',
    '  move          SDR-0006.md',
    '  move          SDR-0010.md',
    '',
  ].join('\n'));
});

test('a single migrated file is singular', () => {
  const root = makeProject({ sources: { platform: { 'A.md': adr(1) } }, local: { 'docs/adr/A.md': adr(1) } });
  assert.match(formatPlan(buildPlan(root)), /^migration: 1 file docs\/adr\//m);
});

// Output format

test('nothing to do', async () => {
  const sources: Record<string, Files> = { platform: {} };
  const local: Files = {};
  for (let i = 1; i <= 14; i += 1) {
    sources.platform[`SDR-${i}.md`] = adr(1);
    local[`docs/adr/platform/SDR-${i}.md`] = adr(1);
  }
  const r = await plan(withAgents(makeProject({ sources, local })));
  assert.equal(r.stdout, 'platform: 14 unchanged\n');
  assert.equal(r.code, 0);
});

test('mixed source: counts in contract order', () => {
  const sources: Record<string, Files> = { platform: { 'N.md': adr(1), 'R1.md': adr(2), 'R2.md': adr(2) } };
  const local: Files = { 'docs/adr/platform/R1.md': adr(1), 'docs/adr/platform/R2.md': adr(1) };
  for (let i = 1; i <= 11; i += 1) {
    sources.platform[`U${i}.md`] = adr(1);
    local[`docs/adr/platform/U${i}.md`] = adr(1);
  }
  const lines = formatPlan(buildPlan(makeProject({ sources, local }))).split('\n');
  assert.equal(lines[0], 'platform: 2 revised, 1 new, 11 unchanged');
  assert.deepEqual(lines.slice(1, 4), [
    '  new           N',
    '  revised       R1 (revision 1 → 2)',
    '  revised       R2 (revision 1 → 2)',
  ]);
});

test('sources are sorted by alias', () => {
  const root = makeProject({
    sources: { zeta: { 'A.md': adr(1) }, alpha: { 'A.md': adr(1) } },
    local: { 'docs/adr/zeta/A.md': adr(1), 'docs/adr/alpha/A.md': adr(1) },
  });
  assert.equal(formatPlan(buildPlan(root)), 'alpha: 1 unchanged\nzeta: 1 unchanged\n');
});

test('no source', async () => {
  const r = await plan(makeTree({ 'package.json': '{}' }));
  assert.equal(r.stdout, 'no ontrack source found\n');
  assert.equal(r.code, 0);
});

test('the README example is what formatPlan prints', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const example = /```\n(platform: [\s\S]*?)```/.exec(readme)?.[1];
  const p: Plan = [{
    namespace: 'platform',
    adrDir: 'node_modules/platform/adr',
    adrs: [
      { name: 'SDR-0001.md', category: 'unchanged', title: null },
      { name: 'SDR-0003.md', category: 'unchanged', title: null },
      { name: 'SDR-0006.md', category: 'revised', title: 'Commits', from: 1, to: 2 },
      { name: 'SDR-0008.md', category: 'unchanged', title: null },
      { name: 'SDR-0010.md', category: 'revised', title: 'Forge and CI', from: 3, to: 4 },
      { name: 'SDR-0015.md', category: 'new', title: 'Observability' },
    ],
    migration: ['SDR-0001.md', 'SDR-0003.md', 'SDR-0006.md', 'SDR-0008.md', 'SDR-0010.md'],
  }];
  assert.equal(formatPlan(p), example);
});

// Titles

test('new ADR with its title, from a heading repeating the name', () => {
  const root = makeProject({
    sources: {
      trivoallan: { 'ADR-0001.md': '---\nrevision: 1\n---\n\n# ADR-0001: Record significant decisions as ADRs\n' },
    },
  });
  assert.match(formatPlan(buildPlan(root)), /^ {2}new {11}ADR-0001 {2}Record significant decisions as ADRs$/m);
});

test('revised ADR with its title, read from the source copy', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(2, 'proposed', 'Commits') } },
    local: { 'docs/adr/platform/SDR-0006.md': adr(1, 'accepted', 'Old commits title') },
  });
  assert.match(formatPlan(buildPlan(root)), /^ {2}revised {7}SDR-0006 {2}Commits \(revision 1 → 2\)$/m);
});

test('removed ADR keeps its local title', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0006.md': adr(1) } },
    local: { 'docs/adr/platform/SDR-0006.md': adr(1), 'docs/adr/platform/SDR-0012.md': adr(1, 'accepted', 'Hosting') },
  });
  assert.match(formatPlan(buildPlan(root)), /^ {2}removed {7}SDR-0012 {2}Hosting$/m);
});

test('ADR without a title ends with its name, no trailing spaces', () => {
  const root = makeProject({ sources: { platform: { 'SDR-0020.md': adr(1) } } });
  assert.match(formatPlan(buildPlan(root)), /^ {2}new {11}SDR-0020$/m);
});

test('ADR whose name carries a slug shows no title', () => {
  const root = makeProject({ sources: { platform: { 'ADR-0006-commits.md': adr(1, 'proposed', 'Commits') } } });
  assert.match(formatPlan(buildPlan(root)), /^ {2}new {11}ADR-0006-commits$/m);
});

// Exit code

test('undetermined only gives 2', async () => {
  const root = makeProject({
    sources: { platform: { 'A.md': adr(0) } },
    local: { 'docs/adr/platform/A.md': adr(0) },
  });
  assert.equal((await plan(root)).code, 2);
});

test('removed only counts as pending', () => {
  assert.equal(hasPendingChanges([{ adrs: [{ category: 'removed' }], migration: [] }]), true);
  assert.equal(hasPendingChanges([{ adrs: [{ category: 'unchanged' }], migration: [] }]), false);
});

test('missing source ADR directory gives 1 and names the source', async () => {
  const root = makeTree({
    'package.json': JSON.stringify({ devDependencies: { platform: '1' } }),
    'node_modules/platform/package.json': JSON.stringify({ name: 'platform', ontrack: { adr: 'docs/adr' } }),
  });
  const r = await plan(root);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /platform.*docs\/adr/);
});
