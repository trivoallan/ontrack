import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { main } from '../src/cli.ts';
import type { Command } from '../src/cli.ts';
import { adr, cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

async function runWith(commands: Command[] | undefined, argv: string[], cwd = process.cwd()) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => cwd,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(argv, io, commands);
  return { code, stdout, stderr };
}

const run = (...argv: string[]) => runWith(undefined, argv);

for (const args of [['--help'], ['-h'], []]) {
  test(`help: ontrack ${args.join(' ') || '(no argument)'}`, async () => {
    const r = await run(...args);
    assert.equal(r.code, 0);
    assert.match(r.stdout, /ontrack plan/);
    assert.match(r.stdout, /ontrack instructions/);
    assert.match(r.stdout, /ontrack review/);
    assert.match(r.stdout, /ontrack check/);
    assert.equal(r.stderr, '');
  });
}

for (const flag of ['--version', '-v']) {
  test(`version: ontrack ${flag}`, async () => {
    const r = await run(flag);
    assert.equal(r.code, 0);
    assert.equal(r.stdout.trim(), version);
  });
}

test('unknown command: names the command and points to --help', async () => {
  const r = await run('plann');
  assert.equal(r.code, 1);
  assert.match(r.stderr, /plann/);
  assert.match(r.stderr, /ontrack --help/);
  assert.equal(r.stdout, '');
});

test('an unknown option stops the subcommand before it does anything', async () => {
  let called = false;
  const spy = { command: 'spy', describe: 'test', handler: () => { called = true; return 0; } };
  const r = await runWith([spy], ['spy', '--bogus']);
  assert.equal(called, false);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /bogus/);
  assert.match(r.stderr, /ontrack --help/);
});

test('a subcommand that throws exits with code 1', async () => {
  const boom = {
    command: 'boom',
    describe: 'test',
    handler: () => { throw new Error('boom'); },
  };
  const r = await runWith([boom], ['boom']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /boom/);
});

test('exit codes: pending changes give 2', async () => {
  const root = makeProject({
    tracks: { platform: { 'A.md': adr(2) } },
    local: { 'docs/adr/platform/A.md': adr(1) },
  });
  assert.equal((await runWith(undefined, ['plan'], root)).code, 2);
});

test('exit codes: an error gives 1 and explains it', async () => {
  const r = await runWith(undefined, ['plan'], makeTree({ 'README.md': '' }));
  assert.equal(r.code, 1);
  assert.match(r.stderr, /package\.json/);
});
