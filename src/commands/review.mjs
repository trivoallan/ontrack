import { formatReview, selectAdr } from '../review.mjs';

export const command = 'review [adr]';
export const describe = 'Print a prompt asking a coding agent to rule one proposed ADR';

export const builder = (y) =>
  y.positional('adr', { type: 'string', describe: 'A reference, file name or identifier (default: the next proposed ADR)' });

export function handler({ io, adr }) {
  const selected = selectAdr(io.cwd(), adr);
  if (selected === null) {
    io.stderr.write('ontrack: no ADR is proposed, nothing to review\n');
    return 0;
  }
  io.stdout.write(formatReview(selected));
  return 2;
}
