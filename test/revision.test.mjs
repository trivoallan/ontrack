import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRevision, compareRevision } from '../src/revision.mjs';

const adr = (...frontmatter) => ['---', ...frontmatter, '---', '', '# Title', ''].join('\n');

// Bounded frontmatter

test('well-formed frontmatter is recognized', () => {
  assert.equal(readRevision(adr('status: proposed', 'revision: 2')), 2);
});

test('truncated frontmatter never takes a body example for its end', () => {
  const text = [
    '---',
    'status: proposed',
    'This prose line ends the search.',
    '```yaml',
    '---',
    'revision: 5',
    '---',
    '```',
  ].join('\n');
  assert.equal(readRevision(text), null);
  assert.equal(compareRevision(text, adr('revision: 5')), 'unreadable');
});

test('block sequence at column zero is allowed', () => {
  assert.equal(readRevision(adr('authors:', '- Jane', '- Bob', 'revision: 1')), 1);
});

test('comments, blank lines and indented continuations are allowed', () => {
  assert.equal(readRevision(adr('# note', '', 'traits:', '  commits:', 'revision: 4')), 4);
});

test('no opening fence means no frontmatter', () => {
  assert.equal(readRevision('# Title\n\nrevision: 1\n'), null);
});

test('opening fence without closing fence is unreadable', () => {
  assert.equal(readRevision('---\nrevision: 1\n'), null);
});

// Reading the revision

test('revision present', () => {
  assert.equal(readRevision(adr('revision: 3')), 3);
});

test('revision only in the body is not read', () => {
  const text = `${adr('status: proposed')}\n\`\`\`yaml\n---\nrevision: 5\n---\n\`\`\`\n`;
  assert.equal(readRevision(text), null);
});

test('non-integer value is not read', () => {
  assert.equal(readRevision(adr('revision: two')), null);
});

test('indented revision is not a top-level key', () => {
  assert.equal(readRevision(adr('traits:', '  revision: 3')), null);
});

test('CRLF line endings are tolerated', () => {
  assert.equal(readRevision('---\r\nstatus: proposed\r\nrevision: 2\r\n---\r\n# Title\r\n'), 2);
});

// Classifying an imported ADR

test('upstream moved the question: stale', () => {
  assert.equal(compareRevision(adr('revision: 1'), adr('revision: 2')), 'stale');
});

test('only the local verdict changed: up-to-date', () => {
  const imported = adr('status: accepted', 'revision: 2', 'authors:', '- Jane');
  const upstream = adr('status: proposed', 'revision: 2', 'authors: []');
  assert.equal(compareRevision(imported, upstream), 'up-to-date');
});

test('revision zero is a flag, not a number: undetermined', () => {
  assert.equal(compareRevision(adr('revision: 0'), adr('revision: 0')), 'undetermined');
});

test('no imported revision: undetermined', () => {
  assert.equal(compareRevision(adr('status: proposed'), adr('revision: 1')), 'undetermined');
});

test('upstream without revision: undetermined', () => {
  assert.equal(compareRevision(adr('revision: 1'), adr('status: proposed')), 'undetermined');
});

test('imported revision ahead of upstream: up-to-date', () => {
  assert.equal(compareRevision(adr('revision: 3'), adr('revision: 2')), 'up-to-date');
});

test('unreadable imported ADR, whatever upstream holds', () => {
  assert.equal(compareRevision('no frontmatter', adr('revision: 9')), 'unreadable');
});
