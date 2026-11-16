import {
  formatImport,
  formatReview,
  formatRevision,
  formatRevisions,
  formatSequence,
  formatSupersession,
  newAdrs,
  pendingAdrs,
  revisedAdrs,
  selectAdr,
  selectRevised,
  tracksPlan,
} from '../review.ts';
import { buildPlan } from '../plan.ts';
import type { Io } from '../cli.ts';
import { adrJson, printJson } from '../json.ts';
import type { Revised } from '../review.ts';
import { qualify } from '../instructions.ts';
import type { Argv } from 'yargs';

export const command = 'review [adr]';
export const describe = 'Print a prompt asking a coding agent to import the new ADRs, then rule the proposed ones, then the revised ones, or one of them, or to supersede an accepted one';

export const builder = (y: Argv) =>
  y.positional('adr', { type: 'string', describe: 'A reference, file name or identifier: a proposed ADR to rule, a revised one to rule again, or an accepted one to supersede (default: the new ADRs to import, or else every proposed ADR, in sequence, or else every revised one)' });

/** What `review` found to print: the kind of prompt, the ADRs it names, and the prompt. */
type Found = { kind: 'import' | 'sequence' | 'review' | 'revision' | 'revisions' | 'supersession'; adrs: object[]; prompt: string };

const revisedJson = ({ adr, from, to }: Revised) => ({ ...adrJson(adr), revision: { from, to } });

function find(root: string, adr: string | undefined): Found | null {
  if (adr !== undefined) {
    const revised = selectRevised(root, adr);
    if (revised) return { kind: 'revision', adrs: [revisedJson(revised)], prompt: formatRevision(revised) };
    const selected = selectAdr(root, adr);
    return selected.status === 'accepted'
      ? { kind: 'supersession', adrs: [adrJson(selected)], prompt: formatSupersession(selected) }
      : { kind: 'review', adrs: [adrJson(selected)], prompt: formatReview(selected) };
  }
  // Imported first: a new ADR has no copy to rule yet, and `apply` may move
  // the copies the other prompts name.
  const plan = tracksPlan(root);
  const fresh = newAdrs(root, plan);
  if (fresh.length > 0) return { kind: 'import', adrs: fresh, prompt: formatImport(fresh) };
  const pending = pendingAdrs(root);
  if (pending.length > 0) return { kind: 'sequence', adrs: pending.map(adrJson), prompt: formatSequence(pending) };
  const revised = revisedAdrs(root, plan);
  if (revised.length > 0) return { kind: 'revisions', adrs: revised.map(revisedJson), prompt: formatRevisions(revised) };
  // "Nothing to review" holds only when the tracks were read: when they
  // cannot be, say why, as `plan` does, instead of reporting all ruled.
  buildPlan(root);
  return null;
}

export function handler({ io, adr, json }: { io: Io; adr?: string; json: boolean }): number {
  const root = io.cwd();
  const found = find(root, adr);
  const prompt = found && qualify(root, found.prompt);
  if (json) {
    // `none`, not a sentence on standard error: the document says it.
    printJson(io.stdout, { kind: found?.kind ?? 'none', adrs: found?.adrs ?? [], prompt });
  } else if (prompt) {
    io.stdout.write(prompt);
  } else {
    io.stderr.write('ontrack: no ADR is proposed or revised, nothing to review\n');
  }
  return found ? 2 : 0;
}
