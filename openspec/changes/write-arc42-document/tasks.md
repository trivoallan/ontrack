# Tasks

## 1. Skeleton

- [x] 1.1 Create `docs/architecture/arc42/` with the twelve files named in ADR-0010, each with a `title:` frontmatter and a `#` heading equal to its arc42 section name; verify `ls docs/architecture/arc42 | wc -l` prints `12` and `grep -L '^title:' docs/architecture/arc42/*.md` prints nothing

## 2. Goals, constraints, strategy

- [x] 2.1 Write `01-introduction-and-goals.md` (purpose, three quality goals, stakeholders) per the table in design.md; verify each quality goal is one sentence a test could contradict
- [x] 2.2 Write `02-constraints.md` from `package.json` and ADR-0003, ADR-0004, ADR-0005 and ADR-0012; verify every constraint links to the file that imposes it
- [x] 2.3 Write `04-solution-strategy.md` (plan-then-apply, npm as transport, revision comparison, no YAML parser); verify each choice links to the spec or ADR that holds its detail

## 3. Structure

- [x] 3.1 Write `03-context-and-scope.md`: a table of ontrack's neighbours and what crosses each boundary, in prose, ending with the line that the diagram comes from the LikeC4 model; verify each neighbour can be found in `src/` by the module named beside it
- [x] 3.2 Write `05-building-block-view.md`: one paragraph per module of `src/` and the direction of dependencies; verify the stated dependencies against `grep -n "^import" src/*.mjs src/commands/*.mjs` (or the `.ts` equivalents)
- [x] 3.3 Write `07-deployment-view.md` (dev dependency, run with `npx`, locally and in CI); verify it agrees with the README's install section

## 4. Behaviour over time and concepts

- [ ] 4.1 Write `06-runtime-view.md` with two Mermaid sequence diagrams, `ontrack plan` and `ontrack apply`, following the calls made by `src/commands/plan` and `src/commands/apply`; verify both diagrams render in GitHub's preview of the branch
- [x] 4.2 Write `08-cross-cutting-concepts.md` (errors and exit codes, idempotence, the managed `AGENTS.md` block, testing); verify each concept links to its spec and restates no scenario

## 5. Decisions, quality, risks, glossary

- [x] 5.1 Write `09-architecture-decisions.md` as a link to `docs/adr/` plus one paragraph on how the directory is maintained; verify it names no individual decision
- [x] 5.2 Write `10-quality-requirements.md`: the goals of section 1 as scenarios, each linked to the spec scenario that tests it; verify every link resolves
- [x] 5.3 Write `11-risks-and-technical-debt.md` linking the open tracking issues by number; verify the list matches `gh issue list --state open`
- [x] 5.4 Write `12-glossary.md` with the eight terms listed in design.md; verify each definition agrees with the README's use of the term

## 6. Verify

- [x] 6.1 Check every relative link in the twelve files resolves to an existing file (a one-off script or `npx markdown-link-check`); verify zero broken links
- [x] 6.2 Verify no file holds an internal URL, a person's contact detail or anything else outside the `public` audience of ADR-0008, and that `npm pack --dry-run` lists nothing under `docs/`
