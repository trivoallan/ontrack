## Turn 1, user: (the sequence prompt)

Files changed after this turn:

```
(none)
```

Still in the read-only survey: I've read ADR-0002 to 0007 and am going through the rest before I look at the repository's files.
---
Now the repository itself.
---
I've read all 25 proposed ADRs and checked the repository's files, CI and history. I haven't written anything yet.

**One thing first:** AGENTS.md says to run `npx -p @trivoallan/ontrack ontrack review` for an ADR review. I tried it twice and both attempts needed an approval that wasn't given, so I did this survey by hand. Approve the command if you want me to follow its output for each ruling.

**Two facts that affect several rulings:**
- `.gitignore` excludes `AGENTS.md`, `CLAUDE.md` and `.claude`. The rules `ontrack apply` writes would not be committed, and committed agent settings would be ignored too.
- `.npmrc` has `package-lock=false` and `.gitignore` excludes every lockfile, so no lockfile is committed.

## Group 1: the repository already answers these (11)

| ADR | What the repository shows |
|---|---|
| 0002 Localization | All docs, code, comments and commits are in English → `default: english` |
| 0003 Architecture | One npm library with flat modules in `lib/`; not a service → `monolithic`, not the recommended `hexagonal` |
| 0004 Languages | JavaScript (CommonJS) with hand-written `pino.d.ts` typings → `JavaScript`, not one of the two recommended languages, so it needs a written justification |
| 0006 Commits | Conventional Commits in the history, with scopes such as `types`, `deps`, `transport`, `browser`. No commitlint, and versions are set by hand → `tool: none` |
| 0010 Architecture docs | No architecture document and no diagrams → `none` for all three keys |
| 0012 Delivery | Publishes to npm through `publish-release.yml`, started by hand. Versions are bumped by hand, and `@matteo.collina/release-notes` writes the notes → `package`, `manual`, `changelog` |
| 0013 Frontend | No user interface. The docsify site is documentation, not a product UI → `rejected` |
| 0014 Work tracking | `bugs.url` in `package.json` points to `pinojs/pino` GitHub issues |
| 0016 Changes | No change framework; the intent of a change lives in its pull request → `none` |
| 0017 Agent tooling | `.claude` and `AGENTS.md` are gitignored, and CONTRIBUTING refuses pure-AI pull requests → `hosts: []` |
| 0023 License | `"license": "MIT"` in `package.json`, and a `LICENSE` file at the root |

## Group 2: these need a discussion (14)

| ADR | Why |
|---|---|
| 0005 Validation | Options are checked by hand, with no schema library. That conflicts with the requirement unless you name a reason, such as performance or few dependencies. |
| 0007 Tests | `borp` enforces 95% coverage, but CONTRIBUTING says 100%. Which number holds? |
| 0008 Documentation | The site is docsify (`index.html`, `CNAME` getpino.io), and docsify is not an allowed value for `docs.tool`. |
| 0009 Branching | Pull requests are squash-merged (`(#NNNN)` in commit subjects), but many branch names have no prefix, and there are LTS branches (`v8.x`, `v9.x`). |
| 0011 Forge and CI | GitHub. Most actions are pinned by tag, not by SHA. `target-main.yml` uses `pull_request_target`. No workflow audit runs. Whether CI blocks the merge depends on a ruleset I can't see. |
| 0015 Secrets | No local secrets and no guard. `none`/`none`, or add gitleaks? |
| 0018 Dependencies | `.github/dependabot.yml` was deleted in #2517, but the Dependabot automerge job is still in `ci.yml`, with no cooldown and no exception for GitHub Actions updates. |
| 0019 Vulnerabilities | `dependency-review-action` runs on pull requests only. There is no scheduled scan and no SBOM. |
| 0020 Adding a dependency | CI installs with `npm i --ignore-scripts`, and no lockfile is committed, which conflicts with fixed rule 5. |
| 0021 Build provenance | The publish job has `id-token: write`, which suggests trusted publishing, but `--provenance` is never named. |
| 0022 Review and merge | Several maintainers with commit access, and a human must open each pull request. Is the value `peer`, and how many approvals? |
| 0024 Code scanning | No CodeQL workflow is committed. Default setup may be on in the repository settings, which I can't see. |
| 0025 Tools | The answer depends on whether 0011 and 0015 name a tool such as zizmor or gitleaks. |
| 0026 Agent identity | This ADR is written for a repository kept by one person, and pino is kept by an organisation with several maintainers. It may not apply. |

**Proposed order:** group 1 first, in number order (0002 → 0023). Then group 2 in number order, except that 0011 and 0015 come before 0025, and 0022 comes before 0026, because those depend on the earlier rulings.

Do you agree to this order, or do you want a different one? You can also approve the `ontrack review` command now.


## Turn 2, user: I agree to that order. Go on.

Files changed after this turn:

```
(none)
```

Starting with **ADR-0002 Localization**. I've read the whole file.

**What the repository does today:** everything is in English.
- **Documentation:** `README.md`, `docs/*.md` and `SECURITY.md` are in English.
- **Commits:** the last 300 subjects are all in English (`fix: omit msg when it serializes to undefined (#2548)`).
- **Code and comments:** names and comments in `lib/*.js` and `pino.js` are English.

**The recommendation** is `default: english` with no overrides. The repository matches it exactly, so there are no differences.

**Conditions:** this ADR sets none.

**Proposed ruling: `accepted`**

| Key | Value | Evidence |
|---|---|---|
| `localization.language.default` | `english` | observed: docs, commits, code and comments are all English |
| `documentation` | empty, so it takes the default | observed |
| `commits` | empty, so it takes the default | observed |
| `code` | empty, so it takes the default | observed |
| `comments` | empty, so it takes the default | observed |

**Departures from the recommendation:** none. The ADR will get one line saying the recommendation is adopted as is.

**What I'd write in the file:**
- the status;
- today's date, 2026-11-15;
- the Consequences rewritten for this repository;
- the ruling instructions block deleted, as the ADR asks;
- then I'd run `ontrack apply`.

For `authors:`, I'd use **Tristan Rivoallan** (your git user name, without the email) unless you give other names.

Do you agree with this ruling and this author? You can also skip this ADR, or stop the review.


## Turn 3, user: Skip this one: I don't want to rule it today.

Files changed after this turn:

```
(none)
```

I've skipped ADR-0002 and left its file untouched. Next is **ADR-0003 Software architecture**. I've read the whole file.
---
**What the repository does today:**
- It is a single npm library: one package and one deployable unit. It is not a service.
- It has 2,262 lines in all: `pino.js` plus 14 flat modules in `lib/`. `pino.js` requires all of them directly (`pino.js:5-22`, `:248-249`).
- There is no domain layer, no ports and no adapters. Code that does I/O (`lib/tools.js`, `lib/transport.js`, which use `fs` and `worker_threads`) sits next to the pure modules (`levels`, `time`, `redaction`) with no boundary between them.
- No document describes the layout or any rules about what may depend on what.

**Compared with the recommendation (`hexagonal`):**
1. The repository has no hexagonal structure: the I/O modules are not separated from the logic.
2. The ADR says the recommendation "holds for an application service of moderate size", and that for "a repository that is not a service, `monolithic` is often the honest answer". That condition is checked: pino is a library, not a service, as `"main": "pino.js"` and the absence of any server code show.

**Proposed ruling: `accepted`**

| Key | Value | Evidence |
|---|---|---|
| `architecture.pattern` | `monolithic` | observed: one package and one deployable, flat `lib/` modules required directly by `pino.js`, no internal boundaries |

**Departure from the recommendation:** `monolithic` instead of `hexagonal`, for two reasons:
- Pino is a library, not a service.
- Writing to streams and worker threads is what the library is for. Ports and adapters would add indirection to the logging path, in a project whose selling point is speed (`benchmarks/`, `bench.yml`).

The layout would be written in the ADR body: `pino.js` is the entry point, and the internal modules live in `lib/`.

**What I'd write in the file:**
- the status, the date (2026-11-15) and `authors: [Tristan Rivoallan]`;
- the Consequences rewritten for this repository;
- the reason for the departure, in place of the ruling instructions;
- then I'd run `ontrack apply`.

Do you agree with this ruling? You can also skip this ADR, or stop the review.


## Turn 4, user: I agree with this ruling. Write it.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 92 +++++++++-------------------
 1 file changed, 30 insertions(+), 62 deletions(-)

```

The ruling steps don't say to remove the "What is this file?" note, so I'm putting it back to keep within the steps.
---
ADR-0003 is written, but `ontrack apply` failed, so AGENTS.md has not been updated yet.

**What's in the file** (`docs/adr/trivoallan/ADR-0003-architecture.md`):
- `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`.
- `architecture.pattern: monolithic` under `traits:`.
- The ruling instructions are gone. In their place are the reason for choosing `monolithic` over `hexagonal` and a short description of the layout (`pino.js` is the entry point, internal modules go in `lib/`).
- The Consequences are rewritten for this repository.
- I briefly removed the "What is this file?" note at the top, then put it back, since the ruling steps don't say to delete it.

**Why `ontrack apply` failed:** it stopped with `dependency "@pinojs/redact" is not installed; run npm install`. The repository's dependencies have never been installed here: there is no `node_modules`.

To fix it I'd run `npm install`, then `ontrack apply` again. That downloads all of pino's dev dependencies (eslint, jest, typescript, airtap and others), and npm runs their install scripts unless `--ignore-scripts` is passed. CI installs with `npm i --ignore-scripts`, so I'd do the same.

May I run `npm install --ignore-scripts` and then `ontrack apply`? Otherwise I'll leave AGENTS.md as it is and go on to ADR-0004 Languages.


## Turn 5, user: Let's stop the review here for today.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0003-architecture.md
 docs/adr/trivoallan/ADR-0003-architecture.md | 92 +++++++++-------------------
 1 file changed, 30 insertions(+), 62 deletions(-)

```

I've stopped the review and written nothing more.

**Ruled today**
- **ADR-0003 Software architecture:** `accepted`, `architecture.pattern: monolithic` (observed).

**`ontrack apply` didn't run.** It needs the dependencies installed, so AGENTS.md doesn't show the ADR-0003 ruling yet. Running `npm install --ignore-scripts` and then `npx -p @trivoallan/ontrack ontrack apply` will fix that. Also, `.gitignore` excludes `AGENTS.md`, so even once it's regenerated it won't be committed unless that line changes.

**Still `proposed`**
- **Already answered by the repository:**
  - 0002 Localization (skipped today)
  - 0004 Languages
  - 0006 Commits
  - 0010 Architecture documentation
  - 0012 Delivery
  - 0013 Frontend
  - 0014 Work tracking
  - 0016 Changes
  - 0017 Agent tooling
  - 0023 License
- **Need a discussion:**
  - 0005 Validation
  - 0007 Tests
  - 0008 Documentation
  - 0009 Branching
  - 0011 Forge and CI
  - 0015 Secrets
  - 0018 Dependencies
  - 0019 Vulnerabilities
  - 0020 Adding a dependency
  - 0021 Build provenance
  - 0022 Review and merge
  - 0024 Code scanning
  - 0025 Tools
  - 0026 Agent identity

The repository works with all of these open: `ontrack check` runs only the ADRs that have been decided.

**Rulings the repository doesn't follow yet:** none. The repository already follows the one ruling made today, `[trivoallan/ADR-0003] architecture.pattern`. ADR-0014 isn't decided, so there's no tracker to open items in; I didn't check for existing items and created none.

