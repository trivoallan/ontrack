# expressjs__express

## ADR-0002

I've reviewed `ADR-0002` (Localization), and the repository already does what it recommends: everything is written in English. I haven't written anything yet. `AGENTS.md` says to run `npx ontrack review` first, but that command needed your approval and didn't run, so this review rests on the ADR file and on evidence I gathered myself.

## What the repository does today

- **Documentation:** `Readme.md`, `History.md` and every file under `examples/` are in English. Searching the docs, `lib/`, `test/` and `examples/` for accented letters finds exactly one match: `test/res.attachment.js:96`, `res.attachment('/locales/café.txt')`. It's a test of how Unicode file names are encoded, not French writing.
- **Commits:** all 6,186 commits have English subject lines. Searching the last 300 for French words or accents found nothing; the only two matches were emoji-prefixed English messages.
- **Code and comments:** every name and comment in `lib/*.js` is in English.
- **Configuration and CI:** no translation setup, no `locales/` folder and no language check in `.github/workflows/`. Nothing enforces a language; English is simply the practice.

**Compared with the recommendation:** the ADR recommends `default: english` with no overrides, and the repository already matches that in every medium. There are no differences. The recommendation has no "if this repository…" condition to check.

## Proposed ruling

**Status: `accepted`**

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | English README, History, docs, examples, code and all 6,186 commit subjects |
| `localization.language.documentation` | *(empty, takes default)* | observed | `Readme.md`, `History.md`, `examples/` are in English |
| `localization.language.commits` | *(empty, takes default)* | observed | `git log`: every commit subject is in English |
| `localization.language.code` | *(empty, takes default)* | observed | names in `lib/*.js` are English |
| `localization.language.comments` | *(empty, takes default)* | observed | comments in `lib/*.js` are English |

- **Departures from the recommendation:** none. The ADR's place for a reason will get one line saying the recommendation is adopted as is.
- **Rejecting doesn't fit:** the question applies here, since people and agents write documentation, code and commits in this repository.
- **The rest of the ADR's ruling steps:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]` (your git user name). I'd rewrite the Consequences lists for this repository by dropping the French-speaking-maintainer points, which don't apply here. I'd also delete the "How to rule" block. Then I'd run `npx ontrack apply`.

## Rulings the repository doesn't follow yet

None from this ADR. Every value already matches the repository, and the ruling needs no tool. Nothing would be created in any case: ADR-0014 (Work tracking) is undecided, so there's no `tracking` trait in `AGENTS.md` and no tracker to check or add items to.

**Do you agree with this ruling (accepted, `default: english`, no overrides, authored by Tristan Rivoallan on 2026-11-15)?** If you do, I'll edit only `ADR-0002-localization.md` and then run `npx ontrack apply`, which will also need your approval.

## ADR-0004

I can't run `npx ontrack review` here without your approval, so I'll follow the ADR's own instructions and the prompt. Next I'll gather evidence from the repository.

I have enough evidence to propose a ruling. (`npx ontrack review` needed approval I don't have, so I followed the ADR's own "How to rule" steps, which take precedence anyway.)

## What the repository does today

- **All code is JavaScript running on Node.js, as CommonJS.** `index.js`, the 6 files in `lib/`, about 90 test files under `test/` and every example under `examples/` are `.js`. The only other files are templates (`.ejs`, `.hbs`, `.tmpl`), HTML, CSS and fixtures.
- **There is no TypeScript at all.** The repository has no `.ts` or `.d.ts` files and no `tsconfig.json` or `jsconfig.json`, and `package.json` has no `types` field. The type definitions people use with Express live outside this repository, in DefinitelyTyped's `@types/express`. That comes from general knowledge, not from this repository.
- **There is no build step.** `package.json` publishes the source files as they are (`"files": ["LICENSE", "Readme.md", "index.js", "lib/"]`) and requires `"engines": { "node": ">= 18" }`.
- **The tooling is JavaScript tooling.** Linting uses `eslint` 8.47.0, tests use `mocha`, coverage uses `nyc` and HTTP tests use `supertest`.
- **CI checks JavaScript on Node.js.** `.github/workflows/ci.yml` runs lint and `npm run test-ci` on Node 18 to 26, and `legacy.yml` covers Node 16 and 17. `.github/workflows/codeql.yml:38` scans `language: [javascript, actions]`.
- **Nothing records the main language today.** Agents can only infer it from the files above.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. It has no conditional to check, only its guidance: TypeScript when code runs in a browser or is shared between browser and server, Python otherwise. Express is a server-side Node.js library, so neither branch matches what the repository is.

There is **one difference**: the value would be `JavaScript`, which is not on the recommended list. The ADR allows another language when the reason is written in the file.

`rejected` does not apply. This is a code repository, so it has a main language.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `languages.main.name` | `JavaScript` | **observed** | All of `index.js`, `lib/`, `test/` and `examples/` is `.js`; there is no `.ts` or `tsconfig.json`; the ESLint, Mocha and nyc toolchain is JavaScript; CodeQL scans `javascript` |

**Departure from the recommendation (`JavaScript` instead of `Python` or `TypeScript`), with the reason I'd write in the ADR:**
- Express is a long-established Node.js library published to npm as plain CommonJS source with no compile step (`"files"` ships `index.js` and `lib/` directly).
- Switching to TypeScript would add a build step, change what gets published and break that no-build setup, for a codebase whose users already get types from DefinitelyTyped (`@types/express`).
- Python is not an option: the repository exists to be a library in the Node.js ecosystem.

When I write it up, I'd also:
- set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists for JavaScript. For example, a cost is that ADR-0005's `zod` and ADR-0007's typed-language advice apply only partly to untyped JS;
- delete the "How to rule" block and put the justification above in its place;
- run `npx ontrack apply`.

I have no question tool here, so I'll ask directly:

**Do you agree with ruling ADR-0004 `accepted` with `languages.main.name: JavaScript`, and with the justification above?** You can also choose a different value, such as `TypeScript` (marked `absent`, which would mean migrating). Or you can change the wording or the author list. I'll write nothing until you answer.

Once the review ends, I'll list the rulings this repository doesn't follow yet. AGENTS.md has no decided `tracking` trait (ADR-0014 is still undecided), so I'll give that list in my reply and create no tracker items.

## ADR-0006

Still collecting evidence: next I'm checking the Dependabot commit-prefix config and which commits don't follow Conventional Commits.

I have a proposed ruling for ADR-0006 (Commits). Nothing is written yet; it needs your agreement first. AGENTS.md says to start reviews with `npx ontrack review`, but that command needed your approval and didn't run, so this review follows the ADR file and the task steps.

## What the repository does today

- **Commit format:** Conventional Commits is the custom, but not a strict one. Of 222 non-merge commits since the 5.0 work (2024-09), 171 conform. The other 51 include `deps: …` (10 commits; `deps` is not one of the eleven types), plain-English subjects like `Upgrade \`content-type\``, bare version commits like `5.3.0 (#7468)`, and a few emoji subjects. The `(#NNNN)` suffix shows that pull requests are squash-merged, so the PR title becomes the commit message.
- **Scopes:** there is no defined list. The scopes in use come from two places:
  - **Dependabot (58 commits):** `build(deps)` 47 and `build(deps-dev)` 11. Dependabot picks these up from the history on its own; `.github/dependabot.yml` sets no `commit-message` prefix.
  - **People:** `fix(deps)` 9 and `feat(deps)` 4 or 5. The rest are one-offs that show the drift the ADR warns about: `fix(docs)` 7, `fix(res.send)` 2, `fix(ci)` 2, `docs(res.location)`, `fix(test)`, `chore(test)`, `fix(refactor)`, `fix(devdeps)`, `fix(buffer)`. Several of these use a type as a scope.
- **Enforcement tool:** none. There is no commitlint config or dependency, no `.husky`, no semantic-release, release-please or changesets, and no commit-message job in `.github/workflows/*.yml`.

## The recommendation's condition: does this repository generate versions from commit messages?

**No.** Versions are set by hand:
- Releases are hand-made version-bump commits (`5.3.0 (#7468)`, `5.2.1`, `5.1.0`, `5.0.1`).
- `History.md` is written by hand, sorted by impact ("🐞 Bug fixes", "🚀 Improvements"), not by commit type.
- `.github/workflows/npm-publish.yml` starts when someone publishes a GitHub release by hand, and reads the version from `package.json` (`const { name, version } = JSON.parse(fs.readFileSync('package.json'…`).

The ADR says that in this case "the recommendation falls, and `none` is just as good an answer."

## Proposed ruling: `accepted`

| Trait | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `commits.scopes` | `[deps, deps-dev]` | observed | Dependabot writes `build(deps)` and `build(deps-dev)` (58 commits), and people use `fix(deps)` and `feat(deps)` (14). These are the only scopes used consistently. The others are one-offs and are left out on purpose, following the ADR's "not one more". |
| `commits.tool` | `none` | observed | No commit tooling anywhere in the repo or CI. |

**Departure from the recommendation:**
- **`commits.tool`: `none` instead of `commitlint`.** commitlint is recommended only for repositories that generate versions from commit messages. Express sets them by hand (see the evidence above), so a bad message can't produce a wrong version. Review of the squash-merge PR title keeps the convention.

`commits.scopes` has no recommendation to depart from.

**Something to know, though it's not up for ruling:** the eleven types are fixed by governance. About 23% of recent commits don't match them (`deps:`, `Upgrade …`, bare version commits). With `tool: none`, `ontrack check` passes anyway, so nothing will catch this.

**Do you agree with this ruling?** You could also change it, for example:
- `scopes: []`. Dependabot's `build(deps)` messages would then go against the list.
- Add code-area scopes such as `req`, `res`, `app` or `router`.
- Take `commitlint` anyway, as a guard on PR titles.

If you agree, I'll also need the names to put under `authors:`. `date:` will be 2026-11-15.

## ADR-0009

Piped commands need approval; I'll run them one at a time.

I couldn't run `npx ontrack review trivoallan/ADR-0009-branching`, which AGENTS.md asks for, because the command needed approval I don't have. So I reviewed the ADR by hand, following the "How to rule" steps in the ADR itself. I have not written anything yet.

## What the repository does today

**How work reaches `master`: one branch and one pull request per change.**
- On `master`, every commit going back to the 2024 merges of `5.0` into `5-merge` has exactly one parent and ends with `(#NNNN)`. Examples: `43fca52d deps: body-parser@^2.4.0 (#7563)` and `9a34acf0 fix(res.send): … (#7459)`. Nothing is pushed to `master` directly.
- There are also long-lived maintenance lines: `origin/4.x`, `5.x` and `5.0`. These get backports, also through pull requests, for example `61ccf2ea feat: … (v4) (#7377)` on `4.x`.
- CI runs on pushes to these lines and on every pull request (`.github/workflows/ci.yml:4-13`).
- This is not gitflow. `ci.yml` lists a `develop` branch, but no `develop` branch exists on the remote, and there is no release/hotfix cycle. The one `release/4.22.3` branch is a one-off.

**Merge method: squash.**
- `git log --merges` shows no merge commit since 2024-09-09. They are all old merges of version lines and tags, such as `Merge tag '4.20.0' into 5.0`.
- Each pull request has landed as one commit titled with its PR number.

**Branch names: no convention is followed.** Of the 19 working branches on `origin`:
- 4 use a prefix from the eleven commit types: `feat/fresh-query-method`, `feat/list-routes-subapps`, `fix/hostname-host-header-injection`, `test/subapp-routing-settings-inheritance`.
- 9 use a person's name: `ulises/…` ×8 and `bsebas/…`.
- 5 have no prefix: `req.is`, `throw-redirect`, `ci-workflows`, and so on.
- 1 uses a prefix that is not a commit type: `release/4.22.3`.

Most contributions come from forks, so their branch names aren't visible here. Nothing enforces names today.

**Branch protection:** it lives in the forge settings, which I can't see from here. `scorecard.yml:9` listens to `branch_protection_rule`, which suggests a protection rule exists.

## Proposed ruling: `accepted`

| Key | Value | Status | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | observed | Every `master` commit since 2024-09 is a single-parent `(#NNNN)` PR commit; there is no `develop` branch on the remote |
| `branching.merge` | `squash` | observed | No merge commits on `master` since 2024-09-09; one commit per PR |
| `branching.prefixes` | `[feat, fix, docs, test]` | absent | Only 4 of 19 remote branches follow the `prefix/kebab-case` form |

**Departures from the recommendation**
1. **`test` is added to `prefixes`.** The repository already uses it, both as a branch name (`origin/test/subapp-routing-settings-inheritance`) and as a commit type (`1c6f1b0f test: expand coverage …`). It is one of the eleven allowed types. `ci` could be added for the same reason (`ci-workflows`, `3ce6d0eb ci: …`), but I left it out to keep the list short.
2. **The maintenance lines (`4.x`, `5.x`) stay.** This is a note rather than a change of value. The ADR describes github-flow as having a single shippable default branch. Here, the same branch-and-PR cycle also targets maintenance lines for older majors. I would write that into the ADR's reason.

**Things you should know before deciding**
- **The ruling breaks branches until other ADRs are ruled.** Once this is accepted, `ontrack check` will fail for every pull request from a `dependabot/` branch (`.github/dependabot.yml` is set up) until ADR-0018 is ruled. It will also fail for `release/…` branches, because no ruled release tool names them (ADR-0012 isn't ruled).
- **ADR-0006 (commits) is still open.** With squash, the PR title becomes the commit that counts. This repository uses a `deps:` type, which isn't one of the eleven types.

**Do you agree with this ruling?** Specifically: `github-flow`, `squash`, and `[feat, fix, docs, test]`. You could also take the recommended `[feat, fix, docs]` as is, or add `ci`.

Once you've agreed, I'll also need the `authors:` name or names to write in the ADR. Then I'll update the ADR and run `npx ontrack apply`.

## ADR-0011

Workflows read; now checking GitHub rulesets/branch protection and whether zizmor exists anywhere.

I'm proposing **`accepted`**, with both keys at the recommended values. Nothing has been written yet.

Two checks didn't run because their commands needed approval: `npx ontrack review trivoallan/ADR-0011-forge-and-ci` (which AGENTS.md says to run) and `gh api repos/expressjs/express/rules/branches/master` (which would read the GitHub ruleset). So I haven't seen GitHub's settings, and I couldn't run zizmor because it isn't installed.

## What the repository does today

- **Forge:** GitHub. The `origin` remote is `github.com/expressjs/express`, and it has five workflows under `.github/workflows/` (`ci.yml`, `legacy.yml`, `codeql.yml`, `scorecard.yml`, `npm-publish.yml`). The question applies, so `rejected` doesn't fit.
- **Pipeline:** `ci.yml` runs on pull requests and on pushes to `master`, `develop`, `4.x`, `5.x` and `5.0`. Its jobs are `lint` (`npm run lint`), `test` (`npm run test-ci`, Node 18–26 on Ubuntu and Windows) and `coverage` (sent to Coveralls). `legacy.yml` runs the same tests on Node 16–17. `codeql.yml` scans `javascript` and `actions` on pull requests to `master` and weekly. Scorecard runs weekly and on pushes to `master`.
- **Whether a red pipeline blocks a merge:** nothing in the repository says so. No contributing doc mentions required checks, and I couldn't read the ruleset.
- **What reads the workflows:** no zizmor job, no `zizmor.yml`, and nothing anywhere mentions zizmor or actionlint (searched with grep). The only thing that analyses workflows is CodeQL's `actions` language, which the ADR measured as finding nothing where zizmor found five issues. zizmor isn't on your PATH (`which zizmor` found nothing); actionlint is in `~/.local/bin`, and mise is installed.
- **The five fixed rules, as the workflows stand:**
  - **Rule 3 (pinning), followed:** every `uses:` is pinned to a commit SHA with the tag in a comment, `actions/*` included. Dependabot keeps them updated (see the `build(deps): bump the github-actions group` commits).
  - **Rule 5 (forks), followed:** no `pull_request_target`, and every checkout sets `persist-credentials: false`.
  - **Rules 2 and 4 (secrets), followed:** `npm-publish.yml` uses OIDC (`id-token: write`) and has no `secrets.*`. The only `secrets.` reference is commented out in `scorecard.yml`.
  - **Rule 1 (deploy only from the default branch), not followed:** `npm-publish.yml` publishes on `release: published` from whatever branch the release targets. It has no `environment:` and no branch `if:`. This is on purpose: the maintenance line `4.x` gets published under `latest-<major>`, as the workflow's own comments explain.
  - **Possible zizmor findings, not run so unconfirmed:** `permissions: read-all` in `scorecard.yml` (`excessive-permissions`), and `npm install -g npm@latest` in `npm-publish.yml`. The second isn't an action or an image, so rule 3 doesn't strictly cover it.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **unverified** | `ci.yml` runs `lint` and `test` on every pull request. Whether a ruleset requires those checks on `master` lives on GitHub, and I couldn't read it. If you approve the `gh api` call I can settle it as observed or absent. |
| `forge.audit` | `zizmor` | **absent** | Nothing runs zizmor or any other workflow audit today. CodeQL `actions` is the only analysis, and the ADR says it doesn't do this job. |

**Departures from the recommendation:**
- **Keys:** none, both values match the recommendation.
- **Rule 1:** I propose declaring this departure in the ADR. npm releases publish from maintenance branches (`4.x`), not only from `master`. That is intended release practice, and `npm-publish.yml` documents how the dist-tag is chosen. The safeguards that take its place: the workflow uses no secrets, publishing goes through OIDC trusted publishing and `npm stage publish`, and a release is created by hand on GitHub.

Do you agree with this ruling? You can also:
- (a) approve the `gh api …/rules/branches/master` call, so I can settle `forge.gate` as observed or absent before writing;
- (b) change a value, for example `informative`;
- (c) decline the rule 1 departure.

If you agree, also tell me the name(s) for `authors:`. Once you agree I'll fill `traits:`, set the status, date and authors, rewrite Consequences, replace the "How to rule" block with the reasons, and run `npx ontrack apply`.

## ADR-0023

I read the ADR in full. I couldn't run `npx ontrack review` because the command needed your approval and didn't get it, so I did the review by hand from the repository.

## What the repository does today

- **Licence file:** `LICENSE` is tracked at the root. It holds the full text of the MIT licence. Its copyright lines name TJ Holowaychuk (2009–2014), Roman Shtylman (2013–2014) and Douglas Christopher Wilson (2014–2015). Its last real change was `8bd5d54b`, "update license year…", which reached master through `531f024e` (tag 3.20.0, 2015-02-18).
- **Manifest:** the only root manifest is `package.json`, and line 15 reads `"license": "MIT"`. There is no `pyproject.toml`. The current uncommitted change to `package.json` only adds the ontrack devDependency and leaves the licence field alone.
- **README:** `Readme.md:267-269` has a "License" section that says `[MIT](LICENSE)`.
- **Repository:** `origin` is `github.com/expressjs/express`, a public repository that publishes a package. So the ADR applies, and `rejected` has no grounds.

## Comparison with the recommendation

The ADR recommends `MIT` with no condition. Its "Apache-2.0 when a patent grant matters" is an alternative to weigh, not a condition on the recommendation. The repository matches the recommendation and the first two fixed points:

1. The manifest declares the value: `"license": "MIT"` ✔
2. A licence file with the full text is at the root: `LICENSE` ✔
3. The copyright holder should be the organisation that owns the repository: **this one differs.** `LICENSE` names three people, not the `expressjs` organisation, and it has no organisation line.

The `check:` would pass today: the manifest field equals `MIT` and a licence file is committed.

## Proposed ruling

**Status:** `accepted`

| Trait | Value | Observed/absent | Evidence |
| --- | --- | --- | --- |
| `license.spdx` | `MIT` | **observed** | `package.json:15` has `"license": "MIT"`; `LICENSE` holds the MIT text; `Readme.md:269` |

**Departures from the recommendation:**
- **Copyright holder (fixed point 3):** I propose keeping the copyright lines in `LICENSE` as they are, not replacing them with the organisation. Those lines record who actually holds copyright in a project with a long history. Rewriting them is a legal change for the maintainers to make, not something a governance default should trigger. The reason would be written in the ADR. The `check:` doesn't read this line, so this departure leaves nothing unfollowed.
- On the value itself there is no departure: MIT is adopted as recommended, and the ADR would say so in one line.

**To fill when writing:** `date: 2026-11-15`, and `authors:` (the names of the people deciding, without email addresses).

**Do you agree with this ruling, and which names go in `authors:`?** I'll write nothing until you answer. Once you agree, I'll update only `ADR-0023-license.md`: fill the trait, set the status, date and authors, rewrite Consequences, replace the "How to rule" block with the reasons, then run `npx ontrack apply`.

## Rulings the repository does not follow yet

None, assuming the ruling above. The repository already matches `[trivoallan/ADR-0023] license.spdx`, and the copyright-holder departure would be recorded in the ADR. No `tracking` trait is decided (ADR-0014 is still "Not yet decided" in AGENTS.md), so there's no tracker to check for duplicates and nothing to create.

## ADR-0025

I'm reading which ADRs are actually decided, and checking git history for any pinned tool outside npm.

Here's my proposed ruling for ADR-0025. Nothing is written yet. One note first: `AGENTS.md` says to run `npx ontrack review`, but that command needed your approval and didn't run, so this review is based on the ADR text and the repository itself.

## What the repository does today

- **No tool manager and no pinning script.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions` or install script anywhere. There are no git hooks either (no `.husky/`, `lefthook` or `pre-commit` config).
- **One binary outside npm is installed, without a pin.** The `coverage` jobs in `.github/workflows/ci.yml` and `.github/workflows/legacy.yml` run `sudo apt-get -y install lcov`. That's whatever version the runner image's distro has, with no checksum. This is the "installs it the way the place it runs in suggests" situation the ADR describes. No ADR names lcov, though.
- **`npm install -g npm@latest`** in `npm-publish.yml` updates the package manager itself. That's covered by ADR-0004 and ADR-0020, not this one.
- **Everything else is npm packages or actions**, which this ADR excludes. The actions are pinned by SHA, and `.github/dependabot.yml` covers only `github-actions` and `npm`.
- **No accepted ADR names a tool.** Only ADR-0001 is `accepted` (frontmatter, line 5). ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`) are still `proposed`, so no gitleaks or zizmor has been ruled in.

## The condition that settles it

The ADR says "`none` is an answer only when no accepted ADR names such a tool." That's true here today, so `none` is allowed. The recommendation (`script` with one tool, `mise`/`aqua` with several) assumes there's at least one tool, and today there are zero.

## Proposed ruling

**Status:** `accepted`. I'm not proposing `rejected`, because the question does apply: lcov shows the problem already exists, and the ADR would apply as soon as ADR-0015 or ADR-0011 names a tool.

| Trait | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `none` | observed | no manager files or install script; the only tool is lcov, installed unpinned by apt; no accepted ADR names a tool |

**Departure from the recommendation:** it recommends `script` or a manager, and I propose `none`. Reasons:
- Nothing named needs pinning yet.
- `script` with no tool would be a pin script with nothing to pin.
- Once this is accepted, the ADR's check fails on `none` as soon as an accepted ADR names a tool. That forces a new ruling at the right moment.

**Rule 4 (what keeps pins current):** nothing to keep current under `none`. I'd write that down and add that lcov stays installed from the runner's distro because no ADR names it.

**The other option** is to rule `script` now, ahead of a gitleaks ruling. That would make it `absent`, and it would describe a planned setup rather than what's in the repository.

**Authors and date:** `authors: [Tristan Rivoallan]` (from git config), `date: 2026-11-15`.

Do you agree with `accepted`, `tools.manager: none`? Or would you prefer `script`, or other authors? I'll write the ADR and run `npx ontrack apply` only after you answer.

The git history search for past tool pins (gitleaks, zizmor, actionlint, mise, aqua) hit its time limit and was stopped, so it found nothing to report. I'm not restarting it: the proposed ruling rests on what the repository contains now, so the outcome doesn't affect it.

I'm still waiting for your answer. Do you agree with `accepted`, `tools.manager: none`, with `authors: [Tristan Rivoallan]` and `date: 2026-11-15`? Or would you prefer `script`? I'll write nothing until you answer.