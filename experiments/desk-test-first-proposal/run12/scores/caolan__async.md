# Score, run 12, caolan__async

Clone facts checked: HEAD 3921e54; package.json (working tree) has license MIT (l.70), bugs.url (l.12-13), repository.url, main dist/async.js; .github holds ISSUE_TEMPLATE.md, dependabot.yml (npm monthly, github-actions weekly, no cooldown), workflows/ci.yml only (no merge step, no fetch-metadata, no tool install outside npm); git ls-files: 185 .js (102 under lib/), 0 .ts/.py/.go; no openspec/mise/aqua/.tool-versions/.c4/.likec4/.mmd/.puml/architecture path tracked or ever deleted in history; no tracked .md outside docs/adr mentions architecture/arc42/mermaid/plantuml; LICENSE is MIT. (A naive grep for "mise" hits lib/internal/promiseCallback.js: substring only.)
Rule applied: failing = a key is O or its value is not visible; doubtful = any key A2 or O. A2 keys are marked "absence only" and are doubtful, not failing.

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0023 | license.spdx | S | yes | package.json l.70, LICENSE | no | yes | |
| 0014 | tracking.tool | S | yes | package.json bugs.url l.12-13; .github/ISSUE_TEMPLATE.md | no | yes | |
| 0014 | tracking.project | S | yes | package.json bugs.url / repository.url | no | yes | |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml | no | yes | |
| 0018 | dependencies.automerge | A1 | yes (absence) | .github/workflows/ has only ci.yml, no merge step | no | yes | automerge is a workflow, so it would leave a file |
| 0010 | architecture.document | A2 | absence only | no docs/architecture/ | no | yes | `none` vs `elsewhere` (wiki) leaves no trace; the survey itself asks the user to confirm nothing lives outside the repo, yet labels it "shows the value" |
| 0010 | architecture.model | A1 | yes (absence) | git ls-files: no .c4/.likec4/structurizr | no | yes | |
| 0010 | architecture.diagrams | A1 | yes (absence) | no mermaid/plantuml source or mention in tracked md | no | yes | |
| 0016 | changes.framework | A1 | yes (absence) | no openspec/ dir, no dependency in package.json | no | yes | |
| 0016 | changes.schema | A1 | yes (absence) | same | no | yes | |
| 0025 | tools.manager | A1 | yes (absence) | no mise.toml/aqua.yaml/script; ci.yml installs only via npm | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0014 | tracking.tool | S | yes | package.json l.12-13 | no | yes | |
| 0014 | tracking.project | S | yes | bugs.url + repository.url | no | yes | |
| 0016 | changes.framework | A1 | yes (absence) | no openspec/** | no | yes | |
| 0016 | changes.schema | A1 | yes (absence) | same | no | yes | |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml | no | yes | |
| 0018 | dependencies.automerge | A1 | yes (absence) | ci.yml only; the 0-match Grep reproduced (0 matches) | no | yes | |
| 0023 | license.spdx | S | yes | package.json l.70, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes (absence) | no mise/aqua/.tool-versions; ci.yml | no | yes | |

## Survey C
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files '*.js': 185, lib/: 102, .ts/.py/.go: 0 | no | yes | counts reproduced; single main language |
| 0014 | tracking.tool | S | yes | package.json bugs.url; ISSUE_TEMPLATE.md | no | yes | |
| 0014 | tracking.project | S | yes | repository.url; git remote -v (same address) | no | yes | |
| 0016 | changes.framework | A1 | yes (absence) | no openspec | no | yes | grep pattern elided ("…"), could not be re-run exactly; the absence itself is true |
| 0016 | changes.schema | A1 | yes (absence) | same | no | yes | |
| 0018 | dependencies.updater | S | yes | dependabot.yml | no | yes | |
| 0018 | dependencies.automerge | A1 | yes (absence) | only ci.yml, no merge step | no | yes | |
| 0023 | license.spdx | S | yes | package.json, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes (absence) | no mise/aqua/script | no | yes | "same git ls-files grep gives 0": true for the tool names, though a pattern containing "mise" would hit promiseCallback.js; pattern elided |

## Survey D
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0010 | architecture.document | A2 | absence only | no tracked architecture file; no mention in tracked md | no | yes | the survey says "so there is no document and no `elsewhere`": a document elsewhere leaves no trace, so the inference is not supported |
| 0010 | architecture.model | A1 | yes (absence) | no .c4/.likec4 | no | yes | |
| 0010 | architecture.diagrams | A1 | yes (absence) | no .mmd/.puml, no mermaid/plantuml in md | no | yes | |
| 0014 | tracking.tool | S | yes | bugs.url; ISSUE_TEMPLATE.md | no | yes | |
| 0014 | tracking.project | S | yes | repository.url; git remote -v | no | yes | |
| 0016 | changes.framework | A1 | yes (absence) | no openspec | no | yes | |
| 0016 | changes.schema | A1 | yes (absence) | same | no | yes | |
| 0018 | dependencies.updater | S | yes | dependabot.yml (npm monthly, github-actions weekly) | no | yes | |
| 0018 | dependencies.automerge | A1 | yes (absence) | only ci.yml, read in full | no | yes | |
| 0023 | license.spdx | S | yes | package.json, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes (absence) | no mise/aqua/.tool-versions/script | no | yes | |

## Counts

| | A | B | C | D |
|---|---|---|---|---|
| Group 1 / group 2 (of 25) | 6 / 19 | 5 / 20 | 6 / 19 | 6 / 19 |
| Failing group-1 ADRs | 0 | 0 | 0 | 0 |
| Doubtful group-1 ADRs | 1 (0010) | 0 | 0 | 1 (0010) |
| Other group-1 ADRs | 5 | 5 | 6 | 5 |
| Lowest-numbered ADR in group 1 | 0010 | 0014 | 0004 | 0010 |
| ADR-0004 in group 1 | no | no | yes | no |
| Mislabels ("shows the value" but only next to it) | 1 (0010 document) | 0 | 0 | 1 (0010 document) |
| Citations with no label | 1 (group 2, 0017) | 1 (group 2, 0022 review.by) | 0 | 0 |
| Rows with false evidence or false count | 0 | 0 | 0 | 0 |
| Group headings with a wrong count | 0 | 0 | 0 | 0 |

Failing lists: none in A, B, C, D.
Doubtful lists: A: ADR-0010 (architecture.document is A2). D: ADR-0010 (same). B and C: none.
ADR-0004 where in group 2 (A, B, D): the clone has one main language, JavaScript (185 tracked .js files, 0 .ts/.py/.go; the other tracked files are generated docs html, fonts, json and svg), not a mix of two.
Other checked group-2 counts (outside the required scope) were true: 91 of last 100 conventional subjects (A), 94 scoped in last 500 (B), 61 merges in last 500 and 3 in last 100 (B), 388 merges overall (C, D), 50 test files (D), 173 of 300 non-conventional (D).
