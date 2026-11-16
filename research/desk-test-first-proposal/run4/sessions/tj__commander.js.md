## Turn 1, user: (the sequence prompt)

Files changed after this turn:

```
(none)
```

I'll start with the project rule: run the ontrack review command, then look at the ADRs and the repository.
---
The `ontrack review` command needs approval I don't have here, so I'll survey by reading the ADRs directly.
---
The ADRs share long boilerplate. I'll pull only the parts that differ for the rest: frontmatter, Context and Decision, and the keys table.
---
Now the repository itself: CI, Dependabot, docs, history and conventions.
---
I've read all 25 proposed ADRs and gone through the repository's files, CI, Dependabot config and history. I haven't written anything yet.

One note first: `AGENTS.md` says to run `npx -p @trivoallan/ontrack ontrack review`, but that command needs an approval I don't have in this session. I worked from the ADR files directly. If you approve it, I'll run it and follow what it says.

## Group 1: the repository already answers these (15)

| ADR | What the repository does today |
|---|---|
| **0002** Localization | Code, comments, docs and commits are all in English. `docs/zh-CN/` and `Readme_zh-CN.md` are translations, not a second working language. |
| **0003** Architecture | One npm library: `index.js` plus `lib/*.js`, with no ports or adapters. The ADR itself says a repository that isn't a service is often `monolithic`. |
| **0004** Languages | Written in JavaScript (ESM) with JSDoc; `typings/index.d.ts` is checked by `tsc` and `tsd`. This departs from the Python/TypeScript list, and the justification is already in the repository. |
| **0008** Documentation | Markdown pages in `docs/`, no site generator. The repository is public on GitHub. |
| **0009** Branching | PRs target `develop` (CONTRIBUTING.md). There are `release/N.x` branches. PRs land as one commit `… (#NNNN)`; branch merges happen only into release lines. |
| **0010** Architecture docs | There is no architecture document. |
| **0012** Delivery | Publishes to npm. No release workflow exists. CHANGELOG and version are updated by hand by maintainers. `docs/release-policy.md` says major releases highlight breaking changes. |
| **0013** Frontend | No user interface, so this ADR is a `rejected` candidate. |
| **0014** Work tracking | GitHub issues on `tj/commander.js`. CONTRIBUTING asks for an issue before any PR. |
| **0016** Changes | No change framework. The intent of a change lives in the PR template (Problem, Solution, ChangeLog). |
| **0018** Dependencies | `.github/dependabot.yml` covers npm and github-actions. There's no automerge workflow, and Dependabot PRs are merged by hand. |
| **0023** License | `"license": "MIT"` in package.json, and a `LICENSE` file at the root. |
| **0025** Tools | No tool is used outside npm or GitHub Actions. |
| **0026** Agent identity | Several maintainers merge (John Gee, Abe Tomoaki). The ADR says repositories with several maintainers are "not concerned", so this is a `rejected` candidate. |
| **0024** Code scanning | `codeql-analysis.yml` runs on PRs, on pushes and weekly. The blocking threshold depends on 0011, so I'll raise it when we get there. |

## Group 2: these need a discussion (10)

| ADR | Why it's open |
|---|---|
| **0005** Validation | Commander is an argument parser with a zero-production-dependency policy, so `zod` would clash with that policy. The mechanism has to be named. |
| **0006** Commits | The history doesn't use Conventional Commits; only a few outside contributors write `fix:` or `docs:`. Versions are set by hand, so `commitlint`'s premise fails. Governance still requires the format. |
| **0007** Tests | Tests run with `node --test`, but no coverage tool or threshold is set up (`coverage/` is only gitignored). |
| **0011** Forge and CI | It's GitHub and the pipeline exists, but whether red blocks a merge lives in a ruleset I can't see from the files. There's no zizmor. |
| **0015** Secrets | The repository uses no secrets, and there's no guard. |
| **0017** Agent tooling | There's no `.claude/` or `opencode.json`. `AI_POLICY.md` limits contributions from AI. Which hosts to declare is your call. |
| **0019** Vulnerabilities | No SBOM and no dependency scan. |
| **0020** Adding a dependency | CONTRIBUTING discourages new dependencies, but there's no `.npmrc` cooldown and no install-script policy. |
| **0021** Build provenance | Publishes to npm with no CI publish job, so there's no provenance today (level 0). |
| **0022** Review and merge | Several maintainers, which suggests `peer`, but the required approvals live in an unseen ruleset. |

I suggest this order: Group 1 as listed (0024 at the end, since it waits on 0011), then Group 2 in number order, which puts 0011 before 0024 overall.

**Do you agree with this order, or would you like another?** I'll start with ADR-0002 once you confirm.


## Turn 2, user: I agree to that order. Go on.

Files changed after this turn:

```
(none)
```

## ADR-0002 Localization

I've read the whole file. Here is what the repository does today:

- **Documentation:** `Readme.md`, `docs/*.md`, CONTRIBUTING, AI_POLICY and SECURITY are all in English.
- **Translations:** `Readme_zh-CN.md` and `docs/zh-CN/` are Chinese translations of the English pages. They are not a second working language: the English pages are the source, and PRs and the CHANGELOG are in English.
- **Commits:** the last 40 subjects (`git log`) are all in English.
- **Code and comments:** the symbols and JSDoc in `lib/*.js` and `typings/index.d.ts` are in English, for example `// default to using process.argv` at `lib/command.js:1015`.

That matches the recommendation (`default: english`, no overrides) with no difference. The ADR has no conditional recommendation to check.

### Proposed ruling

- **status:** `accepted`
- `localization.language.default`: `english`, **observed** (docs, commits, code and comments are all English)
- `documentation`, `commits`, `code`, `comments`: left empty, so they take `default`. **Observed**: none of them departs from English.
- **Departures from the recommendation:** none. I'll write one line saying it's adopted as is, plus a note that the zh-CN pages are translations and not an override.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, the git user here. Tell me if other names should be listed.

**Do you agree to this ruling, or would you rather amend it or skip ADR-0002?**


## Turn 3, user: Skip this one: I don't want to rule it today.

Files changed after this turn:

```
(none)
```

I've left ADR-0002 untouched; it stays `proposed`.

Next is ADR-0003. I've already read it in full, so I'll check the code's structure.
---
## ADR-0003 Software architecture

I've read the whole file. Here is what the repository does today:

- **What it is:** a single npm library, not a service. package.json `files` publishes only `index.js`, `lib/*.js`, `typings/index.d.ts` and `package-support.json`.
- **Size:** about 4,200 lines in 6 modules. `lib/command.js` alone has 2,803.
- **Structure:** `index.js` re-exports the classes. The modules import each other directly (`command.js` imports `argument`, `error`, `help`, `option` and `suggestSimilar`), and there's no domain/adapter split.
- **I/O:** `lib/command.js` calls Node directly: `node:fs`, `node:child_process`, `node:path` and `node:process` (lines 1–6, `process.env` around line 1980, `childProcess.spawn` at line 1286). There are no ports.

**Comparing with the recommendation:** `hexagonal` is recommended for "an application service of moderate size". The ADR's own condition says that "for a repository that is not a service, `monolithic` is often the honest answer". The condition holds: this is a library, and nothing is deployed as a service.

### Proposed ruling

- **status:** `accepted`
- `architecture.pattern`: `monolithic`, **observed** (one published package, modules that import each other without boundaries, I/O called in place)
- **Departure from the recommendation:** `monolithic` instead of `hexagonal`. The reason I'd write: commander is a library with no service to deploy. Its I/O (reading `process.argv`/`process.env`, spawning subcommands) is the product itself, so ports and adapters would add indirection without isolating a domain.
- **date:** `2026-11-15`, **authors:** `[Tristan Rivoallan]`

**Do you agree to this ruling, or would you rather amend it or skip ADR-0003?**


## Turn 4, user: I agree with this ruling. Write it.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 88 ++++++++++------------------
 1 file changed, 32 insertions(+), 56 deletions(-)

```

Before writing, I'll look at ADR-0001, which is already accepted, to see how a ruled file is laid out.
---
The file is ruled. Now I'll run `ontrack apply` to update AGENTS.md.
---
I've written ADR-0003 as agreed, but AGENTS.md isn't updated yet.

**What changed in `docs/adr/trivoallan/ADR-0003-architecture.md`:**
- `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, `architecture.pattern: monolithic`, and the body's Status now reads "Accepted".
- The how-to-rule block is gone. In its place is the reason for departing from `hexagonal`: commander is an npm library, not a service, and its I/O is the product itself. I also recorded what the structure is today: `index.js` re-exports, one module per concept in `lib/`, `typings/` and zero production dependencies.
- Consequences are rewritten for this verdict.

**What's blocked:** `ontrack apply` stopped with `dependency "@eslint/js" is not installed; run npm install`, because `node_modules` doesn't exist here. You denied `npm ci`, so I haven't installed anything, and AGENTS.md still lists ADR-0003 under "Not yet decided".

How would you like to go on?
1. **You install the dependencies**, for example by typing `! npm ci` in this prompt, and I re-run `ontrack apply` before moving to ADR-0004.
2. **Defer `apply`**: I keep ruling ADRs and run `ontrack apply` once, at the end, after you've installed the dependencies.
3. **Allow me to run `npm ci`**, and I'll install and then apply.

ADR-0004 (Languages) comes next once you choose.


## Turn 5, user: Let's stop the review here for today.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 88 ++++++++++------------------
 1 file changed, 32 insertions(+), 56 deletions(-)

```

I've stopped the review. Of 25 proposed ADRs, I ruled one (ADR-0003, as `monolithic`), you skipped one (ADR-0002), and nothing more was written. ADR-0003's file is written, but AGENTS.md still lists it as not decided: `ontrack apply` needs the repository's dependencies installed, and you declined `npm ci`.

## Ruled in this review

- **ADR-0003 Software architecture:** `accepted`, `architecture.pattern: monolithic`. It departs from `hexagonal` because commander is a library, not a service. To update AGENTS.md, run `npm ci` and then `npx -p @trivoallan/ontrack ontrack apply`.

## Still `proposed`

**The repository already answers these:**
- ADR-0002 Localization (skipped today)
- ADR-0004 Languages
- ADR-0008 Documentation
- ADR-0009 Branching
- ADR-0010 Architecture documentation
- ADR-0012 Delivery
- ADR-0013 Frontend
- ADR-0014 Work tracking
- ADR-0016 Changes
- ADR-0018 Dependencies
- ADR-0023 License
- ADR-0024 Code scanning
- ADR-0025 Tools
- ADR-0026 Agent identity

**These need a discussion:**
- ADR-0005 Validation
- ADR-0006 Commits
- ADR-0007 Tests
- ADR-0011 Forge and CI
- ADR-0015 Secrets
- ADR-0017 Agent tooling
- ADR-0019 Vulnerabilities
- ADR-0020 Adding a dependency
- ADR-0021 Build provenance
- ADR-0022 Review and merge

The repository works with all of these open: `ontrack check` runs only the decided ADRs.

## Rulings the repository doesn't follow yet

None. The only decided traits are these two, and both are followed:
- **`[trivoallan/ADR-0001] record-architecture-decisions.format`:** the ADRs in `docs/adr/trivoallan/` are in the Nygard format.
- **`[trivoallan/ADR-0003] architecture.pattern`:** `monolithic` is what the code does today, as written in the ruling.

I couldn't run `ontrack check` to confirm this mechanically, because it needs the same dependencies as `apply`.

So there are no tracking items to propose. No `tracking` trait is decided either (ADR-0014 is still proposed), so I wouldn't create any items anyway.

