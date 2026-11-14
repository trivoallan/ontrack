// The apply workflow (docs/adr/ADR-0003) is the gate in front of a remote
// session that writes code. Its steps are run here as the runner would run
// them, taken from the workflow file, with `gh` and `curl` replaced by stubs.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanup, makeTree } from './helpers/project.ts';
import { readWorkflow, stepScriptOf } from './helpers/workflow.ts';

after(cleanup);

const workflow = readWorkflow('apply.yml');
const HEAD = 'a'.repeat(40);
const OLD = 'b'.repeat(40);

type Review = { user: { login: string; type: string }; author_association: string; state: string; commit_id: string };
const review = (login: string, state: string, commit_id = HEAD, extra: Partial<Review> = {}): Review => ({
  user: { login, type: 'User' },
  author_association: 'OWNER',
  state,
  commit_id,
  ...extra,
});

/** Runs one step with `gh api` answering `reviews` and every other call logged. */
function step(id: string, env: Record<string, string>, reviews: Review[] = []) {
  const root = makeTree({
    // `gh api --paginate --slurp` prints an array of pages.
    'reviews.json': JSON.stringify([reviews]),
    'bin/gh': '#!/bin/sh\nif [ "$1" = api ]; then cat "$REVIEWS"; else echo "gh $*" >> "$CALLS"; fi\n',
    'bin/curl': '#!/bin/sh\necho "curl $*" >> "$CALLS"\nprintf "%s" "$CURL_ANSWER"\n',
  });
  chmodSync(path.join(root, 'bin/gh'), 0o755);
  chmodSync(path.join(root, 'bin/curl'), 0o755);
  const calls = path.join(root, 'calls');
  const output = path.join(root, 'output');
  const run = spawnSync('bash', ['-e', '-c', stepScriptOf(workflow, id)], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
      REVIEWS: path.join(root, 'reviews.json'),
      CALLS: calls,
      GITHUB_OUTPUT: output,
      GITHUB_REPOSITORY: 'o/r',
      PR: '134',
      HEAD_SHA: HEAD,
      HEAD_REPO: 'o/r',
      STATE: 'open',
      ...env,
    },
  });
  return {
    status: run.status,
    stderr: run.stderr,
    output: existsSync(output) ? readFileSync(output, 'utf8') : '',
    calls: existsSync(calls) ? readFileSync(calls, 'utf8') : '',
  };
}

const verdict = (reviews: Review[], env: Record<string, string> = {}) => {
  const r = step('gate', env, reviews);
  assert.equal(r.status, 0, r.stderr);
  return r.output.trim();
};

test('an approval by a person with write access, on the head commit, opens the gate', () => {
  assert.equal(verdict([review('tristan', 'APPROVED')]), 'verdict=approved');
  assert.equal(verdict([review('tristan', 'APPROVED', HEAD, { author_association: 'COLLABORATOR' })]), 'verdict=approved');
});

test('a later comment does not cancel an approval', () => {
  assert.equal(verdict([review('tristan', 'APPROVED'), review('tristan', 'COMMENTED')]), 'verdict=approved');
});

const closedGate: Record<string, [Review[], string]> = {
  'no review': [[], 'not-approved'],
  'a comment only': [[review('tristan', 'COMMENTED')], 'not-approved'],
  'an approval given before the last push': [[review('tristan', 'APPROVED', OLD)], 'stale'],
  'an approval by a bot': [[review('github-actions[bot]', 'APPROVED', HEAD, { user: { login: 'github-actions[bot]', type: 'Bot' } })], 'not-approved'],
  'an approval by someone outside the repository': [[review('stranger', 'APPROVED', HEAD, { author_association: 'CONTRIBUTOR' })], 'not-approved'],
  'an approval the same person then dismissed': [[review('tristan', 'APPROVED'), review('tristan', 'DISMISSED')], 'not-approved'],
  'an approval followed by a request for changes': [[review('tristan', 'APPROVED'), review('tristan', 'CHANGES_REQUESTED')], 'changes-requested'],
  'a request for changes by another reviewer': [[review('tristan', 'APPROVED'), review('ana', 'CHANGES_REQUESTED')], 'changes-requested'],
};

for (const [what, [reviews, expected]] of Object.entries(closedGate)) {
  test(`${what} keeps the gate closed`, () => {
    assert.equal(verdict(reviews), `verdict=${expected}`);
  });
}

test('a pull request from another repository, or a closed one, is refused whatever its reviews', () => {
  assert.equal(verdict([review('tristan', 'APPROVED')], { HEAD_REPO: 'fork/r' }), 'verdict=fork');
  assert.equal(verdict([review('tristan', 'APPROVED')], { STATE: 'closed' }), 'verdict=closed');
});

test('the session is started with the pull request and its commit, and the token stays in a header', () => {
  const r = step('fire', { ROUTINE_ID: 'trig_01', TOKEN: 'secret-token' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.calls, /-X POST https:\/\/api\.anthropic\.com\/v1\/claude_code\/routines\/trig_01\/fire /);
  assert.match(r.calls, /-H Authorization: Bearer secret-token /);
  assert.match(r.calls, new RegExp(`-d \\{"text":"repository=o/r pull_request=134 head_commit=${HEAD}"\\}`));
  assert.equal(r.output.trim(), 'started=true');
});

test('the address of the session is kept only when it has the expected shape', () => {
  const fire = (answer: string) => step('fire', { ROUTINE_ID: 'trig_01', TOKEN: 't', CURL_ANSWER: answer }).output.trim();
  const url = 'https://claude.ai/code/session_01V5rMKcfrkoLNpCimmcYPr1';
  assert.equal(fire(JSON.stringify({ type: 'routine_fire', claude_code_session_url: url })), `started=true\nsession=${url}`);
  assert.equal(fire(JSON.stringify({ claude_code_session_url: 'https://evil.example/x\nverdict=approved' })), 'started=true');
  assert.equal(fire('not json'), 'started=true');
  // The address may be missing while the identifier is there, in either of its two spellings.
  assert.equal(fire(JSON.stringify({ claude_code_session_id: 'session_01V5rMKcfrkoLNpCimmcYPr1' })), `started=true\nsession=${url}`);
  assert.equal(fire(JSON.stringify({ claude_code_session_id: 'cse_01V5rMKcfrkoLNpCimmcYPr1' })), `started=true\nsession=${url}`);
  assert.equal(fire(JSON.stringify({ data: { session: { id: 'cse_01V5rMKcfrkoLNpCimmcYPr1' } } })), `started=true\nsession=${url}`);
  assert.equal(fire(JSON.stringify({ claude_code_session_id: '../../evil' })), 'started=true');
});

test('the pull request is told what happened, in fixed words', () => {
  const said = (env: Record<string, string>) => step('report', { RUN: 'https://example.test/run', ...env }).calls;
  assert.match(said({ VERDICT: 'approved', STARTED: 'true' }), /^gh pr comment 134 --repo o\/r --body An apply session was started for commit a{40}: its owner finds it/);
  assert.match(
    said({ VERDICT: 'approved', STARTED: 'true', SESSION: 'https://claude.ai/code/session_01' }),
    /started for commit a{40}: https:\/\/claude\.ai\/code\/session_01\. It reports here when it stops\./,
  );
  assert.match(said({ VERDICT: 'approved', STARTED: '' }), /could not be started/);
  assert.match(said({ VERDICT: 'stale', STARTED: '' }), /before the last push/);
  assert.match(said({ VERDICT: 'not-approved', STARTED: '' }), /must approve this pull request first/);
  assert.match(said({ VERDICT: '', STARTED: '' }), /The apply request failed/);
});

test('the workflow checks out nothing, runs no agent and starts the session only behind the gate', () => {
  assert.match(workflow, /^  pull_request_target:$/m);
  assert.doesNotMatch(workflow, /uses:/);
  assert.match(workflow, /^        if: steps\.gate\.outputs\.verdict == 'approved'$/m);
  assert.equal(workflow.match(/secrets\./g)?.length, 1);
});
