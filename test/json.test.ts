import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { main } from '../src/cli.ts';
import type { Command } from '../src/cli.ts';
import { documents, schemaOf } from '../src/documents.ts';
import { adr, cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

async function run(root: string, argv: string[], commands?: Command[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(argv, io, commands);
  // Every document read by a test is parsed with its model, which refuses a
  // key it does not name: a key added to the code and not to the model fails.
  const name = argv.find((a) => a in documents) as keyof typeof documents | undefined;
  return {
    code,
    stdout,
    stderr,
    json: () => (name ? documents[name].model.parse(JSON.parse(stdout)) : JSON.parse(stdout)) as any,
    error: () => documents.error.model.parse(JSON.parse(stderr)).error,
    errorSchema: () => JSON.parse(stderr).$schema,
  };
}

const planned = (name: string, category: string, rest: object = {}) => ({ name, title: null, category, status: null, revision: null, check: null, ...rest });

// One revised ADR the repository accepted, one new, one up to date.
const mixed = () =>
  makeProject({
    tracks: { platform: { 'A.md': adr(2, 'proposed', 'Commits'), 'B.md': adr(1), 'C.md': adr(1) } },
    local: { 'docs/adr/platform/A.md': adr(1, 'accepted', 'Commits'), 'docs/adr/platform/C.md': adr(1, 'accepted') },
  });

test('plan --json: every ADR of every track, the unchanged ones too, and the exit code of plan', async () => {
  const r = await run(mixed(), ['plan', '--json']);
  assert.equal(r.code, 2);
  assert.equal(r.stderr, '');
  const doc = r.json();
  assert.deepEqual(Object.keys(doc), ['$schema', 'tracks', 'unresolved', 'agents', 'pending']);
  assert.equal(doc.$schema, 'https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/plan.schema.json');
  assert.deepEqual(doc.tracks, [
    {
      namespace: 'platform',
      adrs: [
        planned('A', 'revised', { title: 'Commits', status: 'accepted', revision: { from: 1, to: 2 } }),
        planned('B', 'new'),
        planned('C', 'unchanged', { status: 'accepted' }),
      ],
      rename: null,
      migration: [],
    },
  ]);
  assert.equal(doc.pending, true);
  assert.ok(doc.agents.every((line: string) => line.startsWith('AGENTS.md: ')));
});

test('plan --json with no track: no track, and no hint on standard error', async () => {
  const r = await run(makeTree({ 'package.json': '{}' }), ['plan', '--json']);
  assert.deepEqual(r.json(), { $schema: schemaOf('plan'), tracks: [], unresolved: [], agents: [], pending: false });
  assert.equal(r.stderr, '');
  assert.equal(r.code, 0);
});

test('plan --json: a rename and a migration are told as data', async () => {
  const root = makeProject({
    tracks: { engineering: { 'A.md': adr(1) } },
    local: { 'docs/adr/old/A.md': adr(1), 'docs/adr/mine.md': adr() },
  });
  const [track, own] = (await run(root, ['plan', '--json'])).json().tracks;
  assert.deepEqual(track.rename, { from: 'docs/adr/old/', to: 'docs/adr/engineering/' });
  assert.deepEqual(own, { namespace: 'local', adrs: [], rename: null, migration: ['mine.md'] });
});

test('apply --json: the actions, what remains, and what is left to rule', async () => {
  const root = mixed();
  const r = await run(root, ['apply', '--json']);
  const doc = r.json();
  assert.deepEqual(Object.keys(doc), ['$schema', 'dryRun', 'actions', 'links', 'supersedes', 'agents', 'remaining', 'next', 'pending']);
  assert.equal(doc.dryRun, false);
  assert.deepEqual(doc.actions, [
    { kind: 'imported', track: 'platform', adr: planned('B', 'new'), from: 'node_modules/platform/adr/B.md', to: 'docs/adr/platform/B.md' },
  ]);
  assert.ok(existsSync(path.join(root, 'docs/adr/platform/B.md')));
  assert.deepEqual(doc.remaining[0].adrs.map((a: { category: string }) => a.category), ['revised', 'unchanged', 'unchanged']);
  assert.deepEqual(doc.next, { proposed: 1, revised: 1 });
  assert.equal(doc.pending, true);
  assert.equal(r.code, 2);
  // The next step is in the document, not on standard error.
  assert.equal(r.stderr, '');
});

test('apply --dry-run --json: the same document, and nothing written', async () => {
  const root = mixed();
  const doc = (await run(root, ['apply', '--dry-run', '--json'])).json();
  assert.equal(doc.dryRun, true);
  assert.equal(doc.actions[0].kind, 'imported');
  assert.equal(existsSync(path.join(root, 'docs/adr/platform/B.md')), false);
});

test('apply --json with nothing to apply: no action, the plan as what remains', async () => {
  const root = makeProject({ tracks: { platform: { 'A.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1, 'rejected') } });
  const r = await run(root, ['apply', '--json']);
  const doc = r.json();
  assert.deepEqual(doc.actions, []);
  assert.deepEqual(doc.remaining[0].adrs, [planned('A', 'unchanged', { status: 'rejected' })]);
  assert.deepEqual(doc.next, { proposed: 0, revised: 0 });
});

test('apply --json: a moved file has no ADR, and its two paths', async () => {
  const root = makeProject({ local: { 'docs/adr/mine.md': adr() } });
  const doc = (await run(root, ['apply', '--json'])).json();
  assert.deepEqual(doc.actions, [{ kind: 'moved', track: 'local', adr: null, from: 'docs/adr/mine.md', to: 'docs/adr/local/mine.md' }]);
});

const record = (title: string, ...frontmatter: string[]) => ['---', ...frontmatter, '---', '', `# ${title}`, '', 'Body.', ''].join('\n');

test('check --json: one result per ADR in force, the output of a failed check, the counts', async () => {
  const root = makeTree({
    'package.json': '{}',
    'docs/adr/local/ADR-0001-a.md': record('A', 'status: accepted', 'check: echo no && exit 1'),
    'docs/adr/local/ADR-0002-b.md': record('B', 'status: accepted', 'check: exit 0'),
  });
  const r = await run(root, ['check', '--json']);
  assert.deepEqual(r.json(), {
    $schema: schemaOf('check'),
    results: [
      { ref: 'local/ADR-0001-a', title: 'A', status: 'accepted', path: 'docs/adr/local/ADR-0001-a.md', check: 'echo no && exit 1', result: 'fail', output: ['no'] },
      { ref: 'local/ADR-0002-b', title: 'B', status: 'accepted', path: 'docs/adr/local/ADR-0002-b.md', check: 'exit 0', result: 'pass', output: [] },
    ],
    counts: { fail: 1, pass: 1, unchecked: 0 },
  });
  assert.equal(r.code, 2);
});

const reviewTree = (...extra: [string, string][]) =>
  makeTree({
    'package.json': '{}',
    'docs/adr/local/ADR-0001-a.md': record('A', 'status: accepted', 'traits:', '  commits:', '    tool: commitlint'),
    ...Object.fromEntries(extra),
  });
const A = { ref: 'local/ADR-0001-a', title: 'A', status: 'accepted', path: 'docs/adr/local/ADR-0001-a.md' };
const B = { ref: 'local/ADR-0002-b', title: 'B', status: 'proposed', path: 'docs/adr/local/ADR-0002-b.md' };
const proposed: [string, string] = ['docs/adr/local/ADR-0002-b.md', record('B', 'status: proposed')];

test('instructions --json: the decided traits, the pending ADRs, and the block as text', async () => {
  const text = await run(reviewTree(proposed), ['instructions']);
  const doc = (await run(reviewTree(proposed), ['instructions', '--json'])).json();
  assert.deepEqual(Object.keys(doc), ['$schema', 'hint', 'decided', 'pending', 'block']);
  assert.deepEqual(doc.decided, [{ ...A, traits: 'commits:\n  tool: commitlint' }]);
  assert.deepEqual(doc.pending, [B]);
  assert.equal(doc.block, text.stdout);
  assert.ok(doc.block.includes(doc.hint));
});

test('review --json: the kind of prompt, the ADRs it names, and the prompt of the text form', async () => {
  for (const [args, kind, adrs] of [
    [['ADR-0002-b'], 'review', [B]],
    [['ADR-0001-a'], 'supersession', [A]],
    [[], 'sequence', [B]],
  ] as const) {
    const root = reviewTree(proposed);
    const r = await run(root, ['review', ...args, '--json']);
    assert.deepEqual(r.json(), { $schema: schemaOf('review'), kind, adrs, prompt: (await run(root, ['review', ...args])).stdout });
    assert.equal(r.code, 2);
  }
});

test('review --json with nothing to review: kind none, no prompt, nothing on standard error', async () => {
  const r = await run(reviewTree(), ['review', '--json']);
  assert.deepEqual(r.json(), { $schema: schemaOf('review'), kind: 'none', adrs: [], prompt: null });
  assert.equal(r.stderr, '');
  assert.equal(r.code, 0);
});

test('review --json: new ADRs to import, then the revised ones, with their revisions', async () => {
  const root = makeProject({ tracks: { platform: { 'A.md': adr(2), 'B.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1, 'accepted') } });
  const first = (await run(root, ['review', '--json'])).json();
  assert.equal(first.kind, 'import');
  assert.deepEqual(first.adrs, [{ path: 'docs/adr/platform/B.md', title: null }]);

  const ruled = makeProject({ tracks: { platform: { 'A.md': adr(2) } }, local: { 'docs/adr/platform/A.md': adr(1, 'accepted') } });
  const revised = { ref: 'platform/A', title: null, status: 'accepted', path: 'docs/adr/platform/A.md', revision: { from: 1, to: 2 } };
  assert.deepEqual((await run(ruled, ['review', '--json'])).json().adrs, [revised]);
  assert.equal((await run(ruled, ['review', '--json'])).json().kind, 'revisions');
  const named = (await run(ruled, ['review', 'A', '--json'])).json();
  assert.deepEqual([named.kind, named.adrs], ['revision', [revised]]);
});

test('--json: a failure is one document on standard error, with its code and the address of its row', async () => {
  const root = makeTree({ 'README.md': '' });
  const r = await run(root, ['plan', '--json']);
  assert.equal(r.stdout, '');
  assert.deepEqual(r.error(), {
    code: 'E101',
    message: `cannot read ${path.join(root, 'package.json')}; run ontrack from the root of an npm project`,
    docs: 'https://trivoallan.github.io/ontrack/error-messages/#e101',
  });
  assert.equal(r.code, 1);
});

test('--json: a refused command line is E001, without the line on --help', async () => {
  const r = await run(makeTree({ 'package.json': '{}' }), ['plann', '--json']);
  assert.equal(r.errorSchema(), 'https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/error.schema.json');
  assert.deepEqual(r.error(), { code: 'E001', message: 'Unknown argument: plann', docs: 'https://trivoallan.github.io/ontrack/error-messages/#e001' });
  assert.equal(r.code, 1);
});

test('--json: a failure ontrack did not foresee has no code and no address', async () => {
  const boom: Command = { command: 'boom', describe: 'Fails', handler: () => { throw new Error('unforeseen'); } };
  const r = await run(makeTree({}), ['boom', '--json'], [boom]);
  assert.deepEqual(r.error(), { code: null, message: 'unforeseen', docs: null });
  assert.equal((await run(makeTree({}), ['boom'], [boom])).stderr, 'ontrack: unforeseen\n');
});

test('schemas: each published file is the one derived from its model, and schema/ holds no other', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const { documentJsonSchema } = await import('../src/documents.ts');
  const dir = new URL('../schema/', import.meta.url);
  for (const name of Object.keys(documents) as (keyof typeof documents)[]) {
    const published = JSON.parse(readFileSync(new URL(`${name}.schema.json`, dir), 'utf8'));
    assert.deepEqual(published, documentJsonSchema(name), `schema/${name}.schema.json is out of date: run \`npm run schema\``);
    assert.equal(published.$id, `https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/${name}.schema.json`);
  }
  assert.deepEqual(readdirSync(dir).sort(), [...Object.keys(documents), 'ontrack'].sort().map((name) => `${name}.schema.json`));
});

test('schemas: every key is required, and a key a later version adds is let through', async () => {
  const { documentJsonSchema } = await import('../src/documents.ts');
  const schema = documentJsonSchema('plan') as any;
  assert.deepEqual(schema.required, ['$schema', 'tracks', 'unresolved', 'agents', 'pending']);
  assert.doesNotMatch(JSON.stringify(schema), /additionalProperties/);
  // The model itself refuses the unknown key: that is what the tests above rely on.
  assert.equal(documents.plan.model.safeParse({ $schema: schemaOf('plan'), tracks: [], unresolved: [], agents: [], pending: false, extra: 1 }).success, false);
});

test('$schema: a document names its own schema, whose $id is that address, and no other schema takes it', async () => {
  const { documentJsonSchema } = await import('../src/documents.ts');
  const r = await run(makeTree({ 'package.json': '{}' }), ['plan', '--json']);
  const raw = JSON.parse(r.stdout);
  assert.equal(Object.keys(raw)[0], '$schema');
  assert.equal(raw.$schema, documentJsonSchema('plan').$id);
  const other = documents.check.model.safeParse(raw);
  assert.equal(other.success, false);
  assert.deepEqual(other.error?.issues[0].path, ['$schema']);
});
