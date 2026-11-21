# Score: moment__moment

Clone checked: ESLint `ecmaVersion: 2015` (eslint.config.js:9), `package.json` lines 6-8 (repository, bugs, license), 451 `.js` in `src`, 14 files in `scripts/`, no dependabot/renovate/openspec/mise/aqua file or bot author in history, no standalone-tool install in workflows or scripts.

## X
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0004 | languages.main.name | yes | CONTRIBUTING.md:53, AGENTS.md:48, eslint.config.js | n/a | yes | |
| 0013 | frontend.framework | yes (absence; library, rejected) | package.json deps and `files` | n/a | yes | |
| 0014 | tracking.tool | yes | package.json:7 bugs; .github/ISSUE_TEMPLATE | n/a | yes | |
| 0014 | tracking.project | yes | package.json:6 repository | n/a | yes | |
| 0016 | changes.framework | yes (none) | `git ls-files` has no openspec | n/a | yes | |
| 0016 | changes.schema | yes (none) | same | n/a | yes | |
| 0018 | dependencies.updater | yes (none) | no dependabot.yml/renovate; 0 bot authors | n/a | yes | "Bump version" commits exist (58) |
| 0018 | dependencies.automerge | yes (none) | no fetch-metadata in workflows | n/a | yes | |
| 0023 | license.spdx | yes | package.json license, LICENSE | n/a | no | cites `package.json:9`; the line is 8 |
| 0025 | tools.manager | yes (none) | no mise/aqua file; no binary install | n/a | yes | |

## Y
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0004 | languages.main.name | yes | eslint.config.js ecmaVersion 2015, AGENTS.md:48, 451 .js in src | n/a | yes | 451 verified |
| 0014 | tracking.tool | yes | package.json bugs, issue forms | n/a | yes | |
| 0014 | tracking.project | yes | package.json repository | n/a | yes | |
| 0016 | changes.framework | yes (none) | `git ls-files` no openspec | n/a | yes | |
| 0016 | changes.schema | yes (none) | follows framework none | n/a | yes | |
| 0018 | dependencies.updater | yes (none) | no files; 0 bot authors | n/a | yes | |
| 0018 | dependencies.automerge | yes (none) | no fetch-metadata / `gh pr merge` in .github | n/a | yes | |
| 0023 | license.spdx | yes | package.json:8, LICENSE | n/a | yes | |
| 0025 | tools.manager | yes (none) | no mise/aqua; 14 files in scripts | n/a | yes | 14 verified |

## Z
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0002 | language.default (+4 overrides empty) | yes (borderline; read from file and commit content, no rule file) | CONTRIBUTING.md, AGENTS.md, git subjects, src comments in English | n/a | yes | no non-ASCII in src/lib verified; humanize.js:78 comment verified; chooseLocale commit verified |
| 0004 | languages.main.name | yes | package.json main, src/**/*.js, AGENTS.md:48 | n/a | yes | |
| 0013 | frontend.framework | yes (absence; rejected) | package.json deps | n/a | yes | |
| 0014 | tracking.tool | yes | package.json bugs, ISSUE_TEMPLATE, origin | n/a | yes | |
| 0014 | tracking.project | yes | package.json repository, origin moment/moment | n/a | yes | |
| 0016 | changes.framework | yes (none) | no openspec | n/a | yes | |
| 0016 | changes.schema | yes (none) | same | n/a | yes | |
| 0018 | dependencies.updater | yes (none) | no dependabot/renovate file; no bot commits | n/a | yes | |
| 0018 | dependencies.automerge | yes (none) | no fetch-metadata | n/a | yes | |
| 0023 | license.spdx | yes | package.json:8; bower.json and composer.json also MIT; LICENSE | n/a | yes | |

## Counts
| | X | Y | Z |
|---|---|---|---|
| Group 1 | 7 | 6 | 7 |
| Group 2 | 18 | 19 | 18 |
| Neither/both | 0 | 0 | 0 |
| Failing group-1 ADRs | 0 | 0 | 0 |
| Failing, agent left unstated | 0 | 0 | 0 |
| Mislabels ("shows the value" but only adjacent) | 0 | 0 | 0 |
| Unlabelled citations (group 1 or 2) | 1 (0026) | 3 (0020 approver, 0024 fail_on, 0026) | 8 (0007, 0008, 0010, 0012, 0015, 0019, 0024, 0025) |
| Rows with false evidence/count | 1 (0023: line 9 vs 8) | 0 | 0 |
| Heading counts not matching the list | 0 | 0 | 0 |
| Group-2 ADRs naming where the value lives or "unknown" | 18/18 | 19/19 | 12/18 strict (15/18 if 0003, 0020, 0021 count) |

Notes: group-2 counts in X (48/47/38/7 tags, 1014 merges) and Y (7, 136 of 300) match git. No document-in-clone-describes-forge-value issue arose in group 1. 0002 (Z), 0013 (X, Z) and the `none` values of 0018/0025 are the borderline passes; I scored them visible because the clone's content or absence shows them.
