## 1. Models

- [x] 1.1 Add `src/documents.ts`: a strict zod model per document (`plan`, `apply`, `check`, `instructions`, `review`, `error`), their inferred types, and the derivation of each JSON Schema, open to unknown keys
- [x] 1.2 Type the builders of `src/json.ts` and the documents of the handlers from those models

## 2. Published files

- [x] 2.1 Make `scripts/schema.ts` write `schema/<name>.schema.json` for each document, and run `npm run schema`

## 3. Tests

- [x] 3.1 In `test/json.test.ts`, parse every document a test reads with its model
- [x] 3.2 Compare each published file with the derived one, and the content of `schema/` with the list of documents; check that a schema requires every key and refuses none

## 4. Documentation

- [x] 4.1 In `docs/commands.md`, under *JSON output*, the table of schemas and where a validator finds them
- [x] 4.2 In the README, `npm run schema` regenerates every file of `schema/`

## 5. Verification

- [x] 5.1 `npm test` passes and coverage stays at or above 95%; `npm run typecheck` passes
- [x] 5.2 `openspec validate publish-json-output-schemas --strict` passes
- [x] 5.3 The site builds, and every internal link resolves
