# Score 14: ladjs__superagent

## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files '*.js' = 76; '*.ts' '*.tsx' '*.py' = 0; package.json main | no | yes | |
| 0010 | architecture.document | A1 | yes | no docs/architecture/ (ADR fixes the path; `elsewhere` is a separate value); git ls-files grep architect = 0 | no | yes | |
| 0010 | architecture.model | A1 | yes | git ls-files '*.c4' etc = 0 | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | grep mermaid/plantuml outside docs/adr = 0 | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json has no UI framework | no | yes | |
| 0014 | tracking.tool | S | yes | package.json bugs.url (github issues) | no | yes | |
| 0014 | tracking.project | S | yes | package.json bugs.url ladjs/superagent | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir (ls, git ls-files) | no | yes | |
| 0016 | changes.schema | A1 | yes | same absence | no | yes | |
| 0023 | license.spdx | S | yes | package.json license MIT; LICENSE "(The MIT License)" | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua/asdf files; ci/ has only remove-deps-4-old-node.js | no | yes | |

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 76 .js; .ts .tsx .py .go .rs .jsx = 0 | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json no UI framework; no .jsx/.tsx | no | yes | |
| 0014 | tracking.tool | S | yes | package.json bugs.url | no | yes | |
| 0014 | tracking.project | S | yes | package.json bugs.url; origin remote | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same absence | no | yes | |
| 0023 | license.spdx | S | yes | package.json license MIT; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | git ls-files grep mise/aqua/asdf/tool-versions/install.*.sh = 0 | no | yes | |

## Counts

| | A | B |
|---|---|---|
| Group 1 / Group 2 (of 25) | 7 / 18 | 6 / 19 |
| Failing group-1 ADRs | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 0 |
| Other group-1 ADRs | 7 | 6 |
| Lowest-numbered ADR in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabelled citations | 0 | 0 |
| Unlabelled citations | 0 | 0 |
| Rows with false evidence/count | 0 | 0 |
| Headings with count mismatch | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B none. False-evidence rows: none in either.
Notes: no group-1 key is A2 or O. Clone has 76 .js and 0 other-language files (one language). The clone's package.json is locally modified (adds a trivoallan devDependency); not relevant to any key. Group 2 list lengths match headings in both (A 18, B 19). Judgement call: ADR-0010 architecture.document `none` classed A1 (the ADR fixes the path docs/architecture/arc42/ and has a separate `elsewhere` value); if read as A2, A would have 1 doubtful and 1 failing ADR (0010) and 1 mislabel.
