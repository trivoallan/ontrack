### unjs__h3.json cost=1.77 turns=36 subtype=success writes=[]
I'll start the survey by reading the ADRs and the repository's setup.
---
Still surveying: 15 of the 25 ADRs read so far. Next I read the last ten, then the repository's config and history.
---
Now the repository side: config, CI, history.
---
All 25 ADRs are read. I'm now checking the repository itself: validation code, who writes the commits, and the GitHub repo settings.
---
The survey is done. I've read all 25 ADRs and the repository's files, CI, settings and history, and changed nothing. I couldn't read the GitHub settings (rulesets, merge options): the `gh` call needs your approval, and I'll ask for it only if an ADR depends on them.

## Group 1: the repository already answers these (6)

| ADR | What the repository does today | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, docs and all 1,651 commits are in English | `default: english`, no overrides |
| 0003 Software architecture | A single-package library with a minimal core, utilities and per-runtime entries (`src/`, AGENTS.md). Not a service | `monolithic` (the ADR's own hint for a non-service) |
| 0004 Languages | `src/**/*.ts`, strict `tsconfig.json` | `TypeScript` |
| 0013 Frontend | A library with no user interface. `docs/` is an undocs site, not an app | `rejected` |
| 0014 Work tracking | GitHub issues and PRs (`(#1585)` in commit subjects) | `github-issues`, project to confirm: the remote is `unjs/h3`, `package.json` says `h3js/h3` |
| 0023 License | `LICENSE` file, `"license": "MIT"` in `package.json` | `MIT` |

## Group 2: these need a discussion (19)

| ADR | Why it needs a discussion |
|---|---|
| 0005 Validation | h3 lets its users bring a schema through `standard-schema` (`src/utils/internal/standard-schema.ts`). `zod` is a dev dependency only. Data-file schemas haven't been checked yet |
| 0006 Commits | Conventional Commits in practice, but with a `types` type outside the eleven and about 40 free-form scopes. `changelogen` derives versions from commits, so the `commitlint` premise holds. No tool is set up |
| 0007 Tests | v8 coverage goes to Codecov with only a 5% drop threshold. No absolute target |
| 0008 Documentation | The site is built with `undocs` (`docs/package.json`), which isn't one of the ADR's values. No deploy workflow |
| 0009 Branching | Squash merges are observed (3 merge commits in 1,651). Branch prefixes can't be read from history |
| 0010 Architecture documentation | No arc42. The architecture section in AGENTS.md could count as `elsewhere` |
| 0011 Forge and CI | GitHub Actions with SHA-pinned actions. Whether a ruleset makes CI blocking isn't visible. No zizmor |
| 0012 Delivery | An npm package. Releases are made by hand with `pnpm release` (changelogen), plus `publish.yml` |
| 0015 Secrets | No local secrets file. Only `CODECOV_TOKEN` in CI. No gitleaks |
| 0016 Changes | No OpenSpec, intent lives in PRs |
| 0017 Agent tooling | AGENTS.md and CLAUDE.md exist, but no `.claude/settings.json` |
| 0018 Dependencies | Renovate (`unjs/renovate-config` preset), not Dependabot. Automerge depends on that preset |
| 0019 Vulnerabilities | No scanner, no SBOM |
| 0020 Adding a dependency | pnpm `allowBuilds` blocks install scripts. No explicit `minimumReleaseAge` |
| 0021 Build provenance | `publish.yml` publishes through OIDC (`id-token: write`), but `pnpm release` publishes from a workstation |
| 0022 Review and merge | `CODEOWNERS` names a single maintainer (`@pi0`), who merges outside contributors' PRs |
| 0024 Code scanning | Nothing set up |
| 0025 Tools outside the package manager | Nothing pinned, and the answer depends on 0011 and 0015 |
| 0026 Agent identity | Depends on 0022 and on who runs agents here |

**Proposed order:** Group 1 in the order above, then Group 2 by ADR number (0005 → 0026). One caveat: ADR-0009's check says to rule 0012 and 0018 with it or before it, or bot branches fail. Bringing 0012 and 0018 forward to just before 0009 would avoid that.

Should I go with this order, with the 0012/0018 tweak, or do you want a different order? (I don't have a question tool in this session, so just reply here.)
