=================== eslint__eslint ADR-0002
## ADR-0002 Localization: proposed ruling

### What the repository does today

The repository has no written language policy. In practice, everything in it is in English:

- **Documentation:** `docs/src/_data/config.json` sets `"lang": "en"`, `docs/src/_data/sites/en.yml` sets `locale: en-US`, and the only site config is `en.yml`. `docs/src/_data/languages.json` links to translated sites (`ja.eslint.org`, `fr.eslint.org`, …), but those translations live outside this repository. None are kept here.
- **Commits:** I checked the last 2,000 commit subjects with a French-word filter. It found one hit, `fix!: no-sequences rule schema correction`, which is English. The rest are English Conventional Commits, which AGENTS.md also requires.
- **Code:** symbols are in English. `docs/src/contribute/package-json-conventions.md:14` requires npm script names to be "a full English word". `messages/*.js` (runtime error text) is English too.
- **Comments:** English JSDoc, following the `@fileoverview`/`@author` header convention in AGENTS.md.

**Compared with the recommendation:** no differences. The recommendation is one default language, English, with no overrides, and that is what the repository does everywhere. The ADR has no conditional recommendation to check.

**`rejected`?** No. The question applies here: every medium has a language.

### Proposed ruling

- **status:** `accepted`
- `localization.language.default`: `english`. Evidence: `docs/src/_data/config.json` (`lang: en`), the commit history, the package-json conventions doc, and the source code.
- `localization.language.documentation`: left empty, so English. The translated sites are hosted outside this repository.
- `localization.language.commits`: left empty, so English.
- `localization.language.code`: left empty, so English.
- `localization.language.comments`: left empty, so English.
- **Departures from the recommendation:** none. The ADR would record "Adopted as recommended", with the Consequences rewritten for ESLint. For example, the French-speaking-maintainer cost doesn't apply to an international project.

To fill in `date:` and `authors:`, I'd use **2026-11-15** and **Tristan Rivoallan**.

**Do you agree with this ruling, and with those values for `date` and `authors`?** I'll write nothing until you confirm. After that, I'll edit only ADR-0002 and run `npx ontrack apply`.
=================== eslint__eslint ADR-0004
I've gathered the evidence. Here's the proposed ruling for ADR-0004.

## What the repository does today

- **Source is JavaScript, in CommonJS.** `package.json:6` has `"type": "commonjs"` and `"main": "./lib/api.js"`. `lib/`, `bin/` and `conf/` hold 392 tracked `.js` files. Across the repo there are 1,483 `.js` files, 21 `.ts` files and no `.py` files.
- **TypeScript is used only for the published type declarations.** The `.ts` files under `lib/` are all hand-written `.d.ts` files in `lib/types/`, exposed through the `types` and `exports` fields in `package.json`. `tsconfig.types.json` sets `"allowJs": false` and `"checkJs": false`, and covers only `lib/types`, `tests/lib/types` and `packages/*/types`. `npm run test:types` (`package.json:81`) checks those declarations against TypeScript 5.3, 5.x and 7.x. It does not check the JS source.
- **AGENTS.md already says JavaScript.** Its Conventions section reads: "CommonJS (`"type": "commonjs"`), Node `^20.19.0 || ^22.13.0 || >=24`".
- **The ADR's condition for TypeScript applies, but doesn't decide this.** The ADR recommends TypeScript when code runs in a browser, and this repo does: `build:webpack` (`package.json:53`) builds a browser bundle, and `npm run test:browser` runs Cypress against it. That same code is written in JavaScript, though.
- **No migration to TypeScript is under way.** The git history mentions TypeScript only in commits about supporting TS users, plugins and type tests. No commit converts any source file.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `JavaScript` | `package.json` `"type": "commonjs"` and `main: ./lib/api.js`; 392 `.js` source files and 0 `.ts` implementation files in `lib/`; the AGENTS.md conventions |

**Departure from the recommendation:** the ADR recommends `Python` or `TypeScript`, and allows another language when the ADR says why. The reason I'd write:

> ESLint is an established CommonJS codebase (about 1,500 `.js` files). Its public API, rule authoring model and contributor docs all assume plain JavaScript. TypeScript is used only for the hand-written public declarations in `lib/types/` and the type tests that check them. Moving to TypeScript would mean rewriting the whole codebase, which is a project decision outside this ADR. Neither recommended language would remove that need. The ADR-0005 (`zod`) and ADR-0007 (typing tooling) recommendations that assume TypeScript apply only in part.

I'd also rewrite the Consequences lists to match. TypeScript counts as a secondary language here, limited to `.d.ts` files and type tests.

Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0004-languages.md`: fill `traits`, set `status`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, replace the how-to-rule block with the reason above, and update Consequences. Then I'll run `npx ontrack apply`.

**Do you agree with `accepted` and `languages.main.name: JavaScript`, or would you rule differently (for example `TypeScript` as the target language)?**
=================== eslint__eslint ADR-0006
Now the repository's current practice.

Still investigating: checking which commit tags ESLint's contributor docs allow, then I'll propose the ruling.

I'm proposing **`accepted`** for ADR-0006 (Commits), with `scopes: []` and `tool: none`. The scopes value matches what ESLint already does. The tool value goes against the ADR's recommendation, so it's your call.

## How the repository handles commits today

- **Format.** The contributor guide requires Conventional Commits and says "we don't support the optional scope" (`docs/src/contribute/pull-requests.md:61`). It lists the allowed tags at lines 73–85: `fix`, `feat`, `fix!`, `feat!`, `docs`, `chore`, `build`, `refactor`, `test`, `ci`, `perf`. AGENTS.md repeats this list.
- **History.** None of the last 2,000 commit subjects uses a scope. Almost all follow the format. The exceptions are the commits the release tool writes (`10.15.0` and `Build: changelog update for …`), git's default `Revert "…"` subjects, and one old `deps:` commit.
- **Versions come from commit messages.** This is the condition the ADR's recommendation depends on, and it holds here.
  - Releases go through `eslint-release` (a devDependency, called at `Makefile.js:373`). It picks the version bump from the commit tags: `!` means major, `feat` means minor, anything else means patch.
  - The tags history matches this. v10.9.0 → v10.9.1 had no `feat` commits and was a patch release. v10.14.0 → v10.15.0 had five and was a minor release.
  - `CHANGELOG.md` is built from the commit subjects too.
- **How the format is enforced.**
  - There is no commitlint, no commit-msg hook, and no CI workflow that checks titles. The pre-commit hook only runs lint-staged (`package.json:97`).
  - Pull requests are squash-merged, so only the PR title ends up on `main` (line 153 of the guide). The guide says the title "will be checked when the pull request is submitted". That check isn't in this repository, so it runs outside it, presumably a GitHub app (I couldn't confirm which).
  - The guide also says follow-up commits on a branch "do not need to be in any specific format" (line 180).

## Proposed ruling

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.scopes` | `[]` | The guide forbids scopes (`pull-requests.md:61`), and none of the last 2,000 commits uses one. |
| `commits.tool` | `none` | Nothing in the repository enforces the format. The PR title on the squash commit is checked outside the repository. |

## Where this differs from the recommendation

1. **`commits.tool`: `none` instead of `commitlint`.** The condition for commitlint holds, but two things argue against it:
   - The ontrack check would run commitlint on every commit from `origin/HEAD` to `HEAD`. That would reject the free-form follow-up commits the guide explicitly allows. Adopting it would mean changing contributor policy, not just recording what exists.
   - What actually needs protecting is the squash commit's title, and that is already checked when a PR is submitted, outside the repository.

   The ADR text would record that `none` here doesn't mean "review alone": the PR-title check does the job.

   If you'd rather adopt `commitlint`, it means three things:
   - installing `@commitlint/cli` and `@commitlint/config-conventional`;
   - changing line 180 of the guide;
   - probably adding `--from origin/main` to the `check:` line.
2. **Types differ from the eleven governance fixes.** This isn't up for ruling, but it is a real gap:
   - The guide doesn't list `style` or `revert`.
   - Reverts use git's default `Revert "…"` subject instead of `revert:`.
   - Release commits (`10.15.0`, `Build: changelog update …`) don't follow the format.

   I'd note these under Neutral consequences.

To fill `authors:`, I'd use the git user name, Tristan Rivoallan, with no email address. I'll write nothing until you agree.

**Do you accept `accepted` with `scopes: []` and `tool: none`, or would you rather have `tool: commitlint`, or something else?**
=================== eslint__eslint ADR-0009
Now the repository evidence: history, branches, contribution docs, CI.

I've finished gathering the evidence. Here is my proposed ruling for ADR-0009. I haven't written anything yet.

## What the repository does today

- **Model.** Changes reach `main` through pull requests. Every one of the last 300 commits on `main` that a person wrote ends in `(#NNNN)`. The 47 that don't are all bot pushes: 25 release commits from Jenkins (`10.15.0`, `Build: changelog update…`) and 22 `docs: Update README` commits from GitHub Actions Bot.
  - CI runs only on pushes to `main` and on pull requests that target it (`.github/workflows/ci.yml:2-6`). The same holds for `types-integration`, `codeql` and `ecosystem-tests`.
  - The contributor guide asks for one branch per issue (`docs/src/contribute/pull-requests.md:40-50`).
  - There is no `develop` or `release/*` branch. There are long-lived maintenance branches (`1.x`–`5.x`, `v8.x`, `v9.x`), which is still github-flow plus maintenance lines, not gitflow.
- **Merge.** The repository squashes. The guide says so: "its commits will be squashed into one single commit… the title of the pull request" (`pull-requests.md:153`, `:178`). The last merge commit on `main` is from 2016-04-23 (`0c0159ba6`). The pull request title is checked in CI because it becomes the changelog entry (AGENTS.md).
- **Prefixes.** There is no branch-naming rule, and nothing checks branch names. The guide's own example is `issue1234` (`pull-requests.md:45`, `:134`). On `origin`, branch prefixes are mixed:
  - commit types: `feat/` ×11, `fix/` ×6, `chore/` ×3, `docs/` ×2, `ci/` ×1, `perf/` ×1
  - not commit types: `ts/` ×3, `copilot/` ×5, `renovate/` ×2
  - no prefix at all: many `issueNNNN` branches
  - The ecosystem workflow opens `update-ecosystem-plugins-<timestamp>` (`.github/workflows/ecosystem-updates.yml:29-30`).
  - The repository uses 9 of the 11 commit types: everything except `style` and `revert` (`pull-requests.md:73-85`).

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | Every commit a person wrote comes through a PR; CI runs only for `main` and PRs; one branch per issue (`pull-requests.md:50`) |
| `branching.merge` | `squash` | `pull-requests.md:153,178`; no merge commit since 2016; `(#NNNN)` subjects |
| `branching.prefixes` | `[feat, fix, docs, chore, build, refactor, test, ci, perf]` | The nine commit types the repository allows (`pull-requests.md:73-85`). `chore/`, `ci/` and `perf/` branches already exist |

## Departures from the recommendation

1. **`prefixes` is wider than `[feat, fix, docs]`.** `chore:` and `ci:` are among the most common subjects on `main`, and those branches already exist. Limiting prefixes to three would make the usual chore and CI pull requests fail the check. All nine values are taken from the eleven types, as the ADR requires.
2. **Bots push straight to `main`.** Jenkins (releases) and the README workflow push without a PR. This doesn't fit pure github-flow, so I'd write it in the ADR as an accepted exception for automation.

## Gaps the check would expose

These are for the follow-up list, not reasons to change the ruling:
- The contributor guide tells people to name branches `issue1234`, which the check would fail. The guide would need updating.
- Some bot branches aren't exempt and would fail: `update-ecosystem-plugins-*` and `copilot/*`. Dependabot and Renovate are exempt only if ADR-0018 is ruled.
- Most contributors work from forks, so `GITHUB_HEAD_REF` is a branch name in the fork that this repository can't control. Wiring the check into CI would reject outside contributors' PRs over a naming detail. I'd suggest running it locally only.

**Do you agree with this ruling (`accepted`, those three values, and both departures written into the ADR)?** Or would you like to change anything, such as keeping the recommended `[feat, fix, docs]`? I also need the name to put in `authors:`; is "Tristan Rivoallan" correct?
=================== eslint__eslint ADR-0011
Now let's look at the workflows: pinning, triggers, permissions, any zizmor/actionlint.

I've read the ADR and the repository's workflows. Here is the proposed ruling.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/eslint/eslint`). There are 10 workflows in `.github/workflows/`, so `rejected` doesn't apply.
- **Gate:** `ci.yml` runs on `push` and `pull_request` to `main`. Contributors are told "We cannot merge pull requests that fail the CI build for any reason" (`docs/src/contribute/pull-requests.md:160`), and maintainers are told to "never merge a pull request with failing tests" (`docs/src/maintain/review-pull-requests.md:94`). So the stated intent is clearly that a red build blocks the merge. I couldn't check whether a GitHub ruleset actually enforces this, because the `gh api …/rules/branches/main` call wasn't approved.
- **Audit:** nothing audits the workflows for security. `ci.yml:24-27` runs **actionlint** v1.7.10, with shellcheck and pyflakes turned off. The ADR says actionlint only checks that a workflow parses, so it isn't an audit. zizmor appears nowhere and isn't installed on this machine.
- **The fixed rules, compared with what the workflows do:**
  - **Rule 3 (pin actions by SHA): not met.** Third-party actions are pinned by SHA with the tag in a comment (pnpm, restackio, peter-evans, Ilshidur). But GitHub's own actions use movable tags (`actions/checkout@v7`, `setup-node@v7`, `github-script@v9`, `labeler@v7`, `upload-artifact@v7`, `download-artifact@v8`, `github/codeql-action/*@v4.39.3`). Two reusable workflows point at `eslint/workflows/…@main` (`ci.yml:151`, `stale.yml:13`).
  - **Rule 5 (forks get no secrets): met.** `pr-labeler.yml` uses `pull_request_target`, but it only runs `actions/labeler` and never checks out the fork's code. zizmor will still flag it as `dangerous-triggers`, so it needs an inline ignore with its reason.
  - **Rules 1, 2 and 4: met.** No workflow uses `environment:`, and there is no deploy job; Netlify is triggered through a hook stored in a secret. Secrets live in repository secrets and none is echoed to a log.
- **Ruleset check:** `ontrack check` will pass `forge.gate` (workflows exist), but it can't verify the ruleset. With `forge.audit: zizmor`, the check would fail today: the tag-pinned actions and probably `artipacked` (checkouts that keep their credentials) would be reported.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | The contributing and maintainer guides above say a failing build is never merged. Making it real takes a ruleset that requires the checks on `main`, which I couldn't verify. |
| `forge.audit` | `zizmor` | Nothing reads the workflows for safety today. actionlint stays as a parse check and doesn't replace an audit. |

**Departures from the recommendation:** none. The repository doesn't follow `forge.audit` yet, and rule 3 is also unmet: every `actions/*` and `codeql-action` reference, plus the two `@main` reusable workflows, need SHA pins. I'll list those as tracking items once all ADRs are ruled.

**One alternative to consider:** `forge.audit: none` would match what the repository does today, and the ADR says that's tenable "when a person writes and reads every one of them". ESLint's workflows do go through maintainer review, but the ADR's own measurement shows that review missed a template injection and over-broad write permissions. So I recommend `zizmor`.

When you agree, I'll fill the `traits:` block, set `status: accepted`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences, replace the how-to block with "adopted as recommended", and run `npx ontrack apply`.

Do you agree with `forge.gate: blocking` and `forge.audit: zizmor`, or do you want different values?
=================== eslint__eslint ADR-0023
Here is my proposed ruling for ADR-0023 (License). Nothing has been written yet.

## What the repository does today

- **Licence file:** `LICENSE` is committed at the root and holds the full MIT text. It has been there since the first commit (`a658d7b0e`, 2013-06-29). The copyright line reads "Copyright OpenJS Foundation and other contributors, <www.openjsf.org>" and was last updated in `81f03b6ad` (#14877).
- **Root manifest:** `package.json:240` has `"license": "MIT"`. There is no `pyproject.toml`.
- **Sub-packages:** both `packages/js` and `packages/eslint-config-eslint` declare `"license": "MIT"` in their `package.json` and ship their own `LICENSE`. `docs/package.json:8` also says MIT. The ADR's check doesn't look at subfolders, but they all agree with the root anyway.
- **CI:** `.github/workflows/ci.yml:42` runs `node Makefile checkLicenses` (`Makefile.js:947`). That checks the licences of dependencies, which the ADR explicitly leaves out ("Not concerned"). Nothing in CI checks the project's own declared licence.

## Compared with the recommendation

| Fixed by the ADR | Repository | Match |
| --- | --- | --- |
| Root manifest declares `license.spdx` | `package.json` has `"license": "MIT"` | ✅ |
| Licence file at the root with the full text | `LICENSE` has the full MIT text | ✅ |
| Copyright holder is the organisation that owns the repo | OpenJS Foundation and contributors, which is the foundation ESLint belongs to | ✅ |

The ADR's one condition is "`UNLICENSED` for a private repository". It doesn't apply: ESLint is a published, public open-source package (`packages/*` and the root are released to npm).

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `MIT`.** Evidence: `package.json:240`, the root `LICENSE`, and 13 years of history under MIT.
- **Departures from the recommendation:** none. In place of the "How to rule" block, the ADR would get one line saying the recommendation is adopted as is, because it matches the licence ESLint has always used.
- **date:** 2026-11-15
- **authors:** `[Tristan Rivoallan]`, the same as ADR-0001. Please tell me if it should be someone else.
- **Consequences:** I would rewrite them for MIT as it already applies here. The change confirms existing practice, so it costs nothing new. The text-versus-manifest gap that the check can't see stays listed as a negative.

`rejected` doesn't fit, because the question clearly applies to this repository.

**Do you agree with ruling ADR-0023 `accepted` with `license.spdx: MIT` and authors `[Tristan Rivoallan]`?** Once you confirm, I'll edit the ADR and run `npx ontrack apply`.
=================== eslint__eslint ADR-0025
Found one: actionlint installed by `go install` in CI. Let me see the rest of the context.

I've read ADR-0025 and checked the repository against it. I've written nothing yet.

## What the repository does today

- **One tool sits outside npm: actionlint, and it only runs in CI.** `.github/workflows/ci.yml:17-27` installs Go with `actions/setup-go@v7` and `go-version: "stable"`, then runs `go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.10` and `actionlint`.
- **It came in when trunk was removed.** Trunk was the earlier tool manager. Commit `dbb4c9582` ("chore: remove trunk (#20478)") replaced it with the `go install` line.
- **There is no tool manager.** None of these files exist: `mise.toml`, `.mise.toml`, `.tool-versions`, `aqua.yaml`, `aqua-checksums.json`. There is no `.devcontainer`, and no setup script for agent sessions.
- **The pre-commit hook runs only npm tools.** It is defined in `package.json:96-110` (yorkie → lint-staged → eslint, prettier, markdownlint-cli2). It never runs actionlint, so nothing checks workflows on a workstation or in an agent session.
- **Nothing updates the actionlint pin.**
  - `.github/dependabot.yml` covers only `github-actions`.
  - `.github/renovate.json5` has no regex manager. It extends `eslint/workflows//.github/renovate/base.json5`, which lives outside this repository and which I didn't read.
- **No accepted ADR names such a tool yet.** ADR-0011 (`forge.audit`, recommended value `zizmor`) and ADR-0015 (`secrets.guard`, recommended value `gitleaks`) are both still `proposed`.

## Compared with the recommendation

The recommendation is `script` for one tool, and `mise` or `aqua` for several. Today there is one tool, actionlint, so the recommendation gives **`script`**. The differences from the rules the ADR fixes:

1. **Rule 1 (one place holds the version and checksum):** the version is written inline in `ci.yml` and no checksum is committed. Go's checksum database checks the download, but nothing in the repository records it. The Go toolchain itself is `stable`, which is not pinned.
2. **Rule 2 (the same place serves the workstation, the runner and an agent session):** only the runner installs the tool. Nothing installs it on a workstation or in an agent session.
3. **Rule 3 (the manager is installed pinned):** this doesn't apply under `script`. Separately, `actions/setup-go@v7` is pinned by tag rather than by hash, which is ADR-0011's concern.
4. **Rule 4 (who moves the pins):** nothing is written down and nothing automated does it.

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager`: `script`.** Today the only tool outside npm is actionlint, installed in `ci.yml:26`. That makes this the one-tool case where the ADR recommends a script.
- **Rule 4 text to write in the ADR:** a maintainer moves the actionlint version by hand, and changes the checksum for each platform in the same pull request.
- **Departures from the recommendation:** none. If ADR-0011 and ADR-0015 are later accepted with `zizmor` and `gitleaks`, there will be three tools, and the recommendation then switches to `mise` or `aqua`. This ADR would need to be ruled again at that point.

`date:` would be 2026-11-15. For `authors:` I'd write `[Tristan Rivoallan]`, taken from git config. The Consequences lists would be rewritten for `script`.

**Do you agree with `accepted` and `tools.manager: script`?** You could also choose `mise` now, in anticipation of gitleaks and zizmor, or correct the authors. Once you agree, I'll edit only ADR-0025 and run `npx ontrack apply`.

The list of rulings this repository doesn't follow yet waits until every ADR is ruled; 25 are still `proposed`.
