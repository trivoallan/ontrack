import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adr, cleanup, makeProject } from './helpers/project.ts';

after(cleanup);

const bin = fileURLToPath(new URL('../bin/ontrack.ts', import.meta.url));

test('the installed bin reports the real exit code', () => {
  assert.equal(spawnSync(process.execPath, [bin, '--help']).status, 0);
  assert.equal(spawnSync(process.execPath, [bin, 'plann']).status, 1);
});

// Every file under `root`, relative path → bytes.
function snapshot(root: string) {
  return Object.fromEntries(
    readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => {
        const file = path.join(e.parentPath, e.name);
        return [path.relative(root, file), readFileSync(file).toString('base64')];
      })
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

test('plan is read-only: the tree is byte-identical afterwards', () => {
  const root = makeProject({
    tracks: { platform: { 'NEW.md': adr(1), 'REV.md': adr(2), 'FLAT.md': adr(1) } },
    local: { 'docs/adr/platform/REV.md': adr(1, 'accepted'), 'docs/adr/FLAT.md': adr(1) },
  });
  const before = snapshot(root);
  const run = spawnSync(process.execPath, [bin, 'plan'], { cwd: root, encoding: 'utf8' });
  assert.equal(run.status, 2, run.stderr);
  assert.match(run.stdout, /migration: 1 file/);
  assert.deepEqual(snapshot(root), before);
});
