## Turn 1, user: (the sequence prompt)

Files changed after this turn:

```
(none)
```

I'll start with the survey: reading every proposed ADR and the repository, writing nothing.
---
Still surveying: reading the remaining ADRs before I group them.
---
Reading the remaining ADRs (0014–0026).
---
All ADRs read. Now surveying the repository itself.
---
Nearly done with the survey; checking how config files are read at runtime, then I'll present the grouping.
---
Survey finished. I read all 25 proposed ADRs and checked the repository's files, CI, bot configuration and 1,436 commits. I wrote nothing.

## Group 1: the repository already answers these (11)

What it does today gives the trait values directly, so ruling mostly means recording current practice.

| ADR | What the repository shows |
|---|---|
| 0002 Localization | Everything is in English: docs, commits, code, comments |
| 0004 Languages | TypeScript (`tsconfig.json`, `src/**/*.ts`, `gts`) |
| 0009 Branching | GitHub flow with pull requests. Squash merges: 1 merge commit in 1,436, and subjects end in `(#NNNN)`. `sync-repo-settings.yaml` sets `mergeCommitAllowed: false`. Branch prefixes are not visible locally |
| 0010 Architecture documentation | `docs/design.md` already describes the design (→ `elsewhere`). No model, no diagrams |
| 0012 Delivery | npm package published on tag through Kokoro `publish.sh`. `release-please` releases itself (`.github/release-please.yml`, manifest config). Release notes are the generated changelog |
| 0013 Frontend | No user interface: it is a CLI and library (→ `rejected`) |
| 0014 Work tracking | GitHub issues on `googleapis/release-please`. The PR template asks for an issue first |
| 0018 Dependencies | `renovate.json` with `config:best-practices`. No automerge rule. Dependabot security PRs also arrive |
| 0022 Review and merge | `requiredApprovingReviewCount: 1` plus code-owner reviews (→ `peer`, `1`) |
| 0023 License | `Apache-2.0` in `package.json`, and a `LICENSE` file at the root |
| 0026 Agent identity | Several maintainer teams (`CODEOWNERS`, `permissionRules`). The ADR is written for a single-person repository (→ likely `rejected`) |

## Group 2: these need a discussion (14)

Either the repository does nothing here today, or what it does departs from the recommendation, so ruling means choosing.

| ADR | Why it needs a discussion |
|---|---|
| 0003 Software architecture | The strategy/plugin/updater structure matches none of the six patterns cleanly |
| 0005 Validation | The config files have JSON Schemas (`schemas/`, and `$schema` is set in the config). But `parseConfig` checks values by hand at runtime, and no `zod` is used |
| 0006 Commits | 1,430 of 1,436 subjects follow Conventional Commits, and versions are derived from them. That is exactly when the ADR recommends `commitlint`, and no `commitlint` is installed. Scopes are used loosely (`main`, `deps`, strategy names) |
| 0007 Tests | `c8` measures coverage but has no threshold. You need to pick a number |
| 0008 Documentation | Markdown in `docs/` is read on GitHub. Kokoro also publishes API docs to a Google devsite, which matches none of the tool values |
| 0011 Forge and CI | The gate is blocking (required checks). Nothing audits the workflows, so `forge.audit` is absent. The required check list is also stale (`test (18)` while the matrix runs `[22]`) |
| 0015 Secrets | No secret is stored in the repository and there is no guard |
| 0016 Changes | No change framework; intent lives in PR descriptions |
| 0017 Agent tooling | No `.claude/`, `opencode.json` or Copilot settings |
| 0019 Vulnerabilities | No SBOM and no scanner in the repository (Kokoro may produce SBOMs outside it) |
| 0020 Adding a dependency | No cooldown or install-script policy (`.npmrc` is absent) |
| 0021 Build provenance | `npm publish` runs without `--provenance` in `publish.sh`. Attestations may happen in Kokoro, outside the repository |
| 0024 Code scanning | No CodeQL or Semgrep workflow committed |
| 0025 Tools | It depends on 0015 and 0011. No tools are named yet |

**Proposed order:** group 1 in list order (0002, 0004, 0009, 0010, 0012, 0013, 0014, 0018, 0022, 0023, 0026), then group 2 in list order (0003, 0005, 0006, 0007, 0008, 0011, 0015, 0016, 0017, 0019, 0020, 0021, 0024, 0025).

ADR-0009 says to rule 0012 and 0018 before or with it, otherwise bot branches fail its check. So I'd move **0012 and 0018 ahead of 0009**.

Do you agree with this order (with that adjustment), or would you like a different one?


## Turn 2, user: I agree to that order. Go on.

Files changed after this turn:

```
(none)
```

Starting with **ADR-0002 Localization**. I read the file in full above.

**What the repository does today**
- Documentation: `README.md`, `CONTRIBUTING.md` and `docs/*.md` are all in English.
- Commits: all 1,436 subjects are in English (from the commit-type analysis of `git log`).
- Code and comments: symbols and comments in `src/**/*.ts` are in English, for example `src/manifest.ts` and `parseConfig`.

There is nothing conditional to check here. The recommendation is `default: english` with no overrides, which matches what the repository does, so there are no differences.

**Proposed ruling: `accepted`**

| Key | Value | Mark | Evidence |
|---|---|---|---|
| `localization.language.default` | `english` | observed | docs, commits, code and comments are all in English |
| `documentation` | (empty: takes the default) | observed | English |
| `commits` | (empty) | observed | English |
| `code` | (empty) | observed | English |
| `comments` | (empty) | observed | English |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.

Writing it means filling the trait, setting `status: accepted`, setting `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewriting Consequences for this repository, removing the ruling instructions and running `npx ontrack apply`.

Do you accept this ruling, want to change it, or skip ADR-0002?


## Turn 3, user: Skip this one: I don't want to rule it today.

Files changed after this turn:

```
(none)
```

ADR-0002 is skipped and its file is untouched.

Next is **ADR-0004 Languages**. I read the file in full above.

**What the repository does today**
- All source is TypeScript: `src/**/*.ts`, `test/**/*.ts`, compiled with `tsc -p .` (the `compile` script in `package.json`).
- The tooling is TypeScript tooling too: `tsconfig.json`, `gts` for lint, and `typescript` as a dependency.
- Other languages in the repository are secondary: shell and Kokoro config in `.kokoro/`, `owlbot.py`, and fixtures for the ecosystems release-please supports. The ADR says these do not change the answer.

The recommendation is `Python` or `TypeScript`, with TypeScript for code shared between browser and server. The repository's answer is one of the two recommended languages. The ADR's tie-break doesn't strictly apply, since this is a Node CLI and library with no browser code, but no justification is needed for a recommended value.

**Proposed ruling: `accepted`**

| Key | Value | Mark | Evidence |
|---|---|---|---|
| `languages.main.name` | `TypeScript` | observed | `tsconfig.json`, `src/**/*.ts`, `"compile": "tsc -p ."` |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.

Do you accept this ruling, want to change it, or skip ADR-0004?


## Turn 4, user: I agree with this ruling. Write it.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0004-languages.md
 docs/adr/trivoallan/ADR-0004-languages.md | 90 ++++++++-----------------------
 1 file changed, 22 insertions(+), 68 deletions(-)

```

I'll write the ruled ADR-0004. Following accepted ADR-0001, the `Status` section reads `Accepted` with no "proposed" notice.
---
`ontrack apply` refused to run because the project's dependencies aren't fully installed. Before installing anything, I'll check whether the tool can skip that check.
---
I wrote the ADR-0004 ruling, but `AGENTS.md` isn't updated yet.

`ADR-0004-languages.md` is now `accepted` with `languages.main.name: TypeScript`, dated 2026-11-15, authors `[Tristan Rivoallan]`. I added a one-line note that it adopts the recommendation as is, rewrote Consequences for this repository, and removed the ruling instructions.

`npx ontrack apply` stopped with this error:

```
ontrack: dependency "@conventional-commits/parser" is not installed; run npm install
```

The project's dependencies aren't all in `node_modules`, and ontrack won't run until they are. My attempt to check for an option that skips this needed your approval, so I didn't run it.

To fix it I'd run **`npm ci`**, which installs exactly what's in the committed `package-lock.json`. It only touches the untracked `node_modules/` folder, but it does run the packages' install scripts, including this package's `prepare` step, which compiles it into `build/`. Then I'd run `npx ontrack apply` again.

Should I run `npm ci` and then `npx ontrack apply`, or would you rather install the dependencies yourself? I'll start ADR-0012 Delivery once `AGENTS.md` is updated.


## Turn 5, user: Let's stop the review here for today.

Files changed after this turn:

```
 M docs/adr/trivoallan/ADR-0004-languages.md
 docs/adr/trivoallan/ADR-0004-languages.md | 90 ++++++++-----------------------
 1 file changed, 22 insertions(+), 68 deletions(-)

```

Stopping here. I've written nothing for ADR-0012 or any other open ADR.

**Ruled today**
- ADR-0004 Languages: `accepted`, `languages.main.name: TypeScript`. The ADR file is written. `AGENTS.md` still lists it under "Not yet decided", because `npx ontrack apply` couldn't run without `npm ci` first. Run both next time and it will move over.

**Skipped**
- ADR-0002 Localization. The file is untouched.

**Still `proposed` (24)**
- **Group 1, already answered by the repository:** 0002 Localization, 0012 Delivery, 0018 Dependencies, 0009 Branching, 0010 Architecture documentation, 0013 Frontend, 0014 Work tracking, 0022 Review and merge, 0023 License, 0026 Agent identity.
- **Group 2, need a discussion:** 0003 Software architecture, 0005 Validation, 0006 Commits, 0007 Tests, 0008 Documentation, 0011 Forge and CI, 0015 Secrets, 0016 Changes, 0017 Agent tooling, 0019 Vulnerabilities, 0020 Adding a dependency, 0021 Build provenance, 0024 Code scanning, 0025 Tools.

The repository works fine with all of these still open, and `npx ontrack check` runs only the ADRs that have been decided.

**Rulings the repository doesn't follow yet:** none. The only ruling is `[trivoallan/ADR-0004] languages.main.name: TypeScript`, and all of `src/` and `test/` is already TypeScript. No `tracking` trait has been decided, since ADR-0014 is still open, so there's no tracker to check or create items in.

