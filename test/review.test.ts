import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  formatImport,
  formatReview,
  formatRevision,
  formatRevisions,
  formatSequence,
  formatSupersession,
  newAdrs,
  pendingAdrs,
  revisedAdrs,
  selectAdr,
} from '../src/review.ts';
import { main } from '../src/cli.ts';
import type { Adr } from '../src/instructions.ts';
import { readAdrs, supersededBy } from '../src/instructions.ts';
import { cleanup, makeProject, makeTree } from './helpers/project.ts';

after(cleanup);

/** An ADR with the given frontmatter lines and, unless null, a `# title` heading. */
const adr = (title: string | null, ...frontmatter: string[]) =>
  ['---', ...frontmatter, '---', '', ...(title === null ? [] : [`# ${title}`, '']), 'Body.', ''].join('\n');

const COMMITS = 'docs/adr/trivoallan/ADR-0006-commits.md';
const LOCALIZATION = 'docs/adr/trivoallan/ADR-0002-localization.md';
const RECORD = 'docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md';
const RELEASE = 'docs/adr/local/ADR-0020-release.md';

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

test('prompt: both forms start from the practice, and compare with the recommendation after', () => {
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))]) {
    const step = out.match(/^2\. .*$/m)?.[0] ?? '';
    assert.ok(step.startsWith('2. Start from what this repository does today'));
    assert.ok(step.includes('an absence is evidence too'));
    assert.ok(step.includes('not as the other `proposed` ADRs would make it'));
    assert.ok(step.indexOf('does today') < step.indexOf('compare with the recommendation'));
  }
});

test('prompt: both forms mark every value observed or absent, and present the mark', () => {
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))]) {
    const choose = out.match(/^4\. .*$/m)?.[0] ?? '';
    assert.ok(choose.includes('mark it `observed` when the repository does it today'));
    assert.ok(choose.includes('`absent` when it does not and the ruling would make it do so'));
    const present = out.match(/^6\. .*$/m)?.[0] ?? '';
    assert.ok(present.includes('one line per trait key with its value, marked observed or absent, and its evidence'));
  }
});

test('prompt: an own ADR sits in docs/adr/local/', () => {
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
  assert.ok(out.includes('one at a time, in the order agreed with the user'));
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
  assert.ok(sequence.includes('one at a time, in the order agreed with the user'));
});

test('sequence: rulings are optional, and check runs only the decided ADRs', () => {
  const out = formatSequence(pendingAdrs(tree()));
  assert.match(out, /None of them has to be ruled now: the repository works with them open, and `npx ontrack check` runs only the decided ADRs\./);
});

test('sequence: a survey in two groups, agreed before the first ruling, writing nothing', () => {
  const out = formatSequence(pendingAdrs(tree()));
  const survey = out.indexOf('First, when the list holds more than one ADR, survey them');
  assert.ok(survey > 0 && survey < out.indexOf('1. '));
  assert.match(out, /survey them, writing nothing\./);
  assert.match(out, /For each ADR, take every value it asks for \(every key under `traits:`\) and look for a citation/);
  assert.match(out, /- `shows the value`: the citation states the value itself\./);
  assert.match(out, /- `next to it`: the citation shows something from which you would infer the value\./);
  assert.match(out, /An absence counts as a citation only when the absence is the value/);
  assert.match(out, /Put an ADR in the first group only when every one of its values has a citation labelled `shows the value`\. Put every other ADR in the second group, including one where a single value is held outside this repository or is inferred\./);
  assert.match(out, /Do not put an ADR in the first group on a `next to it` citation, however likely the value seems\. Do not leave a value you could not show without saying where it lives/);
  assert.match(out, /a heading per group with its number of ADRs, equal to the ADRs listed under it;\n- for the first group, one row per value: ADR, key, value, citation;\n- for the second group, one row per value you could not show, and no row for the values you could: ADR, key, where the value lives or "unknown", and any citation you have, with its label\./);
  assert.match(out, /Give a count only when it comes from a command you ran, and name the command\. Label each citation with exactly one of these two labels, word for word:/);
  assert.match(out, /A citation drawn from history alone, such as scopes read from past commits, is `next to it`\./);
  assert.match(out, /Then ask the user to agree to that order or give another, with a question tool such as `AskUserQuestion`/);
  assert.match(out, /ask the user to agree to that order or give another, with a question tool such as `AskUserQuestion`/);
});

test('sequence: skip and stop, then a summary, before the tracking items', () => {
  const out = formatSequence(pendingAdrs(tree()));
  const skip = out.indexOf('the user can also skip the ADR: leave its file untouched');
  assert.ok(skip > out.indexOf('npx ontrack apply'));
  assert.match(out, /The user can stop the review at any time: then write nothing more for the open ADR\./);
  assert.match(out, /Do not start an ADR before the previous one is ruled or skipped\./);
  const summary = out.indexOf('When the list is done or the user stops, give a summary');
  assert.ok(skip < summary && summary < out.indexOf('Once the review ends'));
  assert.match(out, /the ADRs still `proposed` with the group each belongs to, and a sentence saying the repository works with them open\./);
});

test('named ADR: no survey, no skip, no summary', () => {
  const out = formatReview(selectAdr(tree(), 'ADR-0006'));
  for (const text of ['survey them', 'skip the ADR', 'give a summary', 'None of them has to be ruled']) assert.ok(!out.includes(text), text);
});

test('prompt: both forms ask for agreement with a question tool when there is one', () => {
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))]) {
    assert.match(out, /question tool such as `AskUserQuestion` when you have one\. Write nothing/);
  }
});

test('prompt: both forms end with tracking items, proposed after the whole review', () => {
  const single = formatReview(selectAdr(tree(), 'ADR-0006'));
  const sequence = formatSequence(pendingAdrs(tree()));
  const tail = (out: string) => out.slice(out.indexOf('Once the review ends'));
  for (const out of [single, sequence]) {
    const at = out.indexOf('Once the review ends');
    assert.ok(at > out.indexOf('npx ontrack apply'));
    assert.match(tail(out), /propose a tracking item/);
    assert.match(tail(out), /`tracking\.tool`, in `tracking\.project`\) only the items the user agrees to/);
    assert.match(tail(out), /`tracking\.tool` is `none`, give the list in your reply and create nothing\.\n$/);
  }
  assert.ok(sequence.indexOf('Then take the next ADR in the list') < sequence.indexOf('Once the review ends'));
  assert.equal(tail(single), tail(sequence));
});

test('prompt: tracking items are labelled ontrack, titled by ruling, and checked for duplicates first', () => {
  const tail = (out: string) => out.slice(out.indexOf('Once the review ends'));
  for (const out of [formatReview(selectAdr(tree(), 'ADR-0006')), formatSequence(pendingAdrs(tree()))].map(tail)) {
    const list = out.indexOf('list the items in that tracker that carry the label `ontrack`, open and closed');
    assert.ok(list > 0 && list < out.indexOf('propose a tracking item'));
    assert.match(out, /`\[trivoallan\/ADR-0015\] secrets\.guard`/);
    assert.match(out, /propose nothing for a ruling whose identifier starts the title of one of those items/);
    assert.match(out, /say in one line which closed items name a ruling this repository still does not follow/);
    assert.match(out, /When you cannot list the tracker's items, propose every ruling and say that duplicates were not checked/);
    assert.match(out, /its title starts with the ruling's identifier, as in `\[trivoallan\/ADR-0015\] secrets\.guard: install gitleaks`/);
    assert.match(out, /each with the label `ontrack`, creating the label first when the tracker requires it/);
  }
});

test('prompt: every form matches the commands reference contract', () => {
  const reference = readFileSync(new URL('../docs/commands.md', import.meta.url), 'utf8');
  assert.ok(reference.includes(`~~~\n${formatReview(selectAdr(tree(), 'ADR-0006'))}~~~`));
  assert.ok(reference.includes(`~~~\n${formatSequence(pendingAdrs(tree()))}~~~`));
  assert.ok(reference.includes(`~~~\n${formatSupersession(selectAdr(tree(), 'ADR-0001'))}~~~`));
  const revised = revisedAdrs(stale());
  assert.ok(reference.includes(`~~~\n${formatRevision(revised[1])}~~~`));
  assert.ok(reference.includes(`~~~\n${formatRevisions(revised)}~~~`));
  const fresh = newAdrs(
    makeProject({
      tracks: {
        platform: {
          'ADR-0015-observability.md': asked('Observability', 1),
          'ADR-0002-localization.md': asked('Localization', 1),
        },
      },
    }),
  );
  assert.ok(reference.includes(`~~~\n${formatImport(fresh)}~~~`));
});

// Supersession prompt

test('supersession: names one ADR by path, title and reference, and no other', () => {
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  assert.ok(out.includes(`\`${RECORD}\` (Record architecture decisions).`));
  assert.ok(out.includes('`supersedes: [trivoallan/ADR-0001]`'));
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
  const tail = (out: string) => out.slice(out.indexOf('Once the review ends'));
  const out = formatSupersession(selectAdr(tree(), 'ADR-0001'));
  assert.ok(out.indexOf('Once the review ends') > out.indexOf('npx ontrack apply'));
  assert.equal(tail(out), tail(formatReview(selectAdr(tree(), 'ADR-0006'))));
});

test('supersession: same text for every ADR, an own ADR by its local reference', () => {
  const root = makeTree({
    [COMMITS]: adr('Commits', 'status: accepted'),
    [RELEASE]: ['---', 'status: accepted', '---', ''].join('\n'),
  });
  const a = selectAdr(root, 'ADR-0006-commits');
  const b = selectAdr(root, 'ADR-0020-release');
  const strip = (x: Adr) => formatSupersession(x).replace(x.path, '').replace(x.title ? ` (${x.title})` : '', '').replace(`${x.ns}/${x.id}`, '');
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

test('command: without ontrack installed, every command in the prompt names the package', async () => {
  const root = behind();
  rmSync(path.join(root, 'node_modules/.bin/ontrack'));
  const r = await review(root);
  assert.equal(r.code, 2);
  assert.equal(r.stdout, formatImport(newAdrs(root)).replaceAll('npx ontrack', 'npx -p @trivoallan/ontrack ontrack'));
  assert.ok(r.stdout.includes('`npx -p @trivoallan/ontrack ontrack apply`') && r.stdout.includes('`npx -p @trivoallan/ontrack ontrack review`'));
  assert.doesNotMatch(r.stdout, /npx ontrack/);
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

/** A track asking two questions again, and one that never was ruled. */
const stale = (local: Record<string, string> = {}) =>
  makeProject({
    tracks: {
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

test('revised: ruled ADRs behind their track, in reference order, with the track copy and both revisions', () => {
  assert.deepEqual(
    revisedAdrs(stale()).map(({ adr: a, ...rest }) => ({ ref: a.ref, ...rest })),
    [
      { ref: 'trivoallan/ADR-0001-record-architecture-decisions', track: 'node_modules/trivoallan/adr/ADR-0001-record-architecture-decisions.md', from: 1, to: 3 },
      { ref: 'trivoallan/ADR-0012-delivery', track: 'node_modules/trivoallan/adr/ADR-0012-delivery.md', from: 1, to: 2 },
    ],
  );
});

test('revised: a proposed copy is left to the review prompt, and unreadable tracks give none', () => {
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
  assert.ok(out.includes('Once the review ends'));
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

// New ADRs

const OBSERVABILITY = 'docs/adr/trivoallan/ADR-0015-observability.md';

/** `stale()`, whose track also ships two questions the repository never imported, one without a title. */
const behind = (local: Record<string, string> = {}) =>
  makeProject({
    tracks: {
      trivoallan: {
        'ADR-0001-record-architecture-decisions.md': asked('Record architecture decisions', 3),
        'ADR-0015-observability.md': asked('Observability', 1),
        'ADR-0003-architecture.md': adr(null, 'status: proposed', 'revision: 1'),
      },
    },
    local: { [RECORD]: asked('Record architecture decisions', 1, 'accepted'), ...local },
  });

test('new: the ADRs plan reports as new, in reference order, where apply writes them; none when tracks cannot be read', () => {
  assert.deepEqual(newAdrs(behind()), [
    { path: 'docs/adr/trivoallan/ADR-0003-architecture.md', title: null },
    { path: OBSERVABILITY, title: 'Observability' },
  ]);
  assert.deepEqual(newAdrs(stale()), []);
  assert.deepEqual(newAdrs(makeTree({ [RECORD]: asked('R', 1) })), []);
});

test('import prompt: lists paths and titles, apply before review, none of the ruling steps', () => {
  const out = formatImport(newAdrs(behind()));
  assert.ok(out.startsWith('Import the architecture decision records this repository does not hold yet, then review them.'));
  assert.ok(out.includes('   - `docs/adr/trivoallan/ADR-0003-architecture.md`\n   - `docs/adr/trivoallan/ADR-0015-observability.md` (Observability)\n'));
  assert.ok(out.indexOf('npx ontrack apply') < out.indexOf('npx ontrack review'));
  assert.deepEqual(out.match(/^\d\./gm), ['1.', '2.']);
  assert.ok(!out.includes('status'));
  assert.ok(out.includes('writes nothing to an ADR this repository has ruled'));
  assert.ok(out.includes('If `apply` fails, stop and report its error.'));
  assert.ok(out.includes('exits with `2` when it prints a prompt: that is not an error'));
});

test('command: new ADRs come first, before revised and before proposed ones, and the tree is unchanged', async () => {
  const root = behind();
  const before = snapshot(root);
  assert.deepEqual(await review(root), { code: 2, stdout: formatImport(newAdrs(root)), stderr: '' });
  assert.deepEqual(snapshot(root), before);
  const mixed = behind({ [LOCALIZATION]: asked('Localization', 1) });
  const r = await review(mixed);
  assert.equal(r.stdout, formatImport(newAdrs(mixed)));
  assert.ok(!r.stdout.includes(LOCALIZATION));
  assert.ok(!r.stdout.includes(RECORD));
});

test('command: new ADRs alone, in a repository without docs/adr, print the import prompt', async () => {
  const root = makeProject({ tracks: { platform: { 'ADR-0015-observability.md': asked('Observability', 1) } } });
  const r = await review(root);
  assert.equal(r.code, 2);
  assert.ok(r.stdout.includes('`docs/adr/platform/ADR-0015-observability.md` (Observability)'));
});

test('command: without tracks, a proposed ADR still gets the sequence prompt', async () => {
  const root = makeTree({ [LOCALIZATION]: asked('Localization', 1) });
  assert.equal((await review(root)).stdout, formatSequence(pendingAdrs(root)));
});

test('command: a named ADR that is not imported is unknown, and a named one ignores new ADRs', async () => {
  const root = behind({ [LOCALIZATION]: asked('Localization', 1) });
  const unknown = await review(root, 'ADR-0015');
  assert.equal(unknown.code, 1);
  assert.equal(unknown.stdout, '');
  assert.match(unknown.stderr, /ADR-0015/);
  assert.equal((await review(root, 'ADR-0002-localization')).stdout, formatReview(selectAdr(root, 'ADR-0002-localization')));
});

test('supersession: the reference it gives does supersede the ADR', () => {
  const root = makeTree({ [COMMITS]: adr('Commits', 'adr: ADR-0006', 'status: accepted') });
  const old = selectAdr(root, 'ADR-0006-commits');
  const ref = formatSupersession(old).match(/`supersedes: \[([^\]]+)\]`/)![1];
  mkdirSync(path.join(root, 'docs/adr/local'), { recursive: true });
  writeFileSync(path.join(root, 'docs/adr/local/ADR-0001-own.md'), ['---', 'adr: ADR-0001', 'status: accepted', `supersedes: [${ref}]`, '---', ''].join('\n'));
  const by = supersededBy(readAdrs(root));
  assert.equal([...by.keys()].find((a) => a.ref === old.ref)?.ref, old.ref);
});
