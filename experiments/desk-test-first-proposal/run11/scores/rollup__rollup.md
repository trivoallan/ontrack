# Score: rollup__rollup

Clone checks used: package.json:100-103 (repository), :112 (license), :113-115 (bugs.url); LICENSE.md line 2; ARCHITECTURE.md:53 (mermaid fence); docs/AGENTS.md:14; no docs/architecture/, no *.c4, no likec4 outside docs/adr; no openspec outside docs/adr; .github/ISSUE_TEMPLATE/*.yaml; AGENTS.md:90-92; git remote origin = github.com/rollup/rollup.git. ADR-0010 allows `elsewhere` (path named in body), model `none` = hand-drawn, diagrams `mermaid`. ADR-0016 allows `none` for both keys (framework none, schema none).

## Survey X (group 1: 0010, 0016, 0023)
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0010 | architecture.document = elsewhere (ARCHITECTURE.md) | yes | ARCHITECTURE.md at root; no docs/architecture/arc42/ | n/a | yes | |
| 0010 | architecture.model = none | yes | no docs/architecture/model/, no .c4 file anywhere | n/a | yes | absence is the value |
| 0010 | architecture.diagrams = mermaid | yes | ARCHITECTURE.md:53 | n/a | yes | docs/AGENTS.md:14 true |
| 0016 | changes.framework = none | yes | no openspec/ dir; "openspec" nowhere outside docs/adr | n/a | yes | |
| 0016 | changes.schema = none | yes | same; ADR pairs none with framework none | n/a | yes | |
| 0023 | license.spdx = MIT | yes | package.json:112; LICENSE.md line 2 | n/a | yes | |

## Survey Y (group 1: 0023, 0014)
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0023 | license.spdx = MIT | yes | package.json:112; LICENSE.md | n/a | yes | |
| 0014 | tracking.tool = github-issues | yes | AGENTS.md:90-92 section; .github/ISSUE_TEMPLATE/*.yaml; package.json bugs.url | n/a | yes | whether Issues is enabled is a forge setting, but templates + bugs.url show use |
| 0014 | tracking.project = rollup/rollup | yes | git remote -v; package.json:100-103 | n/a | yes | |

## Survey Z (group 1: 0014, 0016, 0023)
| ADR | key | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|
| 0014 | tracking.tool = github-issues | yes | package.json bugs.url (:113-115); .github/ISSUE_TEMPLATE/ | n/a | yes | |
| 0014 | tracking.project = rollup/rollup | yes | package.json bugs.url and repository | n/a | yes | |
| 0016 | changes.framework = none | yes | no openspec/ dir or dependency | n/a | yes | |
| 0016 | changes.schema = none | yes | ADR allows none with framework none | n/a | yes | |
| 0023 | license.spdx = MIT | yes | package.json:112; LICENSE.md | n/a | yes | |

## False evidence found in group 2 (checked against the clone)
- X, ADR-0013: says `react` is in package.json devDependencies. False: react is only under `overrides` (package.json:227); vue is in devDependencies. (X ADR-0009 "no prefix convention" is defensible; 2 of 34 remote branches are feat/*.)
- Y, ADR-0007: says "I found no codecov.yml". False: codecov.yml exists at the root (it sets no target, so the conclusion stands). Y ADR-0009: "Remote branches carry no prefixes" is false for 2 of 34 (origin/feat/enhance-tree-shaking-for-dynamic-imports, origin/feat/use-base36).
- Z, ADR-0009: "remote branches carry no prefix (git branch -a)" false for the same 2 branches.
- Counts checked and true: X none to check; Y 239 of last 300 subjects end (#NNNN) (true); Z 51 of 200 conventional prefixes (true), 153 of 200 (#NNNN) (true), tags v*.*.** (true), merge_group (true), minimumReleaseAge 3 days (true), version commit 4.68.4 (true), no CODEOWNERS/.env/.claude/.npmrc (true).

## Counts
| | X | Y | Z |
|---|---|---|---|
| Group 1 | 3 | 2 | 3 |
| Group 2 | 22 | 23 | 22 |
| Neither or both | 0 | 0 | 0 |
| Failing group-1 ADRs | 0 | 0 | 0 |
| Failing, agent left unstated | 0 | 0 | 0 |
| Mislabels | 0 | 0 | 0 |
| Unlabelled citations | 0 (1 borderline: 0005 "Not yet checked"; 0022 and 0026 say "None") | 3 (0011, 0012, 0024) | 0 |
| Rows with false evidence/count | 1 (0013) | 2 (0007, 0009 branch prefixes) | 1 (0009 branch prefixes) |
| Headings with count mismatch | 0 | 0 (no counts given) | 0 |
| Group-2 ADRs naming where unseen value lives or saying unknown | 11 of 22 | 8 of 23 | 10 of 22 |

Failing ADR lists: X none; Y none; Z none.
Group-2 naming/unknown lists: X 0006, 0009, 0011, 0014, 0015, 0018, 0019, 0021, 0022, 0024, 0026; Y 0007, 0009, 0011, 0012, 0018, 0022, 0024, 0026; Z 0005, 0008, 0009, 0011, 0012, 0015, 0021, 0022, 0024, 0026. ("A choice people make" was not counted as naming a place.)
