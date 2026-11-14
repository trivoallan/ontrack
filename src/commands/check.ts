import { formatChecks, runChecks } from '../check.ts';
import type { Io } from '../cli.ts';

export const command = 'check';
export const describe = 'Run the check command of each decided ADR';

export function handler({ io }: { io: Io }): number {
  const results = runChecks(io.cwd());
  io.stdout.write(formatChecks(results));
  return results.some((r) => r.status === 'fail') ? 2 : 0;
}
