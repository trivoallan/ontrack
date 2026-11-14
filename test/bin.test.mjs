import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../bin/ontrack.mjs', import.meta.url));

test('le bin installé remonte le vrai code de sortie', () => {
  assert.equal(spawnSync(process.execPath, [bin, '--help']).status, 0);
  assert.equal(spawnSync(process.execPath, [bin, 'plann']).status, 1);
});
