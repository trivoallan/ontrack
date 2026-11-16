### honojs__hono.json cost=1.91 turns=45 subtype=success writes=[]
I'll start by following the project rule: run the ontrack review command and see what it says.
---
The `ontrack review` command needs approval I don't have, so I'll survey the ADR files directly.
---
I'll read the remaining ADRs with the Read tool.
---
Now the repository itself: manifest, CI, history.
---
Survey nearly done; one last check on where Hono's user documentation lives, then I'll present the grouping.
---
I couldn't run `ontrack review`: it needs your approval. So I read all 25 proposed ADRs directly, plus the manifest, CI workflows, maintainer docs and git history. Nothing has been written.

## Survey

### Group 1: this repository already answers these (10)

| ADR | What the repository does today |
|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English → `default: english` |
| 0004 Languages | 399 `.ts`, 32 `.tsx` and 27 `.mts` files; the library is written in TypeScript → `TypeScript` |
| 0007 Tests | `codecov.yml` sets a project target of 75%, and CI uploads coverage → a number exists, though it is 75 rather than 90 |
| 0010 Architecture documentation | No arc42, no model, no architecture document → `none` across the board |
| 0012 Delivery | npm package published from `release.yml` on `v*` tags, with versions set by hand (`np --no-publish`); also published to JSR; no image, no manifests. `release_notes` is the only open point |
| 0013 Frontend | A framework library with no UI application → likely `rejected` (`hono/jsx` is a product feature, not a frontend of this repository) |
| 0014 Work tracking | GitHub issue templates; CONTRIBUTING says "Issues instead of Pull Requests" → `github-issues`, `honojs/hono` |
| 0016 Changes | No OpenSpec and no change framework; intent lives in PRs and issues → `none` |
| 0021 Build provenance | `npm stage publish --provenance` from GitHub Actions with OIDC → level `2` |
| 0023 License | `"license": "MIT"` and an MIT `LICENSE` file → `MIT` |

### Group 2: these need a discussion (15)

| ADR | Why it needs a discussion |
|---|---|
| 0003 Architecture | A router/middleware framework doesn't fit the enum neatly (`monolithic`? `layered`?) |
| 0005 Validation | Hono ships its own validator and only uses zod in tests; you need to decide what "boundary" means for a framework |
| 0006 Commits | Conventional Commits are used with about 40 scopes and no enforcement tool. You need to pick the closed scope list |
| 0008 Documentation | User docs live on hono.dev, in a different repository; `docs/` holds contributor notes |
| 0009 Branching | Squash merges and GitHub flow are visible in history, but branch prefixes can't be seen locally |
| 0011 Forge and CI | GitHub CI exists and actions are SHA-pinned, but the ruleset (blocking or not) isn't visible and there is no zizmor |
| 0015 Secrets | No guard and no secret storage convention |
| 0017 Agent tooling | No `.claude/`, `opencode.json` or Copilot settings |
| 0018 Dependencies | No Dependabot or Renovate configuration |
| 0019 Vulnerabilities | No scanner and no SBOM |
| 0020 Adding a dependency | `allowBuilds` explicitly blocks install scripts (observed), but who approves new dependencies is open |
| 0022 Review and merge | Several maintainers, PRs limited to maintainers; the ruleset isn't visible |
| 0024 Code scanning | No CodeQL or Semgrep |
| 0025 Tools | `.tool-versions` pins the runtimes; `bombardier` is fetched by `wget` without a checksum |
| 0026 Agent identity | Written for a single-maintainer repository, and Hono has several maintainers |

**Proposed order:** Group 1 first (0002, 0004, 0007, 0010, 0012, 0013, 0014, 0016, 0021, 0023), then Group 2 in number order (0003, 0005, 0006, 0008, 0009, 0011, 0015, 0017, 0018, 0019, 0020, 0022, 0024, 0025, 0026).

None of these has to be ruled now: the repository works with all of them open. Do you agree to this order, or would you prefer another? Once you confirm, I'll present the ruling for ADR-0002 (Localization).
