import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { main } from '../src/cli.mjs';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

async function runWith(commands, argv) {
  let stdout = '';
  let stderr = '';
  const io = {
    stdout: { write: (s) => { stdout += s; } },
    stderr: { write: (s) => { stderr += s; } },
  };
  const code = await main(argv, io, commands);
  return { code, stdout, stderr };
}

const run = (...argv) => runWith(undefined, argv);

for (const args of [['--help'], ['-h'], []]) {
  test(`aide : ontrack ${args.join(' ') || '(sans argument)'}`, async () => {
    const r = await run(...args);
    assert.equal(r.code, 0);
    assert.match(r.stdout, /ontrack plan/);
    assert.equal(r.stderr, '');
  });
}

for (const flag of ['--version', '-v']) {
  test(`version : ontrack ${flag}`, async () => {
    const r = await run(flag);
    assert.equal(r.code, 0);
    assert.equal(r.stdout.trim(), version);
  });
}

test('commande inconnue : nomme la commande et renvoie vers --help', async () => {
  const r = await run('plann');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /plann/);
  assert.match(r.stderr, /ontrack --help/);
  assert.equal(r.stdout, '');
});

test("une sous-commande qui lève une erreur sort avec le code 1", async () => {
  const boom = {
    command: 'boom',
    describe: 'test',
    handler: () => { throw new Error('panne'); },
  };
  const r = await runWith([boom], ['boom']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /panne/);
});

test("plan pas encore disponible : code 1 et message explicite", async () => {
  const r = await run('plan');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /plan.*pas encore disponible/);
});
