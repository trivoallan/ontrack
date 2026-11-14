# Design

## Context

See proposal.md for motivation. ADR-0005 names three boundaries: a source's
`package.json` and its `ontrack` key, ADR frontmatter, and command-line
arguments.

- `src/sources.mjs` reads two kinds of `package.json` (the project's and each
  installed dependency's) with `JSON.parse` and `typeof` checks. Its errors
  are specified: each names the source and the offending field or value.
- `src/revision.mjs` reads frontmatter without a YAML parser, on purpose:
  the `adr-revision` spec defines a *bounded* frontmatter that a real parser
  would not reproduce, and `setRevision` must rewrite one line and leave
  every other byte alone. Reading returns `null` for an absent or
  non-integer revision; it never throws.
- Command-line arguments are already validated by `yargs` in strict mode
  (`cli` spec).
- ADR-0005 notes that frontmatter as a whole stays checked by governance's
  `mdschema`, not by ontrack.

## Goals / Non-Goals

**Goals:**
- One model per external shape, used at the point where the data enters.
- Adding a field means adding it to a model, nothing else.
- Existing tests pass without edits to their expectations.

**Non-Goals:**
- Changing which inputs are accepted, or the wording the specs require of
  errors.
- Parsing YAML, or validating frontmatter keys ontrack does not read.
- Replacing `yargs` validation of arguments.
- Validating internal structures (plans, actions): the language checks
  those.
- Emitting the JSON Schema (separate change).

## Decisions

**zod 4, as a runtime dependency.** It is the ruled mechanism; version 4
also exports JSON Schema natively (`z.toJSONSchema`), which the JSON Schema
change needs with no further dependency.

**A single `src/schemas` module.** It exports the models and nothing else:
`projectManifest` (optional `dependencies` and `devDependencies`, string
maps, unknown keys kept), `sourceManifest` (`name`, optional `ontrack`),
`ontrackKey` (`adr`: string, required; `namespace`: string, optional;
unknown keys kept, as today), and `adrFrontmatter` (`revision`, `title`).
One module so that the next reader, and the schema export, find every
boundary in one file. Alternative: a model beside each consumer, which
scatters five small declarations over two files for no gain.

**Errors are built from zod issues, not shown raw.** Discovery uses
`safeParse` and maps the first issue to the existing messages (`source
"<alias>" has no "adr" string in its ontrack key`, …). zod's default
messages do not name the source, which the `sources` spec requires.

**A dependency whose `ontrack` value is not an object stays ignored, not
refused.** Today `isObject(pkg.ontrack)` decides whether a dependency is a
source at all; only then is the key validated. The model keeps that
two-step: presence test first, `ontrackKey` parse second.

**The "inside the package" rule stays in discovery code.** It depends on the
installed package's directory, which is not part of the data; forcing it
into the model would need a context argument for one check.

**Frontmatter: keep the line scanner, validate what it extracts.** The
bounded-frontmatter recognizer and `setRevision` are untouched. The scanner
yields the top-level `key: value` pairs it finds; `adrFrontmatter` parses
them: `revision` is a string of digits transformed to a number, `title` a
string with its surrounding quotes removed. A failed parse of one field
yields "no value" for that field, as specified, never an exception.
Alternative: a YAML library plus a full frontmatter model, which changes
what counts as readable frontmatter (a spec change) and duplicates
`mdschema`.

**The project manifest gets a model too.** `{ ...project.dependencies }`
currently accepts anything; a `dependencies` that is not a map of strings
becomes the existing `cannot read <manifest>` error, which already names
the path the spec asks for.

## Risks / Trade-offs

- [A zod parse is stricter than a `typeof` check somewhere unnoticed] → the
  existing suites are the contract; they must pass with no expectation
  edited, and the models get their own tests for the edge values (`adr: 1`,
  `namespace: null`, `revision: 1.5`, `revision: -1`, quoted titles).
- [Second runtime dependency for consumers] → accepted by ADR-0005.
- [Ordering with the TypeScript migration] → independent. Landed after it,
  the models also provide the types (`z.infer`) and replace hand-written
  ones; landed before, they are `.mjs` and are renamed with the rest.
