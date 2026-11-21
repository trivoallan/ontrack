# Score 12: moment__moment

Common key classes (checked in the clone; ADR-0001 is decided, so 25 proposed ADRs):
- 0004 languages.main.name = JavaScript: T/S (776 tracked *.js, 451 in src/, 6 *.ts; eslint.config.js:9 ecmaVersion 2015; AGENTS.md:48)
- 0013 frontend.framework = none: A1 (a UI framework would be a dependency or source file; package.json has none, 0 .astro/.vue/.svelte/.tsx/.jsx/.html tracked)
- 0014 tracking.tool / project: S (package.json:7 bugs, :6 repository)
- 0016 changes.framework / schema = none: A1 (no openspec dir; git ls-files and git grep find no openspec)
- 0018 dependencies.updater = none: A2 (Dependabot security updates / a GitHub App need no file; git log has 0 bot authors in 4132 commits, but an idle updater leaves no trace). automerge = none: A1 (would need a workflow or config; no fetch-metadata)
- 0023 license.spdx = MIT: S (package.json:8, bower.json:3, composer.json:22, LICENSE)
- 0025 tools.manager = none: A1 (no mise.toml/aqua.yaml/.tool-versions; 14 files in scripts/; no mise/aqua word in scripts or .github)

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files '*.js' (776; 451 in src/); eslint.config.js:9 | no | yes (451 true) | |
| 0014 | tracking.tool | S | yes | package.json:7 | no | yes | |
| 0014 | tracking.project | S | yes | package.json:6 | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec file in git ls-files | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A2 | yes (by absence + 0 bot authors) | git ls-files; git log authors | no | yes (0 true) | labelled "shows the value" but an updater can leave no file: mislabel |
| 0018 | dependencies.automerge | A1 | yes | no fetch-metadata in .github | no | yes | |
| 0023 | license.spdx | S | yes | package.json:8, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua; scripts/ 14 files | no | yes (14 true) | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files '*.js' = 776, '*.ts' = 6, py/go/rs = 0 | no | yes | |
| 0013 | frontend.framework | A1 | yes | 0 UI-framework files; package.json | no | yes | |
| 0014 | tracking.tool | S | yes | package.json:7 | no | yes | |
| 0014 | tracking.project | S | yes | package.json:6 | no | yes | |
| 0016 | changes.framework | A1 | yes | git grep -i openspec empty | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json:8, composer.json:22, bower.json:3, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | git ls-files aqua*/mise*/.tool-versions = 0 | no | yes | |

## Survey C
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | eslint.config.js:9; AGENTS.md:48; 776 .js | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json (no framework; main ./moment.js) | no | yes | |
| 0014 | tracking.tool | S | yes | package.json:7; ISSUE_TEMPLATE 3 files | no | yes (3 true) | |
| 0014 | tracking.project | S | yes | package.json:6 | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A2 | yes (by absence) | no dependabot.yml / renovate file | no | yes | "shows the value" on an absence that can exist without a file: mislabel |
| 0018 | dependencies.automerge | A1 | yes | no fetch-metadata | no | yes | |
| 0023 | license.spdx | S | yes | package.json:8, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua; scripts/ 14 files | no | yes (14 true) | |

## Survey D
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | S | yes | CONTRIBUTING.md:53; AGENTS.md:48 | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json, files list | no | yes | |
| 0014 | tracking.tool | S | yes | package.json:7; .github/ISSUE_TEMPLATE | no | yes | |
| 0014 | tracking.project | S | yes | package.json:6 | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A2 | yes (by absence + history) | no dependabot/renovate file; 0 bot authors | no | yes | "shows the value" on an absence an updater can have without a file: mislabel |
| 0018 | dependencies.automerge | A1 | yes | no fetch-metadata | no | yes | |
| 0023 | license.spdx | S | yes | package.json:8, LICENSE | no | yes | cited as package.json:9; the line is 8 (false line reference) |
| 0025 | tools.manager | A1 | yes | no mise/aqua; scripts/ | no | yes | |

## Counts
| | A | B | C | D |
|---|---|---|---|---|
| Group 1 / group 2 (of 25) | 6 / 19 | 6 / 19 | 7 / 18 | 7 / 18 |
| Failing group-1 ADRs | 0 | 0 | 0 | 0 |
| Doubtful group-1 ADRs | 1 | 0 | 1 | 1 |
| Other group-1 ADRs | 5 | 6 | 6 | 6 |
| Lowest-numbered group-1 ADR | 0004 | 0004 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes | yes | yes |
| Mislabels | 1 | 0 | 1 | 1 |
| Unlabelled citations | 0 | 0 | 0 | 0 |
| Rows with false evidence/count | 0 | 0 | 0 | 1 |
| Heading counts not matching list | 0 | 0 | 0 | 0 |

Failing lists: A none; B none; C none; D none.
Doubtful lists: A: ADR-0018 (updater A2); B: none; C: ADR-0018; D: ADR-0018.
False evidence list: D: ADR-0023 (package.json:9 cited, line is 8).
Mislabel list: A, C, D: ADR-0018 dependencies.updater.
Group-2 numbers also spot-checked and true in all surveys (7 conventional commits, 156 bracket tags, 1 scoped, 3 co-authored trailers, 109 src/lib files, 1014 merges of 4132, 136 "(#N)", 21 authors, 68 non-merges, 0 merges in 1 year, 48/47/38 tags).
