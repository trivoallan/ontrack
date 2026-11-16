## Why

The documents `--json` prints are specified in prose, in the commands reference. A program that reads them has nothing to validate against, an editor nothing to complete from, and a typed client nothing to generate its types from. ontrack already publishes a JSON Schema for the one thing it reads from others, the `ontrack` key of a track, derived from the model that validates it. What it writes for others deserves the same.

## What Changes

- A JSON Schema per document of `--json`, in the repository and in the installed package: `schema/plan.schema.json`, `apply`, `check`, `instructions`, `review` and `error`.
- Each schema is derived from a model of the document. The code builds the documents to the types of those models, so a schema cannot describe something the command does not print.
- A schema requires every key of its document and refuses none: a document of a later version, with a key more, stays valid.
- `npm run schema` regenerates every file of `schema/`. A published file that differs from the derived one fails the test suite.
- No document changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `json-output`: a new requirement, *Published schemas*.

## Impact

- **Code**: a new `src/documents.ts` (the models, the derivation); `src/json.ts` and the handlers take their types from it; `scripts/schema.ts` writes six more files.
- **Tests**: every document a test reads is parsed with its model, which refuses an unknown key; the published files are compared with the derived ones.
- **Documentation**: `docs/commands.md` (the table of schemas, under *JSON output*), the README.
- **Package**: six files more under `schema/`, already listed in `files`.
- **Compatibility**: nothing printed changes.
- **Outside this change**: a `$schema` key in the documents; a version in the address of a schema.
