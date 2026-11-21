### pinojs__pino.json cost=1.75 turns=39 subtype=success writes=[]
Now I'll read every ADR.
---
Now the repository evidence.
---
Still surveying: I've read all 25 ADRs and am now checking pino's files, CI and history before I sort them into groups.
---
I've read all 25 ADRs and surveyed the repository without writing anything. One note first: `AGENTS.md` asks me to run `npx -p @trivoallan/ontrack ontrack review`, but that command needs your approval, so I followed the review steps by hand. If you approve it, I'll run it and follow what it prints.

## Group 1: already answered by the repository (11)

The ruling would mostly record what pino already does.

| ADR | What the repo shows | Likely ruling |
|---|---|---|
| 0002 Localization | All docs, code, comments and commits are in English | `default: english`, as recommended |
| 0003 Architecture | A ~2.9k-line library (`pino.js`, `lib/`), not a service | `monolithic`, not the recommended `hexagonal` |
| 0004 Languages | CommonJS JavaScript (`"type": "commonjs"`) with hand-written `pino.d.ts` | `JavaScript`, not on the recommended list, with a reason |
| 0005 Validation | Options are checked by hand (`throw` in `pino.js`, `lib/levels.js`…), with no schema library | a hand-written check at the boundary, kept for performance and few dependencies |
| 0007 Tests | `borp --check-coverage --lines 95` in `package.json`, while `CONTRIBUTING.md` says 100% | `95` |
| 0010 Architecture docs | There is no architecture document or model | `none` |
| 0012 Delivery | Publishes to npm; `publish-release.yml` is `workflow_dispatch` with a version typed by hand | `package`, with `manual` as the release tool |
| 0013 Frontend | A library with no UI | `rejected` |
| 0014 Work tracking | `bugs.url` points to GitHub issues | `github-issues`, `pinojs/pino` |
| 0023 License | `"license": "MIT"` and a `LICENSE` file | `MIT` |
| 0026 Agent identity | The ADR is written for a repo kept by one person; pino has several maintainers | `rejected` |

## Group 2: needs a discussion (14)

| ADR | Why it needs a discussion |
|---|---|
| 0006 Commits | Conventional Commits are mostly followed but nothing enforces them; which scopes to allow (`deps`, `deps-dev`, `types`, `browser`, `transport`…) is your call |
| 0008 Documentation | The site uses **docsify** (served at `getpino.io` from `main`), and docsify is not one of the values the ADR accepts |
| 0009 Branching | GitHub flow and squash merges are visible; branch prefixes can't be seen because contributors work from forks |
| 0011 Forge & CI | CI exists, but whether a failing check blocks the merge is a GitHub setting I can't see; there is no workflow audit tool, and `target-main.yml` uses `pull_request_target` |
| 0015 Secrets | There is no guard against committing secrets; `.env` is gitignored |
| 0016 Changes | No change framework is used; the PR description is the only record of intent |
| 0017 Agent tooling | There are no agent settings, and `CONTRIBUTING.md` bans pull requests made entirely by AI |
| 0018 Dependencies | `dependabot.yml` was deleted on 2026-09-04 (#2517), but the Dependabot automerge job is still in `ci.yml` |
| 0019 Vulnerabilities | Only `dependency-review-action` runs on pull requests; there is no SBOM and no scheduled scan |
| 0020 Adding dependencies | CI installs with `--ignore-scripts`, but `.npmrc` sets `package-lock=false`, which conflicts with this ADR's fixed rule that the lockfile is committed |
| 0021 Build provenance | npm publishes with `id-token: write` but without `--provenance` |
| 0022 Review & merge | Several maintainers point to `peer`; the number of required approvals is unknown |
| 0024 Code scanning | Nothing scans the code today |
| 0025 Tools | Depends on what 0011 and 0015 name |

**Proposed order:** group 1 first, then group 2, each in ADR number order (0002 → 0026 within each group). Do you agree, or would you like another order? Any ADR can be skipped when we reach it.
