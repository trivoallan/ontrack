=================== googleapis__release-please ADR-0002
I found no evidence against the recommendation. The README, `docs/*.md`, the source and comments in `src/`, and the last 300 commit subjects are all in English. I searched for accented characters and got only two hits, and neither is French: a typo in `src/github.ts:364` and a ⚠ symbol in `docs/manifest-releaser.md:372`. The project is public (googleapis) and most commits come from many English-language authors and the release-please bot.

**Proposed ruling: `accepted`, the recommendation as written**

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | README, docs, code, comments and commit history are all in English |
| `localization.language.documentation` | *(empty, uses default)* | `docs/` and the README are in English |
| `localization.language.commits` | *(empty, uses default)* | `git log` shows English Conventional Commits, e.g. `fix: commit author missing when using --include-commit-authors (#2911)` |
| `localization.language.code` | *(empty, uses default)* | the symbols in `src/` are in English |
| `localization.language.comments` | *(empty, uses default)* | the comments in `src/` are in English |

**Departures from the recommendation:** none.

The ADR's ruling steps also ask for `date:` (2026-11-15) and `authors:`. I'd use **Tristan Rivoallan**, your git user name, unless you want other names there. After writing, I'll update the Consequences lists, replace the instruction block with one line saying the recommendation is adopted as is, and run `npx ontrack apply`.

Do you agree with this ruling, including the author name?
=================== googleapis__release-please ADR-0004
I propose ruling **ADR-0004 Languages** as `accepted`, with the main language set to **TypeScript**.

**Trait**
- `languages.main.name: TypeScript`. The evidence:
  - All 151 source files under `src/` are `.ts`, and none are `.js`.
  - `tsconfig.json` exists, and `package.json` compiles with `tsc -p .` and lints with `gts check`.
  - The package ships compiled TypeScript: `"main": "./build/src/index.js"` and `"bin": "./build/src/bin/release-please.js"`.
  - The `.py` files are either test fixtures for the Python release strategy (`test/fixtures/**`, `test/updaters/fixtures/**`) or `owlbot.py`, a Google repository tooling script. They are secondary files and don't change the answer, as the ADR's Neutral note says.

**Departure from the recommendation (one, partial)**
TypeScript is one of the two recommended languages. But the ADR's tie-breaker says TypeScript is for code that runs in a browser or shares code between browser and server, and Python is for scripts and services that do neither. release-please never runs in a browser: it's a Node CLI and library published to npm. So the tie-breaker would point to Python. The reason to keep TypeScript anyway: the whole codebase and its tooling (tsc, gts, mocha/c8) are already TypeScript, and the package is distributed through npm. Switching would mean a full rewrite for no gain.

**What I'd write once you agree**
- **Frontmatter:** `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]` and the trait value.
- **Body:**
  - Rewrite the Consequences lists for this ruling.
  - Delete the "How to rule" block and put the departure's reason in its place.
  - Change the Status heading to "Accepted".
- **Then:** run `npx ontrack apply`.

The follow-up list of rulings the repository doesn't follow yet waits until every ADR is ruled. 25 are still undecided, so I'm not doing it now.

Do you agree with this ruling? You can also change the value, the authors or the departure wording.
=================== googleapis__release-please ADR-0006
The ADR's recommendation holds here, so I'd accept it with `commitlint`. I'm proposing a closed list of 47 scopes, taken from the names the code already uses. Nothing is written yet; I need your go-ahead first.

**Does the recommendation's condition hold?** The ADR recommends `commitlint` only if this repository generates its versions from commit messages. It does:
- `.github/release-please.yml` and `release-please-config.json` run release-please on this repository itself.
- The current version is tracked in `.release-please-manifest.json` (17.11.2).
- The history has 198 `chore(main): release …` commits.

**What enforces the format today:** only a request in `CONTRIBUTING.md:37` to title pull requests in Conventional Commits style. There is no commitlint and no hook. The checks required on `main` in `.github/sync-repo-settings.yaml` are `cla/google`, `docs`, `lint`, `test (18)` and `windows`, and none of them checks commit messages.

**Proposed ruling: `accepted`**

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `commitlint` | Versions come from commit messages, as shown above. Rebase merges are allowed as well as squash merges (`sync-repo-settings.yaml`), so individual commits reach `main` and should be checked one by one. |
| `commits.scopes` | the 47 scopes below | The history already uses scopes on about 600 commits. They have drifted in exactly the way the ADR describes: `node`/`nodejs`, `java-yoshi-mono-repo`/`yoshi-java-monorepo`/`java-monorepo`, `go-yoshi`/`yoshi-go`, `cargo-workspace`/`cargo-workspaces`, `test`/`tests`, `doc`/`docs`/`readme`. |

The proposed list:
- **Core areas:** `main`, `deps`, `deps-dev`, `cli`, `manifest`, `github`, `github-release`, `changelog`, `commit`, `config`.
  - release-please itself writes `chore(main)`, and Renovate and Dependabot write `deps` and `deps-dev`. These four must stay on the list or those automated commits will fail.
- **One scope per release strategy, named after its file in `src/strategies/` (`base` left out):** `bazel`, `dart`, `dotnet-yoshi`, `elixir`, `expo`, `go`, `go-librarian`, `go-yoshi`, `helm`, `java`, `java-yoshi`, `java-yoshi-mono-repo`, `krm-blueprint`, `maven`, `node`, `node-librarian`, `ocaml`, `php`, `php-librarian`, `php-yoshi`, `python`, `python-librarian`, `r`, `ruby`, `ruby-librarian`, `ruby-yoshi`, `rust`, `sfdx`, `simple`, `terraform-module`.
- **One scope per plugin, named after its file in `src/plugins/` (`workspace` left out):** `cargo-workspace`, `group-priority`, `linked-versions`, `maven-workspace`, `merge`, `node-workspace`, `sentence-case`.

**Departures from the recommendation:** none for `commits.tool`. The ADR makes no recommendation for `commits.scopes`. The list follows one rule: a scope is a core area, or the file name of a strategy or a plugin. A new strategy or plugin therefore needs its scope added to this list.

**Consequences I'd write into the ADR:**
- GitHub's "Revert" button produces `Revert "…"` messages, and commitlint will refuse them. People will need to retitle those as `revert: …`.
- When this ADR's check runs in CI, it may need `--from origin/main` if the CI checkout has no `origin/HEAD`.

**Other choice:** if 47 words feels too heavy to maintain, I could keep only the 10 core areas and fold every strategy into a single `strategies` scope. Filtering the history by language would then no longer work.

Do you agree with this ruling: `accepted`, `tool: commitlint`, and the scopes above? Should `authors:` be `[Tristan Rivoallan]` and the date 2026-11-15? Once you confirm, I'll update the ADR, run `npx ontrack apply`, and then list the rulings this repository doesn't follow yet.
=================== googleapis__release-please ADR-0009
I'm checking how this repo actually merges and names branches, and I have what I need.

I couldn't run `npx ontrack review trivoallan/ADR-0009-branching` because the command needed approval, so this proposal comes only from the ADR file and the repository.

## Proposed ruling for ADR-0009 (Branching): `accepted`

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | `.github/sync-repo-settings.yaml` protects `main` and requires 1 approving review, code-owner review and status checks. Every one of the last 300 commits on `main` came through a PR and ends in `(#NNNN)`. There is no `develop` branch and no release branches. `12.x` is an old maintenance branch, which doesn't make this gitflow. |
| `branching.merge` | `squash` (as recommended) | The last 300 commits contain no merge commits, and each is one commit per PR with a Conventional Commits subject. The repo settings turn merge commits off (`mergeCommitAllowed: false`). The docs already recommend squash-merge (commit "docs: add section about using squash-merge (#1916)"). |
| `branching.prefixes` | `[feat, fix, docs, chore, build, ci, test, refactor]` | **This departs from the recommendation**, explained below. The remote branches that already use a prefix use `feat/` and `fix/` (`feat/php-librarian`, `fix/java-yoshi-version-java-updates`). |

**Why the prefixes depart from `[feat, fix, docs]`:** a large share of the human-written PRs in this history are `chore`, `build`, `ci`, `test` or `refactor`. Some examples: `chore: remove legacy OwlBot configuration (#2897)`, `ci: zizmor fix for workflow file (#2829)`, `test: increase timeout for LocalGitHub tests (#2832)`, `refactor: consolidate … (#2805)`. With only three prefixes, that work would have no valid branch name. All five extra prefixes come from the eleven allowed commit types, as the ADR requires. I left out `style`, `perf` and `revert` because none of them appears in the history.

**Two things to know:**
- **Merge setting:** the forge also allows `rebaseMergeAllowed: true`. That doesn't conflict with `squash` as the ruling, but turning rebase merges off would make the forge match it.
- **Bot branches:** ADR-0012 (delivery) and ADR-0018 (dependencies) aren't ruled yet. Until they are, the ADR's check will fail branches made by tools, such as `release-please--branches--main--components--release-please` and Renovate's. The ADR itself says to rule those two ADRs with this one or before it. Existing unprefixed branches like `parthea-patch-1` and `fix-empty` would also fail the check.

Do you agree with this ruling, including the extended prefix list? If you'd rather keep the recommended `[feat, fix, docs]`, say so. Once you agree, I'll fill in the traits and set the status. I'll also need the name of the person who decided, for `authors:`. Then I'll set `date: 2026-11-15`, rewrite the Consequences section, record the reason for the prefix departure, and run `npx ontrack apply`.
=================== googleapis__release-please ADR-0011
I read the ADR and checked it against the repository. I found no evidence that the recommendation doesn't apply here, so I'm proposing to accept it unchanged.

**Does the question apply?** The ADR says to rule `rejected` only when the repository is on a forge other than GitHub. This one is on GitHub:
- `git remote -v` points to `https://github.com/googleapis/release-please.git`.
- The pipeline is GitHub Actions, in `.github/workflows/ci.yaml`.

There are also legacy Kokoro configs in `.kokoro/` (presubmit and continuous jobs for node12 and node14, both end-of-life). They target Node versions the Actions workflow no longer tests and don't replace it, so they don't change the answer.

## Proposed ruling: `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `.github/sync-repo-settings.yaml` protects `main` with `requiresStrictStatusChecks: true` and lists the required checks `docs`, `lint`, `test (18)` and `windows` (plus `cla/google`). This repo already means for a red pipeline to block merges. |
| `forge.audit` | `zizmor` | No workflow-audit tool is set up yet: nothing mentions zizmor or actionlint outside `node_modules` and `docs/`. But `ci.yaml` already follows zizmor's rules: every action is pinned by commit hash with the tag in a comment (`actions/*` included), every checkout sets `persist-credentials: false`, the workflow only has `permissions: contents: read`, and it doesn't use `pull_request_target`. So zizmor should pass with little or no change. |

**Departures from the recommendation:** none.

**Something you should know before ruling `blocking`.** In `sync-repo-settings.yaml`, `main` requires a check named `test (18)`. The `test` job in `ci.yaml` now runs only on `node: [22]`, so the check it reports is called `test (22)`. If GitHub's real ruleset matches this file, the required `test (18)` check never reports and merges are blocked or have to be bypassed. If it doesn't match, the file is out of date. The `12.x` branch rule has the same problem with `test (12/14/15)`. This doesn't change the ruling. It does mean `blocking` isn't reliably enforced until the required check names match the job names. It will show up as a tracking item.

**After the ruling, three things in this repo won't follow it yet** (this list gets finalised once every ADR is ruled):
- `[trivoallan/ADR-0011] forge.audit: add a zizmor job on pull requests`: no job runs zizmor yet.
- `[trivoallan/ADR-0011] forge.gate: align required status checks with CI job names`: required `test (18)` vs actual `test (22)`.
- I can't create these items: `AGENTS.md` lists ADR-0014 (Work tracking) as not yet decided, so there is no tracker. I'll give them as a list.

When you agree, I'll edit the ADR file:
- Set `forge.gate: blocking` and `forge.audit: zizmor`, set `status: accepted`, set `date: 2026-11-15`, and fill `authors:` with the name of the person who decided (I'd use Tristan Rivoallan unless you say otherwise).
- Delete the "How to rule" block and add one line saying the recommendation was adopted as is.
- Rewrite the Positive, Negative and Neutral consequences for this repo, including the check-name mismatch.

Then I'll run `npx ontrack apply` to update `AGENTS.md`.

**Do you agree with this ruling (`accepted`, `forge.gate: blocking`, `forge.audit: zizmor`), and should I list you as the author?**
=================== googleapis__release-please ADR-0023
The license is already settled in this repository, and it isn't MIT. That's the one place I'd depart from the ADR's recommendation.

**Evidence**
- `LICENSE` at the root contains the full text of the Apache License, Version 2.0.
- `package.json:30` already declares `"license": "Apache-2.0"`. It is the only root manifest; there is no root `pyproject.toml`.
- 151 files under `src/` carry the header `Copyright 20xx Google LLC … Licensed under the Apache License, Version 2.0`. So the copyright holder, Google LLC (the organisation that owns the repo), is already on record.

**Proposed ruling: `accepted`**

| Trait | Value | Evidence |
| --- | --- | --- |
| `license.spdx` | `Apache-2.0` | `LICENSE` (Apache 2.0 text), `package.json:30`, the 151 `src/` headers |

**Departure from the recommendation:** `Apache-2.0` instead of `MIT`. The project has been released under Apache-2.0 since it started. Changing it would only affect new versions, and that's a decision for the copyright holder, not this ADR. The ADR itself lists Apache-2.0 as the answer when a patent grant matters. Both checks the ADR runs (the root manifest matches, a licence file is committed) already pass, so nothing in the repo needs to change.

Do you agree with this ruling? If so, whose names should go in `authors:` (the people deciding, without email addresses)? I'll write nothing until you confirm.
=================== googleapis__release-please ADR-0025
I've read `docs/adr/trivoallan/ADR-0025-tools.md` and here is my proposed ruling. Nothing is written yet.

## The condition, checked

The recommendation is `script` if there is one tool and `mise` or `aqua` if there are several. `none` is only allowed when no accepted ADR names such a tool.

- **No accepted ADR names a tool yet.** Running `grep '^status:' docs/adr/trivoallan/*.md` shows that only ADR-0001 is `accepted`. ADR-0011, ADR-0015 and ADR-0019 are all still `proposed`.
- **The repository has no such tool installed today.** `.github/workflows/ci.yaml` only runs `npm ci` and pinned actions. The `.kokoro/*.sh` scripts only run `npm install`. There's no `mise.toml`, `aqua.yaml`, `.tool-versions`, install script or pre-commit hook.
- **The pending ADRs would name three tools if ruled as recommended.** These are `forge.audit: zizmor` (ADR-0011:69), `secrets.guard: gitleaks` (ADR-0015:83) and `vulnerabilities.scanner: grype` (ADR-0019:101). Three counts as "several".
- **Renovate already runs here.** `renovate.json` extends `config:best-practices`. Its `mise` manager updates `mise.lock` along with the version. For aqua, the ADR's own table says the checksum file needs a separate step.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `tools.manager` | `mise` | Several tools are expected: zizmor, gitleaks and grype. Renovate is already the updater (`renovate.json`), and it moves the version and the checksum in the same PR, which covers rule 4. `ontrack-engineering-check ADR-0025` can only check the pins with `mise`. |

**Departures from the recommendation:** none. `mise` is the recommended value for several tools. I chose it over `aqua` because Renovate is already set up here.

**Text to add for rule 4:** "Renovate's `mise` manager (already enabled via `renovate.json`) proposes each tool's version bump and updates `mise.lock` in the same pull request. The mise binary is pinned by `version:` on `jdx/mise-action` (by SHA) and `MISE_VERSION` for local installs."

**Caveats:**
- **`none` would also be valid today**, because no accepted ADR names a tool yet. Choosing `mise` assumes ADR-0011, ADR-0015 and ADR-0019 will name their tools. If they end up naming only one, `script` would fit better, and changing that would mean superseding this ADR.
- **The updater choice may conflict.** ADR-0018 recommends `dependabot`, but this repository uses Renovate. `mise` only fits if ADR-0018 is ruled `renovate`. I'd propose that ruling when we get to ADR-0018.

**To fill in:** `date: 2026-11-15`, and `authors: [Tristan Rivoallan]` unless other people also decided this.

Do you agree with `accepted`, `tools.manager: mise`? Or would you rather have `none` for now, or `aqua`? Once you agree, I'll edit the ADR as it says to (frontmatter, Consequences, and replacing the how-to-rule block) and run `npx ontrack apply`.
