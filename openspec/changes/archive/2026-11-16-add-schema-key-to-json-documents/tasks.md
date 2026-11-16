## 1. The key

- [x] 1.1 In `src/documents.ts`, give one function the address of a schema, used for its `$id`, and start every model with `$schema`, the literal address
- [x] 1.2 In `src/json.ts` and the handlers of `plan`, `apply` and `review`, start each document with the key
- [x] 1.3 Run `npm run schema`

## 2. Tests and documentation

- [x] 2.1 In `test/json.test.ts`, expect the key first in every document, the error document included
- [x] 2.2 In `docs/commands.md`, say under *JSON output* that a document starts with `$schema`, and show it in the error example

## 3. Verification

- [x] 3.1 `npm test` passes and coverage stays at or above 95%; `npm run typecheck` passes
- [x] 3.2 `openspec validate add-schema-key-to-json-documents --strict` passes
- [x] 3.3 The site builds, and every internal link resolves
