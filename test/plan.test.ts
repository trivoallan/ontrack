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

async function plan(root: string, ...options: string[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['plan', ...options], io);
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
  assert.deepEqual(p[0].adrs.find((a) => a.name === 'B.md'), { name: 'B.md', category: 'revised', title: null, status: 'accepted', from: 1, to: 2 });
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

test('the commands reference example is what formatPlan prints', () => {
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  const example = /```\n(platform: [\s\S]*?)```/.exec(reference)?.[1];
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

// Check category

const ruled = (...extra: string[]) => ['---', 'status: accepted', 'revision: 1', ...extra, 'traits:', '  commits:', '    tool: commitlint', '---', '', 'Body.', ''].join('\n');
const shipped = (revision: number, ...extra: string[]) => ['---', 'status: proposed', `revision: ${revision}`, ...extra, 'traits:', '  commits:', '    tool:', '---', '', 'Body.', 'check: exit 0', ''].join('\n');
const one = (local: string, upstream: string) =>
  makeProject({ sources: { trivoallan: { 'ADR-0006-commits.md': upstream } }, local: { 'docs/adr/trivoallan/ADR-0006-commits.md': local } });

test('check added, changed or removed upstream: check', () => {
  for (const [local, upstream] of [
    [ruled(), shipped(1, 'check: npx commitlint --last')],
    [ruled('check: exit 0'), shipped(1, 'check: exit 1')],
    [ruled('check: exit 0'), shipped(1)],
  ]) {
    assert.equal(buildPlan(one(local, upstream))[0].adrs[0].category, 'check');
  }
});

test('same check with a different verdict, or a check line only in the body: unchanged', () => {
  assert.equal(buildPlan(one(ruled('check: exit 0'), shipped(1, 'check: exit 0  ')))[0].adrs[0].category, 'unchanged');
  assert.equal(buildPlan(one(ruled(), shipped(1)))[0].adrs[0].category, 'unchanged');
});

test('revised wins over check', () => {
  const [s] = buildPlan(one(ruled(), shipped(2, 'check: exit 0')));
  assert.equal(s.adrs[0].category, 'revised');
  assert.equal(s.adrs[0].check, undefined);
});

test('check output: counts, then the - and + lines; exit 2', async () => {
  const root = withAgents(makeProject({
    sources: { trivoallan: { 'ADR-0001-a.md': adr(1), 'ADR-0006-commits.md': shipped(1, 'check: npx commitlint --last') } },
    local: { 'docs/adr/trivoallan/ADR-0001-a.md': adr(1), 'docs/adr/trivoallan/ADR-0006-commits.md': ruled('check: exit 0') },
  }));
  const r = await plan(root);
  assert.equal(r.stdout, 'trivoallan: 1 check, 1 unchanged\n  check         ADR-0006-commits\n    - check: exit 0\n    + check: npx commitlint --last\n');
  assert.equal(r.code, 2);
});

test('check output: added shows + only, removed shows - only', () => {
  assert.equal(formatPlan(buildPlan(one(ruled(), shipped(1, 'check: exit 0')))), 'trivoallan: 1 check, 0 unchanged\n  check         ADR-0006-commits\n    + check: exit 0\n');
  assert.equal(formatPlan(buildPlan(one(ruled('check: exit 0'), shipped(1)))), 'trivoallan: 1 check, 0 unchanged\n  check         ADR-0006-commits\n    - check: exit 0\n');
});

// Full listing (--all)

const fm = (status: string | null, revision = 1, ...extra: string[]) =>
  ['---', ...(status === null ? [] : [`status: ${status}`]), `revision: ${revision}`, ...extra, '---', '', 'Body.', ''].join('\n');
const listing = (sources: Files, local: Files) =>
  formatPlan(buildPlan(makeProject({ sources: { platform: sources }, local })), { all: true });
const at = (file: string) => `docs/adr/platform/${file}`;

test('--all lists the unchanged ADRs with their verdict', () => {
  const out = listing(
    { 'SDR-0001.md': fm('proposed'), 'SDR-0002.md': fm('proposed') },
    { [at('SDR-0001.md')]: fm('accepted'), [at('SDR-0002.md')]: fm('accepted') },
  );
  assert.equal(out, 'platform: 2 unchanged\n  unchanged     accepted    SDR-0001\n  unchanged     accepted    SDR-0002\n');
});

test('--all interleaves the categories by name', () => {
  const out = listing(
    { 'SDR-0001.md': fm('proposed'), 'SDR-0002.md': fm('proposed', 2), 'SDR-0003.md': fm('proposed') },
    { [at('SDR-0001.md')]: fm('accepted'), [at('SDR-0002.md')]: fm('accepted'), [at('SDR-0003.md')]: fm('accepted') },
  );
  assert.deepEqual(out.split('\n').slice(1, 4), [
    '  unchanged     accepted    SDR-0001',
    '  revised       accepted    SDR-0002 (revision 1 → 2)',
    '  unchanged     accepted    SDR-0003',
  ]);
});

test('without --all: no unchanged line, no verdict column', () => {
  const root = makeProject({
    sources: { platform: { 'SDR-0001.md': fm('proposed'), 'SDR-0002.md': fm('proposed', 2), 'SDR-0003.md': fm('proposed') } },
    local: { [at('SDR-0001.md')]: fm('accepted'), [at('SDR-0002.md')]: fm('accepted') },
  });
  assert.equal(
    formatPlan(buildPlan(root)),
    'platform: 1 revised, 1 new, 1 unchanged\n  revised       SDR-0002 (revision 1 → 2)\n  new           SDR-0003\n',
  );
});

test('--all keeps the check lines in place', () => {
  const out = formatPlan(buildPlan(one(ruled('check: exit 0'), shipped(1, 'check: exit 1'))), { all: true });
  assert.equal(out, 'trivoallan: 1 check, 0 unchanged\n  check         accepted    ADR-0006-commits\n    - check: exit 0\n    + check: exit 1\n');
});

test('--all: a rejected ADR', () => {
  const out = listing({ 'ADR-0013-frontend.md': fm('proposed') }, { [at('ADR-0013-frontend.md')]: fm('rejected') });
  assert.match(out, /^ {2}unchanged {5}rejected {4}ADR-0013-frontend$/m);
});

test('the verdict is the local one, not the source\'s', () => {
  const root = makeProject({ sources: { platform: { 'A.md': fm('proposed') } }, local: { [at('A.md')]: fm('accepted') } });
  assert.equal(buildPlan(root)[0].adrs[0].status, 'accepted');
});

test('--all: a trailing comment is not part of the verdict', () => {
  const out = listing(
    { 'A.md': fm('proposed') },
    { [at('A.md')]: fm('accepted     # proposed as shipped; accepted or rejected once ruled') },
  );
  assert.match(out, /^ {2}unchanged {5}accepted {4}A$/m);
});

test('--all: a new ADR has no verdict', () => {
  assert.match(listing({ 'A.md': fm('proposed') }, {}), /^ {2}new {11}- {11}A$/m);
});

test('--all: an unreadable copy, or one without status, has no verdict', () => {
  const out = listing(
    { 'A.md': fm('proposed'), 'B.md': fm('proposed') },
    { [at('A.md')]: 'no frontmatter\n', [at('B.md')]: fm(null) },
  );
  assert.match(out, /^ {2}unreadable {4}- {11}A$/m);
  assert.match(out, /^ {2}unchanged {5}- {11}B$/m);
});

test('--all: a removed ADR keeps its verdict and title', () => {
  const out = listing({ 'SDR-0001.md': fm('proposed') }, { [at('SDR-0012.md')]: fm('accepted', 1, 'title: Hosting') });
  assert.match(out, /^ {2}removed {7}accepted {4}SDR-0012 {2}Hosting$/m);
});

test('--all: the exit code is the one of plan', async () => {
  const done = withAgents(makeProject({
    sources: { platform: { 'A.md': fm('proposed'), 'B.md': fm('proposed') } },
    local: { [at('A.md')]: fm('accepted'), [at('B.md')]: fm('rejected') },
  }));
  assert.equal((await plan(done)).code, 0);
  const all = await plan(done, '--all');
  assert.equal(all.code, 0);
  assert.match(all.stdout, /^ {2}unchanged {5}rejected {4}B$/m);

  const pending = makeProject({ sources: { platform: { 'A.md': fm('proposed', 2) } }, local: { [at('A.md')]: fm('accepted') } });
  assert.equal((await plan(pending)).code, 2);
  assert.equal((await plan(pending, '--all')).code, 2);
});
