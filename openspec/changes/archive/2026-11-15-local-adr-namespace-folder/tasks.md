## 1. Read and refuse

- [x] 1.1 `src/instructions.ts`: fail when the same file name exists in `docs/adr/` and `docs/adr/local/`, naming both paths; update the comment on `adrFiles`; tests in `test/instructions.test.ts` (historical layout, `local/`, duplicate)
- [x] 1.2 `src/sources.ts`: refuse the alias `local` next to the scoped-alias error; test in `test/sources.test.ts`

## 2. Migrate own ADRs

- [x] 2.1 `src/plan.ts`: collect root `*.md` files claimed by no source as the own-ADR migration; print `migration: <n> file(s) docs/adr/ → docs/adr/local/` and its `move` lines after the sources, also with no source and with `--all`; count it toward the exit code like a source migration; tests in `test/plan.test.ts`
- [x] 2.2 `src/apply.ts`: move those files to `docs/adr/local/` with the existing `moved` action, fail before writing when the destination exists, cover `--dry-run` and the no-source case; tests in `test/apply.test.ts` and `test/links.test.ts` (link to a moved own ADR, link from an own ADR to an imported one)
- [x] 2.3 Check `src/review.ts` `revisedAdrs` and `findAdr` against a repository with `docs/adr/local/`; add a `review` test selecting `local/ADR-0020-release` at its new path

## 3. Write in the new place

- [x] 3.1 `src/review.ts`: supersession prompt steps 5 and 6 name `docs/adr/local/` and number after that directory and the root; update `test/review.test.ts` and the prompt contract in `docs/commands.md`
- [x] 3.2 `openspec/schemas/spec-driven-with-adr/schema.yaml`: design, adr and tasks instructions and the adr template name `docs/adr/local/`
- [x] 3.3 `.github/workflows/propose.yml`: write permission, prompt text and publish path check accept `docs/adr/local/ADR-NNNN-slug.md` only; update `test/propose-workflow.test.ts`

## 4. This repository

- [x] 4.1 Run `npx ontrack apply`: ADR-0001 to ADR-0005 move to `docs/adr/local/`
- [x] 4.2 Fix every link `apply` lists, and the paths in comments of `.github/workflows/propose.yml` and `apply.yml`
- [x] 4.3 If `openspec/changes/verify-release-provenance` adds a root ADR, note in it that the path is now `docs/adr/local/`

## 5. Documentation site

- [x] 5.1 `site/src/content.config.ts`: add `adr` to the schema extension and set `sidebar.label` to `<adr> <title>` when present
- [x] 5.2 `site/astro.config.mjs`: show the ADR's reference on the badge line; autogenerate the group from `adr` instead of `adr/trivoallan`; remove the `ponytail:` comment
- [x] 5.3 Build the site: `site/check-links.mjs` passes, the navigation holds `local` and `trivoallan` groups with numbered entries and status dots, and searching `ADR-0011` returns its page

## 6. Reference documentation

- [x] 6.1 `docs/commands.md`: `plan` output with the own-ADR migration; `docs/file-formats.md`, `docs/how-it-works.md`, `docs/tutorial.md`, `docs/draft-a-change-from-an-issue.md`: own ADRs live in `docs/adr/local/`, and a caller pinned to an older workflow still writes at the root
- [x] 6.2 `npm test` at 95 % coverage, `npx ontrack plan` exits `0`, `npx ontrack check` passes, `openspec validate local-adr-namespace-folder`
