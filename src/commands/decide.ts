import { formatDecide } from '../decide.ts';
import { suggestInputs } from '../suggest.ts';
import type { Io } from '../cli.ts';
import { schemaOf } from '../documents.ts';
import type { DecideDocument } from '../documents.ts';
import { adrJson, printJson } from '../json.ts';
import { qualify } from '../instructions.ts';

export const command = 'decide';
export const describe = 'Print the prompt a coding agent follows to record a new decision of the repository with you';

export function handler({ io, json }: { io: Io; json: boolean }): number {
  const root = io.cwd();
  const { held, fresh } = suggestInputs(root);
  const prompt = qualify(root, formatDecide(held, fresh));
  if (json) {
    const document: DecideDocument = { $schema: schemaOf('decide'), adrs: held.map(adrJson), new: fresh, prompt };
    printJson(io.stdout, document);
  } else {
    io.stdout.write(prompt);
  }
  // Always a prompt to follow, as for `suggest`.
  return 2;
}
