import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/cli.ts';
import { cleanup, makeTree } from './helpers/project.ts';
import { after } from 'node:test';

after(cleanup);

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = ['src', 'src/commands'].flatMap((dir) =>
  readdirSync(path.join(repo, dir))
    .filter((name) => name.endsWith('.ts'))
    .map((name) => readFileSync(path.join(repo, dir, name), 'utf8')),
).join('\n');
const page = readFileSync(path.join(repo, 'docs/error-messages.md'), 'utf8');

const used = [...sources.matchAll(/'(E\d{3})'/g)].map((m) => m[1]).sort();
const documented = [...page.matchAll(/<a id="e(\d{3})"><\/a>`E\1`/g)].map((m) => `E${m[1]}`).sort();

async function run(root: string, ...args: string[]) {
  let stderr = '';
  const code = await main(args, { cwd: () => root, stdout: { write: () => {} }, stderr: { write: (s: string) => { stderr += s; } } });
  return { code, stderr };
}

test('every failure ontrack reports carries a code', () => {
  assert.doesNotMatch(sources, /new Error\(/);
});

test('a code names one failure: none is written twice in the source', () => {
  assert.deepEqual(used, [...new Set(used)]);
});

test('the codes of the source are the codes the error page gives an address to', () => {
  assert.deepEqual(documented, used);
});

test('an error line starts with ontrack, its code in brackets, and a colon', async () => {
  const root = makeTree({ 'README.md': '' });
  const r = await run(root, 'plan');
  assert.equal(r.stderr, `ontrack[E101]: cannot read ${path.join(root, 'package.json')}; run ontrack from the root of an npm project\n`);
  assert.equal(r.code, 1);
});

test('a command line yargs refuses is E001', async () => {
  const r = await run(makeTree({ 'package.json': '{}' }), 'plann');
  assert.match(r.stderr, /^ontrack\[E001\]: Unknown argument: plann\nSee ontrack --help\.\n$/);
  assert.equal(r.code, 1);
});
