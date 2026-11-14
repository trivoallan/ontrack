# Tasks

## 1. Frontmatter and revision

- [x] 1.1 Write the frontmatter bounding in `src/revision.mjs` (opening fence on line one, closing fence searched with the stop condition from `specs/adr-revision/spec.md`) and check it with the "Bounded frontmatter" scenarios in `test/revision.test.mjs`
- [x] 1.2 Export `readRevision(text) → number | null`, reading a column-zero `revision:` with a non-negative integer value from the frontmatter only; check it with the "Reading the revision" scenarios

## 2. Classification

- [x] 2.1 Export `compareRevision(importedText, upstreamText)` applying the four-step order from the spec; check it with every "Classifying an imported ADR" scenario, including the one where only the local verdict changed
- [x] 2.2 Add a test with `\r\n` line endings for a well-formed frontmatter and check that `readRevision` still reads it

## 3. Verification

- [x] 3.1 Run `npm test` on Node 24 and check that it passes with coverage at or above 95% on lines, branches and functions
- [x] 3.2 Run `openspec validate adr-revision-comparison --strict` and check that it passes
