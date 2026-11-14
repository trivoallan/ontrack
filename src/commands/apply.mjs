import { agentsPending, agentsReport, agentsStatus, writeAgents } from '../agents.mjs';
import { formatApply, planActions, planAfter, runActions } from '../apply.mjs';
import { findLinks } from '../links.mjs';
import { buildPlan, formatPlan, hasPendingChanges } from '../plan.mjs';

export const command = 'apply';
export const describe = 'Import new ADRs, move flat-layout files and update AGENTS.md, as plan reports';

export const builder = (y) =>
  y
    .option('prune', { type: 'boolean', default: false, describe: 'Delete ADRs the source no longer ships' })
    .option('confirm', { type: 'string', array: true, default: [], describe: 'Declare an undetermined verdict still holds (a name, or "all")' })
    .option('dry-run', { type: 'boolean', default: false, describe: 'Print what apply would do, write nothing' });

const CHANGES_BLOCK = ['imported', 'moved', 'pruned'];

// The AGENTS.md lines of this run, and whether the block is still pending.
// The block is computed on the resulting tree, which a dry run does not have:
// there, any import, move or prune announces an update.
function agentsStep(root, actions, dryRun) {
  const status = agentsStatus(root);
  const writable = status.state === 'missing' || status.state === 'out of date';
  if (!dryRun) {
    if (!writable) return { lines: agentsReport(status), pending: agentsPending(status) };
    const verb = writeAgents(status);
    return { lines: [`AGENTS.md: rules block ${verb}`, ...(status.warning ? [status.warning] : [])], pending: false, wrote: true };
  }
  const touched = actions.some((a) => CHANGES_BLOCK.includes(a.kind));
  if (status.state === 'skipped' || (!writable && !touched)) {
    return { lines: agentsReport(status), pending: agentsPending(status) };
  }
  const verb = status.state === 'missing' || status.state === 'none' ? 'create' : 'update';
  return { lines: [`AGENTS.md: rules block to ${verb}`, ...(status.warning ? [status.warning] : [])], pending: true, wrote: true };
}

export function handler({ io, prune, confirm, dryRun }) {
  const root = io.cwd();
  const plan = buildPlan(root);
  const actions = planActions(root, plan, { prune, confirm });
  const moves = actions.filter((a) => a.kind === 'moved').map(({ from, to }) => ({ from, to }));
  const links = moves.length > 0 ? findLinks(root, moves) : [];
  if (!dryRun) runActions(root, actions);
  const agents = agentsStep(root, actions, dryRun);

  if (actions.length === 0 && !agents.wrote) {
    io.stdout.write(formatPlan(plan) + agents.lines.map((l) => `${l}\n`).join(''));
    return hasPendingChanges(plan) || agents.pending ? 2 : 0;
  }
  const remaining = actions.length === 0 ? plan : dryRun ? planAfter(plan, actions) : buildPlan(root);
  io.stdout.write(formatApply({ actions, links, agents: agents.lines, remaining, dryRun }));
  return hasPendingChanges(remaining) || agents.pending ? 2 : 0;
}
