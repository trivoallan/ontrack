import { agentsPending, agentsReport, agentsStatus, writeAgents } from '../agents.ts';
import { formatApply, planActions, planAfter, runActions } from '../apply.ts';
import type { Action } from '../apply.ts';
import type { Io } from '../cli.ts';
import { actionJson, planJson, printJson } from '../json.ts';
import path from 'node:path';
import type { Argv } from 'yargs';
import { findLinks } from '../links.ts';
import { buildPlan, formatPlan, hasPendingChanges, markdownFiles } from '../plan.ts';
import type { Plan } from '../plan.ts';
import { qualify, supersedesNaming } from '../instructions.ts';
import { pendingAdrs, revisedAdrs } from '../review.ts';

export const command = 'apply';
export const describe = 'Import new ADRs, move flat-layout files and update AGENTS.md, as plan reports';

export const builder = (y: Argv) =>
  y
    .option('prune', { type: 'boolean', default: false, describe: 'Delete ADRs the track no longer ships' })
    .option('confirm', { type: 'string', array: true, requiresArg: true, default: [], describe: 'Declare an undetermined verdict still holds (a name, or "all")' })
    .option('dry-run', { type: 'boolean', default: false, describe: 'Print what apply would do, write nothing' });

const CHANGES_BLOCK: Action['kind'][] = ['renamed', 'imported', 'moved', 'pruned'];

// The AGENTS.md lines of this run, and whether the block is still pending.
// The block is computed on the resulting tree, which a dry run does not have:
// there, any import, move or prune announces an update.
function agentsStep(
  root: string,
  actions: Action[],
  dryRun: boolean,
): { lines: string[]; pending: boolean; wrote?: boolean } {
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

// The next step, on stderr so that stdout keeps its documented format: imported
// ADRs are `proposed`, which the plan no longer reports, and a revised one is
// ruled again with the same command. Both forms are given, since the reader
// is at a shell or is a coding agent.
// The ADRs left to rule once this run is done: the proposed ones first.
const toRule = (root: string, plan: Plan) => ({ proposed: pendingAdrs(root).length, revised: revisedAdrs(root, plan).length });

function nextStep(io: Io, root: string, plan: Plan): void {
  const { proposed, revised } = toRule(root, plan);
  const n = proposed || revised;
  if (n === 0) return;
  io.stderr.write(qualify(
    root,
    `next: ${n} ${proposed ? 'proposed' : 'revised'} ADR${n > 1 ? 's' : ''} to rule${proposed ? '' : ' again'}\n` +
      '  from a shell:  claude "$(npx ontrack review)"\n' +
      '  as a prompt:   Run `npx ontrack review` and follow its output.\n',
  ));
}

export function handler({
  io,
  prune,
  confirm,
  dryRun,
  json,
}: {
  io: Io;
  json: boolean;
  prune: boolean;
  confirm: string[];
  dryRun: boolean;
}): number {
  const root = io.cwd();
  const plan = buildPlan(root);
  const actions = planActions(root, plan, { prune, confirm });
  // A renamed folder moves each of its files.
  const moves = actions.flatMap((a) =>
    a.kind === 'moved'
      ? [{ from: a.from, to: a.to }]
      : a.kind === 'renamed'
        ? markdownFiles(a.from).map((file) => ({ from: path.join(a.from, file), to: path.join(a.to, file) }))
        : [],
  );
  const links = moves.length > 0 ? findLinks(root, moves) : [];
  const supersedes = plan.flatMap((track) => (track.rename ? supersedesNaming(root, track.rename, track.namespace) : []));
  if (!dryRun) runActions(root, actions);
  const agents = agentsStep(root, actions, dryRun);

  if (json) {
    // One shape, whether or not anything was applied: no action, and the plan
    // as what remains.
    const left = actions.length === 0 ? plan : dryRun ? planAfter(plan, actions) : buildPlan(root);
    const pending = hasPendingChanges(left) || agents.pending;
    printJson(io.stdout, {
      dryRun,
      actions: actions.map((a) => actionJson(root, a)),
      links,
      supersedes,
      agents: agents.lines,
      remaining: planJson(left),
      next: toRule(root, left),
      pending,
    });
    return pending ? 2 : 0;
  }
  if (actions.length === 0 && !agents.wrote) {
    io.stdout.write(formatPlan(plan) + agents.lines.map((l) => `${l}\n`).join(''));
    nextStep(io, root, plan);
    return hasPendingChanges(plan) || agents.pending ? 2 : 0;
  }
  const remaining = actions.length === 0 ? plan : dryRun ? planAfter(plan, actions) : buildPlan(root);
  io.stdout.write(formatApply({ actions, links, supersedes, agents: agents.lines, remaining, dryRun }));
  nextStep(io, root, remaining);
  return hasPendingChanges(remaining) || agents.pending ? 2 : 0;
}
