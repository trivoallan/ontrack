I'll start the survey by reading all the ADRs and inspecting the repository.
---
I've read all 25 ADRs. Next I'm collecting repository evidence (CI, renovate, contributing guide, history, file tree) for the survey.
---
Evidence is mostly in. I'm checking the 8 lockfile hits, since they may be a framework or a tool, before I write the survey.
---
I've written nothing to any ADR. Seven of the 25 ADRs can be checked against this repository. The other 18 depend on a forge setting, a registry or a choice people make.

I used `git ls-files | wc -l`, `git ls-files | grep -c '\.js$'`, `git rev-list --count --merges HEAD~100..HEAD` and `git log -100 --format=%s | grep -cE '<conventional prefix>'` for the counts. Everything else I read directly from files.

## Group 1: every value is shown by this repository (7 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 Languages | `languages.main.name` | JavaScript | `shows the value`: 282 of 324 tracked files end in `.js`, and only 1 is `.ts` (`tools/terser.d.ts`). `package.json` has `"type": "module"`. |
| 0007 Tests | `tests.coverage_target` | none | `shows the value`: no c8, nyc, istanbul or coverage match in `package.json`, `CONTRIBUTING.md`, `README.md` or `.github/`. The CI test steps run no coverage. |
| 0010 Architecture documentation | `architecture.document` | none | `shows the value`: no `docs/architecture/` and no arc42 files. "architecture" appears in none of `README.md`, `CONTRIBUTING.md` or `RECIPES.md`. |
| 0010 | `architecture.model` | none | `shows the value`: no tracked `.c4` or `.likec4` file. |
| 0010 | `architecture.diagrams` | none | `shows the value`: no mermaid or plantuml in `README.md`, `CONTRIBUTING.md`, `RECIPES.md` or `tools/props.html`. |
| 0013 Frontend | `frontend.framework` | none, so the ruling would be `rejected` | `shows the value`: no react, vue, svelte, astro or angular in `package.json` or `tools/props.html`. Dependencies are acorn, commander, source-map and similar. |
| 0016 Changes | `changes.framework` | none | `shows the value`: no `openspec/` directory at the root, so no `openspec/config.yaml`. |
| 0016 | `changes.schema` | none | `shows the value`: same absence. |
| 0023 License | `license.spdx` | BSD-2-Clause | `shows the value`: `package.json` has `"license": "BSD-2-Clause"`, and `LICENSE` holds the BSD two-clause terms. |
| 0025 Tools | `tools.manager` | none | `shows the value`: no `mise.toml`, `aqua.yaml` or `.tool-versions`. No accepted ADR names a tool yet. |

## Group 2: at least one value is held outside this repository or inferred (18 ADRs)

I list only the values I could not show.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 Localization | `default` | A convention among contributors | `next to it`: `README.md` and `CONTRIBUTING.md` are in English. |
| 0002 | `documentation`, `commits`, `code`, `comments` (overrides) | A convention among contributors | `next to it`: English commit subjects, English `snake_case` identifiers in `lib/`. |
| 0003 Architecture | `architecture.pattern` | A choice, read from code | `next to it`: `lib/` is a flat set of compiler-pass modules (parse, scope, compress, output). No document states a pattern. |
| 0005 Validation | `validation.boundary` | Code in `lib/`, not read in this survey | `next to it`: no validation library in `package.json` dependencies. Their `ajv` appears only as a transitive entry in `package-lock.json`. |
| 0006 Commits | `commits.scopes` | A choice | `next to it`: 5 of the last 100 commit subjects have a conventional prefix, and 1 has a scope. |
| 0008 Documentation | `docs.root` | A choice | `next to it`: user docs are `README.md` and `RECIPES.md` at the root. `docs/` is untracked and holds only the ADRs. |
| 0008 | `docs.audience` | A choice | `next to it`: the repository is public at github.com/terser/terser. |
| 0009 Branching | `branching.model` | A practice | `next to it`: 0 merge commits among the last 100 commits. |
| 0009 | `branching.merge` | A GitHub repository setting | `next to it`: 14 of the last 100 subjects end in `(#N)`, which looks like squash or rebase merges. |
| 0009 | `branching.prefixes` | A practice | `next to it`: 68 non-bot remote branches, named `builtins`, `class-unused` and so on, with no `feat/` or `fix/` form. |
| 0011 Forge and CI | `forge.gate` | A GitHub ruleset, outside the repository | `next to it`: `.github/workflows/ci.yml` runs on pull requests to `master`. Nothing in it says whether it is required. |
| 0012 Delivery | `delivery.target` | npm registry and maintainers | `next to it`: `package.json` is not private and has `files`, `bin` and `exports`. |
| 0012 | `delivery.environments` | Maintainers' practice and the npm registry | `next to it`: one `v*` tag per release, newest `v5.51.2`. No publish workflow exists. |
| 0012 | `delivery.release_notes` | GitHub releases | `next to it`: `CHANGELOG.md` is updated by hand (`postversion` script, "update changelog" commits). |
| 0014 Work tracking | `tracking.tool` | A practice | `next to it`: `.github/ISSUE_TEMPLATE.md` exists. `CONTRIBUTING.md` says "issue, email, or any other method". If the answer is `github-issues`, `tracking.project` would be `terser/terser`, from `"repository"` in `package.json`. |
| 0015 Secrets | `secrets.storage` | Maintainers' machines (the npm publish token) | `next to it`: no `.env` or `.envrc` in the repository, and `ci.yml` uses no secret. |
| 0017 Agent tooling | `agent.hosts` | Which agents contributors use | `next to it`: no `.claude/` or `opencode.json`. |
| 0018 Dependencies | `dependencies.automerge` | The `config:base` preset, held by Renovate | `next to it`: `renovate.json` extends `config:base` and has no `automerge` key. `updater` is shown as `renovate` by that file. |
| 0019 Vulnerabilities | `vulnerabilities.scanner` | GitHub settings (Dependabot alerts leave no file) | `next to it`: `ci.yml` is the only workflow, and it runs no scan. |
| 0019 | `vulnerabilities.sbom` | The GitHub release or registry | `next to it`: no release workflow exists. |
| 0019 | `vulnerabilities.fail_on` | A GitHub ruleset | `next to it`: no scan job and no `.grype.yaml`. |
| 0020 Adding a dependency | `admission.approver` | A choice | `next to it`: `CONTRIBUTING.md` asks contributors to discuss changes with the owners first. |
| 0020 | `admission.install_scripts` | npm version and settings on each machine | `next to it`: no `.npmrc` and no `allowScripts`. `ci.yml` runs plain `npm ci` on Node 10 to 24. |
| 0021 Build provenance | `supply_chain.build_level` | The npm registry | `next to it`: no attestation, `--provenance` or release workflow in the repository. |
| 0022 Review and merge | `review.by`, `review.approvals` | A GitHub ruleset | `next to it`: no `CODEOWNERS` and no deny entries, because there is no `.claude/settings.json`. |
| 0024 Code scanning | `code_scanning.tool` | GitHub default setup, which no file records | `next to it`: no CodeQL workflow. |
| 0024 | `code_scanning.fail_on` | A GitHub ruleset | `next to it`: same absence. |
| 0026 Agent identity | `agent.identity` | GitHub credentials on the maintainer's machine | `next to it`: nothing in the repository records it. |

## Proposed order

1. **Group 1:** 0004, 0007, 0010, 0013, 0016, 0023, 0025.
2. **Group 2:** 0002, 0003, 0005, 0006, 0008, 0011, 0012, 0018, 0009, 0014, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

Group 2 is mostly in number order, with these exceptions:
- 0009 comes after 0012 and 0018, because its branch-name check only lets bot branches through once those two are ruled.
- 0022 comes after 0017, and 0026 comes after 0022.

I couldn't open a question dialog in this session. Do you agree with this order, or do you want another? Reply "agree", or give me the order you want.
