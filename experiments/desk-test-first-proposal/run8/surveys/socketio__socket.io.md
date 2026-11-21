### socketio__socket.io.json cost=1.93 turns=53 subtype=success writes=[]
I'll start by running the ontrack review command, as AGENTS.md requires, and looking at the ADR files.
---
The `ontrack review` command needs approval, so I'll read the ADRs directly for now.
---
Now reading all 25 proposed ADRs.
---
I've read all 25 ADRs; now I'm collecting evidence from the repository (workflows, configs, history) before I present the two groups.
---
Nearly done collecting evidence; one last look at how packets are validated, then I'll present the survey.
---
I've finished the survey and written nothing. One note first: AGENTS.md says to run `npx -p @trivoallan/ontrack ontrack review`, but that command needs your approval and wasn't run. I worked from the ADR files and the repository instead. If you approve it later, I'll follow its output.

## Group 1: ADRs the repository already answers

| ADR | Value | Citation | Shows the value itself, or only something next to it? |
|---|---|---|---|
| **0002 Localization** | `default: english` | `README.md`, `CONTRIBUTING.md` and `packages/*/README.md` are written in English | Itself: the docs are in English |
| | (no overrides) | the last 300 commit subjects are in English (`git log`); `lib/**/*.ts` names and comments are in English | Itself |
| **0004 Languages** | `TypeScript` | `CONTRIBUTING.md`: "TypeScript as the development language"; every package has a `tsconfig.json` | Itself |
| **0013 Frontend** | `rejected` (no user interface) | the packages are server and client libraries (`CONTRIBUTING.md`, project structure table); no package's `package.json` names a UI framework (grep found none) | Itself. Caveat: the UIs under `examples/` (Angular, React, Next and others) are demos, not the product |
| **0014 Work tracking** | `tool: github-issues` | `CONTRIBUTING.md` sends issues to `https://github.com/socketio/socket.io/issues`; `"bugs.url"` in `packages/socket.io/package.json` points there too | Itself |
| | `project: socketio/socket.io` | the same URL; `git remote -v` gives `github.com/socketio/socket.io` | Itself |
| **0016 Changes** | `framework: none`, `schema: none` | there is no `openspec/` directory (Glob found nothing). Intent is written in the PR description, which `.github/PULL_REQUEST_TEMPLATE.md` structures ("Current behavior / New behavior") | Itself: the absence of `openspec/` plus the template that holds the intent |
| **0023 License** | `spdx: MIT` | root `LICENSE` ("(The MIT License)"); `"license": "MIT"` in all 12 `packages/*/package.json` | Itself. Gap: the root `package.json` has no `license` field, and this ADR's check reads the root manifest |

## Group 2: everything else, with the missing or inferred value

| ADR | Missing or inferred value, and where it lives |
|---|---|
| **0003 Architecture** | `pattern`: written down nowhere. Layered packages (`engine.io` → `socket.io`, a parser below each) can only be inferred from the `dependencies` in each package and the `CONTRIBUTING.md` table (next to the value). |
| **0005 Validation** | `boundary`: incoming packets are checked by hand in `packages/socket.io-parser/lib/index.ts:301` (`isPayloadValid`), which shows the value for that boundary only. I didn't check the other boundaries (handshake query, cookies). `data_files`: no JSON Schema anywhere; whether `none` is the answer is a judgment. |
| **0006 Commits** | `scopes`: history only. The scopes seen are `eio`, `sio`, `eio-client`, `sio-client`, `cluster-engine`, `examples`, `release`, `deps` and others, spelled inconsistently (`eio-parser` vs `engine.io-parser`, `parser`, `types`). `tool`: no commitlint or hook config (absence, which shows `none` itself). Versions are set by hand (`packages/socket.io-client/RELEASING.md`), so the condition for recommending commitlint is not met. |
| **0007 Tests** | `coverage_target`: `nyc` runs in the `test` scripts, but there's no `check-coverage` or threshold anywhere. That is next to the value; the number is yours. |
| **0008 Documentation** | All four keys: the user docs live on socket.io/docs (`CONTRIBUTING.md` links there), i.e. outside this repository. The `docs/` here holds protocol specs only. |
| **0009 Branching** | `merge: squash` inferred from history: subjects end in `(#5593)` and there are no merge commits besides the monorepo import. `model` inferred from that too, but the maintainer also commits directly to `main` (e.g. `f97d51a8`, which has no PR number). `prefixes`: I don't know; branch names aren't in the repository. |
| **0010 Architecture documentation** | No `docs/architecture/`. Choosing between `none` and `elsewhere` (the protocol specs in `docs/*-protocol/`, the `CONTRIBUTING.md` structure table) is a judgment. |
| **0011 Forge and CI** | `gate`: whether checks are required lives in GitHub rulesets, outside the repository. `audit`: none (absence). The workflows use movable tags (`actions/checkout@v6`), which the ADR's rule 3 forbids. |
| **0012 Delivery** | `target: package`, the npm environment on `tag`, and `release_tool: manual` are shown by `publish.yml` and `RELEASING.md` (itself). `release_notes`: the content of the GitHub Releases is held on GitHub; I don't know it. |
| **0015 Secrets** | `storage`: I don't know where maintainers keep the Sauce Labs keys (`SAUCE_*` appears in commented-out CI) or npm credentials. `guard`: none (absence). |
| **0017 Agent tooling** | `hosts`: which agents contributors use is held with you. There is no `.claude/` and no `opencode.json`. |
| **0018 Dependencies** | `updater`: Dependabot has authored commits (`git log --author=dependabot`) but there's no `.github/dependabot.yml`, so it's configured in GitHub settings, outside the repository. `automerge`: inferred `none`. |
| **0019 Vulnerabilities** | `scanner`: Dependabot alerts live on GitHub. History has `chore: npm audit fix` (`48ef9a13`). No scan job. `sbom`: none (absence). |
| **0020 Adding a dependency** | `approver`: held with you. `install_scripts`: no `.npmrc` and no `allowScripts`; the npm version isn't pinned (CI uses Node 24 and 26). |
| **0021 Build provenance** | `build_level`: `publish.yml` uses npm trusted publishing (`id-token: write`), which implies provenance. That's next to the value. Also, the check looks for `--provenance`, which the workflow doesn't contain. |
| **0022 Review and merge** | `by` and `approvals`: the ruleset lives on GitHub. There are many contributors (`git shortlog`) and one main maintainer; whether a second account can approve is unknown. |
| **0024 Code scanning** | `tool`: no CodeQL workflow, but GitHub's default setup may be on (outside the repository). |
| **0025 Tools** | `manager`: none (absence), but the right answer depends on whether 0011 or 0015 name a binary. |
| **0026 Agent identity** | `identity`: held with you. The ADR is written for one-maintainer repositories, and this one has many contributors. |

## Proposed order

1. **Group 1:** 0002, 0004, 0013, 0014, 0016, 0023.
2. **Group 2**, in list order with two moves, because some ADRs read values from others:
   - 0003, 0005, 0006, 0007, 0010, 0011, **0012, 0008** (0008's `channels` reads 0012's `delivery.target`)
   - then 0015, 0017, **0018, 0009** (0009's check needs 0012 and 0018 ruled first)
   - then 0019, 0020, 0021, 0022, 0024, 0025, 0026.

**Do you agree with this order, or would you like another?** You can also tell me to skip any ADR or stop at any point. Once you confirm, I'll present the ruling for ADR-0002.
