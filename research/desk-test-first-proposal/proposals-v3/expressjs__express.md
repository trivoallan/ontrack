=================== expressjs__express ADR-0002
I've finished collecting evidence for ADR-0002. Here is the proposed ruling.

**Note:** AGENTS.md asks me to run `npx ontrack review trivoallan/ADR-0002-localization` for any ADR review, but that command was not approved. This ruling rests only on the ADR file and the repository. If you approve it, I can run it and check its output against this ruling.

## What the repository does today

- **Documentation:** `Readme.md`, `History.md` and the examples are all in English. The few accented characters in them are contributors' names (`Readme.md:187`, `:190`), not French text.
- **Commits:** All 6,186 commit subjects are in English. I searched the last 300 for French words and accents and found nothing; the only matches were emoji.
- **Code and comments:** Symbols and comments in `lib/` and `index.js` are English, for example `// Check if the status code is not an integer`. The non-ASCII strings in `test/` and `examples/` are test data (`café.txt`, a Chinese filename), not the language the code is written in.
- **Enforcement:** Nothing enforces a language. There is no commitlint, no i18n setup, and no language check in `.github/workflows/` (ci, codeql, legacy, npm-publish, scorecard).

## Comparison with the recommendation

The ADR recommends `default: english` with no overrides, and that is exactly what the repository does today. There are no differences. The recommendation has no conditions to check, and `rejected` doesn't apply, because the question is relevant to a project with this many contributors.

## Proposed ruling

**Status:** `accepted`

- `localization.language.default: english (observed)`: all documentation, 6,186 commit subjects, and the symbols and comments in `lib/` are in English.
- `localization.language.documentation:` left empty, so it takes `default` (observed): the docs are in English.
- `localization.language.commits:` left empty, so it takes `default` (observed): the git history is in English.
- `localization.language.code:` left empty, so it takes `default` (observed): the symbols in `lib/` are in English.
- `localization.language.comments:` left empty, so it takes `default` (observed): the comments in `lib/` are in English.

**Departures from the recommendation:** none. The ADR will say in one line that the recommendation was adopted as is.

**Rulings this repository doesn't follow yet:** none. The repository already writes everything in English, so there is nothing to track. The `tracking` trait (ADR-0014) is also still undecided, so I wouldn't create tracker items anyway.

## What I need from you

1. **Do you agree with `accepted` and `default: english`?**
2. **What should go in `authors:`?** Git names you as Tristan Rivoallan. Should I use that, or list other people who are deciding? I'll set `date:` to 2026-11-15.

Once you agree, I'll edit only this ADR. I'll fill the traits, status, date and authors, rewrite the Consequences for this verdict, and replace the "How to rule" block with the one-line reason. Then I'll run `npx ontrack apply` to update AGENTS.md.
=================== expressjs__express ADR-0004
I couldn't run `npx ontrack review trivoallan/ADR-0004-languages`, which AGENTS.md says to run first, because the command needs your approval. So this ruling follows the steps written in the ADR (its "How to rule" block) and your prompt. If you approve the command, I'll check its output against this.

## What the repository does today

- **All source code is JavaScript.** `git ls-files` lists 142 `.js` files and no `.ts`, `.py` or other source files. The rest are templates and static assets (`.ejs`, `.hbs`, `.html`, `.css`). No `.ts` file appears anywhere in git history.
- **There is no TypeScript setup.** No `tsconfig.json` or `jsconfig.json`, no `typescript` or `@types/*` in `package.json`, and no build step. `files` publishes `index.js` and `lib/` as written.
- **The tooling is all JavaScript:** ESLint 8 (`.eslintrc.yml` with `env: es2022, node`), mocha with nyc, and `engines.node: ">= 18"`.
- **CI agrees.** `ci.yml` tests Node 18 to 26, `legacy.yml` tests Node 16 and 17, and CodeQL scans `language: [javascript, actions]`.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. This repository uses neither, so it differs on the only key. Another language is allowed if the ADR records why. The reasons here:
- Express is a published npm package that ships its source with no compile step and runs on Node 16 to 26. Switching to TypeScript would change what gets published and how it is built.
- It is a server-side library, not browser code. Python doesn't fit either: the whole ecosystem it serves is Node.js.
- What the two recommended languages don't give: running directly on Node with no transpilation, in the language the downstream ecosystem uses.

TypeScript types for Express usually come from the separate `@types/express` package, but that lives outside this repository and I haven't confirmed it.

Nothing points to `rejected`: this is a code repository with one clear main language.

## Proposed ruling

**Status:** `accepted`

- `languages.main.name: JavaScript (observed)`: 142 `.js` files and no other source language; `.eslintrc.yml` sets `env: node, es2022`; CodeQL scans `javascript`; `package.json` publishes `index.js` and `lib/` with no build step.

**Departure from the recommendation:** `JavaScript` instead of `Python`/`TypeScript`, because the repository ships plain CommonJS that runs on Node 16 to 26 with no build step.

When I write it up, I'll also:
- fill `date: 2026-11-15`;
- fill `authors:`, which I can't infer. Is it `[Tristan Rivoallan]`?
- rewrite the Consequences lists;
- replace the "How to rule" block with the reason above;
- run `npx ontrack apply`.

Do you agree with this ruling (`accepted`, `languages.main.name: JavaScript`), and who should be listed in `authors:`?
=================== expressjs__express ADR-0006
I've gone through the ADR, the commit history, CI and release setup. Now checking the Dependabot config and the non-standard `deps:` prefix.

I'm proposing **accepted**, with `tool: none` and a short closed list of scopes. I haven't written anything yet. `npx ontrack review` needed an approval I didn't get, so this review comes from reading the ADR and the repository directly.

## What the repository does today

- **Commit format:** 302 of the last 400 commit subjects follow `type(scope)?: …` (counted from `git log --format=%s -n 400`). There are two problems:
  - 20 recent commits use `deps:`, which is not one of the eleven allowed types (e.g. `43fca52d deps: body-parser@^2.4.0`).
  - The rest are older history with no type, such as release commits.
- **Scopes in use:** they are uncontrolled, which is exactly the problem the ADR describes.
  - `deps` and `deps-dev` are by far the most common. They come from Dependabot's automatic prefixes (`build(deps)`, `build(deps-dev)`).
  - Then a scattered set: `docs`, `test`, `ci`, `refactor`, `devdeps`, `buffer`, `res.send`, `res.location`.
  - Several of these repeat a type instead of naming an area: `fix(docs)`, `fix(ci)`, `fix(refactor)`, `chore(test)`.
- **Enforcement:** none. There is no commitlint, husky, lint-staged or hook config, and nothing in `package.json`. No workflow in `.github/workflows/` checks commit messages (`ci.yml`, `codeql.yml`, `legacy.yml`, `npm-publish.yml`, `scorecard.yml`).
- **How versions are set:** by hand.
  - `History.md` is written by hand, in curated sections (🐞 Bug fixes, 🚀 Improvements…) with prose and code samples. No tool generates it.
  - `npm-publish.yml` runs when someone publishes a GitHub release, and takes the version from `package.json`.
  - There is no semantic-release, release-please or changesets.
- **What I couldn't see:** the Readme points to a Contributing Guide in the separate `expressjs/.github` repository. It may set a commit convention, and I couldn't read it. Branch protection and squash settings live in GitHub, not in the repo.

## Checking the condition

The ADR recommends `commitlint` only "if this repository generates its versions from commit messages". It doesn't: versions come from `package.json`, the changelog is hand-written in `History.md`, and publishing starts from a GitHub release (`.github/workflows/npm-publish.yml:3-6`). So the condition is false, and the ADR itself says `none` is then just as good.

## Proposed ruling

**Status: `accepted`**

- `commits.tool: none (observed)`: nothing checks commit messages today (no commitlint or hooks, no CI job), and versions are set by hand, so the reason for commitlint doesn't hold here.
- `commits.scopes: [deps, deps-dev] (observed)`: these are the only scopes used consistently, and Dependabot writes them automatically (`.github/dependabot.yml`). The other scopes are one-offs or repeat a type, so writing them down would be inventing a list on adoption.

**Departures from the recommendation**

- **`commits.tool`: `none` instead of `commitlint`.** The recommendation depends on versions being generated from commits. Here they are set by hand, and review keeps the convention.
- **`commits.scopes`:** the ADR recommends no value here, so this isn't a departure.

**Things the ruling leaves open (not departures)**

- The `deps:` subjects use a type outside the allowed eleven. The ruling doesn't change that, and `none` won't catch it.
- If you want to filter history by API area, you could add `app`, `req`, `res`, `router`, `view` (matching `lib/`). Only `res.*` has been used so far, so I left them out.

**Do you agree with this ruling?** You can also change it:
1. Agree as proposed.
2. Add the API-area scopes (`app, req, res, router, view`).
3. Use `[]` (no scopes at all).
4. Something else.

Please also give me the names to put in `authors:`. I'd use today, 2026-11-15, for `date:`.
=================== expressjs__express ADR-0009
I've read the ADR and gathered history and CI. Next I'll check PR branch names on GitHub.

I've reviewed `docs/adr/trivoallan/ADR-0009-branching.md` (Branching) and have a proposed ruling. Nothing is written yet. AGENTS.md says to run `npx ontrack review` for this, but that command needed an approval it didn't get, so I followed the ADR's own five steps instead. I also couldn't run `gh pr list` (same reason), so I haven't seen the branch names of merged pull requests.

## What the repository does today

- **Default branch:** `origin/HEAD -> origin/master`. There are also long-lived maintenance branches `origin/4.x`, `origin/5.x` and `origin/5.0`, and a release branch `origin/release/4.22.3`. No `develop` branch exists, though `.github/workflows/ci.yml` still lists `develop` among its push branches, which looks like a leftover.
- **How changes land:** the last 40 commits on `master` (`git log --first-parent`) are each a single commit titled after its pull request (`... (#7563)`). The last merge commit is `f9256ef3`, dated 2024-09-09, from the 5.0 integration. Since then, every change on `master` has arrived as a squashed pull request.
- **Branch names:** the upstream branches use a mix of styles. Some have type prefixes (`feat/fresh-query-method`, `feat/list-routes-subapps`, `fix/hostname-host-header-injection`, `test/subapp-routing-settings-inheritance`). More are named after a person (`ulises/6x-*` eight times, `bsebas/…`) or have no prefix (`req.is`, `throw-redirect`, `ci-workflows`). Nothing in the repo enforces a naming rule, and there is no CONTRIBUTING file. Most pull requests come from forks, so their branch names are chosen by the contributor.
- **Bots:** `.github/dependabot.yml` opens `dependabot/*` branches.

## Proposed ruling: `accepted`

- `branching.model: github-flow (observed)`: one branch and one pull request per change, merged into `master`. There is no `develop` branch, so this isn't gitflow. The long-lived `4.x`/`5.x` maintenance lines sit alongside github-flow and don't change the model.
- `branching.merge: squash (observed)`: every change on `master` since 2024-09 is a single commit titled `… (#PR)`. Which merge methods the repo allows is a setting on GitHub, outside the repository, so I can't see it. **Please confirm that only squash merging is enabled.**
- `branching.prefixes: [feat, fix, docs, test] (absent)`: the `feat/`, `fix/` and `test/` prefixes are in use, but most branches use a person's name or no prefix, and nothing enforces a rule. The ruling would make prefixes required.

## Departures from the recommendation

1. **`test` is added to the prefixes.** It is one of the eleven commit types, an upstream branch already uses it (`test/subapp-routing-settings-inheritance`), and commits such as `1c6f1b0f test: expand coverage…` show test-only changes are a regular kind of work here.
2. **The model and merge values are unchanged, with one note in the ADR.** Maintenance lines (`4.x`) and `release/x.y.z` branches will keep existing. The ADR's check would fail on a branch like `release/4.22.3` unless the release tool is ruled in ADR-0012. ADR-0018 also needs ruling before this is enforced, or Dependabot's pull requests will fail the check. I would write this in the ADR rather than change any value.

**Do you agree with this ruling?** In particular:
- Is only squash merging enabled on GitHub?
- Should the prefixes be `[feat, fix, docs, test]`, or the recommended `[feat, fix, docs]`?
- What `authors:` value should I use: your name, or the maintainers who decided?

Once you agree, I'll fill the traits, status, date, authors and Consequences, replace the ruling-instructions block with the reasons above, and run `npx ontrack apply`.
=================== expressjs__express ADR-0011
Read the ADR and all five workflows. Next I'm checking whether anything audits the workflows and whether a ruleset makes them required.

# Proposed ruling for ADR-0011: Forge and continuous integration

Two commands were declined, so a few things are unconfirmed:
- `npx ontrack review`, which AGENTS.md says to run first. I followed the ADR text directly instead.
- `gh api repos/expressjs/express/rules/branches/master`. Without it I can't see the GitHub ruleset that decides `forge.gate`.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/expressjs/express`). `rejected` doesn't apply.
- **Pipeline:** there are five workflows in `.github/workflows/`:
  - `ci.yml` runs lint, tests on 18 Node versions × 2 operating systems, and coverage, on pull requests and on pushes to master, develop, 4.x, 5.x and 5.0.
  - `legacy.yml` runs tests on Node 16 and 17.
  - `codeql.yml` runs CodeQL for `javascript` and `actions`.
  - `scorecard.yml` runs OpenSSF Scorecard.
  - `npm-publish.yml` publishes to npm through OIDC (`id-token: write`, no stored secret).
- **Stages:**
  - The lint and test jobs cite tracked commands: `package.json:93` (`eslint .`) and `package.json:96` (`test-ci`).
  - There is no build job and no audit job.
- **Workflow hygiene against the five fixed rules:**
  - **Rule 3 (pin by SHA):** followed. Every action is pinned by commit SHA with the tag in a comment, `actions/*` included, and Dependabot proposes the updates.
  - **Rule 5 (no secrets or proposed code for forks):** followed. No workflow uses `pull_request_target`, and every checkout sets `persist-credentials: false`.
  - **Rules 2 and 4 (protected secrets, none in logs):** I found nothing that breaks them.
  - **Rule 1 (deploy only from the default branch):** not followed. `npm-publish.yml:3-6` runs on any published release. It isn't tied to the default branch by `on:` or `if:`, and has no protected `environment:`.
- **What reads the workflows today:** CodeQL's `actions` language (`codeql.yml:38`). There is no zizmor and no actionlint anywhere in the repository, and `which zizmor` finds nothing.

## Proposed ruling

**Status:** `accepted`

- `forge.gate: blocking` (not marked): I couldn't see this. Whether a red check blocks a merge is set in a GitHub ruleset or branch protection, outside the repository. `scorecard.yml:9` reacts to `branch_protection_rule`, which suggests protection exists, but that doesn't show whether `ci` checks are required. **I need you to tell me the value.**
- `forge.audit: zizmor (absent)`: no workflow, script or config runs zizmor today. Accepting this means adding a zizmor job on every pull request, using `zizmorcore/zizmor-action` pinned by SHA.

## Departures from the recommendation

- **None in the trait values**, if you confirm `blocking`.
- **Gaps against the fixed rules**, which are not departures:
  - Rule 1: `npm-publish.yml` isn't tied to the default branch and has no protected environment. Releases are cut from maintenance branches (the job works out `latest-<major>` tags itself), so tying it to master would break 4.x releases. If you want to keep that behaviour, it has to be declared as a departure, with this reason.
  - CodeQL `actions` already reads the workflows. The ADR measured it finding nothing where zizmor found five issues, so I propose zizmor alongside it, not instead of it.
- **Unknown until zizmor runs:** I couldn't run it, so I can't say whether today's workflows pass. `scorecard.yml:18` (`permissions: read-all`) is a likely finding.

## Rulings this repository would not follow yet

- `[trivoallan/ADR-0011] forge.audit`: zizmor isn't installed or wired into CI.
- `[trivoallan/ADR-0011] forge.gate`: depends on the ruleset I couldn't see.

AGENTS.md has no decided `tracking` trait, so I won't create any tracker items. This list stays in this reply.

## Your decision

1. Do you agree to `accepted` with `forge.audit: zizmor`?
2. Does a ruleset or branch protection on `master` make the `ci` checks required? Tell me whether `forge.gate` should be `blocking` (and whether that's in place today) or `informative`.
3. Should the release-from-maintenance-branches exception to rule 1 be written in the ADR as a departure?

I'll write nothing until you answer. Once you do, I'll fill the traits, status, date and authors, rewrite Consequences, replace the how-to-rule block, and run `npx ontrack apply`.
=================== expressjs__express ADR-0023
I read the ADR and checked the repository. The `npx ontrack review` call that AGENTS.md asks for needed an approval it did not get, so I followed the ADR's own "How to rule" steps.

## What the repository does today

- **Licence file:** `LICENSE` at the root holds the full MIT text. Its header is "(The MIT License)", and it has been in the repo since 2011 (`9914a1eb`). Its copyright lines name three individuals: TJ Holowaychuk, Roman Shtylman and Douglas Christopher Wilson.
- **Manifest:** `package.json:15` has `"license": "MIT"`. There is no `pyproject.toml`, and no other root manifest is committed.
- **Repository:** it is public at `github.com/expressjs/express` and publishes the `express` package to npm. So the question applies, and `UNLICENSED` or `rejected` don't fit.

## Compared with the recommendation (`MIT`)

- **Value:** the repository already uses `MIT`, so there is no difference.
- **Fix 1 (the manifest declares it):** met.
- **Fix 2 (a licence file at the root):** met.
- **Fix 3 (the copyright holder is the organisation that owns the repository):** this is the one difference. The `LICENSE` names individual authors, not the expressjs organisation. The ADR says the agent writes the holder only when it writes the file, and this file already exists. I'd leave it alone: changing copyright lines on a 15-year-old file is the holders' call, not something a ruling should impose. I'll record that reason in the ADR.

## Proposed ruling

**Status: `accepted`**

- `license.spdx: MIT (observed)`: `package.json:15` has `"license": "MIT"` and the root `LICENSE` holds the MIT text.

**Departures from the recommendation:** none in the value. On fix 3, the existing `LICENSE` keeps its individual copyright holders for the reason above.

## Rulings the repository doesn't follow yet

If this is accepted, there are none for ADR-0023: the manifest and the licence file already match `MIT`. No `tracking` trait is decided in AGENTS.md, since ADR-0014 is still undecided, so I'll create no tracker items.

## Before I write anything

1. **Do you agree with this ruling?** That's `accepted`, with `license.spdx: MIT`, and the `LICENSE` copyright lines left as they are.
2. **Who goes in `authors:`?** That means the names of the people deciding, without email addresses. Is it just "Tristan Rivoallan"? The date will be 2026-11-15.

Once you agree, I'll fill in the ADR, delete its "How to rule" block, rewrite the Consequences lists and run `npx ontrack apply`.
=================== expressjs__express ADR-0025
I can't run `npx ontrack review` here, because the command needs approval. I'll follow the steps in your prompt and the ADR's own ruling instructions instead, and start by gathering evidence.

ADR-0011, ADR-0015 and ADR-0019 are all still `proposed`; the `accepted` blocks in them are examples. Next I'll check whether the workflows install any binary outside npm and actions.

I couldn't run `npx ontrack review trivoallan/ADR-0025-tools` because it needs your approval, so I followed your instructions and the ADR's own "How to rule" steps.

## What the repository does today

- **No tool manager or tool-pin file.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions`, pin-and-checksum script, `.husky/`, pre-commit config or devcontainer.
- **No commit-message history on the topic.** `git log --grep` for mise, aqua, asdf, gitleaks, zizmor, actionlint and checksum finds only commits about `Promise`, which matched on "mise".
- **No gitleaks, zizmor, actionlint, grype or trivy in CI.** The only binary installed outside npm and actions is `lcov`, through `sudo apt-get -y install lcov` with no version (`.github/workflows/ci.yml:102`, `legacy.yml:86`). It is a CI coverage helper that no ADR names, so the ADR's rules don't cover it.
- **The condition in the ADR is not met.** "`none` is an answer only when no accepted ADR names such a tool." The ADRs that would name one are ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 (`vulnerabilities.scanner`). All three are still `status: proposed`. The `accepted` blocks with zizmor, gitleaks and grype inside them are examples, not rulings. Today, no accepted ADR names a tool.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: none (observed)`: no tool outside the package manager is installed or pinned anywhere, and no accepted ADR names one. There are no manager files, no script, and ADR-0011, ADR-0015 and ADR-0019 are all `proposed`.

**Departure from the recommendation:** the recommendation is `script` for one tool and `mise` or `aqua` for several. Both cases assume at least one named tool, and there are zero here, so the ADR's own rule leaves `none`. Under rule 4, nothing moves any pins because there are none.

**The catch:** if you later accept ADR-0015 with `secrets.guard: gitleaks` or ADR-0011 with `forge.audit: zizmor`, the ADR-0025 check will fail under `none`. This ADR would then need a new ruling, probably `mise`, since those are two tools.

**The alternative:** if you already mean to accept those ADRs as recommended, rule `tools.manager: mise (absent)` now instead. That would add `mise.toml` and `mise.lock` with `lockfile = true`, a pinned `jdx/mise-action` in CI, and Renovate's `mise` manager to keep the pins current. It also departs from ADR-0018's recommended Dependabot.

When I write the ruling, I'll set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from your git user name.

**Do you agree with `tools.manager: none`, or do you want `mise` (or `script`) instead?** I won't write anything until you answer.
