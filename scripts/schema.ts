// Writes the published JSON Schema from its model: `npm run schema`.
import { writeFileSync } from 'node:fs';
import { ontrackJsonSchema } from '../src/schemas.ts';

writeFileSync(
  new URL('../schema/ontrack.schema.json', import.meta.url),
  `${JSON.stringify(ontrackJsonSchema(), null, 2)}\n`,
);
