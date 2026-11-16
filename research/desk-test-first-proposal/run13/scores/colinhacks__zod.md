# Score 13, colinhacks__zod

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 516 ts/tsx/mts/cts, 9 js/mjs/cjs, 0 py | no | yes (516, 9, 0 all confirmed) | |
| 0007 | tests.coverage_target | A1 | yes | no threshold in vitest configs, package.json, .github; only claude-code-review.yml:48 prompt bullet | no | yes | a threshold would sit in config |
| 0013 | frontend.framework | S | yes | packages/docs/package.json:21 "next": "15.5.25" | no | yes | docs site only; agent states this caveat |
| 0014 | tracking.tool | S | yes | package.json bugs.url github.com/colinhacks/zod/issues | no | yes | |
| 0014 | tracking.project | S | yes | package.json bugs.url / repository.url | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, no openspec file tracked | no | yes | |
| 0016 | changes.schema | A1 | yes | follows framework none | no | yes | agent caveat that schema has nothing to show with none |
| 0023 | license.spdx | S | yes | packages/zod/package.json:5, packages/mini/package.json:5, LICENSE "MIT License" | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 516 ts files vs 9 js | no | yes (quote exists in AGENTS.md line 34 of HEAD; CLAUDE.md is a symlink to it) | citation labelled shows the value but cites only a sentence on the language of tests; mislabel |
| 0007 | tests.coverage_target | A1 | yes | no threshold in vitest configs, package.json, test.yml | no | yes | AGENTS.md coverage command sets no target: true |
| 0014 | tracking.tool | S | yes | package.json bugs.url | no | yes | |
| 0014 | tracking.project | S | yes | package.json bugs.url | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, no reference outside docs/adr | no | yes | |
| 0016 | changes.schema | A1 | yes | follows framework none | no | yes | |
| 0023 | license.spdx | S | yes | packages/zod/package.json:5, five other packages (integration, mini, treeshake, resolution, tsc), LICENSE | no | yes | "five other packages" confirmed |

## Counts
| | A | B |
|---|---|---|
| Group 1 / group 2 (of 25) | 6 / 19 | 5 / 20 |
| Failing group-1 | 0 | 0 |
| Doubtful group-1 | 0 | 0 |
| Other group-1 | 6 | 5 |
| Lowest-numbered in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabels | 0 | 1 (0004) |
| Unlabelled citations | 0 | 0 |
| Rows with false evidence/count | 0 | 0 |
| Heading counts not matching list | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B none.
Notes: clone holds 26 proposed ADRs (0001 included); neither survey lists 0001 and both count 25. The clone's AGENTS.md and package.json carry uncommitted ontrack additions (not used as evidence by either survey). Rows in group 2 were not scored.
