## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files lib: 28 .js, 22 .d.ts; tsconfig noEmit | no | yes | counts verified |
| 0007 | tests.coverage_target | S | yes | package.json c8 lines:100, check-coverage | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json deps: nanoid, picocolors, source-map-js | no | yes | a framework would sit in package.json |
| 0014 | tracking.tool | S | yes | package.json bugs.url | no | yes | |
| 0014 | tracking.project | S | yes | package.json repository | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ dir | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0019 | vulnerabilities.scanner | A2 | no | no scan workflow, but git log shows dependabot[bot] bumps (12 commits, e.g. nanoid 3.3.8, 2024-12-10): a repo-setting scanner/alerts can exist with no file | no | partly | claim "none" contradicted by history; labelled "shows the value" |
| 0019 | vulnerabilities.sbom | A1 | yes | release.yml has no SBOM step; git ls-files grep 0 | no | yes | |
| 0019 | vulnerabilities.fail_on | A1 | yes | no scan job in test.yml/release.yml | no | yes | |
| 0023 | license.spdx | S | yes | package.json license MIT; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/install script in git ls-files | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0007 | tests.coverage_target | S | yes | package.json c8 lines:100 | no | yes | |
| 0010 | architecture.document | S | yes | docs/architecture.md (git ls-files); no docs/architecture/arc42 | no | yes | `elsewhere` is an allowed value |
| 0010 | architecture.model | A1 | yes | no .c4/.likec4 in git ls-files | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | no mermaid/plantuml in docs/README (only untracked ADRs); 0 png/svg/jpg tracked | no | yes | |
| 0013 | frontend.framework | A1 | yes | package.json deps | no | yes | |
| 0014 | tracking.tool | S | yes | package.json bugs.url | no | yes | |
| 0014 | tracking.project | S | yes | package.json repository | no | yes | |
| 0016 | changes.framework | A1 | yes | git ls-files grep openspec = 0 | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A2 | no | no dependabot.yml/renovate config, but git log has 12 dependabot[bot] commits (latest 2024-12-10, "Bump nanoid ... (#1989)"): the clone shows the updater exists | no | no | agent grepped files only; "none" fails (clone shows the thing exists); labelled "shows the value" |
| 0018 | dependencies.automerge | A1 | yes | no automerge workflow/fetch-metadata | no | yes | automerge is a workflow file per ADR |
| 0023 | license.spdx | S | yes | package.json, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua/script in git ls-files | no | yes | |

## Counts
| | A | B |
|---|---|---|
| Group 1 / Group 2 (of 25) | 8 / 17 | 8 / 17 |
| Failing group-1 | 1 (0019) | 1 (0018) |
| Doubtful group-1 | 1 (0019) | 1 (0018) |
| Other group-1 | 7 | 7 |
| Lowest-numbered in group 1 | 0004 | 0007 |
| ADR-0004 in group 1? | yes | no (group 2; clone has one main language, JavaScript: 28 lib .js vs 22 .d.ts declarations, noEmit tsc) |
| Mislabels | 1 (0019 scanner) | 1 (0018 updater) |
| Unlabelled citations (group 1) | 0 | 0 |
| Rows with false evidence/count | 1 (0019 scanner: "none" contradicted by dependabot history) | 1 (0018 updater, same) |
| Headings with count mismatch | 0 | 0 |

Notes: all group-1 numeric counts verified true. Group-2 counts spot-checked and true in both (A: 18/300 conventional, 36/100 (#N), 212 by one author; B: 186 non-merge, 11 typed, 1 scoped, 2 merges/188, 51/186, 43 release commits, 17 Co-Authored-By). Group 2 has a few rows reading "Unknown."/"No citation" with no label (A: 0022 approvals, 0024 fail_on; B: 0020, 0024 fail_on), not counted as group-1 citations. Dependabot history is the only reason the two rows above fail; classification of that is a judgement call.
