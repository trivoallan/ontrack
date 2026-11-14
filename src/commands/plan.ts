import { agentsPending, agentsReport, agentsStatus } from '../agents.mjs';
import { buildPlan, formatPlan, hasPendingChanges } from '../plan.mjs';

export const command = 'plan';
export const describe = 'Show what importing the sources would change in the repository';

export function handler({ io }) {
  const root = io.cwd();
  const plan = buildPlan(root);
  const agents = agentsStatus(root);
  io.stdout.write(formatPlan(plan) + agentsReport(agents).map((l) => `${l}\n`).join(''));
  return hasPendingChanges(plan) || agentsPending(agents) ? 2 : 0;
}
