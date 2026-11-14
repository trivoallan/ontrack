import { formatApply, planActions, planAfter, runActions } from '../apply.mjs';
import { findLinks } from '../links.mjs';
import { buildPlan, formatPlan, hasPendingChanges } from '../plan.mjs';

export const command = 'apply';
export const describe = 'Import new ADRs and move flat-layout files, as plan reports';

export const builder = (y) =>
  y
    .option('prune', { type: 'boolean', default: false, describe: 'Delete ADRs the source no longer ships' })
    .option('confirm', { type: 'string', array: true, default: [], describe: 'Declare an undetermined verdict still holds (a name, or "all")' })
    .option('dry-run', { type: 'boolean', default: false, describe: 'Print what apply would do, write nothing' });

export function handler({ io, prune, confirm, dryRun }) {
  const root = io.cwd();
  const plan = buildPlan(root);
  const actions = planActions(root, plan, { prune, confirm });
  if (actions.length === 0) {
    io.stdout.write(formatPlan(plan));
    return hasPendingChanges(plan) ? 2 : 0;
  }
  const moves = actions.filter((a) => a.kind === 'moved').map(({ from, to }) => ({ from, to }));
  const links = moves.length > 0 ? findLinks(root, moves) : [];
  if (!dryRun) runActions(root, actions);
  const remaining = dryRun ? planAfter(plan, actions) : buildPlan(root);
  io.stdout.write(formatApply({ actions, links, remaining, dryRun }));
  return hasPendingChanges(remaining) ? 2 : 0;
}
