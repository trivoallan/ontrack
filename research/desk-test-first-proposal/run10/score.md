# Score, run 10 (group-1 ADRs, one row per key)

Label column: SV = `shows the value`, NT = `next to it`. Mislabel = labelled SV but the clone only shows something next to it.

| repo | ADR | key | visible | where | label | mislabel | evidence true | note |
|---|---|---|---|---|---|---|---|---|
| lodash | 0004 | languages.main.name | yes | .github/workflows/codeql.yml `language: ["javascript"]`; `git ls-files '*.js'` = 55, `'*.ts' '*.mjs' '*.cjs'` = 0 | SV | no | yes | counts verified |
| lodash | 0007 | tests.coverage_target | yes | no threshold in package.json scripts, .github, lib; istanbul/coveralls/codecov.io are devDependencies only | SV | no | yes | absence is the value |
| lodash | 0014 | tracking.tool | yes | .github/CONTRIBUTING.md issue-tracker links | SV | no | yes | issues-enabled is a forge switch, but a file in the clone names the tracker; counted visible |
| lodash | 0014 | tracking.project | yes | CONTRIBUTING.md URL; `git remote -v` lodash/lodash | SV | no | yes | |
| lodash | 0016 | changes.framework | yes | no openspec/ directory | SV | no | yes | |
| lodash | 0016 | changes.schema | yes | same | SV | no | yes | |
| lodash | 0023 | license.spdx | yes | package.json line 4 "MIT"; LICENSE | SV | no | yes | |
| lodash | 0025 | tools.manager | yes | no mise.toml/aqua.yaml/.tool-versions | SV | no | no | claim "CI installs everything through npm or npx" is false: .github/workflows/ci-bun.yml runs `bun install` (oven-sh/setup-bun). Value `none` still holds |
| chalk | 0004 | languages.main.name | yes | package.json `"type":"module"`, exports.default source/index.js, source/*.js | SV | no | yes | |
| chalk | 0005 | validation.boundary | yes | source/index.js:19 throw on bad level; supports-color/index.js:35 regex; package.json has no `dependencies` | SV | no | yes | value "hand-written checks" is a named departure (ADR allows another mechanism) |
| chalk | 0005 | validation.data_files | yes | no `$schema` outside docs/adr | SV | no | yes | |
| chalk | 0007 | tests.coverage_target | yes | package.json c8 block: reporter + exclude only, no check-coverage | SV | no | yes | c8 runs but no threshold |
| chalk | 0010 | architecture.document | yes | docs/ holds only adr/ | SV | no | yes | |
| chalk | 0010 | architecture.model | yes | no *.c4/*.likec4 | SV | no | yes | |
| chalk | 0010 | architecture.diagrams | yes | mermaid appears only in docs/adr | SV | no | yes | |
| chalk | 0013 | frontend.framework | yes | package.json description, no UI framework, terminal library | SV | no | yes | row key is "(rejected: no UI)" |
| chalk | 0016 | changes.framework | yes | no openspec/ | SV | no | yes | |
| chalk | 0016 | changes.schema | yes | same | SV | no | yes | |
| chalk | 0018 | dependencies.updater | yes | no dependabot.yml/renovate file; no bot commits in git log | SV | no | yes | |
| chalk | 0018 | dependencies.automerge | yes | single workflow main.yml, no automerge | SV | no | yes | |
| chalk | 0023 | license.spdx | yes | package.json "MIT"; `license` file | SV | no | yes | |
| chalk | 0025 | tools.manager | yes | no mise/aqua/script; only npm | SV | no | yes | |
| body-parser | 0004 | languages.main.name | yes | index.js, lib/**.js, `"type":"commonjs"`, no tsconfig | SV | no | yes | "lib/*.js (7 files)": index.js + 6 lib files = 7; read as total, true |
| body-parser | 0005 | validation.boundary | yes | lib/utils.js:54 TypeError; lib/types/urlencoded.js:72,76; dependencies hold no validation lib | SV | no | yes | |
| body-parser | 0005 | validation.data_files | yes | no `$schema` | SV | no | yes | |
| body-parser | 0010 | architecture.document | yes | none in docs/ | SV | no | yes | |
| body-parser | 0010 | architecture.model | yes | no .c4/.likec4 | SV | no | yes | |
| body-parser | 0010 | architecture.diagrams | yes | mermaid only in docs/adr | SV | no | yes | |
| body-parser | 0013 | frontend.framework | yes | HTTP middleware, no UI framework | SV | no | yes | |
| body-parser | 0015 | secrets.storage | NO | where contributors keep secrets on their machines; clone cannot show it | SV | YES | yes (statements true: no `secrets.` in workflows except a commented SCORECARD_TOKEN, no .env) | evidence true, but it shows no secret read in CI, not where people keep them; value held outside the clone |
| body-parser | 0015 | secrets.guard | yes | no gitleaks/hook/config; .git/hooks only *.sample | SV | no | yes | |
| body-parser | 0016 | changes.framework | yes | no openspec/ | SV | no | yes | |
| body-parser | 0016 | changes.schema | yes | same | SV | no | yes | |
| body-parser | 0018 | dependencies.updater | yes | .github/dependabot.yml | SV | no | yes | |
| body-parser | 0018 | dependencies.automerge | yes | no fetch-metadata/gh pr merge in workflows | SV | no | yes | |
| body-parser | 0023 | license.spdx | yes | package.json "MIT"; LICENSE MIT text | SV | no | yes | |
| body-parser | 0025 | tools.manager | yes | no mise/aqua/script; npm and Actions only | SV | no | yes | |
| sinon | 0004 | languages.main.name | yes | `git ls-files src test`: 77 js, 11 mjs, 4 cjs, 0 ts | SV | no | yes | counts verified |
| sinon | 0007 | tests.coverage_target | yes | package.json nyc `check-coverage: true`, `lines: 97` (also .codecov.yml 97%) | SV | no | yes | |
| sinon | 0010 | architecture.document | yes | none in git ls-files | SV | no | yes | |
| sinon | 0010 | architecture.model | yes | none | SV | no | yes | |
| sinon | 0010 | architecture.diagrams | yes | mermaid only in docs/adr | SV | no | yes | |
| sinon | 0014 | tracking.tool | yes | package.json bugs.url | SV | no | yes | same note as lodash |
| sinon | 0014 | tracking.project | yes | same entry | SV | no | yes | |
| sinon | 0016 | changes.framework | yes | no openspec/ | SV | no | yes | |
| sinon | 0016 | changes.schema | yes | same | SV | no | yes | |
| sinon | 0018 | dependencies.updater | yes | .github/dependabot.yml | SV | no | yes | |
| sinon | 0018 | dependencies.automerge | yes | no automerge/fetch-metadata in .github | SV | no | yes | |
| sinon | 0023 | license.spdx | yes | package.json "BSD-3-Clause"; LICENSE has the 3-clause text | SV | no | yes | |
| uuid | 0004 | languages.main.name | yes | 35 .ts in src/, tsconfig.json, scripts/build.sh `tsc` | SV | no | yes | |
| uuid | 0007 | tests.coverage_target | yes | no coverage tool or threshold anywhere | SV | no | yes | |
| uuid | 0013 | frontend.framework | yes | library + CLI, package.json files = dist, dist-node | SV | no | yes | |
| uuid | 0014 | tracking.tool | yes | .github/ISSUE_TEMPLATE/*, stale-issues.yml | SV | no | yes | |
| uuid | 0014 | tracking.project | yes | package.json repository.url uuidjs/uuid | SV | no | yes | |
| uuid | 0016 | changes.framework | yes | no openspec/ | SV | no | yes | |
| uuid | 0016 | changes.schema | yes | same | SV | no | yes | |
| uuid | 0023 | license.spdx | yes | package.json "MIT"; LICENSE.md | SV | no | yes | |
| uuid | 0025 | tools.manager | yes | no mise/aqua/.tool-versions; CI uses Node and npm only; lefthook is an npm devDependency | SV | no | yes | |

## Layout and count checks, per repository

### lodash__lodash
| check | result |
|---|---|
| group-1 heading count | "6 ADRs", lists 6: correct |
| group-2 heading count | "19 ADRs", lists 19: correct |
| group-1 one row per value | yes (0 ADRs off) |
| group-2 rows total | 31 |
| group-2 rows that name where / "unknown" | 31 |
| group-2 ADR with >1 row per value | none |
| group-2 rows for a value that was shown | 3: 0002 `default` (English README/commits), 0010 `diagrams` (mermaid block in incident_response_plan.md:14), 0013 `frontend.framework` (no UI; chalk's same evidence put in group 1) |
| unlabelled citations | 0 |
| non-exact labels | 0 |
| counts without a command | "6-member TSC" (GOVERNANCE.md, no command) |
| false count/evidence | 0006 "8 one-off scopes": `git log --format=%s -300` gives 6 scoped subjects of standard type (fromPairs, toNumber, zipObjectDeep, random, playwright, ci); 8 only if the two `release(...)` are added; 37 conventional is true. 0025 group-1 "CI installs everything through npm or npx" is false (bun) |

### chalk__chalk
| check | result |
|---|---|
| group-1 heading count | "9 ADRs", lists 9: correct |
| group-2 heading count | "16 ADRs", lists 16: correct |
| group-1 one row per value | yes |
| group-2 rows total | 23 |
| group-2 rows that name where / "unknown" | 23 |
| group-2 ADR with >1 row per value | none |
| group-2 rows for a value that was shown | 1: 0002 `commits` (English history). Parentheticals inside rows also restate shown values (not separate rows) |
| unlabelled citations | 7: parentheticals in rows 0002, 0006, 0008, 0011, 0014, 0015 (evidence with no label); 0012 `release_tool` (39 version commits, no label) |
| non-exact labels | 0 |
| counts without a command | 46 tags; 39 version-only commits; "two maintainers" (readme.md:328) twice (0022, 0026) = 4 |
| false count/evidence | 0 (381, 0, 85, 21, 2016-03-15, 729, 46, 39 verified) |

### expressjs__body-parser
| check | result |
|---|---|
| group-1 heading count | "9 ADRs", lists 9: correct |
| group-2 heading count | "16 ADRs", lists 16: correct |
| group-1 one row per value | yes |
| group-2 rows total | 22 |
| group-2 rows that name where / "unknown" | 22 |
| group-2 ADR with >1 row per value | none |
| group-2 rows for a value that was shown | 1: 0002 `commits` (English history). 0007 coverage kept as not shown (Coveralls threshold lives outside) |
| unlabelled citations | 6: row 0017 ("none: no .claude/ ..."); 5 evidenced items in the "values the repository does show" paragraph (0002, 0006, 0008, 0011, 0014) |
| non-exact labels | 0 |
| counts without a command | "829 commits" (the 4 merges has its command) = 1 |
| false count/evidence | 0 (829, 4, 626/64/45/18, scope counts verified) |

### sinonjs__sinon
| check | result |
|---|---|
| group-1 heading count | "7 ADRs", lists 7: correct |
| group-2 heading count | "18 ADRs", lists 18: correct |
| group-1 one row per value | yes |
| group-2 rows total | 23 |
| group-2 rows that name where / "unknown" | 23 |
| group-2 ADR with >1 row per value | none |
| group-2 rows for a value that was shown | 2: 0002 `commits` (English history); 0005 `boundary` (hand-written checks, no library; same evidence as chalk/body-parser group 1). 0025 asdf not counted: `asdf` is not an allowed value |
| unlabelled citations | 3: 0008 extra "docs.tool shows as vitepress"; 0009 prefixes "no branch naming rule anywhere"; 0019 fail_on "same" |
| non-exact labels | 0 |
| counts without a command | 0 |
| false count/evidence | 0 (77/11/4/0, 91, 12, 10 verified) |

### uuidjs__uuid
| check | result |
|---|---|
| group-1 heading count | "7 ADRs", lists 7: correct |
| group-2 heading count | "18 ADRs", lists 18: correct |
| group-1 one row per value | yes |
| group-2 rows total | 23 table rows (6 rows fold 2 to 3 keys each: 0009 model+merge, 0010 x3, 0018 x2, 0019 x2, 0022 x2, 0024 x2) |
| group-2 rows that name where / "unknown" | 23 |
| group-2 ADR with >1 row per value | none |
| group-2 rows for a value that was shown | 5: 0002 `default`; 0005 `boundary` (hand-written, no library); 0006 `commits.tool` (lefthook.yml commit-msg runs commitlint = `hook`); 0010 document/model/diagrams (absences, one row); 0018 updater/automerge (no config, last dependabot commit 2020, one row) |
| unlabelled citations | 1: 0011 gate ends with "none" instead of a label |
| non-exact labels | 0 |
| counts without a command | 0 |
| false count/evidence | 0 (1,333; 86; 2 Copilot; scopes verified) |
