## 1. Contract

- [x] 1.1 Add the `ontrack decide` section to `docs/commands.md`: usage, exit codes, the lists of ADRs, and the seven steps of the prompt
- [x] 1.2 Add `decide --json` to the JSON section of `docs/commands.md`
- [x] 1.3 Update the instructions block example in `docs/commands.md` with the sentence naming `npx ontrack decide`

## 2. Code

- [x] 2.1 In `src/suggest.ts`, export the lists text and the two steps `decide` shares (read the rules; write the ADR, then `apply`), with `suggest`'s output byte-identical
- [x] 2.2 Add `src/decide.ts`: `formatDecide(held, fresh)`, from `suggestInputs`, the shared lists and steps, and `NUMBERING` of `src/review.ts`
- [x] 2.3 Add `src/commands/decide.ts`: no positional, `--json`, exit `2`; register it in `src/cli.ts`
- [x] 2.4 Extend `REVIEW_HINT` in `src/instructions.ts` with the `decide` sentence
- [x] 2.5 Add the `decide` document to `src/documents.ts` and run `npm run schema` to write `schema/decide.schema.json`

## 3. Tests

- [x] 3.1 `test/decide.test.ts`: the step order (duplicate check before traits, agreement before writing, `apply` after writing), `npx ontrack review`, `supersedes: []`, `NUMBERING` present, the same lists as `suggest`, no repository-specific text, the tree unchanged, exit `2`, an argument refused with `E001`, `E201`
- [x] 3.2 `--json`: `adrs`, `new` and `prompt` match the text form; the document validates against its schema
- [x] 3.3 `test/suggest.test.ts` still passes unchanged after the extraction; update the tests that assert the instructions block, the help and the list of schemas

## 4. Documentation

- [x] 4.1 Write the how-to guide `docs/record-a-decision.md`: when to use `decide` (a decision taken after adoption) rather than `suggest` (the one-off audit) or `review <adr>` (changing a recorded decision), with a table of the three; how to run it (ask the agent, which `AGENTS.md` routes, or `claude "$(npx ontrack decide)"`); what the agent asks and presents; how to check the result with `npx ontrack plan` and `npx ontrack instructions`
- [x] 4.2 List the guide in the sidebar group `Your repository` of `site/astro.config.mjs`, and link it from the end of the `ontrack decide` section of `docs/commands.md`
- [x] 4.3 `docs/features.md`: a row for recording a decision; `docs/how-it-works.md`: a paragraph after the one on `suggest`; `docs/tutorial.mdx`: a `LinkCard` to the guide, and the quoted instructions block with the new sentence; `docs/record-the-decisions-you-never-wrote-down.md`: point to the guide for the decisions taken from now on
- [x] 4.4 `README.md`: the `npx ontrack decide` usage line
- [x] 4.5 Architecture: `decide` in the commands table of `docs/architecture/arc42/01-introduction-and-goals.md`, in the coding-agent row of `03-context-and-scope.mdx`, in `04-solution-strategy.md`, `05-building-block-view.mdx`, `06-runtime-view.md` and `08-cross-cutting-concepts.md` wherever `suggest` is named; and the `commands/decide` and `decide` modules with their relations in `docs/architecture/model/model.c4`
- [x] 4.6 Run `npm run build` in `site/`: the build and the link check pass

## 5. Repository

- [x] 5.1 Run `npx ontrack apply` on this repository to rewrite `AGENTS.md`

## 6. Verification

- [x] 6.1 `npm test` passes with coverage above the target, `npx tsc` passes
- [x] 6.2 `node bin/ontrack.ts decide` on this repository prints the prompt with the ADR lists, and `plan` reports nothing after `apply`
- [x] 6.3 Archive the change in its pull request (`openspec archive add-decide-command`), as the ADR-0016 check requires
