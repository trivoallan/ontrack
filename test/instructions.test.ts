import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { buildInstructions, formatInstructions, readAdrs, supersededBy, REVIEW_HINT } from '../src/instructions.ts';
import type { Adr } from '../src/instructions.ts';
import { main } from '../src/cli.ts';
import { cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

/** An ADR with the given frontmatter lines and a `# title` heading. */
const adr = (title: string, ...frontmatter: string[]) => ['---', ...frontmatter, '---', '', `# ${title}`, '', 'Body.', ''].join('\n');

const commits = (...extra: string[]) =>
  adr('Commits', 'adr: ADR-0006', 'status: accepted', ...extra, 'traits:', '  commits:', '    scopes: [api, cli, docs]', '    tool: commitlint');

async function instructions(root: string) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['instructions'], io);
  return { code, stdout, stderr };
}

const refs = (adrs: Adr[]) => adrs.map((a) => a.ref);

// ADRs read

test('imported and own ADRs, deeper files ignored', () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/ADR-0010-release.md': adr('Release', 'status: proposed'),
    'docs/adr/trivoallan/deep/ADR-0099.md': adr('Deep', 'status: proposed'),
    'docs/adr/README.txt': 'not an ADR',
  });
  const r = buildInstructions(root);
  assert.deepEqual(refs(r.decided), ['trivoallan/ADR-0006-commits']);
  assert.deepEqual(refs(r.pending), ['local/ADR-0010-release']);
});

test('shipped ADRs are not read', () => {
  const root = makeProject({ tracks: { trivoallan: { 'ADR-0006-commits.md': commits() } } });
  assert.deepEqual(buildInstructions(root), { decided: [], pending: [] });
});

test('unreadable frontmatter is ignored', () => {
  const root = makeTree({ 'docs/adr/A.md': '---\nstatus: accepted\n' });
  assert.deepEqual(buildInstructions(root), { decided: [], pending: [] });
});

// Status and supersession

test('status comment and quotes are removed', () => {
  const root = makeTree({
    'docs/adr/A.md': adr('A', 'status: accepted     # proposed as shipped', 'traits:', '  a: 1'),
    'docs/adr/B.md': adr('B', 'status: "proposed"'),
  });
  const r = buildInstructions(root);
  assert.deepEqual(refs(r.decided), ['local/A']);
  assert.deepEqual(refs(r.pending), ['local/B']);
});

test('superseded across namespaces', () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/ADR-0012-commits.md': adr(
      'Commits, our way', 'status: accepted', 'supersedes: [trivoallan/ADR-0006]', 'traits:', '  commits:', '    tool: none',
    ),
  });
  assert.deepEqual(refs(buildInstructions(root).decided), ['local/ADR-0012-commits']);
});

test('a plain name supersedes in the same directory, block list form, file name as identifier', () => {
  const root = makeTree({
    'docs/adr/x/OLD.md': adr('Old', 'status: accepted', 'traits:', '  k: old'),
    'docs/adr/x/NEW.md': adr('New', 'status: accepted', 'supersedes:', '- OLD', 'traits:', '  k: new'),
    'docs/adr/OLD.md': adr('Local old', 'status: accepted', 'traits:', '  other: 1'),
  });
  assert.deepEqual(refs(buildInstructions(root).decided), ['local/OLD', 'x/NEW']);
});

test('an indented block list and an empty supersedes', () => {
  const root = makeTree({
    'docs/adr/OLD.md': adr('Old', 'status: accepted', 'traits:', '  k: old'),
    'docs/adr/NEW.md': adr('New', 'status: accepted', 'supersedes:', '  - "OLD"', 'traits:', '  k: new'),
    'docs/adr/NONE.md': adr('None', 'status: accepted', 'supersedes: []', 'traits:', '  j: 1'),
  });
  assert.deepEqual(refs(buildInstructions(root).decided), ['local/NEW', 'local/NONE']);
});

test('supersededBy maps each superseded ADR to the one superseding it', () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/trivoallan/ADR-0007-tests.md': adr('Tests', 'adr: ADR-0007', 'status: accepted'),
    'docs/adr/trivoallan/ADR-0008-docs.md': adr('Docs', 'adr: ADR-0008', 'status: accepted', 'supersedes: [ADR-0007]'),
    'docs/adr/ADR-0001-commits.md': adr('Own commits', 'status: accepted', 'supersedes: [trivoallan/ADR-0006]'),
    'docs/adr/ADR-0002-release.md': adr('Release', 'status: accepted'),
    'docs/adr/ADR-0003-release.md': adr('Release again', 'status: accepted', 'supersedes: [local/ADR-0002-release]'),
    'docs/adr/ADR-0004-docs.md': adr('Own docs', 'status: proposed', 'supersedes: [trivoallan/ADR-0008]'),
  });
  const pairs = [...supersededBy(readAdrs(root))].map(([old, by]) => `${old.ref} <- ${by.ref}`).sort();
  assert.deepEqual(pairs, [
    'local/ADR-0002-release <- local/ADR-0003-release',
    'trivoallan/ADR-0006-commits <- local/ADR-0001-commits',
    'trivoallan/ADR-0007-tests <- trivoallan/ADR-0008-docs',
  ]);
});

test('a proposed ADR supersedes nothing', () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/ADR-0012-commits.md': adr('Commits, our way', 'status: proposed', 'supersedes: [trivoallan/ADR-0006]'),
  });
  assert.deepEqual(refs(buildInstructions(root).decided), ['trivoallan/ADR-0006-commits']);
});

// Decided traits

test('ruled governance ADR: the block is dedented and copied verbatim', () => {
  const root = makeTree({ 'docs/adr/trivoallan/ADR-0006-commits.md': commits() });
  assert.deepEqual(buildInstructions(root).decided[0].traits, [
    'commits:',
    '  scopes: [api, cli, docs]',
    '  tool: commitlint',
  ]);
});

test('the block ends at the next key, keeps inner blank lines, drops trailing ones', () => {
  const text = adr('A', 'status: accepted', 'traits:', '  a: 1', '', '  b: 2', '', 'date: 2026-11-14');
  const root = makeTree({ 'docs/adr/A.md': text });
  assert.deepEqual(buildInstructions(root).decided[0].traits, ['a: 1', '', 'b: 2']);
});

test('accepted without traits, empty traits, {} traits: not decided', () => {
  const root = makeTree({
    'docs/adr/A.md': adr('A', 'status: accepted'),
    'docs/adr/B.md': adr('B', 'status: accepted', 'traits:'),
    'docs/adr/C.md': adr('C', 'status: accepted', 'traits: {}'),
  });
  assert.deepEqual(buildInstructions(root), { decided: [], pending: [] });
});

test('rejected and other statuses are ignored', () => {
  const root = makeTree({
    'docs/adr/A.md': adr('A', 'status: rejected', 'traits: {weird: 1}'),
    'docs/adr/B.md': adr('B', 'status: deprecated', 'traits:', '  b: 1'),
    'docs/adr/C.md': adr('C', 'traits:', '  c: 1'),
  });
  assert.deepEqual(buildInstructions(root), { decided: [], pending: [] });
});

test('inline traits on an accepted ADR: exit 1, the file is named', async () => {
  const root = makeTree({ 'docs/adr/A.md': adr('A', 'status: accepted', 'traits: {commits: {tool: commitlint}}') });
  const r = await instructions(root);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /docs\/adr\/A\.md/);
  assert.equal(r.stdout, '');
});

// Pending decisions

test('shipped and not ruled yet: listed, traits not printed', () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0002-localization.md': adr(
      'Localization', 'status: proposed', 'traits:', '  localization:', '    language:',
    ),
  });
  const out = formatInstructions(buildInstructions(root));
  assert.match(out, /^- Localization \(trivoallan\/ADR-0002-localization\)$/m);
  assert.doesNotMatch(out, /language/);
});

// Conflicting traits

test('two decided ADRs, one key: exit 1, both named, empty stdout', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/ADR-0012-commits.md': adr('Ours', 'status: accepted', 'traits:', '  # comment', '  commits:', '    tool: none'),
  });
  const r = await instructions(root);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /"commits\.tool".*local\/ADR-0012-commits.*trivoallan\/ADR-0006-commits.*supersedes/);
  assert.equal(r.stdout, '');
});

test('nested keys with the same name do not conflict', () => {
  const root = makeTree({
    'docs/adr/A.md': adr('A', 'status: accepted', 'traits:', '  a:', '    tool: x'),
    'docs/adr/B.md': adr('B', 'status: accepted', 'traits:', '  b:', '    tool: y'),
  });
  assert.equal(buildInstructions(root).decided.length, 2);
});

test('one top-level key, different subkeys: no conflict (ADR-0003 and ADR-0010)', () => {
  const root = makeTree({
    'docs/adr/A.md': adr('A', 'status: accepted', 'traits:', '  architecture:', '    pattern: monolithic'),
    'docs/adr/B.md': adr('B', 'status: accepted', 'traits:', '  architecture:', '    document: arc42', '    diagrams:', '      - mermaid'),
  });
  assert.equal(buildInstructions(root).decided.length, 2);
});

test('a value where the other ADR nests keys conflicts, in either order', () => {
  const scalar = adr('S', 'status: accepted', 'traits:', '  architecture: hexagonal');
  const nested = adr('N', 'status: accepted', 'traits:', '  architecture:', '    document: arc42');
  for (const [a, b] of [[scalar, nested], [nested, scalar]]) {
    const root = makeTree({ 'docs/adr/A.md': a, 'docs/adr/B.md': b });
    assert.throws(() => buildInstructions(root), /trait "architecture" is decided by both local\/A and local\/B/);
  }
});

// Output format

test('the commands reference example: one decided, one pending', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/trivoallan/ADR-0002-localization.md': adr('Localization', 'status: proposed'),
  });
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  const example = /~~~\n(<!-- ontrack:begin -->[\s\S]*?)~~~/.exec(reference)?.[1];
  const r = await instructions(root);
  assert.equal(r.stdout, example);
  assert.equal(r.code, 0);
});

test('an ADR without a title is headed by its reference', () => {
  const root = makeTree({
    'docs/adr/A.md': '---\nstatus: accepted\ntraits:\n  a: 1\n---\n',
    'docs/adr/B.md': '---\nstatus: proposed\n---\n',
  });
  const out = formatInstructions(buildInstructions(root));
  assert.match(out, /^### local\/A$/m);
  assert.match(out, /^- local\/B$/m);
});

test('without ontrack installed, the review hint names the package', async () => {
  const root = makeTree({ 'README.md': '' });
  rmSync(path.join(root, 'node_modules/.bin/ontrack'));
  const r = await instructions(root);
  assert.ok(r.stdout.includes('\n\nWhen asked to review, rule on or supersede an ADR, run `npx -p @trivoallan/ontrack ontrack review [adr]` and follow its output. When asked to record a new decision, run `npx -p @trivoallan/ontrack ontrack decide` and follow its output.\n\n'));
});

test('in the ontrack repository itself, the review hint stays short: npx runs its own bin', async () => {
  const root = makeTree({ 'package.json': JSON.stringify({ name: '@trivoallan/ontrack' }, null, 2) });
  rmSync(path.join(root, 'node_modules/.bin/ontrack'));
  assert.ok((await instructions(root)).stdout.includes(REVIEW_HINT));
});

test('nothing decided, nothing pending: the block is still printed', async () => {
  const r = await instructions(makeTree({ 'README.md': '' }));
  assert.equal(r.stdout, `<!-- ontrack:begin -->\n## Project instructions (ontrack)\n\n${REVIEW_HINT}\n\n<!-- ontrack:end -->\n`);
  assert.equal(r.code, 0);
});

// Read-only

function snapshot(dir: string, base = dir, out: Record<string, string> = {}) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) snapshot(full, base, out);
    else out[path.relative(base, full)] = readFileSync(full, 'utf8');
  }
  return out;
}

test('tree unchanged', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': commits(),
    'docs/adr/trivoallan/ADR-0002-localization.md': adr('Localization', 'status: proposed'),
  });
  const before = snapshot(root);
  assert.equal((await instructions(root)).code, 0);
  assert.deepEqual(snapshot(root), before);
});

test('a check: line leaves the instructions output unchanged', async () => {
  const without = await instructions(makeTree({ 'docs/adr/trivoallan/ADR-0006-commits.md': commits() }));
  const withCheck = await instructions(makeTree({ 'docs/adr/trivoallan/ADR-0006-commits.md': commits('check: exit 1') }));
  assert.equal(withCheck.stdout, without.stdout);
  assert.equal(withCheck.code, 0);
});

test('own ADRs in docs/adr/local/ and in the historical layout share the local namespace', () => {
  const root = makeTree({
    'docs/adr/local/ADR-0010-release.md': adr('Release', 'status: proposed'),
    'docs/adr/ADR-0011-hosting.md': adr('Hosting', 'status: proposed'),
  });
  assert.deepEqual(refs(readAdrs(root)).sort(), ['local/ADR-0010-release', 'local/ADR-0011-hosting']);
});

test('the same file name in docs/adr/ and docs/adr/local/ is an error', async () => {
  const root = makeTree({
    'docs/adr/local/ADR-0010-release.md': adr('Release', 'status: proposed'),
    'docs/adr/ADR-0010-release.md': adr('Release', 'status: proposed'),
  });
  const r = await instructions(root);
  assert.equal(r.code, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /docs\/adr\/ADR-0010-release\.md and docs\/adr\/local\/ADR-0010-release\.md/);
});
