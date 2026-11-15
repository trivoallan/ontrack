import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { buildInstructions, formatInstructions } from '../../src/instructions.ts';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Relative path to content. */
export type Files = Record<string, string>;

const roots: string[] = [];

/** Removes every project built so far. Call from `after()`. */
export function cleanup(): void {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
}

/** Writes `files` ({ relative path: content }) under a new temporary root. */
export function makeTree(files: Files): string {
  const root = mkdtempSync(path.join(tmpdir(), 'ontrack-'));
  roots.push(root);
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(root, rel);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

/**
 * A project depending on `tracks` ({ alias: { file: content } }) installed
 * with an `ontrack` key and `adr: "adr"`, plus `local` files under the root.
 */
export function makeProject({
  tracks = {},
  local = {},
}: { tracks?: Record<string, Files>; local?: Files } = {}): string {
  const files: Files = {
    'package.json': JSON.stringify({
      name: 'project',
      devDependencies: Object.fromEntries(Object.keys(tracks).map((a) => [a, '1'])),
    }),
    ...local,
  };
  for (const [alias, adrs] of Object.entries(tracks)) {
    files[`node_modules/${alias}/package.json`] = JSON.stringify({
      name: alias,
      ontrack: { namespace: alias, adr: 'adr' },
    });
    for (const [name, content] of Object.entries(adrs)) {
      files[`node_modules/${alias}/adr/${name}`] = content;
    }
  }
  return makeTree(files);
}

/** A minimal ADR with the given revision (omit it for none) and optional title. */
export const adr = (revision?: number, status = 'proposed', title?: string) =>
  [
    '---',
    `status: ${status}`,
    ...(revision === undefined ? [] : [`revision: ${revision}`]),
    ...(title === undefined ? [] : [`title: ${title}`]),
    '---',
    '',
    'Body.',
    '',
  ].join('\n');

/** Writes a current rules block into the project's AGENTS.md; returns the root. */
export function withAgents(root: string, { before = '', after = '' }: { before?: string; after?: string } = {}): string {
  const block = formatInstructions(buildInstructions(root));
  writeFileSync(path.join(root, 'AGENTS.md'), before + block + after);
  return root;
}
