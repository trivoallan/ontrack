I'll start with the survey and write nothing. First I'll read every ADR and look at the repository.
---
I'm still on the read-only survey. I'm reading the remaining ADRs so I can sort them into the two groups. My filtering script hit a permission prompt, so I'll use the Read tool directly.
---
I've read all 25 ADRs. Next I'll gather repository evidence for the survey, still without writing anything.
---
I've read all 25 ADRs and surveyed the repository. I've written nothing.

I couldn't read the GitHub-side settings (rulesets, merge method, releases, code-scanning setup). The `gh api` calls needed approval and I didn't push for it. Every value that lives only there is marked as held outside the repository.

## Group 1: the repository already answers every value (7 ADRs)

Each citation is marked **itself** (it shows the value) or **adjacent** (it only sits next to it). For `none` values, "itself" means the file or config that would carry the value is absent.

| ADR | Proposed values | Citations |
|---|---|---|
| **0002** Localization | `default: english`, no overrides | **itself:** `CONTRIBUTING.md` and `AGENTS.md` are in English. So are the `git log` subjects, e.g. `[bugfix] Bound chooseLocale prefix walk…`. A code comment such as `src/lib/duration/humanize.js:78` ("This function allows you to set a threshold…") is in English. **adjacent:** `src/lib` has no non-ASCII characters. The French and other strings in `src/locale` are data, not an override. |
| **0004** Languages | `languages.main.name: JavaScript` | **itself:** `package.json` has `"main": "./moment.js"`. All source is `src/**/*.js`. `AGENTS.md` says it is "linted as ES2015", and `eslint.config.js` exists. This departs from the recommended Python or TypeScript. |
| **0013** Frontend | `rejected` (a library with no UI) | **itself, by absence:** `package.json` has no UI framework in `dependencies` or `devDependencies`, and it describes "Parse, validate, manipulate, and display dates". |
| **0014** Work tracking | `tracking.tool: github-issues`, `tracking.project: moment/moment` | **itself:** `package.json` has `"bugs": "https://github.com/moment/moment/issues"` and `"repository": "github:moment/moment"`. `.github/ISSUE_TEMPLATE/` exists, and `origin` points at `moment/moment`. |
| **0016** Changes | `changes.framework: none`, `changes.schema: none` | **itself, by absence:** there is no `openspec/` directory or config, and no openspec dependency. |
| **0018** Dependencies | `dependencies.updater: none`, `dependencies.automerge: none` | **itself, by absence:** there is no `.github/dependabot.yml`, no renovate config, and no workflow using `dependabot/fetch-metadata`. `git log` shows no bot-authored commit. |
| **0023** License | `license.spdx: MIT` | **itself:** `package.json:8` has `"license": "MIT"`. `bower.json` and `composer.json` agree, and `LICENSE` carries the MIT text with "Copyright (c) OpenJS Foundation and other contributors". |

## Group 2: at least one value is held outside the repository, inferred, or from history alone (18 ADRs)

| ADR | Value that blocks group 1 | Where it lives, and the citation type |
|---|---|---|
| **0003** Architecture | `architecture.pattern` | Nothing declares it. `monolithic` would be inferred from the `src/lib` layout (**adjacent**). |
| **0005** Validation | `boundary`, `data_files` | The library has no validation dependency (zero-dependency rule in `AGENTS.md`, **adjacent**). Nothing names its own `isValid` checks as the mechanism. No data file has a `$schema` (absence). |
| **0006** Commits | `scopes`, `tool` | History uses `[bugfix]`/`[locale]` tags, not Conventional Commits (history only, **adjacent**). No commitlint or commit hook exists (`.githooks/pre-commit` only blocks `master`). |
| **0007** Tests | `coverage_target` | `nyc` and Coveralls run (`coverage.yml`), with no threshold in the repo. Any threshold lives in Coveralls settings, which I don't know. |
| **0008** Documentation | `root`, `audience` | User docs live on momentjs.com, probably another repo, which I haven't confirmed. `docs/` holds only the ADRs, which are untracked. Nothing declares the audience. |
| **0009** Branching | `model`, `merge`, `prefixes` | `develop` and `master` exist, `CONTRIBUTING.md` says PRs go to `develop`, and the pre-commit hook guards `master` (**adjacent**). The merge method is a GitHub setting I couldn't read. History shows single `(#NNNN)` commits, which suggests squash (history only). Remote branches use ad hoc prefixes. |
| **0010** Architecture documentation | `document` | `model` and `diagrams` are absent (no `.c4` files, no mermaid). Whether an architecture doc exists elsewhere is unknown. `THREAT_MODEL.md` is a security document. |
| **0011** Forge and CI | `gate` | Held in the GitHub ruleset, which I couldn't read. The aggregate "All passed" job in `pull-request.yml` is **adjacent** only. `audit: none` is shown by absence (no zizmor). |
| **0012** Delivery | `release_notes` | Release workflow and `RELEASING.md` show `target: package`, a tag trigger, and `release_tool: manual`. CHANGELOG is hand-edited, since `bump-version.js` touches only version files. GitHub release text lives outside the repository. `registry` and `manifests` are `none` by absence. |
| **0015** Secrets | `storage` | It lives on maintainers' machines, not in the repo. `guard: none` is shown by absence (`.githooks/pre-commit` holds only the master guard). |
| **0017** Agent tooling | `agent.hosts` | Contributors' hosts aren't recorded. `AGENTS.md` and `.agents/skills/locale-review` name no host (**adjacent**). There is no `.claude/` or `opencode.json`. |
| **0019** Vulnerabilities | `scanner` | `fossa.yml` is a licence scan with its policy held in FOSSA. Dependabot alerts may be on in GitHub settings. I don't know either. SBOM and `fail_on` are `none` by absence. |
| **0020** Adding a dependency | `approver`, `install_scripts` | These are practices, not files. "No runtime dependency without a design decision" in `AGENTS.md` is **adjacent**. There is no `.npmrc` or `pnpm-workspace.yaml`. |
| **0021** Build provenance | `build_level` | `release.yml` publishes with `pnpm publish --provenance` and `id-token: write`, and `RELEASING.md` says so. The level `2` is my classification from that mechanism (**adjacent**), not written anywhere. |
| **0022** Review and merge | `by`, `approvals` | Held in the GitHub ruleset, which I couldn't read. `CODEOWNERS` (`* @moment/collaborators`) is **adjacent** only. |
| **0024** Code scanning | `tool`, `fail_on` | There is no CodeQL workflow, but CodeQL default setup could be on in GitHub settings, which I don't know. |
| **0025** Tools | `manager` | No `mise.toml`, `aqua.yaml` or install script exists. The right value depends on how 0011 and 0015 are ruled, so it can't be settled alone. |
| **0026** Agent identity | `agent.identity` | It lives on GitHub and the maintainers' machines. The ADR is written for a one-person repository, and this one has a `@moment/collaborators` team, so `rejected` may apply. |

## Proposed order

Group 1 first, in numeric order: **0002, 0004, 0013, 0014, 0016, 0018, 0023**. Then group 2 in numeric order: **0003, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0025, 0026**.

Group 2 in numeric order ensures 0011 (gate) is ruled before 0019/0022/0024, which depend on it. 0025 comes after 0011 and 0015, which it depends on.

`AskUserQuestion` isn't available in this session, so please reply in text. Do you agree to this order, or do you want another? You can also name ADRs to skip or move, or tell me to stop. I'll start the first ruling once you confirm.
