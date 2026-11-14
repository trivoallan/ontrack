import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const roots = [];

/** Removes every project built so far. Call from `after()`. */
export function cleanup() {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
}

/** Writes `files` ({ relative path: content }) under a new temporary root. */
export function makeTree(files) {
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
 * A project depending on `sources` ({ alias: { file: content } }) installed
 * with an `ontrack` key and `adr: "adr"`, plus `local` files under the root.
 */
export function makeProject({ sources = {}, local = {} } = {}) {
  const files = {
    'package.json': JSON.stringify({
      name: 'project',
      devDependencies: Object.fromEntries(Object.keys(sources).map((a) => [a, '1'])),
    }),
    ...local,
  };
  for (const [alias, adrs] of Object.entries(sources)) {
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

/** A minimal ADR with the given revision (omit it for none). */
export const adr = (revision, status = 'proposed') =>
  ['---', `status: ${status}`, ...(revision === undefined ? [] : [`revision: ${revision}`]), '---', '', '# ADR', ''].join('\n');
