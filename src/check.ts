// Runs the check command each decided ADR declares in its frontmatter
// (`check:`). ontrack judges nothing itself: it links a failed tool back to
// the decision it enforces.
import { spawnSync } from 'node:child_process';
import { adrsInForce, heading } from './instructions.mjs';

/**
 * One { adr, status, output } per ADR in force that has a check or decided
 * traits, sorted by reference. `status` is pass, fail or unchecked; `output`
 * holds the lines a failed command printed. Throws, before running anything,
 * when the traits conflict.
 */
export function runChecks(root) {
  return adrsInForce(root)
    .filter((adr) => adr.check || adr.traits)
    .map((adr) => {
      if (!adr.check) return { adr, status: 'unchecked', output: [] };
      // ponytail: sequential and without timeout; CI has its own.
      const r = spawnSync(adr.check, { shell: true, cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      if (r.status === 0) return { adr, status: 'pass', output: [] };
      const output = [r.stdout, r.stderr].join('').split('\n');
      while (output.length > 0 && output.at(-1).trim() === '') output.pop();
      return { adr, status: 'fail', output };
    });
}

/** The contract output (see README). */
export function formatChecks(results) {
  const lines = [];
  const count = { fail: 0, pass: 0, unchecked: 0 };
  for (const { adr, status, output } of results) {
    count[status] += 1;
    lines.push(`${status.padEnd(11)}${heading(adr)}`);
    if (status !== 'fail') continue;
    lines.push(`  rule: ${adr.path}`, `  check: ${adr.check}`, ...output.map((l) => `  | ${l}`));
  }
  lines.push(`${count.fail} failed, ${count.pass} passed, ${count.unchecked} unchecked`);
  return `${lines.join('\n')}\n`;
}
