// Runs the check command each decided ADR declares in its frontmatter
// (`check:`). ontrack judges nothing itself: it links a failed tool back to
// the decision it enforces.
import { spawnSync } from 'node:child_process';
import { adrsInForce, heading } from './instructions.ts';
import type { Adr } from './instructions.ts';

export type CheckResult = { adr: Adr; status: 'pass' | 'fail' | 'unchecked'; output: string[] };

/**
 * One { adr, status, output } per ADR in force that has a check or decided
 * traits, sorted by reference. `status` is pass, fail or unchecked; `output`
 * holds the lines a failed command printed. A command that exits with 78 is
 * unchecked. Throws, before running anything,
 * when the traits conflict.
 */
export function runChecks(root: string): CheckResult[] {
  return adrsInForce(root)
    .filter((adr) => adr.check || adr.traits)
    .map((adr): CheckResult => {
      if (!adr.check) return { adr, status: 'unchecked', output: [] };
      // ponytail: sequential and without timeout; CI has its own.
      const r = spawnSync(adr.check, {
        shell: true,
        cwd: root,
        // The command learns which ADR it enforces: the path of the `adr:` line.
        env: { ...process.env, ONTRACK_ADR: adr.path },
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      if (r.status === 0) return { adr, status: 'pass', output: [] };
      // Reserved (EX_CONFIG): the command had nothing to verify for this ruling.
      if (r.status === 78) return { adr, status: 'unchecked', output: [] };
      const output = [r.stdout, r.stderr].join('').split('\n');
      while (output.length > 0 && output[output.length - 1].trim() === '') output.pop();
      return { adr, status: 'fail', output };
    });
}

/** The contract output (see docs/commands.md). */
export function formatChecks(results: CheckResult[]): string {
  const lines: string[] = [];
  const count = { fail: 0, pass: 0, unchecked: 0 };
  for (const { adr, status, output } of results) {
    count[status] += 1;
    lines.push(`${status.padEnd(11)}${heading(adr)}`);
    if (status !== 'fail') continue;
    lines.push(`  adr: ${adr.path}`, `  check: ${adr.check}`, ...output.map((l) => `  | ${l}`));
  }
  lines.push(`${count.fail} failed, ${count.pass} passed, ${count.unchecked} unchecked`);
  return `${lines.join('\n')}\n`;
}
