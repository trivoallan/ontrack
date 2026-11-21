# Score, run 9: group-1 visibility

Group-1 labels: in all five surveys the label sits in the citation column header ("Citation (`shows the value`)"), applying to every row, not repeated per cell. Each row is counted as labelled `shows the value`.

| repo | ADR | key | visible | where | label | mislabel | evidence true | note |
|---|---|---|---|---|---|---|---|---|
| debug-js__debug | 0002 | localization.language.default | yes | `README.md`, `src/*.js` (English) | shows the value | no | yes | |
| debug-js__debug | 0002 | documentation / commits / code / comments | yes | same files; no second language | shows the value | no | yes | one row for the four overrides |
| debug-js__debug | 0004 | languages.main.name | yes | `package.json` `"main": "./src/index.js"`; `git ls-files` (only `.js` sources) | shows the value | no | yes | |
| debug-js__debug | 0010 | architecture.document | yes | `git ls-files`: no architecture doc | shows the value | no | yes | absence is the value |
| debug-js__debug | 0010 | architecture.model | yes | `git ls-files`: no `.c4`/`.likec4` | shows the value | no | yes | absence is the value |
| debug-js__debug | 0010 | architecture.diagrams | yes | `git grep -i mermaid`: none; no diagram files | shows the value | no | yes | absence is the value |
| debug-js__debug | 0013 | frontend.framework (rejected) | yes | `package.json` description, only dep `ms` | shows the value | no | yes | |
| debug-js__debug | 0016 | changes.framework | yes | no `openspec/` | shows the value | no | yes | |
| debug-js__debug | 0016 | changes.schema | yes | no `openspec/config.yaml` | shows the value | no | yes | |
| debug-js__debug | 0018 | dependencies.updater | yes | no `.github/` at all (`git show f66cb2d --stat`), no renovate; `git log --format=%an`: no bot authors | shows the value | no | yes | |
| debug-js__debug | 0018 | dependencies.automerge | yes | no workflow exists (CI is `.travis.yml` only) | shows the value | no | yes | |
| debug-js__debug | 0023 | license.spdx | yes | `package.json` `"license": "MIT"`; `LICENSE` line 1 | shows the value | no | yes | |
| debug-js__debug | 0024 | code_scanning.tool | yes | no `.github/workflows`; `.travis.yml` runs no scanner | shows the value | no | yes | absence counted by analogy with `forge.audit: none` |
| debug-js__debug | 0024 | code_scanning.fail_on | yes | same absence | shows the value | no | yes | |
| debug-js__debug | 0025 | tools.manager | yes | no `mise.toml`/`aqua.yaml`/install script | shows the value | no | yes | |
| expressjs__morgan | 0002 | localization.language.default (+ 4 overrides empty) | yes | `README.md`, `index.js` | shows the value | no | yes | overrides folded into the same row |
| expressjs__morgan | 0004 | languages.main.name | yes | `index.js` (CommonJS), `.eslintrc.yml` `extends: standard` | shows the value | no | yes | |
| expressjs__morgan | 0013 | frontend.framework (rejected) | yes | `package.json` description and `files` | shows the value | no | yes | |
| expressjs__morgan | 0016 | changes.framework | yes | no `openspec/` | shows the value | no | yes | |
| expressjs__morgan | 0016 | changes.schema | yes | no `openspec/config.yaml` | shows the value | no | yes | |
| expressjs__morgan | 0018 | dependencies.updater | yes | `.github/dependabot.yml`; `git log --format=%an` shows `dependabot[bot]` (#381-#384) | shows the value | no | yes | |
| expressjs__morgan | 0018 | dependencies.automerge | yes | `grep fetch-metadata\|gh pr merge .github`: none | shows the value | no | yes | |
| expressjs__morgan | 0023 | license.spdx | yes | `package.json:9`; `LICENSE` line 1 | shows the value | no | yes | |
| expressjs__morgan | 0025 | tools.manager | yes | no `mise.toml`/`aqua.yaml`/install script | shows the value | no | yes | |
| jashkenas__underscore | 0002 | localization.language.default | yes | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `modules/*.js` | shows the value | no | yes | |
| jashkenas__underscore | 0002 | documentation / commits / code / comments | yes | same files | shows the value | no | yes | one row for the four overrides |
| jashkenas__underscore | 0004 | languages.main.name | yes | `modules/*.js`; `package.json:21` `"type": "commonjs"`, `:80` lint script | shows the value | no | yes | |
| jashkenas__underscore | 0010 | architecture.document | yes | `git ls-files`: no architecture doc (`docs/` is docco output) | shows the value | no | yes | |
| jashkenas__underscore | 0010 | architecture.model | yes | `git ls-files`: no `.c4`/`.likec4` | shows the value | no | yes | |
| jashkenas__underscore | 0010 | architecture.diagrams | yes | `git grep -i mermaid`: nothing; no PlantUML | shows the value | no | yes | |
| jashkenas__underscore | 0014 | tracking.tool | yes | `CONTRIBUTING.md:7` links `github.com/jashkenas/underscore/issues` | shows the value | no | yes | the file names the tracker; whether issues are enabled is a forge setting the file describes |
| jashkenas__underscore | 0014 | tracking.project | yes | same URL; `git remote -v` | shows the value | no | yes | |
| jashkenas__underscore | 0016 | changes.framework | yes | no `openspec/` | shows the value | no | yes | |
| jashkenas__underscore | 0016 | changes.schema | yes | no `openspec/config.yaml` | shows the value | no | yes | |
| jashkenas__underscore | 0018 | dependencies.updater | yes | no `dependabot.yml`/renovate; 0 bot authors in `git log --format=%an`; `1abc36c` merges #2991 by a person | shows the value | no | yes | |
| jashkenas__underscore | 0018 | dependencies.automerge | yes | only workflow is `codeql-analysis.yml`; no fetch-metadata / `gh pr merge` | shows the value | no | yes | |
| jashkenas__underscore | 0023 | license.spdx | yes | `package.json:6`; `LICENSE` MIT text | shows the value | no | yes | |
| jashkenas__underscore | 0025 | tools.manager | yes | no `mise.toml`/`aqua.yaml`/install script | shows the value | no | yes | |
| nodemailer__nodemailer | 0004 | languages.main.name | yes | `CLAUDE.md:3` "Written in TypeScript under `src/`"; `tsconfig*.json`; 121 `.ts` files | shows the value | no | yes | |
| nodemailer__nodemailer | 0007 | tests.coverage_target | yes | `.c8rc.json` `"check-coverage": true`, `"lines": 85` | shows the value | no | yes | |
| nodemailer__nodemailer | 0013 | frontend.framework (rejected) | yes | `package.json` has no UI framework; `src/` is a mail library | shows the value | no | yes | |
| nodemailer__nodemailer | 0014 | tracking.tool | yes | `package.json:152-153` `bugs.url` …/issues; `.github/ISSUE_TEMPLATE/report-an-issue.md` | shows the value | no | yes | |
| nodemailer__nodemailer | 0014 | tracking.project | yes | same `bugs.url` | shows the value | no | yes | |
| nodemailer__nodemailer | 0016 | changes.framework | yes | no `openspec/` | shows the value | no | yes | |
| nodemailer__nodemailer | 0016 | changes.schema | yes | same absence | shows the value | no | yes | |
| nodemailer__nodemailer | 0018 | dependencies.updater | yes | no `dependabot.yml`/renovate; `package.json:141` `ncu -u`; only bot author is `github-actions[bot]` (release-please) | shows the value | no | yes | |
| nodemailer__nodemailer | 0018 | dependencies.automerge | yes | no workflow uses fetch-metadata | shows the value | no | yes | |
| nodemailer__nodemailer | 0021 | supply_chain.build_level | yes | `.github/workflows/release.yaml`: `npm publish --provenance` on `ubuntu-latest`, `id-token: write` | shows the value | no | yes | the publish step is in the clone; npm provenance also implies a public repo |
| nodemailer__nodemailer | 0023 | license.spdx | yes | `package.json:151` `"MIT-0"`; `LICENSE` has no notice-retention clause | shows the value | no | yes | `LICENSE` keeps a dangling "subject to the following conditions:" with no condition after it |
| nodemailer__nodemailer | 0024 | code_scanning.tool | yes | `grep codeql\|sarif\|semgrep .github`: none | shows the value | no | yes | absence counted by analogy with `forge.audit: none` |
| nodemailer__nodemailer | 0024 | code_scanning.fail_on | yes | same absence | shows the value | no | yes | |
| nodemailer__nodemailer | 0025 | tools.manager | yes | no `mise.toml`/`aqua.yaml`/pinning script | shows the value | no | yes | |
| pugjs__pug | 0004 | languages.main.name | yes | `README.md:8` "implemented with JavaScript"; the only `.ts` source is `packages/pug-error/src/index.ts` | shows the value | no | partly | the agent says "20 of the 21 source entry files"; the clone has 19 non-test sources (18 `.js`, 1 `.ts`) and 12 package entry points. The README quote is exact |
| pugjs__pug | 0010 | architecture.document | yes | `git grep -l -i architecture -- '*.md'`: no tracked hit | shows the value | no | yes | |
| pugjs__pug | 0010 | architecture.model | yes | no `.c4`/`.likec4` | shows the value | no | yes | |
| pugjs__pug | 0010 | architecture.diagrams | yes | `git grep -i 'mermaid\|plantuml'`: none | shows the value | no | yes | |
| pugjs__pug | 0013 | frontend.framework (rejected) | yes | `README.md:7` "template engine"; no UI framework in `packages/*/package.json` (12 packages) | shows the value | no | yes | |
| pugjs__pug | 0014 | tracking.tool | yes | `README.md:9` "open an issue" → `github.com/pugjs/pug/issues/new`; `.github/ISSUE_TEMPLATE.md` | shows the value | no | yes | |
| pugjs__pug | 0014 | tracking.project | yes | same link; `git remote -v` | shows the value | no | yes | |
| pugjs__pug | 0016 | changes.framework | yes | no `openspec/` | shows the value | no | yes | |
| pugjs__pug | 0016 | changes.schema | yes | same | shows the value | no | yes | |
| pugjs__pug | 0023 | license.spdx | yes | root `package.json:38` `"license": "MIT"`; per-package `LICENSE` files | shows the value | no | yes | no root `LICENSE`, as the agent says |
| pugjs__pug | 0024 | code_scanning.tool | yes | `grep codeql\|sarif .github`: none | shows the value | no | yes | absence counted by analogy with `forge.audit: none` |
| pugjs__pug | 0024 | code_scanning.fail_on | yes | same | shows the value | no | yes | |
| pugjs__pug | 0025 | tools.manager | yes | no `mise.toml`/`aqua.yaml`/pinned install script | shows the value | no | yes | |

## Layout checks

### debug-js__debug

| check | result |
|---|---|
| group-1 heading count | 9, 9 listed: correct |
| group-2 heading count | 16, 16 listed: correct |
| group 1 one row per value | yes for all 9 (0002 folds the four empty overrides into one row) |
| group 2 one row per ADR | no: 25 rows for 16 ADRs; 0006, 0008, 0009, 0011, 0012, 0015, 0019, 0020 have 2 rows each |
| group-2 rows naming where (or "unknown") | 19 / 25 (the 6 rows with "—" are for values shown as `none`: 0006 tool, 0008 tool, 0011 audit, 0012 target/registry/manifests, 0015 guard, 0019 sbom) |
| missing labels | 0 |

### expressjs__morgan

| check | result |
|---|---|
| group-1 heading count | 7, 7 listed: correct |
| group-2 heading count | 18, 18 listed: correct |
| group 1 one row per value | yes for all 7 (0002 folds the overrides into the default row) |
| group 2 one row per ADR | yes: 18 rows |
| group-2 rows naming where (or "unknown") | 18 / 18 |
| missing labels | 0 (some are abbreviated: `shows` …, "is shown") |

### jashkenas__underscore

| check | result |
|---|---|
| group-1 heading count | 8, 8 listed: correct |
| group-2 heading count | 17, 17 listed: correct |
| group 1 one row per value | yes for all 8 |
| group 2 one row per ADR | yes: 17 rows |
| group-2 rows naming where (or "unknown") | 17 / 17 |
| missing labels | 0 (0017 says "Neither shows the value" for two citations, which is not one of the two labels) |

### nodemailer__nodemailer

| check | result |
|---|---|
| group-1 heading count | 10, 10 listed: correct |
| group-2 heading count | 15, 15 listed: correct |
| group 1 one row per value | yes for all 10 |
| group 2 one row per ADR | no: 25 rows for 15 ADRs; 0005, 0006, 0008, 0009, 0010, 0011, 0012, 0015, 0019, 0020 have 2 rows each |
| group-2 rows naming where (or "unknown") | 18 / 25 (7 rows say "none needed" for values shown: 0005 data_files, 0006 tool, 0010 model/diagrams, 0011 audit, 0012 target/release_tool/registry/manifests, 0015 guard, 0019 sbom) |
| missing labels | 0 |

### pugjs__pug

| check | result |
|---|---|
| group-1 heading count | 8, 8 listed: correct |
| group-2 heading count | 17, 17 listed: correct |
| group 1 one row per value | yes for all 8 |
| group 2 one row per ADR | yes: 17 rows |
| group-2 rows naming where (or "unknown") | 17 / 17 |
| missing labels | 3 in group 2: 0002 (commit-language citation says "history only"), 0009 ("history only"), 0012 (the `rollingversions.yml` citation for the unshown values carries no label). 0017 says "This does not show the value", not one of the two labels |

## Raw counts

| repo | group-1 ADRs | failing ADRs | of which unstated | mislabels | missing labels | false-evidence rows | wrong headings | group-1 ADRs not one row per value | group-2 rows naming where |
|---|---|---|---|---|---|---|---|---|---|
| debug-js__debug | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 19 / 25 |
| expressjs__morgan | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18 / 18 |
| jashkenas__underscore | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 17 / 17 |
| nodemailer__nodemailer | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 18 / 25 |
| pugjs__pug | 8 | 0 | 0 | 0 | 3 (group 2) | 1 partly (0004 file count) | 0 | 0 | 17 / 17 |
| **total** | **42** | **0** | **0** | **0** | **3** | **1 partly** | **0** | **0** | **89 / 102** |

Group 2 not one row per ADR: debug-js__debug (8 ADRs), nodemailer__nodemailer (10 ADRs).
