=================== npm__cli ADR-0002
The ADR's `npx ontrack review` command needed approval and didn't run, so I built this ruling by reading the ADR and the repository directly.

## Proposed ruling: ADR-0002 Localization, `accepted`

**What the repository does today:** everything is in English, and that is a habit, not a written rule. Nothing in the repo or CI says which language to use.
- **Commits:** all 13,543 commit subjects are English conventional commits, such as `fix(unpublish): refuse to unpublish a version…`. Searching the last 2,000 for common French words found none.
- **Documentation:** `README.md` and the pages under `docs/lib/content/` (`commands/`, `configuring-npm/`, `using-npm/`) are in English.
- **Code and comments:** names and comments are English, for example `lib/commands/install.js` with `class Install`, `static description = 'Install a package'`.
- **Missing pieces:** no file and no CI workflow (`.github/workflows/*`) states a language, and nothing checks commit language. There are no translation libraries either, so the CLI's messages are only in English. That isn't really this ADR's question, which is about the language people and agents write in.

**Compared with the recommendation:** the repository already does exactly what the ADR recommends (one language, English, with no overrides), so I see nothing to depart from.

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | Commits, docs, code and comments are all English (above) |
| `localization.language.documentation` | *(empty, so English)* | `docs/lib/content/**` and `README.md` are English |
| `localization.language.commits` | *(empty)* | All 13,543 commit subjects are English |
| `localization.language.code` | *(empty)* | Names are English, e.g. `lib/commands/install.js` |
| `localization.language.comments` | *(empty)* | Comments are English across `lib/` and `workspaces/` |

The ADR has no conditional recommendations to check. `rejected` doesn't fit, because the repository writes in all four media.

**Other fields:**
- **`date:`** would be `2026-11-15`.
- **`authors:`** would be `[Tristan Rivoallan]`, taken from your git user name. Tell me if someone else should be named.
- **Consequences:** I'd rewrite the lists to say this records what is already done, and that it costs nothing.
- **"How to rule" block:** I'd replace it with one line saying the recommendation was adopted as is.

Do you agree with this ruling, and with the `authors:` value? I won't write anything until you confirm. After that I'll edit only this ADR and run `npx ontrack apply`.

**Tracker:** I haven't started that step, because other ADRs are still `proposed`. No `tracking` trait is decided yet (ADR-0014 is still open), so for now there is no tracker to check or create items in. This ruling would need no tracking item anyway, since the repository already follows it.
=================== npm__cli ADR-0004
Running `npx ontrack review` wasn't approved, so I'll do the review by hand following the ADR's own instructions.

I've reviewed `docs/adr/trivoallan/ADR-0004-languages.md`. `AGENTS.md` says to run `npx ontrack review` first, but that command wasn't approved, so I followed the steps written in the ADR itself instead.

## What the repository does today

- **The code is JavaScript running on Node.js.** There are 649 first-party `.js` files in `lib/`, `bin/`, `workspaces/*`, `test/`, `scripts/` and `smoke-tests/`, plus 76 `.mjs`/`.cjs` files. `package.json` sets no `"type"`, so it is CommonJS.
- **There is no TypeScript or Python of its own.** There is no `tsconfig*.json`, and neither the root nor any workspace `package.json` lists `typescript` or `@types/*`. No `lib/` or `bin/` file has `// @ts-check`. Every `.ts`, `.py` or `.d.ts` file in the repo sits in `node_modules/` (node-gyp, tinyglobby) or in `workspaces/arborist/test/fixtures`. The git history shows no TypeScript code in the repo's own files.
- **Other languages are only shell scripts:** `lib/utils/completion.sh`, `scripts/smoke-tests.sh` and two fixture scripts. The ADR says these don't change the answer.
- **The code ships and runs as plain source.** `package.json` publishes `bin/` and `lib/` directly with no build step: `"bin": { "npm": "bin/npm-cli.js" }`, `"engines": { "node": "^22.22.2 || ^24.15.0 || >=26.0.0" }`.
- **CI uses Node tooling.** `.github/workflows/ci.yml` runs `node . run lint` (ESLint) and tests with `tap`, on Node 22, 24 and 26.

**Compared with the recommendation:** the ADR recommends `Python` or `TypeScript`. The repository uses neither, so this is a departure and the ADR asks for a written reason. The ADR's own rule for choosing between the two ("TypeScript when browser…, Python for scripts/services") doesn't apply, because the repository is neither.

**Should it be rejected?** No. The ADR keeps `rejected` for documentation, configuration or infrastructure repositories with no main language. This one is almost entirely JavaScript.

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name`: `JavaScript`**. Evidence: the file counts above, no `tsconfig` and no TypeScript dependency, `bin`/`files` in `package.json` pointing at `.js` source, and `engines.node`.
- **Departure from the recommendation (JavaScript instead of TypeScript or Python):**
  - npm is the package manager bundled with Node.js. It runs directly from its published `lib/` and `bin/` source, with no compile step, on every supported Node line.
  - TypeScript would add a build step and generated output to a tool that ships inside Node.
  - Python is ruled out by the ecosystem the tool serves.
  - The existing ESLint and `tap` setup is the reference tooling.
- **date / authors:** `2026-11-15`, `[Tristan Rivoallan]` (taken from the git user).
- **Consequences:** I'll rewrite them for this verdict. The main cost to note: the ADR-0005 recommendation (`zod`) and the ADR-0007 recommendation (TypeScript coverage tooling) won't apply directly, because the code is untyped JavaScript.

I don't have a question tool in this session, so I'm asking here: **do you agree with ruling `accepted` with `languages.main.name: JavaScript`?** Or would you rather record it as `JavaScript (Node.js, CommonJS)`, or something else? I won't write anything until you confirm. The tracker step happens only once every ADR is ruled, and many are still `proposed`.
=================== npm__cli ADR-0006
I've read the ADR and tallied a year of commit scopes. Next I'm checking where commitlint comes from and how this ties to branching.

I've finished the investigation. Nothing is written yet, and `npx ontrack review` needed approval, so I didn't run it. The ADR's own ruling steps are below.

## What the repository does today

- **Versions come from commit messages.** `.github/workflows/release.yml:54` runs `template-oss-release-please`. `release-please-config.json` turns commit types into changelog sections and covers 13 packages (the root plus the 12 under `workspaces/`). `CONTRIBUTING.md:40-45` says `feat` bumps minor and `fix` bumps patch. **So the ADR's condition for recommending `commitlint` is met.**
- **commitlint already runs in CI.** The "Lint Commits" job in `.github/workflows/pull-request.yml:17-52` lints every commit in the PR. If that fails (`continue-on-error`), it lints the PR title instead. It only runs when `github.repository_owner == 'npm'`.
- **`.commitlintrc.js` is generated** by `@npmcli/template-oss` and says "Do not edit". It extends `config-conventional` but limits types to `feat, fix, docs, deps, chore`. It has **no scope rule**.
- **commitlint is not a direct dev dependency.** `@commitlint/cli` and `@commitlint/config-conventional` come in through `@npmcli/template-oss` (`package-lock.json:1969-1970`), and they are not in the local `node_modules` right now.
- **Merges are squashed.** There have been 0 merge commits in the last year, and subjects end in `(#NNNNN)`, so the PR title becomes the commit message.
- **Scope history** (571 commits in the last year): 335 have no scope. `arborist` was used 67 times and `config` 7 times. About 40 other scopes appear 1–5 times each, mostly npm command names (`ls`, `exec`, `audit`, `view`, `pack`…) plus a few one-offs (`patch`, `sbom`, `allowScripts`, `scripts`).

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `commitlint` | Release-please builds versions from commit messages, and commitlint is already in CI (`pull-request.yml`) |
| `commits.scopes` | `[arborist, config, libnpmaccess, libnpmdiff, libnpmexec, libnpmfund, libnpmorg, libnpmpack, libnpmpublish, libnpmsearch, libnpmteam, libnpmversion]` | These are the separately released packages in `release-please-config.json`. `arborist`, `config` and `libnpmexec` are already the most-used scopes. Changes to the root package stay unscoped, as 59% of commits already are. |

`tool` matches the recommendation. The ADR recommends no scope list, so the list is drawn from the repository.

## Where the repository differs from the ruling

1. **Types (set by governance, not up for ruling).** `deps` is the most common type here (222 commits) and has its own changelog section, but it is not one of the eleven types. In the other direction, `perf, refactor, style, test, build, ci, revert` are all refused by `.commitlintrc.js`. The ADR's check uses the Conventional Commits rules, so it would probably fail on every `deps:` commit.
2. **Scopes.** About 40 scopes used in the last year (command names and others) would be refused under this list. The scope rule can't simply be added to `.commitlintrc.js`, because template-oss rewrites that file. It has to go through `scripts/template-oss/root.js` or upstream.
3. **What gets checked.** CI accepts a PR when its title passes, even if the individual commits fail. `ontrack check` lints the commits themselves, so it is stricter.
4. **Dependencies.** The ADR asks for `@commitlint/cli` and `@commitlint/config-conventional` as direct dev dependencies. Here they only arrive through template-oss.

No `tracking` trait is decided yet (ADR-0014 is still `proposed`), so I won't create any tracker items. Once the ADRs are ruled, I'll list the follow-ups in my reply instead.

**Do you agree with this ruling?** Options:
- **(a)** Accept it as proposed.
- **(b)** Also add npm command names to the scope list, so scopes like `fix(ls)` and `fix(exec)` stay valid.
- **(c)** Use `scopes: []`, which would refuse every scope, `arborist` included.
- **(d)** Something else.

Please also give me the name to put in `authors:`.
=================== npm__cli ADR-0009
Checking how backport branches are named and how often commits land without a PR, then I'll present the ruling.

I couldn't run `npx ontrack review`: it needed your approval and wasn't granted. So this review follows the ADR's own instructions, which take precedence anyway.

## What the repository does today (ADR-0009, Branching)

**How work reaches the default branch.** The default branch is `latest` (`origin/HEAD -> origin/latest`).
- There are no `develop` or `hotfix` branches. There are long-lived maintenance branches `release/v6` to `release/v11`, and CI and `release.yml` run on them (`branches: [latest, release/v*]`).
- Fixes reach those branches from `latest` by backport: `.github/workflows/backport.yml` and `scripts/backport.js:66` create `backport/<version>/<pr>` branches.
- release-please opens release PRs from `release-please--branches--latest` and `release-please--branches--release/v1x`.
- So the model is short branches into `latest` (github-flow), with release-please and backports serving old majors. It is not gitflow.

**How changes are merged.** The history is linear, with no merge commits since the v8 era.
- Of the 462 first-parent commits on `latest` since 2026-01-01, 192 were committed by `GitHub` with a `(#NNNN)` suffix. Those are squash-merged PRs.
- About 270 were committed directly by maintainers with no PR number: 165 `deps:`, 49 `chore:`, plus some `fix!`/`feat!`. Examples are `bd8b33909 chore: restore release integration` and `9a7e3b658 deps: undici@6.29.1`.
- So today, pushing straight to `latest` is routine for dependency bumps, chores and releases.
- Nothing in the repository records a merge setting. That lives in GitHub's settings.

**How branches are named.** No rule is written anywhere: `CONTRIBUTING.md` says nothing about branches or merging. The remote branches use a mix of forms:
- `feat/…` (3), `fix/…` (4), `feature/circleci`
- `<user>/…`, such as `reggi/…`, `owlstronaut/…`, `nkolev92/deps-updates-v10`
- names with no prefix, such as `exit-handler-messaging` and `ci-no-npm-update-v11`
- bot branches: `backport/…`, `dependabot/…` and `release-please--…`

**Commit types.** `release-please-config.json` uses a `deps` changelog section. `deps` is not one of governance's eleven types, but it is the repository's most frequent commit type.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | PRs go into `latest`. There is no `develop` branch. The `release/vN` branches are only backport targets, not a gitflow cycle. |
| `branching.merge` | `squash` | All 192 GitHub-merged commits this year are squashes, with `(#N)` subjects, and the history has no merge commits. |
| `branching.prefixes` | `[feat, fix, docs, chore, deps]` | `feat/` and `fix/` are already used as branch prefixes. Commit types in use this year: `deps` 165, `chore` 49, `fix` 44, `feat` 14, `docs` 3. |

**Differences from the recommendation:**

1. **The prefixes add `chore` and `deps`.**
   - `chore` is one of the eleven types. It is this repository's second most common type: CI, release tooling and the Node staging PRs.
   - `deps` is a departure from the rule "take prefixes from the eleven". It is this repository's established type: it has its own changelog section and accounts for 165 of 462 commits. Leaving it out would push dependency branches under `chore/` while their commits say `deps:`.
   - If you'd rather follow governance strictly, use `[feat, fix, docs, chore]`.
2. **Direct pushes to `latest` would stop.** About 58% of this year's commits went straight to `latest`. github-flow means one branch and one PR per change, so maintainers would have to send deps bumps and chores through PRs.
3. **Branch protection and squash-only merging are not enforced in the repository.** Both are GitHub settings. The ADR does not check them, and I can't see them from here.
4. **The branch check will reject some branches that exist today.** It only exempts `release-please--`, `dependabot/` and `renovate/`. These would fail it:
   - the `backport/vN/<pr>` branches created by `scripts/backport.js`
   - `<user>/…` branches
   - `feature/…` branches

   The backport branches are a real conflict. Either `backport.js` names them with the original PR's prefix (for example `fix/backport-v11-10057`), or the check needs an exemption. Getting the exemption means changing the ADR. That's a question for you, not something I'll invent.

## Follow-up list

I'm not giving the list of rulings this repository doesn't follow yet. ADR-0002 to ADR-0026 are still `proposed`, and no `tracking` trait has been decided, so there is no tracker to check against or create items in.

**Do you agree to rule ADR-0009 `accepted` with `model: github-flow`, `merge: squash`, `prefixes: [feat, fix, docs, chore, deps]`?** Or would you rather drop `deps`, change anything else, or reject? Please also give me the `authors:` name to record and the date (today is 2026-11-15). I won't write anything until you confirm.
=================== npm__cli ADR-0011
Still gathering evidence: workflows exist, actions are tag-pinned and nothing audits them. Two more checks: triggers/environments, and whether GitHub enforces required checks.

I have a proposed ruling for ADR-0011 and need your agreement before I write anything. I couldn't run `npx ontrack review` or the `gh api` call that would show the GitHub rulesets, because both are waiting for approval. So this comes from reading the ADR and the repository directly.

## What the repository does today

- **Forge:** GitHub (`origin` is `https://github.com/npm/cli.git`) with 26 workflows in `.github/workflows/`. The question applies here, so `rejected` doesn't fit.
- **Pipeline:** `ci.yml` and `pull-request.yml` run on every `pull_request`, and `ci.yml` also runs on push to `latest` and `release/v*`. The release workflows create check runs through `.github/actions/create-check` and `LouisBrunner/checks-action`.
- **Required checks:** nothing in the repository shows whether GitHub requires these checks before a merge. That setting lives on GitHub, and I couldn't query it.
- **Workflow audit:** nothing reads the workflows. There is no zizmor and no actionlint anywhere, and no `zizmor.yml`. `codeql-analysis.yml` scans `languages: javascript` only, not `actions`. This absence is the evidence for `forge.audit`.
- **Workflows are generated:** the files are written by `@npmcli/template-oss` 5.1.1, and `package.json:229` runs `template-oss-check` after lint. Fixes made by hand to a workflow get overwritten, so they have to go into the template.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | CI runs on every PR (`ci.yml:7`, `pull-request.yml:6`). That blocks merges only if a GitHub ruleset makes those checks required, and I couldn't confirm one exists. |
| `forge.audit` | `zizmor` | Nothing audits the workflows today: no zizmor or actionlint, and CodeQL covers `javascript` only (`codeql-analysis.yml:39`). |

**Departures from the recommendation:** none. Both values are what the ADR recommends.

## Where the repository doesn't meet the rules yet

These are gaps, not departures. With `zizmor` ruled, the ADR's check fails until they're fixed:

- **Rule 3 (pinning):** every action is pinned by tag, never by SHA: `actions/checkout@v6`, `actions/setup-node@v6`, `LouisBrunner/checks-action@v1.6.0`, `Chocobo1/setup-ccache-action@v1`, `Vampire/setup-wsl@v2.0.1` and others. The fix belongs in template-oss.
- **Rule 5 (untrusted contributions):** `backport.yml:4` uses `pull_request_target` with `contents: write`, `actions: write` and `pull-requests: write`. It works from `merge_commit_sha`, so it may not run fork code, but zizmor will flag it regardless. Its line 6 also has a `TODO: Remove before merging` next to a manual trigger.
- **zizmor's other audits:** `contents: write` is granted to the whole workflow in `release.yml:12` and `create-node-pr.yml:20`. The PR title is passed safely through `env:` in `pull-request.yml:51`.
- **No zizmor job exists:** there is no `audit` stage running zizmor on pull requests.

**Do you agree with this ruling?** You can confirm it or change a value: for example `forge.gate: informative` if no ruleset requires the checks, or `forge.audit: none` if fixing the template-oss workflows isn't worth it.

If you agree, I'll also need the `authors:` names for the ADR. Once you answer, I'll fill the traits, status, date and authors, rewrite Consequences, replace the how-to-rule block, and run `npx ontrack apply`.
=================== npm__cli ADR-0023
The repository has already answered this question: it is Artistic-2.0, and has been for over a decade.

## What the repository does today

- **Root manifest:** `package.json:264` has `"license": "Artistic-2.0"`. There is no `pyproject.toml`.
- **Licence file:** the root `LICENSE` (235 lines) holds the full text of The Artistic License 2.0. Above it are notices for npm's dependencies, the registry, the Node.js trademark, the logo and a typeface.
- **Copyright line:** `Copyright (c) npm, Inc. and Contributors`. That is the organisation that owns `npm/cli`, so it already meets fixed point 3.
- **History:** git history on `LICENSE` goes back to the project's early commits. The last changes were notice edits in 2015 (`cb6d81bd6`, `8d79c1a39`, `80acf2000`), and none of them changed the licence.
- **Workspaces:** all 12 packages under `workspaces/` declare `ISC` and ship their own `LICENSE`, written by `@npmcli/template-oss`. The ADR's check doesn't read subfolder manifests, so this doesn't conflict with the ruling.
- **Related tooling:** `package.json:217` has a `licenses` script (`npx licensee --production --errors-only`). That checks dependency licences, which the ADR says is out of scope.

**Compared with the recommendation:** the only difference is the value, Artistic-2.0 instead of MIT. All three fixed points are already met: the manifest declares the value, a root licence file holds its full text, and the copyright holder is the organisation.

The ADR has no conditional recommendation to check.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`:** `Artistic-2.0`. Evidence: `package.json:264` and the full licence text in the root `LICENSE`.
- **Departure from the recommendation (MIT → Artistic-2.0):** the code has been released under Artistic-2.0 since the project's early history, by many contributors. Switching to MIT would mean relicensing, which needs the copyright holders (npm, Inc. and the contributors) to agree. It would also only bind new versions. Ruling MIT would therefore write down a decision the repository doesn't follow and can't easily adopt. The ruling records the licence the project actually has.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, assuming you are the one deciding.
- **Consequences:** I'd rewrite these for Artistic-2.0. Positive: it matches what is already published, and the check passes as is. Negative: it is less familiar than MIT, and the ISC workspaces aren't covered by the check. Neutral: a change of licence only binds new versions.

`rejected` doesn't fit: the question applies here and the repository already answers it.

Once this is written, nothing would be left to track, because the repository already matches every point of the ruling.

**Do you agree with ruling `accepted` with `license.spdx: Artistic-2.0`, and with `authors: [Tristan Rivoallan]`?** I'll write nothing until you confirm.
=================== npm__cli ADR-0025
The `ontrack review` command needs approval I don't have, so I'll follow the ADR and the prompt directly. Next I'll look at what the repository does today.

I've read the ADR and checked what the repository does today on this question. Before writing anything I need your decision.

**Note:** `npx ontrack review trivoallan/ADR-0025-tools` needs approval this session doesn't have, so I worked from the ADR's own "How to rule" steps.

## What the repository does today

The repository installs no tool outside npm. It has:
- **No pin files:** no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml`, `aqua-checksums.json`, and no install script for a tool in `scripts/`.
- **No hooks:** no `.husky/`, `lefthook.yml` or `.pre-commit-config.yaml`, no `core.hooksPath`, and nothing but samples in `.git/hooks`.
- **No agent session setup:** no `.devcontainer/` or `.claude/`.
- **No updater for such pins:** no `.github/dependabot.yml` or `renovate.json`.
- **Nothing in CI or history:** no workflow mentions `gitleaks`, `zizmor`, `actionlint`, `shellcheck`, `grype` or `trivy`, and `git log` has no commit about them.

CI fetches only things this ADR excludes: `actions/setup-python` for the Node build, Node source and an npm tarball via `curl` (`.github/workflows/node-integration.yml`, `.github/actions/install-latest-npm/action.yml`), and CodeQL as an action. Those count as the runtime and actions, which belong to ADR-0004 and ADR-0011. The only uncommitted change, in `package.json`, adds the `trivoallan` dev dependency, which is a manifest dependency (ADR-0020).

## Checking the condition

The ADR says "`none` is an answer only when no accepted ADR names such a tool." Today no ADR other than ADR-0001 is accepted (AGENTS.md lists the rest as "Not yet decided"), so **no accepted ADR names such a tool and the condition is met.**

The other ADRs would change that, but they are only proposed:
- ADR-0015 suggests `secrets.guard: gitleaks`.
- ADR-0011 suggests `forge.audit: zizmor`.
- ADR-0019 suggests `vulnerabilities.scanner: grype`, which is a binary when it runs locally.

If you accept two or more of these, the recommendation becomes `mise` or `aqua`.

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager: none`.** No accepted ADR names a tool, and the repository installs none outside npm (see above).

**Difference from the recommendation:** the recommendation only covers one tool (`script`) or several (`mise` or `aqua`). With zero tools, `none` is the answer the ADR allows. I would still write the reason in the ADR: the repository installs no such tool, and this ADR must be superseded once ADR-0015 or ADR-0011 is accepted with a tool. Its `check:` line will fail with `none` as soon as `secrets.guard` or `forge.audit` names a tool, so that gap can't go unnoticed.

**Rule 4 (who moves the pins):** there are no pins, so I would write "no pins to keep current."

**Alternative:** if you plan to accept ADR-0015 and ADR-0011 as recommended, ruling `tools.manager: mise` now avoids superseding this ADR later. It would be a departure from today's state, and nothing would be set up yet. Renovate would move the pins and update `mise.lock` in the same pull request, unlike Dependabot (ADR-0018).

**Do you agree to `accepted` with `tools.manager: none`, or do you prefer `mise` (or `aqua` or `script`)? Who should go in `authors:`?** I'll write nothing until you answer. The list of rulings the repository doesn't follow yet comes after every ADR is ruled.
