# Tasks

## 1. Contract first

- [x] 1.1 Add an "`ontrack apply`" section to the README: what it does, the options (`--prune`, `--confirm <name>|all`, `--dry-run`), the action lines, the link list format, the exit codes, and that it never touches `revised` ADRs nor commits; check that every output example in `specs/apply/spec.md` matches the README

## 2. Building blocks

- [x] 2.1 Add `adrDir` to each `buildPlan` source entry and check that `formatPlan` output and existing tests are unchanged
- [x] 2.2 Write `findLinks(root, movedFiles)` in `src/links.mjs` (inline, image, reference forms; fenced blocks, schemes and absolute paths skipped; anchors and titles stripped; new target relative to the holding file); check it with the "Links to moved files" scenarios in `test/links.test.mjs`
- [x] 2.3 Write `setRevision(text, revision)` in `src/revision.mjs` (replace or insert the column-zero `revision:` line inside the bounded frontmatter, nothing else changed); check it with unit tests including a body example holding its own `revision:`

## 3. Apply

- [x] 3.1 Write `planActions(root, plan, options)` in `src/apply.mjs`, validating as it builds: import, move, confirm, prune; `--confirm` name checks; fail with code 1 before any write; check it with the "Confirming undetermined ADRs" and "Verdicts are never overwritten" scenarios
- [x] 3.2 Write `runActions(root, actions)`: copy, `git mv` with rename fallback (git detected with `git rev-parse --is-inside-work-tree`), confirm via `setRevision`, prune; check it with the "Importing new ADRs", "Flat-layout migration" and "Pruning removed ADRs" scenarios, including a real `git init` fixture
- [x] 3.3 Write `src/commands/apply.mjs` (yargs options `--prune`, `--confirm` as an array, `--dry-run`) and register it in `src/cli.mjs`; print actions, links, then the remaining plan; check the "Output and exit code", "Dry run" and "Nothing to apply" scenarios through `main`

## 4. Verification

- [x] 4.1 Add an integration test that runs `apply` twice in a row through `bin/ontrack.mjs` and checks the second run writes nothing and exits like `plan`
- [x] 4.2 Run `apply --dry-run` then `apply` in a fresh project with `trivoallan/governance` installed, and check that every ADR the source ships lands in `docs/adr/trivoallan/` byte-identical and that `plan` then exits with `0`
- [x] 4.3 Run `npm test` on Node 24 with coverage at or above 95% on lines, branches and functions, and `openspec validate apply-command --strict`
