### sindresorhus__ky.json cost=1.58 turns=34 subtype=success writes=[]
I'll start with the survey: read every ADR and look at the repository, writing nothing.
---
Now the repository itself.
---
The survey is done and I haven't written anything. I read all 25 ADRs, along with `package.json`, `.npmrc`, `.gitignore`, `.github/` (one workflow, `security.md`, `funding.yml`), `license`, `readme.md`, `source/` and the git history: 592 commits, 99 tags, no merge commits, 256 subjects ending in `(#NNN)`, and no Conventional Commits.

## Group 1: the repository already answers these

| ADR | What the repository shows today |
|---|---|
| 0002 Localization | Code, comments, readme and commits are all in English → `default: english` |
| 0003 Software architecture | A single library package, not a service (`source/{core,utils,errors,types}`) → probably `monolithic` |
| 0004 Languages | `source/**/*.ts`, `typescript` in devDependencies → `TypeScript` |
| 0008 Documentation | No site generator. All docs are in `readme.md`, the package is public on npm → `tool: none`, `audience: public` |
| 0010 Architecture documentation | No `docs/architecture/`, no model, no diagrams → `none` ×3 |
| 0012 Delivery | `"release": "np"` publishes to npm from a workstation, with 99 `vX.Y.Z` tags → `target: package`, release tool `np` |
| 0013 Frontend | A library with no user interface → `rejected` |
| 0014 Work tracking | PR references `(#NNN)` and `remote origin` = `sindresorhus/ky` → `github-issues` |
| 0022 Review and merge | Contributor PRs are squash-merged by the single maintainer → `maintainer`, `0` |
| 0023 License | `"license": "MIT"` and an MIT `license` file. The file name is lowercase, so I'll check whether that matches what the ADR's check expects |
| 0026 Agent identity | Only one maintainer, and no separate agent account anywhere → `maintainer` |

## Group 2: these need a discussion

| ADR | Why it needs one |
|---|---|
| 0005 Validation | The package has zero runtime dependencies. Options are checked by hand with about 34 `TypeError`s, and responses are validated through Standard Schema. The recommended `zod` doesn't fit |
| 0006 Commits | The ADR requires Conventional Commits, and no commit in the history uses them |
| 0007 Tests | `ava` is there, but nothing measures coverage. You'd choose between `90` and `none` |
| 0009 Branching | The maintainer pushes to `main` directly, contributor PRs are squashed, and branch names like `fix-methods` have no prefix |
| 0011 Forge and CI | Actions are pinned by tag (`@v6`), not by SHA. Nothing audits the workflows, and the ruleset can't be seen from here |
| 0015 Secrets | The code handles no secrets and there's no guard. You'd choose `gitleaks` or `none` |
| 0016 Changes | No change framework is used |
| 0017 Agent tooling | There's an `AGENTS.md` but no `.claude/` |
| 0018 Dependencies | No updater, and `package-lock=false` means there's no lockfile |
| 0019 Vulnerabilities | Nothing scans dependencies and no SBOM is produced |
| 0020 Adding a dependency | Rule 5 requires a committed lockfile, which this repository refuses on purpose |
| 0021 Build provenance | The package is published from a laptop with `np`, so today it is at level 0 |
| 0024 Code scanning | Nothing scans the code |
| 0025 Tools | The answer depends on what 0011 and 0015 name |

**Proposed order:** Group 1 in numeric order, then Group 2 as 0005, 0006, 0007, 0011, 0018, 0009, 0015, 0019, 0020, 0021, 0024, 0016, 0017, 0025.

That order differs from strict numbering in two places, both for reasons the ADRs give:
- **0011 comes early:** its `forge.gate` value decides what 0018, 0019 and 0024 are allowed to do.
- **0018 comes before 0009:** ADR-0009 says to rule it first, or bot branches fail the 0009 check.

**Before we start, one thing to know about the tracker:** this checkout's `origin` is `sindresorhus/ky`. If 0014 is ruled `github-issues` with that project, the tracking items at the end would be created in the upstream repository. That's someone else's public tracker, and I'd only do it on your explicit say-so. If this is your fork, the project should name your fork instead.

Do you agree to this order, or would you like a different one?
