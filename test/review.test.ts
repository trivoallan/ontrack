import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import {
  formatReview,
  formatRevision,
  formatRevisions,
  formatSequence,
  formatSupersession,
  pendingAdrs,
  revisedAdrs,
  selectAdr,
} from '../src/review.ts';
import { main } from '../src/cli.ts';
import type { Adr } from '../src/instructions.ts';
import { cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

/** An ADR with the given frontmatter lines and, unless null, a `# title` heading. */
const adr = (title: string | null, ...frontmatter: string[]) =>
  ['---', ...frontmatter, '---', '', ...(title === null ? [] : [`# ${title}`, '']), 'Body.', ''].join('\n');

const COMMITS = 'docs/adr/trivoallan/ADR-0006-commits.md';
const LOCALIZATION = 'docs/adr/trivoallan/ADR-0002-localization.md';
const RECORD = 'docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md';
const RELEASE = 'docs/adr/ADR-0020-release.md';

const tree = () =>
  makeTree({
    [RECORD]: adr('Record architecture decisions', 'adr: ADR-0001', 'status: accepted'),
    [LOCALIZATION]: adr('Localization', 'adr: ADR-0002', 'status: proposed'),
    [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: proposed'),
  });

async function review(root: string, ...args: string[]) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s: string) => { stdout += s; } },
    stderr: { write: (s: string) => { stderr += s; } },
  };
  const code = await main(['review', ...args], io);
  return { code, stdout, stderr };
}

function snapshot(dir: string, base = dir): [string, string][] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? snapshot(full, base) : [[path.relative(base, full), readFileSync(full, 'utf8')]];
  });
}

const refs = (adrs: Adr[]) => adrs.map((a) => a.ref);

// Every pending ADR

test('pending: reference order, local before a namespace', () => {
  const root = makeTree({
    [RELEASE]: adr('Release', 'status: proposed'),
    [LOCALIZATION]: adr('Localization', 'status: proposed'),
    [COMMITS]: adr('Commits', 'status: proposed'),
  });
  assert.deepEqual(refs(pendingAdrs(root)), [
    'local/ADR-0020-release',
    'trivoallan/ADR-0002-localization',
    'trivoallan/ADR-0006-commits',
  ]);
});

test('pending: decided ADRs are skipped', () => {
  assert.deepEqual(refs(pendingAdrs(tree())), ['trivoallan/ADR-0002-localization', 'trivoallan/ADR-0006-commits']);
});

test('pending: nothing pending, or no docs/adr/, gives none', () => {
  assert.deepEqual(pendingAdrs(makeTree({ [RECORD]: adr('R', 'status: accepted'), [COMMITS]: adr('C', 'status: rejected') })), []);
  assert.deepEqual(pendingAdrs(makeTree({ 'README.md': '' })), []);
});

test('a conflict between decided ADRs does not stop the review', () => {
  const decided = (title: string) => adr(title, 'status: accepted', 'traits:', '  commits:', '    tool: commitlint');
  const root = makeTree({
    [COMMITS]: decided('Commits'),
    'docs/adr/ADR-0012-commits.md': decided('Commits again'),
    [LOCALIZATION]: adr('Localization', 'status: proposed'),
  });
  assert.deepEqual(refs(pendingAdrs(root)), ['trivoallan/ADR-0002-localization']);
});

// Named ADR

for (const name of ['trivoallan/ADR-0006-commits', 'ADR-0006', 'ADR-0006-commits']) {
  test(`named: ${name}`, () => {
    assert.equal(selectAdr(tree(), name).ref, 'trivoallan/ADR-0006-commits');
  });
}

test('named: unknown', () => {
  assert.throws(() => selectAdr(tree(), 'ADR-0099'), /ADR-0099/);
  assert.throws(() => selectAdr(tree(), 'local/ADR-0006-commits'), /local\/ADR-0006-commits/);
});

test('named: ambiguous lists both references', () => {
  const root = makeTree({
    'docs/adr/ADR-0006-release.md': adr('Release', 'adr: ADR-0006', 'status: proposed'),
    [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: proposed'),
  });
  assert.throws(
    () => selectAdr(root, 'ADR-0006'),
    (err) => err instanceof Error && err.message.includes('local/ADR-0006-release') && err.message.includes('trivoallan/ADR-0006-commits'),
  );
});

test('named: an accepted ADR in force is selected', () => {
  assert.equal(selectAdr(tree(), 'ADR-0001').ref, 'trivoallan/ADR-0001-record-architecture-decisions');
});

test('named: already superseded names both, unless the superseding ADR is only proposed', () => {
  const files = (status: string) => ({
    [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: accepted'),
    'docs/adr/ADR-0001-commits.md': adr('Own commits', `status: ${status}`, 'supersedes: [trivoallan/ADR-0006]'),
  });
  assert.throws(
    () => selectAdr(makeTree(files('accepted')), 'ADR-0006'),
    /trivoallan\/ADR-0006-commits is already superseded by local\/ADR-0001-commits/,
  );
  assert.equal(selectAdr(makeTree(files('proposed')), 'ADR-0006').ref, 'trivoallan/ADR-0006-commits');
});

test('named: rejected, or without a status', () => {
  const rejected = makeTree({ [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: rejected') });
  assert.throws(() => selectAdr(rejected, 'ADR-0006'), /trivoallan\/ADR-0006-commits is rejected/);
  const root = makeTree({ [COMMITS]: adr('Commits', 'adr: ADR-0006') });
  assert.throws(() => selectAdr(root, 'ADR-0006'), /without a status/);
});

test('named: a trait conflict does not stop a supersession', () => {
  const decided = (title: string) => adr(title, 'status: accepted', 'traits:', '  commits:', '    tool: commitlint');
  const root = makeTree({ [COMMITS]: decided('Commits'), 'docs/adr/ADR-0012-commits.md': decided('Commits again') });
  assert.equal(selectAdr(root, 'ADR-0006-commits').ref, 'trivoallan/ADR-0006-commits');
});

// Prompt

test('prompt: names one ADR by path and title, and no other', () => {
  const out = formatReview(selectAdr(tree(), 'ADR-0006'));
  assert.ok(out.includes(`\`${COMMITS}\` (Commits).`));
  assert.ok(!out.includes(LOCALIZATION));
  assert.ok(!out.includes(RECORD));
});

test('prompt: agreement comes before writing, and apply closes it', () => {
  const out = formatReview(selectAdr(tree(), 'ADR-0002'));
  const stop = out.indexOf('Write nothing until the user agrees');
  assert.ok(stop > 0);
  assert.ok(stop < out.indexOf('set the status'));
  assert.ok(out.indexOf('set the status') < out.indexOf('npx ontrack apply'));
  assert.deepEqual(out.match(/^\d\./gm), ['1.', '2.', '3.', '4.', '5.', '6.', '7.']);
});

test('prompt: an own ADR sits directly in docs/adr/', () => {
  const root = makeTree({ [RELEASE]: adr('Release', 'status: proposed') });
  assert.ok(formatReview(selectAdr(root, 'ADR-0020-release')).includes(`\`${RELEASE}\``));
});

test('prompt: same text for every ADR, and an untitled ADR is named by its path', () => {
  const root = makeTree({
    [COMMITS]: adr('Commits', 'status: proposed'),
    [RELEASE]: ['---', 'status: proposed', '---', ''].join('\n'),
  });
  const a = selectAdr(root, 'ADR-0006-commits');
  const b = selectAdr(root, 'ADR-0020-release');
  const strip = (x: Adr) => formatReview(x).replace(x.path, '').replace(x.title ? ` (${x.title})` : '', '');
  assert.equal(strip(a), strip(b));
  assert.ok(formatReview({ ...b, title: '' }).includes(`\`${RELEASE}\`.`));
});

test('sequence: lists every ADR in order and holds the steps once', () => {
  const out = formatSequence(pendingAdrs(tree()));
  assert.ok(out.includes(`- \`${LOCALIZATION}\` (Localization)\n- \`${COMMITS}\` (Commits)\n`));
  assert.ok(out.includes('one at a time, in this order'));
  assert.deepEqual(out.match(/^\d\./gm), ['1.', '2.', '3.', '4.', '5.', '6.', '7.']);
  assert.ok(!out.includes(RECORD));
});

test('sequence: the next ADR comes after agreement and apply', () => {
  const out = formatSequence(pendingAdrs(tree()));
  const stop = out.indexOf('Write nothing until the user agrees');
  const apply = out.indexOf('npx ontrack apply');
  assert.ok(stop > 0 && stop < apply);
  assert.ok(apply < out.indexOf('Then take the next ADR in the list'));
});

test('sequence: same steps as the single prompt, and a list of one', () => {
  const steps = (out: string) => out.slice(out.indexOf('1. '), out.indexOf('AGENTS.md.') + 10);
  const root = makeTree({ [LOCALIZATION]: adr('Localization', 'status: proposed') });
  const sequence = formatSequence(pendingAdrs(root));
  assert.equal(steps(sequence), steps(formatReview(selectAdr(root, 'ADR-0002-localization'))));
  assert.ok(sequence.includes('one at a time, in this order'));
});

test('prompt: both forms ask for agreement with a question tool when there is one', () => {
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))]) {
    assert.match(out, /question tool such as `AskUserQuestion` when you have one\. Write nothing/);
  }
});

test('prompt: both forms end with tracking items, proposed after the whole review', () => {
  const single = formatReview(selectAdr(tree(), 'ADR-0006'));
  const sequence = formatSequence(pendingAdrs(tree()));
  const tail = (out: string) => out.slice(out.indexOf('Once every ADR is ruled'));
  for (const out of [single, sequence]) {
    const at = out.indexOf('Once every ADR is ruled');
    assert.ok(at > out.indexOf('npx ontrack apply'));
    assert.match(tail(out), /propose a tracking item/);
    assert.match(tail(out), /`tracking\.tool`, in `tracking\.project`\) only the items the user agrees to/);
    assert.match(tail(out), /`tracking\.tool` is `none`, give the list in your reply and create nothing\.\n$/);
  }
  assert.ok(sequence.indexOf('Then take the next ADR in the list') < sequence.indexOf('Once every ADR is ruled'));
  assert.equal(tail(single), tail(sequence));
});

test('prompt: tracking items are labelled ontrack, titled by ruling, and checked for duplicates first', () => {
  const tail = (out: string) => out.slice(out.indexOf('Once every ADR is ruled'));
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))].map(tail)) {
    const list = out.indexOf('list the items in that tracker that carry the label `ontrack`, open and closed');
    assert.ok(list > 0 && list < out.indexOf('propose a tracking item'));
    assert.match(out, /`ADR-0015 secrets\.guard`/);
    assert.match(out, /propose nothing for a ruling whose identifier starts the title of one of those items/);
    assert.match(out, /say in one line which closed items name a ruling this repository still does not follow/);
    assert.match(out, /When you cannot list the tracker's items, propose every ruling and say that duplicates were not checked/);
    assert.match(out, /its title starts with the ruling's identifier, as in `ADR-0015 secrets\.guard: install gitleaks`/);
    assert.match(out, /each with the label `ontrack`, creating the label first when the tracker requires it/);
  }
});

test('prompt: every form matches the README contract', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  assert.ok(readme.includes(`~~~\n${formatReview(selectAdr(tree(), 'ADR-0006'))}~~~`));
  assert.ok(readme.includes(`~~~\n${formatSequence(pendingAdrs(tree()))}~~~`));
  assert.ok(readme.includes(`~~~\n${formatSupersession(selectAdr(tree(), 'ADR-0001'))}~~~`));
  const revised = revisedAdrs(stale());
  assert.ok(readme.includes(`~~~\n${formatRevision(revised[1])}~~~`));
  assert.ok(readme.includes(`~~~\n${formatRevisions(revised)}~~~`));
});

// Supersession prompt

test('supersession: names one ADR by path, title and reference, and no other', () => {
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  assert.ok(out.includes(`\`${RECORD}\` (Record architecture decisions).`));
  assert.ok(out.includes('`supersedes: [trivoallan/ADR-0001-record-architecture-decisions]`'));
  assert.ok(!out.includes(LOCALIZATION));
  assert.ok(!out.includes(COMMITS));
  assert.deepEqual(out.match(/^\d\./gm), ['1.', '2.', '3.', '4.', '5.', '6.']);
});

test('supersession: agreement comes before writing, and apply closes it', () => {
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  const stop = out.indexOf('question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees');
  const write = out.indexOf('write the new ADR');
  assert.ok(stop > 0 && stop < write);
  assert.ok(write < out.indexOf('npx ontrack apply'));
});

test('supersession: no trait key left out, marking left to the repository rules', () => {
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  assert.match(out, /Leave no key out: a key the new ADR omits is no longer decided/);
  assert.match(out, /`check:` command, propose to keep it, change it or drop it/);
  assert.match(out, /Mark the superseded ADR only as the repository's rules spell out; when they do not say what to write in it, leave its file untouched/);
  assert.ok(!out.includes('status: superseded'));
});

test('supersession: ends with the tracking items of the review prompt', () => {
  const tail = (out: string) => out.slice(out.indexOf('Once every ADR is ruled'));
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  assert.ok(out.indexOf('Once every ADR is ruled') > out.indexOf('npx ontrack apply'));
  assert.equal(tail(out), tail(formatReview(selectAdr(tree(), 'ADR-0006'))));
});

test('supersession: same text for every ADR, an own ADR by its local reference', () => {
  const root = makeTree({
    [COMMITS]: adr('Commits', 'status: accepted'),
    [RELEASE]: ['---', 'status: accepted', '---', ''].join('\n'),
  });
  const a = selectAdr(root, 'ADR-0006-commits');
  const b = selectAdr(root, 'ADR-0020-release');
  const strip = (x: Adr) => formatSupersession(x).replace(x.path, '').replace(x.title ? ` (${x.title})` : '', '').replace(x.ref, '');
  assert.equal(strip(a), strip(b));
  assert.ok(formatSupersession(b).includes(`\`${RELEASE}\``));
  assert.ok(formatSupersession(b).includes('`supersedes: [local/ADR-0020-release]`'));
});

// Command

test('command: prints the sequence prompt, exits 2, leaves the tree unchanged', async () => {
  const root = tree();
  const before = snapshot(root);
  const r = await review(root);
  assert.equal(r.code, 2);
  assert.equal(r.stdout, formatSequence(pendingAdrs(root)));
  assert.equal(r.stderr, '');
  assert.deepEqual(snapshot(root), before);
});

test('command: a named ADR', async () => {
  const root = tree();
  const r = await review(root, 'ADR-0006');
  assert.equal(r.code, 2);
  assert.equal(r.stdout, formatReview(selectAdr(root, 'ADR-0006')));
});

test('command: nothing to review exits 0 with an empty stdout', async () => {
  for (const root of [makeTree({ [RECORD]: adr('R', 'status: accepted') }), makeTree({ 'README.md': '' })]) {
    const r = await review(root);
    assert.equal(r.code, 0);
    assert.equal(r.stdout, '');
    assert.match(r.stderr, /no ADR is proposed or revised/);
  }
});

test('command: an accepted name prints the supersession prompt, exits 2, leaves the tree unchanged', async () => {
  const root = tree();
  const before = snapshot(root);
  const r = await review(root, 'ADR-0001');
  assert.equal(r.code, 2);
  assert.equal(r.stdout, formatSupersession(selectAdr(root, 'ADR-0001')));
  assert.equal(r.stderr, '');
  assert.deepEqual(snapshot(root), before);
});

test('command: a rejected name exits 1 with an empty stdout', async () => {
  const r = await review(makeTree({ [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: rejected') }), 'ADR-0006');
  assert.equal(r.code, 1);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /rejected/);
});

// Revised ADRs

const DELIVERY = 'docs/adr/trivoallan/ADR-0012-delivery.md';
const asked = (title: string, revision: number, status = 'proposed') => adr(title, `status: ${status}`, `revision: ${revision}`);

/** A source asking two questions again, and one that never was ruled. */
const stale = (local: Record<string, string> = {}) =>
  makeProject({
    sources: {
      trivoallan: {
        'ADR-0001-record-architecture-decisions.md': asked('Record architecture decisions', 3),
        'ADR-0002-localization.md': asked('Localization', 2),
        'ADR-0012-delivery.md': asked('Delivery', 2),
      },
    },
    local: {
      [RECORD]: asked('Record architecture decisions', 1, 'accepted'),
      [LOCALIZATION]: asked('Localization', 2, 'accepted'),
      [DELIVERY]: asked('Delivery', 1, 'rejected'),
      ...local,
    },
  });

test('revised: ruled ADRs behind their source, in reference order, with the source copy and both revisions', () => {
  assert.deepEqual(
    revisedAdrs(stale()).map(({ adr: a, ...rest }) => ({ ref: a.ref, ...rest })),
    [
      { ref: 'trivoallan/ADR-0001-record-architecture-decisions', source: 'node_modules/trivoallan/adr/ADR-0001-record-architecture-decisions.md', from: 1, to: 3 },
      { ref: 'trivoallan/ADR-0012-delivery', source: 'node_modules/trivoallan/adr/ADR-0012-delivery.md', from: 1, to: 2 },
    ],
  );
});

test('revised: a proposed copy is left to the review prompt, and unreadable sources give none', () => {
  const root = stale({ [DELIVERY]: asked('Delivery', 1) });
  assert.deepEqual(refs(revisedAdrs(root).map((r) => r.adr)), ['trivoallan/ADR-0001-record-architecture-decisions']);
  assert.deepEqual(revisedAdrs(makeTree({ [RECORD]: asked('R', 1, 'accepted') })), []);
});

test('revised prompt: names both copies and both revisions, seven steps, the tracking paragraph', () => {
  const [, delivery] = revisedAdrs(stale());
  const out = formatRevision(delivery);
  assert.ok(out.startsWith(`Rule again one architecture decision record of this repository: \`${DELIVERY}\` (Delivery).`));
  assert.ok(out.includes('ruled on revision 1, and `node_modules/trivoallan/adr/ADR-0012-delivery.md` asks revision 2'));
  assert.ok(!out.includes(RECORD));
  assert.deepEqual(out.match(/^\d\./gm), ['1.', '2.', '3.', '4.', '5.', '6.', '7.']);
  assert.ok(out.includes('Once every ADR is ruled'));
});

test('command: a revised name prints the prompt to rule again, even rejected, and leaves the tree unchanged', async () => {
  const root = stale();
  const before = snapshot(root);
  const [record, delivery] = revisedAdrs(root);
  assert.deepEqual(await review(root, 'ADR-0001-record-architecture-decisions'), { code: 2, stdout: formatRevision(record), stderr: '' });
  assert.deepEqual(await review(root, 'trivoallan/ADR-0012-delivery'), { code: 2, stdout: formatRevision(delivery), stderr: '' });
  assert.deepEqual(snapshot(root), before);
});

test('command: an accepted name that is not revised still prints the supersession prompt', async () => {
  const root = stale();
  const r = await review(root, 'ADR-0002-localization');
  assert.equal(r.stdout, formatSupersession(selectAdr(root, 'ADR-0002-localization')));
});

test('command: without an argument, the revised ADRs come once no ADR is proposed', async () => {
  const root = stale();
  assert.deepEqual(await review(root), { code: 2, stdout: formatRevisions(revisedAdrs(root)), stderr: '' });
  const mixed = stale({ [LOCALIZATION]: asked('Localization', 2) });
  assert.equal((await review(mixed)).stdout, formatSequence(pendingAdrs(mixed)));
});
