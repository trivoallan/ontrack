=================== withastro__starlight ADR-0002
I've checked the repository's languages (docs config, contributing guide, commit history, code comments). Here is the proposed ruling for ADR-0002.

Note: I couldn't run `npx ontrack review trivoallan/ADR-0002-localization` because it needs your approval in this session, so I followed the ruling steps written in the ADR itself.

## What the repository does today

- **Documentation:** written first in English and translated into 16 other languages. In `docs/astro.config.mjs:9`, English is `root` (`{ label: 'English', lang: 'en' }`), and `de`, `es`, `fr`, `ja` and the others are listed under it. Translations live in `docs/src/content/docs/<lang>/`, and Lunaria tracks them (`.github/workflows/lunaria.yml`, `CONTRIBUTING.md:259`). `CONTRIBUTING.md` itself is in English.
- **Commits:** all English (`git log -60`). Even translation work is described in English, like `i18n(ja): update plugins.mdx`. A search of 2000 commits for accented letters found only one in French content: `Inverted both "Précédent" and "Suivant"`, which quotes French interface labels in an English sentence.
- **Code and comments:** English symbols and comments throughout `packages/`. The only accented comment is an example filename (`café.md`, `packages/starlight/src/utils/git.ts:70`).
- **Interface text** in other languages lives in data files (`packages/starlight/src/translations/*.json`). That is what the product ships to its users, not the language the repository is written in.

## Comparison with the recommendation

The recommendation is `default: english` with no overrides. The repository already matches it on all four media, so there are **no differences**. The translated docs don't count as a `documentation` override: English is the source, and the translations are a product feature. The allowed values (`french`, `english`) can't express them anyway. The recommendation has no conditions to check.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | English is the `root` locale in `docs/astro.config.mjs:9`; commits, code and comments are all English |
| `documentation` | *(empty, same as default)* | English source docs; translations come from it |
| `commits` | *(empty)* | `git log`: English subjects, including `i18n(*)` commits |
| `code` | *(empty)* | English symbols in `packages/` |
| `comments` | *(empty)* | English comments in `packages/` |

- **Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is, and add one note: the docs translations are product content tracked by Lunaria, not an override.
- **Date:** `2026-11-15`
- **Authors:** `[Tristan Rivoallan]`, taken from git config. Correct me if others took part in the decision.
- **Consequences:** I'll rewrite them for this repository. The current ones are about a French-speaking team and don't fit here.

Do you agree with this ruling, and with the authors? I'll write nothing until you confirm. After that, I'll update the ADR and run `npx ontrack apply`.
=================== withastro__starlight ADR-0004
I'm still gathering evidence on which language this repository uses. Here is the ruling I propose for **ADR-0004 Languages**. I haven't written anything yet.

Note: `npx ontrack review trivoallan/ADR-0004-languages` was blocked because it needed your approval, so it didn't run. This ruling comes from the ADR file and the repository alone.

## What the repository does today

- **TypeScript is the main language.** It has 266 tracked `.ts`/`.tsx` files and 92 `.astro` files, which are components with TypeScript frontmatter. There are only 17 `.js`/`.mjs` files, and no Python, Go or Rust at all (`git ls-files`).
- **Its tooling is built around TypeScript.** The root `package.json` has `typescript ^6.0.3`, `typescript-eslint`, `tsdown`, and `"typecheck": "astro check ..."`. There is a root `tsconfig.json`, and the packages `starlight`, `docsearch`, `markdoc`, `tailwind` and `file-icons-generator` are all npm/TypeScript packages.
- **CI checks TypeScript.** `.github/workflows/ci.yml:139` runs `pnpm typecheck`.
- **Nothing declares the language explicitly.** It isn't in AGENTS.md or any config. It can only be inferred, which is the gap this ADR describes.

## The ADR's condition

The ADR recommends TypeScript "when the repository runs in a browser or shares code between browser and server". That applies here. Starlight is an Astro documentation theme: its `.astro` and TS components render on the server and ship scripts that run in the browser.

## Proposed ruling

- **Status:** `accepted`
- **`languages.main.name`: `TypeScript`.** Evidence: the 266 TS files, `typescript` and `typescript-eslint` in `package.json`, `tsconfig.json`, and `pnpm typecheck` in CI.
- **Departures from the recommendation:** none. In place of the "How to rule" block, I'll write one line saying the recommendation is adopted as is.
- **Other edits:** I'd set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, and rewrite the Consequences lists for TypeScript. For example, the Go/Rust negative no longer applies. JavaScript, `.astro` and MDX files stay as secondary languages.

Once you agree, I'll edit only this ADR and run `npx ontrack apply`, which will also need your approval.

**Do you agree to rule ADR-0004 `accepted` with `languages.main.name: TypeScript`?** Tell me if you want different authors or wording.

The step that lists rulings the repository doesn't follow yet comes after every ADR is ruled. No `tracking` trait is decided yet (ADR-0014 is still proposed), so for now I'll only give that list in my reply and won't create any tracking items.
=================== withastro__starlight ADR-0006
The `npx ontrack review` command needs approval I don't have, so I'll follow the ADR's own instructions and look at the repository directly.

I checked the repository against ADR-0006 (Commits). `npx ontrack review` needed approval I didn't have, so I followed the ADR's own instructions instead. Here's the ruling I propose. I haven't written anything yet.

## What the repository does today

- **Versions don't come from commit messages.** They come from Changesets: `.changeset/config.json` and the `changesets/action` step in `.github/workflows/release.yml:34`. Each version bump is written by hand in a changeset file.
- **No commit check exists.** Nothing in any `package.json`, `.github/` or `CONTRIBUTING.md` mentions commitlint, husky, lefthook or "conventional", and `.git/hooks` has only the sample files.
- **Most commits don't use Conventional Commits.** Main gets squash-merged PR titles. Of the last 300 commits:
  - about 100 are plain sentences, like "Fix sidebar links containing a query string or hash (#4352)";
  - 103 start with `i18n(<locale>):`, and `i18n` is not one of the eleven types;
  - 24 are `[ci] format` and the release commit is `[ci] release`, written by bots;
  - about 67 are conventional (`docs`, `chore(deps)` from Renovate's `:semanticPrefixFixDepsChoreOthers`, `fix`, `feat`, `perf`, `ci`).
- **Scopes are rarely used.** Outside i18n there are only three: `deps` (10 commits), `themes` (2) and `MobileMenuToggle` (1).
- **The repository has several areas.** `packages/` holds starlight, tailwind, docsearch, markdoc and file-icons-generator, next to `docs/` and the translations. `.github/labeler.yml` already sorts PRs into core, tailwind, docsearch, markdoc, docs, i18n and action.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `none` | The ADR recommends commitlint only "if this repository generates its versions from commit messages". It doesn't, so the condition fails and the ADR says `none` "is just as good an answer". Review keeps the convention, as it does today. |
| `commits.scopes` | `[core, tailwind, docsearch, markdoc, docs, i18n, deps]` | The first six come from the areas `labeler.yml` already uses for PRs. `deps` is the scope Renovate already writes. I left out `action` because the `ci` type covers it. I also left out `file-icons-generator`, which has no label of its own. |

**Departures from the recommendation:**
- `commits.tool: none` instead of `commitlint`. Versions are set by hand through Changesets, so the reason for commitlint doesn't apply here.

**Not `rejected`**, because the repository has several areas and its PR labels already sort changes by area.

**Things to know before you agree** (outside this ruling, but they'll come up again in the list of rulings not followed yet):
- The format the ADR imposes isn't followed today. About two thirds of recent PR titles would have to change.
- The `i18n(ko-KR):` style would become something like `docs(i18n): update ko-KR plugins`. The locale moves out of the scope, unless you want the locale codes as scopes (about 17 of them).
- The bot messages (`[ci] format`, `[ci] release`) aren't conventional either.

Do you agree with this ruling? You could also choose a different scope list (locale codes, `starlight` instead of `core`, adding `file-icons`), a different tool (`hook` or `commitlint`), or `rejected`. Once you answer, I'll fill the traits, set the status, date and authors, rewrite the Consequences, and run `npx ontrack apply`.
=================== withastro__starlight ADR-0009
Still gathering evidence on how branches are named and merged here.

I have enough evidence to propose a ruling. I couldn't run `npx ontrack review` because it needed your approval, so I followed the ADR's own five ruling steps.

## What this repository does today

**Model: GitHub flow, through forks.**
- `CONTRIBUTING.md:47-49` tells contributors to fork the repo and open a pull request.
- Every recent commit on `main` has one parent and ends with a PR number, for example `5ca12c29 … (#4387)`.
- No `develop`, `release/*` or `hotfix/*` branches exist, so it isn't gitflow. Nobody pushes straight to `main`, so it isn't trunk-based.
- CI runs on pull requests to `main` (`ci.yml:5-8`).

**Merge: squash.**
- `git rev-list --merges --count main` gives 43 merge commits out of about 3,900. The last merged PR (`Merge pull request #147`) is from 2023-06-06. The only later one is a one-off from 2024-11-09 (`37079e92`).
- Since then, every change lands as a single commit titled after its PR.
- I can't see the forge's merge settings from here. The history is the evidence.

**Branch names: no convention.**
- Branches in the main repo use several patterns:
  - person names: `chris/…`, `nate/astro-5`, `yan/…`, `hd/…`
  - ticket IDs: `dx-1342/sidebar-flash`
  - no prefix: `social-flickr`, `format-preserve`, `FredKSchott-patch-1`
  - a few commit types: `fix/language-select-lifecycle`, `chore/funding-yml`, `ci/file-icons`
  - `wip/…`, which isn't a commit type
- Bots use their own names: `renovate/*` (`.github/renovate.json5`), `changeset-release/main` (`ci.yml:26`) and `ci/file-icons` (`file-icons.yml:36`).
- Most PRs come from forks, where branches have names like `patch-1`.

## The proposed ruling

**Status:** `accepted`

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | One PR per change, via forks (`CONTRIBUTING.md:47`); CI runs on PRs to `main` |
| `branching.merge` | `squash` | Single-parent commits with a PR number since 2023 |
| `branching.prefixes` | `[feat, fix, docs, chore, ci]` | `fix/`, `chore/` and `ci/` are already used as branch prefixes. `docs:` and `chore(deps):` are common in commit messages. All five are among the eleven allowed commit types. |

**Differences from the recommendation:**
1. **Adding `chore` and `ci` to the prefixes.** The repo already uses both (`chore/funding-yml`, `ci/file-icons`, the `chore(deps)` commits). Dropping them would make existing practice non-compliant for no gain.
2. **Squash commit titles don't follow Conventional Commits today.** Titles look like `Update i18next to v27` or `i18n(ja): …`, and `i18n` isn't one of the eleven types. That's for ADR-0006 to settle, not this one. Here I'm only noting it.

**Risks if the ADR's check is turned on:**
- Fork branches like `patch-1` would fail it.
- So would `changeset-release/main`, because the check only skips release-please/releaser-pleaser and dependabot/renovate branches.
- So the check isn't usable in CI as things stand. The fix is to rule ADR-0012 (delivery) first and decide whether fork PRs are held to the prefixes.

**Other frontmatter:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from the git user name.

The ADR's five steps also replace its "How to rule" block with the reasons for these differences, and rewrite the Consequences lists to match.

Do you agree with this ruling, or do you want changes? For example, you could keep exactly `[feat, fix, docs]`, or name different authors. Once you agree, I'll edit only this ADR and run `npx ontrack apply`, which will also need your approval.
=================== withastro__starlight ADR-0011
Evidence so far: the repo is on GitHub and `ci.yml` already runs zizmor. Next I'm checking the branch rulesets and running zizmor locally.

# Proposed ruling for ADR-0011 (Forge and continuous integration)

**Proposed status: `accepted`**, with both values as recommended.

`rejected` doesn't fit. The ADR allows it for only one case, a forge other than GitHub, and this repo is on GitHub: `origin` is `https://github.com/withastro/starlight.git` and it has 12 workflows in `.github/workflows/`.

## How the repository handles this today

- **Pipeline:** `.github/workflows/ci.yml` runs on `push` to `main`, on `pull_request` to `main`, and on `merge_group`. Its jobs cover unit tests, end-to-end tests, type checks, lint, accessibility, a Windows build, a link check and zizmor. `size-limit.yml` also checks pull requests.
- **Whether a red pipeline blocks merges:** the `merge_group` trigger (`ci.yml:6`) means the repo uses GitHub's merge queue, and a merge queue gates merging on the checks it requires. That points to blocking, but only indirectly. I couldn't read the actual ruleset because `gh api repos/withastro/starlight/rules/branches/main` needed an approval it didn't get.
- **Who reads the workflows:** zizmor already does. `ci.yml:232-248` runs `zizmorcore/zizmor-action@45d7276…` (v0.8.1, pinned by SHA) with zizmor `1.32.0`, the same version the ADR was measured with. It was added in commit `64077c43` ("feat: integrate zizmor (#4011)"), and Renovate groups its updates (`.github/renovate.json5:49-56`).
- **Silencing findings:** the repo silences only with inline ignores that give a reason: `welcome-bot.yml:4`, `lunaria.yml:5` and `preview-release.yml:77`. There is no `zizmor.yml`.
- **Pinning:** every `uses:` is pinned by SHA with the tag in a comment, `actions/*` included. The one exception is `welcome-bot.yml:17`, which has a SHA but no tag comment.
- **Permissions:** every workflow starts with `permissions: {}`, and each job is granted only what it needs. Every checkout sets `persist-credentials: false`.
- **Deploy (rule 1):** no workflow has an `environment:` key, so there's no deploy job. Releases come from `release.yml` on `main`.
- **Forks (rule 5):** both `pull_request_target` workflows (`pr-labeler.yml`, `welcome-bot.yml`) avoid checking out the pull request's code. `size-limit.yml` gives the bot token only to pull requests from the repo itself, not to forks.

## Proposed values

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | The `merge_group` trigger in `ci.yml:6` shows a merge queue, which gates merges on required checks. I couldn't confirm the ruleset itself. |
| `forge.audit` | `zizmor` | The `zizmor` job in `ci.yml:232-248` runs zizmor 1.32.0 through a SHA-pinned `zizmor-action`. The repo silences findings only inline and has no `zizmor.yml`. |

Since both values match the recommendation, the ADR would get one line saying it was adopted as is.

## Gaps against the recommendation

These are gaps in how the repo follows the ruling, not reasons to rule differently:

1. **The CI zizmor job probably doesn't fail on findings.** It uses the action's defaults, which as far as I know upload results to GitHub code scanning (it has `security-events: write`) instead of failing the job. The ADR's own check fails on any finding. I haven't verified this.
2. **`pr-labeler.yml` uses `pull_request_target` with no inline ignore.** It doesn't check out any code, so it follows rule 5. But zizmor's `dangerous-triggers` audit will probably flag it when run with `--no-config`, which would fail `ontrack check`.
3. **`welcome-bot.yml:17` is pinned by SHA but has no tag comment.** Rule 3 asks for the tag in a comment.
4. **Nothing in the repo shows the ruleset that makes `blocking` real.** The ADR expects that; it's a GitHub setting.

## What I couldn't run

Each of these needed approval that wasn't given:
- `npx ontrack review`, the command AGENTS.md says to run for an ADR review. I followed the ADR's own instructions instead.
- `gh api …/rules/branches/main`, to read the ruleset on `main`.
- `zizmor --offline --no-config .github/workflows`, to confirm gaps 1 and 2.

If you approve them, I'll run them before writing anything.

## What I'd write once you agree

- `traits.forge.gate: blocking` and `traits.forge.audit: zizmor`
- `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]` (taken from the git user)
- The Consequences lists rewritten for this repo
- The "How to rule" block replaced with the "adopted as is" line
- Then I'd run `npx ontrack apply` to update AGENTS.md.

**Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`?** And should I first run the three commands above to check the ruleset and the zizmor findings?
=================== withastro__starlight ADR-0023
I've read the ADR and checked the repository. Here's the proposed ruling for **ADR-0023 License**.

I couldn't run `npx ontrack review trivoallan/ADR-0023-license`, which AGENTS.md asks for, because the command needed your approval. The ADR's own ruling steps (lines 89–104) were enough to work from.

## What the repository does today

- **Licence file:** `LICENSE` at the root holds the full MIT text. It was added on 2023-04-06 (`9e33f998 Add LICENSE (#6)`) and is the only licence file in the repo.
- **Root manifest:** `package.json:15` has `"license": "MIT"` (and `"private": true`). There is no `pyproject.toml`.
- **Published packages** all say `"license": "MIT"`: `packages/starlight`, `markdoc`, `docsearch`, `tailwind`, and also `file-icons-generator`, which is private. Private examples, docs and test fixtures declare no licence.
- **Public repository:** the remote is `github.com/withastro/starlight`, and the packages are published to npm. So `UNLICENSED` and `rejected` don't apply.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `MIT`**. Evidence: `LICENSE` (MIT text) and the `"license": "MIT"` field in the root and every package manifest. This is also the ADR's recommendation.
- **date:** 2026-11-15
- **authors:** `[Tristan Rivoallan]`, unless you want other names.

**The licence value doesn't depart from the recommendation.** There is one difference, with one of the ADR's fixed rules (Decision, point 3). The ADR says the copyright holder is "the organisation that owns the repository" (withastro). The current `LICENSE` line reads `Copyright (c) 2023 [Astro contributors](…/graphs/contributors)`, so it names the project's contributors, not the organisation. Two ways to handle it:

- **(a) Record a departure:** keep "Astro contributors" and give the reason in the ADR (copyright stays with the contributors, since there is no CLA). This is my recommendation.
- **(b) Treat it as a gap:** list it later as a ruling the repo doesn't follow yet.

The automated check would pass either way: the root manifest says `MIT` and a `LICENSE` exists at the root.

**Do you agree with `accepted` / `license.spdx: MIT`, with authors `[Tristan Rivoallan]`, and option (a) or (b) for the copyright line?** I won't write anything until you answer.
=================== withastro__starlight ADR-0025
Checking the devcontainer image and package.json for hooks, then I'll propose the ruling.

I couldn't run `npx ontrack review trivoallan/ADR-0025-tools` because it needs your approval, so this review follows the ADR file itself, which the prompt says takes precedence.

## What the repository does today

- **No tool manager and no install script.** There is no `mise.toml`/`mise.lock`, `aqua.yaml`, `.tool-versions` or `scripts/` directory (searched, no matches).
- **No git hooks.** There is no husky, lefthook, simple-git-hooks or pre-commit config, and nothing in `package.json`. So nothing runs a binary on a workstation.
- **The dev container installs no extra tools.** `.devcontainer/Dockerfile` adds only pnpm, via `npm install -g pnpm`, and `postCreateCommand` runs `pnpm install`. The package manager falls outside this ADR.
- **zizmor is the only binary used outside the package manager, and only in CI.** `.github/workflows/ci.yml:246` runs it through `zizmorcore/zizmor-action@45d7276…` (pinned by hash) with `version: 1.32.0`. No checksum is set, and it never runs locally or in an agent session. It was added in `64077c43 feat: integrate zizmor (#4011)`. As an action and image it falls under ADR-0011 rule 3, not this ADR.
- **Updates come from Renovate, not Dependabot.** `.github/renovate.json5` groups `zizmorcore/zizmor-action` with `ghcr.io/zizmorcore/zizmor`.

## The condition in the recommendation

The recommendation is `script` for one tool and `mise` or `aqua` for several. It also says "`none` is an answer only when no accepted ADR names such a tool" (line 68).

That condition holds today. ADR-0001 is the only accepted ADR (line 5 of every other ADR file says `status: proposed`). So `secrets.guard` (ADR-0015) and `forge.audit` (ADR-0011) don't exist yet, and no accepted ADR names a tool.

## Proposed ruling

- **Status:** `accepted` (not `rejected`: the question applies, because CI already uses a binary from outside the manifest).
- **`tools.manager: none`.** No accepted ADR names a tool. The repository has no manager, no script and no hook, and its one such binary (zizmor) arrives as an action, which this ADR leaves out of scope.
- **`date: 2026-11-15`, `authors: [Tristan Rivoallan]`**, taken from the git user.
- **Rule 4 (what keeps pins current):** nothing to pin under `none`. Renovate stays the updater for actions and images, including zizmor-action.

**Departures from the recommendation:** none, strictly. With zero tools, the ADR's own condition allows `none`. Where the repository differs from the rules the ADR fixes:
1. zizmor's version is written only in `ci.yml`, with no checksum (rule 1). That is acceptable while it stays an action.
2. No single place serves a workstation or agent session (rule 2), because nothing runs locally.
3. The updater is Renovate rather than Dependabot.

**Caveat:** `none` won't hold if ADR-0015 or ADR-0011 gets accepted with a tool. For example, `forge.audit: zizmor` would match today's CI, and a `secrets.guard` such as gitleaks would make two tools. With `none`, this ADR's check fails as soon as a tool is listed. In that case I'd switch to **`mise`**. Renovate, which this repo already uses, has a `mise` manager that also updates `mise.lock`, and that covers rule 4.

**Do you agree with `accepted` / `tools.manager: none`, or would you rather rule `mise` now in anticipation of ADR-0011 and ADR-0015?** I'll write nothing until you answer. After that I'll fill the frontmatter, rewrite Consequences, replace the how-to block with the rule 4 statement and the reasons, and run `npx ontrack apply`.

The list of rulings the repository doesn't follow yet, and the tracker items for them, wait until every ADR is ruled. ADR-0002 to ADR-0026 are all still `proposed`, and no `tracking` trait is decided.
