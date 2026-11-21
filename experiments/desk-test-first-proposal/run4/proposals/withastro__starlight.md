# withastro__starlight

## ADR-0002

I've read the ADR and collected the evidence. I couldn't run `npx ontrack review` because it needs your approval, so this review follows the ADR's own "How to rule" steps.

## What the repository does today

- **Commits are in English.** The last 200 subjects are English and follow the `i18n(<locale>):`, `docs:`, `fix:` and `[ci] release` patterns. Not one of the last 1000 subjects contains common French words (`git log -1000 | grep -ciE '…' → 0`).
- **English is the source language of the docs.** `docs/astro.config.mjs:9` sets `root: { label: 'English', lang: 'en' }`. The 16 other locales under `docs/src/content/docs/<locale>/` are translations of the English pages, tracked by Lunaria (commit "Update Lunaria (#4381)"). `CONTRIBUTING.md` is in English and treats translation as a contribution type (`CONTRIBUTING.md:234`).
- **Code and comments are in English.** Symbols are English, such as `ThemeSelect` and `getMissingResultsUrl`. A search for accented French characters in the code turned up nothing.
- **No file records the working language as a rule.** Before this ADR there was no CONTRIBUTING rule, lint or CI check for it. It is a practice everyone follows without a written rule.

## Compared with the recommendation

The repository already does what the ADR recommends: one default, `english`, with no overrides. No conditional applies. There are **no differences**.

The multilingual docs site doesn't change the answer. Those translations are product content made from English source pages. They aren't the language contributors write in, and the ADR's allowed values (`french`, `english`) don't describe them anyway. Because the question clearly applies here, `rejected` isn't justified.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Marked | Evidence |
|---|---|---|---|
| `default` | `english` | observed | English commits, English root locale (`docs/astro.config.mjs:9`), English code and `CONTRIBUTING.md` |
| `documentation` | *(empty, so `english`)* | observed | `root` locale is English; other locales are translations |
| `commits` | *(empty, so `english`)* | observed | No French in the last 1000 subjects |
| `code` | *(empty, so `english`)* | observed | Symbols are English |
| `comments` | *(empty, so `english`)* | observed | No French found in comments |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is, and add one sentence noting that the localized docs under `docs/src/content/docs/<locale>/` are product translations, not a working language.

When we write it, I'll also set `date: 2026-11-15`, rewrite the Consequences lists for this repository and remove the "How to rule" block.

Do you agree with this ruling? If so, who goes in `authors:`? I'd put "Tristan Rivoallan" unless you want other names. Once you confirm, I'll update the ADR and run `npx ontrack apply`.

## ADR-0004

I've gathered the evidence and am now presenting the proposed ruling for your decision. (I couldn't run `npx ontrack review` because it needs your approval, so I followed the ADR's own "How to rule" steps instead.)

## What the repository does today

- **TypeScript is the language now.** There are 253 tracked `.ts` files under `packages/`, against 64 `.astro` (whose frontmatter is TypeScript), 8 `.mjs` and no `.js` or `.py`. The root `package.json` has `typescript ^6.0.3`, `typescript-eslint` and `@astrojs/check` in its devDependencies, and `tsdown` builds the packages.
- **CI checks the types.** `.github/workflows/ci.yml:139` runs `pnpm typecheck`, which is `astro check --minimumSeverity warning --noSync`. Line 159 runs `pnpm lint`, which runs ESLint with typescript-eslint.
- **The condition in the ADR is met.** It says to pick TypeScript "when the repository runs in a browser or shares code between browser and server". Starlight is an Astro documentation theme: its components ship client scripts to the browser and run on the server at build time. `size-limit` in `package.json` measures `examples/basics/dist/_astro/*.js`, which is the JavaScript sent to the browser.
- **What is missing:** the key is not written anywhere yet. `languages.main.name` is empty in the ADR.

## Proposed ruling: `accepted`

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `languages.main.name` | `TypeScript` | **observed** | 253 `.ts` files under `packages/`; `typescript` and `@astrojs/check` in `package.json`; `pnpm typecheck` in `ci.yml:139` |

**Departures from the recommendation:** none. This is the recommended value, and the condition that selects it holds. The ADR will say in one line that it adopts the recommendation as is.

`rejected` does not apply: this is a code repository, not a docs-only, config or infra one.

When I write the ruling, the ADR's steps also need `date:` and `authors:`. I'd use `2026-11-15` and `[Tristan Rivoallan]`, the name from your git config, without the email. I'd also rewrite the Consequences lists for TypeScript, delete the "How to rule" block, and run `npx ontrack apply`.

**Rulings this repository does not follow yet:** none from this ADR, since TypeScript is already in use. Even if one came up, no `tracking` trait is decided in `AGENTS.md` (ADR-0014 Work tracking is still undecided), so I would only list items in my reply and not create any in a tracker.

**Do you agree with ruling ADR-0004 `accepted` with `languages.main.name: TypeScript`, dated 2026-11-15 and authored by Tristan Rivoallan?** If not, tell me what to change.

## ADR-0006

The `ontrack review` command needs approval I don't have, so I'll go through the repository by hand and follow the ADR's own instructions.

I couldn't run `npx ontrack review` because it needs approval, so I reviewed the ADR by hand, following its own instructions.

## What the repository does today

- **Versions come from Changesets, not from commit messages.** `@changesets/cli` is in `package.json`, and `.changeset/config.json` uses `changelog-github`. `release.yml` runs `changesets/action` (`version-script: pnpm run version`). `CONTRIBUTING.md:94` asks contributors to add a changeset for any user-facing change to `packages/*`. The version bump is chosen by hand in each changeset file.
- **Nothing checks commit messages.** There is no commitlint, husky, lefthook or simple-git-hooks, and no hook in `.git/hooks` (only the samples). No CI workflow checks messages or PR titles. `CONTRIBUTING.md` doesn't mention a commit format.
- **Most commits don't use Conventional Commits.** Only 95 of the last 500 subjects use one of the eleven types. The others:
  - 177 are `i18n(<locale>): …`, and `i18n` is not one of the eleven types.
  - 85 are `[ci] release` or `[ci] format`.
  - Many are plain sentences like "Fix …" or "Add … icon".
- **Few scopes in use:** `deps` (17 times, from Renovate's `chore(deps)`), and one-offs `themes`, `showcase`, `docs`, `css`, `MobileMenuToggle`. The real scope habit is the locale code under `i18n`.
- **Areas of the workspace:** `packages/{starlight, docsearch, markdoc, tailwind, file-icons-generator}`, `docs`, and `examples/*`.

## Proposed ruling: `accepted`

| Key | Value | Marked | Evidence |
|---|---|---|---|
| `commits.tool` | `none` | observed | No commit tooling or CI check exists. Changesets sets the versions. |
| `commits.scopes` | `[deps, i18n, docsearch, markdoc, tailwind]` | absent | `deps` is already in use (17 commits). `i18n` covers the 177 translation commits, which would become e.g. `docs(i18n): update de plugins.mdx`. The other three are the add-on packages. Leaving out a `starlight` scope means an unscoped commit refers to the main package by default. |

**Departure from the recommendation:**
- **`commits.tool: none` instead of `commitlint`.** The ADR only recommends commitlint if versions are generated from commit messages. Here, versions and changelogs come from hand-written changeset files (`.changeset/config.json`, `release.yml`, `CONTRIBUTING.md:94`). A badly formatted message can't produce a wrong version, so the ADR's own "No tool" alternative fits: review keeps the convention.

`commits.scopes` has no recommendation, so choosing it isn't a departure. Alternatives you might prefer:
- **`[]`:** gives up filtering by area.
- **One scope per locale**, such as `de` or `ko-KR`: keeps today's per-locale filtering, but the list is long and grows with every new language.

`rejected` doesn't fit: this is a multi-package monorepo with a busy history, not a single-area repository.

## Gaps if you accept this

There's no decided `tracking` trait in AGENTS.md (ADR-0014 is still undecided), so I'll only list these and create nothing:

- **`[trivoallan/ADR-0006] commits.scopes`:** about 80% of commits don't follow the format governance requires.
  - `i18n(<locale>)` needs to become `docs(i18n)`.
  - The `[ci] release` commit message and PR title in `.github/workflows/release.yml:38-39`, and the `[ci] format` commits, need a real type such as `chore:` or `style:`. `congratsbot.yml:11` matches on `[ci] format` and would need updating too.
  - The scope list should be documented in `CONTRIBUTING.md`.
- **`[trivoallan/ADR-0006] commits.tool`:** nothing to set up with `none`.

**Do you agree with this ruling?** You can also change it, for example by choosing `[]` or per-locale scopes, or by keeping `commitlint`. If you agree, also tell me which names to put in `authors:`. Once you confirm, I'll update only `docs/adr/trivoallan/ADR-0006-commits.md` and then run `npx ontrack apply`.

## ADR-0009

Still gathering evidence, now putting the proposed ruling together. (`npx ontrack review` needed an approval that wasn't given, so I worked from the ADR's own instructions.)

## What the repository does today

**Model: GitHub Flow is already in use.**
- None of the last 500 commits on `main` is a merge commit (`git rev-list --count --merges HEAD~500..HEAD` returned `0`).
- Every commit subject ends in a pull request number, for example `fix: restore aside component icon size (#4396)`. So each change goes branch → pull request → one commit.
- `.github/workflows/ci.yml:6` sets `merge_group:`, which means pull requests merge through GitHub's merge queue.
- Releases also arrive as a pull request (`changesets/action` in `.github/workflows/release.yml:34`), not as a push.
- There is no `develop` or `release/*` branch, and no feature flags.

**Merge: squash is already in use.** One commit per pull request, no merge commits, and the subject is the pull request title.

**Prefixes: no rule exists.** Nothing in `CONTRIBUTING.md`, `.github/` or the config says how to name a branch. The remote branches (`git branch -a`) are mostly named after their author:
- by author: `chris/…`, `nate/…`, `yan/…`, `hd/…`
- by ticket: `dx-1342/…`
- no prefix: `social-flickr`, `format-preserve`, `FredKSchott-patch-1`
- a few happen to use a type: `fix/language-select-lifecycle`, `chore/funding-yml`, `wip/e2e-benchmarks`

Bots and automation create their own branches:
- `renovate/…`
- `ci/file-icons` (`.github/workflows/file-icons.yml:36`)
- `changeset-release/main` (the Changesets default)

## Differences from the recommendation

1. **`model`** and **`merge`** match the recommendation. They are set in GitHub's settings and only show up in the history.
2. **`prefixes`** is new: no branch today follows `<type>/<kebab-case>`.
3. **The ADR's check would fail some pull requests:**
   - **Changesets release pull requests.** The check skips `release-please--`, `releaser-pleaser--`, `dependabot/` and `renovate/`, but not `changeset-release/`. The release ADR (ADR-0012) is not ruled either.
   - **The automated `ci/file-icons` branch,** unless `ci` is one of the allowed prefixes.
   - **External contributors.** Most pull requests come from forks, and `GITHUB_HEAD_REF` holds the contributor's own branch name, such as `patch-1`. Enforcing the check in CI would turn the rule against outside contributors. This is a known cost, not a reason to reject the ADR.

## Proposed ruling: `accepted`

| Key | Value | Marked | Evidence |
|---|---|---|---|
| `branching.model` | `github-flow` | observed | No merge commits in the last 500, a pull request number on every commit, `merge_group` in `ci.yml` |
| `branching.merge` | `squash` | observed | One commit per pull request on `main`, subject = pull request title + `(#N)` |
| `branching.prefixes` | `[feat, fix, docs, chore, ci]` | absent | Today branches are named by author; `fix/` and `chore/` appear, and `ci/file-icons` is created by a workflow |

**Departure from the recommendation:** add `chore` and `ci` to `prefixes`, both taken from the eleven commit types.
- `ci` is needed so the automated `ci/file-icons` branch passes the check.
- `chore` covers dependency and maintenance work that already uses this prefix (`chore/funding-yml`, `chore(deps): …` commits).

I'll also note in the ADR that the check does not skip `changeset-release/main`, and that fork pull requests carry the contributor's branch name.

On authorship, I'd put `authors: [Tristan Rivoallan]` and today's date, `2026-11-15`.

**Do you agree with this ruling?** You can also keep the recommended `[feat, fix, docs]` or change the list. I won't write anything until you answer.

### Rulings this repository doesn't follow yet

AGENTS.md has no decided `tracking` trait (the work-tracking ADR, ADR-0014, is still proposed), so I won't create any tracker items. If the ruling above is accepted, these are left:

- `[trivoallan/ADR-0009] branching.prefixes`: branch names don't follow `<type>/<kebab-case>` today. The work is to document the rule in `CONTRIBUTING.md`, and to decide whether to enforce the check in CI given fork pull requests.
- `[trivoallan/ADR-0009] branching.prefixes`: the check would fail the Changesets `changeset-release/main` pull request. Rule ADR-0012 to name Changesets, or get the check to skip that branch.

## ADR-0011

Still gathering evidence: workflows are on GitHub with zizmor already in CI; now checking the zizmor job's triggers, any zizmor config, and branch protection.

I couldn't run `npx ontrack review`, `zizmor` or `gh api` because the commands needed approval and it wasn't given. Everything below comes from reading the repository's files and git history.

## What the repository does today

- **Forge: GitHub.** `origin` is `github.com/withastro/starlight`, and there are 12 workflows in `.github/workflows/`. The ADR applies, so `rejected` is not an option.
- **Pipeline:** `ci.yml` runs on `pull_request` and `push` to `main`, and on `merge_group`. A `merge_group` trigger only fires when the repository uses a GitHub merge queue, and a merge queue only works on a branch whose ruleset requires checks. That is indirect evidence that the pipeline blocks merges today. I could not confirm which checks are required because `gh api …/rules/branches/main` wasn't approved.
- **Audit:** zizmor is already set up. It was added in `64077c43 feat: integrate zizmor (#4011)`, and the `zizmor` job in `ci.yml:232-248` uses `zizmorcore/zizmor-action@45d7276…` (v0.8.1, pinned by SHA) with `version: 1.32.0`. There is no `zizmor.yml`. Findings are silenced inline with a reason, in the ADR's format: `lunaria.yml:5`, `welcome-bot.yml:4` and `preview-release.yml:77`.
- **Fixed rules:**
  - **Rule 3 (pinning):** every `uses:` is pinned by SHA with the tag in a comment. The exception is `welcome-bot.yml:17` (`zephyrproject-rtos/action-first-interaction@5885399…`), which has the SHA but no tag comment. Renovate keeps the pins up to date (`helpers:pinGitHubActionDigestsToSemver`).
  - **Permissions:** every workflow sets `permissions: {}`, each job asks for only what it needs, and every checkout uses `persist-credentials: false`.
  - **Rule 1 (deploy branch):** no workflow uses `environment:`, and there is no deploy job. `release.yml` is bound to `main`.

## Gaps against the recommendation

1. **`pr-labeler.yml:4` uses `pull_request_target` with no inline ignore.** Rule 5 is still met, because it checks out no fork code. But the ADR's check runs `zizmor --offline --no-config` and fails on any finding without an inline ignore, so this file would very likely fail it on `dangerous-triggers`. The CI job probably doesn't show this: with `security-events: write`, zizmor-action by default uploads SARIF to code scanning instead of failing the job. I haven't verified either point by running zizmor.
2. **The zizmor job likely reports rather than blocks.** That follows from the SARIF upload default above. Rule 1 of the zizmor section asks for a job on every pull request, which exists. Whether a finding stops a merge depends on code-scanning merge protection, which I couldn't read.
3. **`welcome-bot.yml` passes `secrets.FREDKBOT_GITHUB_TOKEN` to a job triggered by `pull_request_target`.** It runs no proposed code, so rule 5's second clause holds. Whether this counts as "an untrusted contribution receives no secrets" is a judgement for review.
4. **The tag comment is missing on `welcome-bot.yml:17`.** This is minor.

## Proposed ruling: `accepted`, no departures from the recommendation

| Key | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | observed (inferred) | `ci.yml:6` `merge_group:` implies a merge queue with required checks; ruleset not read |
| `forge.audit` | `zizmor` | observed | `ci.yml:232-248` zizmor job, pinned action, inline ignores, no `zizmor.yml` |

No condition in the ADR needs checking here. The only conditional is "a forge other than GitHub", and `git remote -v` settles that it doesn't apply.

**Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`?** If you do, I'll also need the name or names to put in `authors:`, and I'll date the ruling 2026-11-15. I won't write anything until you answer.

## Rulings not followed yet (if accepted)

No `tracking` trait is decided (ADR-0014 is still undecided in AGENTS.md), so I checked no tracker for duplicates and will create nothing. Proposed items:

- `[trivoallan/ADR-0011] forge.audit: add an inline zizmor ignore with its reason to pr-labeler.yml's pull_request_target`. This serves ADR-0011.
- `[trivoallan/ADR-0011] forge.audit: make zizmor findings block the merge (fail the job, or require code-scanning merge protection)`. This serves ADR-0011.
- `[trivoallan/ADR-0011] forge.gate: confirm the main ruleset requires the CI checks`. This serves ADR-0011; it can't be verified from the repository.

## ADR-0023

I couldn't run `npx ontrack review` because it needs your approval, so I reviewed the ADR by hand from its file and the repository.

## What the repository does today

- **A licence file exists at the root.** `LICENSE` holds the full MIT text with `Copyright (c) 2023 [Astro contributors](…/graphs/contributors)`. It was added in commit `9e33f998` ("Add LICENSE (#6)").
- **The root manifest declares MIT.** `package.json:15` has `"license": "MIT"`. The root package is `"private": true`.
- **Every package declares MIT too.** `docsearch`, `file-icons-generator`, `markdoc`, `starlight` and `tailwind` all have `"license": "MIT"`. The check only reads the root manifest, but nothing here disagrees with it.
- There is no `pyproject.toml`, so the Python half of the rule doesn't apply.

## Compared with the recommendation

The ADR recommends `MIT`, and the repository already uses MIT, so there is no difference. The ADR has no conditional rules to check. `UNLICENSED` doesn't apply: `private: true` on the root package only stops that workspace from being published, while the packages under `packages/` are published under MIT.

There is one small point that doesn't involve a trait. The ADR says the copyright holder is "the organisation that owns the repository". The existing line names "Astro contributors", which is a reasonable way of naming the withastro project's authors. I suggest leaving it as it is.

## Proposed ruling

**Status:** `accepted`

| Trait | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `license.spdx` | `MIT` | observed | `LICENSE` (MIT text) and `package.json:15` `"license": "MIT"` |

There are no departures from the recommendation, so the reason section would be one line saying the recommendation is adopted as is.

If you agree, I will:
- fill the trait;
- set the status to `accepted`, with today's date (2026-11-15) as the `date:`;
- rewrite the Consequences section;
- delete the "how to rule" block;
- run `npx ontrack apply`.

For `authors:`, I'd use the name from your git config, Tristan Rivoallan, unless you want different names.

## Rulings the repository doesn't follow yet

For this ADR there are none: the repository already meets the ruling. AGENTS.md has no decided `tracking` trait (Work tracking, ADR-0014, is still undecided), so I won't create any tracker items in any case.

**Do you agree with ruling ADR-0023 `accepted` with `license.spdx: MIT`, and with Tristan Rivoallan as the author?**

## ADR-0025

The ADR is read and the CI tooling is inspected. Next I'm checking which other ADRs are actually ruled. The `accepted` lines above come from each file's example block, not from its real frontmatter.

I couldn't run `npx ontrack review trivoallan/ADR-0025-tools` because the command needs your approval, so I reviewed the ADR against its own text by hand.

## What the repository does today

- **No tool manager and no install script.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json` or `.tool-versions`, and no script that installs a binary.
- **No git hooks.** There is no husky, lefthook or pre-commit setup, `.git/hooks` holds only the sample files, and `CONTRIBUTING.md` doesn't ask anyone to `brew install` anything. A workstation runs only what pnpm installs.
- **The devcontainer installs nothing extra.** `.devcontainer/Dockerfile` installs only `pnpm` (through `npm install -g`).
- **One binary runs only in CI: zizmor.** `.github/workflows/ci.yml:246` runs it through `zizmorcore/zizmor-action@45d7276…` (pinned by hash) with `version: 1.32.0`. Renovate updates the action and the `ghcr.io/zizmorcore/zizmor` image together (`.github/renovate.json5`, the "zizmor" group). That falls under "actions and images" (ADR-0011 rule 3), which this ADR leaves out. zizmor doesn't run on workstations or in agent sessions.
- **Other binaries come with the runner.** `jq` and `gh` in `preview-release.yml` are pre-installed on GitHub's runners and aren't pinned.
- **Nothing accepted names a tool.** The ADR's condition for `none` is that "no accepted ADR names such a tool". Only ADR-0001 is `accepted`. ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 (`vulnerabilities.scanner`) are all `proposed`, with their keys empty.

## Compared with the recommendation

The ADR recommends `script` for one tool and `mise` or `aqua` for several. Both assume at least one tool is named, and today none is. For that case the ADR allows `none` explicitly. So `none` matches what the repository does and stays inside the ADR's rules. Strictly it isn't a departure, but it's a different value from the headline recommendation.

**Risk:** if ADR-0011 is later accepted with `forge.audit: zizmor` (the repository already runs zizmor), this ADR's check fails under `none` ("with `none`, it fails when a tool is listed"). This ruling would then have to be superseded, probably by `script` for a single tool.

## Proposed ruling

- **Status:** `accepted` (the question applies, so not `rejected`)
- **`tools.manager: none`** (observed): no file or setup installs a binary outside pnpm. zizmor runs only through a pinned action, and no accepted ADR names a tool.
- **What keeps the pins current (rule 4):** there are no pins under this ADR. zizmor's CI version stays with Renovate under ADR-0011.
- **Departure from the recommendation:** `none` instead of `script`/`mise`. Reason: no accepted ADR names a tool today. I'd add a note that this must be superseded once an accepted ADR names zizmor, gitleaks or grype.
- **`date: 2026-11-15`, `authors: [Tristan Rivoallan]`**. I'll also rewrite the Consequences section and remove the "How to rule" block.

The other option is `script` (absent): pin zizmor by version and checksum in one script, called by CI and by a hook. That's ahead of ADR-0011's ruling, though.

**Do you agree with `accepted`, `tools.manager: none`?** Or would you rather have `script`, or something else? I won't write anything until you answer.

On follow-up items: no `tracking` trait is decided (ADR-0014 is still `proposed`), so I'll list the rulings the repository doesn't follow yet in my reply and won't create any tracker items.