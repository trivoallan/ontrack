import { buildInstructions, formatInstructions } from '../instructions.ts';
import type { Io } from '../cli.ts';

export const command = 'instructions';
export const describe = 'Print the traits decided in the ADRs as a block for AGENTS.md';

export function handler({ io }: { io: Io }): number {
  io.stdout.write(formatInstructions(buildInstructions(io.cwd())));
  return 0;
}
