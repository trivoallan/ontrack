### expressjs__body-parser.json cost=2.03 turns=42 subtype=success writes=[]
I'll start by running the ontrack review command as AGENTS.md instructs, and look at the repository.
---
The `ontrack review` command needs approval I don't have, so I'll do the survey by reading the files directly.
---
ADRs 0002–0007 are read. For the survey of the rest I'll strip the boilerplate how-to-rule block, which is the same in every file. I'll read each file in full before ruling on it.
---
The shell filters are blocked, so I'll read the files directly.
---
Now the repository's own files, CI and history.
---
The survey is done; here it is. I couldn't run `ontrack review` because it needs your approval, so I read all 25 ADRs and the repository directly. I wrote nothing.

One thing to note first: this checkout's `origin` is `expressjs/body-parser`. That project has many contributors (`git log --format='%an' | sort | uniq -c`: 626 by Douglas Christopher Wilson, 64 Phillip Barta, 45 dependabot[bot], 18 Ulises Gascón…). Several values below are org or forge settings that only its maintainers control.

## Group 1: the repository already answers these (9 ADRs)

| ADR | Key | Value | Citation |
| --- | --- | --- | --- |
| ADR-0004 | `languages.main.name` | `JavaScript` | `index.js`, `lib/*.js` (7 files, from the Glob listing), `"type": "commonjs"` in `package.json`, no `tsconfig.json`. `shows the value` |
| ADR-0005 | `validation.boundary` | hand-written checks | `lib/utils.js:54` `throw new TypeError(\`option limit … is invalid\`)`, `lib/types/urlencoded.js:72,76`; no schema library in `package.json` `dependencies`. `shows the value` |
| ADR-0005 | `validation.data_files` | `none` | no `$schema` and no schema file in the repo (Glob listing). `shows the value` |
| ADR-0010 | `architecture.document` | `none` | no `docs/architecture/` and no architecture document (Glob listing). `shows the value` |
| ADR-0010 | `architecture.model` | `none` | no `.c4` or `.likec4` file (Glob listing). `shows the value` |
| ADR-0010 | `architecture.diagrams` | `none` | no ```` ```mermaid ```` block outside `docs/adr/` (Grep). `shows the value` |
| ADR-0013 | `frontend.framework` | none: rule `rejected` | no UI framework in `package.json`; the code is HTTP middleware (`lib/types/*.js`). `shows the value` |
| ADR-0015 | `secrets.storage` | `none` | `process.env` appears only in `.github/workflows/npm-publish.yml:72` (`GITHUB_OUTPUT`), never in `lib/`; no `.env` or `.envrc`. `shows the value` |
| ADR-0015 | `secrets.guard` | `none` | no gitleaks or other hook, config or workflow; `.git/hooks` holds only `*.sample` files. `shows the value` |
| ADR-0016 | `changes.framework` | `none` | no `openspec/` directory. `shows the value` |
| ADR-0016 | `changes.schema` | `none` | same. `shows the value` |
| ADR-0018 | `dependencies.updater` | `dependabot` | `.github/dependabot.yml`. `shows the value` |
| ADR-0018 | `dependencies.automerge` | `none` | no workflow uses `dependabot/fetch-metadata` or `gh pr merge`. `shows the value` |
| ADR-0023 | `license.spdx` | `MIT` | `"license": "MIT"` in `package.json`, and `LICENSE` holds the MIT text. `shows the value` |
| ADR-0025 | `tools.manager` | `none` | no `mise.toml`, `aqua.yaml` or install script, and no tool outside npm and Actions is used. `shows the value` |

## Group 2: these need a discussion (16 ADRs)

| ADR | Key | Where the value lives | Citation (label) |
| --- | --- | --- | --- |
| ADR-0002 | `localization.language.commits` | a choice people make | `git log` subjects are in English. `next to it` (history) |
| ADR-0003 | `architecture.pattern` | a choice people make (it may not apply to a library) | `lib/read.js` + `lib/types/*.js` layout. `next to it` |
| ADR-0006 | `commits.scopes` | a choice people make | `git log --format='%s' \| grep -oE '^[a-z]+\([a-z-]+\)' \| sort \| uniq -c`: `deps` 42+2+2, `deps-dev` 3, `docs` 2, `json` 3, `ci` 2, `urlencoded` 1, `test` 1. `next to it` (history) |
| ADR-0007 | `tests.coverage_target` | Coveralls settings (outside the repo), or unknown | `package.json` `test-ci` runs `nyc` with no `--check-coverage`; `ci.yml:88` uploads to Coveralls. `next to it` |
| ADR-0008 | `docs.audience` | a choice people make | `origin` is public `github.com/expressjs/body-parser`; the README is the npm page. `next to it` |
| ADR-0009 | `branching.model` | a choice people make | `git branch -r` shows `origin/1.x` and `release/*` maintenance branches. `next to it` |
| ADR-0009 | `branching.merge` | forge setting | `git log --merges --oneline \| wc -l` = 4 out of 829 commits; subjects end in `(#NNN)`. `next to it` (history) |
| ADR-0009 | `branching.prefixes` | a choice people make | `git branch -r`: `fix/compressed-request-abort`, `be/…`, many unprefixed. `next to it` |
| ADR-0011 | `forge.gate` | forge setting (ruleset) | `.github/workflows/ci.yml` exists. `next to it` |
| ADR-0012 | `delivery.environments` | forge and registry (release publication, npm staged-publish approval) | `npm-publish.yml`: `on: release: types: [published]`, `npm stage publish`. `next to it` |
| ADR-0012 | `delivery.release_notes` | forge (GitHub release text) | `HISTORY.md` curated entries. `next to it` |
| ADR-0014 | `tracking.tool` | forge setting (Issues enabled) | `(#786)`-style references in `git log`. `next to it` |
| ADR-0017 | `agent.hosts` | a choice people make | none: no `.claude/`, `opencode.json` or `.github/copilot/` |
| ADR-0019 | `vulnerabilities.scanner` | forge setting (Dependabot alerts), or `none` | no scanning workflow. `next to it` |
| ADR-0019 | `vulnerabilities.fail_on` | follows `scanner`; forge if `github` | same. `next to it` |
| ADR-0020 | `admission.approver` | a choice people make | none |
| ADR-0020 | `admission.install_scripts` | each contributor's npm version and config | `ci.yml` runs `npm install --ignore-scripts` (CI only). `next to it` |
| ADR-0021 | `supply_chain.build_level` | npm registry (provenance from trusted publishing) | `npm-publish.yml`: `id-token: write`, `npm stage publish`, no `--provenance`. `next to it` |
| ADR-0022 | `review.by` | forge setting (ruleset), plus who the maintainers are | author counts above. `next to it` |
| ADR-0022 | `review.approvals` | forge setting (ruleset) | none |
| ADR-0024 | `code_scanning.fail_on` | forge setting (ruleset "Require code scanning results") | `codeql.yml` exists. `next to it` |
| ADR-0026 | `agent.identity` | a choice people make | none |

Group 2 values that the repository does show: ADR-0002 `default: english` (README, `lib/`); ADR-0006 `commits.tool: none` (no commitlint or hook); ADR-0008 `docs.tool: none` and `docs.root` = README at the root; ADR-0011 `forge.audit: codeql` (`codeql.yml` matrix `language: [javascript, actions]`); ADR-0012 `target: package`, `release_tool: manual`, `registry: none`, `manifests: none`; ADR-0014 `tracking.project: expressjs/body-parser` (`package.json` `repository`); ADR-0019 `sbom: none`; ADR-0024 `code_scanning.tool: codeql`.

## Proposed order

I'd take group 1 first, in number order: **0004, 0005, 0010, 0013, 0015, 0016, 0018, 0023, 0025**. Then group 2 in number order: **0002, 0003, 0006, 0007, 0008, 0009, 0011, 0012, 0014, 0017, 0019, 0020, 0021, 0022, 0024, 0026**.

Two caveats on that order:
- ADR-0009's check exempts `dependabot/` branches only once ADR-0018 is ruled, so ADR-0018 should come first. In this order it does.
- ADR-0018 and ADR-0019 depend on ADR-0011's `forge.gate`. If you want 0011 earlier, say so.

I don't have a question tool here, so please reply: **agree to this order**, or give another (you can also skip or stop at any point).
