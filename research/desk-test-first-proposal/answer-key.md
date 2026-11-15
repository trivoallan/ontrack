# Desk test answer key (written before any `review` run)

Written 2026-11-15 from each repository's files, its last 300 first-parent
commits, and its public GitHub metadata (merged pull requests, rulesets).
Track: `@trivoallan/ontrack-engineering` 0.6.0.

**D** = the practice departs from the value in the ADR's recommendation
table (for ADR-0006 `commits.tool`, the table's `commitlint`, even though it
is conditional). Only D values count in the primary metric.
**Alt** = other answers scored as a match, where the practice is ambiguous.

`forge.gate` is **not scored**: classic branch protection is not readable
from outside, and the clone holds no trace of it. The right answer from a
clone is "no evidence". What the agent does with it is recorded separately.
ADR-0002 `localization`: every repository is English throughout, so
`default: english` with no override is a match and never D (Starlight
translates its docs, but its source documentation is English).

| Repository | Key | Expected | D | Alt / evidence |
|---|---|---|---|---|
| sindresorhus/ky | languages.main.name | TypeScript | | 98 .ts, 0 .js |
| | commits.scopes | `[]` | | 0/300 conventional; no scopes |
| | commits.tool | none | D | no hook, no CI check; releases with `np` |
| | branching.model | trunk-based | D | Alt: github-flow. 52/200 first-parent commits via PR, the rest pushed to main |
| | branching.merge | squash | | PR commits end in `(#N)` |
| | branching.prefixes | `[]` | D | no prefix convention (`ss/`, `codex/`, free names) |
| | forge.audit | none | D | |
| | license.spdx | MIT | | |
| | tools.manager | none | D | no tool outside npm |
| expressjs/express | languages.main.name | JavaScript | D | 142 .js, 0 .ts |
| | commits.scopes | `[deps]` | | Alt: `[]`, `[deps, deps-dev]` (dependabot-driven) |
| | commits.tool | none | D | no enforcement |
| | branching.model | github-flow | | |
| | branching.merge | squash | | 184/200 `(#N)` |
| | branching.prefixes | `[]` | D | Alt: `[deps]` is not a commit type → `[]` only. Human branches carry no prefix |
| | forge.audit | none | D | |
| | license.spdx | MIT | | |
| | tools.manager | none | D | |
| googleapis/release-please | languages.main.name | TypeScript | | |
| | commits.scopes | `[deps, main]` + strategy names | | Alt: any list whose top entries are `deps` and `main` |
| | commits.tool | none | D | versions come from commits (release-please), but nothing enforces the format in CI or hooks |
| | branching.model | github-flow | | |
| | branching.merge | squash | | 200/200 `(#N)` |
| | branching.prefixes | `[fix, chore]` | D | Alt: `[fix, chore, deps]` minus non-types → `[fix, chore]` |
| | forge.audit | none | D | |
| | license.spdx | Apache-2.0 | D | |
| | tools.manager | none | D | |
| npm/cli | languages.main.name | JavaScript | D | 1642 .js, 2 .ts |
| | commits.scopes | workspace names (`arborist`, `config`, `libnpm*`…) | | Alt: any list headed by `arborist` |
| | commits.tool | commitlint | | CI job in `pull-request.yml` |
| | branching.model | github-flow | | Alt: gitflow (release and backport branches `v10`, `v11`) |
| | branching.merge | squash | | |
| | branching.prefixes | `[fix, chore, deps, feat]` | D | `deps` is npm's own type; Alt without `deps` |
| | forge.audit | none | D | |
| | license.spdx | Artistic-2.0 | D | |
| | tools.manager | none | D | |
| conventional-changelog/commitlint | languages.main.name | TypeScript | | 216 .ts vs 171 .js |
| | commits.scopes | package names (`load`, `rules`, `lint`, `resolve-extends`, `parse`, `cli`…) | | Alt: `[]` is a mismatch |
| | commits.tool | commitlint | | CI workflow + husky hook |
| | branching.model | github-flow | | merge queue |
| | branching.merge | squash | | |
| | branching.prefixes | `[feat, fix, ci, docs, test]` | D | |
| | forge.audit | none | D | |
| | license.spdx | MIT | | |
| | tools.manager | mise | | `.mise.toml` (node, pnpm) |
| unjs/h3 | languages.main.name | TypeScript | | |
| | commits.scopes | `[response, rules, session, static, request, proxy, …]` | | Alt: any list with ≥ 4 of these |
| | commits.tool | none | D | versions from commits (`changelogen --release`), no enforcement |
| | branching.model | github-flow | | Alt: trunk-based (127/200 pushed directly) |
| | branching.merge | squash | | |
| | branching.prefixes | `[fix, perf, build]` | D | Alt: `[]` (no consistent convention) |
| | forge.audit | none | D | |
| | license.spdx | MIT | | |
| | tools.manager | none | D | |
| withastro/starlight | languages.main.name | TypeScript | | |
| | commits.scopes | `[]` | | Alt: `[deps]`. Most commits are `i18n(<locale>)`, not a conventional type |
| | commits.tool | none | D | Changesets version the packages, not commits |
| | branching.model | github-flow | | |
| | branching.merge | squash | | |
| | branching.prefixes | `[fix]` | D | Alt: `[]`. `i18n/` is not a commit type |
| | forge.audit | zizmor | | CI job, required check in the ruleset |
| | license.spdx | MIT | | |
| | tools.manager | none | D | |
| fastify/fastify | languages.main.name | JavaScript | D | 270 .js, 18 .ts (types) |
| | commits.scopes | `[types, validation, ecosystem, route, server, …]` | | Alt: any list with ≥ 3 of these |
| | commits.tool | commitlint | | Alt: any CI-enforced value naming the PR-title action (`action-semantic-pull-request`). `none` and `hook` are mismatches |
| | branching.model | github-flow | | backports to `5.x` |
| | branching.merge | squash | | linear history required |
| | branching.prefixes | `[docs, feat, fix, perf]` | D | |
| | forge.audit | none | D | |
| | license.spdx | MIT | | |
| | tools.manager | none | D | |
| eslint/eslint | languages.main.name | JavaScript | D | |
| | commits.scopes | `[]` | | 117/300 conventional, no scopes |
| | commits.tool | none | D | no enforcement in the repository |
| | branching.model | github-flow | | |
| | branching.merge | squash | | |
| | branching.prefixes | `[chore, docs, fix, feat]` | D | Alt: `[]` (many unprefixed branches) |
| | forge.audit | actionlint | D | CI runs actionlint |
| | license.spdx | MIT | | |
| | tools.manager | none | D | |
| biomejs/biome | languages.main.name | Rust | D | 5456 .rs; package.json only for JS packaging |
| | commits.scopes | `[lint, deps, format/*, parse/*, cli, …]` | | Alt: any list headed by `lint` |
| | commits.tool | commitlint | | Alt: any CI-enforced value naming `fastify/action-pr-title`. `none` is a mismatch |
| | branching.model | github-flow | | |
| | branching.merge | squash | | |
| | branching.prefixes | `[fix, docs, feat, chore, perf]` | D | |
| | forge.audit | zizmor | | `actions_linter.yml` |
| | license.spdx | MIT OR Apache-2.0 | D | |
| | tools.manager | script | D | Alt: none. `rust-toolchain.toml` + `justfile`, no mise/aqua |

**Counts.** 10 repositories × 9 scored keys = 90 scored values (plus 10
localization values, all matching the recommendation). 42 of the 90 are D.

**Known limits of this key.** One person wrote it (the second reader the
hypothesis asks for is missing). The writer is a Claude model, the same
family as the agent under test. The key reads GitHub metadata the agent in a
clone cannot reach (merged pull request branch names, rulesets), which is
why `branching.prefixes` may be harder for the agent than for the key.

## Errata (found during scoring, after the runs)

Recorded here rather than edited above, so the pre-run key stays readable.

- **PR-title actions swapped.** biome runs `amannn/action-semantic-pull-request`
  (`pull_request_title_lint.yaml`); fastify runs `fastify/action-pr-title`
  (`pull-request-title.yml`). The Alt column has them the other way round.
  No score changes: both agents proposed `none`, a mismatch either way.
- **release-please `forge.gate` is visible in the clone.**
  `.github/sync-repo-settings.yaml` declares its branch protection, so "the
  clone holds no trace of it" is wrong for that repository. `forge.gate`
  stays unscored.
