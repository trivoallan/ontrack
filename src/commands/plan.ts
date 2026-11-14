import { agentsPending, agentsReport, agentsStatus } from '../agents.ts';
import { buildPlan, formatPlan, hasPendingChanges } from '../plan.ts';
import type { Io } from '../cli.ts';

export const command = 'plan';
export const describe = 'Show what importing the sources would change in the repository';

export function handler({ io }: { io: Io }): number {
  const root = io.cwd();
  const plan = buildPlan(root);
  const agents = agentsStatus(root);
  io.stdout.write(formatPlan(plan) + agentsReport(agents).map((l) => `${l}\n`).join(''));
  return hasPendingChanges(plan) || agentsPending(agents) ? 2 : 0;
}
