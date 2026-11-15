=================== expressjs__express ADR-0002
I couldn't run `npx ontrack review`, which AGENTS.md asks for, because the command needed approval that wasn't given. So I worked from the ADR's own "How to rule" steps instead.

## Proposed ruling: `trivoallan/ADR-0002` Localization: **accepted**, as recommended

I found nothing in the repository that argues against the recommendation. Everything is written in English, and the project is Express, which has readers all over the world.

| Key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | `Readme.md`, `History.md`, `lib/` and `test/` are all in English. The last 15 commits (`git log`) use English conventional-commit messages. A search for French accented letters outside `node_modules`/`docs` found one file, `test/res.attachment.js`, which tests a non-ASCII filename rather than containing French text. |
| `documentation` | *(empty, uses default)* | same as above |
| `commits` | *(empty, uses default)* | `git log` messages such as `deps: body-parser@^2.4.0 (#7563)` |
| `code` | *(empty, uses default)* | English names throughout `lib/` |
| `comments` | *(empty, uses default)* | English comments in `lib/` (for example #7512 fixes typos in lib comments) |

- **Departures from the recommendation:** none. The ADR will say in one line that the recommendation was adopted as is.
- **Other fields:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from the git user name with no email. I'll rewrite the Consequences lists for an English-only open-source project and delete the "How to rule" block.

**Do you agree with this ruling?** You can also change the author list. Once you say yes, I'll edit only this ADR and then run `npx ontrack apply`, which needs your approval.

Many ADRs in AGENTS.md are still undecided, including the `tracking` trait, so I'll leave out the list of rulings the repository doesn't follow yet for now.
=================== expressjs__express ADR-0004
I'm proposing a ruling for ADR-0004 (Languages) and have written nothing yet. `npx ontrack review` needed an approval that wasn't given, so this review rests on the ADR file and the repository alone.

**Recommendation:** the ADR recommends `Python` or `TypeScript`, and TypeScript when the code runs in a browser or shares code between browser and server.

**The recommendation doesn't fit here.** Express is plain JavaScript:
- There are no `.ts`, `.mts` or `.cts` files in `lib/`, `test/` or `examples/`, and no `tsconfig*.json`.
- `package.json` publishes the source as written (`"files": ["index.js", "lib/"]`) with no build step, and only asks for `"engines": { "node": ">= 18" }`.
- The tooling is JavaScript tooling: `eslint`, `mocha`, `nyc` and `supertest`.

### Proposed ruling

- **status:** `accepted`
- **`languages.main.name`:** `JavaScript`. Evidence: `index.js` and `lib/*.js` (`application.js`, `express.js`, `request.js`, `response.js`, `utils.js`, `view.js`), and the dev tooling in `package.json`.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, taken from the git user.

**Departure from the recommendation, and its reason:** I'd choose JavaScript over TypeScript. Express is a widely used library that ships its source exactly as written, with no build step, and its types come from outside this repository (`@types/express`). Switching to TypeScript would add a compile step and turn the published files into build output. That would rewrite the whole codebase for no gain to users, who already get types.

There are no grounds to rule `rejected`: this is a code repository, so it has a main language.

**Do you agree with this ruling?** If you do, I will:
1. Fill the trait, status, date and authors in the ADR.
2. Delete the "How to rule" block and write the justification above in its place.
3. Rewrite the Consequences section for this verdict.
4. Run `npx ontrack apply`.

You can also change the value or the authors first.
=================== expressjs__express ADR-0006
I couldn't run `npx ontrack review` because it needs your approval, so I followed the ADR's own "How to rule" section instead.

## Proposed ruling: ADR-0006 Commits → `accepted`

**On the recommendation:** the ADR recommends `commitlint` only if this repository generates its versions from commit messages. It doesn't. Releases are done by hand:
- **Release commits are manual.** The `5.3.0` commit (`cf6722bf`, #7468) changes only `package.json` and `History.md`.
- **The changelog is hand-written.** `History.md` is prose sorted by theme ("🐞 Bug fixes", "🚀 Improvements"), not text generated from commit messages.
- **Publishing starts from a manual GitHub release.** `.github/workflows/npm-publish.yml:4-6` runs on `release: published` and reads the version from `package.json`.
- **No release tool is set up.** There's no semantic-release, release-please, changesets, standard-version or commitlint config anywhere in the repo.

So the premise fails, and the ADR itself says `none` is then just as good.

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `none` | Versions are set by hand (above). Review already keeps the convention: most recent subjects follow it. |
| `commits.scopes` | `[deps, deps-dev]` | Dependabot (`.github/dependabot.yml`) writes `build(deps)` and `build(deps-dev)`. Those are 58 of the last 300 subjects. People also use `deps` by hand (`fix(deps)` ×15, `feat(deps)` ×5). The other scopes are one-offs with no stable vocabulary: `res.send` ×2, `res.location`, `buffer`, `devdeps`, `test`, `refactor`. The ADR advises "not one more". |

**Departures from the recommendation:**
- **`tool: none` instead of `commitlint`:** versions and `History.md` are written by hand, so an off-format message can't produce a wrong version.
- **Scopes:** the ADR recommends no list. This one is taken from the history and Dependabot's output.

**Things I'd raise in the follow-up list, not in this ruling:**
- **`deps:` used as a type.** About ten recent subjects start with it (for example `deps: body-parser@^2.4.0`), but it isn't one of the eleven governance types. With `build(deps)` already in use, the in-scope spelling would be `build(deps): …`.
- **Scopes used as areas.** A few subjects put the area in the scope, like `fix(docs)` and `fix(ci)`, where the type would be `docs:` or `ci:`.

Once you agree, I'll do all of this in the ADR:
- fill in the traits and set `status: accepted`
- set `date: 2026-11-15` and the `authors:` names (tell me which names to use)
- rewrite the Consequences lists
- replace the "How to rule" block with the reasons for the departures above
- run `npx ontrack apply`

**Do you agree with `accepted`, `tool: none`, `scopes: [deps, deps-dev]`? Or would you rather have `scopes: []` or a different list?**
=================== expressjs__express ADR-0009
I couldn't run `npx ontrack review`: the call needs your approval. So I worked from the ADR file and the repository. Here is the ruling I propose for **ADR-0009 Branching**.

**Status: `accepted`**

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | Everything reaches `master` through a pull request: every recent commit ends in `(#NNNN)`, e.g. `43fca52d deps: body-parser@^2.4.0 (#7563)`. Changes live on short topic branches like `origin/feat/list-routes-subapps` and `origin/fix/hostname-host-header-injection`. There is no `develop` branch on the remote, so this isn't gitflow. |
| `branching.merge` | `squash` (as recommended) | `git log --merges --since=2025-01-01 master` returns nothing. History is linear, one commit per PR, titled after the PR. That's GitHub's squash merge. |
| `branching.prefixes` | `[feat, fix, docs, test]` | `feat/`, `fix/` and `test/` are already used as branch prefixes (`origin/test/subapp-routing-settings-inheritance`). `docs:` is one of the most common commit types on `master`. |

**Departures from the recommendation**
- **Adds `test` to `prefixes`.** The repository already uses it as a branch prefix and as a commit type (`1c6f1b0f test: expand coverage…`), and it is one of the eleven allowed types.

**Caveats (no change to the values)**
1. **Maintenance and release lines.** `4.x` and `5.x` are long-lived, CI runs on them (`.github/workflows/ci.yml:5-10`), and there's a `release/4.22.3` branch. This is still github-flow with maintenance lines. But a PR opened from `release/…` would fail the `check:`, because `release` isn't one of the commit types. Releases would need to come from a prefixed branch, or the line would need `--branch` handling.
2. **Personal and fork branches.** Many existing branches use the author's name as prefix (`ulises/6x-*`, `bsebas/…`), and Express takes a lot of PRs from forks whose branch names it can't control. Once this is accepted, those PRs fail the check.
3. **Dependabot branches.** Dependabot is configured (`.github/dependabot.yml`), so its `dependabot/…` branches pass only once ADR-0018 is ruled. Rule it with this one or before it.
4. **CI configuration.** `ci.yml` and `legacy.yml` still trigger on a `develop` branch that doesn't exist. It's harmless leftover config.

**On ruling** I would fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`. I would also rewrite the Consequences for squash and fork contributions, and replace the instructions block with the reason for the `test` departure. Then I'd run `npx ontrack apply`, which also needs your approval.

The tracker step at the end doesn't apply yet: no `tracking` trait is decided (ADR-0014 is open).

Do you agree with this ruling, or do you want to change something, for example drop `test`, or add `ci`, `build` or `chore`?
=================== expressjs__express ADR-0011
Here is my proposed ruling for `docs/adr/trivoallan/ADR-0011-forge-and-ci.md`. I haven't written anything yet.

I couldn't run `npx ontrack review trivoallan/ADR-0011-forge-and-ci`, which AGENTS.md says to use, because it needs approval in this session. So I followed the ruling steps written in the ADR itself (lines 155–170).

**Proposed status: `accepted`**, keeping the recommendation as it stands. I found nothing in the repository that argues against it:
- **Forge:** `git remote -v` points to `github.com/expressjs/express`, so `rejected` doesn't apply.
- **Pipeline:** there are five workflows in `.github/workflows/` (`ci.yml`, `codeql.yml`, `legacy.yml`, `npm-publish.yml`, `scorecard.yml`), so `none` doesn't apply either.

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `ci.yml` runs `lint`, `test` and `coverage` on every `pull_request` and on pushes to `master`. Nothing in the repo says a red run is acceptable. I couldn't confirm that a ruleset makes these checks required: that's a GitHub setting, and my `gh api …/rules/branches/master` call also needed approval. |
| `forge.audit` | `zizmor` | The workflows already follow zizmor's rules: every `uses:` is pinned by SHA with the tag in a comment, `actions/*` included; checkouts set `persist-credentials: false`; permissions are `contents: read` at workflow level, widened only per job; there's no `pull_request_target`. No zizmor job or audit tool exists yet. `codeql.yml` doesn't analyse the `actions` language, and the ADR says that wouldn't be enough anyway. |

**Departures from the recommendation:** none.

The rest of the edit would be:
- set `date: 2026-11-15`;
- fill `authors:` with the names of the people who decided;
- rewrite the Consequences lists;
- replace the "How to rule" block with one line saying the recommendation is adopted as is;
- run `npx ontrack apply`.

**Do you agree with `accepted` / `forge.gate: blocking` / `forge.audit: zizmor`?** If so, please also tell me the names for `authors:` (no email addresses). It would also help if you allowed the `gh api` call, so I can check whether a ruleset already makes the CI checks required.
=================== expressjs__express ADR-0023
The ADR recommends `MIT`, and this repository already uses MIT, so nothing here argues against it. I couldn't run `npx ontrack review trivoallan/ADR-0023-license`, which AGENTS.md asks for, because the command needs your approval. This proposal is based on the ADR file and the repository alone.

## Proposed ruling: ADR-0023 License

**Status:** `accepted`

**Traits:**
- `license.spdx: MIT`. Line 1 of the root `LICENSE` file reads "(The MIT License)", and `package.json:15` already declares `"license": "MIT"`. There is no `pyproject.toml`.

**Departures from the recommendation:** none. The ADR gets the one line "Adopted as recommended."

**The ADR's fixed requirements:**
1. The manifest declares the value: `package.json` says `MIT`. ✅
2. A licence file is at the root: `LICENSE` holds the full MIT text. ✅
3. Copyright holder: `LICENSE` keeps its existing copyright lines (TJ Holowaychuk, Roman Shtylman, Douglas Christopher Wilson). I won't change them.

**Other fields to fill when ruling:**
- `date: 2026-11-15`
- `authors:` the people who decide. I'd put `[Tristan Rivoallan]` unless you tell me otherwise.
- I'll also rewrite the Consequences section for MIT and remove the "How to rule" block, as the ADR instructs.

**Rulings this repository doesn't follow yet:** none for this ADR. Both checks the ADR describes already pass. No `tracking` trait is decided in AGENTS.md (ADR-0014 is still open), so there's no tracker to create items in either way.

Do you agree to accept ADR-0023 with `license.spdx: MIT` and `authors: [Tristan Rivoallan]`? Once you confirm, I'll write the ADR and run `npx ontrack apply`, which also needs your approval.
=================== expressjs__express ADR-0025
I couldn't run `npx ontrack review trivoallan/ADR-0025-tools` because the command needed approval that wasn't given. So I went by the ADR's own "How to rule" section, which takes precedence anyway.

## Proposed ruling for ADR-0025: Tools outside the package manager

**Status: `accepted`, with `tools.manager: none`**

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `tools.manager` | `none` | The ADR says "`none` is an answer only when no accepted ADR names such a tool." That condition holds. Only ADR-0001 has `status: accepted`; every other ADR, including ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`), is still `proposed`. The repository has no `mise.toml`, `.tool-versions`, `aqua.yaml`, git hooks, devcontainer or `scripts/`. No workflow installs gitleaks, zizmor, actionlint or any other binary through brew, curl or a checksum. |

**Departure from the recommendation.** The ADR recommends `script` for one tool and `mise` or `aqua` for several. With no tool named, neither applies, and a script or manager would pin nothing. **Rule 4 (what keeps the pins current):** nothing yet, because there are no pins.

**This ruling has to be revisited.** If ADR-0015 or ADR-0011 is later accepted with a tool value (such as `gitleaks` or `zizmor`), `ontrack check` fails ADR-0025 under `none`. The ADR then has to be superseded with `script` (one tool) or `mise` (several). If you'd rather prepare for that now, `script` is the alternative. It's the ADR's own recommendation for one tool, but it would sit empty until a tool is named.

**Seen but out of scope.** Two workflows install binaries without a version pin: `ci.yml:102` and `legacy.yml:86` run `apt-get install lcov`, and `npm-publish.yml:35` installs `npm@latest`. No ADR names either tool, so this ruling doesn't cover them.

**Other fields:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, taken from the git user. The Consequences section would be rewritten for `none`, and the "How to rule" block replaced with the reason above and the rule 4 statement.

Do you agree with **`accepted` / `tools.manager: none`**, or would you prefer `script`, or a different author list? I'll write nothing to the ADR until you confirm. After that I'll run `npx ontrack apply`, which also needs your approval to run.
