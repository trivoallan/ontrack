import { formatChecks, runChecks } from '../check.ts';
import type { Io } from '../cli.ts';
import { checksJson, printJson } from '../json.ts';

export const command = 'check';
export const describe = 'Run the check command of each decided ADR';

export function handler({ io, json }: { io: Io; json: boolean }): number {
  const results = runChecks(io.cwd());
  if (json) printJson(io.stdout, checksJson(results));
  else io.stdout.write(formatChecks(results));
  return results.some((r) => r.status === 'fail') ? 2 : 0;
}
