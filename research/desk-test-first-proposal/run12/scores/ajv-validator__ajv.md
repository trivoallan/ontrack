# Scores, ajv-validator__ajv, run 12

## Survey A

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | `git ls-files '*.ts'` 192 vs 13 `.js`; lib/ 106 `.ts` + 19 `.json`; tsconfig.json include lib | no | yes |  |
| 0010 | architecture.document | A1 | yes | no docs/architecture, no .c4/.likec4, no mermaid/plantuml/arc42 text outside docs/adr; only svg/png are site branding | no | yes | none holds; docs/components.md lists code components (not arc42), not counted as a document |
| 0010 | architecture.model | A1 | yes | 0 `.c4/.likec4/.puml` files in `git ls-files` (count 0 true) | no | yes |  |
| 0010 | architecture.diagrams | A1 | yes | no docs/architecture, no .c4/.likec4, no mermaid/plantuml/arc42 text outside docs/adr; only svg/png are site branding | no | yes | grep was text only; no diagram images of architecture exist either |
| 0014 | tracking.tool | S | yes | package.json:58 bugs URL; CONTRIBUTING.md:51 issues/new link | no | yes |  |
| 0014 | tracking.project | S | yes | package.json:45 repository | no | yes |  |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0016 | changes.schema | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes | follows framework none |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml (npm, daily) | no | yes |  |
| 0018 | dependencies.automerge | A1 | yes | no automerge workflow in build.yml/publish.yml; no fetch-metadata/gh pr merge | no | yes | trace: automerge on Dependabot PRs needs a workflow; native auto-merge clicked per PR would leave no file, so A1 not A2 by the ADR's own definition |
| 0023 | license.spdx | S | yes | package.json:57 license MIT; LICENSE text MIT | no | yes |  |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/.tool-versions; scripts use curl/rsync/git unpinned (system tools) | no | yes | none holds; unpinned system tools exist in scripts but no manager/pinned script |

## Survey B

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | `git ls-files '*.ts'` 192 vs 13 `.js`; lib/ 106 `.ts` + 19 `.json`; tsconfig.json include lib | no | yes | 192/13 counts true |
| 0014 | tracking.tool | S | yes | package.json:58 bugs URL; 5 files in .github/ISSUE_TEMPLATE (true) | no | yes |  |
| 0014 | tracking.project | S | yes | package.json:45 repository; `git remote -v` origin ajv-validator/ajv.git (true) | no | yes |  |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0016 | changes.schema | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0018 | dependencies.updater | S | yes | .github/dependabot.yml (npm, daily) | no | yes |  |
| 0018 | dependencies.automerge | A1 | yes | no automerge workflow in build.yml/publish.yml; no fetch-metadata/gh pr merge | no | yes | trace: automerge on Dependabot PRs needs a workflow; native auto-merge clicked per PR would leave no file, so A1 not A2 by the ADR's own definition |
| 0023 | license.spdx | S | yes | package.json:57 license MIT; LICENSE text MIT (lines 57 true) | no | yes |  |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/.tool-versions; scripts use curl/rsync/git unpinned (system tools) | no | yes | none holds; unpinned system tools exist in scripts but no manager/pinned script |

## Survey C

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | `git ls-files '*.ts'` 192 vs 13 `.js`; lib/ 106 `.ts` + 19 `.json`; tsconfig.json include lib | no | yes | 'every source file under lib/ is .ts' true for source; 19 .json data files also in lib/ |
| 0014 | tracking.tool | S | yes | package.json:58 bugs URL; ISSUE_TEMPLATE exists | no | yes |  |
| 0014 | tracking.project | S | yes | package.json:45 repository; origin remote same | no | yes |  |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0016 | changes.schema | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0023 | license.spdx | S | yes | package.json:57 license MIT; LICENSE text MIT | no | yes |  |

## Survey D

| ADR | key | class | visible | where | agent said unseen | evidence true | note |
|---|---|---|---|---|---|---|---|
| 0004 | languages.main.name | T | yes | `git ls-files '*.ts'` 192 vs 13 `.js`; lib/ 106 `.ts` + 19 `.json`; tsconfig.json include lib | no | yes | 106 and 19 true |
| 0014 | tracking.tool | S | yes | package.json:58 bugs URL | no | yes |  |
| 0014 | tracking.project | S | yes | package.json:45 repository | no | yes |  |
| 0016 | changes.framework | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty; no .openspec | no | yes |  |
| 0016 | changes.schema | A1 | yes | no openspec/ dir, `git ls-files|grep -i openspec` empty | no | yes |  |
| 0023 | license.spdx | S | yes | package.json:57 license MIT; LICENSE text MIT | no | yes |  |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/.tool-versions; scripts use curl/rsync/git unpinned (system tools); get-ajv-packages:19 is the only curl (true) | no | partly false | 'Both workflows use only actions and npm' is false: workflows run `git submodule update`, and scripts/publish-site uses rsync and git; none holds anyway |

## Counts

| | A | B | C | D |
|---|---|---|---|---|
| group 1 / group 2 (of 25) | 7 / 18 | 6 / 19 | 4 / 21 | 5 / 20 |
| failing group-1 ADRs | 0 | 0 | 0 | 0 |
| doubtful group-1 ADRs | 0 | 0 | 0 | 0 |
| other group-1 ADRs | 7 | 6 | 4 | 5 |
| lowest-numbered group-1 ADR | 0004 | 0004 | 0004 | 0004 |
| ADR-0004 in group 1 | yes | yes | yes | yes |
| mislabels | 0 | 0 | 0 | 0 |
| unlabelled citations | 5 | 1 | 0 | 8 |
| rows with false evidence or count | 0 | 0 | 0 | 1 (0025) |
| group headings with wrong count | 0 | 0 | 0 | 0 |

Failing: none in A, B, C, D. Doubtful: none in A, B, C, D (no key classed A2 or O; every group-1 key is S, T or A1).

Notes:
- Group-1 ADRs: A 0004, 0010, 0014, 0016, 0018, 0023, 0025. B 0004, 0014, 0016, 0018, 0023, 0025. C 0004, 0014, 0016, 0023. D 0004, 0014, 0016, 0023, 0025.
- Unlabelled citation method: evidence without a label in group-2 rows plus preamble, caveat or closing lists. A: row 0017, the "Some values are shown" paragraph, two flag bullets (commits.tool husky, ADR-0008 vuepress), one caveat (0018 cooldown). B: the ADR-0008 vuepress bullet. C: none (group 1 labelled by the column header). D: row 0017 plus seven preamble bullets (0006, 0011, 0012, 0015, 0018, 0019, 0020).
- Group-2 counts spot-checked and true: A 77/43/149 of 300, 106 .ts; B 192/13, 26 build(deps-dev) in 200, 4 merges in 100, 41 .vue; D 29 build(deps-dev) in 300. B's "884 of 2721" Conventional subjects not reproduced (my regex gave 1012); group 2, not scored.
- Forge-held values documented in the clone: none relevant to group 1.
- Judgement calls: 0018 automerge none classed A1 (see row note); 0010 none classed A1 despite docs/components.md; 0025 none classed A1 despite unpinned curl/rsync in scripts.
