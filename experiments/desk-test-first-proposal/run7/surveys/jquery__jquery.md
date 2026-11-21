### jquery__jquery.json cost=2.39 turns=56 subtype=success writes=[]
I'll start by surveying: reading every ADR and the repository, without writing anything.
---
The `ontrack review` command needs your approval; I'll read the ADRs directly in the meantime.
---
Still surveying: 17 of 26 ADRs read, reading the last nine, then checking the repository's files, CI and history.
---
All 26 ADRs read. Now the repository itself.
---
Finishing the survey: checking the last workflows, refs and coverage settings, then I'll present the two groups.
---
Survey done. I read all 26 ADRs and the repository, and wrote nothing. Two notes first:
- `npx -p @trivoallan/ontrack ontrack review`, which AGENTS.md says to run, and `git log` both needed your approval and did not run. For history I used the commit snapshot at session start and `.git/packed-refs`.
- The working tree has uncommitted changes: `package.json:140` adds `trivoallan: npm:@trivoallan/ontrack-engineering@0.6.0`, and `AGENTS.md` and `docs/` are untracked.

## Group 1: the repository already answers every value

| ADR | Proposed values, with evidence |
|---|---|
| **0002 Localization** | `default: english`. README, CONTRIBUTING, `src/` comments and commit subjects ("Tests: Expect…", "Build: Bump…") are all English. |
| **0004 Languages** | `main.name: JavaScript`. Every file under `src/` is `.js`, there is no `tsconfig.json`, `package.json:6` has `"type": "module"`, and there is `eslint.config.js`. The ADR recommends Python or TypeScript, so this is a departure with a written reason. |
| **0006 Commits** | `tool: hook`: `.husky/commit-msg` runs `npx commitplease`. `scopes`: the 23 `commitplease.components` in `package.json:150-174` (Docs, Tests, Build, Core, Ajax…). ⚠ The repo uses jQuery's `Component: Summary` format, not Conventional Commits, and this ADR says that format is not up for ruling. The likely outcome is `rejected` plus a local ADR. |
| **0007 Tests** | `coverage_target: none`, observed. No coverage tool appears in the `package.json` devDependencies or scripts, or in any workflow. |
| **0010 Architecture docs** | `document: none`, `model: none`, `diagrams: none`, observed. There is no `docs/architecture/`, no `.c4` file, and no diagrams. The only structure write-up is `CONTRIBUTING.md:196-200` ("Repo organization"). |
| **0012 Delivery** | `target: package`: `post-release.sh:54-57` runs `npm publish`. `release_tool: release-it`: `.release-it.cjs`, `package.json:62`. `release_notes: changelog`: `.release-it.cjs:22-24` generates the GitHub release notes. `environments`: filestash on `merge` (`filestash.yml:3-6`, push to main) and npm on `manual` (`post-release.sh:52`, "Press enter… & publish to npm"). `registry: none` and `manifests: none`: no Dockerfile and no manifests. |
| **0013 Frontend** | `rejected`: this is a library, not a UI (`package.json:4`, "JavaScript library for DOM operations"). |
| **0014 Work tracking** | `tool: github-issues`, `project: jquery/jquery`. Evidence: `package.json:102-104` (`bugs.url`), `CONTRIBUTING.md:63`, `.github/ISSUE_TEMPLATE.md`. |
| **0016 Changes** | `framework: none`, `schema: none`, observed. There is no `openspec/`. Intent lives in the PR, per `.github/PULL_REQUEST_TEMPLATE.md`. |
| **0018 Dependencies** | `updater: dependabot`: `.github/dependabot.yml`. `automerge: none`: no workflow uses `dependabot/fetch-metadata`. |
| **0021 Build provenance** | `build_level: 0`, observed. `npm publish` runs from a workstation with no `--provenance` (`post-release.sh:55-57`). `verify-release.yml` checks that builds are reproducible, which is a different guarantee. |
| **0023 License** | `spdx: MIT`. Evidence: `package.json:105`, `LICENSE.txt`. |
| **0025 Tools** | `manager: none`, observed. There is no `mise.toml`, `aqua.yaml` or install script, and no accepted ADR names such a tool yet. This answer holds only while ADR-0011 and ADR-0015 name no tool. |

## Group 2: at least one value is held outside the repository, inferred, or unknown

| ADR | Value not settled by the repository, and where it lives |
|---|---|
| **0003 Architecture** | `pattern` would be inferred: ES modules combined into one file (`CONTRIBUTING.md:198`) looks `monolithic`, but nothing in the repo says so. |
| **0005 Validation** | `boundary` is a judgement call. jQuery reads data at run time (ajax, `parseXML`) but has no runtime dependencies, so it checks inputs by hand. `data_files: none` is observed. |
| **0008 Documentation** | `tool: none` is observed. `root` is unclear: the API docs live in another repo, jquery/api.jquery.com (`CONTRIBUTING.md:10`). `audience` depends on the repo's visibility, which is a GitHub setting. |
| **0009 Branching** | `model` and `merge` are forge settings; history alone (linear `… (#5921)` commits) suggests squash. `prefixes` is unknown: contributors work on forks. |
| **0011 Forge & CI** | `gate` lives in GitHub rulesets. `audit: none` is observed. |
| **0015 Secrets** | `storage` is unknown: maintainers' machines hold `JQUERY_GITHUB_TOKEN` (`.release-it.cjs:40`). `guard: none` is observed. |
| **0017 Agent tooling** | `hosts` depends on the tools contributors use. The repo has no host settings files. |
| **0019 Vulnerabilities** | `scanner` would be Dependabot alerts, which is a GitHub setting (`dependabot.yml:24-25` mentions only that security updates are kept). `sbom: none` and `fail_on: none` are observed. |
| **0020 Adding deps** | `approver` is a team practice, not written anywhere. `install_scripts: ignored` is observed in the `package.json:142-147` `allowScripts` list. |
| **0022 Review & merge** | `by` and `approvals` live in GitHub rulesets. CONTRIBUTING mentions a multi-person core team. |
| **0024 Code scanning** | `tool: codeql` is observed (`codeql-analysis.yml`). `fail_on` lives in a GitHub ruleset. |
| **0026 Agent identity** | `identity` depends on credentials outside the repo. The ADR is also written for one-person repos, and jQuery has a core team (`CONTRIBUTING.md:32-38`). |

## Proposed order

Group 1 in number order (0002, 0004, 0006, 0007, 0010, 0012, 0013, 0014, 0016, 0018, 0021, 0023, 0025), then group 2 in number order (0003, 0005, 0008, 0009, 0011, 0015, 0017, 0019, 0020, 0022, 0024, 0026).

**Do you agree to this order, or would you like another?** Since `ontrack review` and `ontrack apply` both need your approval, please approve them now as well. Once you confirm, I'll start with ADR-0002.
