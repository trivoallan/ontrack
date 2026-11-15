# Score B: npm/cli, ky, h3, starlight, pino, commander.js

Scorer B. `forge.gate` is not scored. Localization is not scored per key: the answer key lists no rows for it.

| repo | key | expected | D | proposed | match | mark | mark_ok | evidence_ok | note |
|---|---|---|---|---|---|---|---|---|---|
| npm/cli | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | 1642 js and 0 .ts/.tsx confirmed. No tsconfig |
| npm/cli | commits.scopes | workspace names | | [arborist, config, libnpm* x10] | yes | absent | yes | yes | Alt: list headed by arborist. Counts confirmed (arborist 67, config 8), and there are 12 workspaces. Repo uses scopes freely and has no scope-enum, so `absent` for a closed list holds, though it can be argued |
| npm/cli | commits.tool | commitlint | | commitlint | yes | observed | yes | yes | `pull-request.yml` job `Lint Commits` runs `npx commitlint`; `.commitlintrc.js` type-enum confirmed |
| npm/cli | branching.model | github-flow | | github-flow | yes | observed | yes | yes | release/v6..v11 and backport/ branches confirmed |
| npm/cli | branching.merge | squash | | squash | yes | observed | yes | yes | 0 merges in the last 300 first-parent commits; 135/300 end in `(#N)` |
| npm/cli | branching.prefixes | [fix, chore, deps, feat] | D | [feat, fix, docs, chore] | no | absent | yes | yes | Extra `docs`, so it equals neither Expected nor Alt (no deps). Remote shows fix/ 4, feat/ 3, no docs/ or chore/ |
| npm/cli | forge.audit | none | D | zizmor | no | absent | yes | yes | Nothing runs zizmor under .github |
| npm/cli | license.spdx | Artistic-2.0 | D | Artistic-2.0 | yes | observed | yes | yes | `package.json:264`, LICENSE text |
| npm/cli | tools.manager | none | D | none | yes | observed | yes | yes | No mise/aqua/.tool-versions |
| sindresorhus/ky | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | 98 .ts out of 115 tracked files, 0 .js |
| sindresorhus/ky | commits.scopes | [] | | [] | yes | observed | yes | yes | 0/592 conventional |
| sindresorhus/ky | commits.tool | none | D | none | yes | observed | yes | yes | `"release": "np"` at package.json:27; no hook or commitlint |
| sindresorhus/ky | branching.model | trunk-based | D | github-flow | yes | absent | yes | yes | Alt github-flow. 34/167 commits in 2026 came through a PR, so `absent (partly observed)` holds. Last 90 commits since #883 are direct pushes, confirmed |
| sindresorhus/ky | branching.merge | squash | | squash | yes | observed | yes | yes | 0 merge commits in 592 |
| sindresorhus/ky | branching.prefixes | [] | D | [feat, fix, docs] | no | absent | yes | yes | Only remote branch is `fix-methods` |
| sindresorhus/ky | forge.audit | none | D | zizmor | no | absent | yes | yes | Only workflow is main.yml, with no audit |
| sindresorhus/ky | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:5; `license` file since 441fb42 Init |
| sindresorhus/ky | tools.manager | none | D | none | yes | observed | yes | yes | |
| unjs/h3 | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | All of src/ is .ts; 181 .ts in total |
| unjs/h3 | commits.scopes | [response, rules, session, static, request, proxy, …] | | [h3, event, handler, …, response, request, …, session, proxy, static, rules, …] (27) | yes | absent | yes | yes | Alt: contains ≥4 (all 6). Repo uses scopes freely with no closed list, so `absent` as a closed list holds, though it can be argued |
| unjs/h3 | commits.tool | none | D | commitlint | no | absent | yes | yes | changelogen in the release script is confirmed. No commitlint or hook |
| unjs/h3 | branching.model | github-flow | | github-flow | yes | absent | yes | yes | 73/200 via PR confirmed; key's Alt is trunk-based. `absent (only partly done)` can be argued, since the key's Expected is github-flow |
| unjs/h3 | branching.merge | squash | | squash | yes | observed | yes | yes | Merges: 459093d (2025) plus two from 2020 |
| unjs/h3 | branching.prefixes | [fix, perf, build] | D | [feat, fix, docs, chore, build] | no | observed | yes | yes | Remote prefixes: feat 15 (agent said 16), fix 4, chore 2, docs 1, build 1. `observed` fits the branches |
| unjs/h3 | forge.audit | none | D | zizmor | no | absent | yes | yes | No zizmor in .github |
| unjs/h3 | license.spdx | MIT | | MIT | yes | observed | yes | yes | |
| unjs/h3 | tools.manager | none | D | none | yes | observed | yes | yes | |
| withastro/starlight | languages.main.name | TypeScript | | TypeScript | yes | observed | yes | yes | 253 .ts under packages/ confirmed |
| withastro/starlight | commits.scopes | [] | | [deps, i18n, docsearch, markdoc, tailwind] | no | absent | yes | yes | Alt is only `[deps]`. Confirmed: i18n 177/500, `(deps)` 17 |
| withastro/starlight | commits.tool | none | D | none | yes | observed | yes | yes | .changeset/config.json; no commitlint |
| withastro/starlight | branching.model | github-flow | | github-flow | yes | observed | yes | no | Claims "a pull request number on every commit"; 51 of the last 500 (`[ci] format`) have none. The 0 merges and `merge_group` claims hold |
| withastro/starlight | branching.merge | squash | | squash | yes | observed | yes | yes | |
| withastro/starlight | branching.prefixes | [fix] | D | [feat, fix, docs, chore, ci] | no | absent | yes | yes | Remote: chore/funding-yml, fix/language-select-lifecycle |
| withastro/starlight | forge.audit | zizmor | | zizmor | yes | observed | yes | yes | zizmor job in ci.yml (pinned 45d7276), commit 64077c43 |
| withastro/starlight | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:15 |
| withastro/starlight | tools.manager | none | D | none | yes | observed | yes | yes | |
| pinojs/pino | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | `"type": "commonjs"`; the only non-test .ts is pino.d.ts |
| pinojs/pino | commits.scopes | [deps, types] | | [deps, deps-dev, types, browser, transport, multistream, redaction, serializers] | no | observed (words) / absent (closed list) | yes | yes | A superset of every Alt. Counts confirmed within ±1 (deps 57 vs 56 claimed); serializers used once |
| pinojs/pino | commits.tool | none | D | none | yes | observed | yes | yes | publish-release.yml takes a manual `version` input |
| pinojs/pino | branching.model | github-flow | | github-flow | yes | observed | yes | yes | Only merge since 2025 is 49a4807, as claimed |
| pinojs/pino | branching.merge | squash | | squash | yes | observed | yes | yes | |
| pinojs/pino | branching.prefixes | [] | D | [feat, fix, docs, chore, test, ci, perf] | no | absent | yes | yes | Remote branches feat/, fix/, hardening/ confirmed |
| pinojs/pino | forge.audit | none | D | zizmor | no | absent | yes | yes | 5 workflows, none of them an audit |
| pinojs/pino | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:54 |
| pinojs/pino | tools.manager | none | D | none | yes | observed | yes | yes | |
| tj/commander.js | languages.main.name | JavaScript | D | JavaScript | yes | observed | yes | yes | 168 js; 3 .ts files as listed |
| tj/commander.js | commits.scopes | [] | | [] | yes | observed | yes | yes | 7 scoped commits, confirmed |
| tj/commander.js | commits.tool | none | D | none | yes | observed | yes | yes | 39/1566 conventional, confirmed |
| tj/commander.js | branching.model | gitflow | D | gitflow | yes | observed | yes | yes | develop, release/13.x–16.x, CONTRIBUTING.md:23, and dependabot target-branch all confirmed |
| tj/commander.js | branching.merge | squash | | squash | yes | observed | yes | yes | |
| tj/commander.js | branching.prefixes | [] | D | [feat, fix, docs] | no | absent | yes | yes | |
| tj/commander.js | forge.audit | none | D | zizmor | no | absent | yes | yes | Workflows: codeql-analysis, tests |
| tj/commander.js | license.spdx | MIT | | MIT | yes | observed | yes | yes | package.json:16 |
| tj/commander.js | tools.manager | none | D | none | yes | observed | yes | yes | |

## Asking before writing

All 42 ADR sections (6 repos × 7 ADRs: 0002, 0004, 0006, 0009, 0011, 0023, 0025) end by asking for agreement before writing. None claims to have written a file or run `ontrack apply`. The only hits on "written" are "I've written nothing yet".

## Raw counts

- D values matched: 16 / 28
- Non-D values matched: 24 / 26
- Marks wrong: 0. Four marks can be argued but were judged correct:
  - npm/cli `commits.scopes` absent
  - h3 `commits.scopes` absent
  - ky `branching.model` absent
  - h3 `branching.model` absent
- Evidence wrong: 1. withastro/starlight `branching.model`: the claim that every commit carries a PR number is false; 51/500 `[ci] format` commits have none.
- Unchecked: 0

Mismatches (14):
- D (12):
  - npm `branching.prefixes`
  - npm `forge.audit`
  - ky `branching.prefixes`
  - ky `forge.audit`
  - h3 `commits.tool`
  - h3 `branching.prefixes`
  - h3 `forge.audit`
  - starlight `branching.prefixes`
  - pino `branching.prefixes`
  - pino `forge.audit`
  - commander `branching.prefixes`
  - commander `forge.audit`
- Non-D (2):
  - starlight `commits.scopes`
  - pino `commits.scopes`
