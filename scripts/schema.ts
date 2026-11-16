// Writes the published JSON Schemas from their models: `npm run schema`.
import { writeFileSync } from 'node:fs';
import { documentJsonSchema, documents } from '../src/documents.ts';
import { ontrackJsonSchema } from '../src/schemas.ts';

writeFileSync(
  new URL('../schema/ontrack.schema.json', import.meta.url),
  `${JSON.stringify(ontrackJsonSchema(), null, 2)}\n`,
);

// One file per document of `--json`.
for (const name of Object.keys(documents) as (keyof typeof documents)[]) {
  writeFileSync(
    new URL(`../schema/${name}.schema.json`, import.meta.url),
    `${JSON.stringify(documentJsonSchema(name), null, 2)}\n`,
  );
}
