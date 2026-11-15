## Turn 1, user: (the sequence prompt)

Files changed after this turn:

```
(none)
```

Now reading all ADRs.
---
Surveying all 25 ADRs and the repository's CI and config. No changes made yet. Now reading the workflows and config.
---
I've gone through all 25 proposed ADRs and checked them against the repository's files, CI, `.npmrc`, Dependabot config and git history. I haven't changed anything. Two things couldn't run here:
- `npx ontrack review` needs your approval.
- I couldn't query GitHub's branch protection or rulesets, so any trait that depends on those is unverified.

## Group 1: the repository already answers these

| ADR | What the repository shows | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English | `default: english`, matches the recommendation |
| 0004 Languages | `lib/` is plain JavaScript (CommonJS, `engines.node >= 18`); no TypeScript or Python | `JavaScript`, a justified departure |
| 0010 Architecture documentation | No architecture document or diagrams; `docs/` holds only ADRs | `none` for all three traits, or `rejected` |
| 0012 Delivery | Publishes an npm package (`npm-publish.yml` runs on `release: published`); versions bumped by hand (commit "5.3.0"); `History.md` is the changelog | `package`, release tool `manual`, `changelog` |
| 0013 Frontend | A library with no user interface | `rejected` |
| 0014 Work tracking | GitHub remote `expressjs/express`; PR and issue numbers in commit subjects | `github-issues`, `expressjs/express` |
| 0016 Changes | No change framework (no `openspec/`) | `none` / `none` |
| 0018 Dependencies | `.github/dependabot.yml` exists; there's no automerge workflow and Dependabot PRs are merged by people | `dependabot`, automerge `none` |
| 0020 Adding a dependency | `.npmrc` has `ignore-scripts=true`, `min-release-age=7`, `allow-git=none` | `install_scripts: ignored`, approver `person` |
| 0021 Build provenance | Publishes from a GitHub-hosted runner with `id-token: write` (npm trusted publishing) | probably `2`, to confirm |
| 0023 License | `LICENSE` and `package.json` say MIT | `MIT`, matches the recommendation |
| 0025 Tools | No tools outside npm, except `lcov` installed with apt inside CI | `none` |

## Group 2: these need a discussion

| ADR | Why |
|---|---|
| 0003 Software architecture | Express is a library built from a middleware and router pipeline, which doesn't fit the hexagonal recommendation well. It could be `monolithic` or `rejected`. |
| 0005 Validation | No schema library; input checks are written by hand. The project avoids adding dependencies, so `zod` would be a real change. |
| 0006 Commits | Mostly Conventional Commits, but not all (for example "Upgrade `content-disposition`", "5.3.0"). There's no commitlint and versions are set by hand, so the tool is probably `none`. The list of scopes is still to choose. |
| 0007 Tests | `nyc` and Coveralls are set up but no threshold is enforced. The coverage number is your call. |
| 0008 Documentation | User documentation lives in another repository (expressjs.com), so this is probably `rejected` or `docs.tool: none`. |
| 0009 Branching | Looks like GitHub flow with squash merges (0 merge commits since 2025), but branches are named in many ways (`feat/`, `fix/`, `ulises/…`, `release/…`) and there are maintenance branches (`4.x`, `5.x`). |
| 0011 Forge and CI | GitHub Actions is in place; workflows pin actions by SHA and use read-only permissions. Whether a red check blocks merging can't be verified here. There's no zizmor; CodeQL scans the `actions` language. |
| 0015 Secrets | No secrets are used locally and there's no gitleaks. You'd choose between `none`/`none` and adopting gitleaks. |
| 0017 Agent tooling | `AGENTS.md` exists but no host settings (`.claude/` and so on). The answer depends on which agents contributors use. |
| 0019 Vulnerabilities | No SBOM and no scanner in CI; Dependabot alerts may be on (unverified). |
| 0022 Review and merge | Several maintainers suggests `peer`, but the required approvals can't be verified. |
| 0024 Code scanning | CodeQL is set up; the `fail_on` threshold depends on GitHub settings. |
| 0026 Agent identity | Depends on how you plan to run agents here. |

The proposed order is group 1 in the order above, then group 2 in ADR-number order, starting with ADR-0002 Localization.

Do you agree with this order, or would you like a different one? You can also stop at any point; the repository works fine with the ADRs left open.


## Turn 2, user: I agree to that order. Go on.

Files changed after this turn:

```
(none)
```

ADR-0002 Localization comes first. I've read it in full.

**What the repository does today:** everything is in English.
- **Documentation:** `Readme.md`, `History.md` and the `examples/` folder are in English.
- **Commits:** every subject in the recent history is in English, for example `deps: body-parser@^2.4.0 (#7563)` and `fix(res.send): preserve ETag generation…`.
- **Code and comments:** names and comments in `lib/` are in English (for example `res.send`, `req.is`, and the JSDoc in `lib/response.js`).
- There's no translation setup and no text in another language.

**Compared with the recommendation:** the recommendation is `default: english` with no overrides, which is exactly what the repository does. There are no differences, and the recommendation has no conditions to check.

**Proposed ruling:**
- `status: accepted`
- `localization.language.default: english` (observed): docs, commits, code and comments are all in English.
- `documentation`, `commits`, `code`, `comments`: left empty, so they take the default (observed for each, same evidence).
- Departures from the recommendation: none. The ADR gets one line saying it was adopted as is.
- `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, and the Consequences section rewritten for this repository.

Do you agree with this ruling, or would you like to change it or skip this ADR?


## Turn 3, user: Skip this one: I don't want to rule it today.

Files changed after this turn:

```
(none)
```

I've left ADR-0002 untouched; it stays `proposed`. Next is ADR-0004 Languages, which I've read in full.

**What the repository does today:** it's written in plain JavaScript.
- `index.js` and `lib/*.js` (`application.js`, `request.js`, `response.js`, `express.js`, `utils.js`, `view.js`) are CommonJS JavaScript, and so are `test/` and `examples/`.
- There's no TypeScript or Python: no `.ts`, `.mjs` or `.py` files in `lib/`, and no `tsconfig.json` or `.d.ts` anywhere.
- `package.json` sets `"engines": { "node": ">= 18" }`, linting is `eslint .` (`.eslintrc.yml`), and tests run with `mocha`.

**Compared with the recommendation:** the ADR recommends `Python` or `TypeScript` and allows another language if the reason is written down. There is one difference: this repository uses JavaScript.

**Proposed ruling:**
- `status: accepted`
- `languages.main.name: JavaScript` (observed): every source file in `index.js` and `lib/` is JavaScript, and nothing else is.
- **Departure from the recommendation:** JavaScript instead of TypeScript or Python. The reason I'd write in the ADR:
  - Express has been a JavaScript package on npm since 2010.
  - It runs directly on Node.js ≥ 18 with no build step; `package.json` ships `index.js` and `lib/` as they are.
  - Its dependencies (`router`, `body-parser`, `send` and so on) are JavaScript too.
  - Moving to TypeScript would add a compile step to every release and change what goes to npm.
  - Users get types from a separate package, `@types/express` (outside this repository).
- `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, and the Consequences section rewritten. One consequence to state: ADR-0005's library recommendations (`pydantic`, `zod`) don't apply directly. ADR-0007's coverage target would apply to JavaScript, measured with `nyc`.

Do you agree with this ruling, or would you like to change it or skip this ADR?


## Turn 4, user: I agree with this ruling. Write it.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0004-languages.md
 docs/adr/trivoallan/ADR-0004-languages.md | 109 ++++++++++--------------------
 1 file changed, 35 insertions(+), 74 deletions(-)

```

I've written the ruling into `docs/adr/trivoallan/ADR-0004-languages.md`, but `AGENTS.md` isn't updated yet: `npx ontrack apply` stopped before changing anything.

```
ontrack: dependency "accepts" is not installed; run npm install
```

ontrack expects every dependency in `package.json` to be installed. Right now `node_modules/` only holds two packages.

The file now has:
- `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`
- `languages.main.name: JavaScript`
- The reason for not using TypeScript or Python written in the Decision section, and the Consequences section rewritten.
- The "How to rule" block deleted.

To finish this ADR, I need to run `npm install` and then `npx ontrack apply`. The install downloads Express's dependencies into `node_modules/`, which git ignores. Install scripts won't run because `.npmrc` has `ignore-scripts=true`, and no lockfile is written because `.npmrc` has `package-lock=false`.

May I run `npm install` and then `npx ontrack apply`? If you'd rather run them yourself, I'll go on to ADR-0010 Architecture documentation, and `AGENTS.md` will list ADR-0004 as not yet decided until `apply` runs.


## Turn 5, user: Let's stop the review here for today.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0004-languages.md
 docs/adr/trivoallan/ADR-0004-languages.md | 109 ++++++++++--------------------
 1 file changed, 35 insertions(+), 74 deletions(-)

```

I've stopped the review there.

## Ruled today
- **ADR-0004 Languages**: `accepted`, with `languages.main.name: JavaScript` and the reason for not using TypeScript or Python written in the file. `AGENTS.md` still lists it as not yet decided, because `npx ontrack apply` stopped on missing dependencies. It will catch up after `npm install` and `npx ontrack apply`.

## Skipped
- **ADR-0002 Localization**: left untouched (group 1).

## Still `proposed`
- **Already answered by the repository (group 1):** 0002 Localization, 0010 Architecture documentation, 0012 Delivery, 0013 Frontend, 0014 Work tracking, 0016 Changes, 0018 Dependencies, 0020 Adding a dependency, 0021 Build provenance, 0023 License, 0025 Tools.
- **Need a discussion (group 2):** 0003 Software architecture, 0005 Validation, 0006 Commits, 0007 Tests, 0008 Documentation, 0009 Branching, 0011 Forge and CI, 0015 Secrets, 0017 Agent tooling, 0019 Vulnerabilities, 0022 Review and merge, 0024 Code scanning, 0026 Agent identity.

The repository works fine with these left open: `npx ontrack check` only runs the ADRs that have been decided.

## Rulings the repository doesn't follow yet
None. The one new ruling, `[trivoallan/ADR-0004] languages.main.name: JavaScript`, already matches the code: `index.js` and everything in `lib/` are JavaScript, with no TypeScript or Python. There's nothing to track, and since ADR-0014 Work tracking isn't decided yet, there's also no tracker to put items in.

