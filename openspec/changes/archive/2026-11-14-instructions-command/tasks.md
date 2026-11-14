# Tasks

## 1. Contract first

- [x] 1.1 Add an "`ontrack instructions` output contract" section to the README, covering which ADRs are read, status and supersession, the verbatim traits block, pending ADRs, conflicts, the block format with its markers, and exit codes `0`/`1`. List `npx ontrack instructions` under Usage. Check that the output example matches the "One decided, one pending" scenario.

## 2. Reading ADRs

- [x] 2.1 Export `frontmatter()` from `src/revision.mjs` and `markdownFiles()` from `src/plan.mjs` without changing their behavior; check that `test/revision.test.mjs` and `test/plan.test.mjs` still pass.
- [x] 2.2 In `src/instructions.mjs`, read each ADR's reference, identifier, status, `supersedes:` and traits block per the "ADRs read", "Status and supersession" and "Decided traits" requirements; check every scenario of those requirements in `test/instructions.test.mjs`.

## 3. Resolving

- [x] 3.1 Implement `buildInstructions(root)`: decided ADRs, pending ADRs and the conflict check per the "Pending decisions" and "Conflicting traits" requirements; check their scenarios.

## 4. Output and command

- [x] 4.1 Implement `formatInstructions(result)` per the "Output format" requirement; check its scenarios, including the empty block, and compare it to the README example.
- [x] 4.2 Add `src/commands/instructions.mjs` and register it in `src/cli.mjs`; check in `test/cli.test.mjs` that `--help` lists `instructions`, that a conflict exits `1` with an empty stdout, and add the "Tree unchanged" check.

## 5. Verification

- [x] 5.1 In a fresh project with `trivoallan/governance` installed and its ADRs copied to `docs/adr/trivoallan/`, rule one ADR by hand (`accepted`, traits filled), run `npx ontrack instructions`, and check that the ruled ADR appears with its traits and the others under "Not yet decided".
- [x] 5.2 Run `npm test` and check that coverage stays at or above 95% on lines, branches and functions, then run `openspec validate instructions-command --strict`.
