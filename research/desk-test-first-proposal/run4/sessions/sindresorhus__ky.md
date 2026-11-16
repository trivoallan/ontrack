## Turn 1, user: (the sequence prompt)

Files changed after this turn:

```
(none)
```

I'm reading the 25 proposed ADRs so I can sort them into two groups: the ones this repository already answers and the ones that need a discussion.
---
Still surveying: I've read 22 of the ADRs. Next come the last four and a look at the repo's CI, config and history.
---
Survey done. I read all 25 proposed ADRs and looked at `package.json`, `.github/`, the dotfiles and 593 commits of history. I haven't written anything.

I couldn't run `npx ontrack review`: approval for it was refused. So I'm following the steps you gave, plus each ADR's own "How to rule" block.

## Group 1: the repository already answers these (10)

| ADR | What the repository does today | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, readme and commits are all in English | `default: english`, as recommended |
| 0003 Architecture | A ~zero-dependency library, not a service. `source/` is split into `core/`, `errors/`, `types/` and `utils/`, with no ports or adapters | `monolithic`, which differs from the recommended `hexagonal` |
| 0004 Languages | TypeScript (`tsconfig*.json`, `source/*.ts`) | `TypeScript`, as recommended |
| 0005 Validation | No runtime `dependencies` at all. Options are validated by hand (`test/validation.ts`, and the `null` rule in AGENTS.md). There are no data files | `boundary` names the hand-written mechanism, which differs from `zod` |
| 0008 Documentation | `readme.md` is the documentation. There is no site generator, and the audience is public on GitHub | `tool: none`, `audience: public` |
| 0010 Architecture docs | No architecture document and no diagrams | `none` throughout, which differs from arc42, LikeC4 and Mermaid |
| 0013 Frontend | A library with no user interface | `rejected` |
| 0014 Work tracking | GitHub issues on `sindresorhus/ky` (`package.json` `repository`) | `github-issues`, as recommended |
| 0022 Review and merge | One maintainer (236 of the last 300 commits) merges outside PRs. 256 subjects end in `(#N)` | `maintainer`, with `0` approvals, as recommended |
| 0023 License | `license` (MIT) and `"license": "MIT"` | `MIT`, as recommended |

## Group 2: these need a discussion (15)

| ADR | Why it needs a discussion |
|---|---|
| 0006 Commits | **None of the 593 subjects use Conventional Commits**, and governance treats that format as not up for ruling. Versions are set by hand with `np`, so the premise for `commitlint` doesn't hold |
| 0007 Tests | ava is used but there's no coverage tool, so a threshold would be new |
| 0009 Branching | Squash merging is observed. But the maintainer pushes straight to `main`, and branch names have no prefix (`origin/fix-methods`) |
| 0011 Forge & CI | GitHub with a CI workflow. I can't see the ruleset (blocking or informative?). There's no zizmor, and actions are pinned by tag (`@v6`), not SHA |
| 0012 Delivery | It's an npm `package`, but the release is run locally with `np` and there's no CI release job. Environments, `release_tool` and release notes need choosing |
| 0015 Secrets | The repository uses no secrets, and there's no guard |
| 0016 Changes | No change framework. The question is whether to rule `none` or adopt OpenSpec |
| 0017 Agent tooling | There's an `AGENTS.md` but no `.claude/` or `opencode.json`. `.github/security.md` says "No AI slop will be accepted" |
| 0018 Dependencies | No Dependabot or Renovate |
| 0019 Vulnerabilities | No SBOM and no scanner |
| 0020 Adding deps | `.npmrc` has `package-lock=false` and `package-lock.json` is gitignored. That contradicts the fixed rule 5 (lockfile committed) |
| 0021 Build provenance | It applies because a package is published. Local `np` publishing gives level 0 today |
| 0024 Code scanning | No CodeQL or Semgrep |
| 0025 Tools | No tools outside npm today. The answer depends on 0015, 0011 and 0019, so it's best ruled last |
| 0026 Agent identity | It depends on how you work with agents here |

**Proposed order:** group 1 in the order above (0002, 0003, 0004, 0005, 0008, 0010, 0013, 0014, 0022, 0023), then group 2 in the order above with 0025 last.

Do you agree with this order, or do you want another? Any ADR can be skipped, and you can stop at any point.


## Turn 2, user: I agree to that order. Go on.

Files changed after this turn:

```
(none)
```

**ADR-0002 Localization:** I've read the whole file. Here's the evidence.

**What the repository does today**
- Documentation is in English: `readme.md` and `.github/security.md`.
- Code is in English: every symbol in `source/` (`HTTPError`, `TimeoutError`, `beforeRetry`).
- Comments are in English, for example `.github/workflows/main.yml:24` and throughout `source/`.
- Commits are in English: all 593 subjects, for example "Let a `beforeRetry` hook change per-attempt options".
- I found no French anywhere.

**Comparison with the recommendation:** none of the four media departs from `default: english`.

**Proposed ruling: `accepted`**

| Key | Value | Mark | Evidence |
|---|---|---|---|
| `localization.language.default` | `english` | observed | readme, symbols, comments and commits above |
| `documentation` | empty (same as default) | observed | readme.md is in English |
| `commits` | empty (same as default) | observed | `git log` |
| `code` | empty (same as default) | observed | `source/` |
| `comments` | empty (same as default) | observed | `source/`, the CI workflow |

**Departures from the recommendation:** none.

**Metadata:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from the git user.

Do you agree with this ruling? You can also amend it or skip this ADR.


## Turn 3, user: Skip this one: I don't want to rule it today.

Files changed after this turn:

```
(none)
```

ADR-0002 is skipped, and its file is untouched.

Next is **ADR-0003 Software architecture**. I've read it in full; I'll check the layout of `source/` first.
---
**ADR-0003 Software architecture.** The ADR says that under about 500 lines, or for a repository that isn't a service, `monolithic` is often the honest answer.

**What the repository does today**
- It's a library published to npm (`package.json` has `exports`, `files: ["distribution"]` and `"release": "np"`), not a service. That's the case the ADR singles out.
- It has a single entry point, `source/index.ts`, and one deliverable, `distribution/`.
- `source/` is organised by kind, not by domain and adapters. `core/` holds `Ky.ts`, `constants.ts` and `retry-timing.ts`. Alongside it are `errors/`, `types/` and `utils/`.
- There are no ports and no adapters. The only I/O is the global `fetch`, called straight from `core/Ky.ts`. It isn't behind an interface, so its replacement goes through the `fetch` option.
- Nothing enforces dependency rules (`xo` sets no import boundaries). Imports point to `types/`, `utils/` and `core/constants.js` from anywhere.
- The `ky`, `zod` and `luxon` imports in `source/` are examples in doc comments, not code dependencies. `dependencies` is absent from `package.json`.

**Comparison with the recommendation (`hexagonal`):**
- The domain isn't isolated from I/O. Retry, timeouts and hooks wrap `fetch` directly.
- There are no ports or adapters, and nothing enforces which way dependencies point.

**Proposed ruling: `accepted`**

| Key | Value | Mark | Evidence |
|---|---|---|---|
| `architecture.pattern` | `monolithic` | observed | Ky is one library with one entry point, organised by kind (`core/`, `errors/`, `types/`, `utils/`), with no internal boundaries or adapters |

**Departure from the recommendation:** I propose `monolithic` instead of `hexagonal`, for three reasons.
- Ky is a small HTTP client library whose whole job is to wrap `fetch`. Separating its domain from that I/O would add indirection without isolating anything.
- The ADR itself names a non-service repository as the case for `monolithic`.
- Its tests already run without a network, against local servers (`test/helpers`).

**What goes in the body:** the layout as it is. `core/` holds the client, `errors/` the error classes, `types/` the public types, and `utils/` the helpers with no state. `source/index.ts` is the only public entry point.

Do you agree with this ruling? You can also amend it or skip this ADR.


## Turn 4, user: I agree with this ruling. Write it.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 127 ++++++++++-----------------
 1 file changed, 44 insertions(+), 83 deletions(-)

```

I've written ADR-0003, but `npx ontrack apply` failed, so AGENTS.md isn't updated yet.

**Written:** `docs/adr/trivoallan/ADR-0003-architecture.md`
- `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`.
- `architecture.pattern: monolithic`.
- I removed the how-to-rule block and the "What is this file?" note. In their place the Decision says why `monolithic` departs from `hexagonal`, and describes the layout (`index.ts`, `core/`, `errors/`, `types/`, `utils/`).
- I rewrote the Consequences for this verdict.

**What blocked `apply`:**
```
ontrack: dependency "@sindresorhus/tsconfig" is not installed; run npm install
```
`node_modules/` only holds part of the dev dependencies. ontrack won't run until they're all there.

`npm install` would fetch ky's ~15 dev dependencies from the registry and run their install scripts. No lockfile pins them (`.npmrc` has `package-lock=false`). I'd rather not run that without asking you. Your options:
1. **I run `npm install`, then `npx ontrack apply`.**
2. **You install them yourself**, and I carry on once you say so.
3. **I carry on with ADR-0004** and run `apply` once, later, for every ruling. `apply` rewrites AGENTS.md from all ruled ADRs, so a single run at the end covers them all. Until then AGENTS.md doesn't list ADR-0003 as decided.

Which do you prefer?


## Turn 5, user: Let's stop the review here for today.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 127 ++++++++++-----------------
 1 file changed, 44 insertions(+), 83 deletions(-)

```

I've stopped the review here and written nothing more.

## Ruled in this review
- **ADR-0003 Software architecture:** `accepted`, `architecture.pattern: monolithic`, written in the file. `npx ontrack apply` failed because `@sindresorhus/tsconfig` isn't installed, so **AGENTS.md doesn't list it as decided yet**. Run `npm install` and then `npx ontrack apply` to finish that step.

## Skipped
- **ADR-0002 Localization:** its file is untouched and it's still `proposed`.

## Still `proposed`
- **Already answered by the repository (group 1):** 0002 Localization, 0004 Languages, 0005 Validation, 0008 Documentation, 0010 Architecture documentation, 0013 Frontend, 0014 Work tracking, 0022 Review and merge, 0023 License.
- **Needing a discussion (group 2):** 0006 Commits, 0007 Tests, 0009 Branching, 0011 Forge and CI, 0012 Delivery, 0015 Secrets, 0016 Changes, 0017 Agent tooling, 0018 Dependencies, 0019 Vulnerabilities, 0020 Adding a dependency, 0021 Build provenance, 0024 Code scanning, 0026 Agent identity, and 0025 Tools last.

The repository works with these left open: `npx ontrack check` only runs the ADRs that are decided.

## Rulings this repository doesn't follow yet
**None.** The two decided ADRs match the repository:
- `[trivoallan/ADR-0001] record-architecture-decisions.format`: `nygard` holds, and ADR-0003 keeps the Nygard sections in order. I couldn't run its schema check because ontrack doesn't run until the dependencies are installed.
- `[trivoallan/ADR-0003] architecture.pattern`: `monolithic` matches how `source/` is laid out today.

With no `tracking` trait decided (ADR-0014 is still `proposed`), there's no tracker to check against, so I've created no tracking items.

