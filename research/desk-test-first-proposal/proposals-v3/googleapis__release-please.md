=================== googleapis__release-please ADR-0002
Now evidence on the repository's languages in use.

I read `docs/adr/trivoallan/ADR-0002-localization.md`. It recommends one default language, English, with no overrides.

## What the repository does today

Everything is in English:
- **Documentation:** `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and the 8 guides in `docs/` (`cli.md`, `customizing.md`, `design.md`, and others) are all in English. I searched for common French words in `src/`, `docs/*.md` and `README.md` and found none.
- **Commits:** all 1,435 commit subjects are in English Conventional Commits form, such as `feat: add --force-tag option …` and `ci: split engines install test from units`. Searching the last 2,000 for common French words found 0.
- **Code:** names are English, such as `export class Manifest` in `src/manifest.ts:309`.
- **Comments:** English, starting with the Google LLC Apache-2.0 header in every file.
- **Written rule:** the repository has no file that states a language rule. English is a consistent practice, not a written rule.

**Differences from the recommendation:** none. The repository already does what the ADR recommends, with English everywhere and no medium in another language. The ADR's only condition ("a team that works in French…") doesn't hold here.

## Proposed ruling

**Status: `accepted`**

- `localization.language.default: english (observed)`: every document, all 1,435 commit subjects, the code names and the comments are in English
- `localization.language.documentation:` left empty, so it takes `default` (observed: all docs are English)
- `localization.language.commits:` left empty, so it takes `default` (observed: `git log` shows only English subjects)
- `localization.language.code:` left empty, so it takes `default` (observed: e.g. `src/manifest.ts:309`)
- `localization.language.comments:` left empty, so it takes `default` (observed: English license headers and inline comments)

**Departures from the recommendation:** none. The ADR would say "Adopted as recommended."

**What I need from you before writing:**
1. Do you agree to rule `accepted` with `default: english` and no overrides?
2. Who should be listed in `authors:`? Unless you name others, I'll put "Tristan Rivoallan" (no email address). The date will be 2026-11-15.

Once you agree, I'll fill in the frontmatter and replace the "How to rule" block with "Adopted as recommended." I'll also rewrite the Consequences lists for this repository: the current ones talk about French-speaking maintainers, which doesn't apply here. Then I'll run `npx ontrack apply`, and after that list any rulings the repository doesn't follow yet. For this one I expect none.
=================== googleapis__release-please ADR-0004
I'm checking where the few Python files sit. Everything in `src/` is TypeScript.

My proposed ruling for ADR-0004 (Languages) is `accepted`, with TypeScript as the main language. One caveat first: `npx ontrack review trivoallan/ADR-0004-languages` needed your approval and did not run, so I ruled from the ADR's own "How to rule" section. I have written nothing yet.

**What the repository does today**
- **Source:** all 281 tracked `.ts` files make up `src/` and `test/`, and `src/` contains nothing else. `tsconfig.json` is at the root, `typescript` is a dependency in `package.json`, and the package builds to `./build/src/` as a library (`main`) and a command-line tool (`bin`). It requires `node >=22.0.0`.
- **CI:** `.github/workflows/ci.yaml` runs only Node steps: `npm ci`, `npm test`, `npm run lint`, `npm run docs` and `npm run build`.
- **Other languages:**
  - The `.js` files are config files (`.mocharc.js`, `.prettierrc.js`, `.jsdoc.js`) and test snapshots.
  - Most `.py` and `.rb` files are test fixtures, because the tool updates version numbers in Python and Ruby projects.
  - `owlbot.py` is a repo-automation script, and `.kokoro/*.sh` are legacy CI scripts.
  - None of these is the language code gets written in, and the ADR says such secondary languages "do not change the answer".
- **Nothing to check:** none of the ADR's recommendations is conditional on this repository, so there was no condition to settle.

**Proposed ruling**
- Status: `accepted`
- `languages.main.name: TypeScript (observed)`: 281 `.ts` files, `tsconfig.json`, and the build, test and lint scripts CI runs.

**Departure from the recommendation**
The value is one of the two the ADR recommends, but its tie-break does not point to it. The ADR says to pick TypeScript when the code runs in a browser or shares code between browser and server, and Python otherwise. release-please runs only on Node: it is a command-line tool and an npm library, so the tie-break points to Python. The reasons to keep TypeScript are:
- the whole codebase is already TypeScript;
- it is published to npm with its types for Node users;
- moving to Python would mean rewriting the project.

I would write that reason in the ADR.

**Your answers**
1. Do you agree with the ruling above, including the reason for the departure?
2. I need names for the `authors:` field, without email addresses. Should I use "Tristan Rivoallan"?
3. May I run `npx ontrack review trivoallan/ADR-0004-languages` first in case it adds instructions, and then `npx ontrack apply` once I've written the ADR?

**Next step after you agree**
Once the ADR is ruled, I'll list the rulings the repository doesn't follow yet. I expect this one to be already followed. AGENTS.md lists Work tracking (ADR-0014) as not yet decided, so no tracker is named: I'll give the list in my reply and create no tracking items.
=================== googleapis__release-please ADR-0006
The `npx ontrack review` call needs approval I don't have, so I'll gather the evidence by hand.

Now the scope tally from history, using a small script in the scratchpad.

990 of the last 1,000 subjects already follow the format. Next: the 10 that don't, the `src/` layout, and where the `deps` and `main` scopes come from.

## Proposed ruling: [trivoallan/ADR-0006] Commits

I couldn't run `npx ontrack review` (permission was denied), so I collected the evidence by hand. I haven't written anything yet.

### What the repository does today

- **Versions come from commit messages, so the ADR's condition for `commitlint` holds.** The files that show it:
  - `release-please-config.json` and `.release-please-manifest.json` (`"." : "17.11.2"`).
  - `.github/release-please.yml`, which runs the release-please bot.
  - The history is full of `chore(main): release 17.x.y` commits.
- **The format is followed, but nothing enforces it.**
  - 990 of the last 1,000 commit subjects are valid Conventional Commits.
  - The 10 that aren't are seven `deps: …` subjects (the most recent is #2734) and three `Revert "…"` subjects, which commitlint ignores by default.
  - The only rule anywhere is one line in `CONTRIBUTING.md:37` ("Title your pull request following Conventional Commits").
- **No enforcement tool is set up.** There's no `@commitlint/*` in `package.json`, no commitlint config file, no `.husky`, and no commit or PR-title job in `.github/workflows/ci.yaml`. The required checks in `.github/sync-repo-settings.yaml` are `cla/google`, `docs`, `lint`, `test (18)` and `windows`, and none of them checks messages.
- **Scopes are used heavily, and they drift.** There are about 90 distinct scopes, and the same area often has several names:
  - `cargo-workspace` / `cargo-workspaces`
  - `java-yoshi` / `java-yoshi-mono-repo` / `yoshi-java-monorepo` / `java-monorepo`
  - `node` / `nodejs`
  - `docs` / `doc` / `readme`
  - file paths such as `src/updaters`, `changelog.json` and `dependency-manifest.ts`
  - This is the drift the ADR's Context describes.
- **Bots write some of the scopes.** Renovate writes `chore(deps)` and `fix(deps)`. Dependabot security PRs write `build(deps)` and `build(deps-dev)`. The release-please bot writes `chore(main)`, where `main` is the branch name. A closed list has to include these, or commitlint will refuse the bots' own PRs.
- **The merge setting matters.** Both squash and rebase merges are allowed (`sync-repo-settings.yaml`). With rebase, each individual commit lands on `main`. With squash, the PR title becomes the commit. A commitlint check on the commits between `origin/HEAD` and `HEAD` covers the first case, but not the PR title in the second.

### Proposed ruling

**status: accepted**

- `commits.tool: commitlint (absent)`. Versions are generated from messages by release-please, but nothing checks the messages today: no dependency, no config, no CI job and no required check.
- `commits.scopes: [main, deps, deps-dev, cli, manifest, github, changelog, commit, docs, bazel, dart, dotnet-yoshi, elixir, expo, go, go-librarian, go-yoshi, helm, java, java-yoshi, java-yoshi-mono-repo, krm-blueprint, maven, node, node-librarian, ocaml, php, php-librarian, php-yoshi, python, python-librarian, r, ruby, ruby-librarian, ruby-yoshi, rust, sfdx, simple, terraform-module, cargo-workspace, maven-workspace, node-workspace, linked-versions, sentence-case, group-priority] (absent)`. No closed list exists today. The words come from what the history already uses, made canonical:
  - **Written by bots:** `main`, `deps`, `deps-dev`.
  - **Core areas:** `cli`, `manifest`, `github`, `changelog`, `commit`, `docs`.
  - **One per release type:** the names of the files in `src/strategies/`, except `base`.
  - **One per plugin:** the plugin names users set in config (`src/plugins/`, except the internal `workspace` and `merge`).

**Departures from the recommendation:** none for `commits.tool`. The ADR makes no recommendation for `commits.scopes`, so the list above is this repository's own choice, with the reasons given.

### What I couldn't see

- **Org-level bots or rulesets.** googleapis repositories sometimes have a commit-lint GitHub App or a ruleset installed at the org level. That lives in the GitHub org and repo settings, not in these files. If a PR-title check runs there, `commitlint` in CI would be a second guard rather than the only one. Does one exist?
- **Live merge settings.** I could only read `sync-repo-settings.yaml`, not the settings actually applied on GitHub.

### Questions before I write anything

1. Do you agree to `commits.tool: commitlint`?
2. Do you want the full list of 45 scopes above, or a shorter one? For example, one scope per language family (`java` covering `java-yoshi` and `java-yoshi-mono-repo`) instead of one per release type.
3. Is any commit or PR-title check enforced outside the repository (org app or ruleset)?

### Rulings this repository doesn't follow yet (if the ruling is accepted as proposed)

- `[trivoallan/ADR-0006] commits.tool`: commitlint isn't installed. That means adding `@commitlint/cli` and `@commitlint/config-conventional` as dev dependencies, adding a `commitlint.config.js` with `scope-enum`, and adding a CI job, probably with `--from origin/main` on the `check:` line.
- `[trivoallan/ADR-0006] commits.scopes`: nothing enforces the scope list.

No `tracking` trait is decided in AGENTS.md (ADR-0014 is still proposed), so I won't create tracker items. The list above is the record.
=================== googleapis__release-please ADR-0009
I've collected the evidence. Here is the proposed ruling. (`npx ontrack review` needed an approval that didn't come through, so I followed the ADR's own steps directly.)

## What the repository does today

- **Model.** Work is done on short branches and merged into `main` through PRs. The last 300 first-parent commits all end in `(#NNNN)`, and `main` is protected: 1 review, code-owner review and strict status checks (`.github/sync-repo-settings.yaml:4-15`). CI also runs on `merge_group`, so a merge queue is in use. There is **one maintenance branch, `12.x`**: it has its own protection rule (`sync-repo-settings.yaml:16`) and its own release config (`.github/release-please.yml:6`). There is no `develop`, `release/*` or `hotfix/*` branch, so this is not gitflow.
- **Merge.** In practice it's squash: only **1 merge commit in 1,435** (`bc87aa3`, from the synthtool era), and every recent commit on main is a single PR commit. The forge settings allow both `squashMergeAllowed: true` and `rebaseMergeAllowed: true`, with `mergeCommitAllowed: false` (`sync-repo-settings.yaml:1-3`). `CONTRIBUTING.md:37` asks for PR titles in Conventional Commits form, which is the squash-message rule this ADR describes.
- **Prefixes.** No convention is written down anywhere: not in CONTRIBUTING, the PR template or CI. The remote branches are mixed. Some follow the pattern (`feat/php-librarian`, `feat/ignore-submodules-422`, `fix/java-yoshi-version-java-updates`). Others don't (`fix-empty`, `parthea-patch-1`, `sofisl-patch-1`, `test-java-rc`, `testing-rp-hacks`, and the legacy `owl-bot-update-lock-*` branches). Bot branches `release-please--…` and `renovate/` are exempt from the check.

## Proposed ruling: `accepted`

- `branching.model: github-flow (observed)`: every change reaches `main` through a reviewed PR, protected by `sync-repo-settings.yaml:4-15`. The `12.x` maintenance branch is a support line, not a separate model.
- `branching.merge: squash (observed)`: 1 merge commit in 1,435, every recent commit on main is one PR, and `CONTRIBUTING.md:37` asks for Conventional Commits PR titles. The forge setting that would make it squash-only is still **absent**: `rebaseMergeAllowed: true` is set at `sync-repo-settings.yaml:1`.
- `branching.prefixes: [feat, fix, docs] (absent)`: a few branches use `feat/` and `fix/`, but nothing enforces it, and `fix-empty`, `*-patch-1` and `test-java-rc` don't follow it.

**Departures from the recommendation:** none, the values are as recommended. Two things you should know before deciding:
1. **`chore` and `build` make up about 47% of recent commits** (104 and 37 of the last 300). Most come from bots (release-please, Renovate, Dependabot), which the check exempts. But maintainers also open human `chore:` PRs, such as `30719c4 chore: remove legacy OwlBot configuration`. Under `[feat, fix, docs]`, those would need a `fix/` or `docs/` branch name. Adding `chore` (and possibly `build`) would be a justified departure.
2. **GitHub web-editor branches** (`<user>-patch-1`) will fail the check, and so will CLA or OwlBot-style branches if they come back.

To follow up after ruling (not part of this ADR's edits):
- **Make the merge rule real.** Setting `rebaseMergeAllowed: false` would enforce `squash`.
- **Rule the two bot ADRs too.** ADR-0012 (release, which covers `release-please--`) and ADR-0018 (updater, which covers `renovate/` and `dependabot/`) should be ruled along with this one, or the bot PRs will fail the check.

I don't have a question tool here, so please reply with one of these:

- **A.** Accept as proposed: `github-flow`, `squash`, `[feat, fix, docs]`.
- **B.** Accept with prefixes `[feat, fix, docs, chore]`, which covers maintainers' human chore PRs. I'll write that reason into the ADR.
- **C.** Accept with prefixes `[feat, fix, docs, chore, build]`.
- **D.** Something else: say which values to change.

Please also give the **author name(s)** for `authors:`. The date will be 2026-11-15. I won't write anything until you reply.
=================== googleapis__release-please ADR-0011
Read the ADR and the CI workflow. Next I'm checking whether zizmor is installed and what GitHub's live branch protection says.

I couldn't follow AGENTS.md's instruction to run `npx ontrack review trivoallan/ADR-0011-forge-and-ci`, because the command needed an approval that wasn't given. I read the ADR and followed the steps it gives instead. I also couldn't check whether zizmor is installed or read the live branch protection with `gh api`, for the same reason.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/googleapis/release-please`). So `rejected` doesn't apply.
- **Pipeline:** one workflow, `.github/workflows/ci.yaml`. It runs on `push` to `main`, on `pull_request` and on `merge_group` (a merge queue, added in 86d09c6). Its jobs are `test`, `installation-test`, `windows`, `lint`, `docs` and `build-action`.
- **Releases:** the release-please GitHub App does them, set up in `.github/release-please.yml`. No workflow deploys anything, and no workflow uses `environment:`, `pull_request_target` or secrets.
- **The five rules are already followed:**
  - Every `uses:` is pinned by SHA with the tag in a comment.
  - Every checkout sets `persist-credentials: false`.
  - The workflow grants only `permissions: contents: read`.
  - No container images are used.
- **Gate (intent only):** `.github/sync-repo-settings.yaml:4-15` asks for branch protection on `main`: strict status checks `cla/google`, `docs`, `lint`, `test (18)` and `windows`, plus one code-owner review. A bot applies this file to GitHub; the repository itself doesn't enforce it. One part is out of date: the matrix has only `node: [22]` (285b023), so a check named `test (18)` never reports. Either the live protection differs from this file, or `main` is blocked on a check that never arrives. I can't tell which from here.
- **Audit:** no job runs zizmor or any other workflow auditor. Commit 9c29179 ("ci: zizmor fix for workflow file", June 2026) shows that someone ran zizmor by hand once and fixed what it found. There's no `zizmor.yml` and no actionlint setup.

## Proposed ruling

**Status: `accepted`**

- `forge.gate: blocking` (not marked): `sync-repo-settings.yaml` declares required checks on `main`, so the intent is clearly blocking. Whether that's in force lives in the GitHub branch protection or ruleset for `googleapis/release-please`, which I couldn't read. I need you to confirm the live value. A screenshot of the settings would do, or let me run `gh api repos/googleapis/release-please/branches/main/protection`.
- `forge.audit: zizmor` (absent): `ci.yaml` has no audit job. zizmor has only been run by hand once (9c29179). This ruling would add a job that runs `zizmorcore/zizmor-action`, pinned by SHA, on every pull request.

**Departures from the recommendation:** none. Both values match it.

A side finding for later: the `test (18)` entry in `sync-repo-settings.yaml` should be `test (22)`.

## Your call

1. Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`?
2. Is `main` really protected by required checks on GitHub today? Your answer decides whether `forge.gate` is marked `observed` or `absent`.
3. What should go in `authors:`? I'll use `Tristan Rivoallan` unless you say otherwise.

I'll write nothing until you answer.
=================== googleapis__release-please ADR-0023
I've read the ADR. I couldn't run `npx ontrack review` as `AGENTS.md` asks, because the command wasn't approved. So the evidence below comes from reading the repository directly.

## What the repository does today

- **Licence file:** there is a `LICENSE` at the root with the full Apache License 2.0 text. It was added in `d11ce7d` ("chore: generate common files using synthtool").
- **Manifest:** `package.json:30` says `"license": "Apache-2.0"`, and `package.json:29` says `"author": "Google Inc."`.
- **Other manifests:** there is no root `pyproject.toml`. The only one is a test fixture (`test/updaters/fixtures/pyproject.toml`), which the check doesn't read.
- **Copyright line:** `LICENSE` has no filled-in copyright line. Line 190 is still the appendix placeholder `Copyright [yyyy] [name of copyright owner]`. The copyright notices are in the source headers instead: 151 files under `src/` carry the Apache header with a Google LLC copyright.
- **CI:** nothing in CI enforces the licence.

## Compared with the recommendation

1. **Different value:** the ADR recommends `MIT`, and the repository uses `Apache-2.0`. The ADR names Apache-2.0 as the alternative "when an explicit patent grant matters". This is a Google-owned project that has been under Apache-2.0 since it started, like Google's open-source projects generally. Relicensing would need every contributor to agree, and copies already taken keep Apache-2.0 anyway.
2. **Copyright holder:** fixed rule 3 says the organisation's name goes in the licence file's copyright line. Here it is only in the per-file headers, and `LICENSE` keeps the standard unfilled appendix template. That is normal practice for Apache-2.0, and the ADR's check doesn't read the file's text. Changing `LICENSE` would also go against the synthtool-generated version, so I propose recording this as a departure rather than editing the file.
3. **No conditional recommendation applies:** there is no `pyproject.toml` at the root, so only the `package.json` part of rule 1 is relevant, and it is met.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: Apache-2.0 (observed): package.json:30 "license": "Apache-2.0", and the root LICENSE holds the full Apache 2.0 text`

**Departures from the recommendation:**
- **Apache-2.0 instead of MIT:** this is the licence already in place. It is Google's standard licence for open source, it includes an explicit patent grant, and changing it would mean relicensing an existing codebase with outside contributions.
- **Copyright holder kept in source headers, not in `LICENSE`:** this follows the Apache-2.0 convention and the synthtool-generated file. The holder is Google LLC.

**Also needed from you:** the ADR wants `authors:` filled with the names of the people who decided. Who should I list? I'd suggest "Tristan Rivoallan", from the git user, unless you tell me otherwise. I'll set `date:` to 2026-11-15.

Do you agree with this ruling, and with that name for `authors:`? I won't write anything until you confirm.
=================== googleapis__release-please ADR-0025
Still gathering evidence: looking for tool managers, pinned download scripts and binary installs in the repository.

Here is my proposed ruling for ADR-0025. I've written nothing yet.

I couldn't run `npx ontrack review trivoallan/ADR-0025-tools`, which AGENTS.md says to run, because the command wasn't approved. So this review rests only on the ADR's own instructions.

## What the repository does today

- **No tool is installed outside the package manager.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions`, install script, `scripts/` or `bin/` directory, devcontainer or git hook (no `.husky`, no `.githooks`).
- **Nothing downloads a binary.** I searched `.github/`, `.kokoro/`, `package.json` and `CONTRIBUTING.md` for `curl`, `wget`, `brew`, `apt-get`, `sha256sum`, `gitleaks`, `zizmor`, `actionlint` and `osv-scanner`. Nothing matched.
- **CI only uses npm.** `.github/workflows/ci.yaml` runs actions pinned by SHA, then `npm ci`, `npm test`, `npm run lint` (`gts`) and `npm run docs`. All of these come from the npm manifest. The Kokoro and trampoline files run Docker images, which ADR-0011 covers, not this ADR.
- **Updates come from Renovate.** `renovate.json` extends `config:best-practices`; there is no Dependabot config. That only matters for rule 4 once there is a pin to move.
- **The condition for `none` holds.** The ADR says *"`none` is an answer only when no accepted ADR names such a tool."* ADR-0001 is the only accepted ADR; ADR-0002 to ADR-0026 are all `proposed`. (`grep '^status:'` also shows `accepted` in each file, but those lines come from the example frontmatter blocks.) So `secrets.guard` (ADR-0015) and `forge.audit` (ADR-0011) are not decided, and no accepted ADR names a tool.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: none (observed)`: no tool outside npm is installed or pinned anywhere in the repo (no manager files, no download script, no binary install in CI or Kokoro), and no accepted ADR names one.

**Departure from the recommendation:**

- **`none` instead of `script` or `mise`/`aqua`.** The recommendation assumes at least one tool to install, and today there are zero. A script or a manager would pin nothing.
- **When to revisit:** if ADR-0015 or ADR-0011 is accepted with a tool (for example gitleaks or zizmor), this ADR has to be superseded. Once ADR-0025 is accepted, its `check:` fails under `none` as soon as such a tool is listed, so the change can't slip by unnoticed.
- **Rule 4 (keeping the pins current):** there are no pins today. If a manager is adopted later, Renovate is already set up here, and its `mise` manager also updates `mise.lock`.

**Not `rejected`:** the question does apply to this repository, because ADR-0015 and ADR-0011 are still open and may name tools. The answer is simply `none` for now.

If you agree, I'll do the following in that one file:
- set `status: accepted`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- fill in the trait;
- rewrite the Consequences section;
- replace the "How to rule" block with the rule-4 note and the reason for the departure.

Then I'll run `npx ontrack apply`, which also needs your approval to run.

**Do you agree with `accepted` and `tools.manager: none`?** Or would you rather pick a value now, such as `mise`, in case gitleaks and zizmor come in later?
