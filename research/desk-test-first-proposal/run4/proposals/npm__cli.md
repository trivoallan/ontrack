# npm__cli

## ADR-0002

Here's my proposed ruling on **ADR-0002 Localization**. Nothing has been written yet.

I read the ADR in full. I couldn't run `npx ontrack review` because it needs your approval, so the review below follows the ruling steps written in the ADR itself.

### What the repository does today
- **Commits:** the last 200 commit subjects are all in English, using Conventional Commits (`fix(arborist): …`, `deps: …`, `chore: release …`).
- **Documentation:** `README.md`, `CONTRIBUTING.md` and `docs/lib/content/**` are all in English. A search for French accented characters across `lib/**` and `docs/lib/**` found nothing.
- **Code symbols and comments:** all in English (`lib/**`, `workspaces/**`).
- **Nothing states it.** No file says the project's language is English, and no CI or lint check enforces it. English is the practice, not a written rule. (`@isaacs/string-locale-compare` is a sorting dependency and has nothing to do with this question.)

### Comparison with the recommendation
The ADR recommends `default: english` with no overrides, which matches what the repository does. The recommendation has no conditions to check. Ruling `rejected` doesn't fit, because the question applies here: agents write commits, comments and docs in this repository.

### Proposed ruling: `accepted`

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | commit history, `README.md`, `docs/lib/content/**`, `lib/**` |
| `localization.language.documentation` | *(empty, takes `default`)* | observed | docs are in English |
| `localization.language.commits` | *(empty)* | observed | `git log` subjects are in English |
| `localization.language.code` | *(empty)* | observed | `lib/**` symbols are in English |
| `localization.language.comments` | *(empty)* | observed | `lib/**` comments are in English |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.

### What I'll write once you agree
- **Frontmatter:** fill the traits as above, set the status to `accepted`, the date to `2026-11-15`, and the authors to `[Tristan Rivoallan]`.
- **Consequences:** rewrite them for this repository. The current Positive and Negative lists are written for a French-speaking team, and that doesn't apply to npm/cli.
- **How-to-rule block:** delete it and put one line in its place saying the recommendation was adopted as is.
- **AGENTS.md:** run `npx ontrack apply` to update it.

### Rulings the repository doesn't follow yet
None from this ADR: every value is already observed. `localization` is not something a tool sets up, so there's no tracking item to propose. Even if there were one, I couldn't file it: AGENTS.md lists Work tracking (ADR-0014) as not decided, so there is no `tracking` trait.

**Do you agree with ruling ADR-0002 `accepted` with `default: english` and no overrides?** I can also use a different author list or add overrides if you prefer.

## ADR-0004

I'm checking the secondary languages, typing, Node engines and CI so the ruling has evidence behind it.

I couldn't run `npx ontrack review` because the command was blocked for approval, so this review follows the ADR's own instructions and your prompt. I've read `docs/adr/trivoallan/ADR-0004-languages.md` in full.

## What the repository does today

- **No main language is written down.** `languages.main.name` is empty and nothing else in the repository names one.
- **All of npm's own code is plain JavaScript.** There are 1,642 tracked `.js`/`.mjs`/`.cjs` files and **0** `.ts`/`.tsx` files.
- **There is no TypeScript at all.** No `tsconfig*.json` exists and no file has `@ts-check`.
- **It runs on Node with no build step.** `package.json:265-266` sets `"engines": {"node": "^22.22.2 || ^24.15.0 || >=26.0.0"}`. Tests run with `"test": "tap"` (`package.json:218`) and linting with `"lint": "node . run eslint"` (`package.json:224`). The 26 workflows under `.github/workflows/` test JavaScript packages (`ci.yml`, `ci-npmcli-arborist.yml`, …).
- **Other languages are minor and don't change the answer** (the ADR's Neutral section says so):
  - Windows shims: `bin/npm.cmd`, `bin/npm.ps1`, `bin/npx.*`
  - Shell: `lib/utils/completion.sh`, `scripts/smoke-tests.sh` and test fixtures
  - Python: only in vendored `node_modules/node-gyp/gyp/`, which is a dependency, not npm's code.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. This repository uses **neither**, so ruling JavaScript is a departure. The ADR allows that if the reason is written in the file.

- **Its condition for picking between the two:** "TypeScript when the repository runs in a browser or shares code between browser and server; Python for scripts… and services that do neither." npm does neither. It is a Node CLI, which on that test would point to Python. But rewriting npm in Python makes no sense: npm is Node's package manager, ships inside Node.js, and runs on the Node runtime it manages.
- **Why not TypeScript:** npm ships its sources as published JavaScript that runs without being compiled (there is no `tsconfig` and no build in `scripts`). Adopting TypeScript would mean adding a compile step to every package in `workspaces/` and to the Node.js bundling process. That is a large migration this ruling shouldn't impose.

`rejected` doesn't fit, because the repository clearly has a main language.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `JavaScript` (**observed**) | 1,642 JS files and 0 TS files, `engines.node` in `package.json`, `tap` and `eslint` as the tooling, no `tsconfig` |

**One departure from the recommendation**, which will be written into the ADR: JavaScript instead of Python or TypeScript. npm is the runtime-bundled package manager for Node.js. It ships its own JavaScript sources with no compile step, and its whole toolchain (tap, eslint, the workspaces) is JavaScript. TypeScript would add a build to every published package for no gain the project has asked for. Python would mean leaving the runtime npm exists to serve.

I'll also fill in:
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`
- the Consequences section, rewritten for this ruling. Its main cost: ADR-0005's `zod`/`pydantic` and ADR-0007's typed-coverage recommendations will need to be adapted to untyped JavaScript.

**Do you agree with this ruling (accepted, `languages.main.name: JavaScript`)?** Or would you prefer a different value, such as TypeScript as a migration target, marked absent? I won't edit the ADR or run `npx ontrack apply` until you confirm.

## ADR-0006

Still collecting evidence (commit scope history) before proposing a ruling.

I've proposed a ruling below and written nothing yet. `npx ontrack review` needs your permission to run, so I worked from the ADR and the repository directly.

## What the repository does today

- **Versions come from commit messages.** `release-please-config.json` and `.github/workflows/release.yml` produce the versions and changelogs, sorted by type (`feat`, `fix`, `docs`, `deps`, `chore`). The ADR's condition for recommending `commitlint` ("if this repository generates its versions from commit messages") therefore holds.
- **commitlint already runs in CI.** `.github/workflows/pull-request.yml` has a `Lint Commits` job: `npx --offline commitlint --from origin/<base> --to <head>`. If the commits fail, it lints the PR title instead. It only runs when `github.repository_owner == 'npm'`.
- **The commitlint config is generated.** `.commitlintrc.js` comes from `@npmcli/template-oss` ("Do not edit"). It extends `@commitlint/config-conventional`.
  - It has **no `scope-enum`**, so any scope is accepted.
  - Its **`type-enum` is `feat, fix, docs, deps, chore`**.
- **Scopes in use over the last year (571 commits):** about 140 commits have a scope. `arborist` accounts for 67 of them and `config` for 8. The rest is about 30 one-off command names: `exec`, `ls`, `audit`, `pack`, `view`, and so on.
  - The same places get different names: `npm-install` and `install`; `npm-view` and `view`; `libnpmexec` and `exec`; `allowScripts` and `approve-scripts`.
  - This is the drift the ADR describes.
- **Workspaces:** there are 12 under `workspaces/`: `arborist`, `config`, and `libnpm{access,diff,exec,fund,org,pack,publish,search,team,version}`.
- **Dependencies:** `@commitlint/cli` is only in `package-lock.json`, pulled in through template-oss. Neither it nor `@commitlint/config-conventional` is a direct devDependency, and `node_modules/@commitlint` is missing from this checkout.

## Proposed ruling: `accepted`

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `commits.tool` | `commitlint` | **observed** | `pull-request.yml` job `Lint Commits` and `.commitlintrc.js`; release-please makes this the recommended value |
| `commits.scopes` | `[arborist, config, libnpmaccess, libnpmdiff, libnpmexec, libnpmfund, libnpmorg, libnpmpack, libnpmpublish, libnpmsearch, libnpmteam, libnpmversion]` | **absent** | These match `workspaces/` and the `packages` in `release-please-config.json`. No `scope-enum` exists today. |

**Departures from the recommendation:**
- **Tool:** none. `commitlint` is what the ADR recommends.
- **Scopes:** the ADR offers no default list. I propose one word per workspace because those are the areas this repository releases separately. Command scopes like `exec`, `ls` or `audit` would no longer be allowed; those commits would go unscoped. Today that is about 70 commits a year, and they are the ones with drifting names.

**What doesn't match, and the ruling can't fix:**
1. **Types.** Governance fixes the eleven types. This repository allows only five, and one of them, `deps`, isn't among the eleven, yet it is the most common type here (222 of 571 commits) and has its own changelog section. Seven governance types (`style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`) are refused today. It's unclear whether `ontrack check` would follow `.commitlintrc.js` or the eleven types, so it might fail on every `deps:` commit.
2. **Where to change the config.** `.commitlintrc.js` is overwritten by template-oss, so adding scopes has to go through the template-oss configuration (`scripts/template-oss/root.js`), not that file.
3. **Dependencies.** The check expects `@commitlint/cli` and `@commitlint/config-conventional` as direct devDependencies, and neither is.
4. **CI base.** The CI job compares against `origin/<base_ref>`. If `origin/HEAD` is missing in CI, the `check:` line needs `--from origin/latest` (the default branch is `latest`).

## Rulings this repository wouldn't follow yet

No `tracking` trait is decided (ADR-0014 is still `proposed`), so I'll create nothing and duplicates weren't checked. If you accept the ruling, these remain:
- `[trivoallan/ADR-0006] commits.scopes: add a scope-enum of the 12 workspace names through the template-oss config`
- `[trivoallan/ADR-0006] commits.tool: add @commitlint/cli and @commitlint/config-conventional as direct devDependencies`
- Separate from this ADR, the type mismatch (`deps` and the five-type enum against the governance eleven) needs settling with governance.

**Do you agree with this ruling?** You could also choose:
- `scopes: []`, if you'd rather drop scopes altogether;
- workspaces plus the main command names;
- `rejected`.

Once you've chosen, I'll write the ADR and run `npx ontrack apply`.

## ADR-0009

I've read the ADR and the repository's branches, history and CI. Now I'm counting how often branches carry prefixes and how often commits arrive by squash.

# Proposed ruling: ADR-0009 Branching

I couldn't run `npx ontrack review` because it needs your approval. What follows comes from the ADR text and from the repository itself.

## What the repository does today

- **Default branch:** `latest` (`origin/HEAD -> origin/latest`). Long-lived maintenance branches `release/v6` to `release/v11` exist. Every `ci-*.yml` workflow runs on pushes to `latest` and `release/v*`. There is no `develop` branch and no feature flags.
- **Model:** changes reach `latest` through short branches and pull requests. `CONTRIBUTING.md:36-40` says to "Open a Pull Request", and `pull-request.yml` lints PR commits or the PR title with commitlint. Fixes are carried back to older majors on `backport/v11/<PR#>` branches that target `release/vN`.
- **Merge:** none of the last 300 first-parent commits on `latest` is a merge commit. Most end in `(#NNNN)`, which is GitHub's squash format. Some groups have no PR number, such as the run of `deps: pacote@22.0.1`, `deps: promise-spawn@10.0.1` and so on, and `chore: release 12.x`. Those came in by rebase, or were pushed straight to `latest`; the history can't tell which. The forge's merge settings can't be seen from the repository.
- **Branch names:** there is no convention and nothing checks them. The remote has `fix/…` (4), `feat/…` (3), `feature/circleci`, many `<user>/…` (`reggi/`, `owlstronaut/`, `nkolev92/`, `martinrrm/`, `nlf/`, `regi/`), `backport/vNN/…`, unprefixed names (`exit-handler-messaging`, `ci-no-npm-update-v11`), and bot branches (`release-please--branches--*`, `dependabot/…`).

## Proposed values

Status: **`accepted`**

| Key | Value | Observed or absent | Evidence |
|---|---|---|---|
| `branching.model` | `github-flow` | **observed** | Work goes PR → `latest`; there is no `develop` and no flags. The `release/vN` maintenance branches don't make this gitflow; they are support lines that receive backports. |
| `branching.merge` | `squash` | **observed** (mostly) | Nearly all PR commits on `latest` end in `(#N)` and no merge commits are left. Some batches were rebased or pushed directly, which `squash` would stop. |
| `branching.prefixes` | `[feat, fix, docs, chore]` | **absent** | Only 7 of about 50 remote branches use `feat/` or `fix/`. Nothing enforces a name today. |

## Departures from the recommendation

1. **`prefixes` adds `chore`.** Much of the work here is `chore` (template-oss, CI, release integration, tests), and `chore` is one of the eleven commit types. With only `[feat, fix, docs]`, that work would have no valid branch name. `deps` is used for commits here but is not one of the eleven, so I left it out of the list.

## Things to know before you agree

- **Backport branches will fail the check.** `backport/v11/10132` is not a prefix from the list, so `ontrack check` would reject it. You can rename backports (for example `fix/v11-10132`), add `--branch` handling, or accept that these fail.
- **Personal branch names will fail too**, such as `reggi/…`. That is what the ruling is for, but maintainers will need to change habits.
- **Bot branches:** ADR-0012 (delivery) and ADR-0018 (dependencies) are still `proposed`. Until they are ruled, PRs from `release-please--…` and `dependabot/…` will fail this check, as the ADR itself warns.
- **`merge: squash` changes how release PRs land.** Release-please PRs and multi-commit dependency batches would be squashed, so the PR title must carry the Conventional Commit type. Commitlint already falls back to linting the PR title.

If you agree, I'll set `status: accepted`, fill `traits:`, `date: 2026-11-15` and `authors:`, rewrite Consequences, replace the "How to rule" block with the reasons above, and run `npx ontrack apply`.

**Do you agree with this ruling?** Or would you change something, for example keeping `[feat, fix, docs]` as recommended, or choosing another way to handle backport branches?

## Rulings the repository wouldn't follow yet

No `tracking` trait is decided (ADR-0014 is still proposed), so I won't create anything in a tracker and didn't check for duplicates. If you accept, these items would be open:

- `[trivoallan/ADR-0009] branching.prefixes: enforce <prefix>/<kebab> branch names (adopt for backport/ and personal branches)`
- `[trivoallan/ADR-0009] branching.merge: allow only squash merging in the forge's repository settings`

## ADR-0011

Checking GitHub for rulesets and the local tools now.

I reviewed ADR-0011 (Forge and continuous integration) against what the repository has today and propose accepting it as recommended. I haven't written anything yet; it's your decision.

## What the repository does today

- **Forge:** GitHub. The remote is `https://github.com/npm/cli.git` and there are 26 workflows in `.github/workflows/`, so `rejected` doesn't apply.
- **Pipeline:** CI runs on pull requests and on pushes to the default branch, in `ci.yml`, `pull-request.yml`, `codeql-analysis.yml` and the per-workspace `ci-*.yml` files. Most of these files are generated by `@npmcli/template-oss` 5.1.1 (`package.json:258`). They start with "This file is automatically added by @npmcli/template-oss. Do not edit." and `postlint: template-oss-check` checks that they haven't drifted.
- **Merge gate:** I couldn't check it. The ADR says the gate lives in a GitHub ruleset, not in the repository, and you didn't approve my request to read `repos/npm/cli/rulesets`.
- **Workflow audit:** none.
  - Nothing runs zizmor in CI, and zizmor isn't installed locally.
  - actionlint is installed on your machine (`~/.local/bin/actionlint`) but nothing runs it in CI.
  - `codeql-analysis.yml` exists, but the ADR measured CodeQL as reporting nothing on workflows.
- **The five rules today:**
  - **Rule 3 (pin by commit SHA) is broken everywhere.** Every `uses:` is a tag that can be moved, for example `actions/checkout@v6`, `actions/github-script@v7`, `LouisBrunner/checks-action@v1.6.0` and `peter-evans/*@v2`/`@v3`. `create-node-pr.yml:51` still uses `actions/checkout@v3`.
  - **Rule 5 (no proposed code with repository rights) holds, barely.** `backport.yml` runs on `pull_request_target` with write permissions for the whole workflow (`contents`, `actions`, `pull-requests`). It checks out the default branch rather than the contributor's code, so rule 5 is technically met.
  - **`backport.yml` also has a test job meant to be removed.** It is marked "TODO: Remove before merging" and pastes `${{ inputs.pr_number }}` straight into a script, which zizmor would flag as `template-injection`.
  - **Rules 1, 2 and 4** (deploy from the default branch only, protected secrets, no secrets in logs) are fine as far as I can see. There is no `environment:` deploy job. Secrets are only `GITHUB_TOKEN` and `NODE_PULL_REQUEST_TOKEN`, and none is echoed.

## Proposed ruling: `accepted`

| Trait | Value | Status | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | observed for the pipeline; ruleset not checked | CI runs on `pull_request` in `ci.yml:7`, `pull-request.yml:6` and `codeql-analysis.yml:10`. Whether a ruleset requires those checks is a GitHub setting I couldn't read. |
| `forge.audit` | `zizmor` | absent | No zizmor job in `.github/workflows/` and no zizmor binary. Accepting this means adding a `zizmorcore/zizmor-action` job pinned by SHA, plus SHA pins on every action. |

**Departures from the recommendation:** none.

**What it costs:**
- Pinning by SHA and the zizmor job can't be done by editing the generated workflows. `template-oss-apply --force` would overwrite the edits and `template-oss-check` would fail. The changes have to go into `scripts/template-oss/root.js`, the repository's template override file, or upstream into `@npmcli/template-oss`.
- `backport.yml` will fail the check until its test job is removed or the input is passed through `env:`.
- Its workflow-wide write permissions will also likely be flagged.

The `tracking` trait isn't decided (ADR-0014 is still proposed), so after the ruling I'll list the rulings the repository doesn't follow yet in my reply and create no items.

**Do you agree to rule ADR-0011 `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`?** If yes, give me the names to put in `authors:`. Or tell me which value to change, for example `informative` or a different audit tool.

## ADR-0023

The repository already answers this question. I propose accepting the ADR with the licence it already uses, Artistic-2.0, not the recommended MIT.

## What the repository does today

- **Root manifest:** `package.json:264` declares `"license": "Artistic-2.0"`, which is a valid SPDX identifier. There is no `pyproject.toml`.
- **Licence file:** `LICENSE` is at the root (235 lines) and holds the full text of the Artistic License 2.0 from line 32 on. Its copyright line reads "Copyright (c) npm, Inc. and Contributors", which names the organisation that owns the repo, as the ADR asks.
- **History:** the file was first added on 2010-05-03, and the latest change to it is `cb6d81bd6` (a registry URL fix in the notices). The licence has never changed.
- **Workspaces:** all 12 packages under `workspaces/*` declare `ISC` and have their own `LICENSE` or `LICENSE.md`. The ADR's check only reads the root manifest, so they are out of scope.

## How that compares with the recommendation

| Point | Recommendation | Repository | Difference |
|---|---|---|---|
| `license.spdx` | `MIT` | `Artistic-2.0` | **Yes** |
| Root manifest declares the value | required | `package.json:264` | none |
| Full licence text in a root file | required | `LICENSE` | none |
| Copyright holder is the owning organisation | required | "npm, Inc. and Contributors" | none |

The ADR's only conditional ("`UNLICENSED` for a private repository") doesn't apply. `package.json` has no `"private"` field, and the origin is the public `https://github.com/npm/cli.git`.

## Proposed ruling

**Status: `accepted`**

- `license.spdx: Artistic-2.0` (**observed**): declared in `package.json:264`, with the full text in `LICENSE`, unchanged since 2010.

**Departure from the recommendation, and why:** I'm keeping Artistic-2.0 instead of MIT. The npm CLI has been distributed under it for 16 years, and every contributor gave their work under those terms. Switching to MIT would mean getting every copyright holder to agree to a relicence, and it would only cover new versions. The ADR says "any SPDX expression is an answer", and this one already describes what the project does.

I'm not proposing `rejected`: the repo is public and published, so the question applies.

**Do you agree with this ruling?** If you do, I'll:
- fill `traits.license.spdx`;
- set the status to `accepted`, with today's date and the authors you give me (who should be listed?);
- rewrite the Consequences section;
- replace the "how to rule" block with the reason for the departure;
- run `npx ontrack apply`.

I won't write anything until you answer.

## After the review

- **This ruling:** the repo already matches it, so if it's accepted there's nothing left to follow up.
- **Tracking:** AGENTS.md has no decided `tracking` trait (ADR-0014 is still proposed). So I won't list tracker items or create any.

## ADR-0025

Reading the ADR is done. I'm now checking which binaries CI fetches outside npm.

I couldn't run `npx ontrack review`, which AGENTS.md says to run first: the permission prompt blocked it. So this review follows your steps and the ADR's own "How to rule" block.

## What the repository does today

- **No tool manager or pin file.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions`, `Brewfile` or install script for a binary.
- **No git hooks and no agent session setup.** There is no `.husky/`, `.pre-commit-config.yaml` or `.devcontainer/`. So nothing installs a tool on a workstation or in an agent session.
- **CI uses no tool outside npm that any ADR names.** No workflow uses `gitleaks`, `zizmor` or `actionlint`. CI does run other things, all outside this question:
  - `jq`, taken from the runner's `PATH` (`node-integration.yml:108`, `:431`). No ADR names it.
  - Python, ccache, WSL and Cygwin, installed by GitHub Actions. Those fall under ADR-0011, which this ADR excludes.
  - `curl` downloads of Node source and test tarballs (`node-integration.yml:74-91`, `:425`). These are build inputs, not tools.
- **Nothing to keep current.** There is no `dependabot.yml` and no Renovate config.

## Checking the condition

The ADR says "`none` is an answer only when no accepted ADR names such a tool." The only accepted ADR is ADR-0001, which names no tool. ADR-0015 (secrets guard), ADR-0011 (`forge.audit`) and ADR-0019 (scanner) are all still `proposed`. So the condition holds, and `none` is allowed today.

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager`: `none`** (observed). No accepted ADR names a tool outside the package manager, and the repository pins or installs no such tool on the runner, a workstation or an agent session.

**Where this departs from the recommendation:** the ADR recommends `script` for one tool and `mise` or `aqua` for several. Both assume at least one tool is named, and none is today. Choosing one now would add a script or a manager with nothing to pin.

**Rule 4 (what keeps the pins current):** there are no pins, so nothing moves them.

**Caveat:** if ADR-0015, ADR-0011 or ADR-0019 is later accepted with a tool (for example `gitleaks` or `zizmor`), this ADR's check fails under `none`. This ADR would then have to be ruled again, most likely as `script` for a single tool. Writing that trigger into the ADR is part of the proposal.

I'm not proposing `rejected`: the question does apply here, and `none` is its answer for now.

I don't have a question tool in this session, so please answer here. Do you agree with `accepted` / `tools.manager: none` and the caveat? Or would you rather rule `script` now, ahead of the secrets guard? I'll write nothing until you answer. If you agree, I'll also need the name(s) for `authors:`.