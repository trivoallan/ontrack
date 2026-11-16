I'll start the survey by reading all 25 ADRs and looking at the repository.
---
Let me read the ADRs with the file tools.
---
I've read all 25 ADRs. Next I'm gathering repository evidence: workflows, config files and history.
---
Survey done, nothing written. I read all 25 ADRs and checked the repository's files, `.github/`, tags and history. Of the 25 ADRs, 6 have a `shows the value` citation for every value (group 1) and 19 do not (group 2).

## Group 1: every value is shown by this repository (6 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0010 | `architecture.document` | `none` | `shows the value`: `git ls-files -- docs/architecture …` returned 0 files, and a search for `*architecture*.md` finds only the ADRs |
| 0010 | `architecture.model` | `none` | `shows the value`: no `.c4` or `.likec4` file exists (glob `**/*.{c4,likec4}`) |
| 0010 | `architecture.diagrams` | `none` | `shows the value`: no fenced mermaid or plantuml block in any `*.md` (grep count: 0) |
| 0013 | `frontend.framework` | none (the ADR would be ruled `rejected`) | `shows the value`: `package.json` lists no UI framework in `dependencies` or `devDependencies`, and its `files` ship only `index.js`, `lib/**/*.js` and types |
| 0016 | `changes.framework` | `none` | `shows the value`: `git ls-files -- openspec …` returned 0 files |
| 0016 | `changes.schema` | `none` | `shows the value`: same command, no `openspec/config.yaml` or schema |
| 0018 | `dependencies.updater` | `none` | `shows the value`: `git ls-files` for `.github/dependabot.yml` and Renovate configs returned 0, and `.github/` holds only `codecov.yml`, `security.md` and `workflows/main.yml` |
| 0018 | `dependencies.automerge` | `none` | `shows the value`: `.github/workflows/main.yml` is the only workflow and has no `dependabot/fetch-metadata` |
| 0023 | `license.spdx` | `MIT` | `shows the value`: `"license": "MIT"` in `package.json`, and the `license` file starts with "MIT License" |
| 0025 | `tools.manager` | `none` | `shows the value`: `git ls-files` for `mise.toml` and `aqua.yaml` returned 0, and no pinning script is tracked |

## Group 2: at least one value is not shown (19 ADRs)

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 | `language.default` | a choice people make | `next to it`: `git log --format=%s -n 15` subjects are in English, and so are `readme.md` and `docs/*.md` |
| 0002 | `documentation`, `commits`, `code`, `comments` (four overrides) | a choice people make | `next to it`: the same evidence as `default` |
| 0003 | `architecture.pattern` | a choice people make | `next to it`: `lib/` is split by concern, and `test/` mirrors it (`arguments`, `io`, `ipc`, `pipe`, …) |
| 0004 | `languages.main.name` | a choice people make (JavaScript or TypeScript) | `next to it`: `git ls-files` shows 476 `.js` and 163 `.ts` files; `package.json` has `"type": "module"` and ships hand-written `.d.ts` types |
| 0005 | `validation.boundary` | a choice people make | `next to it`: no validation library in `package.json`, and grep finds no import of zod, ajv or joi |
| 0005 | `validation.data_files` | a choice people make | `next to it`: none of the four data files I read (`package.json`, `tsconfig.json`, `main.yml`, `codecov.yml`) carries a `$schema` |
| 0006 | `commits.scopes` | a choice people make | `next to it`: `git log --format=%s -n 300 \| grep -cE '^(feat\|fix\|…)(\(.+\))?!?:'` returned 0, so no past message is a Conventional Commit, scoped or not |
| 0007 | `tests.coverage_target` | a choice people make, possibly held in Codecov's service settings | `next to it`: the `c8` block in `package.json` has no threshold, and `.github/codecov.yml` only sets `notify.after_n_builds: 6` |
| 0008 | `docs.audience` | a choice people make | `next to it`: `origin` is `github.com/sindresorhus/execa`, but visibility is a GitHub setting |
| 0009 | `branching.model` | forge settings and team practice | `next to it`: `git branch -a` shows only `main`, and `git rev-list --merges --count HEAD` returns 2 of 918 commits |
| 0009 | `branching.merge` | GitHub repository settings | `next to it`: the same history |
| 0009 | `branching.prefixes` | unknown | no branch name is recorded in the repository |
| 0011 | `forge.gate` | GitHub ruleset or branch protection | `next to it`: `main.yml` runs on `push` and `pull_request` |
| 0012 | `delivery.target` | a choice people make | `next to it`: `package.json` has `exports`, `files` and no `private`, and 70+ `vX.Y.Z` tags exist (`git tag`) |
| 0012 | `delivery.environments` | the maintainer's publishing process | `next to it`: tags exist, but no workflow publishes |
| 0012 | `delivery.release_tool` | the maintainer's process | `next to it`: no release-tool config, and version-bump commits such as `10.2.1` |
| 0012 | `delivery.release_notes` | GitHub Releases, on the forge | `next to it`: no changelog file is tracked |
| 0014 | `tracking.tool` | GitHub settings (whether Issues is enabled) | `next to it`: `package.json` has `"repository": "sindresorhus/execa"` |
| 0015 | `secrets.storage` | the maintainer's machine, outside the repository | `next to it`: no `.env*` or `.envrc` is tracked; CI uses `secrets.CODECOV_TOKEN`, which is held in the forge |
| 0017 | `agent.hosts` | a choice contributors make | `next to it`: no `.claude/`, `opencode.json` or `.opencode/` is tracked, which does not show which agents are used |
| 0019 | `vulnerabilities.scanner` | GitHub settings (Dependabot alerts and dependency graph) | `next to it`: `main.yml` has no scan job |
| 0020 | `admission.approver` | a choice people make | unknown |
| 0020 | `admission.install_scripts` | the npm version in use | `next to it`: `.npmrc` only holds `package-lock=false`, and `package.json` has no `allowScripts` |
| 0021 | `supply_chain.build_level` | the npm registry and the maintainer's publishing process | `next to it`: no workflow publishes or attests |
| 0022 | `review.by` | GitHub ruleset on `main` | `next to it`: the same merge-commit count |
| 0022 | `review.approvals` | GitHub ruleset on `main` | unknown |
| 0024 | `code_scanning.fail_on` | GitHub ruleset ("Require code scanning results") | `next to it`: no CodeQL workflow exists |
| 0026 | `agent.identity` | GitHub identity and the maintainer's machine | unknown |

Four things to know before we start:
- **Commit format:** the repository's own commits are not Conventional Commits (0 of the last 300), which ADR-0006 requires. That will matter when we get there.
- **Licence file name:** the licence file is named `license` in lower case, while ADR-0023 names `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`.
- **`package.json` changes:** `package.json` has uncommitted changes that are not mine. It is reformatted from tabs to 2 spaces, and it gains the `trivoallan` devDependency.
- **No lockfile:** `.npmrc` sets `package-lock=false`, so there is no lockfile. That bears on ADR-0020's fifth rule.

## Proposed order

Group 1 first, in numeric order: **0010, 0013, 0016, 0018, 0023, 0025**. Then group 2 in numeric order: 0002, 0003, 0004, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

Do you agree with this order, or would you like another? Once you answer, I'll start on the first ADR. I'll propose a ruling for it and write nothing until you agree.
