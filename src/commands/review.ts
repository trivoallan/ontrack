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
import { qualify } from '../instructions.ts';
import type { Argv } from 'yargs';

export const command = 'review [adr]';
export const describe = 'Print a prompt asking a coding agent to import the new ADRs, then rule the proposed ones, then the revised ones, or one of them, or to supersede an accepted one';

export const builder = (y: Argv) =>
  y.positional('adr', { type: 'string', describe: 'A reference, file name or identifier: a proposed ADR to rule, a revised one to rule again, or an accepted one to supersede (default: the new ADRs to import, or else every proposed ADR, in sequence, or else every revised one)' });

export function handler({ io, adr }: { io: Io; adr?: string }): number {
  const root = io.cwd();
  const out = (prompt: string) => io.stdout.write(qualify(root, prompt));
  if (adr !== undefined) {
    const revised = selectRevised(root, adr);
    if (revised) {
      out(formatRevision(revised));
      return 2;
    }
    const selected = selectAdr(root, adr);
    out(selected.status === 'accepted' ? formatSupersession(selected) : formatReview(selected));
    return 2;
  }
  // Imported first: a new ADR has no copy to rule yet, and `apply` may move
  // the copies the other prompts name.
  const plan = tracksPlan(root);
  const fresh = newAdrs(root, plan);
  if (fresh.length > 0) {
    out(formatImport(fresh));
    return 2;
  }
  const pending = pendingAdrs(root);
  if (pending.length > 0) {
    out(formatSequence(pending));
    return 2;
  }
  const revised = revisedAdrs(root, plan);
  if (revised.length === 0) {
    // "Nothing to review" holds only when the tracks were read: when they
    // cannot be, say why, as `plan` does, instead of reporting all ruled.
    buildPlan(root);
    io.stderr.write('ontrack: no ADR is proposed or revised, nothing to review\n');
    return 0;
  }
  out(formatRevisions(revised));
  return 2;
}
