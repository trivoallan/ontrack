I'll start with the survey, which writes nothing. First I'll read all 25 ADRs and look at the repository.
---
I'm reading the ADRs for the survey. The shell rejected my loop, so I'm switching to a helper script.
---
I've read all 25 ADRs. Next I'm gathering evidence from the repository: workflows, config files, hooks, history and the contributing guide.
---
I've read all 25 ADRs and compared them with the repository. Nothing has been written. Where a value is "none" because a file is absent, I counted the absence as shown only when the absence is the value.

## Group 1: every value is shown in this repository (7 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 Languages | `languages.main.name` | JavaScript | `shows the value`: CONTRIBUTING.md ("do not introduce newer JavaScript syntax"), AGENTS.md ("linted as ES2015"). It is outside the recommended Python/TypeScript pair, so the ruling will need a written justification. |
| 0013 Frontend | `frontend.framework` | none (would be ruled `rejected`) | `shows the value`: `package.json` has no UI framework and its `files` list ships only library files. |
| 0014 Work tracking | `tracking.tool` | github-issues | `shows the value`: `package.json` `"bugs": "https://github.com/moment/moment/issues"`, plus `.github/ISSUE_TEMPLATE/` |
| 0014 Work tracking | `tracking.project` | moment/moment | `shows the value`: `package.json` `"repository": "github:moment/moment"` |
| 0016 Changes | `changes.framework` | none | `shows the value`: no `openspec/` directory and no openspec dependency |
| 0016 Changes | `changes.schema` | none | `shows the value`: same absence |
| 0018 Dependencies | `dependencies.updater` | none | `shows the value`: no `.github/dependabot.yml`, no Renovate config, no bot commits in history (only manual "Bump version" commits) |
| 0018 Dependencies | `dependencies.automerge` | none | `shows the value`: no workflow uses `dependabot/fetch-metadata` |
| 0023 License | `license.spdx` | MIT | `shows the value`: `package.json:9` `"license": "MIT"`, and `LICENSE` holds the MIT text |
| 0025 Tools | `tools.manager` | none | `shows the value`: no `mise.toml` or `aqua.yaml`, nothing in `scripts/` installs a tool, and no workflow installs a standalone binary |

## Group 2: at least one value is not shown (18 ADRs)

| ADR | Value I could not show | Where it lives | Citation I have |
|---|---|---|---|
| 0002 Localization | `language.default` and the four overrides | a choice people make | `next to it`: commits, CONTRIBUTING.md and AGENTS.md are all written in English |
| 0003 Architecture | `architecture.pattern` | a choice people make | `next to it`: AGENTS.md describes the `src/lib` and `src/locale` split |
| 0005 Validation | `boundary`, `data_files` | a choice people make | `next to it`: THREAT_MODEL.md and commit `dc248fea` say callers validate their inputs. AGENTS.md rules out runtime dependencies, so `zod` is out. |
| 0006 Commits | `scopes` (and `tool`) | a choice people make; scopes can only be read from history | `next to it`: of the last 300 commits, `[locale]` is 48, `[misc]` 47, `[bugfix]` 38, and only 7 are Conventional Commits. `tool: none` is shown: no commitlint, and `.githooks/pre-commit` only guards `master`. |
| 0007 Tests | `coverage_target` | a choice people make, or Coveralls settings outside this repository | `next to it`: `package.json:61` runs `nyc … --reporter=lcov`, no threshold file exists, and `coverage.yml` uploads to Coveralls |
| 0008 Documentation | `tool`, `root`, `audience`, `channels` | the site is momentjs.com, outside this repository; `audience` is a choice | `next to it`: `package.json` `homepage`. `docs/` holds only the ADRs. |
| 0009 Branching | `model`, `merge`, `prefixes` | `model` and `prefixes` are choices; `merge` is a GitHub setting | `next to it`: CONTRIBUTING.md says pull requests go to `develop` and `release.yml` moves `master`. History shows `(#NNNN)` squash-style titles but also 1014 merge commits. Remote branch names are ad hoc. |
| 0010 Architecture documentation | `document`, `model`, `diagrams` | a choice people make | `next to it`: there is no `docs/architecture/`, and CONTRIBUTING.md "Code Organization" and THREAT_MODEL.md could stand as `elsewhere` |
| 0011 Forge and CI | `forge.gate` | GitHub ruleset, outside this repository | `next to it`: the "All passed" aggregator job in `pull-request.yml`, and RELEASING.md "protected source branch". `forge.audit: none` is shown: no workflow runs zizmor or actionlint. |
| 0012 Delivery | `environments` names, `release_notes` | `environments` is a choice; `release_notes` lives in GitHub Releases | `release.yml` publishes to npm on a tag, which shows `target: package`. RELEASING.md shows `release_tool: manual`. No image or manifests exist, which shows `registry: none` and `manifests: none`. `CHANGELOG.md` is `next to it` for `release_notes`. |
| 0015 Secrets | `secrets.storage` | maintainers' machines, a choice | `guard: none` is shown: no gitleaks and no hook that scans. `release.yml` uses `secrets.NPM_TOKEN`, but CI secrets are out of scope here. |
| 0017 Agent tooling | `agent.hosts` | a choice people make | `next to it`: `.agents/skills/locale-review/` and AGENTS.md. No `.claude/` or `opencode.json` exists, and an absence does not show which agents contributors use. |
| 0019 Vulnerabilities | `scanner`, `fail_on` | GitHub settings (Dependabot alerts), outside this repository | `sbom: none` is shown: `release.yml` has no SBOM step. `fossa.yml` is a licence scan, `next to it`. |
| 0020 Adding a dependency | `approver`, `install_scripts` | `approver` is a choice; `install_scripts` is the package-manager setting | `next to it`: there is no `.npmrc` or `pnpm-workspace.yaml` |
| 0021 Build provenance | `build_level` | a choice; the attestation itself lives on the npm registry | `next to it`: `release.yml` runs `pnpm publish --provenance` with `id-token: write`. The workflow does not say which SLSA level this is. |
| 0022 Review and merge | `review.by`, `review.approvals` | GitHub ruleset, outside this repository | `next to it`: `CODEOWNERS` is `* @moment/collaborators`. No agent deny entries exist, since there is no `.claude/settings.json`. |
| 0024 Code scanning | `tool`, `fail_on` | GitHub code-scanning settings, where a default setup would not show in files | `next to it`: no CodeQL or Semgrep workflow exists |
| 0026 Agent identity | `agent.identity` | unknown: the maintainers' machines and GitHub | none, and no commit in the last 300 carries a Claude or Copilot `Co-Authored-By` trailer |

## Proposed order

I propose Group 1 first, then Group 2, each in ADR-number order:

1. Group 1: 0004, 0013, 0014, 0016, 0018, 0023, 0025.
2. Group 2: 0002, 0003, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

I can also read the GitHub settings (rulesets, merge method, code scanning, Dependabot alerts) with read-only `gh` calls. That would settle several Group 2 values before we reach them.

Do you agree to this order, or do you want another?
