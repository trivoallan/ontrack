### isaacs__node-glob.json cost=1.81 turns=45 subtype=success writes=[]
I'll start with the survey: reading every ADR and the repository's files, writing nothing.
---
Still in the survey: I've read ADR-0002 to ADR-0020. Six ADRs are left to read, then I'll check the repository's CI, config and history.
---
Now the repository itself: CI workflows, configs, and history.
---
The survey is done. I read all 25 ADRs and the repository's files, CI and history, and wrote nothing.

## Before we start: the ADRs are not tracked by git

- `.gitignore` has `/docs`. It was added in `c0a22dc` "gitignore docs folder" (2026-08-20) to keep typedoc's output out of git. As a result, `git ls-files docs` returns nothing: every file under `docs/adr/` is ignored. Any ruling I write will stay on your disk and never reach a commit.
- TypeDoc writes to `./docs` by default and clears that folder before each build (`typedoc.json` sets no `out`). Running `npm run typedoc` locally could delete `docs/adr/`. Please check this before you rely on these files.

## Group 1: the repository already answers these

| ADR | Proposed values | Evidence |
|---|---|---|
| 0002 Localization | `default: english` | `README.md`, `AGENTS.md`, the identifiers and comments in `src/*.ts`, `changelog.md`: all in English |
| 0004 Languages | `TypeScript` | `tsconfig.json`, `src/*.ts`, `package.json` `tshy`; AGENTS.md: "Use TypeScript exclusively" |
| 0007 Tests | `coverage_target: 100` | AGENTS.md: "100% test coverage is critically important"; `ci.yml` runs `npm test -- -c -t0` on Unix and passes `--allow-incomplete-coverage` only on Windows (tap fails below 100% by default) |
| 0010 Architecture docs | `document: none`, `model: none`, `diagrams: none` | `docs/` holds only `adr/`; there are no `.c4` files; `README.md` has no Mermaid block |
| 0013 Frontend | `rejected` | the package is a library: `package.json` `exports` and `main`, no UI framework among the dependencies, no UI code in `src/` |
| 0014 Work tracking | `github-issues`, `isaacs/node-glob` | AGENTS.md: "`fix: #1234` link to any GitHub issues" and "the GitHub issue tracker for this repository"; `git remote -v` points to `github.com/isaacs/node-glob` |
| 0016 Changes | `framework: none`, `schema: none` | there is no `openspec/`; AGENTS.md puts a change's reasoning in its commit message |
| 0018 Dependencies | `updater: none`, `automerge: none` | there is no `.github/dependabot.yml` or Renovate config, and no workflow uses `dependabot/fetch-metadata` |
| 0020 Adding a dependency | `approver: person`, `install_scripts: ignored` | AGENTS.md: "If a task requires a new dependency, ask the human to perform the command"; `package.json` has an `allowScripts` field; `release.yml` runs `npm ci --ignore-scripts` |
| 0023 License | `BlueOak-1.0.0` | `package.json` `"license": "BlueOak-1.0.0"`; `LICENSE.md` |
| 0024 Code scanning | `tool: none`, `fail_on: none` | no workflow uses `github/codeql-action`; the ADR says GitHub's default setup does not count |
| 0025 Tools | `manager: none` | there is no `mise.toml`, `aqua.yaml` or install script; no accepted ADR names a tool yet |

## Group 2: at least one value is held elsewhere, inferred, or only seen in history

| ADR | Value(s) I can't cite, and where they live |
|---|---|
| 0003 Architecture | `pattern`: my inference only (`monolithic`: one package, 7 modules in `src/`) |
| 0005 Validation | `boundary`: inferred. Options are checked by hand (`src/glob.ts:443`, `src/pattern.ts:58`), and naming that is a judgement call. `data_files` (`none`) is also inferred |
| 0006 Commits | `scopes: []` is only seen in history. `tool: none` is citable (no commitlint). **Conflict:** this ADR requires Conventional Commits, and AGENTS.md says "Do not use semantic commits" |
| 0008 Documentation | `tool`: the site is TypeDoc deployed to Pages (`typedoc.yml`), which is not one of the ADR's options. `audience`: depends on the repository's visibility, which is a GitHub setting. `root`: typedoc writes to the git-ignored `./docs` |
| 0009 Branching | `model` and `merge` are GitHub settings. History is linear, with no merge commit since `Merge branch 'v9'`. `prefixes` can only be read from history |
| 0011 Forge and CI | `gate` depends on a ruleset that lives on GitHub. `audit: none` is citable (no zizmor) |
| 0012 Delivery | `release_notes`: GitHub release text lives on GitHub. The environment trigger is a tag (`release.yml`), but a person then approves the staged version on npmjs.com, so it may count as manual. `target: package`, `release_tool: manual` (`preversion`/`postversion` scripts), `registry: none` and `manifests: none` are citable |
| 0015 Secrets | `storage` lives on the maintainers' machines. `guard: none` is citable (no hook, no gitleaks) |
| 0017 Agent tooling | `hosts`: which agents contributors use isn't recorded anywhere. There is an AGENTS.md but no `.claude/` and no `opencode.json` |
| 0019 Vulnerabilities | `scanner`: no scan runs in CI, but whether Dependabot alerts are on is a GitHub setting. `sbom: none` is citable |
| 0021 Build provenance | `build_level: 2` is inferred from trusted publishing (`release.yml`, OIDC). Whether `npm stage publish` attaches provenance is visible only on npmjs.com |
| 0022 Review and merge | `by` and `approvals` depend on the ruleset and on who can approve, which live on GitHub |
| 0026 Agent identity | `identity` depends on the credentials on each machine. History shows `ghsa-fixer[bot]` commits |

## Proposed order

1. Group 1 in file order: 0002, 0004, 0007, 0010, 0013, 0014, 0016, 0018, 0020, 0023, 0024.
2. Then group 2 in file order: 0003, 0005, 0006, 0008, 0009, 0011, 0012, 0015, 0017, 0019, 0021.
3. Then 0026 before 0022, because the agent's identity decides `review.by`.
4. **0025 last**, because `manager: none` only holds while no ADR names a tool, and 0011 or 0015 might name one.

**Do you agree with this order, or do you want another?** Also, do you want to fix the `/docs` ignore problem first, or go ahead knowing that the rulings will stay as untracked files?
