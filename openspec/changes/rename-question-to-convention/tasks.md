## 1. Code

- [ ] 1.1 In `src/review.ts`, say "convention" in the prompts where they say "question", and "rule on" where they say "answer"; keep "question tool" and `AskUserQuestion`
- [ ] 1.2 In `src/instructions.ts`, write the heading `## Project instructions (ontrack)`
- [ ] 1.3 In `src/agents.ts` and `src/commands/apply.ts`, print `AGENTS.md: instructions block …` in the five lines
- [ ] 1.4 In `src/commands/plan.ts` and `src/commands/apply.ts`, say "status" and "ruling" in the descriptions of `--all` and `--confirm`
- [ ] 1.5 In `src/documents.ts` and `src/schemas.ts`, reword the descriptions, and regenerate the published JSON Schema
- [ ] 1.6 Reword the comments of `src/` that say "question", "answer", "verdict" or "rules block"
- [ ] 1.7 Update the tests that hold the old text, and run `npm test`

## 2. Reference pages

- [ ] 2.1 Update the prompt contracts, the output contracts and the option tables of `docs/commands.md`, which the tests compare with the code
- [ ] 2.2 Reword `docs/file-formats.md` (the instructions block) and `docs/error-messages.md`
- [ ] 2.3 Reword the glossary, `docs/architecture/arc42/12-glossary.md`: one entry per term, "verdict" removed, and the other arc42 pages that use the terms

## 3. Guides and home page

- [ ] 3.1 Rename `docs/revise-a-question.md` to `revise-a-convention.md` and `docs/ontrack-engineering/questions.mdx` to `conventions.mdx`; add both redirects, the label "Conventions (X.Y.Z)" and the group "Example: how ontrack ruled" in `site/astro.config.mjs`; follow `local/ADR-0025` for a ruled ADR that links to a renamed page
- [ ] 3.2 Rewrite `docs/concepts.md`: "A convention" in place of "A question", traits as its parameters, "The instructions block", a decision as a repository's own ADR
- [ ] 3.3 Rewrite `docs/how-it-works.md`: "Proposed, not imposed" in place of "Why questions, not rules", the one place that compares a convention to a question; "The life of one convention"
- [ ] 3.4 Rewrite the home page: description, section titles, the comparison table, "Common questions"; check that its first screen still says the repository decides
- [ ] 3.5 Reword `docs/features.md`: the opening chain, the section titles and the six entries of the home page that lead to them
- [ ] 3.6 Reword the remaining pages of `docs/`, `README.md`, `site/src/track.mjs` and the 404 page
- [ ] 3.7 Read each changed page for a "question", "answer" or "rules" replaced in its everyday sense, and put it back

## 4. Specs

- [ ] 4.1 Reword in place the requirements that say the old terms without a change of requirement: `adr-revision`, the rest of `plan`, `docs-site`
- [ ] 4.2 Once the change is archived, rename in `openspec/specs/` the three scenario titles a delta cannot rename: "Only the rules block to write" (`apply`), "Only the rules block is stale" (`plan`), "A question ontrack accepted" (`track-catalogue`)

## 5. This repository

- [ ] 5.1 Run `npx ontrack apply`: `AGENTS.md` gets the new heading
- [ ] 5.2 Run `npx ontrack plan` and `npx ontrack check`: both exit with `0`

## 6. Verification

- [ ] 6.1 Search `src/`, `docs/` (outside `docs/adr/`), `site/` and `openspec/specs/` for "question", "answer", "verdict" and "rules block": every hit left is an everyday sense or history
- [ ] 6.2 Run `npm run build` in `site/`: the build and the link check pass, and the two old URLs redirect
- [ ] 6.3 Tell the maintainer that the track's change of the same name can now be applied, and that the site shows the track's own wording until its release is installed here
