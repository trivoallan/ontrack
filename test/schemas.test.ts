import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adrFrontmatter, ontrackKey, projectManifest, sourceManifest } from '../src/schemas.ts';

const { revision, title } = adrFrontmatter.shape;

test('projectManifest: both maps are optional, other keys are kept', () => {
  assert.deepEqual(projectManifest.parse({ name: 'p' }), { name: 'p' });
  assert.deepEqual(projectManifest.parse({ dependencies: { a: '^1' } }).dependencies, { a: '^1' });
});

test('projectManifest: a dependency map must map strings to strings', () => {
  assert.equal(projectManifest.safeParse({ dependencies: ['a'] }).success, false);
  assert.equal(projectManifest.safeParse({ devDependencies: { a: 1 } }).success, false);
  assert.equal(projectManifest.safeParse(null).success, false);
});

test('sourceManifest: name is required, ontrack is left unparsed', () => {
  assert.deepEqual(sourceManifest.parse({ name: 's', ontrack: 3 }), { name: 's', ontrack: 3 });
  assert.deepEqual(sourceManifest.parse({ name: 's' }), { name: 's' });
  assert.equal(sourceManifest.safeParse({ ontrack: {} }).success, false);
});

test('ontrackKey: adr is a required string', () => {
  assert.equal(ontrackKey.safeParse({}).success, false);
  const refused = ontrackKey.safeParse({ adr: 1 });
  assert.deepEqual(refused.error?.issues[0].path, ['adr']);
});

test('ontrackKey: only an object is a key at all', () => {
  for (const value of [undefined, null, 'docs/adr', ['docs/adr']]) {
    assert.deepEqual(ontrackKey.safeParse(value).error?.issues[0].path, []);
  }
});

test('ontrackKey: a namespace that is not a string is undeclared', () => {
  assert.equal(ontrackKey.parse({ adr: 'a', namespace: 'n' }).namespace, 'n');
  assert.equal(ontrackKey.parse({ adr: 'a', namespace: null }).namespace, undefined);
  assert.equal(ontrackKey.parse({ adr: 'a' }).namespace, undefined);
});

test('ontrackKey: unknown keys are kept', () => {
  assert.deepEqual(ontrackKey.parse({ adr: 'a', later: true }), { adr: 'a', later: true });
});

test('adrFrontmatter: revision is a string of digits', () => {
  assert.equal(revision.parse('3'), 3);
  assert.equal(revision.parse('0'), 0);
  for (const value of ['1.5', '-1', 'abc', '']) assert.equal(revision.safeParse(value).success, false);
});

test('adrFrontmatter: title loses its quotes and may not be empty', () => {
  assert.equal(title.parse('Use PostgreSQL'), 'Use PostgreSQL');
  assert.equal(title.parse('"Use: PostgreSQL"'), 'Use: PostgreSQL');
  assert.equal(title.parse("'Use PostgreSQL'"), 'Use PostgreSQL');
  for (const value of ['', '""', '"  "']) assert.equal(title.safeParse(value).success, false);
});
