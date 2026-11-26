import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { main } from '../src/cli.ts';
import { documents, schemaOf } from '../src/documents.ts';
import { formatSuggest, suggestInputs } from '../src/suggest.ts';
import { adr, cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

async function suggest(root: string, ...args: string[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['suggest', ...args], io);
  return { code, stdout, stderr };
}

function snapshot(dir: string, base = dir): [string, string][] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? snapshot(full, base) : [[path.relative(base, full), readFileSync(full, 'utf8')]];
  });
}

// The example of docs/commands.md: one ADR here, one to import.
const example = () =>
  makeProject({
    tracks: { platform: { 'ADR-0006-commits.md': adr(1, 'proposed', 'Commits') } },
    local: { 'docs/adr/local/ADR-0001-release.md': adr(undefined, 'accepted', 'Release') },
  });

test('suggest: writes nothing and exits with 2', async () => {
  const root = example();
  const before = snapshot(root);
  const r = await suggest(root);
  assert.equal(r.code, 2);
  assert.equal(r.stderr, '');
  assert.deepEqual(snapshot(root), before);
});

test('suggest: lists the ADRs here, with their status, and those to import', async () => {
  const { stdout } = await suggest(example());
  assert.ok(stdout.includes('- `docs/adr/local/ADR-0001-release.md` (Release), accepted\n'));
  assert.ok(stdout.includes('Its tracks would import these ADRs:\n\n- `docs/adr/platform/ADR-0006-commits.md` (Commits)\n'));
});

test('suggest: no package.json and no docs/adr/ still prints the prompt, with one line per empty list', async () => {
  const r = await suggest(makeTree({}));
  assert.equal(r.code, 2);
  assert.equal(r.stderr, '');
  assert.ok(r.stdout.includes('The repository holds no ADR.\n'));
  assert.ok(r.stdout.includes('Its tracks would import no ADR.\n'));
});

test('suggest: an ADR with neither title nor status is named by its path', () => {
  const root = makeTree({ 'docs/adr/local/ADR-0001-a.md': '---\nadr: ADR-0001\n---\n\nBody.\n' });
  const { held, fresh } = suggestInputs(root);
  assert.ok(formatSuggest(held, fresh).includes('- `docs/adr/local/ADR-0001-a.md`, no status\n'));
});

test('suggest: the prompt asks for agreement, at most five candidates with evidence, and sends covered ones to review', async () => {
  const { stdout } = await suggest(example());
  assert.match(stdout, /Write nothing until the user agrees/);
  assert.match(stdout, /`AskUserQuestion`/);
  assert.match(stdout, /at most five candidates/);
  assert.match(stdout, /the alternative it rules out, and its evidence/);
  assert.match(stdout, /say that `npx ontrack review` rules it/);
  assert.match(stdout, /`status: accepted` and `supersedes: \[\]`/);
  assert.match(stdout, /design notes and change proposals, archived ones included/);
  assert.match(stdout, /or holds no review comment, say so in one line/);
  assert.match(stdout, /An ADR that only mentions a fact in passing does not cover it/);
  assert.match(stdout, /Merge into one the candidates a single decision explains/);
  assert.match(stdout, /the highest number ever used in that directory, by a file there or one the git history shows deleted/);
  assert.ok(stdout.endsWith('Then run `npx ontrack apply` to update AGENTS.md.\n'));
});

test('suggest: the prompt matches the commands reference contract', () => {
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  const { held, fresh } = suggestInputs(example());
  assert.ok(reference.includes(`~~~\n${formatSuggest(held, fresh)}~~~`));
});

test('suggest --json: the ADRs here, those to import, and the prompt of the text form', async () => {
  const root = example();
  const r = await suggest(root, '--json');
  assert.equal(r.code, 2);
  const doc = JSON.parse(r.stdout);
  assert.deepEqual(doc, {
    $schema: schemaOf('suggest'),
    adrs: [{ ref: 'local/ADR-0001-release', title: 'Release', status: 'accepted', path: 'docs/adr/local/ADR-0001-release.md' }],
    new: [{ path: 'docs/adr/platform/ADR-0006-commits.md', title: 'Commits' }],
    prompt: (await suggest(root)).stdout,
  });
  documents.suggest.model.parse(doc);
});
