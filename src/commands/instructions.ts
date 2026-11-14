import { buildInstructions, formatInstructions } from '../instructions.mjs';

export const command = 'instructions';
export const describe = 'Print the traits decided in the ADRs as a block for AGENTS.md';

export function handler({ io }) {
  io.stdout.write(formatInstructions(buildInstructions(io.cwd())));
  return 0;
}
