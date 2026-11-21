## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | git ls-files '*.js' '*.mjs' '*.ts': 8 files (6 js, 2 mjs), 0 ts | no | yes | a fixture gulpfile.cjs also exists, not counted by the agent's command |
| 0013 | frontend.framework | A1 | yes | package.json has no framework; no html/jsx/vue in git ls-files | no | yes | "line 40" of ADR-0013 correct |
| 0016 | changes.framework | A1 | yes | git ls-files openspec/* empty; no deleted openspec in history | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json "license": "MIT"; LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/.tool-versions/script in git ls-files | no | yes | |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0010 | architecture.document | A2 | yes (absence in clone) | no docs/architecture, git grep architect/mermaid none | no | yes | an architecture document kept elsewhere would leave no trace; "shows the value" is a mislabel |
| 0010 | architecture.model | A1 | yes | no .c4 file | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | git grep mermaid/plantuml/likec4 outside docs/adr: none | no | yes | |
| 0016 | changes.framework | A1 | yes | no openspec/ | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A2 | yes (absence in clone) | no dependabot.yml/renovate config; only dev.yml, release.yml | no | yes | a bot run from an org preset or app setting leaves no file; mislabel |
| 0018 | dependencies.automerge | A2 | yes (absence in clone) | same | no | yes | automerge is a bot/forge setting; mislabel |
| 0023 | license.spdx | S | yes | package.json, LICENSE | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise/aqua/script | no | yes | |

## Counts

### Survey A
- Group 1: 5, group 2: 20 (of 25)
- Failing group-1 ADRs: 0 (none)
- Doubtful group-1 ADRs: 0 (none)
- Other group-1 ADRs: 5
- Lowest-numbered ADR in group 1: 0004
- ADR-0004 in group 1: yes
- Mislabels: 0
- Citations with no label: 7 group-2 rows with no citation (0018 automerge "unknown", 0019 fail_on, 0020 approver, 0022 by, 0022 approvals, 0024 fail_on, 0026 identity); group-1 rows: 0
- Rows with false evidence/count: 2 (0006 "empty .git/hooks": it holds the default *.sample files; 0006 "15 subjects in type(scope) form": 15 conventional subjects, only 2 carry a scope)
- Heading counts not matching: 0

### Survey B
- Group 1: 5, group 2: 20 (of 25)
- Failing group-1 ADRs: 0 (none)
- Doubtful group-1 ADRs: 2 (0010, 0018)
- Other group-1 ADRs: 3 (0016, 0023, 0025)
- Lowest-numbered ADR in group 1: 0010
- ADR-0004 in group 1: no (group 2); the clone has one main language, JavaScript (8 js/mjs files, 0 ts/py; one extra .cjs fixture)
- Mislabels: 3 (0010 architecture.document, 0018 updater, 0018 automerge)
- Citations with no label: 9 group-2 rows with no citation (0002 overrides, 0011 forge.gate, 0012 environments, 0012 registry, 0015 storage, 0017 agent.hosts, 0020 approver, 0022 approvals, 0024 fail_on); group-1 rows: 0
- Rows with false evidence/count: 0
- Heading counts not matching: 0
