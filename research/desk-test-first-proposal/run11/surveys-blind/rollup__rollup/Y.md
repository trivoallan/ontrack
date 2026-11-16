I'll start with the survey: read every ADR and inspect the repository, writing nothing.
---
Output was truncated, and my working directory moved. I'll go back to the repo root and pull each ADR's trait keys first.
---
I'm surveying: I've got every ADR's trait keys and now need to check the repo for evidence.
---
Still surveying: checking the remaining trait details I haven't seen (ADR-0004, 0012, 0017) before I present the grouping.
---
Last check before I present the survey: the Renovate configuration, since Renovate commits dominate the history.
---
I've done the survey and written nothing. Two caveats first:

- I've read all 25 ADRs' trait keys, and ADR-0004 in full.
- I've seen only parts of the others. Each gets a full read when its turn comes, and a placement below may change then, for example if an ADR's allowed values differ from what I assumed.

## Group 1: the repository already answers every value

| ADR | Value | Citation | Shows |
|---|---|---|---|
| 0023 License | `license.spdx` = `MIT` | `package.json:112` has `"license": "MIT"`, and `LICENSE.md` opens "Rollup is released under the MIT license" | The value itself |
| 0014 Work tracking | `tracking.tool` = `github-issues` | `AGENTS.md` section "GitHub Issues and Pull Requests", and `.github/ISSUE_TEMPLATE/*.yaml` | The value itself |
| | `tracking.project` = `rollup/rollup` | `git remote -v` gives `https://github.com/rollup/rollup.git` | The value itself. If you work from a fork, the project may be yours, so please confirm. |

## Group 2: everything else

For each ADR, the first line names what the repository shows. The second says whether that is the value itself or only something next to it.

- **0002 Localization** (`default`, `documentation`, `commits`, `code`, `comments`):
  - The sources, docs and history are all in English, but no file states it.
  - Inferred, so only next to the value.
- **0003 Architecture** (`pattern`): `ARCHITECTURE.md` describes the compiler, but I haven't found a named pattern. Next to the value.
- **0004 Languages** (`main.name`):
  - `src/**/*.ts`, `tsconfig`, and `AGENTS.md` ("TypeScript + Rust hybrid") show both languages.
  - Nothing says which one is main. Next to the value.
- **0005 Validation** (`boundary`, `data_files`): `package.json` has no zod, ajv or similar. Absent.
- **0006 Commits** (`scopes`, `tool`):
  - There is no commitlint config.
  - `AGENTS.md` says "no specific prescribed format".
  - History is mixed: some subjects carry `docs:`-style prefixes and most don't. Inferred from history alone.
- **0007 Tests** (`coverage_target`):
  - `.nycrc` has no threshold.
  - CI uploads to codecov (`build-and-tests.yml:647`), but I found no `codecov.yml`.
  - The target number is held outside the repository, or doesn't exist. Next to the value.
- **0008 Documentation** (`tool`, `root`, `audience`, `channels`):
  - `tool` and `root` are shown by `vitepress` in `package.json` and by `docs/`. That is the value itself.
  - `audience` and `channels` are only next to it: the `release:docs` script pushes a `documentation-published` branch.
- **0009 Branching** (`model`, `merge`, `prefixes`):
  - `master` is the trunk, and 239 of the last 300 subjects end in `(#NNNN)`, which suggests squash merges.
  - The merge setting lives in GitHub settings, outside the repository.
  - Remote branches carry no prefixes. Inferred from history alone.
- **0010 Architecture documentation** (`document`, `model`, `diagrams`): `ARCHITECTURE.md` exists and `docs/AGENTS.md` mentions mermaid diagrams. The format and model aren't named. Next to the value.
- **0011 Forge and CI** (`gate`, `audit`):
  - `gate`: the blocking rule is branch protection, held outside the repository.
  - `audit`: no zizmor in any workflow.
- **0012 Delivery** (`target`, `environments`, `release_tool`, `release_notes`, `registry`, `deployment.manifests`):
  - It publishes to npm via `npm publish` (`build-and-tests.yml:698`).
  - The release tool is `scripts/prepare-release.js`, a custom script. I haven't checked whether the ADR's value list accepts that.
  - The other values are unclear.
- **0013 Frontend** (`framework`):
  - Only the docs site and REPL use a UI framework (vitepress and Vue, per `vue-tsc`).
  - It may not apply here. Next to the value.
- **0015 Secrets** (`storage`, `guard`): no gitleaks or equivalent, and `.husky/pre-commit` only runs lint-staged. Absent.
- **0016 Changes** (`framework`, `schema`): no `openspec/` directory. Absent.
- **0017 Agent tooling** (`hosts`):
  - `CLAUDE.md` containing `@AGENTS.md` and `.agents/skills/` show Claude Code is used.
  - They don't show it is the only host. Next to the value.
- **0018 Dependencies** (`updater`, `automerge`):
  - `renovate.json` is the main updater: it automerges minor, patch and pin updates, and Renovate commits fill the history.
  - `.github/dependabot.yml` also exists, for github-actions only.
  - Two tools, so the `updater` value is ambiguous.
- **0019 Vulnerabilities** (`sbom`, `scanner`, `fail_on`):
  - No SBOM and no scanner.
  - `audit-resolve.json` and the "Resolve audit" commits show `npm audit` triage. Next to the value.
- **0020 Adding a dependency** (`approver`, `install_scripts`): nothing in the repository settles either. I haven't checked for an `.npmrc`.
- **0021 Build provenance** (`build_level`):
  - The publish job has `id-token: write` but still uses `NPM_TOKEN` (`build-and-tests.yml:660-705`).
  - `scripts/helpers.js:49-68` handles provenance entries.
  - The SLSA level isn't stated. Next to the value.
- **0022 Review and merge** (`by`, `approvals`): held in GitHub branch protection. I don't know the values.
- **0024 Code scanning** (`tool`, `fail_on`): no CodeQL workflow. GitHub's default setup may be enabled outside the repository. I don't know.
- **0025 Tools** (`manager`): `.tool-versions` pins `npm 11.15.0`, which shows a version manager is used. Whether that matches the ADR's value list is unchecked. Next to the value.
- **0026 Agent identity** (`identity`): held outside the repository. I don't know.

## Proposed order

1. Group 1: 0023, then 0014.
2. Group 2 in ADR number order: 0002 to 0013, then 0015 to 0022, then 0024 to 0026.

I'd move 0013 and 0016 early if you expect them to be `rejected`.

Do you agree to this order, or do you want another? I have no question tool in this session, so please answer in plain text. Once you do, I'll start with ADR-0023.
