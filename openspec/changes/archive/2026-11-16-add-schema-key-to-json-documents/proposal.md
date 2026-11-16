## Why

Each document of `--json` has a published schema, and nothing in the document says which. A reader who receives one, saved to a file or passed between two tools, has to know which command printed it before it can be validated; an editor that opens the file completes nothing. A JSON document names its schema with a `$schema` key: ontrack's documents can carry theirs.

## What Changes

- Every document of `--json` starts with `$schema`, the address of its own schema: `https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/<name>.schema.json`. The error document carries it too.
- Each published schema requires the key and fixes its value to its own address.
- No other key changes. A reader that ignores unknown keys, as the contract asks, is not affected.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `json-output`: a new requirement, *A document names its schema*; the scenarios of *The --json option* and *The review document* that quote a whole document gain the key.

## Impact

- **Code**: `src/documents.ts` (every model starts with the key), `src/json.ts` and the three handlers that build their document.
- **Published files**: the six schemas of `schema/`, regenerated.
- **Tests**: `test/json.test.ts`.
- **Documentation**: `docs/commands.md`, under *JSON output*.
- **Compatibility**: a key is added to documents no release has shipped yet. A reader that compared a whole document with an expected one would need the key.
