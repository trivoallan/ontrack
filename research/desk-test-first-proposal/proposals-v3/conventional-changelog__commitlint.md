=================== conventional-changelog__commitlint ADR-0002
Now gather evidence on the repository's language usage.

I propose accepting the ADR's recommendation as written: English everywhere, with no per-area exceptions. Nothing is written yet; I need your agreement first.

## What the repository does today
Everything here is already in English, though no file says so.

- **Docs:** `README.md`, `.github/CONTRIBUTING.md` and the docs site (`docs/guides`, `docs/reference`, `docs/concepts`, `docs/api`, `docs/support`) are all in English. `docs/.vitepress/config.ts` doesn't set a `lang`, so VitePress uses its default, `en-US`. Nothing is translated.
- **Commits:** none of the 3,614 commit subjects contain common French words (le, la, les, des, une, pour, avec). They all follow conventional-commit types written in English.
- **Code and comments:** names and comments in `@commitlint/*/src/*.ts` are English, for example `// suggestions to user` and `// --cwd points at a fixture whose config only forbids type "foo"`.
- **No written rule:** AGENTS.md, CONTRIBUTING.md and the commitlint config don't name a language, and no CI check enforces one. The ruling would be the first place it's written down. Nothing outside the repository affects this, so none of the values depend on settings I can't see.
- **No conditions to check:** the recommendation isn't conditional ("if this repository…"), so there was nothing to verify.

## Proposed ruling
**Status:** `accepted`

- `localization.language.default: english (observed)`: the docs, README, CONTRIBUTING, 3,614 commit subjects, and the code and comments are all in English.
- `localization.language.documentation:` empty, so it follows `default` (observed): the docs site has no `lang` override and no translated pages.
- `localization.language.commits:` empty, so it follows `default` (observed): no commit subject in the history is in another language.
- `localization.language.code:` empty, so it follows `default` (observed): all names in `@commitlint/*` are English.
- `localization.language.comments:` empty, so it follows `default` (observed): source comments are in English.

**Departures from the recommendation:** none. The ADR would then say in one line that it adopts the recommendation as is.

**Not following it yet:** nothing. The repository already does what this ruling says.

**Tracking items:** I'd create none. ADR-0014 (Work tracking) is still `proposed`, so AGENTS.md has no `tracking` trait yet. And since this ruling has nothing left to do, there's nothing to track.

## Before I write it
1. Do you agree to the `accepted` ruling with `default: english` and the four exceptions left empty?
2. Which names should go in `authors:`? Should it be "Tristan Rivoallan" alone, or should other maintainers be listed too?
3. Is `date:` today, 2026-11-15?

When you confirm, I'll fill in the `traits:` keys, status, date and authors, and rewrite the Consequences section. Then I'll replace the instruction block with the one-line statement and run `npx ontrack apply`, all in this ADR file only.
=================== conventional-changelog__commitlint ADR-0004
Now gather evidence on the repository's languages.

Let me count source files by language.

## Proposed ruling: [trivoallan/ADR-0004] Languages

### What the repository does today
- **It is already a TypeScript codebase.** Of the tracked source files, 213 are `.ts`. The core packages (`cli`, `core`, `lint`, `load`, `parse`, `rules`, `types` and the rest) all live under `@commitlint/*/src/**/*.ts`. Only 29 `.js`/`.cjs` files are not fixtures. They are bin shims (`@commitlint/cli/cli.js`), small `config-*-scopes` packages, `@alias/*` re-exports and two helper scripts.
- **The TypeScript tooling is what defines the build.** `package.json` has `"build": "tsc -b"` and `typescript ^7.0.0`. `tsconfig.shared.json` sets `strict: true` and NodeNext modules. `tsconfig.json` holds project references for 24 packages, and tests are `*.test.ts` under vitest. `.github/workflows/CI.yml:57` runs `pnpm build`, which is `tsc -b`, before `pnpm test`.
- **It runs on Node, not in a browser.** `engines.node >=22.12.0`, `lib: ["es2022"]`, `types: ["node"]`. The published packages are a CLI and Node libraries. The only browser code is the VitePress docs site (`docs/`), and none of it is shipped in a package.
- **Nothing in the repository says what the main language is.** No file declares it. This ADR would be the first place it is written down.

### Comparison with the recommendation
- **Value.** TypeScript is one of the two languages the ADR recommends, so this needs no "other language" justification.
- **One difference: the tie-break.** The ADR says to choose TypeScript "when the repository runs in a browser or shares code between browser and server", and Python for "scripts, data work and services that do neither". commitlint is a Node CLI and library, so it does neither, and the rule as written would point to Python.
  - I propose departing from the tie-break. commitlint is published to npm and used inside JavaScript projects, mostly through husky hooks and `commitlint.config.{js,ts}`. The `@commitlint/types` package gives users TypeScript types for their configs. Switching languages would mean rewriting the project and dropping that ecosystem. Both are reasons of the kind the ADR itself accepts ("an ecosystem the repository depends on").

### Ruling
**Status:** `accepted`

- `languages.main.name: TypeScript (observed)`: 213 tracked `.ts` files across every core package, `"build": "tsc -b"` in `package.json`, a strict `tsconfig.shared.json`, and CI building with `tsc` (`.github/workflows/CI.yml:57`).

**Departures from the recommendation:**
- **The tie-break would point to Python** for a codebase that runs neither in a browser nor shared with one. We keep TypeScript because the project is an npm package that runs inside JavaScript projects and ships TypeScript types for user configs (`@commitlint/types`). Plain `.js` remains for bin shims and small config packages. It is secondary and does not change the answer.

To fill `date:` (2026-11-15) and `authors:`, I need the names of the people who decided. Should I use "Tristan Rivoallan", from your git config?

Do you agree with this ruling, and with that author name? I'll write nothing until you confirm.
=================== conventional-changelog__commitlint ADR-0006
Now the repository's current state.

I've finished reading the ADR and the repository. Here is the proposed ruling.

## What the repository does today

- **It generates versions from commit messages.** `package.json:43` has `"publish": "npm whoami && lerna publish --conventional-commits"`, and `.github/CONTRIBUTING.md:185` describes the same release. This settles the ADR's condition, so the `commitlint` recommendation applies.
- **commitlint already runs in CI.** `.github/workflows/commitlint.yml` lints PR commits (`--from base.sha --to head.sha`) and the last commit on pushes to `master`. A local `.husky/commit-msg` hook runs it too.
- **The config enforces the Conventional Commits types.** `package.json:80-85` extends `@commitlint/config-conventional` and `@commitlint/config-workspace-scopes`.
- **The scope list is not enforced.** `config-workspace-scopes` reads the `workspaces` field of `package.json`. That field doesn't exist here, because workspaces are declared in `pnpm-workspace.yaml`. So the plugin returns `[]`, and `scope-enum` with an empty list accepts any scope (`@commitlint/rules/src/scope-enum.ts:14`). History shows the leak: of the last 500 subjects, 55 have a scope, and all are package names except `issue-template` and `container`.
- **The scopes people actually use are package short names:** `load`, `rules`, `types`, `lint`, `cli`, `read`, `cz-commitlint`, `parse` and so on. CONTRIBUTING.md asks for `$type($scope): $message`, so the intended vocabulary is clearly the workspace packages.
- **The ADR's check would fail as things stand.** `@commitlint/cli` is not a root dev dependency (only `config-conventional` is), and `node_modules/@commitlint` isn't linked at the root. The check would stop and name the missing package.

## Proposed ruling

**Status: `accepted`**

- `commits.tool: commitlint (observed)`: `.github/workflows/commitlint.yml` runs on every pull request and on pushes to `master`, and versions come from `lerna publish --conventional-commits`.
- `commits.scopes: [cli, config-angular, config-angular-type-enum, config-conventional, config-lerna-scopes, config-nx-scopes, config-patternplate, config-pnpm-scopes, config-rush-scopes, config-validator, config-workspace-scopes, core, cz-commitlint, ensure, execute-rule, format, is-ignored, lint, load, message, parse, prompt, prompt-cli, read, resolve-extends, rules, to-lines, top-level, travis-cli, types, test, utils, vitest-environment-commitlint, commitlint, commitlint-config-angular, commitlint-config-lerna-scopes, commitlint-config-nx-scopes, commitlint-config-patternplate] (absent)`: these are the short names of the packages in `@commitlint/*`, `@packages/*` and `@alias/*`, which is what `config-workspace-scopes` is meant to enforce and what history uses. The current config doesn't actually enforce any list, so I've marked this `absent`.

**Departures from the recommendation:** none for `commits.tool`. The ADR gives no recommendation for `commits.scopes`.

Three open points:

1. **Non-package scopes.** `issue-template` and `container` appear once each in history and would now be refused. If you want an area for repo-level changes, I could add them, or something like `deps` or `release`. I'd leave them out, because AGENTS.md already sorts those changes by type (`ci`, `build`, `chore`).
2. **Alternative: `scopes: []`.** Nine in ten commits carry no scope, so `[]` is defensible. But it would refuse all of the package scopes this project uses, so I don't recommend it.
3. **Who decided.** I need the `authors:` value: the names of the people ruling, without email addresses. Should I put "Tristan Rivoallan"?

Do you agree with this ruling (status `accepted`, `tool: commitlint`, scopes as listed), or do you want changes? I won't write anything until you confirm.

Once it's ruled, the item this repository doesn't follow yet is likely `[trivoallan/ADR-0006] commits.scopes`. The scope list isn't enforced because `workspaces` is missing (switching to `@commitlint/config-pnpm-scopes` would fix that), and `@commitlint/cli` isn't a root dev dependency for the check. No `tracking` trait is decided in AGENTS.md (ADR-0014 is still undecided), so I'll only list this in my reply and won't create any tracker items.
=================== conventional-changelog__commitlint ADR-0009
Reading the ADR and gathering evidence on branches, merge style and bots; nearly done.

I've reviewed ADR-0009 (Branching), and I propose to accept it with one change: allow more branch prefixes than the ADR recommends. I've written nothing yet.

## What the repository does today

- **Default branch:** `master` (`git symbolic-ref refs/remotes/origin/HEAD` gives `origin/master`).
- **How work reaches master:** through pull requests. Of the last 1,000 commits on master, 953 end in `(#N)`, the mark a squash-merged pull request leaves. The rest are 40 release commits (`v21.2.4`, …, pushed by a maintainer, which `lerna publish` produces, see `.github/CONTRIBUTING.md:146-160`) and 7 other direct commits. There is no `develop` branch and there are no `release/*` or `hotfix/*` branches. The old-major branches (`8.x`, `9.x`, `10.x`, `11.x`, `12.x`, `15.x`, `release-v18`) are a separate thing, branches that keep old versions maintained.
- **Merge style:** squash. `AGENTS.md` says "The merge queue squashes, so the pull request title becomes the commit on master". `CI.yml:7-9` leaves out `gh-readonly-queue/**`, so a GitHub merge queue is in use. Only 3 of the repository's 3,614 commits are merge commits, all of them old (`Merge branch 'release/7.6'`, PRs #31 and #15).
- **Branch names:** in the remote branches I see `chore/`, `ci/`, `docs/`, `feat/`, `fix/`, `refactor/` and `test/`, all in the form `prefix/kebab-case`. A few names don't follow it: `copilot/…`, `renovate/…`, `release-v18` and the `N.x` branches. Nothing in the repository checks branch names today.

## Proposed ruling: `accepted`

- `branching.model: github-flow (observed)`: 953 of the last 1,000 commits on master came from pull requests, and there is no `develop` or release branch.
- `branching.merge: squash (observed)`: `AGENTS.md` says the merge queue squashes, `CI.yml:7-9` shows the queue, and only 3 old merge commits exist. The allowed merge methods themselves are a GitHub setting I can't read from here; please confirm that only squash is enabled.
- `branching.prefixes: [feat, fix, perf, refactor, docs, test, ci, build, chore]`: seven of these are **observed** (`chore`, `ci`, `docs`, `feat`, `fix`, `refactor`, `test` all appear in remote branch names). `perf` and `build` are **absent**: no branch uses them yet, but `AGENTS.md` names them as commit types for this repository.

## Departures from the recommendation

1. **Prefixes.** The ADR recommends `[feat, fix, docs]`; I propose nine. Contributors here already use seven prefixes, and `AGENTS.md` asks every change to carry its type in the branch, title and commits alike. Limiting branches to three prefixes would make the existing `chore/`, `ci/`, `refactor/` and `test/` branches fail the check. `style` and `revert` stay out because `AGENTS.md` doesn't list them.

Nothing else departs. The 40 maintainer pushes for releases depart from github-flow in practice, not in the ruling; they are a question for ADR-0012 (Delivery).

## Points to know before you decide

- **Bot branches would fail the check.** ADR-0012 (Delivery) and ADR-0018 (Dependencies) are still `proposed`. Until they are ruled, Renovate's `renovate/…` branches would fail the branch check (Renovate is set up in `package.json:91`). So would the `copilot/…` branches and branch names on contributors' forks, such as `patch-1`, if the check runs on pull requests.
- **Squashing hides the two-commit test-driven flow on master.** `.github/CONTRIBUTING.md:107-120` asks for a failing-test commit followed by the implementation. With squash merges, that sequence only survives in the closed pull request. The project already works this way today.

Do you agree with this ruling? Specifically:
1. `accepted`, with `github-flow` and `squash`?
2. Prefixes `[feat, fix, perf, refactor, docs, test, ci, build, chore]`, the recommended `[feat, fix, docs]`, or another list?
3. Is squash the only merge method enabled in the GitHub settings?
4. What should go in `authors:`? Just "Tristan Rivoallan", or others too?

Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0009-branching.md` and run `npx ontrack apply`. After that I'll list the rulings the repository doesn't follow yet. No `tracking` trait is decided in `AGENTS.md`, so that list will stay in my reply and nothing will be created in a tracker.
=================== conventional-changelog__commitlint ADR-0011
Now the repository's CI as it is.

Still collecting evidence: the project once pinned actions by SHA, then switched back to tags on purpose. Reading why.

I've drafted a ruling for ADR-0011 but haven't written anything yet. One trait value depends on a GitHub setting I couldn't read, so I need two answers from you first.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/conventional-changelog/commitlint`). The ADR applies, so `rejected` isn't an option.
- **Workflows:** five, in `.github/workflows/`:
  - `CI.yml`: build and test on 4 operating systems × 2 Node versions, plus a code-quality job (format, `pnpm lint`, focused-test check) and a stock-Ubuntu job. It runs on push, pull requests, `merge_group`, a daily schedule and manual runs.
  - `commitlint.yml`: lints commit messages on pull requests and on master.
  - `audit.yml`: a weekly `pnpm audit`. It deliberately never blocks (`continue-on-error: true`).
  - `container-build.yml`: pushes images to Docker Hub.
  - `docs-deploy.yml`: deploys the docs site to GitHub Pages.
- **Gate:** the evidence points to blocking, but I couldn't confirm it.
  - `CI.yml:13-16` says it "runs the required checks" on `merge_group`.
  - Commit c907b507 says the trigger "is inert until the merge queue is enabled in the branch protection settings for master".
  - `AGENTS.md` says "the merge queue squashes". So the queue is on, and it only runs with required checks.
  - The ruleset itself is on GitHub. I tried `gh api repos/conventional-changelog/commitlint/rules/branches/master`, but the call needed approval and didn't run, so I can't see which checks are required.
- **Audit:** no tool reads the workflows. There is no zizmor, no actionlint step, no `zizmor.yml` and no CodeQL workflow. CodeQL's default setup could be switched on in GitHub settings, but I can't see that from here. zizmor isn't installed locally, and running it through mise needed approval, so I read the workflows by hand instead.
- **Action pinning:** the project pinned actions by SHA in b68fa1a5 (#4343, 2025-03), then went back to tags on purpose in 2c8264b3 (#4458) and b021a07f (#4483, "use tags for immutable GitHub Actions").
  - Today, `actions/*`, `pnpm/action-setup@v6` and the Pages actions use tags. Only the `docker/*` actions are pinned by SHA.
  - The Renovate config in `package.json:91` extends `config:recommended`, which doesn't pin digests.

## Where the repository differs from the ADR's rules and recommendation

1. **Rule 3 (pin by SHA) is broken in every workflow.** For example, `actions/checkout@v7` and `pnpm/action-setup@v6` use tags, and the job container `ubuntu:26.04` (`CI.yml:117`) uses a tag that moves, not a digest.
2. **What zizmor would flag** (read by hand, not run):
   - `unpinned-uses` in all five workflows.
   - `artipacked` on every `actions/checkout`, since none sets `persist-credentials: false`.
   - `excessive-permissions` in `CI.yml` and `container-build.yml`, which have no `permissions:` block. `docs-deploy.yml` also gives `pages: write` and `id-token: write` to both its jobs at workflow level.
   - Possibly `template-injection` at `commitlint.yml:52`. That line expands commit SHAs into a `run:`, which is low risk but likely still reported.
3. **Rule 1 (deploy only from the default branch) has two gaps:**
   - `docs-deploy.yml` accepts `workflow_dispatch` from any branch, and its `deploy` job's `if:` checks the repository, not the branch.
   - `container-build.yml` pushes images on any tag, and on same-repository pull requests that touch `Dockerfile.ci` (`push: true`, line 42).
4. **These rules are already met:**
   - Rule 2: Docker Hub credentials are repository secrets.
   - Rule 5: there's no `pull_request_target`, and pull requests from forks still run CI without secrets.
   - Rule 4: I found nothing that prints a secret.
5. **The stages in the ADR's table already exist:**
   - lint (`package.json:38`), test (`package.json:46`) and build (`package.json:29`) all run.
   - An `image` job exists. Whether it should depends on ADR-0012, which isn't ruled yet.
   - There is no `audit` stage.

## Proposed ruling

**Status: `accepted`**

- `forge.gate: blocking` (not marked: I can't tell): the merge queue and "required checks" intent are in `CI.yml:13-16`, commit c907b507 and `AGENTS.md`, but the master ruleset is a GitHub setting I couldn't read.
- `forge.audit: zizmor (absent)`: nothing reads `.github/workflows/` today, and the hand reading above finds what zizmor exists to catch.

**Departures from the recommendation:** none in the trait values. The open question is rule 3, which applies whatever the ruling. It conflicts with the project's deliberate move to tags in #4458 and #4483, so this ADR has to settle it one way or the other:

- **(a) Adopt rule 3.** Pin by SHA again and have Renovate keep the pins current (`helpers:pinGitHubActionDigests`). This is what I recommend: zizmor's `unpinned-uses` would fail on tags anyway, including GitHub's own `actions/*`.
- **(b) Declare a departure from rule 3** in this ADR, keeping tags. The reason would be that the actions publish immutable releases. Then `forge.audit: zizmor` would fail on every tag, and the ADR forbids loosening that with a `zizmor.yml`. So (b) only makes sense with `forge.audit` set to `none` or to another tool.

The rule 1 gaps and the zizmor findings would become follow-up items, not departures, unless you'd rather declare them as departures.

## Questions

1. **`forge.gate`:** does the ruleset on master require CI's checks (build, Code quality, Commitlint)? If yes, I'll write `blocking` and mark it observed. If not, should it be `blocking` (then it's absent until a ruleset requires them) or `informative`?
2. **Rule 3:** (a) pin by SHA, or (b) keep tags as a declared departure, which also means changing `forge.audit`?

Tell me also whose names go in `authors:`. Once you agree, I'll edit only `ADR-0011-forge-and-ci.md`, run `npx ontrack apply`, and then list the rulings the repository doesn't follow yet.
=================== conventional-changelog__commitlint ADR-0023
I've read the ADR and the repository's licence setup, and found one thing the check will flag. Here is my proposed ruling.

## How the repository handles licensing today

- **Root manifest:** `package.json:18` declares `"license": "MIT"`. There is no `pyproject.toml`.
- **Licence file:** `license.md` at the root holds the full MIT text, with the line `Copyright (c) 2016 - present Mario Nebl`. Git history traces it back to `83314bb7 docs: add basic documentation`.
- **Sub-packages:** all 38 `package.json` files under `@alias/`, `@commitlint/` and `@packages/` declare `MIT`, and each one ships its own `license.md`.
- **CI:** nothing checks licences today.

## Differences from the ADR

1. **Value:** none. The ADR recommends MIT, which is what the repository already uses.
2. **File name:** the ADR expects `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`. The check matches these names exactly, including case (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822,870`). So the lowercase `license.md` will **fail** `ontrack check` once the ADR is accepted, even though the content is correct.
3. **Copyright holder:** the ADR says it should be the organisation that owns the repository, which is `conventional-changelog` according to `origin`. The file names a person, Mario Nebl. Changing who holds the copyright is a legal question for the project, not a technical one, so I propose recording this as a departure rather than changing it.

The ADR applies here: the repository is public and published to npm, so `rejected` is not an option.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: MIT (observed)`: `package.json:18` declares `"license": "MIT"`, and `license.md` holds the MIT text.

**Departures from the recommendation:**
- The copyright line stays `Mario Nebl`, not the owning organisation, because that is the project's existing, long-standing notice.
- The value itself does not depart.
- The file name does not match what the check expects. That is a gap to track and fix afterwards, not a departure written into the ruling.

**Still needed from you:** the names to put in `authors:`, the people who decide this. I can't find them in the repository. If you approve, `date:` will be 2026-11-15.

I don't have a question tool here, so please reply with:

1. **Ruling:** do you agree with `accepted` and `license.spdx: MIT`, keeping Mario Nebl as the copyright holder?
2. **`authors:`:** which names should go in it?

I won't write anything until you answer. After I apply the ruling, I'll go through the rulings the repository doesn't follow yet. The renaming of `license.md` will be one of them, and since no `tracking` trait has been decided, I'll give that list in my reply rather than create tracker items.
=================== conventional-changelog__commitlint ADR-0025
There is a `.mise.toml`. Let me look at it and its history, plus related files.

The repository installs no tool outside its package manager today, and no accepted ADR names one. So I propose `accepted` with `tools.manager: none`, which the ADR allows in that case.

## What the repository does today

- **No tool is installed outside the package manager.** CI, the git hooks, `Dockerfile.ci` and `scripts/` only use npm and pnpm packages, and none of them downloads a binary. Searching `.github`, `.husky`, `package.json` and `scripts/` for gitleaks, zizmor, actionlint, trufflehog, osv-scanner, trivy or shellcheck finds nothing. The audit job runs `pnpm audit`, which comes with pnpm.
- **`.mise.toml` exists, but it is out of this ADR's scope.** It sets `node = "22"` and `pnpm = "12"`. That is the language runtime and the package manager, which the ADR lists as "Not concerned". There is no `mise.lock`, and CI does not use mise: it uses `actions/setup-node` and `pnpm/action-setup`.
- **There is no aqua, asdf or `.tool-versions`**, and no install script for any tool.
- **One binary is already pinned by checksum: pnpm itself.** `packageManager` in `package.json` carries a sha512, which `Dockerfile.ci` checks with `sha512sum -c`. That falls under the package manager, not this ADR.
- **Updates come from Renovate** (the `"renovate"` block in `package.json`). There is no Dependabot.
- **The condition for `none` is met.** The ADR says "`none` is an answer only when no accepted ADR names such a tool". Only ADR-0001 is accepted (see the AGENTS.md "Not yet decided" list). ADR-0015 (which would name `gitleaks`) and ADR-0011 (which could name an audit tool such as `zizmor`) are both still `proposed`.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: none (observed)`: no tool outside the package manager is installed anywhere (CI, hooks, Dockerfile, scripts), and no accepted ADR names one.

**Departures from the recommendation:**

- **`none` instead of `script` or `mise`.** Both recommended values assume at least one tool to install, and there are none here. This ruling has to be revisited, by superseding this ADR, as soon as ADR-0015 accepts a `secrets.guard` other than `none` or ADR-0011 accepts a `forge.audit`. Once one of them is accepted, `ontrack check` fails ADR-0025 under `none`.
- **Rule 4 (who moves the pins): nothing to move.** I would write in the ADR that Renovate, which already runs here, would move the pins once a tool comes in. If mise is chosen then, Renovate's `mise` manager can keep `.mise.toml` and `mise.lock` current together.
- **`.mise.toml` stays as it is.** I would record that it covers only the runtime and the package manager, is not used in CI, and has no lockfile. It is a natural home for a future tool, but this ruling does not use it.

I am not proposing `rejected`: the question does apply, because ADR-0015 and ADR-0011 may soon name tools.

`date: 2026-11-15`. For `authors:`, I would write `[Tristan Rivoallan]` unless you tell me otherwise.

**Do you agree with `accepted` and `tools.manager: none`?** Or would you rather rule `mise` now, ahead of ADR-0015's likely `gitleaks`? That would mean adding `mise.lock`, and it would make the trait `absent`. I'll write nothing to the ADR until you say.
