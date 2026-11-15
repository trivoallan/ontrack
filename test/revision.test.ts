import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRevision, compareRevision, readTitle, setRevision } from '../src/revision.ts';

const adr = (...frontmatter: string[]) => ['---', ...frontmatter, '---', '', '# Title', ''].join('\n');

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

// Reading the title

test('frontmatter title', () => {
  assert.equal(readTitle(adr('title: Commits', 'revision: 1'), 'SDR-0006'), 'Commits');
});

test('quoted frontmatter title', () => {
  assert.equal(readTitle(adr('title: "Forge and CI"'), 'SDR-0010'), 'Forge and CI');
});

test('heading repeating the name', () => {
  const text = '---\nrevision: 1\n---\n\n# ADR-0001: Record significant decisions as ADRs\n';
  assert.equal(readTitle(text, 'ADR-0001'), 'Record significant decisions as ADRs');
});

test('plain heading', () => {
  assert.equal(readTitle('---\nrevision: 1\n---\n# Software Architecture\n', 'SDR-0003'), 'Software Architecture');
});

test('heading that only starts like another name is kept whole', () => {
  assert.equal(readTitle('---\n---\n# Commits: a convention\n', 'SDR-0006'), 'Commits: a convention');
});

test('no title', () => {
  assert.equal(readTitle('---\nrevision: 1\n---\n\nNo heading here.\n', 'X'), null);
});

test('empty title falls back to null', () => {
  assert.equal(readTitle(adr('title: ""'), 'X'), null);
  assert.equal(readTitle('---\n---\n# X:\n', 'X'), null);
});

test('unreadable frontmatter still reads the heading', () => {
  assert.equal(readTitle('# Rules\n\nBody.\n', 'X'), 'Rules');
});

test('the frontmatter example in the body is not a title track', () => {
  const text = '---\nrevision: 1\n---\n# Real title\n\n```yaml\n---\ntitle: Example\n---\n```\n';
  assert.equal(readTitle(text, 'X'), 'Real title');
});

test('CRLF title', () => {
  assert.equal(readTitle('---\r\ntitle: Commits\r\n---\r\n', 'X'), 'Commits');
});

// Setting the revision

test('setRevision replaces an existing revision and nothing else', () => {
  const text = '---\nstatus: accepted\nrevision: 0\nauthors:\n- Jane\n---\n\n# T\n\nrevision: 9\n';
  assert.equal(setRevision(text, 2), text.replace('revision: 0', 'revision: 2'));
});

test('setRevision inserts after status, or first', () => {
  assert.equal(setRevision('---\ntitle: X\nstatus: proposed\n---\nBody\n', 3), '---\ntitle: X\nstatus: proposed\nrevision: 3\n---\nBody\n');
  assert.equal(setRevision('---\ntitle: X\n---\nBody\n', 3), '---\nrevision: 3\ntitle: X\n---\nBody\n');
});

test('setRevision never touches a body example', () => {
  const text = '---\nstatus: proposed\n---\n\n```yaml\n---\nrevision: 5\n---\n```\n';
  const out = setRevision(text, 1);
  assert.equal(readRevision(out), 1);
  assert.match(out, /```yaml\n---\nrevision: 5\n---\n```/);
});

test('setRevision keeps CRLF line endings', () => {
  assert.equal(setRevision('---\r\nstatus: x\r\n---\r\n', 4), '---\r\nstatus: x\r\nrevision: 4\r\n---\r\n');
});

test('setRevision refuses an unreadable frontmatter', () => {
  assert.throws(() => setRevision('no frontmatter', 1), /frontmatter/);
});

// Check line

test('readCheckLine reads the frontmatter line only, right-trimmed', async () => {
  const { readCheckLine } = await import('../src/revision.ts');
  assert.equal(readCheckLine('---\nrevision: 1\ncheck: exit 0  # why  \n---\n'), 'check: exit 0  # why');
  assert.equal(readCheckLine('---\nrevision: 1\n---\n\ncheck: exit 0\n'), null);
  assert.equal(readCheckLine('no frontmatter'), null);
});
test('setCheckLine replaces, inserts after revision, removes, and nothing else', async () => {
  const { setCheckLine } = await import('../src/revision.ts');
  const text = '---\nstatus: accepted\nrevision: 1\ncheck: exit 0\ntraits:\n  a:\n    b: c\n---\n\n# T\n\ncheck: body\n';
  assert.equal(setCheckLine(text, 'check: exit 1  # stricter'), text.replace('check: exit 0', 'check: exit 1  # stricter'));
  assert.equal(setCheckLine(text, null), text.replace('check: exit 0\n', ''));
  const without = text.replace('check: exit 0\n', '');
  assert.equal(setCheckLine(without, 'check: exit 0'), text);
});
test('setCheckLine keeps CRLF line endings', async () => {
  const { setCheckLine } = await import('../src/revision.ts');
  assert.equal(setCheckLine('---\r\nrevision: 1\r\n---\r\n', 'check: x'), '---\r\nrevision: 1\r\ncheck: x\r\n---\r\n');
});
test('setCheckLine refuses an unreadable frontmatter', async () => {
  const { setCheckLine } = await import('../src/revision.ts');
  assert.throws(() => setCheckLine('no frontmatter', 'check: x'), /frontmatter/);
});

test('readStatus reads the first frontmatter status, without comment or quotes', async () => {
  const { readStatus } = await import('../src/revision.ts');
  assert.equal(readStatus('---\nstatus: rejected\n---\n'), 'rejected');
  assert.equal(readStatus('---\nstatus: accepted     # proposed as shipped\r\n---\n'), 'accepted');
  assert.equal(readStatus('---\nstatus: "accepted"\n---\n'), 'accepted');
  assert.equal(readStatus('---\nstatus: accepted\nstatus: rejected\n---\n'), 'accepted');
  assert.equal(readStatus('---\nrevision: 1\n---\n\nstatus: accepted\n'), null);
  assert.equal(readStatus('---\nstatus:\n---\n'), null);
  assert.equal(readStatus('---\nstatus: # to rule\n---\n'), null);
  assert.equal(readStatus('no frontmatter'), null);
});
