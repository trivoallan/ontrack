// The models of everything ontrack reads from outside (ADR-0005). Nothing
// else lives here: a new field is validated by adding it to its model.
import { z } from 'zod';

const stringMap = z.record(z.string(), z.string());

/** The project's package.json: only the two maps ontrack walks. */
export const projectManifest = z.looseObject({
  dependencies: stringMap.optional(),
  devDependencies: stringMap.optional(),
});

/**
 * The `ontrack` key of a track's package.json. Unknown keys are kept, and a
 * `namespace` that is not a string counts as undeclared rather than refused.
 */
export const ontrackKey = z.looseObject({
  adr: z.string(),
  namespace: z.string().optional().catch(undefined),
});

/**
 * An installed dependency's package.json. `ontrack` stays unknown here:
 * whether it is an object decides if the dependency is a track at all, and
 * only then is it parsed with `ontrackKey`.
 */
export const trackManifest = z.looseObject({
  name: z.string(),
  ontrack: z.unknown().optional(),
});

/**
 * The frontmatter values ontrack uses, as the line scanner yields them: raw
 * strings. The rest of the frontmatter is governance's `mdschema` to check.
 */
export const adrFrontmatter = z.object({
  revision: z.string().regex(/^\d+$/).transform(Number),
  title: z
    .string()
    .transform((raw) => raw.replace(/^(["'])(.*)\1$/, '$2').trim())
    .pipe(z.string().min(1)),
  // The verdict, without a trailing `# comment`.
  status: z
    .string()
    .transform((raw) => raw.replace(/(^|\s)#.*$/, '').replace(/^(["'])(.*)\1$/, '$2').trim())
    .pipe(z.string().min(1)),
});

/**
 * The JSON Schema published for track authors (schema/ontrack.schema.json),
 * derived from `ontrackKey` so the two cannot disagree. It applies to a whole
 * package.json, the file an editor can attach a schema to, and constrains its
 * `ontrack` property only.
 */
export function ontrackJsonSchema(): Record<string, unknown> {
  const key = ontrackKey.describe(
    'Declares this package as a track. `adr` is the directory holding the ADRs, as a path relative to the package: it must stay inside the package, a rule ontrack enforces and JSON Schema cannot state. `namespace` is the alias the track proposes.',
  );
  return {
    $id: 'https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/ontrack.schema.json',
    title: 'The ontrack key of a track package.json',
    ...z.toJSONSchema(z.looseObject({ ontrack: key.optional() })),
  };
}
