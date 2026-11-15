=================== withastro__starlight ADR-0002
I couldn't run `npx ontrack review` because the command needs your approval and wasn't run. So this review follows the ADR file itself, which spells out how to rule.

## Proposed ruling: ADR-0002 Localization

**Status:** `accepted`, keeping the recommendation (`default: english`, no overrides). I found nothing in the repository that argues against it.

| Trait key | Proposed value | Evidence |
|---|---|---|
| `localization.language.default` | `english` | The docs site's root locale is English (`docs/astro.config.mjs:9`: `root: { label: 'English', lang: 'en' }`). Commit subjects are in English (`git log`: `docs: point the changeset link…`, `fix: restore aside component icon size`). `CONTRIBUTING.md` is written in English. |
| `…documentation` | *(empty, same as default)* | English is the language the docs are written in first. Other locales (`de`, `fr`, `ja`, `zh-cn`, …) are translations of it (`CONTRIBUTING.md:249-268`). |
| `…commits` | *(empty)* | Commit messages are in English, including `i18n(ja): …` translation PRs. |
| `…code` | *(empty)* | Symbols in `packages/starlight` are in English. |
| `…comments` | *(empty)* | Same as code. |

**Departures from the recommendation:** none. In the ADR I'll replace the "How to rule" block with one line saying the recommendation is adopted as is. I'll also add a note that the docs being translated into about 20 languages is a feature of the product, not the language contributors write in, so this trait doesn't cover it.

**What I'll write once you agree:**
- the traits above
- `status: accepted`
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`
- rewritten Consequences that drop the French-specific points
- then I'll run `npx ontrack apply`

Do you agree with this ruling? Tell me if you want a different `authors` value or any change to the traits.
=================== withastro__starlight ADR-0004
I checked the repository's languages. Here is the proposed ruling for **ADR-0004 Languages**.

**Status:** `accepted`

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `TypeScript` | The core package is written in TypeScript: `packages/starlight/src/index.ts`, `schema.ts`, `route-data.ts`, along with Astro components. Its tests are TypeScript too (`__tests__/*.ts`, `__e2e__/*.test.ts`), and so are its configs (`vitest.config.ts`, `playwright.config.ts`, `tsdown.config.ts`). The root `package.json` declares `typescript: ^6.0.3` and a `typecheck` script (`astro check`). `packages/` contains no Python. |

**Condition check:** the ADR recommends TypeScript when the code runs in a browser or shares code between browser and server. Starlight is an Astro documentation theme whose components and scripts run in the browser, and its integration code runs at build/server time. So the condition holds.

**Departures from the recommendation:** none. I found nothing in the repository that argues against the recommendation.

I wasn't able to run `npx ontrack review trivoallan/ADR-0004-languages`, which AGENTS.md asks for, because the command needed approval and wasn't granted. So this ruling comes only from the ADR's own instructions. If you approve the command, I can run it before writing anything.

**Do you agree with this ruling?** If you do, I'll:
- set `name: TypeScript` and `status: accepted`
- fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]` (tell me if other people decided with you)
- rewrite the Consequences lists
- replace the "how to rule" block with one line saying the recommendation is adopted as is
- run `npx ontrack apply`

The follow-up list of rulings the repository doesn't follow yet comes after every ADR is ruled. 25 ADRs are still undecided, so it isn't due yet.
=================== withastro__starlight ADR-0006
Here's my proposed ruling for **ADR-0006 Commits**. I couldn't run `npx ontrack review trivoallan/ADR-0006-commits`, which AGENTS.md asks for, because it needs your approval. This proposal is based on the ADR text and the repository.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `none` | The ADR recommends `commitlint` only "if this repository generates its versions from commit messages." It doesn't. Versions come from changeset files: `.changeset/config.json`, and `.github/workflows/release.yml:34-37` runs `changesets/action` with `pnpm changeset publish`. No commitlint or husky is installed. |
| `commits.scopes` | `[core, tailwind, docsearch, markdoc, file-icons, docs, i18n, deps]` | The areas come from `.github/labeler.yml`: `packages/starlight` (as `core`), `tailwind`, `docsearch`, `markdoc`, `docs/**` and `i18n`. `file-icons` is for `packages/file-icons-generator`. `deps` is Renovate's scope (`.github/renovate.json5:5`, `:semanticPrefixFixDepsChoreOthers`), and `chore(deps)` is the most common scope in the last 2000 commits (54 of them). |

**Departure from the recommendation:**
- **`commits.tool: none` instead of `commitlint`.** The condition the recommendation rests on doesn't hold here, and the ADR itself says "If you set versions by hand, the recommendation falls, and `none` is just as good an answer." Here the changeset files set the bump level, not commit messages, so a badly formatted message can't produce a wrong version. Review keeps the convention.

**Some things to know before you decide:**
- 893 of the last 2000 commits use `i18n(<locale>): …`, where `i18n` sits in the type position. That isn't one of the eleven types, and governance doesn't let this ADR change that. Under this ruling, these commits would be written as `docs(i18n): …`. Many commits also have no type at all, like "Fix sidebar links…" or "[ci] release". This ruling won't make the history conform; it only gives agents a scope list to pick from.
- I left out `showcase` (13 uses) because it's part of the docs. I left out `ci` because the `ci` type already covers workflows.
- When I fill in `authors:`, I'll write "Tristan Rivoallan" unless you tell me otherwise.

Do you agree with this ruling? Or would you rather change the scope list, or pick `hook` or `commitlint` instead of `none`? I won't write anything until you confirm.
=================== withastro__starlight ADR-0009
I couldn't run `npx ontrack review` because it needs approval, so I reviewed the ADR by hand against the repository.

## Proposed ruling: `trivoallan/ADR-0009` Branching, set to **accepted**

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | Every recent commit on `main` closes one pull request: `git log --first-parent main` shows one `title (#NNNN)` per change. `CONTRIBUTING.md:47` asks contributors to fork and open a PR. Releases also go through a PR (`[ci] release` from `changesets/action` in `.github/workflows/release.yml`). Nothing points to trunk-based or gitflow. |
| `branching.merge` | `squash` (as recommended) | `main` is linear, with one commit per PR. The last merge commits (`Merge pull request #147`, `#160`) date from the project's first months. |
| `branching.prefixes` | `[feat, fix, docs, chore]` (**departure**: adds `chore`) | Maintenance PRs come up all the time and are neither feat, fix nor docs: #4381 "Update Lunaria", #4359 "Use `ubuntu-slim`", #4392 action bumps. `chore` is one of the eleven commit types, and the remote already has a `chore/funding-yml` branch. Translation PRs (`i18n(xx): …`) are the largest group and fit under `docs`. |

**Departure:** `chore` is added to the recommended prefixes, for the maintenance PRs above.

**Two things to know before you agree** (neither changes the values):
- **The repo doesn't follow the prefixes yet.** Most remote branches are named after a person or ticket (`chris/…`, `hd/…`, `nate/…`, `dx-1342/…`), and fork PRs use arbitrary names. Once this ADR is accepted, the `check:` line would fail them. I'll list this in the follow-up step after every ADR is ruled.
- **The release branch would fail the check.** The ADR exempts only `release-please--` and `releaser-pleaser--` branches. Changesets opens `changeset-release/main`, so the release PR would fail unless ADR-0012 names Changesets. Renovate's `renovate/` branches are exempt, provided ADR-0018 names Renovate.
- **About the squash caveat:** only 121 of the 615 commits on `main` this year have a Conventional Commits subject. Here versions come from Changesets files, not from commit messages, so the risk the ADR warns about is smaller. It's still worth considering in ADR-0006.

On agreement I'll also fill `date: 2026-11-15`, rewrite the Consequences, remove the how-to-rule block, and run `npx ontrack apply`.

**Do you agree with this ruling?** I also need the names to put under `authors:`. Alternatively, keep the recommended `[feat, fix, docs]` without `chore`, or change another value.
=================== withastro__starlight ADR-0011
I read the ADR in full. `npx ontrack review` and the `gh api` call to read the GitHub ruleset both need your approval, and neither has run yet, so the ruling below rests on the repository's files only.

## Proposed ruling: ADR-0011 Forge and continuous integration → `accepted`

I found nothing in the repository that argues against the recommendation, so I'm proposing it as is.

**Condition (forge is GitHub):** it is. `git remote -v` points to `https://github.com/withastro/starlight.git`, and there are 12 workflows in `.github/workflows/`. So `rejected` doesn't apply.

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `.github/workflows/ci.yml:6` triggers on `merge_group:`, which means the repo uses a GitHub merge queue. A merge queue only works with required checks, so a red pipeline already blocks merges. I couldn't read the ruleset itself because the `gh api` call needs your approval. |
| `forge.audit` | `zizmor` | `.github/workflows/ci.yml:232-248` already has a `zizmor` job using `zizmorcore/zizmor-action@45d7276…` (SHA-pinned), with `version: 1.32.0`. Findings are silenced inline (`welcome-bot.yml:4`, `lunaria.yml:5`, `preview-release.yml:77`), and there is no `zizmor.yml`. Renovate groups zizmor updates (`.github/renovate.json5:49-56`). |

**Departures from the recommendation:** none.

**Compliance gaps I noticed along the way.** These don't change the ruling. I'll list them as tracking items once the ruling is done:
- `.github/workflows/pr-labeler.yml:4` uses `pull_request_target` with no inline `zizmor: ignore[dangerous-triggers]`. The `ontrack check` (`zizmor --offline --no-config`) would probably flag it.
- `.github/workflows/welcome-bot.yml:17` is pinned by SHA but has no tag comment, which rule 3 asks for.

If you agree, I'll do the following, editing only this ADR:
- fill the traits;
- set `status: accepted` and `date: 2026-11-15`;
- set `authors: [Tristan Rivoallan]`, or other names you give me;
- rewrite the Consequences;
- replace the how-to-rule block with "Adopted as recommended";
- run `npx ontrack apply`.

**Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`?** Also, can I run `npx ontrack review` and `gh api repos/withastro/starlight/rules/branches/main` to confirm the required checks?
=================== withastro__starlight ADR-0023
I couldn't run `npx ontrack review trivoallan/ADR-0023-license` because it needs your approval. I read the ADR in full and checked the repository myself.

**Evidence against the recommendation:** none. The repository already uses MIT throughout.

- `LICENSE` at the root holds the MIT text.
- The root `package.json:15` declares `"license": "MIT"`. It is `"private": true`, but that doesn't make `UNLICENSED` the right answer: the repository is public and the packages under it are published.
- Every workspace package also declares `"license": "MIT"`. That covers `packages/starlight/package.json:24`, and the same holds for markdoc, tailwind, docsearch and file-icons-generator.
- The ADR has no conditional recommendation to check, and no `pyproject.toml` exists.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`:** `MIT`, the same value as the root `LICENSE` file and every `license` field in the manifests.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, the git user. Tell me if other people should be listed.
- **Departures from the recommendation:** none. I'd write "Adopted as recommended" in place of the "how to rule" block.

One point is outside the key. The ADR says the copyright holder should be "the organisation that owns the repository" (withastro). The existing `LICENSE` names "Astro contributors" instead. I suggest keeping that line: it is the project's long-standing choice and the ADR's check doesn't read it. I'd note it in the ADR as a deliberate difference.

**Do you agree with this ruling,** including the authors and keeping the copyright line? I'll write nothing until you confirm. Once you do, I'll fill the ADR, delete the "how to rule" block, rewrite the Consequences, and run `npx ontrack apply`, which also needs your approval.

The follow-up list of rulings this repository doesn't follow yet comes after every ADR is ruled. 25 of them are still undecided, so it doesn't apply yet. There's also no decided `tracking` trait, so I would give that list here rather than create tracker items.
=================== withastro__starlight ADR-0025
Progress so far: I've read the ADR and checked the repository for tools installed outside pnpm. Running `npx ontrack review` needed your approval, so I did the review by hand. Here is the proposed ruling.

## Proposed ruling: ADR-0025, Tools outside the package manager

**Status:** `accepted`

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `tools.manager` | `none` | No accepted ADR names a tool outside the package manager, and the repository installs no such tool anywhere. |

**Checking the ADR's condition.** The recommendation depends on how many tools there are: `script` for one, `mise` or `aqua` for several. The ADR also says "`none` is an answer only when no accepted ADR names such a tool." Today the count is zero:

- **Accepted ADRs:** only ADR-0001 is accepted. ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`) are still `proposed`, and those are the only traits this ADR's check reads (per the ADR text).
- **Runner:** the one binary outside pnpm is zizmor. It runs only through `zizmorcore/zizmor-action@45d7276…` with `version: 1.32.0` (`.github/workflows/ci.yml:246`). That is an action, which ADR-0011 rule 3 covers, not this ADR. Renovate already updates it (`.github/renovate.json5`, the "zizmor" group).
- **Workstation:** there's no `.husky` or `.githooks` and no hook installs anything. There's no `mise.toml`, `.tool-versions` or `aqua.yaml`.
- **Agent session / devcontainer:** `.devcontainer/Dockerfile` only runs `npm install -g pnpm`.

**Departure from the recommendation:** the ADR suggests `script` or `mise`/`aqua`. I propose `none` because nothing needs pinning yet. This doesn't need to be revisited by hand: once accepted with `none`, the check fails as soon as an accepted `secrets.guard` or `forge.audit` names a tool. Rule 4 becomes "nothing to move" until then.

**What would replace it later:** if ADR-0015 picks gitleaks and ADR-0011 picks zizmor to run locally, that makes two tools. Then `mise` fits best, because the repository uses Renovate, not Dependabot, and Renovate's `mise` manager also updates `mise.lock`. If you'd rather settle it now:
- **`script`** follows the recommendation for a single tool.
- **`mise`** suits the likely two-tool future.

**Authors / date:** `authors: [Tristan Rivoallan]`, `date: 2026-11-15`. Tell me if other people took part in the decision.

Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0025-tools.md`:
- fill in the trait
- set the status, date and authors
- rewrite the Consequences section
- replace the "How to rule" block with the rule-4 statement and the reason for the departure

Then I'll run `npx ontrack apply`, which will ask for your approval like the review command did.

The follow-up list of rulings the repository doesn't follow yet waits until every ADR is ruled; 25 are still `proposed`.

**Do you agree with `accepted` and `tools.manager: none`, or would you prefer `script` or `mise`?**
