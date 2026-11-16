# Score, run 12, sindresorhus__execa

Clone facts checked: 918 commits, 2 merge commits, 70 `v*` tags, 476 tracked `.js` files, 163 tracked `.ts` files (34 `.d.ts`, the rest under `types/` and `test-d/`), tracked `.github/` holds only `codecov.yml`, `security.md`, `workflows/main.yml`; no `openspec/`, `dependabot.yml`, renovate, `mise.toml`, `aqua.yaml`, `docs/architecture/`, `.c4`, mermaid fenced block, UI dependency; `package.json` `"license": "MIT"` (HEAD) and `license` file opens "MIT License"; `c8` block has reporters and excludes only; `codecov.yml` holds only `after_n_builds: 6`; 0 bot-authored commits.

## Survey A
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0016 | changes.framework | A1 | yes | `git ls-files openspec` empty; no openspec in package.json | no | yes | an openspec dir would be tracked |
| 0016 | changes.schema | A1 | yes | same | no | yes | follows framework none |
| 0023 | license.spdx | S | yes | package.json `"license": "MIT"`; `license` file | no | yes | |
| 0025 | tools.manager | A1 | yes | no mise.toml/aqua.yaml/script tracked; main.yml installs only via npm | no | yes | ADR-0001 is the only accepted ADR |

## Survey B
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0004 | languages.main.name | T | yes | `git ls-files '*.js'` = 476, `'*.ts'` = 163 (all under index.d.ts, types/, test-d/) | no | yes | one main language, JavaScript, with TypeScript declaration files |
| 0010 | architecture.document | A1 | yes | `git ls-files docs/architecture` = 0 | no | yes | |
| 0010 | architecture.model | A1 | yes | no `.c4`/`.likec4` tracked | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | no mermaid/plantuml outside docs/adr (untracked ADR text only) | no | yes | |
| 0013 | frontend.framework | A1 | yes | no html/css/jsx/vue/astro tracked; no UI dependency | no | yes | `none` is not an offered value of the ADR (rule `rejected` instead); the absence itself is traceable |
| 0016 | changes.framework | A1 | yes | no openspec | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0023 | license.spdx | S | yes | package.json, `license` | no | yes | |
| 0025 | tools.manager | A1 | yes | none tracked | no | yes | |

## Survey C
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0007 | tests.coverage_target | A2 | partly | package.json c8 block has no check-coverage; codecov.yml has no target | no | yes | a Codecov project setting (service UI) can hold a target with no file; the repo uploads to Codecov (main.yml, readme badge). The survey itself warns of this |
| 0010 | architecture.document | A1 | yes | no docs/architecture | no | yes | |
| 0010 | architecture.model | A1 | yes | no c4 | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | no mermaid | no | yes | |
| 0013 | frontend.framework | A1 | yes | no UI dep | no | yes | `none` not an ADR value |
| 0016 | changes.framework | A1 | yes | no openspec | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A1 | yes | no dependabot.yml/renovate config; 0 bot-authored commits | no | yes | a Renovate app or Dependabot security updates could run with no file, but would leave bot commits; history shows none |
| 0018 | dependencies.automerge | A1 | yes | no updater, no fetch-metadata workflow | no | yes | |
| 0023 | license.spdx | S | yes | package.json, `license` | no | yes | |
| 0024 | code_scanning.tool | A2 | no | no codeql/semgrep step in main.yml | no | yes | GitHub default setup leaves no file (the ADR says so); survey admits it |
| 0024 | code_scanning.fail_on | O | no | none in the clone | no | yes | the threshold is held by a GitHub ruleset ("Require code scanning results") |
| 0025 | tools.manager | A1 | yes | none tracked | no | yes | |

## Survey D
| ADR | key | class | visible | where | agent said unseen | evidence true | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0010 | architecture.document | A1 | yes | `git ls-files docs/architecture` = 0 | no | yes | |
| 0010 | architecture.model | A1 | yes | no `.c4` | no | yes | |
| 0010 | architecture.diagrams | A1 | yes | no fenced mermaid block in any `*.md` (verified 0 in tracked and in docs/) | no | yes | |
| 0013 | frontend.framework | A1 | yes | no UI dep; `files` ships index.js, lib, types | no | yes | `none` not an ADR value |
| 0016 | changes.framework | A1 | yes | no openspec | no | yes | |
| 0016 | changes.schema | A1 | yes | same | no | yes | |
| 0018 | dependencies.updater | A1 | yes | no dependabot.yml/renovate; 0 bot commits | no | yes | same caveat as in C |
| 0018 | dependencies.automerge | A1 | yes | main.yml has no fetch-metadata | no | yes | |
| 0023 | license.spdx | S | yes | package.json, `license` | no | yes | |
| 0025 | tools.manager | A1 | yes | none tracked | no | yes | |

## Counts

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| group 1 / group 2 (of 25) | 3 / 22 | 6 / 19 | 8 / 17 | 6 / 19 |
| failing group-1 ADRs | 0 | 0 | 1 | 0 |
| doubtful group-1 ADRs | 0 | 0 | 2 | 0 |
| other group-1 ADRs | 3 | 6 | 6 | 6 |
| lowest-numbered ADR in group 1 | 0016 | 0004 | 0007 | 0010 |
| ADR-0004 in group 1 | no (group 2; one main language, JavaScript 476 files, the 163 `.ts` are declarations and type tests) | yes | no (group 2; same, one main language) | no (group 2; same) |
| mislabels (`shows the value` that only shows something next to it) | 0 | 0 | 2 | 0 |
| citations with no label | 1 | 0 | 5 | 4 |
| group-1 rows with false evidence or false count | 0 | 0 | 0 | 0 |
| headings whose count does not match the list | 0 | 0 | 0 | 0 |

- Failing: A none; B none; C 0024 (fail_on is a forge ruleset); D none.
- Doubtful: A none; B none; C 0007 (coverage_target, Codecov service setting) and 0024; D none.
- Unlabelled citations: A 0017; C 0002 comments, 0009 prefixes, 0020 approver, 0022 by, 0022 approvals; D 0009 prefixes, 0020 approver, 0022 approvals, 0026 identity.
- Mislabels in C: 0007 tests.coverage_target, 0024 code_scanning.fail_on.
- Outside the group-1 rows, one false count in a group-2 row: A, ADR-0009, says the history has 0 merge commits; the clone has 2. All other counts checked in B, C, D group-2 rows (918, 2 merges, 70 tags, 110 lib files, 28 co-authored trailers, 594/223 commits, 0 bot commits, 22 docs md) are true.
- Documents describing forge-held values: none of the group-1 values is forge-held except C's 0024 fail_on; the ADR text itself (untracked docs/adr) describes the ruleset.
