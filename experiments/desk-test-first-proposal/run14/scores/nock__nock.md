## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files: 15 .ts (index.ts, lib/), 53 test js, 9 examples + 3 scripts js; tsconfig include | no | yes | counts 15/12/53 verified |
| 0007 | tests.coverage_target | S | yes | .nycrc.yml lines: 96.63 (branches 94.25); test script uses c8 | no | yes | agent flags lines vs branches ambiguity |
| 0014 | tracking.tool | S | yes | package.json bugs.url nock/nock/issues; .github/ISSUE_TEMPLATE | no | yes |  |
| 0014 | tracking.project | S | yes | package.json repository.url / bugs.url | no | yes |  |
| 0016 | changes.framework | A1 | yes (absence) | git ls-files: no openspec | no | yes | openspec would leave a directory |
| 0016 | changes.schema | A1 | yes (absence) | same | no | yes |  |
| 0023 | license.spdx | S | yes | package.json license MIT; LICENSE | no | yes |  |
| 0025 | tools.manager | A1 | yes (absence) | no mise.toml/aqua/.tool-versions; workflows use only checkout/setup-node + npm | no | yes |  |

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files lib index.ts = 15 ts; js: tests 53, examples 9, scripts 3 = 65; tsconfig include | no | yes | counts verified |
| 0007 | tests.coverage_target | S | yes | .nycrc.yml lines 96.63, branches 94.25, include lib | no | yes | agent states it did not run npm test |
| 0013 | frontend.framework | A1 | yes (absence) | 0 html/css/tsx/vue/... files in git ls-files; no UI framework in package.json | no | yes | a framework would leave source files |
| 0014 | tracking.tool | S | yes | package.json bugs.url; ISSUE_TEMPLATE has 3 files | no | yes |  |
| 0014 | tracking.project | S | yes | package.json repository.url; git remote -v | no | yes |  |
| 0016 | changes.framework | A1 | yes (absence) | no openspec in git ls-files | no | yes |  |
| 0016 | changes.schema | A1 | yes (absence) | follows from framework none | no | yes |  |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml (npm + github-actions, monthly); 199 commits by dependabot[bot] | no | yes | 199 verified |
| 0018 | dependencies.automerge | A2 | partly | no workflow mentions fetch-metadata/automerge/pr merge | no | yes | GitHub auto-merge or a manual merge leaves no file; absence not proof; no forge-held value claimed |
| 0023 | license.spdx | S | yes | package.json license MIT; LICENSE | no | yes |  |
| 0025 | tools.manager | A1 | yes (absence) | no mise/aqua files; workflows use only checkout/setup-node + npm | no | yes |  |

## Counts

| | A | B |
|---|---|---|
| Group 1 / Group 2 (of 25) | 6 / 19 | 8 / 17 |
| Failing | 0 | 0 |
| Doubtful | 0 | 1 (ADR-0018) |
| Other | 6 | 7 |
| Lowest-numbered in group 1 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes |
| Mislabels | 0 | 0 |
| Unlabelled citations | 0 | 0 |
| Rows with false evidence/count | 0 | 0 |
| Heading counts not matching | 0 | 0 |

Failing A: none. Failing B: none. Doubtful A: none. Doubtful B: ADR-0018 (automerge A2).
