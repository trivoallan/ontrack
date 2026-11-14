import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { findLinks } from '../src/links.ts';
import { cleanup, makeTree } from './helpers/project.ts';

after(cleanup);

const move = (root: string, file: string) => ({
  from: path.join(root, 'docs/adr', file),
  to: path.join(root, 'docs/adr/platform', file),
});

test('inline link listed with the anchor stripped, file untouched', () => {
  const arc42 = 'Intro\n'.repeat(11) + 'See [commits](adr/SDR-0006.md#context).\n';
  const root = makeTree({ 'docs/arc42.md': arc42, 'docs/adr/SDR-0006.md': '' });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]), [
    { file: 'docs/arc42.md', line: 12, old: 'adr/SDR-0006.md', new: 'adr/platform/SDR-0006.md' },
  ]);
  assert.equal(readFileSync(path.join(root, 'docs/arc42.md'), 'utf8'), arc42);
});

test('images, titles, angle brackets and reference definitions are recognized', () => {
  const root = makeTree({
    'README.md': [
      '![diagram](docs/adr/SDR-0006.md "title")',
      '[a](<docs/adr/SDR-0006.md>)',
      '[ref]: docs/adr/SDR-0006.md "Title"',
    ].join('\n'),
  });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]).map((l) => l.line), [1, 2, 3]);
});

test('links in a fenced code block are ignored', () => {
  const root = makeTree({ 'README.md': '```md\n[x](docs/adr/SDR-0006.md)\n```\n~~~\n[y](docs/adr/SDR-0006.md)\n~~~\n' });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]), []);
});

test('URLs, absolute paths, anchors and other files are skipped', () => {
  const root = makeTree({
    'README.md': [
      '[u](https://example.com/docs/adr/SDR-0006.md)',
      '[a](/docs/adr/SDR-0006.md)',
      '[h](#section)',
      '[o](docs/adr/SDR-0010.md)',
    ].join('\n'),
  });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]), []);
});

test('node_modules and .git are not scanned; results are sorted', () => {
  const root = makeTree({
    'node_modules/x/README.md': '[x](../../docs/adr/SDR-0006.md)',
    '.git/notes.md': '[x](../docs/adr/SDR-0006.md)',
    'z.md': '[z](docs/adr/SDR-0006.md)',
    'a.md': 'x\n[a](docs/adr/SDR-0006.md) [b](docs/adr/SDR-0006.md)',
  });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]).map((l) => `${l.file}:${l.line}`), ['a.md:2', 'a.md:2', 'z.md:1']);
});

test('links inside docs/adr itself resolve from their own directory', () => {
  const root = makeTree({ 'docs/adr/0001-local.md': 'See [s](SDR-0006.md).\n' });
  assert.deepEqual(findLinks(root, [move(root, 'SDR-0006.md')]), [
    { file: 'docs/adr/0001-local.md', line: 1, old: 'SDR-0006.md', new: 'platform/SDR-0006.md' },
  ]);
});

test('a moved file: links to files moved with it stay valid, links to files left behind are listed', () => {
  const root = makeTree({
    'docs/adr/SDR-0006.md': 'See [ten](SDR-0010.md), [local](0001-local.md) and [gone](missing.md).\n',
    'docs/adr/0001-local.md': '',
  });
  const moves = [move(root, 'SDR-0006.md'), move(root, 'SDR-0010.md')];
  assert.deepEqual(findLinks(root, moves), [
    { file: 'docs/adr/platform/SDR-0006.md', line: 1, old: '0001-local.md', new: '../0001-local.md' },
  ]);
});
