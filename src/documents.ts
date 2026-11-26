// The models of what ontrack writes under `--json` (see docs/commands.md,
// "JSON output"). `src/json.ts` builds the documents to these types, the
// tests parse every document with these models, and the JSON Schemas
// published under schema/ are derived from them: the three cannot disagree.
import { z } from 'zod';

export const SCHEMA_BASE = 'https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/';
/** The address of the schema of a document, which the document carries as `$schema`. */
export const schemaOf = (name: string) => `${SCHEMA_BASE}${name}.schema.json`;

// A document: its keys, after the address of its own schema.
const document = <Name extends string, Shape extends z.ZodRawShape>(name: Name, shape: Shape) =>
  z.strictObject({ $schema: z.literal(schemaOf(name)).describe('The address of this schema.'), ...shape });

const text = z.string().nullable();
const revision = z.strictObject({ from: z.number().nullable(), to: z.number().nullable() });

/** An ADR of a track, as `plan` and `apply` describe it. */
const plannedAdr = z.strictObject({
  name: z.string().describe('The file name without `.md`.'),
  title: text,
  category: z.enum(['revised', 'new', 'removed', 'undetermined', 'unreadable', 'check', 'unchanged']),
  status: text.describe("The status of the repository's copy; null when it has none or states none."),
  revision: revision.nullable().describe('Set for a `revised` or `undetermined` ADR.'),
  check: z
    .strictObject({ from: text, to: text })
    .nullable()
    .describe("Set for a `check` ADR: the check line of the repository's copy, and the track's."),
});

/** An ADR under docs/adr/, as `check`, `instructions` and `review` describe it. */
const adr = z.strictObject({
  ref: z.string().describe('`<namespace>/<file name without .md>`.'),
  title: text,
  status: text,
  path: z.string(),
});

const tracks = z.array(
  z.strictObject({
    namespace: z.string(),
    adrs: z.array(plannedAdr).describe('Every ADR of the track, the unchanged ones too.'),
    rename: z.strictObject({ from: z.string(), to: z.string() }).nullable(),
    migration: z.array(z.string()).describe('The files to move into the folder of the namespace.'),
  }),
);
const agents = z.array(z.string()).describe('The lines about AGENTS.md, as the text form prints them.');
const pending = z.boolean().describe('True when the exit code is 2.');
const link = z.strictObject({ file: z.string(), line: z.number(), old: z.string(), new: z.string() });

const unresolved = z
  .array(z.strictObject({ ref: z.string().describe('The ADR that holds the entry.'), name: z.string().describe('The entry, as written.') }))
  .describe('The `supersedes:` entries of accepted ADRs that designate no ADR.');

export const planDocument = document('plan', { tracks, unresolved, agents, pending });

export const applyDocument = document('apply', {
  dryRun: z.boolean(),
  actions: z.array(
    z.strictObject({
      kind: z.enum(['renamed', 'imported', 'moved', 'confirmed', 'synced', 'pruned']),
      track: z.string(),
      adr: plannedAdr.nullable().describe('Null for `renamed` and `moved`.'),
      from: text.describe('A path; null for `confirmed`, `synced` and `pruned`.'),
      to: z.string(),
    }),
  ),
  links: z.array(link),
  supersedes: z.array(link),
  agents,
  remaining: tracks.describe('The tracks of `plan --json`, once the actions are done.'),
  next: z.strictObject({ proposed: z.number(), revised: z.number() }).describe('The ADRs left to rule, and to rule again.'),
  pending,
});

export const checkDocument = document('check', {
  results: z.array(
    adr.extend({
      check: text.describe('The command; null when the ADR declares none.'),
      result: z.enum(['pass', 'fail', 'unchecked']),
      output: z.array(z.string()).describe('The lines a failed command printed.'),
    }),
  ),
  counts: z.strictObject({ fail: z.number(), pass: z.number(), unchecked: z.number() }),
});

export const instructionsDocument = document('instructions', {
  hint: z.string(),
  decided: z.array(adr.extend({ traits: z.string().describe('The decided traits, as YAML.') })),
  pending: z.array(adr),
  block: z.string().describe('The instructions block, as the text form prints it.'),
});

export const reviewDocument = document('review', {
  kind: z.enum(['import', 'sequence', 'review', 'revision', 'revisions', 'supersession', 'none']),
  adrs: z.array(
    z.union([
      z.strictObject({ path: z.string(), title: text }).describe('A new ADR, for `import`.'),
      adr,
      adr.extend({ revision: z.strictObject({ from: z.number(), to: z.number() }) }).describe('For `revision` and `revisions`.'),
    ]),
  ),
  prompt: text.describe('The prompt, as the text form prints it; null for `none`.'),
});

export const suggestDocument = document('suggest', {
  adrs: z.array(adr).describe('The ADRs the repository holds, in reference order.'),
  new: z.array(z.strictObject({ path: z.string(), title: text })).describe('The ADRs its tracks would import.'),
  prompt: z.string().describe('The prompt, as the text form prints it.'),
});

export const decideDocument = document('decide', {
  adrs: z.array(adr).describe('The ADRs the repository holds, in reference order.'),
  new: z.array(z.strictObject({ path: z.string(), title: text })).describe('The ADRs its tracks would import.'),
  prompt: z.string().describe('The prompt, as the text form prints it.'),
});

export const errorDocument = document('error', {
  error: z.strictObject({
    code: text.describe('The code of the error; null for a failure ontrack did not foresee.'),
    message: z.string(),
    docs: text.describe("The address of the code's row on the Error messages page."),
  }),
});

export type PlanDocument = z.infer<typeof planDocument>;
export type ApplyDocument = z.infer<typeof applyDocument>;
export type CheckDocument = z.infer<typeof checkDocument>;
export type InstructionsDocument = z.infer<typeof instructionsDocument>;
export type ReviewDocument = z.infer<typeof reviewDocument>;
export type SuggestDocument = z.infer<typeof suggestDocument>;
export type DecideDocument = z.infer<typeof decideDocument>;
export type ErrorDocument = z.infer<typeof errorDocument>;

/** The documents, by the name of their schema file: `schema/<name>.schema.json`. */
export const documents = {
  plan: { model: planDocument, title: 'What `ontrack plan --json` prints' },
  apply: { model: applyDocument, title: 'What `ontrack apply --json` prints' },
  check: { model: checkDocument, title: 'What `ontrack check --json` prints' },
  instructions: { model: instructionsDocument, title: 'What `ontrack instructions --json` prints' },
  review: { model: reviewDocument, title: 'What `ontrack review --json` prints' },
  suggest: { model: suggestDocument, title: 'What `ontrack suggest --json` prints' },
  decide: { model: decideDocument, title: 'What `ontrack decide --json` prints' },
  error: { model: errorDocument, title: 'What any ontrack command prints on standard error when it fails under `--json`' },
};

/**
 * The JSON Schema published for a document. The model refuses a key it does
 * not name, so that the tests catch a key added without it; the schema lets
 * it through, since a later version may add one.
 */
export function documentJsonSchema(name: keyof typeof documents): Record<string, unknown> {
  const { model, title } = documents[name];
  return {
    $id: schemaOf(name),
    title,
    ...z.toJSONSchema(model, {
      override: ({ jsonSchema }) => {
        delete jsonSchema.additionalProperties;
      },
    }),
  };
}
