import {
  formatReview,
  formatRevision,
  formatRevisions,
  formatSequence,
  formatSupersession,
  pendingAdrs,
  revisedAdrs,
  selectAdr,
  selectRevised,
} from '../review.ts';
import type { Io } from '../cli.ts';
import type { Argv } from 'yargs';

export const command = 'review [adr]';
export const describe = 'Print a prompt asking a coding agent to rule the proposed ADRs, then the revised ones, or one of them, or to supersede an accepted one';

export const builder = (y: Argv) =>
  y.positional('adr', { type: 'string', describe: 'A reference, file name or identifier: a proposed ADR to rule, a revised one to rule again, or an accepted one to supersede (default: every proposed ADR, in sequence, or else every revised one)' });

export function handler({ io, adr }: { io: Io; adr?: string }): number {
  const root = io.cwd();
  if (adr !== undefined) {
    const revised = selectRevised(root, adr);
    if (revised) {
      io.stdout.write(formatRevision(revised));
      return 2;
    }
    const selected = selectAdr(root, adr);
    io.stdout.write(selected.status === 'accepted' ? formatSupersession(selected) : formatReview(selected));
    return 2;
  }
  const pending = pendingAdrs(root);
  if (pending.length > 0) {
    io.stdout.write(formatSequence(pending));
    return 2;
  }
  const revised = revisedAdrs(root);
  if (revised.length === 0) {
    io.stderr.write('ontrack: no ADR is proposed or revised, nothing to review\n');
    return 0;
  }
  io.stdout.write(formatRevisions(revised));
  return 2;
}
