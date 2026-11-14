import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { main } from '../src/cli.ts';
import { cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

/** An ADR with the given frontmatter lines and a `# title` heading. */
const adr = (title: string, ...frontmatter: string[]) => ['---', ...frontmatter, '---', '', `# ${title}`, '', 'Body.', ''].join('\n');
const traits = (key: string) => ['traits:', `  ${key}:`, '    tool: x'];

async function check(root: string) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['check'], io);
  return { code, stdout, stderr };
}

// ADRs carrying a check

test('accepted ADR with a check: comment and quotes removed', async () => {
  const root = makeTree({
    'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check: "exit 1" # why'),
  });
  const r = await check(root);
  assert.match(r.stdout, /^ {2}check: exit 1$/m);
});

test('proposed ADR: command does not run, ADR not reported', async () => {
  const root = makeTree({ 'docs/adr/ADR-0001-a.md': adr('A', 'status: proposed', 'check: exit 1') });
  const r = await check(root);
  assert.equal(r.stdout, '0 failed, 0 passed, 0 unchecked\n');
  assert.equal(r.code, 0);
});

test('superseded ADR: its command does not run', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': adr('Commits', 'adr: ADR-0006', 'status: accepted', 'check: exit 1'),
    'docs/adr/ADR-0012-commits.md': adr('Commits', 'status: accepted', 'supersedes: [trivoallan/ADR-0006]'),
  });
  const r = await check(root);
  assert.equal(r.stdout, '0 failed, 0 passed, 0 unchecked\n');
});

test('shipped ADRs are not read', async () => {
  const root = makeProject({ sources: { trivoallan: { 'ADR-0001-a.md': adr('A', 'status: accepted', 'check: exit 1') } } });
  const r = await check(root);
  assert.equal(r.stdout, '0 failed, 0 passed, 0 unchecked\n');
});

test('empty check value: no check; traits without a check: unchecked', async () => {
  const root = makeTree({
    'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check:'),
    'docs/adr/ADR-0002-b.md': adr('B', 'status: accepted', 'check:', ...traits('b')),
  });
  const r = await check(root);
  assert.equal(r.stdout, 'unchecked  B (local/ADR-0002-b)\n0 failed, 0 passed, 1 unchecked\n');
  assert.equal(r.code, 0);
});

// Running the commands

test('exit 3 fails, true passes, and a failure does not stop the run', async () => {
  const root = makeTree({
    'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check: exit 3'),
    'docs/adr/ADR-0002-b.md': adr('B', 'status: accepted', 'check: true'),
  });
  const r = await check(root);
  assert.match(r.stdout, /^fail {7}A \(local\/ADR-0001-a\)$/m);
  assert.match(r.stdout, /^pass {7}B \(local\/ADR-0002-b\)$/m);
  assert.equal(r.code, 2);
});

test('exit 78: unchecked, output not printed, exit code unchanged', async () => {
  const root = makeTree({
    'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check: echo nothing to check; exit 78'),
    'docs/adr/ADR-0002-b.md': adr('B', 'status: accepted', 'check: true'),
  });
  const r = await check(root);
  assert.equal(r.stdout, 'unchecked  A (local/ADR-0001-a)\npass       B (local/ADR-0002-b)\n0 failed, 1 passed, 1 unchecked\n');
  assert.equal(r.code, 0);
});

test('unknown program: fail, with the shell message', async () => {
  const root = makeTree({ 'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check: no-such-program-xyz') });
  const r = await check(root);
  assert.match(r.stdout, /^fail /);
  assert.match(r.stdout, /^ {2}\| .*no-such-program-xyz/m);
});

test('commands run from the project root', async () => {
  const root = makeTree({ 'docs/adr/ADR-0001-a.md': adr('A', 'status: accepted', 'check: test -d docs/adr') });
  const r = await check(root);
  assert.match(r.stdout, /^pass /);
  assert.equal(r.code, 0);
});

// Conflicting traits stop the run

test('trait conflict: exit 1, empty stdout, nothing ran', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0006-commits.md': adr('Commits', 'status: accepted', 'check: touch marker', ...traits('commits')),
    'docs/adr/ADR-0012-commits.md': adr('Commits', 'status: accepted', ...traits('commits')),
  });
  const r = await check(root);
  assert.equal(r.code, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /commits/);
  assert.equal(existsSync(path.join(root, 'marker')), false);
});

// Output format

test('one of each: the README example, byte for byte', async () => {
  const root = makeTree({
    'docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md':
      adr('Record architecture decisions', 'status: accepted', ...traits('record-architecture-decisions')),
    'docs/adr/trivoallan/ADR-0006-commits.md':
      adr('Commits', 'status: accepted', 'check: echo "scope may not be empty"; exit 1', ...traits('commits')),
    'docs/adr/trivoallan/ADR-0009-branching.md': adr('Branching', 'status: accepted', 'check: true'),
  });
  const r = await check(root);
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const example = /```\n(unchecked  [\s\S]*?unchecked\n)```/.exec(readme)?.[1];
  assert.equal(r.stdout, example);
  assert.equal(r.code, 2);
});

test('without a title, the reference stands alone', async () => {
  const root = makeTree({ 'docs/adr/ADR-0001-a.md': ['---', 'status: accepted', 'check: true', '---', '', 'Body.', ''].join('\n') });
  const r = await check(root);
  assert.match(r.stdout, /^pass {7}local\/ADR-0001-a$/m);
});

test('no docs/adr: the count line alone', async () => {
  const r = await check(makeTree({ 'README.md': '' }));
  assert.equal(r.stdout, '0 failed, 0 passed, 0 unchecked\n');
  assert.equal(r.code, 0);
});
