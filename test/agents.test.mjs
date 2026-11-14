import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { agentsStatus, writeAgents } from '../src/agents.mjs';
import { buildInstructions, formatInstructions } from '../src/instructions.mjs';
import { main } from '../src/cli.mjs';
import { adr, cleanup, makeProject, makeTree, withAgents } from './helpers/project.mjs';

after(cleanup);

const decided = (key = 'commits') =>
  ['---', 'status: accepted', 'revision: 1', 'traits:', `  ${key}:`, '    tool: commitlint', '---', '', '# Commits', ''].join('\n');
const block = (root) => formatInstructions(buildInstructions(root));
const read = (root, rel = 'AGENTS.md') => readFileSync(path.join(root, rel), 'utf8');
const WARNING = 'AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md';

async function run(root, ...argv) {
  let stdout = '';
  let stderr = '';
  const io = {
    cwd: () => root,
    stdout: { write: (s) => { stdout += s; } },
    stderr: { write: (s) => { stderr += s; } },
  };
  const code = await main(argv, io);
  return { code, stdout, stderr };
}

// The rules block / block state

test('nothing to keep: no ADR, no AGENTS.md', async () => {
  const root = makeTree({ 'package.json': '{}' });
  assert.equal(agentsStatus(root).state, 'none');
  assert.equal((await run(root, 'plan')).stdout, 'no ontrack source found\n');
  await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'AGENTS.md')), false);
});

test('current, out of date and missing', () => {
  const files = { 'package.json': '{}', 'docs/adr/0001.md': decided() };
  assert.equal(agentsStatus(makeTree(files)).state, 'missing');
  assert.equal(agentsStatus(makeTree({ ...files, 'AGENTS.md': '# Mine\n' })).state, 'missing');
  assert.equal(agentsStatus(withAgents(makeTree(files))).state, 'current');
  const stale = makeTree({ ...files, 'AGENTS.md': '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n' });
  assert.equal(agentsStatus(stale).state, 'out of date');
});

test('an existing marker makes the block needed even with no ADR', () => {
  const root = makeTree({ 'package.json': '{}', 'AGENTS.md': '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n' });
  assert.equal(agentsStatus(root).state, 'out of date');
});

for (const [name, text] of [
  ['two pairs', '<!-- ontrack:begin -->\n<!-- ontrack:end -->\n<!-- ontrack:begin -->\n<!-- ontrack:end -->\n'],
  ['begin without end', '<!-- ontrack:begin -->\n'],
  ['end before begin', '<!-- ontrack:end -->\n<!-- ontrack:begin -->\n'],
]) {
  test(`malformed markers are skipped: ${name}`, () => {
    const s = agentsStatus(makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': text }));
    assert.equal(s.state, 'skipped');
    assert.match(s.reason, /ontrack:begin.*ontrack:end/);
  });
}

test('trait conflict is skipped with the instructions message', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'docs/adr/0002.md': decided() });
  const s = agentsStatus(root);
  assert.equal(s.state, 'skipped');
  const direct = await run(root, 'instructions');
  assert.ok(direct.stderr.includes(s.reason));
  const r = await run(root, 'plan');
  assert.equal(r.code, 2);
  assert.ok(r.stdout.includes(`AGENTS.md: skipped, ${s.reason}`));
});

// plan reports the block

test('plan reports a missing block and exits 2, without writing', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided() });
  const r = await run(root, 'plan');
  assert.equal(r.stdout, 'no ontrack source found\nAGENTS.md: rules block missing\n');
  assert.equal(r.code, 2);
  assert.equal(existsSync(path.join(root, 'AGENTS.md')), false);
});

test('plan: only the rules block is stale gives 2', async () => {
  const root = makeProject({ sources: { platform: { 'A.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1), 'AGENTS.md': '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n' } });
  const r = await run(root, 'plan');
  assert.equal(r.stdout, 'platform: 1 unchanged\nAGENTS.md: rules block out of date\n');
  assert.equal(r.code, 2);
});

// apply writes the block

test('block replaced, the rest untouched', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '# Mine\n\n<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n\nMore of mine.\n' });
  const r = await run(root, 'apply');
  assert.equal(read(root), `# Mine\n\n${block(root)}\nMore of mine.\n`);
  assert.equal(r.stdout, 'AGENTS.md: rules block updated\n');
  assert.equal(r.code, 0);
});

test('block appended after an empty line, with or without a final newline', async () => {
  for (const mine of ['# Mine\n', '# Mine']) {
    const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': mine });
    const r = await run(root, 'apply');
    assert.equal(read(root), `# Mine\n\n${block(root)}`);
    assert.equal(r.stdout, 'AGENTS.md: rules block created\n');
  }
});

test('an empty AGENTS.md receives the block alone', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '' });
  await run(root, 'apply');
  assert.equal(read(root), block(root));
});

test('file created after an import, listing the pending ADR', async () => {
  const root = makeProject({ sources: { platform: { 'SDR-0015.md': adr(1, 'proposed', 'Observability') } } });
  const r = await run(root, 'apply');
  assert.match(read(root), /### Not yet decided\n\n- Observability \(platform\/SDR-0015\)/);
  assert.equal(r.code, 0);
  assert.equal((await run(root, 'plan')).code, 0);
});

test('skipped does not stop the ADR actions', async () => {
  const twoPairs = '<!-- ontrack:begin -->\n<!-- ontrack:end -->\n<!-- ontrack:begin -->\n<!-- ontrack:end -->\n';
  const root = makeProject({ sources: { platform: { 'NEW.md': adr(1) } }, local: { 'AGENTS.md': twoPairs } });
  const r = await run(root, 'apply');
  assert.equal(existsSync(path.join(root, 'docs/adr/platform/NEW.md')), true);
  assert.equal(read(root), twoPairs);
  assert.match(r.stdout, /^AGENTS\.md: skipped, expected one /m);
  assert.equal(r.code, 2);
});

test('CRLF kept on every line, block included', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '# Mine\r\n<!-- ontrack:begin -->\r\nold\r\n<!-- ontrack:end -->\r\nEnd\r\n' });
  await run(root, 'apply');
  const text = read(root);
  assert.equal(text.replace(/\r\n/g, '').includes('\n'), false);
  assert.equal(text.replace(/\r\n/g, '\n'), `# Mine\n${block(root)}End\n`);
  assert.equal(agentsStatus(root).state, 'current');
});

test('CRLF file without markers gets a CRLF block', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '# Mine\r\n' });
  await run(root, 'apply');
  assert.equal(read(root).replace(/\r\n/g, '').includes('\n'), false);
});

test('a block ending the file without a newline stays that way', () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->' });
  assert.equal(writeAgents(agentsStatus(root)), 'updated');
  assert.equal(read(root), block(root).trimEnd());
});

test('apply twice leaves AGENTS.md byte-identical and exits like plan', async () => {
  const root = makeProject({ sources: { platform: { 'N.md': adr(1), 'R.md': adr(2) } }, local: { 'docs/adr/platform/R.md': adr(1), 'AGENTS.md': '# Mine\n' } });
  await run(root, 'apply');
  const first = read(root);
  const second = await run(root, 'apply');
  const plan = await run(root, 'plan');
  assert.equal(read(root), first);
  assert.equal(second.code, plan.code);
  assert.equal(second.stdout, plan.stdout);
});

// Dry run

test('dry run with an import announces an update and writes nothing', async () => {
  const root = withAgents(makeProject({ sources: { platform: { 'A.md': adr(1), 'N.md': adr(1) } }, local: { 'docs/adr/platform/A.md': adr(1) } }));
  const before = read(root);
  const r = await run(root, 'apply', '--dry-run');
  assert.match(r.stdout, /^AGENTS\.md: rules block to update$/m);
  assert.equal(read(root), before);
  assert.equal(r.code, 2);
});

test('dry run with only a stale block', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n' });
  const r = await run(root, 'apply', '--dry-run');
  assert.equal(r.stdout, 'dry run: nothing written\nAGENTS.md: rules block to update\n');
  assert.equal(read(root), '<!-- ontrack:begin -->\nold\n<!-- ontrack:end -->\n');
});

test('dry run reports a skipped block as plan does', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'AGENTS.md': '<!-- ontrack:begin -->\n' });
  const r = await run(root, 'apply', '--dry-run');
  assert.equal(r.stdout, (await run(root, 'plan')).stdout);
  assert.equal(r.code, 2);
});

// Claude Code warning

test('CLAUDE.md without the import: warning, exit code unchanged', async () => {
  const root = withAgents(makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'CLAUDE.md': '# Claude\n' }));
  const r = await run(root, 'plan');
  assert.equal(r.stdout, `no ontrack source found\n${WARNING}\n`);
  assert.equal(r.code, 0);
});

test('CLAUDE.md with the import: no warning', async () => {
  const root = withAgents(makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'CLAUDE.md': '  @AGENTS.md\n\n# Claude\n' }));
  assert.equal(agentsStatus(root).warning, null);
});

test('CLAUDE.local.md alone also triggers the warning', () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'CLAUDE.local.md': 'x' });
  assert.equal(agentsStatus(root).warning, WARNING);
});

test('apply prints the warning after writing, and never writes CLAUDE.md', async () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'CLAUDE.md': '# Claude\n' });
  const r = await run(root, 'apply');
  assert.equal(r.stdout, `AGENTS.md: rules block created\n${WARNING}\n`);
  assert.equal(read(root, 'CLAUDE.md'), '# Claude\n');
  const dry = await run(makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'CLAUDE.md': 'x' }), 'apply', '--dry-run');
  assert.ok(dry.stdout.includes(WARNING));
});

test('no warning when the block is not needed', () => {
  assert.equal(agentsStatus(makeTree({ 'package.json': '{}', 'CLAUDE.md': 'x' })).warning, null);
});

test('skipped by a trait conflict still carries the warning', () => {
  const root = makeTree({ 'package.json': '{}', 'docs/adr/0001.md': decided(), 'docs/adr/0002.md': decided(), 'CLAUDE.md': 'x' });
  assert.equal(agentsStatus(root).warning, WARNING);
});
