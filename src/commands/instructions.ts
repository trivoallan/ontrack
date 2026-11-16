import { buildInstructions, formatInstructions, qualify, REVIEW_HINT } from '../instructions.ts';
import { instructionsJson, printJson } from '../json.ts';
import type { Io } from '../cli.ts';

export const command = 'instructions';
export const describe = 'Print the traits decided in the ADRs as a block for AGENTS.md';

export function handler({ io, json }: { io: Io; json: boolean }): number {
  const root = io.cwd();
  const instructions = buildInstructions(root);
  const block = qualify(root, formatInstructions(instructions));
  if (json) printJson(io.stdout, instructionsJson(instructions, qualify(root, REVIEW_HINT), block));
  else io.stdout.write(block);
  return 0;
}
