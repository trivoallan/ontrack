// The documentation gives the files a repository writes to call the propose
// and apply workflows (ADR-0004). They are checked here against the
// `workflow_call` interface of the workflows, so that the pages cannot drift.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readWorkflow } from './helpers/workflow.ts';

const page = (name: string) => readFileSync(new URL(`../docs/${name}`, import.meta.url), 'utf8');
const reference = page('propose-and-apply-workflows.md');
const guide = page('draft-a-change-from-an-issue.md');

/** The fenced YAML block of a page that starts with `# .github/workflows/<name>`. */
function callerIn(text: string, name: string): string {
  const block = [...text.matchAll(/```yaml\n([\s\S]*?)```/g)]
    .map((m) => m[1])
    .find((b) => b.startsWith(`# .github/workflows/${name}\n`));
  assert.ok(block, `no ${name} block`);
  return block;
}

/** The keys one level under `<indent><section>:`, until the indentation drops back. */
function keysUnder(lines: string[], section: string, indent: number): Map<string, string[]> {
  const keys = new Map<string, string[]>();
  const start = lines.findIndex((l) => l === `${' '.repeat(indent)}${section}:`);
  if (start === -1) return keys;
  let current: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const depth = line.length - line.trimStart().length;
    if (depth <= indent) break;
    if (depth === indent + 2) keys.set(line.trim().split(':')[0], (current = []));
    else current.push(line.trim());
  }
  return keys;
}

/** The inputs and secrets a workflow declares under `workflow_call`. */
function interfaceOf(name: string) {
  const lines = readWorkflow(name).split('\n');
  const call = lines.findIndex((l) => l === '  workflow_call:');
  const end = lines.findIndex((l, i) => i > call && /^ {0,2}\S/.test(l));
  const block = lines.slice(call, end);
  return { inputs: keysUnder(block, 'inputs', 4), secrets: keysUnder(block, 'secrets', 4) };
}

for (const name of ['propose.yml', 'apply.yml']) {
  test(`the ${name} caller of the guide is the one of the reference`, () => {
    assert.equal(callerIn(guide, name), callerIn(reference, name));
  });

  test(`the ${name} caller passes what the workflow declares, and all it requires`, () => {
    const caller = callerIn(reference, name);
    assert.match(caller, new RegExp(`uses: trivoallan/ontrack/\\.github/workflows/${name.replace('.', '\\.')}@`));
    const lines = caller.split('\n');
    const declared = interfaceOf(name);
    for (const section of ['inputs', 'secrets'] as const) {
      const passed = [...keysUnder(lines, section === 'inputs' ? 'with' : 'secrets', 4).keys()];
      for (const key of passed) assert.ok(declared[section].has(key), `${name} declares no ${section} ${key}`);
      for (const [key, body] of declared[section]) {
        if (body.includes('required: true')) assert.ok(passed.includes(key), `the ${name} caller misses ${key}`);
      }
    }
  });

  test(`the reference lists every input and secret of ${name}`, () => {
    const declared = interfaceOf(name);
    for (const key of [...declared.inputs.keys(), ...declared.secrets.keys()]) {
      assert.match(reference, new RegExp(`^\\| \`${key}\` \\|`, 'm'), `${key} is not in the reference`);
    }
  });
}
