# Design

## Context

See proposal.md for motivation, and specs/sources/spec.md for the
requirement. Constraints:

- ADR-0005: where a model reads the same data, the model is authoritative
  and the schema is derived from it. That model is `ontrackKey`, introduced
  by `validate-boundaries-with-zod`; zod 4 exports JSON Schema natively.
- The key lives inside `package.json`, a file editors already validate
  against SchemaStore's schema. An editor attaches schemas to *files*, not
  to one property of a file.
- ontrack is distributed from git only; there is no registry page or website
  to host a schema.
- One rule discovery enforces cannot be stated in JSON Schema: `adr` must
  resolve inside the installed package.

## Goals / Non-Goals

**Goals:**
- A source author gets an editor diagnostic for a missing or mistyped `adr`.
- No second, hand-maintained description of the key.

**Non-Goals:**
- Submitting the schema to SchemaStore, so that editors pick it up with no
  configuration.
- A schema for ADR frontmatter (governance's `mdschema` covers it).
- An `ontrack` command that validates a source.
- Having ontrack itself validate with the JSON Schema: discovery keeps using
  the model.

## Decisions

**Derive with `z.toJSONSchema`, commit the result.** A script writes
`schema/ontrack.schema.json` from the model; `npm run schema` runs it. The
file is committed because its consumers read it from GitHub and from the
installed package, neither of which runs a build for them. Alternative:
write the schema by hand and align it in review, the two-sources situation
ADR-0005 warns about.

**A test compares the committed file with a fresh derivation.** It fails
with a message naming `npm run schema`. This is the whole drift guard; no
JSON Schema validator is added as a dependency, since the model already
decides what is valid and the schema is its export.

**The schema targets a `package.json` document.** Its root is an object with
one constrained property, `ontrack`, and additional properties allowed.
That is the form an editor can combine with the standard `package.json`
schema (in VS Code, a second `json.schemas` entry matching `package.json`).
Alternative: a schema of the key alone, which no editor can attach to a
sub-property without a wrapper each author would have to write.

**`$id` is the raw GitHub URL on `main`**
(`https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/ontrack.schema.json`).
It is the only stable address the project has. Tagged URLs become available
once releases exist; the `main` URL stays valid either way.

**Unknown properties inside `ontrack` are allowed.** Discovery ignores them
today; a schema that flagged them would disagree with the tool.

**The schema's `description` states the rule it cannot enforce**: `adr` is a
path relative to the package and must stay inside it.

## Risks / Trade-offs

- [Authors must configure their editor once] → README snippet; SchemaStore
  submission stays possible later without changing the file.
- [A breaking change to the key reaches editors tracking `main` before
  authors update ontrack] → accepted; the key has two fields and no planned
  change.
- [The zod export changes shape between zod versions and the comparison
  test fails on an upgrade] → regenerate and review the diff, which is the
  test doing its job.
