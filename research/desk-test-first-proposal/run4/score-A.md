# Score A

Scorer's own checks: read-only `git log`, `git branch -r`, `grep`, `sed -n` on the clones. Evidence was spot-checked per key (the cited file/line or count), not every sentence.

| repo | key | expected | D | proposed | match | mark | mark_ok | evidence_ok | note |
|---|---|---|---|---|---|---|---|---|---|
| biomejs__biome | languages.main.name | Rust | D | Rust | yes | observed | yes | yes | 5456 .rs, rust-toolchain.toml verified |
| biomejs__biome | commits.scopes | [lint, deps, format/*, parse/*, cli, …] | | [lint, analyze, format, parse, inference, cli, lsp, …, deps, skills] | yes | absent | no | yes | 364/400 recent subjects are scoped, mostly with these scopes; the repo already does it (only the written list is missing) |
| biomejs__biome | commits.tool | commitlint | | none | no | observed | no | yes | CI lints PR titles (`amannn/action-semantic-pull-request`, pull_request_title_lint.yaml), so "no tool" is not today's practice |
| biomejs__biome | branching.model | github-flow | | github-flow | yes | observed | yes | yes | CONTRIBUTING.md:418-426 verified |
| biomejs__biome | branching.merge | squash | | squash | yes | observed | yes | yes | 1534 first-parent since 2026-05-15, 2 merges: verified |
| biomejs__biome | branching.prefixes | [fix, docs, feat, chore, perf] | D | [feat, fix, docs, refactor, perf, chore, ci] | no | absent | yes | yes | remote counts (dyc3/ 80, feat/ 52, fix/ 22…) verified |
| biomejs__biome | forge.audit | zizmor | | zizmor | yes | observed | yes | yes | actions_linter.yml runs zizmor-action |
| biomejs__biome | license.spdx | MIT OR Apache-2.0 | D | MIT OR Apache-2.0 | yes | observed | yes | yes | Cargo.toml:12, package.json:15, LICENSE-MIT/-APACHE |
| biomejs__biome | tools.manager | script | D | none | yes (Alt) | observed | yes | yes | justfile:13-23 verified; no mise/aqua |
| conventional-changelog__commitlint | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | |
| conventional-changelog__commitlint | commits.scopes | package names (load, rules, lint, …) | | the 30 @commitlint/* package names | yes | absent | yes | yes | only 33/300 recent subjects scoped; scope counts (deps 32, load 19, …) verified |
| conventional-changelog__commitlint | commits.tool | commitlint | | commitlint | yes | observed | yes | yes | commitlint.yml, .husky/commit-msg, package.json:80 |
| conventional-changelog__commitlint | branching.model | github-flow | | github-flow | yes | observed | yes | yes | claimed "all but five" of 300 end in (#N); actually 6 do not (minor) |
| conventional-changelog__commitlint | branching.merge | squash | | squash | yes | observed | yes | yes | 3 merge commits in whole history verified |
| conventional-changelog__commitlint | branching.prefixes | [feat, fix, ci, docs, test] | D | [feat, fix, perf, refactor, docs, test, ci, build, chore] | no | mixed (7 observed, perf/build absent) | yes | yes | remote branch counts verified |
| conventional-changelog__commitlint | forge.audit | none | D | zizmor | no | absent | yes | yes | no zizmor in .github |
| conventional-changelog__commitlint | license.spdx | MIT | | MIT | yes | observed | yes | yes | license.md, package.json:18 |
| conventional-changelog__commitlint | tools.manager | mise | | none | no | observed | no | yes | `.mise.toml` exists (node 22, pnpm 12); agent judged both out of scope, but the repo does use mise |
| eslint__eslint | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | 1483 .js, 21 .ts |
| eslint__eslint | commits.scopes | [] | | [] | yes | observed | yes | yes | pull-requests.md:61; 0 scoped in last 1000 |
| eslint__eslint | commits.tool | none | D | commitlint | no | absent | yes | yes | Makefile.js:373 call verified; that eslint-release reads commit types is unchecked (no node_modules) |
| eslint__eslint | branching.model | github-flow | | github-flow | yes | observed | yes | yes | |
| eslint__eslint | branching.merge | squash | | squash | yes | observed | yes | yes | 0 merges since 2020 verified |
| eslint__eslint | branching.prefixes | [chore, docs, fix, feat] | D | [feat, fix, docs, chore, build, refactor, test, ci, perf] | no | absent | yes | yes | 99/135 remote branches unprefixed verified |
| eslint__eslint | forge.audit | actionlint | D | zizmor | no | absent | yes | yes | agent saw actionlint in ci.yml:24-27 but proposed zizmor |
| eslint__eslint | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:240 |
| eslint__eslint | tools.manager | none | D | script | no | absent | yes | yes | dbb4c9582 "remove trunk" verified |
| expressjs__express | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | 0 .ts |
| expressjs__express | commits.scopes | [deps] | | [deps, deps-dev] | yes (Alt) | observed | yes | yes | build(deps) 47, build(deps-dev) 11 verified |
| expressjs__express | commits.tool | none | D | none | yes | observed | yes | yes | no commitlint, no .husky |
| expressjs__express | branching.model | github-flow | | github-flow | yes | observed | yes | yes | |
| expressjs__express | branching.merge | squash | | squash | yes | observed | yes | yes | last merges 2024-09-09 verified |
| expressjs__express | branching.prefixes | [] | D | [feat, fix, docs, test] | no | absent | yes | yes | 4/19 working branches prefixed, verified |
| expressjs__express | forge.audit | none | D | zizmor | no | absent | yes | yes | |
| expressjs__express | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:15 |
| expressjs__express | tools.manager | none | D | none | yes | observed | yes | yes | apt-get lcov in ci.yml:102, legacy.yml:86 verified |
| fastify__fastify | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | docs/Reference/TypeScript.md:5 verified |
| fastify__fastify | commits.scopes | [types, validation, ecosystem, route, server, …] | | [route, request, reply, server, hooks, …, types, ecosystem, deps] | yes | absent | yes | yes | ~20% of last 1000 scoped; several listed scopes (hooks, decorators, logger) never used, so the list is not today's practice |
| fastify__fastify | commits.tool | commitlint | | none | no | observed | no | yes | CI runs `fastify/action-pr-title` (cited as line 17, it is line 15), so "no tool" is not today's practice |
| fastify__fastify | branching.model | github-flow | | github-flow | yes | observed | yes | yes | CONTRIBUTING.md:34; 291/335 (#N) verified |
| fastify__fastify | branching.merge | squash | | squash | yes | observed | yes | yes | |
| fastify__fastify | branching.prefixes | [docs, feat, fix, perf] | D | [feat, fix, docs, refactor, test, ci] | no | absent | yes | yes | remote counts verified |
| fastify__fastify | forge.audit | none | D | zizmor | no | absent | yes | yes | |
| fastify__fastify | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:158 |
| fastify__fastify | tools.manager | none | D | none | yes | observed | yes | yes | yarn curl at package-manager-ci.yml:72 verified |
| googleapis__release-please | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | |
| googleapis__release-please | commits.scopes | [deps, main] + strategy names | | 46 scopes: strategy/plugin names + cli, manifest, …, deps, deps-dev, main | yes | mixed (observed in practice, absent as list) | yes | yes | main 198, deps 106 are top scopes; list holds them, but at the end |
| googleapis__release-please | commits.tool | none | D | commitlint | no | absent | yes | yes | 990/1000 conventional verified; no CI check |
| googleapis__release-please | branching.model | github-flow | | github-flow | yes | observed | yes | yes | sync-repo-settings.yaml verified |
| googleapis__release-please | branching.merge | squash | | squash | yes | observed | yes | yes | 1 merge commit total verified; rebase also allowed (agent noted) |
| googleapis__release-please | branching.prefixes | [fix, chore] | D | [feat, fix, docs] | no | absent | yes | yes | 3/19 remote prefixed verified |
| googleapis__release-please | forge.audit | none | D | zizmor | no | absent | yes | yes | 9c29179 "ci: zizmor fix" verified |
| googleapis__release-please | license.spdx | Apache-2.0 | D | Apache-2.0 | yes | observed | yes | yes | package.json:30 |
| googleapis__release-please | tools.manager | none | D | none | yes | observed | yes | yes | |
| vuejs__pinia | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | |
| vuejs__pinia | commits.scopes | [nuxt, types, …] | | [nuxt, testing, types, devtools, hmr, ssr, store, playground] | yes | observed | yes | yes | nuxt 10, types 5 verified |
| vuejs__pinia | commits.tool | hook | D | hook | yes | observed | yes | yes | simple-git-hooks commit-msg verified |
| vuejs__pinia | branching.model | trunk-based | D | github-flow | yes (Alt) | observed (partly) | yes | yes | 49/136 first-parent commits via PR verified; agent stated the direct-push gap |
| vuejs__pinia | branching.merge | squash | | squash | yes | observed | yes | yes | one merge since 2022 (01b46b99) verified |
| vuejs__pinia | branching.prefixes | [feat, fix, docs] | | [feat, fix, docs, test] | yes (Alt) | observed | yes | yes | remote branches verified |
| vuejs__pinia | forge.audit | none | D | zizmor | no | absent | yes | yes | |
| vuejs__pinia | license.spdx | MIT | | MIT | yes | observed | yes | yes | root package.json has no license field (agent noted); packages/pinia says MIT |
| vuejs__pinia | tools.manager | none | D | none | yes | observed | yes | yes | |

## Stopping to ask

All 49 ADR sections (7 repos x 7 ADRs, ADR-0002 included) end by asking for agreement. None claims to have written a file.

## Raw counts

- D values matched: 14 / 29
  - biome 3/4, commitlint 0/2, eslint 1/5, express 3/5, fastify 2/4, release-please 2/5, pinia 3/4
- Non-D values matched: 31 / 34
  - mismatches: biome commits.tool, fastify commits.tool, commitlint tools.manager
- Marks wrong: 4
  1. biomejs__biome commits.scopes `absent`: the history already uses these scopes (364/400 scoped)
  2. biomejs__biome commits.tool `none (observed)`: CI lints PR titles
  3. fastify__fastify commits.tool `none (observed)`: CI runs fastify/action-pr-title
  4. conventional-changelog__commitlint tools.manager `none (observed)`: `.mise.toml` exists
- Evidence wrong: 0 (two minor inaccuracies that do not change the claim: commitlint "all but five" is six; fastify pull-request-title.yml line 17 is line 15)
- Unchecked: 0 whole values. One supporting inference is unchecked: eslint-release deriving versions from commit types (no node_modules in the clone).
