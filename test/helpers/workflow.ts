import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/** The text of a workflow of this repository. */
export function readWorkflow(name: string): string {
  return readFileSync(new URL(`../../.github/workflows/${name}`, import.meta.url), 'utf8');
}

/** The `run: |` script of the step declared with `- id: <id>` in a workflow. */
export function stepScriptOf(workflow: string, id: string): string {
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
