## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| ADR-0004 | languages.main.name | T | yes | git ls-files '*.ts' = 10 of 13 .ts/.js/.mjs; tsconfig.json; typescript in devDependencies | no | yes | count true (10 ts, 3 js/mjs) |
| ADR-0007 | tests.coverage_target | A2 | partly | no coverage script/dependency/CI step; only /coverage/ in .gitignore (line 3) | no | yes (absence of tool true) | A target is a number held as a norm in review; it could exist with no file. Tool absence is next to it. |
| ADR-0010 | architecture.document | S | yes | docs/architecture.md tracked; no docs/architecture/arc42/ | no | yes |  |
| ADR-0010 | architecture.model | A1 | yes | git ls-files: no .c4/.likec4 | no | yes | a likec4 model would be files |
| ADR-0010 | architecture.diagrams | A1 | yes | no mermaid/plantuml in any tracked .md; one plain text block in docs/architecture.md | no | yes |  |
| ADR-0013 | frontend.framework | A1 | yes | package.json: only dependency readdirp; no html/css/tsx/vue/svelte/astro tracked | no | yes |  |
| ADR-0014 | tracking.tool | S | yes | package.json bugs.url (line 46-47); .github/ISSUE_TEMPLATE/bug_report.md | no | yes |  |
| ADR-0014 | tracking.project | S | yes | package.json repository.url line 44; git remote -v | no | yes |  |
| ADR-0016 | changes.framework | A1 | yes | no openspec/ directory tracked | no | yes |  |
| ADR-0016 | changes.schema | A1 | yes | same absence | no | yes | A infers it from framework: none; B says same absence |
| ADR-0023 | license.spdx | S | yes | package.json line 49 license MIT; LICENSE opens 'The MIT License (MIT)' | no | yes |  |
| ADR-0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/install script tracked; scripts/ holds only test-vms.mjs | no | yes | docs/vm-testing.md asks to install gh by hand; no pinned tool manager |

Counts (identical group-1 set and identical class per key in both surveys):
- Group 1 / group 2: 8 / 17
- Failing group-1 ADRs: 0 (none)
- Doubtful group-1 ADRs: 1 (ADR-0007, key coverage_target classed A2)
- Other group-1 ADRs: 7 (0004, 0010, 0013, 0014, 0016, 0023, 0025)
- Lowest-numbered ADR in group 1: ADR-0004
- ADR-0004 in group 1: yes
- Mislabels: 1 (ADR-0007 row labelled `shows the value`, shows only no tool)
- Citations with no label: 0 (group-2 rows for admission.approver / review.approvals in A, and admission.approver in B, give no citation at all)
- Rows with false evidence or count: 0
- Heading counts not matching: 0

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| ADR-0004 | languages.main.name | T | yes | git ls-files '*.ts' = 10 of 13 .ts/.js/.mjs; tsconfig.json; typescript in devDependencies | no | yes | count true (10 ts, 3 js/mjs) |
| ADR-0007 | tests.coverage_target | A2 | partly | no coverage script/dependency/CI step; only /coverage/ in .gitignore (line 3) | no | yes (absence of tool true) | A target is a number held as a norm in review; it could exist with no file. Tool absence is next to it. |
| ADR-0010 | architecture.document | S | yes | docs/architecture.md tracked; no docs/architecture/arc42/ | no | yes |  |
| ADR-0010 | architecture.model | A1 | yes | git ls-files: no .c4/.likec4 | no | yes | a likec4 model would be files |
| ADR-0010 | architecture.diagrams | A1 | yes | no mermaid/plantuml in any tracked .md; one plain text block in docs/architecture.md | no | yes |  |
| ADR-0013 | frontend.framework | A1 | yes | package.json: only dependency readdirp; no html/css/tsx/vue/svelte/astro tracked | no | yes |  |
| ADR-0014 | tracking.tool | S | yes | package.json bugs.url (line 46-47); .github/ISSUE_TEMPLATE/bug_report.md | no | yes |  |
| ADR-0014 | tracking.project | S | yes | package.json repository.url line 44; git remote -v | no | yes |  |
| ADR-0016 | changes.framework | A1 | yes | no openspec/ directory tracked | no | yes |  |
| ADR-0016 | changes.schema | A1 | yes | same absence | no | yes | A infers it from framework: none; B says same absence |
| ADR-0023 | license.spdx | S | yes | package.json line 49 license MIT; LICENSE opens 'The MIT License (MIT)' | no | yes |  |
| ADR-0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/install script tracked; scripts/ holds only test-vms.mjs | no | yes | docs/vm-testing.md asks to install gh by hand; no pinned tool manager |

Counts (identical group-1 set and identical class per key in both surveys):
- Group 1 / group 2: 8 / 17
- Failing group-1 ADRs: 0 (none)
- Doubtful group-1 ADRs: 1 (ADR-0007, key coverage_target classed A2)
- Other group-1 ADRs: 7 (0004, 0010, 0013, 0014, 0016, 0023, 0025)
- Lowest-numbered ADR in group 1: ADR-0004
- ADR-0004 in group 1: yes
- Mislabels: 1 (ADR-0007 row labelled `shows the value`, shows only no tool)
- Citations with no label: 0 (group-2 rows for admission.approver / review.approvals in A, and admission.approver in B, give no citation at all)
- Rows with false evidence or count: 0
- Heading counts not matching: 0
