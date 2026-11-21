# Score 14, terser__terser

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 288 .js/.cjs/.mjs, 1 .ts | no | yes (288, 1 verified) | |
| 0007 | tests.coverage_target | A1 | yes | package.json, .github/workflows/ci.yml, git ls-files: no nyc/c8/codecov | no | yes (0 grep hits) | coverage config would leave a file |
| 0016 | changes.framework | A1 | yes | git ls-files: no openspec path | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json line 6, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | git ls-files: no mise/aqua/.tool-versions | no | yes | agent says functional.sh has "no install command"; it runs `npm ci` and a git clone, but no tool install, so read as true in context |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 282 of 324 end in .js, 1 .ts; package.json type=module | no | yes (282, 324, 1 verified) | |
| 0007 | tests.coverage_target | A1 | yes | package.json, CONTRIBUTING.md, README.md, .github: no coverage tool | no | yes | |
| 0010 | architecture.document | A1 | yes | git ls-files: no docs/architecture, no arc42; git grep architecture in README/CONTRIBUTING/RECIPES: 0 hits | no | yes | could be argued A2 (a wiki outside the clone) |
| 0010 | architecture.model | A1 | yes | git ls-files: no .c4/.likec4 | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | git grep mermaid/plantuml in md/html: 0 files | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json deps (acorn, commander, source-map...), tools/props.html: no framework | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json line 6, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/.tool-versions | no | yes | |

## Counts
| | A | B |
|---|---|---|
| Group 1 / Group 2 (of 25) | 5 / 20 | 7 / 18 |
| Failing group-1 ADRs | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 0 |
| Other group-1 ADRs | 5 | 7 |
| Lowest-numbered ADR in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabels | 0 | 0 |
| Citations with no label | 0 | 0 |
| Rows with false evidence/count | 0 | 0 |
| Group headings with mismatched count | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B none.
Group-1 lists: A 0004, 0007, 0016, 0023, 0025. B 0004, 0007, 0010, 0013, 0016, 0023, 0025.
Counts spot-checked in group 2 (all true): 3546 subjects, 281 merges, 463 tags, 14 of last 100 end in (#N), 0 merges in last 100.
