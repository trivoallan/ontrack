## 1. Prerequisite

- [x] 1.1 Verify `docs/file-formats.md` exists on the branch (pull request #92); if it does not, stop and report rather than recreating it
- [x] 1.2 Run `npm test` and `npm run build` in `site/` before any edit; verify both pass, to have a baseline

## 2. Move the command contracts

- [x] 2.1 Move the README section "`ontrack plan` output contract" into the `plan` section of `docs/commands.md`, under a heading "Output contract", fences unchanged; remove the illustrative `plan` output it duplicates and the "Format:" link; verify `test/plan.test.ts` passes once it reads `docs/commands.md`
- [x] 2.2 Move the README section "`ontrack apply`" the same way; verify `test/apply.test.ts` passes once it reads `docs/commands.md`
- [x] 2.3 Move the README sections "`ontrack instructions` output contract" and its example the same way; verify `test/instructions.test.ts` passes once it reads `docs/commands.md`
- [x] 2.4 Move the README section "`ontrack review` prompt contract" the same way, under a heading "Prompt contract"; verify `test/review.test.ts` passes once it reads `docs/commands.md`
- [x] 2.5 Move the README section "`ontrack check` output contract" the same way; verify `test/check.test.ts` passes once it reads `docs/commands.md`
- [x] 2.6 Merge the README section "The rules block in `AGENTS.md`" into the section of the same name in `docs/file-formats.md` and remove its "Detail:" link; verify no statement of the README section is lost

## 3. Point everything at the new home

- [x] 3.1 In the five test files, rename the test titles and variables that say "README" to say "commands reference"; verify `grep -n "README.md" test/` only returns the fixtures that create a file of that name
- [x] 3.2 In `src/plan.ts`, `src/apply.ts`, `src/instructions.ts`, `src/check.ts`, `src/review.ts` and `src/commands/apply.ts`, change the comments "see README" to name `docs/commands.md`; verify `grep -rn "README" src/` returns nothing
- [x] 3.3 Remove the introduction of `docs/commands.md` that sends the reader to the README for formats, and the sentence of `docs/index.md` that does the same; verify `grep -n "ontrack#" docs/*.md` returns no link to a README anchor
- [x] 3.4 Update arc42 section 2 (the constraint row), section 1 (the user's guide sentence and the `check` row), section 8 ("Output as a contract") and the glossary entry "Managed block" to name the commands reference; verify `grep -rn "README" docs/architecture/` returns only the installation link of section 7

## 4. Shrink the README

- [x] 4.1 Remove "Example source" and "Checking the `ontrack` key in your editor" from `README.md`, and add under "Usage" a link to the site for the commands reference and the file formats; verify the README keeps Why, Installation, Usage with the exit codes, Development and License
- [x] 4.2 Verify every heading of the former README contract sections has its content in `docs/commands.md` or `docs/file-formats.md`, by comparing the removed lines of `git diff README.md` with the added lines of the two pages

## 5. Specifications

- [x] 5.1 Run `openspec validate move-output-contracts-to-site --strict`; verify it passes

## 6. Verify

- [x] 6.1 Run `npm test`; verify every suite passes and coverage holds at 95
- [x] 6.2 Run `npm run build` in `site/`; verify the build and the internal link check pass
- [x] 6.3 Open the built commands page in a browser; verify the `review` prompts are readable and the `instructions` example shows its inner fence as text; if the prompts scroll sideways badly, turn on line wrapping for code blocks in `site/astro.config.mjs`
- [x] 6.4 Run `node dist/bin/ontrack.js check`; verify it reports no failure
