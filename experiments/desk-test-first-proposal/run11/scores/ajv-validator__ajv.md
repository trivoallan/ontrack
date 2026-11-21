# Score: ajv-validator__ajv (surveys X, Y, Z)

Clone checked: .../eval/run11/ajv-validator__ajv. Facts verified in the clone: two workflows only (build.yml, publish.yml); no .husky/, renovate.json, openspec/, mise/aqua files, .claude/, docs/architecture; package.json "license": "MIT" (line 57), "bugs" (58), "repository" (45), "types": "dist/ajv.d.ts" (6); tsconfig include ["lib"]; 106 tracked .ts files vs 19 other in lib/; .github/dependabot.yml (npm, daily, no automerge/cooldown key); publish.yml plain `npm publish`, no --provenance, no id-token, no attest; lib/core.ts:91 comment in English; git log subjects English; origin = github.com/ajv-validator/ajv. Last 100 subjects: 47 conventional, 78 end in (#NNNN). Last 300: 29 build(deps-dev), 14 `fix:`, 3 `feat:`. Whole history: 31 build(deps-dev).

## Survey X (group 1 = 9)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0002 | localization.language.default (english) | yes | README/CONTRIBUTING/docs English; lib/core.ts:91 comment; `git log --format=%s` | n/a | yes | |
| 0002 | documentation, commits, code, comments (empty) | yes | same evidence: nothing departs from English | n/a | yes | inferred, but clone shows it |
| 0004 | languages.main.name (TypeScript) | yes | tsconfig.json, lib/*.ts, package.json:6 | n/a | yes | |
| 0013 | frontend.framework (rejected) | yes | package.json has no UI framework (absence); main dist/ajv.js | n/a | yes | docs/.vuepress/components Vue files exist, X flags them as ADR-0008's matter |
| 0014 | tracking.tool (github-issues) | yes | package.json:58 bugs; .github/ISSUE_TEMPLATE/ | n/a | yes | |
| 0014 | tracking.project (ajv-validator/ajv) | yes | package.json:45 repository | n/a | yes | |
| 0016 | changes.framework (none) | yes | no openspec/ dir | n/a | yes | absence is the value |
| 0016 | changes.schema (none) | yes | same | n/a | yes | |
| 0018 | dependencies.updater (dependabot) | yes | .github/dependabot.yml | n/a | yes | |
| 0018 | dependencies.automerge (none) | yes (borderline) | no automerge workflow, no fetch-metadata, only build.yml/publish.yml; no automerge app file | n/a | yes | an external merge bot cannot be fully excluded, but the clone shows no sign of one |
| 0021 | supply_chain.build_level (0) | yes | publish.yml: plain npm publish, no --provenance/id-token/attest | n/a | yes | |
| 0023 | license.spdx (MIT) | yes | package.json:57, LICENSE line 1 | n/a | yes | |
| 0025 | tools.manager (none) | yes | no mise.toml/aqua.yaml/script installing a tool | n/a | yes | holds only while no accepted ADR names an outside tool; X says so |

## Survey Y (group 1 = 4)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0004 | languages.main.name (TypeScript) | yes | tsconfig.json, lib/*.ts, package.json:6 | n/a | yes | |
| 0014 | tracking.tool (github-issues) | yes | package.json:58, .github/ISSUE_TEMPLATE/ | n/a | yes | |
| 0014 | tracking.project (ajv-validator/ajv) | yes | package.json:45; `git remote -v` | n/a | yes | |
| 0016 | changes.framework (none) | yes | no openspec/ | n/a | yes | |
| 0016 | changes.schema (none) | yes | same | n/a | yes | |
| 0023 | license.spdx (MIT) | yes | package.json:57, LICENSE | n/a | yes | |

Group-2 row with a false number: ADR-0006 `commits.scopes`: "there are 29 `build(deps-dev)` commits" with no window; whole history has 31 (29 only in the last 300).

## Survey Z (group 1 = 5)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0004 | languages.main.name (TypeScript) | yes | tsconfig include lib; package.json typescript 5.3.3, types; 106 .ts vs 19 other in lib/ | n/a | yes | counts verified |
| 0014 | tracking.tool (github-issues) | yes | package.json:58 | n/a | yes | |
| 0014 | tracking.project (ajv-validator/ajv) | yes | package.json:45, :58 | n/a | yes | |
| 0016 | changes.framework (none) | yes | no openspec/ or .openspec, no dependency | n/a | yes | |
| 0016 | changes.schema (none) | yes | same | n/a | yes | |
| 0023 | license.spdx (MIT) | yes | package.json:57, LICENSE | n/a | yes | |
| 0025 | tools.manager (none) | yes | no mise/aqua/.tool-versions; scripts/get-ajv-packages:19 is the only curl | n/a | yes | |

## Counts

| | X | Y | Z |
|---|---|---|---|
| ADRs in group 1 | 9 | 4 | 5 |
| ADRs in group 2 | 16 | 21 | 20 |
| ADRs in neither or both | 0 | 0 | 0 |
| Failing group-1 ADRs | 0 | 0 | 0 |
| Of those, left unstated by the agent | 0 | 0 | 0 |
| Mislabels ("value itself" but only next to it) | 3 (all group 2: 0007, 0017, 0024) | 0 | 0 |
| Unlabeled citations (survey labels citations) | 2 rows (0012, 0019; also the VuePress clause inside 0008) | 0 | 1 table row (0017) + 7 bullets above the table (0006 tool, 0011 audit, 0012, 0015 guard, 0018, 0019, 0020) |
| Rows with false evidence / false count | 0 | 1 (0006, "29 build(deps-dev)" vs 31 total) | 0 |
| Group headings with a count that does not match | 0 | 0 | 0 |
| Group-2 ADRs naming where the unseen value lives or saying unknown | 12 of 16 | 21 of 21 | 19 of 20 |

Failing group-1 ADRs: X none; Y none; Z none.
Borderline group-1 items scored as visible: X 0018 `automerge: none` (absence of any workflow/app file), X 0021 `build_level: 0` (publish.yml shows no provenance), X/Z 0025 `manager: none`.
False rows: Y ADR-0006 `commits.scopes` (29 vs 31 in the full history).

Notes on the counts:
- X mislabels: 0007 "nyc config sets no threshold (the value itself)" while X says the threshold lives in Coveralls settings; 0017 "no .claude/ or opencode.json (the value itself)" while X says hosts are held by people; 0024 "no CodeQL workflow (the value itself)" while X says GitHub default setup leaves no file.
- X group-2 not naming a place: 0003, 0005, 0006, 0008 (audience "written nowhere", no place). Z group-2 not naming a place: 0013 ("does not apply here").
- Y counts "A choice people make" as naming where the value lives: 7 of its 21 rows say only that (0002, 0003, 0005, 0010, 0017, 0025, 0026).
- Z 0026 says "No citation."; Y 0026 says "None"; X 0026 names the maintainer's machine.
