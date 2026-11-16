# Score: sindresorhus__execa (surveys X, Y, Z)

Clone facts checked: 918 commits, 2 merge commits, 70 tags, 0 Conventional-Commit subjects, authors ehmicky (565+29 by two emails), Sindre Sorhus 223, others; one workflow `.github/workflows/main.yml` (lychee-action, setup-node, codecov-action with secrets.CODECOV_TOKEN); `.github/` = codecov.yml, security.md, workflows/; `.npmrc` = `package-lock=false`; no dependabot/renovate/openspec/mise/aqua/.c4 file now or in history; no bot-authored commit; 476 tracked .js, 163 .ts (34 .d.ts); `license` file (MIT) lowercase; no accepted ADR (all proposed; `docs/adr/` untracked). Key semantics read from ADR text: 0010/0016/0018/0025 allow `none`; 0013 has no `none` (no UI means rule `rejected`, remove traits); 0002 only `default` required, overrides may stay empty.

## Survey X (group 1 = 0016, 0023, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0016 | changes.framework (none) | yes | `ls` shows no openspec/; package.json has no openspec dep; grep outside docs/adr empty | no | yes | absence is the value |
| 0016 | changes.schema (none) | yes | same; ADR says `none` with framework none | no | yes | |
| 0023 | license.spdx (MIT) | yes | package.json `"license": "MIT"`; `license` file starts "MIT License" | no | yes | file is lowercase `license` (ADR names LICENSE) but value is visible |
| 0025 | tools.manager (none) | yes | no mise.toml/aqua.yaml/install script; main.yml only npm install + actions; no accepted ADR | no | yes | `none` valid only while no accepted ADR names a tool: true today |

## Survey Y (group 1 = 0010, 0013, 0016, 0018, 0023, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0010 | architecture.document (none) | yes | `git ls-files docs/architecture` = 0 | no | yes | |
| 0010 | architecture.model (none) | yes | no .c4/.likec4 file | no | yes | |
| 0010 | architecture.diagrams (none) | yes | no fenced mermaid/plantuml block in any md (ADR files only mention them inline) | no | yes | |
| 0013 | frontend.framework | yes | package.json no UI framework; files ship only index.js, lib, types | no | yes | key has no `none`; the answer is `rejected`; agent says so |
| 0016 | changes.framework (none) | yes | `git ls-files openspec` = 0 | no | yes | |
| 0016 | changes.schema (none) | yes | same | no | yes | |
| 0018 | dependencies.updater (none) | yes | no dependabot.yml/renovate config; .github has 3 entries; no bot author in 918 commits | no | yes | borderline: a Renovate app can run with no file, history shows none; counted visible |
| 0018 | dependencies.automerge (none) | yes | main.yml has no dependabot/fetch-metadata | no | yes | |
| 0023 | license.spdx (MIT) | yes | package.json and `license` file | no | yes | |
| 0025 | tools.manager (none) | yes | no mise.toml/aqua.yaml/script tracked | no | yes | |

## Survey Z (group 1 = 0002, 0004, 0010, 0013, 0016, 0023, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0002 | localization.language.default (english) | yes | readme.md, docs/*.md, lib comments (e.g. lib/pipe/pipe-arguments.js l.8), git log subjects all English | no | yes | overrides left empty is valid |
| 0002 | documentation / commits / code / comments | yes | same evidence; empty overrides pass | no | yes | |
| 0004 | languages.main.name (JavaScript) | yes | 476 .js incl. lib/**, `"type":"module"`, hand-written index.d.ts | no | yes | agent says it departs from Python/TypeScript recommendation: true |
| 0010 | architecture.document/model/diagrams (none) | yes | no docs/architecture, no .c4, grep for mermaid/plantuml/likec4 outside docs/adr empty | no | yes | |
| 0013 | frontend.framework | yes | no UI framework in package.json | no | yes | as in Y |
| 0016 | changes.framework/schema (none) | yes | no openspec/, grep empty | no | yes | |
| 0023 | license.spdx (MIT) | yes | package.json, license file | no | yes | |
| 0025 | tools.manager (none) | yes | no mise/aqua/script; lychee via action | no | yes | |

## Counts

| | X | Y | Z |
|---|---|---|---|
| ADRs in group 1 | 3 | 6 | 7 |
| ADRs in group 2 | 22 | 19 | 18 |
| ADRs in neither or both (of 25) | 0 | 0 | 0 |
| Failing group-1 ADRs | 0 | 0 | 0 |
| Failing ADRs the agent left unstated | 0 | 0 | 0 |
| Mislabelled "shows the value" citations | 0 | 0 | 0 |
| Citations with no label (survey labels citations) | 1 (0017 group 2) | 1 (0009 prefixes, group 2); also 3 cells that just say "unknown" with no citation (0020 approver, 0022 approvals, 0026) | 0 |
| Rows with false evidence or count | 1 | 0 | 2 |
| Group headings whose count mismatches the list | 0 | 0 | 0 |
| Group-2 ADRs naming where the unseen value lives or saying "unknown" (strict: a location, or the word unknown) | 9 of 22 | 13 of 19 | 14 of 18 |

Lenient reading of the last row (any entry in the "where it lives" column, including "a choice people make"/"nowhere"): X 22 of 22, Y 19 of 19, Z 18 of 18.

## Lists

Failing group-1 ADRs: X none; Y none; Z none.

False rows:
- X: 0009 (group 2): says "history has 0 merge commits"; actual 2 (`git rev-list --merges --count HEAD`).
- Y: none.
- Z: 0009 (group 2): "History is linear, with no merge commits"; actual 2. 0022 (group 2): "history shows a single author committing directly"; actual many authors (ehmicky 594 across two emails, Sindre Sorhus 223, 10+ others). Also the intro sentence "every commit is by one author, directly on main" is false (not a table row, not counted).

Strict "where" lists (group 2):
- X: 0009, 0011, 0012, 0014, 0018, 0019, 0021, 0022, 0024.
- Y: 0007, 0008 (named in the citation: GitHub setting), 0009, 0011, 0012, 0014, 0015, 0019, 0020 ("unknown"), 0021, 0022, 0024, 0026.
- Z: 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0018, 0019, 0020, 0021, 0022, 0024, 0026.
