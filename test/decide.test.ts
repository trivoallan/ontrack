import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { main } from '../src/cli.ts';
import { formatDecide } from '../src/decide.ts';
import { documents, schemaOf } from '../src/documents.ts';
import { NUMBERING } from '../src/review.ts';
import { formatSuggest, suggestInputs } from '../src/suggest.ts';
import { adr, cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

async function decide(root: string, ...args: string[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['decide', ...args], io);
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

const before = (text: string, a: string, b: string) => {
  assert.ok(text.includes(a), a);
  assert.ok(text.includes(b), b);
  assert.ok(text.indexOf(a) < text.indexOf(b), `${a} before ${b}`);
};

test('decide: writes nothing and exits with 2', async () => {
  const root = example();
  const tree = snapshot(root);
  const r = await decide(root);
  assert.equal(r.code, 2);
  assert.equal(r.stderr, '');
  assert.deepEqual(snapshot(root), tree);
});

test('decide: no package.json and no docs/adr/ still prints the prompt', async () => {
  const r = await decide(makeTree({}));
  assert.equal(r.code, 2);
  assert.equal(r.stderr, '');
  assert.ok(r.stdout.includes('The repository holds no ADR.\n'));
});

test('decide: the same lists as suggest', () => {
  const { held, fresh } = suggestInputs(example());
  const lists = (text: string) => text.slice(text.indexOf('The repository holds'), text.indexOf('do not record it again.'));
  assert.equal(lists(formatDecide(held, fresh)), lists(formatSuggest(held, fresh)));
  assert.ok(formatDecide(held, fresh).includes('- `docs/adr/local/ADR-0001-release.md` (Release), accepted\n'));
});

test('decide: the steps, in order', async () => {
  const { stdout } = await decide(example());
  before(stdout, 'already decides it', 'Propose the traits');
  before(stdout, 'Write nothing until the user agrees', 'write the new ADR');
  before(stdout, 'write the new ADR', 'Then run `npx ontrack apply`');
  assert.match(stdout, /propose `npx ontrack review <its reference>` to supersede it/);
  assert.match(stdout, /say that `npx ontrack review` rules it/);
  assert.match(stdout, /`AskUserQuestion`/);
  assert.match(stdout, /`status: accepted`, `supersedes: \[\]`/);
  assert.match(stdout, /keys under a top-level key that no ADR in force uses/);
  assert.match(stdout, /an ADR without traits does not reach AGENTS.md/);
  assert.match(stdout, /a fact with no alternative is not a decision/);
  assert.ok(stdout.includes(NUMBERING));
});

test('decide: steps 1 and 7 are those of suggest', () => {
  const { held, fresh } = suggestInputs(example());
  const step = (text: string, n: number) => text.split('\n').find((l) => l.startsWith(`${n}. `)) as string;
  const d = formatDecide(held, fresh);
  const s = formatSuggest(held, fresh);
  assert.equal(step(d, 1), step(s, 1));
  const tail = (line: string, lead: string) => line.slice(line.indexOf(lead) + lead.length);
  assert.equal(tail(step(d, 7), 'Once the user agrees: '), tail(step(s, 7), 'For each candidate the user agrees to: '));
});

test('decide: fixed text apart from the lists', () => {
  const strip = (text: string) => text.slice(text.indexOf('do not record it again.'));
  const a = suggestInputs(example());
  const b = suggestInputs(makeTree({ 'docs/adr/local/ADR-0004-x.md': adr(undefined, 'proposed', 'X') }));
  assert.equal(strip(formatDecide(a.held, a.fresh)), strip(formatDecide(b.held, b.fresh)));
});

test('decide: an argument is refused with E001', async () => {
  const r = await decide(example(), 'Use pnpm');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /E001/);
});

test('decide: unreadable ADRs fail with E201', async () => {
  const r = await decide(makeTree({ 'docs/adr/ADR-0001.md': adr(), 'docs/adr/local/ADR-0001.md': adr() }));
  assert.equal(r.code, 1);
  assert.match(r.stderr, /E201/);
});

test('decide: the prompt matches the commands reference contract', () => {
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  const { held, fresh } = suggestInputs(example());
  assert.ok(reference.includes(`~~~\n${formatDecide(held, fresh)}~~~`));
});

test('decide --json: the ADRs here, those to import, and the prompt of the text form', async () => {
  const root = example();
  const r = await decide(root, '--json');
  assert.equal(r.code, 2);
  const doc = JSON.parse(r.stdout);
  assert.deepEqual(doc, {
    $schema: schemaOf('decide'),
    adrs: [{ ref: 'local/ADR-0001-release', title: 'Release', status: 'accepted', path: 'docs/adr/local/ADR-0001-release.md' }],
    new: [{ path: 'docs/adr/platform/ADR-0006-commits.md', title: 'Commits' }],
    prompt: (await decide(root)).stdout,
  });
  documents.decide.model.parse(doc);
});
