# Proposal

## Why

ADR-0005 rules `validation.boundary: zod`, but the data ontrack reads from
outside is checked by hand: a source's `ontrack` key field by field in
`src/sources.mjs`, ADR frontmatter values line by line in
`src/revision.mjs`. A field added tomorrow is an unchecked field, and there
is no model from which to derive the JSON Schema that ADR also asks for.
Source: trivoallan/ontrack#31.

## What Changes

- `zod` becomes a runtime dependency, next to `yargs`.
- One module holds the models of what ontrack reads: the project's
  `package.json` (the two dependency maps), a source's installed
  `package.json` with its `ontrack` key, and the frontmatter values ontrack
  uses (`revision`, `title`).
- Source discovery and frontmatter reading parse through those models
  instead of `typeof` checks and per-field regular expressions.
- No behaviour changes: the same inputs are accepted and refused, and every
  error still names what the `sources` and `adr-revision` specs say it names.

## Capabilities

### New Capabilities
<!-- none: the validation mechanism changes, the contract does not; `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- `package.json` / `package-lock.json`: new dependency `zod`.
- New `src/schemas` module; `src/sources` and `src/revision` rewritten
  around it; their tests keep passing unchanged, plus tests for the models.
- Consumers install one more package with ontrack.
- Unlocks `publish-ontrack-key-json-schema`, which derives its schema from
  the `ontrack` key model.
