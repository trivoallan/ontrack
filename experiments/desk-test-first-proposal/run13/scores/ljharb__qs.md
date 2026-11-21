# Scoring ljharb__qs

## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| ADR-0004 | languages.main.name | T | yes | `git ls-files '*.js' '*.mjs'` (11 files), `*.ts` = 0, package.json main lib/index.js | no | yes | one main language (JavaScript); 11 count verified |
| ADR-0013 | frontend.framework | A1 | yes | `git ls-files` html/jsx/tsx/vue/svelte/css = 0; package.json deps only es-define-property, side-channel | no | yes | a frontend would leave files or dependencies |
| ADR-0016 | changes.framework | A1 | yes | no openspec/ dir, no dependency | no | yes | |
| ADR-0016 | changes.schema | A1 | yes | no openspec/config.yaml or schemas | no | yes | follows framework none |
| ADR-0023 | license.spdx | S | yes | package.json line 85, LICENSE.md line 1 | no | yes | |
| ADR-0025 | tools.manager | A1 | yes | no mise.toml, aqua.yaml, .tool-versions in `git ls-files`; no install script | no | yes | clone shows no tool used outside the package manager |

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| ADR-0016 | changes.framework | A1 | yes | no openspec file/dir/mention in tracked files | no | yes | |
| ADR-0016 | changes.schema | A1 | yes | same search | no | yes | follows framework none |
| ADR-0023 | license.spdx | S | yes | package.json line 85, LICENSE.md line 1 | no | yes | |
| ADR-0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml; `git ls-files '*.sh' '*.ts' '*.py'` = 0 | no | yes | |

## Counts

| | A | B |
|---|---|---|
| Group 1 / Group 2 (of 25) | 5 / 20 | 3 / 22 |
| Failing group-1 ADRs | 0 | 0 |
| Doubtful group-1 ADRs | 0 | 0 |
| Other group-1 ADRs | 5 | 3 |
| Lowest-numbered ADR in group 1 | ADR-0004 | ADR-0016 |
| ADR-0004 in group 1? | yes | no (group 2; clone has one main language, JavaScript: 10 .js + 1 .mjs, 0 .ts/.py/.sh) |
| Mislabelled citations | 0 | 0 |
| Citations with no label | 0 | 0 (8 group-2 rows say "None" instead of a citation: 0002 x4 keys, 0011 gate, 0015 storage, 0018 automerge, 0020 approver, 0022 approvals, 0024 fail_on, 0026 identity; these are not citations) |
| Rows with false evidence/count | 0 | 0 |
| Headings with wrong count | 0 | 0 |

Failing: A none; B none. Doubtful: A none; B none.

Verified counts (group 2 too, checked incidentally): 1109 commits, 0 conventional, 692 start with `[`, 57 merges, 696 commits by Jordan Harband, 139 subjects with #NNN, 6 workflows, AGENTS.md and docs/ untracked, package.json modified, .nycrc check-coverage false / lines 86, .npmrc package-lock=false.
