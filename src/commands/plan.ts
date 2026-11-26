import type { Argv } from 'yargs';
import { agentsPending, agentsReport, agentsStatus } from '../agents.ts';
import { unresolvedSupersedes } from '../instructions.ts';
import { buildPlan, formatPlan, formatUnresolved, hasPendingChanges, OWN } from '../plan.ts';
import type { Io } from '../cli.ts';
import { schemaOf } from '../documents.ts';
import type { PlanDocument } from '../documents.ts';
import { planJson, printJson } from '../json.ts';

export const command = 'plan';
export const describe = 'Show what importing the tracks would change in the repository';

export const builder = (y: Argv) =>
  y.option('all', { type: 'boolean', default: false, describe: 'List every ADR, the unchanged ones too, with its status' });

export function handler({ io, all, json }: { io: Io; all: boolean; json: boolean }): number {
  const root = io.cwd();
  const plan = buildPlan(root);
  const unresolved = unresolvedSupersedes(root);
  const agents = agentsStatus(root);
  const pending = hasPendingChanges(plan) || unresolved.length > 0 || agentsPending(agents);
  if (json) {
    const document: PlanDocument = { $schema: schemaOf('plan'), tracks: planJson(plan), unresolved, agents: agentsReport(agents), pending };
    printJson(io.stdout, document);
    return pending ? 2 : 0;
  }
  const lines = [...formatUnresolved(unresolved), ...agentsReport(agents)];
  io.stdout.write(formatPlan(plan, { all }) + lines.map((l) => `${l}\n`).join(''));
  // On stderr, so that stdout keeps its documented format (as apply's `next:`).
  if (plan.every((t) => t.namespace === OWN)) {
    io.stderr.write('next: install a track\n  npm i -D <alias>@npm:<track-package>\n');
  }
  return pending ? 2 : 0;
}
