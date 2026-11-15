## 1. Rename

- [ ] 1.1 Check that `rename-track-namespace` is merged into the base of this branch, and that `npx ontrack --version` runs the source that has it
- [ ] 1.2 `npm uninstall trivoallan`, then `npm i -D engineering@npm:@trivoallan/ontrack-engineering@^0.6.0`; `npx ontrack plan` prints `engineering: 26 unchanged` and `rename: docs/adr/trivoallan/ → docs/adr/engineering/`
- [ ] 1.3 `npx ontrack apply`; keep its list of links and `supersedes:` entries, and check that every file of `docs/adr/engineering/` is byte-identical to its former copy (`git diff -M --stat` shows renames only)

## 2. References

- [ ] 2.1 Rewrite every link `apply` listed, target only; in ruled local ADRs, check with `git diff --word-diff` that only link targets changed (ADR-0025)
- [ ] 2.2 Rewrite the `supersedes:` entries `apply` listed (`local/ADR-0023`, `local/ADR-0024`, `local/ADR-0025`, `local/ADR-0026`)
- [ ] 2.3 `npx ontrack apply` writes the rules block, then `npx ontrack plan` exits `0` and `AGENTS.md` names `engineering/ADR-…`, `local/ADR-0025` and `local/ADR-0026`, and no longer `trivoallan/ADR-0001` or `local/ADR-0024`
- [ ] 2.4 `git grep -n "adr/trivoallan\|trivoallan/ADR" -- ':!openspec/changes/archive' ':!CHANGELOG.md' ':!test' ':!openspec/specs'` lists nothing outside the text of ruled ADRs and sample aliases

## 3. Configuration

- [ ] 3.1 `.github/dependabot.yml`: `exclude: ["engineering"]`, as ADR-0026 rules
- [ ] 3.2 `.github/workflows/track-updates.yml`: `npm update engineering`
- [ ] 3.3 `commitlint.config.mjs`: the comment names `docs/adr/engineering/ADR-0006-commits.md`
- [ ] 3.4 `openspec/schemas/spec-driven-with-adr/schema.yaml` and its README: `docs/adr/engineering/` and `engineering/ADR-…` where they name this repository's imported ADRs

## 4. Site

- [ ] 4.1 Read `node_modules/engineering/` in `site/src/content.config.ts`, `site/src/track.mjs`, `site/src/pages/llms.txt.ts` and `site/astro.config.mjs`, and link catalogue pages to `adr/engineering/`
- [ ] 4.2 In `site/astro.config.mjs`, add one redirect per file of `docs/adr/engineering/`, from `/adr/trivoallan/<name>` to `${base}/adr/engineering/<name>/`
- [ ] 4.3 `npm run build` in `site/` passes, link check included; `/adr/trivoallan/adr-0006-commits/` redirects; the navigation group lists `local` and `engineering`

## 5. Documentation

- [ ] 5.1 `docs/ontrack-engineering/use-it.md`: install as `engineering`, state the alias rule and the collision prefix, and use `engineering` in "Take a new release" and "Change the alias"
- [ ] 5.2 `docs/tutorial.mdx`: the install command, the alias explanation and every sample output use `engineering`
- [ ] 5.3 `docs/index.mdx`, `docs/ontrack-engineering.mdx`, `README.md`: links and samples that show this repository's ADRs use `engineering`

## 6. Outside the repository

- [ ] 6.1 With the maintainer's go-ahead, retitle #192, #193 and #194 from `[trivoallan/ADR-…]` to `[engineering/ADR-…]`
- [ ] 6.2 Open an issue on the track's repository: declare `"namespace": "engineering"`, reword ADR-0001's "imports them into `docs/adr/trivoallan/`", remove the internal repository name from ADR-0001, and consider adding reference updates to rule 4 (ADR-0025)

## 7. Verification

- [ ] 7.1 `npm test` passes, and `npx ontrack check` gives the same result as before the change
- [ ] 7.2 `openspec validate adopt-engineering-alias --strict` passes
