I'll start the survey by reading every ADR and checking the repository. Nothing gets written at this stage.
---
I'm reading the remaining ADRs one by one, since the shell is rejecting my batch commands.
---
Still in the survey. I've covered the repo evidence and now need the allowed values for ADR-0008 onward.
---
Nothing is written yet. The survey is below. Counts come from commands I ran, and I name each command.

## Group 1: this repository already answers (6 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 Languages | `languages.main.name` | TypeScript | `shows the value`: `git ls-files ':/*.ts' \| wc -l` gives 192 and `git ls-files ':/*.js' \| wc -l` gives 13. `tsconfig.json` and `package.json` (`"types": "dist/ajv.d.ts"`) agree. |
| 0014 Work tracking | `tracking.tool` | github-issues | `shows the value`: `package.json:58` has `"bugs": "https://github.com/ajv-validator/ajv/issues"`. `.github/ISSUE_TEMPLATE/` holds 5 templates (`git ls-files ':/.github/ISSUE_TEMPLATE' \| wc -l`). |
| 0014 | `tracking.project` | ajv-validator/ajv | `shows the value`: `package.json` has `"repository": "ajv-validator/ajv"`, and `git remote -v` gives `github.com/ajv-validator/ajv`. |
| 0016 Changes | `changes.framework` | none | `shows the value`: `git ls-files \| grep -i openspec` returns nothing, and `openspec/` would have to be a tracked directory. |
| 0016 | `changes.schema` | none | `shows the value`: no OpenSpec directory, and the ADR pairs `none` with `framework: none`. |
| 0018 Dependencies | `dependencies.updater` | dependabot | `shows the value`: `.github/dependabot.yml` configures the `npm` ecosystem, daily. |
| 0018 | `dependencies.automerge` | none | `shows the value`: with Dependabot, automerge has to leave a workflow (`dependabot/fetch-metadata`). `.github/workflows/` holds only `build.yml` and `publish.yml`, and neither does that. |
| 0023 License | `license.spdx` | MIT | `shows the value`: `package.json:57` has `"license": "MIT"`, and `LICENSE` opens with "The MIT License (MIT)". |
| 0025 Tools | `tools.manager` | none | `shows the value`: `git ls-files` has no `mise.toml`, `aqua.yaml` or install script. `scripts/` holds only site and bundle scripts. |

## Group 2: needs a discussion (19 ADRs)

These rows list only the values I could not show.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 Localization | `default` | a convention people hold | `next to it`: README, CONTRIBUTING and commit subjects are in English. |
| 0002 | `documentation`, `commits`, `code`, `comments` (4 rows) | the same convention. An empty value means "same as default", so it cannot be shown. | none beyond the row above |
| 0003 Architecture | `architecture.pattern` | a design choice held by people | `next to it`: the `lib/` layout is `vocabularies` 65 files, `refs` 22, `compile` 20, `runtime` 8 (`git ls-files ':/lib' \| cut -d/ -f5 \| sort \| uniq -c`). `docs/components.md` describes the code components. |
| 0005 Validation | `validation.boundary` | a choice people make. The repository is itself a validator. | `next to it`: `package.json` dependencies hold no `zod` or `pydantic`. |
| 0005 | `validation.data_files` | a choice people make | `next to it`: JSON schemas exist (`lib/refs/*/schema.json`), but whether `$schema` links them to data files is not shown. |
| 0006 Commits | `commits.scopes` | a choice people make | `next to it`: `git log -n 200` shows 26 `build(deps-dev)`, 1 `fix(pattern)` and 1 `fix(standalone/index.ts)`. |
| 0006 | `commits.tool` | possibly a local hook outside the repository | `next to it`: no commitlint in `package.json` or in a workflow. The husky entry runs only `lint-staged && npm test`. 884 of 2721 commit subjects match Conventional Commits (`git log --format=%s \| grep -cE ...`). |
| 0007 Tests | `tests.coverage_target` | the Coveralls settings, outside the repository | `next to it`: the `nyc` block in `package.json` sets `exclude` and `reporter` and no threshold. `build.yml` uploads to Coveralls. |
| 0008 Documentation | `docs.audience` | a choice people make | `next to it`: `"homepage": "https://ajv.js.org"`. |
| 0008 | `docs.channels` | what the published site holds (`gh-pages`) | `next to it`: only `build.yml` publishes the site, on push to master (`scripts/publish-site`). `publish.yml` publishes none. |
| 0009 Branching | `branching.model` | a choice people make | `next to it`: `build.yml` runs on pushes to `master` and on pull requests. |
| 0009 | `branching.merge` | a forge setting | `next to it`: subjects end in `(#NNNN)`, and `git log -n 100 --format=%s \| grep -c 'Merge '` gives 4. |
| 0009 | `branching.prefixes` | a convention people hold | `next to it`: remote branches are `dependabot/...` and `chore-update-typescript-5.4.3`. |
| 0010 Architecture documentation | `architecture.document` | a choice people make | `next to it`: no `docs/architecture/` in `git ls-files`. `docs/components.md` may stand in for it. |
| 0010 | `architecture.model` | a choice people make | `next to it`: no LikeC4 model files. |
| 0010 | `architecture.diagrams` | a choice people make | `next to it`: grep for `mermaid`, `plantuml`, `likec4` and `arc42` under `docs/` (ADRs excluded) finds 0 matches. |
| 0011 Forge and CI | `forge.gate` | a forge ruleset | `next to it`: `build.yml` runs on every pull request. Whether a ruleset requires it is not in the repository. |
| 0012 Delivery | `delivery.environments` | a choice people make | `next to it`: no deploy job. Each push to master publishes the docs site, which may count as an environment on `merge`. |
| 0012 | `delivery.release_tool` | how the maintainers release | `next to it`: no release-please or equivalent. Version-bump commits such as `8.20.0` suggest manual releases, and `publish.yml` runs on a published GitHub release. |
| 0012 | `delivery.release_notes` | the GitHub release pages | `next to it`: no `CHANGELOG` file in `git ls-files`. |
| 0013 Frontend | `frontend.framework` | a choice people make | `next to it`: 41 `.vue` files under `docs/.vuepress` (`git ls-files ':/*.vue' \| wc -l`). `vue` is not in `package.json`, and `scripts/publish-site` installs `vuepress@1` on the fly. |
| 0015 Secrets | `secrets.storage` | the contributor's machine | unknown |
| 0015 | `secrets.guard` | possibly a local hook outside the repository | `next to it`: no gitleaks and no hook for it in `package.json`. |
| 0017 Agent tooling | `agent.hosts` | which agents contributors use | `next to it`: no `.claude/`, `CLAUDE.md` or other agent settings are tracked. `AGENTS.md` is untracked and was added by ontrack. |
| 0019 Vulnerabilities | `vulnerabilities.sbom` | the GitHub release assets | `next to it`: no SBOM step in `publish.yml`. |
| 0019 | `vulnerabilities.scanner` | possibly a forge feature (`github`) that leaves no file | `next to it`: no scanner workflow. |
| 0019 | `vulnerabilities.fail_on` | follows the scanner and the forge gate | unknown |
| 0020 Adding a dependency | `admission.approver` | a choice people make | unknown |
| 0020 | `admission.install_scripts` | contributor machines | `next to it`: `.npmrc` holds only `package-lock=false`, and CI runs a plain `npm install`. |
| 0021 Build provenance | `supply_chain.build_level` | what the npm registry records | `next to it`: `publish.yml` runs `npm publish` without `--provenance` and without `id-token: write`. |
| 0022 Review and merge | `review.by` | a forge ruleset | `next to it`: `.github/CODEOWNERS` lists `@epoberezkin`. |
| 0022 | `review.approvals` | a forge ruleset | unknown |
| 0024 Code scanning | `code_scanning.tool` | possibly GitHub's default CodeQL setup, which leaves no file | `next to it`: no scanning workflow. |
| 0024 | `code_scanning.fail_on` | a forge setting | unknown |
| 0026 Agent identity | `agent.identity` | which GitHub account the agent uses | unknown |

Two points to check later:
- **ADR-0008:** the `docs.tool` and `docs.root` values are stated in the repository (`docs:build` runs `vuepress build docs`, and the config is in `docs/.vuepress/`). I left them out of the second group's rows. `vuepress` is not among the values that ADR lists (`starlight`, `docusaurus`, `mkdocs`, `none`), so it will need a departure.
- **ADR-0006 and ADR-0015:** both could have a local hook outside the repository, so I did not count the absence of one as a citation.

## Proposed order

1. **Group 1, in ADR order:** 0004, 0014, 0016, 0018, 0023, 0025.
2. **Group 2, in ADR order:** 0002, 0003, 0005 through 0013, 0015, 0017, 0019 through 0022, 0024, 0026.

I don't have a question tool in this session. Do you agree to this order, or do you want another? I will start with ADR-0004 once you answer.
