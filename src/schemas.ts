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
 * The `ontrack` key of a source's package.json. Unknown keys are kept, and a
 * `namespace` that is not a string counts as undeclared rather than refused.
 */
export const ontrackKey = z.looseObject({
  adr: z.string(),
  namespace: z.string().optional().catch(undefined),
});

/**
 * An installed dependency's package.json. `ontrack` stays unknown here:
 * whether it is an object decides if the dependency is a source at all, and
 * only then is it parsed with `ontrackKey`.
 */
export const sourceManifest = z.looseObject({
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
});
