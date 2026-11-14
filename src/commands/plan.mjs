import { buildPlan, formatPlan, hasPendingChanges } from '../plan.mjs';

export const command = 'plan';
export const describe = 'Show what importing the sources would change in the repository';

export function handler({ io }) {
  const plan = buildPlan(io.cwd());
  io.stdout.write(formatPlan(plan));
  return hasPendingChanges(plan) ? 2 : 0;
}
