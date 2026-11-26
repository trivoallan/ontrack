## 1. Contract

- [x] 1.1 Add the section `ontrack suggest` to `docs/commands.md`: what it prints, exit code `2`, the steps of its prompt, and `suggest --json` under JSON output
- [x] 1.2 Add the `npx ontrack suggest` usage line to `README.md`

## 2. Prompt

- [x] 2.1 In `src/review.ts`, extract the numbering sentence of the supersession prompt (step 5) into a constant shared with `suggest`
- [x] 2.2 Create `src/suggest.ts` with `formatSuggest(held, fresh)`: the lists of held ADRs (path, title, status) and ADRs to import, or the line saying there is none, followed by the seven steps of the spec
- [x] 2.3 Gather the inputs with `readAdrs` in reference order and `newAdrs(root, tracksPlan(root))`, so that unreadable tracks give an empty list and no error

## 3. Command and document

- [x] 3.1 Create `src/commands/suggest.ts` (no positional), and register it in `defaultCommands` in `src/cli.ts`; it prints the prompt (passed through `qualify`, as `review` does) and returns `2`
- [x] 3.2 Add the zod model `suggestDocument` (`$schema`, `adrs`, `new`, `prompt`) to `src/documents.ts`, and print it under `--json`
- [x] 3.3 Run `npm run schema` to write `schema/suggest.schema.json`, and add `suggest` wherever the schema list is enumerated

## 4. Tests

- [x] 4.1 `test/suggest.test.ts`: tree unchanged and exit `2`; no `package.json`; held and new ADRs listed; the line when none; agreement, `AskUserQuestion`, at most five, `npx ontrack review` and `npx ontrack apply` present in the prompt
- [x] 4.2 `--json`: the document validates against `schema/suggest.schema.json`, and `prompt` equals the text output
- [x] 4.3 `review`'s supersession prompt matches its contract after the extraction, numbering included
- [x] 4.4 `npm test` passes at the 95 % coverage thresholds, and lint and build pass

## 5. Try it

- [x] 5.1 Run `npx ontrack suggest` on this repository and follow the prompt once with an agent; adjust the wording if the candidates are noise, and record nothing without the maintainer's agreement
- [x] 5.2 After the dry run: count deleted numbers in the shared numbering sentence (`review` too), add design notes and change proposals as a source, handle an empty forge, say a passing mention does not cover, and merge candidates one decision explains
