import { formatReview, formatSequence, formatSupersession, pendingAdrs, selectAdr } from '../review.ts';
import type { Io } from '../cli.ts';
import type { Argv } from 'yargs';

export const command = 'review [adr]';
export const describe = 'Print a prompt asking a coding agent to rule the proposed ADRs, or one of them, or to supersede an accepted one';

export const builder = (y: Argv) =>
  y.positional('adr', { type: 'string', describe: 'A reference, file name or identifier: a proposed ADR to rule, or an accepted one to supersede (default: every proposed ADR, in sequence)' });

export function handler({ io, adr }: { io: Io; adr?: string }): number {
  const root = io.cwd();
  if (adr !== undefined) {
    const selected = selectAdr(root, adr);
    io.stdout.write(selected.status === 'accepted' ? formatSupersession(selected) : formatReview(selected));
    return 2;
  }
  const pending = pendingAdrs(root);
  if (pending.length === 0) {
    io.stderr.write('ontrack: no ADR is proposed, nothing to review\n');
    return 0;
  }
  io.stdout.write(formatSequence(pending));
  return 2;
}
