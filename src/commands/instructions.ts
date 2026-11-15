import { buildInstructions, formatInstructions, qualify } from '../instructions.ts';
import type { Io } from '../cli.ts';

export const command = 'instructions';
export const describe = 'Print the traits decided in the ADRs as a block for AGENTS.md';

export function handler({ io }: { io: Io }): number {
  const root = io.cwd();
  io.stdout.write(qualify(root, formatInstructions(buildInstructions(root))));
  return 0;
}
