=================== withastro__starlight ADR-0002
I've collected enough evidence. Here is the proposed ruling.

## ADR-0002 Localization: proposed ruling

**Status: `accepted`**, with the recommendation unchanged.

I couldn't run `npx ontrack review trivoallan/ADR-0002-localization`, which AGENTS.md asks for, because the command needed your approval. I worked from the ADR's own "How to rule" steps instead. If you approve the command, I'll check its output against this ruling before I write anything.

### What the repository does today
- **Commits are in English.** The last 2,000 subjects (`git log`) are English. The only non-ASCII text is in proper nouns ("Sätteri") or in German UI strings quoted inside `i18n(de)` commits. No commit message is written in French.
- **Code and comments are in English** across `packages/` (for example `getMissingResultsUrl`, `ThemeSelect`, and the "Improve Sätteri import comment" commit).
- **Documentation is written in English and then translated.** `docs/astro.config.mjs:9` sets `root: { label: 'English', lang: 'en' }`. The other 17+ locales (`fr`, `de`, `ja`, …) under `docs/src/content/docs/` are translations of that English source. They're tracked with Lunaria (`.github/workflows/lunaria.yml`), and CONTRIBUTING.md has a "Translations" section.
- `README.md` and `CONTRIBUTING.md` are in English.
- Nothing in the repository says which language contributors should write in. The rule is followed in practice but written down nowhere, so this ruling would be its first record.

### Traits
- `localization.language.default: english (observed)`: the English root locale in `docs/astro.config.mjs:9`, English commit history, English code, README and CONTRIBUTING.
- `localization.language.documentation: (empty, inherits english) (observed)`: docs are authored in the English root locale, and the locale folders are translations of it.
- `localization.language.commits: (empty, inherits english) (observed)`: English subjects throughout `git log`.
- `localization.language.code: (empty, inherits english) (observed)`: all symbols in `packages/` are English.
- `localization.language.comments: (empty, inherits english) (observed)`: all comments in `packages/` are English.

### Departures from the recommendation
There are none. One point to settle: the docs ship in many languages, but the trait is about the language contributors write in. The translations are a feature of the product, not a second authoring language, so this doesn't call for a `documentation` override. To note that in the ADR, I'll add a line saying the recommendation is adopted as is and that translated docs under `docs/src/content/docs/<locale>/` are governed by CONTRIBUTING.md and Lunaria, not by this trait.

### To complete the ruling I need
1. **Do you agree** to `accepted` with `default: english` and no overrides?
2. **Who goes in `authors:`?** I'd put `[Tristan Rivoallan]` (the git user) unless you name others.
3. **Can I run `npx ontrack review trivoallan/ADR-0002-localization` and `npx ontrack apply`?** The first checks this ruling; the second updates AGENTS.md once the ADR is written.

Once you answer, I'll edit only this ADR. I'll fill the traits, the status, `date: 2026-11-15` and the authors, rewrite the Consequences, and replace the "How to rule" block with the line about adopting it as is. Then I'll run `npx ontrack apply`.

Every trait here is `observed`, so this ruling is unlikely to leave anything the repository doesn't already follow. I'll confirm that once the ADR is written, then check AGENTS.md for a decided `tracking` trait (ADR-0014 is still open), and give the list in my reply if there isn't one.
=================== withastro__starlight ADR-0004
Still collecting evidence: TypeScript looks dominant, and I'm checking for other languages before I propose anything.

I couldn't run `npx ontrack review trivoallan/ADR-0004-languages` because it needs your approval, so I followed the ADR's own "How to rule" steps instead.

## What the repository does today

- **TypeScript is the language the code is written in.** The packages' source, tests and benchmarks (`packages/starlight`, `docsearch`, `markdoc`, `file-icons-generator`, `tailwind`) are `.ts` files, plus `.astro` components.
- **TypeScript's tooling is the reference.**
  - `tsconfig.json:2` extends `astro/tsconfigs/strictest`.
  - `package.json:32` pins `typescript ^6.0.3`, and the repo also uses `typescript-eslint` and `tsdown`.
  - `package.json:13` defines `typecheck` as `astro check`, and CI runs it (`.github/workflows/ci.yml:139`).
  - Tests use vitest and include type tests (`*.test-d.ts`).
- **No other language competes.** There are no `.py`, `.go`, `.rs`, `.rb`, `.php` or `.java` files. The only other code is a few `.mjs` files (`astro.config.mjs` fixtures, `packages/markdoc/index.mjs`, `html.mjs`), which the ADR's Neutral section says don't change the answer.
- **The ADR's condition holds.** It recommends TypeScript "when the repository runs in a browser or shares code between browser and server". Starlight is an Astro integration whose code runs in both places: client-side components and scripts, and server-side build and SSR code (`__e2e__/fixtures/ssr/src/middleware.ts`).

## Proposed ruling

**Status: `accepted`**

- `languages.main.name: TypeScript (observed): the code is in .ts and .astro files, tsconfig extends astro/tsconfigs/strictest, typescript ^6.0.3 is a dev dependency, and CI runs pnpm typecheck`

**Departures from the recommendation: none.** TypeScript is one of the two recommended languages, and it is the one the ADR's own browser/server rule picks. The ADR would say it adopts the recommendation as is.

To complete the ruling, the ADR also needs:
- `date: 2026-11-15`
- `authors:` your name. I'd use **Tristan Rivoallan** (the git user) unless you want someone else.
- the Consequences lists rewritten for this verdict
- the "How to rule" block removed

Then I'd run `npx ontrack apply`, which will also ask for approval.

**Do you agree to rule ADR-0004 `accepted` with `languages.main.name: TypeScript` and `authors: [Tristan Rivoallan]`?** I won't write anything until you confirm. Once it's ruled, I'll check whether the repository follows the ruling and whether anything needs a tracking item. From what I've seen it already does, and since no `tracking` trait is decided in AGENTS.md, I'd list any gaps here rather than create anything.
=================== withastro__starlight ADR-0006
Reading the repository's evidence now; `npx ontrack review` needs your approval to run, so I'm going from the ADR's own instructions.

I've finished reading the evidence. Here is the proposed ruling for **[trivoallan/ADR-0006] Commits**. I couldn't run `npx ontrack review` because it needs your approval, so I followed the ADR's own instructions.

## What the repository does today

- **Versions come from changesets, not from commit messages.** `.changeset/config.json` exists, `package.json` has `"version": "pnpm changeset version …"`, `.github/workflows/release.yml` uses `changesets/action`, and `CONTRIBUTING.md:94` asks contributors to add a changeset. That rules out the ADR's condition for `commitlint` ("if this repository generates its versions from commit messages").
- **Nothing enforces commit messages.** There's no commitlint, husky, lefthook or similar in any `package.json` or `.github/`, no `.husky/` folder, and no CI check on PR titles. `CONTRIBUTING.md` and the PR template say nothing about message format.
- **Most of the history doesn't use Conventional Commits.** Of the last 1000 subjects:
  - 186 follow the format.
  - 386 start with `i18n(<locale>):`, which isn't one of the eleven types.
  - 168 start with `[ci] …`. These are written by `format.yml` and `release.yml`, and `congratsbot.yml:11` matches the exact string `[ci] format`.
  - The rest are free-form ("Fix asides…", "Update i18next…"), some prefixed `[i18nIgnore]`. Lunaria's translation tracker reads that keyword (`docs/lunaria.config.ts:53`).
- **Scopes in use:** `deps` (50, from Renovate's `:semanticPrefixFixDepsChoreOthers`), then a few each of `showcase`, `themes`, `docs` and `plugins`, and singletons like `css`, `MobileMenuToggle` and `content`. The locale codes inside `i18n(...)` are the most-used scope by far.

## Proposed ruling

**Status: `accepted`**

- `commits.tool: none (observed)`: no tool exists today, and versions come from changesets, so a wrong message can't produce a wrong version.
- `commits.scopes: [deps, i18n] (absent)`: `deps` is the only scope used consistently (Renovate). `i18n` keeps the 39% of history that is translation work filterable once it uses a real type, as in `docs(i18n): …`. The one-off scopes are dropped as noise. The ADR warns that "a list invented on adoption ages worse than no list".

**Departures from the recommendation**

- **`tool: none` instead of `commitlint`:** the ADR's condition doesn't hold here, because changesets set the versions. The ADR itself says `none` "is just as good an answer" in that case.
- **The scope list is new:** the ADR recommends no list, so this is a choice rather than a departure. The alternative is `[]`.

Ruling this ADR doesn't fix the format gap. Translators' `i18n(xx):` habit, the bot-written `[ci] format` and `[ci] release`, and the `[i18nIgnore]` keyword all clash with the eleven types that governance imposes. I'll list them as rulings not yet followed once this one is decided.

I don't have a question tool, so please answer here:

1. **Do you agree with `accepted`, `commits.tool: none` and `commits.scopes: [deps, i18n]`?** For scopes, you could instead choose `[]`, or add others such as `showcase` and `themes`.
2. **Who goes in `authors:`?** I'd put "Tristan Rivoallan" unless you name others. The `date:` would be 2026-11-15.

I won't write anything until you answer.
=================== withastro__starlight ADR-0009
Still gathering evidence; checking the format workflow (it may push straight to `main`) and the release workflow.

I couldn't run `npx ontrack review trivoallan/ADR-0009-branching` because it needs your approval. So I worked from the ADR file and the steps you gave.

## What the repository does today

- **Model:** every change goes through a pull request. All ~400 first-parent commits on `main` since May 2026 carry a PR number `(#NNNN)`. `CONTRIBUTING.md:47` asks contributors to fork and open a PR, and `ci.yml` runs on `pull_request` to `main`. The one exception is a bot: `format.yml` pushes `[ci] format` commits straight to `main` (about 40 since May). Nobody pushes to `main` by hand.
- **Merge:** PRs are squashed. Each PR is one commit on `main`, and the last real merge commits are from very early on (`Merge pull request #161`). I can't see the forge setting that allows or blocks merge commits and rebase. It lives in GitHub → Settings → General → Pull Requests.
- **Branch names:** there is no convention, and nothing checks them. Of the 33 non-`main` branches on `origin`, only `fix/language-select-lifecycle` and `chore/funding-yml` start with a commit type. The rest are named after people (`chris/…`, `hd/…`, `nate/…`, `yan/…`), tickets (`dx-1342/…`, `dx-148/…`), bots (`renovate/…`), or have no prefix (`social-flickr`, `format-preserve`). Most PRs come from forks, so their branch names are chosen by outside contributors. Bots create `changeset-release/main` (the Changesets release action) and `ci/file-icons` (`file-icons.yml:36`).
- **The check:** `ontrack check` is not wired into CI or any hook. The only trace of ontrack is the `trivoallan` devDependency in `package.json:34`.

## Proposed ruling: `accepted`

```
branching.model: github-flow (observed): every first-parent commit on main carries a PR number; CONTRIBUTING.md:47 is fork + PR; ci.yml runs on pull_request to main
branching.merge: squash (observed): every PR is one commit on main, with no merge commits since #161; the GitHub setting that allows only squash isn't visible from here
branching.prefixes: [feat, fix, docs, chore] (absent): no convention today; only fix/ and chore/ already appear on origin
```

**Departure from the recommendation:**
- **I added `chore` to `[feat, fix, docs]`.** A large share of this repository's PRs are dependency and tooling updates (`chore(deps): …`, `chore: migrate Changesets to v3`), and `chore/` is already used on `origin`. It is one of the eleven types, so it doesn't invent a new one. Translation PRs (`i18n(..)`), the most common kind here, would go under `docs/`.

**Things to know before you rule:**
- **Forks:** once someone adds `ontrack check` to CI, it reads `GITHUB_HEAD_REF`. On a fork PR that is the contributor's own branch name, so most outside PRs would fail. The ruling binds maintainers' and agents' branches. Enforcing it on forks is a separate CI decision.
- **Bot branches:** the check only skips branches named by ADR-0012 (release-please or releaser-pleaser) and ADR-0018 (dependabot or renovate). Both are still unruled. Even once they are ruled, `changeset-release/main` (Changesets) and `ci/file-icons` (`ci/` isn't in the proposed list) would fail if the check ran in CI.
- **`squash` and versions:** the ADR expects the squash message to carry the Conventional Commits type. Here, versions come from Changesets, not commit messages, and PR titles are mostly free text ("Fix …", "Add …"). That belongs to ADR-0006 (commits), which is still unruled.

I have no question tool here, so please answer these directly:

1. **Do you agree with the ruling** (`accepted`; `github-flow`, `squash`, `[feat, fix, docs, chore]`)? Or would you rather use the recommended `[feat, fix, docs]` unchanged, or a different list?
2. **Merge setting:** can you confirm that the GitHub repo settings allow only squash merging? If merge commits or rebase are also enabled, I'll note that `squash` is what the history shows, not something the forge enforces.
3. **For `date:` and `authors:`:** what name should go in `authors:`? Today, 2026-11-15, would be the date.

I'll write nothing until you answer. Once the ruling is written, I'll list what this repository doesn't follow yet. No `tracking` trait is decided in AGENTS.md (ADR-0014 is unruled), so that list will stay in my reply and I'll create no tracker items.
=================== withastro__starlight ADR-0011
I'm reviewing ADR-0011. The CI files are read. The GitHub ruleset query needs approval, so next I'll try running zizmor locally.

The ADR file and all 12 workflows are read. Two things were blocked: the GitHub ruleset query (`gh api …/rules/branches/main`) and a local zizmor run (`uvx zizmor@1.32.0`). The ruling below therefore rests on the files alone, and where that leaves a gap I say so.

## What this repository does today

- **Forge:** GitHub (`origin` → `github.com/withastro/starlight`), with 12 workflows in `.github/workflows/`. `rejected` does not apply.
- **Pipeline:** `ci.yml` runs on PRs to `main`, on pushes to `main` and on `merge_group`. Its jobs are unit tests, e2e tests, type checks, lint, a11y, a Windows build, link checks and a zizmor job.
- **Is a red pipeline blocking?** The `merge_group:` trigger (`ci.yml:6`) means a GitHub merge queue is in use, and a merge queue works by waiting for required checks. That points to `blocking`. But which checks are required is set in a ruleset on GitHub, and I could not read it.
- **zizmor:** already set up.
  - A `zizmor` job runs on every PR (`ci.yml:232–248`), pinned by SHA (`zizmorcore/zizmor-action@45d7276… # v0.8.1`, zizmor 1.32.0).
  - Findings are silenced inline with a reason (`lunaria.yml:5`, `welcome-bot.yml:4`, `preview-release.yml:77`).
  - There is no `zizmor.yml`.
  - Renovate keeps zizmor and its action up to date (`.github/renovate.json5:49–56`).
- **The five rules:**
  - **Rule 1 (deploy only from `main`):** followed. No workflow has an `environment:`, and `release.yml` runs only on pushes to `main`.
  - **Rule 2 (secrets in GitHub settings):** followed. Every secret comes from `secrets.*`.
  - **Rule 3 (pin by SHA):** followed, with one gap: `welcome-bot.yml:17` pins `zephyrproject-rtos/action-first-interaction@58853996…` with no tag comment.
  - **Rule 4 (no secret in a log):** I found no case of a secret's value being printed.
  - **Rule 5 (no secrets or proposed code for forks):** followed. The `pull_request_target` workflows never check out the PR's code.

## Differences from the recommendation

1. **`pr-labeler.yml:4` uses `pull_request_target` with no inline `zizmor: ignore`.** I expect zizmor's `dangerous-triggers` audit to flag it, so `ontrack check` (`zizmor --offline --no-config`) would fail. I could not run zizmor to confirm this.
2. **The zizmor job probably cannot fail.** By default, `zizmor-action` sends its findings to GitHub code scanning instead of failing the job, so a finding reports rather than blocks. Whether it blocks depends on the code-scanning settings on GitHub, which I can't see.
3. **One action has no tag comment** (`welcome-bot.yml:17`, rule 3).
4. **The zizmor job is skipped on draft Changesets release PRs**, because it depends on the `changes` job (`ci.yml:24–27`). That is a small exception to "every pull request".

## Proposed ruling

**Status: `accepted`**

- `forge.gate: blocking` (**not marked**): the merge-queue trigger (`ci.yml:6`) suggests required checks exist. But the ruleset or branch protection that makes a check required lives on GitHub, under Settings → Rules or Branches, and I could not read it.
- `forge.audit: zizmor (observed)`: `ci.yml:232–248` runs `zizmorcore/zizmor-action` pinned by SHA, findings are silenced inline in 3 workflows, and there is no `zizmor.yml`.

**Departures from the recommendation:** none in the values. The gaps above (items 1–4) are places where the repository doesn't yet follow the ruling, not departures from it.

Two questions before I write anything:

1. **Is `blocking` correct?** Does a ruleset on `main` (or the merge queue) require the CI checks, including `Run zizmor`?
2. **Do you accept this ruling, and who should be listed in `authors:`?**

The other ADRs are still `proposed`, so none of them is in this review.

## Rulings this repository does not follow yet

These apply if you accept:

- `[trivoallan/ADR-0011] forge.audit`: add an inline `# zizmor: ignore[dangerous-triggers] <reason>` to `pr-labeler.yml:4`, or change the trigger.
- `[trivoallan/ADR-0011] forge.audit`: add the tag comment to `welcome-bot.yml:17` (rule 3).
- `[trivoallan/ADR-0011] forge.gate`: if code scanning doesn't block on zizmor alerts, make the `zizmor` job fail on findings (or require the code-scanning check) so a finding actually stops a merge.

No `tracking` trait is decided in `AGENTS.md`, so I won't create any tracking items. The list above is all of them.
=================== withastro__starlight ADR-0023
I checked how the repository handles licensing today. Here is the ruling I propose for **[trivoallan/ADR-0023] License**. I couldn't run `npx ontrack review trivoallan/ADR-0023-license` as AGENTS.md asks, because the command needed approval. The ADR's own instructions on how to rule were enough to go on.

## What the repository does today

- **Licence file:** there is a `LICENSE` at the root holding the full MIT text, with the line "Copyright (c) 2023 [Astro contributors](…)". It was added in `9e33f998 Add LICENSE (#6)`.
- **Root manifest:** `package.json:15` declares `"license": "MIT"`. It also has `"private": true`, but that only keeps the workspace root from being published. It doesn't make the code private.
- **Published packages:** `packages/starlight`, `markdoc`, `docsearch` and `tailwind` all declare `"license": "MIT"`. The private `file-icons-generator` does too.
- **No `pyproject.toml`** exists, so the PEP 639 part of the ADR doesn't apply.
- **The repository is public** (`origin` is `github.com/withastro/starlight`), so `UNLICENSED` is not an option.
- **Copyright holder:** the line names "Astro contributors", the project behind the owning organisation `withastro`. That fits the ADR's rule that the holder is the organisation that owns the repository.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: MIT (observed): LICENSE (MIT text) and "license": "MIT" in package.json:15, also in every published package.`

**Departures from the recommendation:** none. The repository already follows MIT and the three rules the ADR fixes whatever you rule. The ADR's check (the root manifest's licence equals `license.spdx`, and a licence file sits at the root) would pass today.

When I write the ruling I'll fill in `date: 2026-11-15`. `authors:` should list the names of the people who decided, without email addresses. Should I put **Tristan Rivoallan**, or other names?

**Do you agree with `accepted`, `license.spdx: MIT`, and the authors above?** I'll write nothing until you confirm.

Once this is ruled, there are no rulings left that the repository doesn't follow, so there would be nothing to track. Also, no `tracking` trait is decided in AGENTS.md (ADR-0014 is still undecided), so I wouldn't create tracker items anyway.
=================== withastro__starlight ADR-0025
Checking which ADRs are already ruled, and how the one external tool (zizmor) is installed in CI.

I couldn't run `npx ontrack review` because the command was waiting for your approval, so this review rests on reading the ADR and the repository directly.

## What the repository does today

- **No tool is installed outside pnpm and GitHub Actions.** There is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml` or install script. No git hooks are set up (no husky, lefthook, simple-git-hooks or lint-staged). Nothing uses `curl`, `brew` or `go install`.
- **The only such binary is zizmor, and it runs only on the CI runner.** `.github/workflows/ci.yml:246` uses `zizmorcore/zizmor-action@45d7276…` (pinned by hash) with `version: 1.32.0`, and that runs the image `ghcr.io/zizmorcore/zizmor`. The ADR leaves actions and images out of scope ("ADR-0011 rule 3"). Renovate keeps them current, grouped in `.github/renovate.json5:48-57`. Nobody runs zizmor on a workstation or in an agent session.
- **The dev container** (`.devcontainer/Dockerfile`) installs only pnpm, through `npm install -g pnpm`. The language runtime and the package manager are also out of scope.
- **The condition "`none` is an answer only when no accepted ADR names such a tool" holds.** Only ADR-0001 says `status: accepted` in its frontmatter. ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 are all still `proposed`. So the `check:` line would find no tool to list today.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: none (observed)`: the repository has no pin file and no install script, and no accepted ADR names a tool. zizmor comes in only as a hash-pinned action (`ci.yml:246`), which is out of scope.

**Departure from the recommendation:** the ADR recommends `script` for one tool and `mise` or `aqua` for several, but that assumes a tool is named. With none named, `none` is the answer the ADR itself allows. Rules 1–3 have nothing to pin, and rule 4 has nothing to keep current.

**When to rule again:** ruling ADR-0015 with a `secrets.guard` such as gitleaks makes `none` fail its check, and so would ADR-0011 with a `forge.audit` that runs zizmor locally. At that point this ADR needs a new ruling, most likely `script` for one tool. I'll put that note in the ADR.

**Still to follow:** nothing for this ruling, since `none` matches the repository. No `tracking` trait is decided yet (ADR-0014 is `proposed`), so I would create no tracking item anyway.

Before I write anything:
- Do you agree with `accepted` / `tools.manager: none`?
- What name goes in `authors:`? I'd suggest "Tristan Rivoallan". The date will be 2026-11-15.
