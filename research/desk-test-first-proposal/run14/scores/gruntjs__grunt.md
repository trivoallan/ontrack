# Score 14 - gruntjs__grunt

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 43 .js, 0 .ts/.py/.mjs; package.json main | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ in git ls-files | no | yes | openspec would leave a directory |
| 0016 | changes.schema | A1 | yes | same; no schema file | no | yes | "only valid pairing" is inference, absence still shown |
| 0023 | license.spdx | S | yes | package.json "license": "MIT"; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/script; test.yml only npm install/test | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 43 js, 0 ts/py/mjs; package.json main, engines | no | yes | |
| 0005 | validation.boundary | A1 | yes | package.json dependencies: no validation library | no | yes | a hand-written check could exist in code, but a boundary library would be a dependency |
| 0005 | validation.data_files | A1 | yes | git ls-files '*schema*' empty | no | yes | 3 yaml test fixtures only |
| 0007 | tests.coverage_target | A1 | yes | package.json scripts, test.yml, Gruntfile: no coverage tool | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | inference from framework none |
| 0023 | license.spdx | S | yes | package.json, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml, aqua.yaml, *.sh, .tool-versions; test.yml | no | yes | |

## Counts
| | A | B |
|---|---|---|
| Group 1 / Group 2 | 4 / 21 | 6 / 19 |
| Failing group-1 ADRs | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 0 |
| Other group-1 ADRs | 4 | 6 |
| Lowest-numbered in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabels | 0 | 0 |
| Citations with no label | 0 | 0 (4 group-2 rows say "unknown (no citation)") |
| Rows with false evidence | 1 (ADR-0008, group 2) | 0 |
| Heading count mismatches | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B none.
Notes: A's ADR-0008 row says docs/ holds only the untracked adr/, but docs/README.md is tracked. Neither survey's group 1 includes a forge-held value.
