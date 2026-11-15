=================== expressjs__express ADR-0002
The `npx ontrack review` call needs approval that wasn't given, so I'll work from the ADR's own instructions and the repository.

## Proposed ruling for [trivoallan/ADR-0002] Localization

I couldn't run `npx ontrack review` because it needs approval you haven't given. This proposal follows the ADR's own instructions instead.

### What the repository does today
Everything is in English, by habit. Nothing enforces it.
- **Documentation:** `Readme.md`, `History.md` and `examples/` are all English. There is no translated documentation and no `docs/` folder other than `docs/adr/`.
- **Commits:** every subject in `git log --all` is English. They follow a Conventional Commits style, for example `fix(res.send): preserve ETag generation…` and `docs: fix typos…`.
- **Code and comments:** the names and comments in `lib/` are English, for example `// determine if ETag should be generated` and `// strip irrelevant headers`. The only accented character outside `node_modules` is test data: `test/res.attachment.js:96` uses `café.txt` to check how Unicode filenames are encoded. That isn't a choice of language.
- **Not present:** nothing checks the language of commits or docs. There's no commitlint, no language lint and no CI step for it in `.github/workflows/*.yml`.
- **Readers:** Express is a public open-source project read by people all over the world. That matches the reason the ADR gives for its recommendation.

### Compared with the recommendation
The recommendation is one default language, `english`, with no overrides. The repository already does exactly this, so there are **no differences**. The recommendation has no conditions to check.

### Proposed values
| Status: **accepted** | |
|---|---|
| `localization.language.default` | `english`: the README, docs, every commit subject, the code and the comments are all English |
| `documentation` | empty, so it follows the default (all docs are English) |
| `commits` | empty, so it follows the default (all of `git log --all` is English) |
| `code` | empty, so it follows the default (all names in `lib/` are English) |
| `comments` | empty, so it follows the default (all comments in `lib/` are English) |

**Departures from the recommendation:** none. Rejecting the ADR doesn't apply, because the question is relevant here. In the ADR, the reasoning becomes one line saying the recommendation is adopted as is.

Two things I need from you before writing:
1. **Do you agree** to rule `accepted` with `default: english` and no overrides?
2. **What goes in `authors:`?** The ADR asks for the names of the people who decided, without email addresses. Should I put "Tristan Rivoallan"? I'll set `date:` to today, 2026-11-15.

Once you agree, I'll do three things. I'll fill the frontmatter, rewrite the Consequences section for an English-only, open-source project (the French-maintainer drawbacks don't apply here), and replace the "How to rule" block with the one-line reason. Then I'll run `npx ontrack apply`.
=================== expressjs__express ADR-0004
I'm collecting what the repository does today on languages, and the evidence is now complete. Here is the proposed ruling.

## What the repository does today

- **It's all JavaScript, run as is.** The repository has no `.ts`, `.tsx`, `.mts` or `.py` files, and no `tsconfig.json` or `jsconfig.json`. The library is `index.js` plus `lib/*.js`: CommonJS, `'use strict'`, with type notes written as JSDoc comments (`lib/application.js:288` and others), which nothing checks.
- **There is no build step.** `package.json` publishes the source files directly (`"files": ["LICENSE", "Readme.md", "index.js", "lib/"]`) and has no build or compile script.
- **All the tools are JavaScript tools.** Linting is `eslint` 8.47.0 (`.eslintrc.yml`), tests are `mocha` and `supertest`, and coverage is `nyc`. `engines.node` is `>= 18`, and CI tests Node 18 through 26 (`.github/workflows/ci.yml:49`).
- **CodeQL scans `[javascript, actions]`** (`.github/workflows/codeql.yml:38`).
- The repository doesn't write its main language down anywhere. That missing record is the gap this ADR fills.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. The repository uses neither: it is plain JavaScript. That is the one difference.

## Condition check

The ADR says to pick TypeScript "when the repository runs in a browser or shares code between browser and server". Express is a server framework that only runs on Node (`engines.node`, CI matrix), so the condition doesn't hold. Python doesn't fit either, since nothing in the repository is Python.

## Proposed ruling

- **Status:** `accepted`. This is a code library with a clear main language, so `rejected` doesn't apply.
- **`languages.main.name`: `JavaScript`.** Evidence: `index.js` and `lib/*.js`, `package.json` `files` and `scripts`, the CI Node matrix, and CodeQL `language: [javascript, …]`.
- **One departure from the recommendation: JavaScript instead of TypeScript.** The reason to write into the ADR:
  - Express is published as raw CommonJS with no build step. Users `require` exactly the files the maintainers write.
  - Moving to TypeScript would add a compile step and change what the package ships.
  - The ecosystem it depends on is the Node.js runtime, across versions 18 to 26.

Two notes:
- I couldn't run `npx ontrack review trivoallan/ADR-0004-languages`, as AGENTS.md asks, because the command needs your approval. If you approve it, I'll run it and reconcile its output with this ruling before writing anything.
- The ADR also asks for `date:` and `authors:`. I'd use `2026-11-15` and `[Tristan Rivoallan]`, then rewrite the Consequences section and replace the "How to rule" block with the departure reason above.

**Do you agree with `accepted` and `languages.main.name: JavaScript`, or do you want a different value or wording?** Nothing is written until you confirm.
=================== expressjs__express ADR-0006
Quick status: I've read the ADR and the last 300 commit subjects. The versions are clearly set by hand, so next I'm looking at the repo's areas to work out the scopes.

I couldn't run `npx ontrack review trivoallan/ADR-0006-commits`, which AGENTS.md asks for, because the command needed approval. So this review follows the ADR file itself, which also says how to rule.

## What the repository does today

**Commit format.** Most commit messages already follow Conventional Commits, but not all of them, and nothing checks.
- 78 of the last 100 subjects match the format, and 196 of the last 300.
- The others use prefixes outside the eleven types (`deps:`, `doc:`, `lint:`, `lib:`, `sec:`, `cleanup:`), plain sentences ("Upgrade `content-type`", "fixed typo in history.md"), emoji commits, bare version commits and merge commits.
- `deps:` is the most common of these: 7 of the last 100, the latest being `43fca52d deps: body-parser@^2.4.0`.
- There is no commitlint, husky, lefthook or other hook in the repo or in CI. The search for these names found nothing outside `docs/adr/`.

**How versions are made.** By hand. This is the condition the `commitlint` recommendation depends on, and it doesn't hold here:
- Releases are single commits like `5.3.0 (#7468)`, `5.2.1`, `5.1.0` and `Release: 5.2.0 (#6920)`.
- `History.md` is written by hand, with prose, sections and author credits.
- `.github/workflows/npm-publish.yml` runs when someone publishes a GitHub release. It reads the version from `package.json` and works out the npm tag from it, and never looks at commit messages.
- No release-please, semantic-release or changesets is set up. ADR-0012 recommends release-please, but it is still `proposed`, so it doesn't change what the repository does today.

**Scopes in the last 1000 commits.**

| Scope | Uses | Note |
|---|---|---|
| `deps` | 66 (`build` 47, `fix` 14, `feat` 5) | Dependabot's default, and also used by people |
| `deps-dev` | 11 | Dependabot's default. `.github/dependabot.yml` has no `commit-message` setting, so Dependabot will keep writing these |
| `docs`, `ci`, `test`, `refactor` | 13 | These are types used as scopes (`fix(docs)`), not areas of the code |
| `res.send`, `res.location`, `buffer`, `devdeps` | 5 | One-off uses |

## Proposed ruling

- **Status:** `accepted`. The repo uses commits in more than one area and mostly follows the format, so `rejected` doesn't fit.
- **`commits.tool: none`**: versions are set by hand (see above). The ADR says that in this case "the recommendation falls, and `none` is just as good an answer."
- **`commits.scopes: [deps, deps-dev]`**: these are the only scopes the history uses consistently, and Dependabot will keep producing them. I left out `docs`, `ci` and `test` because they are types, not areas. I also left out API scopes like `res.send`: they appear 3 times in 1000 commits, and the ADR warns against a list invented at adoption.
- **`date:`** 2026-11-15. **`authors:`** [Tristan Rivoallan], from the git user, unless you give other names.

**Departures from the recommendation:**
- **`commits.tool`:** `none` instead of `commitlint`, because versions are set by hand, not generated from commit messages. If ADR-0012 is later ruled `release-please`, this premise changes and the ADR should be revisited.
- **`commits.scopes`:** the ADR recommends no value here, so there is nothing to depart from.

**Outside this ruling:** the format itself is not up for ruling, and the repo doesn't fully follow it (`deps:` and the other non-standard prefixes). That will come up in the list of rulings the repo doesn't follow yet, once every ADR is ruled.

Do you agree with this ruling? You could also change it, for example by adding API scopes like `app`, `req`, `res`, `router` and `view`, or by choosing `commitlint` anyway. I'll write nothing until you answer.
=================== expressjs__express ADR-0009
Checking CI triggers and the release workflow next, then I'll draft the ruling.

I couldn't run `npx ontrack review trivoallan/ADR-0009-branching`, which AGENTS.md asks for, because it needed approval. So I followed the ADR's own "How to rule" steps instead. Nothing has been written yet.

## What the repository does today

- **Default branch:** `master` (`git symbolic-ref refs/remotes/origin/HEAD` → `origin/master`).
- **How work arrives:** every one of the last 40 first-parent commits on `master` is a single commit ending in `(#PR)`, for example `43fca52d deps: body-parser@^2.4.0 (#7563)`. There have been no merge commits since 2024-09-09 (`git log --merges --since=2025-06-01` returns nothing). That is a pull request per change, merged by **squash**.
- **Long-lived maintenance lines:** besides `master`, the branches `origin/4.x` and `origin/5.x` exist, and `4.x` is still active: `899b5249 4.22.3 (#7466)` on 2026-09-14, then `2fd3d1f3` on 2026-10-27. Changes reach it through PRs as well. `.github/workflows/ci.yml:5-10` runs CI on pushes to `master, develop, 4.x, 5.x, 5.0`. No `develop` branch exists, so that entry is left over. There is no `develop`/`hotfix` flow, so this is not gitflow.
- **Releases:** `npm-publish.yml` runs when a GitHub release is published, and works out the dist-tag from the version (see the comment at line 37 and below). One remote `release/4.22.3` branch exists.
- **Branch names:** there is no convention and nothing enforces one. The remote branches mix several forms:
  - prefixes from the eleven types: `feat/…` ×2, `fix/…` ×1, `test/…` ×1
  - `release/…`, which is not one of the eleven types
  - personal prefixes: `ulises/…` ×8, `bsebas/…`
  - no prefix at all: `req.is`, `throw-redirect`, `ci-workflows`, …

  Most contributor PRs come from forks, where nobody controls the branch name.
- **Bots:** `.github/dependabot.yml` exists, so `dependabot/…` branches are opened. ADR-0018 is still `proposed`.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | `master` is fed by one squashed PR per change. The maintenance lines `4.x`/`5.x` follow the same branch-and-PR cycle. |
| `branching.merge` | `squash` | No merge commits since 2024-09. Every commit on `master` is `type: subject (#NNNN)`. |
| `branching.prefixes` | `[feat, fix, docs, test]` | `feat/`, `fix/` and `test/` are on the remote. `docs:` is among the most frequent commit types in `git log`. |

**Departures from the recommendation, and differences from current practice:**

1. **`test` is added to the prefixes.** The remote already has a `test/subapp-routing-settings-inheritance` branch, and a commit like `1c6f1b0f test: …` shows that test-only changes are a real kind of change here. `test` is one of the eleven types, so this stays within the rule.
2. **Maintenance branches (`4.x`, `5.x`) are kept.** github-flow assumes a single default branch. Here, supported major versions also live on their own long-lived branches that receive PRs. They are not branches anyone works on, so the check never looks at them. I would write this into the ADR as a known feature of how this repository uses github-flow.
3. **Current branch names don't match.** The `ulises/`, `bsebas/`, `release/` and unprefixed branches would fail the check, and so would any fork PR named freely (the check reads `GITHUB_HEAD_REF`). `release/` cannot be kept because it is not one of the eleven types. The ruling therefore means new branches must change their names, and contributors from forks will need to be told.
4. **Dependabot branches will fail the check until ADR-0018 is ruled.** The ADR itself says to rule ADR-0018 (and ADR-0012) with this one or before it.

The ruling would also set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, the name from git config with no email. The Consequences section would be rewritten to cover the points above, and the "How to rule" block would be replaced with the reasons for each departure.

**Do you agree with this ruling?** You could also, for example, drop `test` to keep the recommendation as is, or add `chore`/`ci`, or rule `rejected`. Once you answer, I'll write the ADR and then run `npx ontrack apply`, which will also need your approval.
=================== expressjs__express ADR-0011
Still gathering evidence: workflows are read; now checking branch protection on GitHub and whether any workflow audit tool exists.

I couldn't run `npx ontrack review` because the command wasn't approved, so I reviewed the ADR by hand by following its own "How to rule" block. I also couldn't run the GitHub API call that reads the rules on `master`, or check whether zizmor is installed locally.

## What the repository does today

- **Forge:** GitHub. The remote is `github.com/expressjs/express` and the CI config is in `.github/workflows/`. Since the forge is GitHub, `rejected` doesn't apply.
- **There is a pipeline:** `ci.yml` runs on every pull request and on pushes to `master`, `develop`, `4.x`, `5.x` and `5.0`.
  - It runs `lint` with `npm run lint` (`package.json:93`).
  - It runs `test` on Node 18–26, on Ubuntu and Windows, with `npm run test-ci` (`package.json:96`).
  - It then runs a `coverage` job that uploads to Coveralls.
  - `legacy.yml` runs the same tests on Node 16 and 17.
- **Other workflows:**
  - `codeql.yml` scans `javascript` and `actions`.
  - `scorecard.yml` runs OpenSSF Scorecard.
  - `npm-publish.yml` publishes to npm when a release is published. It uses OIDC (`id-token: write`) and stores no secret.
- **Whether a red check blocks a merge: unknown.** The ruleset is a GitHub setting and I couldn't read it.
- **Workflow audit:** nothing runs zizmor. There is no `zizmor.yml`, and no zizmor or actionlint anywhere in the repository. The only tool that reads the workflows is CodeQL's `actions` language (`codeql.yml:38`), and the ADR measured it finding nothing where zizmor found five issues.
- **The five rules:** the workflows already follow them closely:
  - Every `uses:` is pinned to a commit SHA with its tag in a comment, `actions/*` included. Dependabot keeps them updated (`git log` shows "bump the github-actions group").
  - Every checkout sets `persist-credentials: false`.
  - Every workflow sets read-only permissions at the top and widens them per job.
  - There is no `pull_request_target` anywhere.
  - In `npm-publish.yml:77`, a step output reaches `run:` through `env:` rather than being written into the command.
  - There is no deploy job and no `environment:`. Publishing to npm is a release, not a deploy.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `ci.yml` runs lint and tests on every pull request, so there are checks a ruleset can require. I couldn't confirm that a ruleset requires them today. |
| `forge.audit` | `zizmor` | Nothing audits the workflows except CodeQL `actions`. The workflows already follow what zizmor's default policy requires (SHA pins, `persist-credentials: false`, narrow permissions), so adopting it should cost little. |

**Departures from the recommendation:** none in the values. Where the repository differs today:
1. **No zizmor job yet.** The ADR expects one on every pull request, through `zizmorcore/zizmor-action` pinned by SHA. CodeQL `actions` stays, but it doesn't replace zizmor.
2. **No verified ruleset.** `blocking` only takes effect once a ruleset requires the `ci.yml` checks on `master`. I couldn't confirm one exists, and `ontrack check` doesn't verify it either.

I'll use today's date (2026-11-15). I'll leave `authors:` empty unless you give me the names to record.

**Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`? Which names should go in `authors:`?** I'll write nothing until you answer. After that, I'll fill the traits, set the status and date, rewrite the Consequences, replace the "How to rule" block with the reasons, and run `npx ontrack apply`.

The tracking-item step can't run yet: 25 other ADRs are still `proposed`, including ADR-0014 (Work tracking), so no tracker has been chosen.
=================== expressjs__express ADR-0023
I read the ADR in full and looked at the repository. `npx ontrack review` needed an approval I didn't have in this session, so I followed the steps the ADR gives in its own "How to rule" block.

## What the repository does today

| Question | Evidence | Matches the recommendation? |
|---|---|---|
| Manifest declares a licence | `package.json:15` has `"license": "MIT"`. There is no `pyproject.toml`, and no other root manifest. | ✅ Yes, `MIT` |
| Licence file at the root | `LICENSE` holds the full MIT text. It was added in `ddd48ee7` (2010-09-14, "Added LICENSE as requested by davglass") and ships in the npm package (`package.json:86-91`, `"files": ["LICENSE", …]`). | ✅ Yes |
| Shown to readers | `Readme.md:267-269`: `## License` / `[MIT](LICENSE)` | ✅ Consistent |
| Copyright holder | `LICENSE:3-5` names three people: TJ Holowaychuk (2009-2014), Roman Shtylman (2013-2014) and Douglas Christopher Wilson (2014-2015). The repository is `github.com/expressjs/express`, owned by an organisation, but the organisation isn't named anywhere. | ⚠️ Differs from fixed point 3 |
| CI check | No workflow or script checks that the manifest and `LICENSE` agree. Once this ADR is `accepted`, its `check:` line covers that. | Gap that ruling closes |

The recommendation has no conditions to check here. The "Apache-2.0 when a patent grant matters" alternative doesn't apply: the code is a web framework that has been published under MIT since 2010.

`rejected` isn't justified. This is a public, published package, so the question applies.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `MIT`**. Evidence: `package.json:15`, the `LICENSE` text, and `Readme.md:269`. It is also the recommended value.
- **date:** `2026-11-15`
- **authors:** to be confirmed by you (see question 2).

**Departures from the recommendation:**
1. **Copyright holder (fixed point 3).** Point 3 says the holder should be the organisation that owns the repository. The existing `LICENSE` names individual contributors instead. I propose keeping it unchanged and recording the reason in the ADR. MIT requires the existing copyright notices to be kept in every copy, so rewriting them to name the organisation isn't ours to do. Any new copyright line, such as one for the expressjs organisation or the OpenJS Foundation, is for the project's maintainers to decide.

There are no other departures. I'd rewrite the Consequences for an existing, long-standing MIT licence and replace the "How to rule" block with one line saying the recommendation was adopted as is, plus the copyright note.

**Before I write anything, please confirm:**
1. Do you agree to rule `accepted` with `license.spdx: MIT`, keeping the existing `LICENSE` copyright lines unchanged?
2. Who goes in `authors:`? I'd suggest `[Tristan Rivoallan]`, from the git user.

After the ruling, I still need to list the rulings this repository doesn't follow yet and propose tracking items for them. Neither AGENTS.md nor any ADR decides a `tracking` trait yet, so I'll give that list in my reply and create nothing.
=================== expressjs__express ADR-0025
The ADR is read and the repository is surveyed. I couldn't run `npx ontrack review` because the command needs your approval, so this review follows the ADR's own instructions.

## What the repository does today

- **No tool manager, no tool script.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions`, `scripts/`, `Brewfile`, `.husky/` or `.pre-commit-config.yaml`. The only setup files are `package.json`, `.npmrc` and `.github/`.
- **No committed hooks or agent session setup.** Nothing installs a tool on a workstation or in an agent session.
- **CI uses actions plus npm.** Every action is pinned by SHA (`.github/workflows/*.yml`), and Node comes from `actions/setup-node`. Actions are ADR-0011's question and the runtime is ADR-0004's, so neither belongs to this ADR.
- **Two binaries come from outside the lockfile, both only on the runner:**
  - `ci.yml` and `legacy.yml`, coverage job: `sudo apt-get -y install lcov`. No version, no checksum.
  - `npm-publish.yml`: `npm install -g npm@latest`. This is the package manager itself, which is closer to ADR-0004's question.
- **Dependabot** covers `github-actions` and `npm` only (`.github/dependabot.yml`). Nothing moves a tool pin, because there are none.
- **Nothing accepted names a tool.** Only ADR-0001 is `accepted` (grep of `^status:` across `docs/adr/trivoallan/`). ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`), the two this ADR's check reads, are still `proposed`.

## Checking the ADR's condition

The ADR says: "`none` is an answer only when no accepted ADR names such a tool." That condition holds today, because no accepted ADR names a tool (see the grep above). It recommends `script` for one tool and `mise` or `aqua` for several, but this repository has zero ADR-named tools.

## Proposed ruling

- **Status:** `accepted`. The question does apply here, because `lcov` is already a binary from outside the lockfile, so `rejected` would be wrong.
- **`tools.manager: none`.** No accepted ADR names a tool outside the package manager (only ADR-0001 is accepted), and the repository has no manager, script or hook to point to.
- **`date: 2026-11-15`**, **`authors: [Tristan Rivoallan]`** (from the git user).

**Departure from the recommendation:** `none` instead of `script`, `mise` or `aqua`. Those values pin tools that accepted ADRs name, and this repository has none yet. Picking a manager now would set up a binary with nothing to pin. The ADR itself allows `none` in this case.

**Rule 4 (what keeps pins current):** with no tools, there are no pins to move. I would write that this ADR is superseded as soon as an accepted ADR names a tool.

**Two things to know before you agree:**
1. **This will break later.** If you later accept ADR-0015 with something like `secrets.guard: gitleaks`, or ADR-0011 with a `forge.audit` tool, this ADR's check will fail under `none`, and you will need to supersede it with `script` (one tool) or `mise`/`aqua` (several). If you expect to rule those soon, `script` now avoids ruling twice. But it would describe a tool the repository doesn't have yet.
2. **`lcov` stays unpinned.** The runner installs it from apt with no version. No ADR names it, so this ADR doesn't require a pin. I would note it in the file as a known exception.

Do you agree with **accepted, `tools.manager: none`**, with the departure and rule-4 text above? Or would you rather rule `script` now in anticipation of ADR-0015/ADR-0011? I'll write nothing until you answer.
