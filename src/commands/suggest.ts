import { formatSuggest, suggestInputs } from '../suggest.ts';
import type { Io } from '../cli.ts';
import { schemaOf } from '../documents.ts';
import type { SuggestDocument } from '../documents.ts';
import { adrJson, printJson } from '../json.ts';
import { qualify } from '../instructions.ts';

export const command = 'suggest';
export const describe = 'Print the prompt a coding agent follows to find the decisions the repository never recorded';

export function handler({ io, json }: { io: Io; json: boolean }): number {
  const root = io.cwd();
  const { held, fresh } = suggestInputs(root);
  const prompt = qualify(root, formatSuggest(held, fresh));
  if (json) {
    const document: SuggestDocument = { $schema: schemaOf('suggest'), adrs: held.map(adrJson), new: fresh, prompt };
    printJson(io.stdout, document);
  } else {
    io.stdout.write(prompt);
  }
  // Always a prompt to follow.
  return 2;
}
