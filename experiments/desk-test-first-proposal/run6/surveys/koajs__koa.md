### koajs__koa.json cost=1.83 turns=40 subtype=success writes=[]
I'll start by running the ontrack review command the project rules call for, and look at the ADR files.
---
The `ontrack review` command needs approval I don't have, so I'll survey by reading the files directly.
---
Now reading all the ADRs, starting with 0001 for format context and the first several.
---
Still surveying: I've read ADRs 0001–0020 and have six left (0021–0026), then I'll inspect the repo itself.
---
Now the repository's own files, configuration, CI and history.
---
The survey is done. I read all 25 proposed ADRs, plus ADR-0001, and looked at the repository's files, CI and history. I haven't written anything. I couldn't run `ontrack review`, which AGENTS.md says to use, because the call needs an approval I don't have, so I read the files directly.

**What the repository is:** Koa, a public JavaScript (CommonJS) web framework. It ships as the npm package `koa` 3.3.0 under MIT, published by `.github/workflows/npm-publish.yml` when a tag is pushed. Its CI is `node.js.yml`: lint, tests with c8 coverage, and an upload to Codecov. Dependabot watches npm and GitHub Actions. It has no `.claude/`, `.npmrc`, commitlint, gitleaks, CodeQL workflow or OpenSpec.

## Group 1: the repository already answers these

Every value below is written in a file or in configuration.

| ADR | What the files show |
| --- | --- |
| 0002 Localization | Code, comments, docs and commits are all in English |
| 0003 Architecture | One package, `lib/application.js` plus context, request and response; no ports or adapters |
| 0004 Languages | JavaScript (`package.json`, `lib/*.js`). It isn't in the recommended list, so the ruling needs a justification |
| 0005 Validation | Hand-written checks at the boundaries; no schema library and no data files |
| 0010 Architecture docs | No architecture document, model or diagrams |
| 0013 Frontend | No user interface, so the answer is `rejected` |
| 0014 Work tracking | `"repository": "koajs/koa"`, and the Readme refers to GitHub issues |
| 0015 Secrets | No local secrets (no `.env`) and no guard |
| 0016 Changes | No change framework |
| 0017 Agent tooling | No agent host settings are committed, which means `[]` |
| 0018 Dependencies | `.github/dependabot.yml`; no automerge workflow |
| 0023 License | `"license": "MIT"` and `LICENSE` |
| 0025 Tools | No tool outside the package manager, which means `none` |

## Group 2: these need a discussion

| ADR | The value that isn't in the repository, and where it lives |
| --- | --- |
| 0006 Commits | `scopes` would come only from history (`response`, `deps`, `deps-dev`) |
| 0007 Tests | `coverage_target`: `.codecov.yml` sets no target and c8 has no threshold, so any target is a Codecov project setting |
| 0008 Documentation | `docs.tool`: the homepage `koajs.com` is a site built in another repository |
| 0009 Branching | `model` and `merge` are GitHub repository settings. The `(#NNNN)` subjects suggest squash, but only from history. `prefixes` would come from branch names |
| 0011 Forge and CI | `forge.gate` is set by the default branch's ruleset on GitHub |
| 0012 Delivery | `release_notes` are written on the GitHub releases page, as History.md says. `release_tool` is `np`, run on a maintainer's machine according to History.md |
| 0019 Vulnerabilities | `scanner` might be `github` if Dependabot alerts are on, which is a repository setting |
| 0020 Adding dependencies | `approver` is a people policy that no file records |
| 0021 Build provenance | The workflow says "trusted publishing with provenance", but the trusted-publisher link is set on npmjs.com |
| 0022 Review and merge | Who can approve, and the ruleset, are on GitHub (koajs org, many maintainers) |
| 0024 Code scanning | CodeQL default setup, if it's on, is a repository setting |
| 0026 Agent identity | The number of maintainers comes from org membership and history. This ADR excludes repositories with several maintainers |

## Proposed order

Group 1 then Group 2, in list order, with three moves required by the ADRs themselves:

1. **Move 0025 to the very end.** Its `none` fails once 0011 or 0015 names a tool.
2. **Take 0012 first in Group 2.** 0009 asks for 0012 and 0018 to be ruled with it or before it. 0008, 0019 and 0021 also read `delivery.target`.
3. **Take 0026 just before 0022.** Ruling `own` would force `review.by: peer` in the same commit.

That gives: 0002, 0003, 0004, 0005, 0010, 0013, 0014, 0015, 0016, 0017, 0018, 0023, then 0012, 0006, 0007, 0008, 0009, 0011, 0019, 0020, 0021, 0026, 0022, 0024, and 0025 last.

Do you agree with this order, or do you want a different one? Once you confirm, I'll present the proposed ruling for the first ADR.
