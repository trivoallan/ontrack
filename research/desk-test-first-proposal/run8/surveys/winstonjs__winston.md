### winstonjs__winston.json cost=1.91 turns=48 subtype=success writes=[]
I'll start by running the review command the project rules point to, and looking at the ADR directory.
---
The `ontrack review` command needs your approval to run, so I'll survey the ADR files and the repository directly for now.
---
I've read all 25 ADRs. Now I'll survey the repository itself.
---
Still surveying: I've read all 25 ADRs and the repo's CI, history and config. A few last checks, then I'll present the two groups.
---
I've finished the survey and written nothing. One note first: the project rules say to run `npx -p @trivoallan/ontrack ontrack review`, but that command was held for your approval, so this survey comes from reading the files directly. If you approve it, I'll run it and follow its output.

Each citation is marked **direct** (it shows the value itself) or **adjacent** (it shows something next to the value, which I would have to infer from).

## Group 1: the repository already answers these

| ADR | Value it shows | Citation |
|---|---|---|
| **0002 Localization** | `default: english`, no overrides | `README.md`, `docs/*.md`: English prose (**direct**). `git log`: every commit message is English (**direct**). `lib/winston/logger.js`: English names and comments (**direct**) |
| **0004 Languages** | `main.name: JavaScript` | `package.json` `"main": "./lib/winston.js"`. Every file in `lib/` is `.js`, with `.d.ts` typings only (**direct**). This departs from the recommended Python or TypeScript, so the ruling has to justify it |
| **0007 Tests** | `coverage_target: 72.48` | `jest.config.js` `coverageThreshold.global.lines: 72.48`, measured over `lib/**/*.js` (**direct**). Only `test/jest.config.unit.js` sets `collectCoverage: true`, so the threshold covers unit tests only, as the ADR requires (**direct**) |
| **0013 Frontend** | `rejected` (there is no UI) | `package.json` `"description": "A logger for just about everything."`, and `lib/` holds a logger and transports with no UI (**direct**) |
| **0014 Work tracking** | `tool: github-issues`, `project: winstonjs/winston` | `.github/ISSUE_TEMPLATE/{bug_report,feature_request}.yml` (**direct**). `git remote -v` → `github.com/winstonjs/winston` (**direct**) |
| **0016 Changes** | `framework: none`, `schema: none` | No `openspec/` directory exists (Glob shows the absence **directly**). Changes are described in PRs, as the `(#NNNN)` subjects in `git log` show (**direct**) |
| **0018 Dependencies** | `updater: dependabot`, `automerge: none` | `.github/dependabot.yml` (**direct**). `ci.yml` is the only workflow and has no `dependabot/fetch-metadata` (**direct**) |
| **0021 Build provenance** | `build_level: 0` | `publishing.md` step 11: "Back on the command line, `npm publish`". No workflow publishes or attests anything (**direct**). The condition `target: package` is met because `prepublishOnly` and `publishing.md` publish to npm (**direct**) |
| **0023 License** | `spdx: MIT` | `package.json` `"license": "MIT"` (**direct**). `LICENSE` holds the full MIT text (**direct**) |
| **0025 Tools** | `manager: none` | No `mise.toml`, `aqua.yaml` or install script exists (**direct**). This value holds only while no accepted ADR names such a tool (gitleaks, zizmor) |

## Group 2: at least one value is held elsewhere, inferred, or drawn from history alone

| ADR | Value that is missing, and where it lives |
|---|---|
| **0003 Architecture** | `pattern`: nothing states it. `lib/` (one package, transports beside the core) suggests `monolithic` or a `rejected` ruling for a library. That is **adjacent**: inferred |
| **0005 Validation** | `boundary`: options are checked by hand inside each transport, with no schema library (Grep shows none, **direct**). Naming the "mechanism" is still inferred. `data_files`: I don't know whether any data file needs a schema |
| **0006 Commits** | `tool: none` (no commitlint config or hook, **direct**). `scopes`: history mixes `fix(file)`, `fix(http)`, `chore(docs)` and unscoped messages (**adjacent**, history only) |
| **0008 Documentation** | `tool: none` (no site generator, **direct**). `root`: user docs are split between `README.md` and `docs/` (**adjacent**). `audience: public`: repository visibility is a GitHub setting held **outside the repo** |
| **0009 Branching** | `merge: squash`: inferred from the linear `(#NNNN)` subjects (**adjacent**, history). The actual setting lives in GitHub. `model`, `prefixes`: remote branches mix `fix-…`, `refactor/tests` and bot names (**adjacent**) |
| **0010 Arch. docs** | No `docs/architecture/` exists (**direct**). But `CONTRIBUTING.md` § "What makes up winston?" could count as `elsewhere`, and choosing between that and `none` is a judgement call |
| **0011 Forge & CI** | `gate`: whether `CI Checks` is required lives in GitHub rulesets, **outside the repo**. `audit: none` (no zizmor, **direct**) |
| **0012 Delivery** | `target: package`, `release_tool: manual` and `registry`/`manifests: none` are **direct** (`publishing.md`). `release_notes`: the changelog is written by hand with breaking changes at the top, so it sits between `changelog` and `highlights` (**adjacent**) |
| **0015 Secrets** | `storage`: the npm publish credential lives on the maintainers' machines, **outside the repo**. `guard: none` (**direct** absence) |
| **0017 Agent tooling** | `hosts`: there is no `.claude/` or `opencode.json`, but commit `64f1ef6` was authored by "Copilot". Which hosts contributors use is **outside the repo** |
| **0019 Vulnerabilities** | `scanner`: Dependabot alerts or `npm audit` may be on, but that is a GitHub setting **outside the repo**. The commit "Run npm audit fix" is **adjacent** |
| **0020 Adding deps** | `approver`: not recorded anywhere, so I don't know. `install_scripts`: there is no `.npmrc`, and the npm version that CI's Node 22/24/26 brings decides it (**adjacent**) |
| **0022 Review & merge** | `by`/`approvals`: these live in GitHub rulesets, **outside the repo**. `package.json` lists several maintainers (**adjacent**) |
| **0024 Code scanning** | No CodeQL workflow (**direct**). CodeQL default setup may be on in GitHub settings, **outside the repo** |
| **0026 Agent identity** | Held on GitHub, **outside the repo**. The "Copilot" author on `64f1ef6` hints at a separate identity (**adjacent**) |

## Proposed order

1. **Group 1, by number:** 0002, 0004, 0007, 0013, 0014, 0016, 0018, 0021, 0023, 0025.
2. **Group 2, by number, with two moves:** 0003, 0005, 0006, 0008, 0010, 0011, 0012, 0009, 0015, 0017, 0019, 0020, 0022, 0026, 0024.
   - 0009 comes after 0012, because its check only exempts bot branches once 0012 and 0018 are ruled.
   - 0026 is taken right after 0022, because ruling `own` forces `review.by: peer`.

**Do you agree to this order, or would you like a different one?** You can also say which ADRs to skip or where to stop.
