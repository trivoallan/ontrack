# Score: caolan__async (surveys X, Y, Z)

Group-1 ADR rows. "agent said unseen" is n/a throughout because no group-1 ADR fails.

## X (group 1: 0014, 0016, 0018, 0023, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0014 | tracking.tool | yes | package.json:12-13 bugs.url | n/a | yes | |
| 0014 | tracking.project | yes | package.json bugs.url, repository.url (caolan/async) | n/a | yes | |
| 0016 | changes.framework | yes | no openspec/ in tree (absence is the value) | n/a | yes | |
| 0016 | changes.schema | yes | same | n/a | yes | |
| 0018 | dependencies.updater | yes | .github/dependabot.yml (npm, github-actions) | n/a | yes | |
| 0018 | dependencies.automerge | yes | ci.yml is the only workflow, no merge step; grep 0 matches reproduced | n/a | yes | |
| 0023 | license.spdx | yes | package.json:70 "MIT", LICENSE | n/a | yes | |
| 0025 | tools.manager | yes | no mise.toml/aqua/.tool-versions; ci.yml installs nothing outside npm | n/a | yes | |

False row in group 2 (not a group-1 row): ADR-0002 `documentation`, "README.es.md is a Spanish translation of the README". It is not: README.es.md is the English async-es README (diff against README.md is 48 lines, text in English).
Other numbers checked and true: 94 scoped subjects of last 500 (deps-dev 68, deps 18, docs 3); 61 merges in last 500, 3 in last 100; Node 18/20/21; nyc block has only exclude; no .npmrc, no .claude/.

## Y (group 1: 0002, 0004, 0010, 0013, 0014, 0016, 0018, 0021, 0023, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0002 | localization.language.default | yes | README.md, lib/*.js JSDoc, git log subjects all English | n/a | yes | |
| 0002 | documentation / commits / code / comments | yes (empty, inherit default) | same; README.es.md is English too | n/a | yes | |
| 0004 | languages.main.name | yes | lib/*.js, package.json main, .eslintrc.json, .babelrc | n/a | yes | |
| 0010 | architecture.document | yes | no docs/architecture/, no arc42 mention outside docs/adr, AGENTS.md | n/a | yes | absence is the value |
| 0010 | architecture.model | yes | no .c4/.likec4/.dsl file (find) | n/a | yes | |
| 0010 | architecture.diagrams | yes | no .puml/.mmd file (find) | n/a | yes | |
| 0013 | frontend.framework | yes (rejected) | no UI framework in package.json; library under lib/ | n/a | yes | |
| 0014 | tracking.tool | yes | package.json bugs.url; .github/ISSUE_TEMPLATE.md | n/a | yes | |
| 0014 | tracking.project | yes | package.json bugs.url / repository.url | n/a | yes | |
| 0016 | changes.framework | yes | no openspec/ | n/a | yes | |
| 0016 | changes.schema | yes | same | n/a | yes | |
| 0018 | dependencies.updater | yes | .github/dependabot.yml | n/a | yes | |
| 0018 | dependencies.automerge | yes | ci.yml only workflow, no fetch-metadata | n/a | yes | |
| 0021 | supply_chain.build_level | yes (borderline) | Makefile:156-157 `npm publish` from a workstation; no attest/provenance/id-token in .github, Makefile, package.json, nor in workflow history; level 0 follows from absence | n/a | yes (Makefile:156 true) | Borderline: provenance is registry-held in principle, but release steps are in the clone and the ADR says manual/workstation publishing has none. Scored visible. |
| 0023 | license.spdx | yes | package.json:70, LICENSE | n/a | yes | |
| 0025 | tools.manager | yes | no mise/aqua/tool-versions; ci.yml installs nothing outside npm | n/a | yes | |

Group-2 numbers checked and true: 159 conventional subjects out of 1628 non-merge commits; Makefile:145-158 release targets; no .npmrc.

## Z (group 1: 0023, 0014, 0018, 0010, 0016, 0025)

| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0023 | license.spdx | yes | package.json:70, LICENSE | n/a | yes | |
| 0014 | tracking.tool | yes | package.json bugs.url, ISSUE_TEMPLATE.md | n/a | yes | |
| 0014 | tracking.project | yes | bugs.url | n/a | yes | |
| 0018 | dependencies.updater | yes | dependabot.yml (npm monthly, github-actions weekly) | n/a | yes | |
| 0018 | dependencies.automerge | yes | only ci.yml, no fetch-metadata | n/a | yes | |
| 0010 | architecture.document | yes | no docs/architecture/ | n/a | yes | |
| 0010 | architecture.model | yes | no .c4/.likec4/structurizr | n/a | yes | |
| 0010 | architecture.diagrams | yes | no mermaid/plantuml source | n/a | yes | |
| 0016 | changes.framework | yes | no openspec/, no dependency | n/a | yes | |
| 0016 | changes.schema | yes | same | n/a | yes | |
| 0025 | tools.manager | yes | no mise/aqua/pinning script; ci.yml installs nothing outside npm | n/a | yes | |

Group-2 numbers checked and true: 91 of last 100 commits in format; nyc exclude only; dependabot.yml has no cooldown.

## Counts

| | X | Y | Z |
|---|---|---|---|
| ADRs in group 1 | 5 | 10 | 6 |
| ADRs in group 2 | 20 | 15 | 19 |
| ADRs in neither or both (of 25) | 0 | 0 | 0 |
| Failing group-1 ADRs | 0 | 0 | 0 |
| Of those, left unstated by the agent | 0 | 0 | 0 |
| Mislabels (claims to show the value, only shows something next to it) | 0 | 0 | 0 |
| Citations with no label at all (surveys that label) | 5 | 0 | 4 |
| Rows with false evidence or false count | 1 | 0 | 0 |
| Group headings with a count not matching the list | 0 | n/a (no counts given) | 0 |
| Group-2 ADRs naming where the unseen value lives, or "unknown" | 13 of 20 | 9 of 15 | 10 of 19 |

Lists:
- Failing group-1 ADRs: none in X, Y, Z. (Y ADR-0021 is the one borderline case, scored as visible.)
- False rows: X: ADR-0002 `documentation` (README.es.md is not Spanish). Y, Z: none.
- Unlabeled citations: X: 0020 approver, 0022 by, 0022 approvals, 0024 fail_on, 0026 identity (each "None"/"Unknown"). Z: 0022, 0015 storage, 0017 hosts, 0026 ("None."). Y: every row has a label; "held outside" is used as a label on 0015 storage, 0019, 0022, 0024, 0026.
- Group-2 ADRs naming an outside place or "unknown": X: 0006, 0007, 0008, 0009, 0011, 0012, 0015, 0019, 0020, 0021, 0022, 0024, 0026. Y: 0007, 0009, 0011, 0012, 0015, 0019, 0022, 0024, 0026. Z: 0007, 0009, 0011, 0012, 0015, 0019, 0021, 0022, 0024, 0026. ("A choice people make" was not counted as a place.)
