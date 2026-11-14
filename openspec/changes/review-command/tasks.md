# Tasks

## 1. Contract first

- [x] 1.1 Add an "`ontrack review` prompt contract" section to the README, after the `instructions` section: the usage `claude "$(npx ontrack review)"`, how the ADR is selected (next pending in reference order, or the argument as a reference, file name or identifier), the full prompt text for `trivoallan/ADR-0006-commits`, that `review` writes nothing and reads `docs/adr/` only, and exit codes `2`/`0`/`1`. List `npx ontrack review` under Usage. Check that the prompt holds the seven steps of the "Prompt" requirement in order.

## 2. Reading ADRs

- [x] 2.1 In `src/instructions.mjs`, export `readAdrs(root)` returning every readable ADR with a `path` relative to the project root (`/` separators), and make `buildInstructions` use it without changing its behavior; check that `test/instructions.test.mjs` still passes.

## 3. Selecting

- [x] 3.1 In `src/review.mjs`, implement `selectAdr(root, name)` per the "Pending ADRs", "Next pending ADR" and "Named ADR" requirements: it returns the ADR, `null` when nothing is pending and no name is given, and throws for an unknown, ambiguous or already ruled name; check every scenario of those requirements in `test/review.test.mjs`.

## 4. Prompt and command

- [x] 4.1 Implement `formatReview(adr)` per the "Prompt" requirement; check its scenarios and compare the output to the README example.
- [x] 4.2 Add `src/commands/review.mjs` (`command: 'review [adr]'`) and register it in `src/cli.mjs`; check the "Exit codes" scenarios, the "Tree unchanged" scenario, and in `test/cli.test.mjs` that `--help` lists `review`.

## 5. Verification

- [x] 5.1 In this repository, run `node bin/ontrack.mjs review` and check that it prints the prompt for `trivoallan/ADR-0002-localization` and exits `2`; run it with `ADR-0001` and check that it exits `1` naming `accepted`.
- [x] 5.2 Run `npm test` and check that coverage stays at or above 95% on lines, branches and functions, then run `openspec validate review-command --strict`.

## 6. Sequence prompt

- [x] 6.1 Update the README contract: without an argument the prompt covers every pending ADR in sequence, with the full sequence prompt for two ADRs; with an argument, the single-ADR prompt.
- [x] 6.2 In `src/review.mjs`, add `pendingAdrs(root)` and `formatSequence(adrs)` sharing the seven steps with `formatReview(adr)`, and make `selectAdr` require a name; the command prints the sequence prompt without an argument. Check the "Every pending ADR" scenarios and the "Sequence" and "Agreement after each ADR" scenarios in `test/review.test.mjs`.
- [x] 6.3 Run `npm test` and `openspec validate review-command --strict`, then check in this repository that `node bin/ontrack.mjs review` lists the 14 pending ADRs and exits `2`.
