# Score, run 12, rollup__rollup

Clone checked: .../eval/run11/rollup__rollup. Facts verified: `git ls-files :/src :/cli :/browser :/build-plugins :/scripts | grep -cE '\.ts$'` = 314; `.rs` tracked = 113; all tracked `.ts` = 383; tracked `.js` = 12715 (`.js`+`.mjs`+`.cjs` = 12802, 12663 of the `.js` under test/); TS lines in src+cli+browser = 38507 vs Rust 6246; `.c4/.likec4` = 0; no docs/architecture/; ARCHITECTURE.md:53 mermaid block; docs/AGENTS.md:14 mermaid SVG note; package.json:100-103 repository, :112 license MIT, :113-115 bugs, :212 vue, :227 react; LICENSE.md MIT; .github/ISSUE_TEMPLATE has bug/docs/feature/modification .yaml + SUPPORT.md; PULL_REQUEST_TEMPLATE.md:41 "resolves #1234"; origin = https://github.com/rollup/rollup.git; no openspec dir or mention outside docs/adr/; no CODEOWNERS.

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files (.ts vs .rs) | no | no (partly) | 314 .ts / 113 .rs true. "12,802 tracked .js files" false as stated: .js = 12715, 12802 only with .mjs/.cjs added. Source is TypeScript (38.5k lines vs 6.2k Rust) |
| 0010 | architecture.document | T | yes | ARCHITECTURE.md at root; no docs/architecture/ | no | yes | `elsewhere` is an allowed value (ADR-0010 line 113) |
| 0010 | architecture.model | A1 | yes | 0 .c4/.likec4 files; no docs/architecture/model/ | no | yes | a model would leave files |
| 0010 | architecture.diagrams | S | yes | ARCHITECTURE.md:53 | no | yes | |
| 0013 | frontend.framework | S | yes | package.json:212 vue; docs/repl/components/*.vue | no | yes | vue is a docs-site/REPL dependency; react also in package.json:227 (ARM workaround). Agent flagged the doubt itself |
| 0014 | tracking.tool | S | yes | .github/ISSUE_TEMPLATE/*.yaml; PULL_REQUEST_TEMPLATE.md:41 | no | yes | |
| 0014 | tracking.project | S | yes | package.json:100-115; git remote origin | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same absence | no | yes | follows framework none |
| 0023 | license.spdx | S | yes | package.json:112; LICENSE.md | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0014 | tracking.tool | S | yes | package.json:113-115 bugs.url; .github/ISSUE_TEMPLATE | no | yes | |
| 0014 | tracking.project | S | yes | package.json repository/bugs | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, no dependency | no | yes | |
| 0016 | changes.schema | A1 | yes | follows framework none | no | yes | |
| 0023 | license.spdx | S | yes | package.json:112; LICENSE.md | no | yes | |

## Survey C
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0014 | tracking.tool | S | yes | package.json bugs; .github/ISSUE_TEMPLATE (bug, docs, feature, modification .yaml) | no | yes | |
| 0014 | tracking.project | S | yes | bugs.url; git remote origin | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir; 0 matches in .github | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json:112; LICENSE.md | no | yes | |

## Survey D
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0010 | architecture.document | T | yes | ARCHITECTURE.md at root; no docs/architecture/arc42/ | no | yes | `elsewhere` allowed |
| 0010 | architecture.model | A1 | yes | no model dir, no LikeC4 file | no | yes | |
| 0010 | architecture.diagrams | S | yes | ARCHITECTURE.md:53; docs/AGENTS.md:14 | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/; "openspec" absent outside docs/adr/ | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json:112; LICENSE.md | no | yes | |

## Counts

| | A | B | C | D |
|---|---|---|---|---|
| Group 1 / group 2 (of 25) | 6 / 19 | 3 / 22 | 3 / 22 | 3 / 22 |
| Failing group-1 ADRs | 0 | 0 | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 0 | 0 | 0 |
| Other group-1 ADRs | 6 | 3 | 3 | 3 |
| Lowest-numbered ADR in group 1 | 0004 | 0014 | 0014 | 0010 |
| ADR-0004 in group 1 | yes | no (group 2; one main language, TypeScript) | no (group 2; one main language, TypeScript) | no (group 2; one main language, TypeScript) |
| Mislabels | 0 | 0 | 0 | 0 |
| Citations with no label | 0 | 1 (0022, CODEOWNERS) | 0 | 0 |
| Rows with false evidence / false count | 1 (0004) | 0 | 0 | 0 |
| Group headings with wrong count | 0 | 0 | 0 | 0 |

Failing lists: A none; B none; C none; D none.
Doubtful lists: A none; B none; C none; D none.

Notes:
- Group-1 rows only were checked for truth of evidence. Group-2 rows were not scored.
- "Citations with no label": group-2 rows that cite nothing ("None.", "Unknown.", "none") were not counted; B 0022 cites "no CODEOWNERS" with no label, counted.
- A 0004: the false count is the ".js" wording (12,802 is js+mjs+cjs; .js alone is 12,715).
- ADR-0004 clone check: TypeScript dominates (383 .ts files, 38.5k lines in src/cli/browser, against 113 .rs files, 6.2k lines), so one main language.
