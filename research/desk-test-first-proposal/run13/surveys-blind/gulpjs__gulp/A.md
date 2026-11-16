I'll start the survey by reading the ADRs and the repository's state, writing nothing.
---
Extracting each ADR's `traits:` keys so I can match them against the repository.
---
I'm still on the survey. I have the trait keys for all 25 ADRs and am now collecting repository evidence for each one.
---
I haven't written anything yet. This is the survey, and it needs your answer on the order.

## First group: 5 ADRs
Every value in these has a `shows the value` citation.

| ADR | Key | Value | Citation |
|---|---|---|---|
| ADR-0004 | `languages.main.name` | JavaScript | `shows the value`: `git ls-files '*.js' '*.mjs' '*.ts'` lists 8 files (6 `.js`, 2 `.mjs`) and no `.ts`. |
| ADR-0013 | `frontend.framework` | none installed. ADR-0013 line 40 says a library or CLI rules it `rejected`, so I expect to propose that. | `shows the value`: `package.json` lists no frontend framework in `dependencies` or `devDependencies`, and `git ls-files` has no HTML, JSX or Vue files. |
| ADR-0016 | `changes.framework` | none | `shows the value`: `git ls-files 'openspec/*'` returns nothing. |
| ADR-0016 | `changes.schema` | none | `shows the value`: same command. ADR-0016 pairs `none` with `framework: none`. |
| ADR-0023 | `license.spdx` | MIT | `shows the value`: `"license": "MIT"` in `package.json`; `LICENSE` opens with "The MIT License (MIT)". |
| ADR-0025 | `tools.manager` | none | `shows the value`: `git ls-files` for `mise.toml`, `aqua.yaml`, `.tool-versions` or an install script returns nothing. Both workflows install only through actions and `npm install`. |

## Second group: 20 ADRs
One row per value I could not show. I left out the values I could show: they are listed after the table.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 | `language.default` | A convention contributors follow. | `next to it`: README, docs and commit subjects are in English. |
| 0002 | `documentation`, `commits`, `code`, `comments` | Same convention (four overrides, empty means "same as default"). | `next to it`: same files. |
| 0003 | `architecture.pattern` | A choice people make. | `next to it`: CONTRIBUTING.md says "Gulp itself is tiny" and delegates to undertaker, vinyl-fs and glob-watcher. |
| 0005 | `validation.boundary` | Code, plus a choice people make. | `next to it`: `package.json` has no validation library. `none` is wrong, because ADR-0005 reserves it for a repository that reads no data at run time and gulp does. |
| 0006 | `commits.scopes` | Commit history. | `next to it`: `git log -n 300` has 15 subjects in `type(scope):` form, and the only scope is `chore(docs)`. |
| 0007 | `tests.coverage_target` | Possibly a Coveralls setting, outside the repository. | `next to it`: the `nyc` block in `package.json` sets reporters only, no threshold. `dev.yml` has Coveralls steps. |
| 0008 | `docs.audience` | A choice people make. | `next to it`: the public repository `gulpjs/gulp` and `"homepage": "https://gulpjs.com"`. |
| 0009 | `branching.model` | A choice people make. | `next to it`: `dev.yml` runs on `pull_request` and on pushes to `master`. |
| 0009 | `branching.merge` | A forge setting. | `next to it`: `git log -n 200` has 65 subjects ending in `(#NNN)`, and `git log --merges` finds 272 merge commits. |
| 0009 | `branching.prefixes` | A choice people make. | `next to it`: only the history above. |
| 0010 | `architecture.document` | A doc kept elsewhere would leave no trace here. | `next to it`: `git ls-files 'docs/architecture/*'` returns nothing. |
| 0011 | `forge.gate` | A forge ruleset. | `next to it`: `dev.yml` runs lint and tests on `pull_request`. |
| 0012 | `delivery.target` | Registry and publish practice, outside the repository. | `next to it`: `package.json` `files` and `bin`. No publish step in `release.yml`. |
| 0012 | `delivery.environments` | People ("asked, never guessed"). | `next to it`: no deploy job in either workflow. |
| 0012 | `delivery.release_notes` | A choice people make. | `next to it`: `CHANGELOG.md` is tracked. |
| 0014 | `tracking.tool` | A forge setting (issues enabled). | `next to it`: `origin` is `github.com/gulpjs/gulp`. |
| 0015 | `secrets.storage` | Where contributors keep secrets while they work. | `next to it`: workflows reference only `secrets.GITHUB_TOKEN`. |
| 0017 | `agent.hosts` | Which agents contributors use. | `next to it`: no `.claude/` or similar settings in the tree. |
| 0018 | `dependencies.updater` | A GitHub or app setting. | `next to it`: no `dependabot.yml` or `renovate.json` (`git ls-files` returns nothing). |
| 0018 | `dependencies.automerge` | The updater's configuration, outside the repository. | unknown |
| 0019 | `vulnerabilities.scanner` | A GitHub setting such as Dependabot alerts, which leaves no file. | `next to it`: no scanner step in either workflow. |
| 0019 | `vulnerabilities.fail_on` | A forge ruleset. | none |
| 0020 | `admission.approver` | A practice people follow. | none |
| 0021 | `supply_chain.build_level` | The registry and GitHub attestations. | `next to it`: no attest or `--provenance` step in `release.yml`. |
| 0022 | `review.by` | A forge ruleset. | none |
| 0022 | `review.approvals` | A forge ruleset. | none |
| 0024 | `code_scanning.tool` | CodeQL default setup is a forge setting and leaves no file. | `next to it`: no CodeQL workflow. |
| 0024 | `code_scanning.fail_on` | A forge ruleset. | none |
| 0026 | `agent.identity` | The GitHub account the agent uses. | none |

Values I could show in second-group ADRs, so they have no row:
- **0005** `data_files`: `none`. Neither `$schema` nor `yaml-language-server` appears outside `docs/adr`.
- **0006** `tool`: `none`. There is no commitlint, no hook config and an empty `.git/hooks`.
- **0008** `tool`: `none` (no site generator config). `root`: `docs/`. `channels`: absent when the tool is `none`.
- **0010** `model` and `diagrams`: `none`. There are no `.c4` files and no mermaid or plantuml blocks.
- **0011** `audit`: `none`. No workflow runs an audit tool.
- **0012** `release_tool`: `release-please`, from `release.yml`. `registry` and `deployment.manifests`: `none`, with no Dockerfile or manifests.
- **0014** `project`: `gulpjs/gulp`, from `"repository"` in `package.json`.
- **0015** `guard`: `none`. No gitleaks config or pre-commit hook.
- **0019** `sbom`: `none`.
- **0020** `install_scripts`: `allowed`. `.npmrc` holds only `package-lock=false`, and `dev.yml` runs a plain `npm install`.

**Proposed order:** the first group (0004, 0013, 0016, 0023, 0025), then the second group in ADR number order (0002, 0003, 0005 through 0012, 0014, 0015, 0017 through 0022, 0024, 0026). Do you agree, or would you prefer another order?
