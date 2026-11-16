import type { Argv } from 'yargs';
import { agentsPending, agentsReport, agentsStatus } from '../agents.ts';
import { buildPlan, formatPlan, hasPendingChanges, OWN } from '../plan.ts';
import type { Io } from '../cli.ts';

export const command = 'plan';
export const describe = 'Show what importing the tracks would change in the repository';

export const builder = (y: Argv) =>
  y.option('all', { type: 'boolean', default: false, describe: 'List every ADR, the unchanged ones too, with its verdict' });

export function handler({ io, all }: { io: Io; all: boolean }): number {
  const root = io.cwd();
  const plan = buildPlan(root);
  const agents = agentsStatus(root);
  io.stdout.write(formatPlan(plan, { all }) + agentsReport(agents).map((l) => `${l}\n`).join(''));
  // On stderr, so that stdout keeps its documented format (as apply's `next:`).
  if (plan.every((t) => t.namespace === OWN)) {
    io.stderr.write('next: install a track\n  npm i -D <alias>@npm:<track-package>\n');
  }
  return hasPendingChanges(plan) || agentsPending(agents) ? 2 : 0;
}
