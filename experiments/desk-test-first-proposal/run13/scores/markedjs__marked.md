## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0004 | languages.main.name | T | yes | `git ls-files src` = 13 files, all `.ts`; package.json typescript 6.0.3 | no | yes | 13 ts confirmed |
| 0007 | tests.coverage_target | A1 | yes | no c8/nyc/coverage in package.json, .github, build configs, test/*.js; no coverage config file in `git ls-files` | no | yes | coverage would leave a script or config |
| 0013 | frontend.framework | A1 | yes | no UI framework in package.json or docs (git grep) | no | yes | docs/demo is plain JS |
| 0014 | tracking.tool | S | yes | package.json:37 `bugs.url` .../issues; .github/ISSUE_TEMPLATE/ | no | yes | |
| 0014 | tracking.project | S | yes | package.json:33 `repository.url`; `git remote -v` | no | yes | |
| 0016 | changes.framework | A1 | yes | `git ls-files` has 0 openspec paths | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json:39 `"license": "MIT"`; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua/.tool-versions, no .sh file, 0 matches in `git ls-files` | no | yes | .devcontainer uses an image only, not a tool manager |

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0004 | languages.main.name | T | yes | `git ls-files src` = 13 `.ts`; AGENTS.md:13 | no | NO | agent says 385 tracked files under src; actual 13 |
| 0007 | tests.coverage_target | A1 | yes | no c8/coverage/nyc in package.json; tests.yml has no coverage step | no | yes | |
| 0014 | tracking.tool | S | yes | package.json:37 `bugs.url` | no | yes | |
| 0014 | tracking.project | S | yes | package.json:33 `repository.url` | no | yes | |
| 0016 | changes.framework | A1 | yes | 0 openspec paths in `git ls-files`, no openspec/ | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml (npm, github-actions) | no | yes | |
| 0018 | dependencies.automerge | A2 | no | no fetch-metadata workflow; tests.yml only workflow | no | yes | automerge can be a GitHub auto-merge setting or an app configured outside the clone, with no file; absence in clone does not show `none` |
| 0023 | license.spdx | S | yes | package.json:39; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua/install script | no | yes | |

## Counts

| | A | B |
| --- | --- | --- |
| Group 1 / Group 2 (of 25) | 7 / 18 | 7 / 18 |
| Failing group-1 ADRs | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 1 (0018) |
| Other group-1 ADRs | 7 | 6 |
| Lowest-numbered ADR in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabels | 0 | 1 (0018 automerge) |
| Unlabelled citations | 0 | 0 |
| Rows with false evidence/count | 0 | 1 (0004: 385 files) |
| Heading counts not matching | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B 0018.
