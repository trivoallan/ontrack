I'll start with the survey and write nothing. First I'll read the ADRs and look at the repository.
---
I'm surveying all 25 ADRs and have read 0002–0012 so far. I'll read 0013–0026 next, then check the repository's files and history.
---
Now the repository itself: CI, config, layout and history.
---
I've read the 25 `proposed` ADRs and surveyed the repository. I have written nothing. The survey is below.

The checks behind the citations:
- `git log --oneline | wc -l` returned 918.
- `git log --format=%s | grep -cE '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?: '` returned 0.
- `git log --merges --oneline | wc -l` returned 2.
- `git tag --list 'v10*'` lists v10.0.0 through v10.2.1.
- `git ls-files .github .claude .husky openspec marketplace mise.toml aqua.yaml` returned only `.github/codecov.yml`, `.github/security.md` and `.github/workflows/main.yml`.
- A grep for `gitleaks|zizmor|codeql|grype|trivy|semgrep|dependabot|renovate|release-please|openspec|commitlint|husky|attest|--provenance|ignore-scripts|allowScripts` over `package.json`, `.npmrc`, `.github/**`, `.gitignore`, `.gitattributes`, `readme.md` and `tsconfig.json` found nothing.
- A grep for `mermaid|plantuml|likec4|structurizr|docusaurus|mkdocs|starlight|astro|arc42` outside `docs/adr/` found nothing.
- A grep for `zod|ajv|json-schema|$schema|check-coverage` outside `docs/adr/` found nothing.

`package.json` shows as modified in git. I haven't touched it. It adds the `trivoallan` devDependency and the diff also shows indentation changes.

## Group 1: the repository already answers (8 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0007 Tests | `tests.coverage_target` | `none` | `shows the value`: the `c8` block in `package.json` sets reporters and excludes and has no `check-coverage`. `.github/codecov.yml` holds only `notify.after_n_builds: 6` and no target. |
| 0010 Architecture documentation | `architecture.document` | `none` | `shows the value`: `docs/` holds only user pages (`api.md` … `windows.md`). There is no `docs/architecture/` and no arc42 match anywhere. |
| 0010 | `architecture.model` | `none` | `shows the value`: no `.c4`/`.likec4` file, and no likec4 or structurizr match. |
| 0010 | `architecture.diagrams` | `none` | `shows the value`: no mermaid or plantuml match outside `docs/adr/`. |
| 0013 Frontend | `frontend.framework` | none (the ADR would be `rejected`) | `shows the value`: `package.json` dependencies and devDependencies list no UI framework. |
| 0016 Changes | `changes.framework` | `none` | `shows the value`: no `openspec/` tracked, and `openspec` appears nowhere in `package.json`. |
| 0016 | `changes.schema` | `none` | `shows the value`: same evidence as the framework, since the schema only applies to openspec. |
| 0018 Dependencies | `dependencies.updater` | `none` | `shows the value`: `.github/` has no `dependabot.yml` and the repository has no renovate config. |
| 0018 | `dependencies.automerge` | `none` | `shows the value`: no updater, and no workflow using `fetch-metadata`. |
| 0023 License | `license.spdx` | `MIT` | `shows the value`: `package.json` has `"license": "MIT"`, and the root `license` file starts with "MIT License". |
| 0024 Code scanning | `code_scanning.tool` | `none` | `shows the value`: the only workflow is `main.yml` and it has no codeql or semgrep step. The ADR says GitHub's default setup is not an answer, because no file records it. |
| 0024 | `code_scanning.fail_on` | `none` | `shows the value`: no scan job exists to fail. |
| 0025 Tools | `tools.manager` | `none` | `shows the value`: no `mise.toml`, `aqua.yaml` or install script is tracked. |

The absence-based rows are worth checking against what you know. For example, you may have a coverage target set on codecov.io, or GitHub's default code scanning turned on. Neither would appear in a file.

## Group 2: values the repository cannot show (17 ADRs)

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 Localization | `default` | a choice people make | `next to it`: `readme.md`, `docs/*.md` and the last 25 commit subjects are in English. |
| 0002 | `documentation` | a choice people make | `next to it`: the docs are in English. |
| 0002 | `commits` | a choice people make | `next to it`: the last 25 subjects are in English. |
| 0002 | `code` | a choice people make | `next to it`: file names under `lib/` are English. |
| 0002 | `comments` | a choice people make | none gathered. |
| 0003 Architecture | `architecture.pattern` | a choice people make | `next to it`: `lib/` is split by concern (`arguments`, `io`, `ipc`, `pipe`, `stdio` …) behind one `index.js`. |
| 0004 Languages | `languages.main.name` | a choice people make | `next to it`: `"type": "module"`, `lib/**/*.js`, hand-written `types/**/*.d.ts` and `test-d/`. This suggests JavaScript, which is outside the recommended Python/TypeScript. |
| 0005 Validation | `validation.boundary` | a choice people make | `next to it`: no validation library is in `dependencies`, and there are no zod or ajv matches. The checks look hand-written (`lib/ipc/validation.js`, `lib/transform/validate.js` exist; I haven't read them). |
| 0006 Commits | `commits.scopes` | a choice people make | `next to it`, from history alone: 0 of 918 subjects use `type(scope):`. |
| 0006 | `commits.tool` | a local hook would be untracked, in each clone | `next to it`: no commitlint or husky in `package.json`, and no workflow runs one. |
| 0008 Documentation | `docs.audience` | a choice, and the forge's visibility setting | `next to it`: `repository` in `package.json` and the `origin` URL point at public GitHub. |
| 0009 Branching | `branching.model` | GitHub settings and practice | `next to it`: only `main` and `origin/main` exist, and CI runs on `push` and `pull_request`. |
| 0009 | `branching.merge` | GitHub merge-method settings | `next to it`: 2 merge commits among 918. |
| 0009 | `branching.prefixes` | a choice people make | none: this clone has no feature branches. |
| 0011 Forge and CI | `forge.gate` | a GitHub ruleset | `next to it`: `main.yml` exists and runs on push and pull request. It doesn't say whether it is a required check. |
| 0012 Delivery | `delivery.target` | a choice people make | `next to it`: `package.json` has `files` and `exports`, no `private`, and release tags exist. |
| 0012 | `delivery.environments` | a choice people make | `next to it`: version tags v10.0.0 … v10.2.1, and no deploy workflow. |
| 0012 | `delivery.release_tool` | a choice people make | `next to it`: no release-please config or workflow, and bare `10.2.1` / `10.2.0` version commits with tags. |
| 0012 | `delivery.release_notes` | GitHub releases, outside the repository | `next to it`: no changelog file is tracked. |
| 0014 Work tracking | `tracking.tool` | a GitHub setting (whether Issues is used) | `next to it`: the repository is hosted on GitHub. |
| 0014 | `tracking.project` | a choice people make | `next to it`: `"repository": "sindresorhus/execa"`. |
| 0015 Secrets | `secrets.storage` | maintainers' machines | `next to it`: no `.env`, `.envrc` or `.env.example` is tracked. |
| 0015 | `secrets.guard` | a local hook, untracked | `next to it`: no gitleaks in `package.json` or the workflow. |
| 0017 Agent tooling | `agent.hosts` | contributors' choice | `next to it`: no `.claude/` or `opencode.json` is tracked. The ADR says that absence doesn't show it. |
| 0019 Vulnerabilities | `vulnerabilities.scanner` | GitHub settings (Dependabot alerts count as `github`) | `next to it`: no grype, trivy or dependency-review step in `main.yml`. |
| 0020 Adding a dependency | `admission.approver` | a choice per session | none. |
| 0020 | `admission.install_scripts` | the npm version contributors run | `next to it`: `.npmrc` holds only `package-lock=false`, and there is no `allowScripts`. |
| 0021 Build provenance | `supply_chain.build_level` | the npm registry | `next to it`: no workflow publishes or attests. |
| 0022 Review and merge | `review.by` | a GitHub ruleset | none in the repository. |
| 0022 | `review.approvals` | a GitHub ruleset | none in the repository. |
| 0026 Agent identity | `agent.identity` | GitHub accounts and the maintainer's machine | `next to it`: `git log --format=%an` shows human authors only (ehmicky, Sindre Sorhus, Sam Verschueren). |

For 0012 I left out `delivery.registry` and `deployment.manifests` because the repository shows both as `none`: it has no Dockerfile and no manifests. For 0019 I left out `sbom` and `fail_on` for the same reason: no job produces an SBOM or runs a scan.

## Proposed order

Group 1 first, in ADR number order: **0007, 0010, 0013, 0016, 0018, 0023, 0024, 0025**. Then group 2, in number order: **0002, 0003, 0004, 0005, 0006, 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0019, 0020, 0021, 0022, 0026**.

Do you agree to this order, or do you want another? I don't have a question tool in this session, so reply in plain text. Once you agree, I'll start with ADR-0007 and write nothing until you agree to its ruling.
