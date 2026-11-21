### tj__commander.js.json cost=1.75 turns=39 subtype=success writes=[]
I'm reading the ADRs one by one first; I'll send you the survey when I'm done.
---
I've read all 25 ADRs. Next I'm looking through the repository's files, CI and history to sort them into groups.
---
Before the survey, two things:

- **The command AGENTS.md asks for didn't run.** `npx -p @trivoallan/ontrack ontrack review` needs your approval. I worked from the ADR files and the repository itself instead. If you approve the command, I'll follow its output too.
- **This repository is a clone of `tj/commander.js`.** Its history, CI and contributing rules belong to that project and its maintainers, mainly John Gee and Abe Tomoaki, plus Dependabot. "What the repository does today" below means what commander.js does.

## Survey of the 25 open ADRs (nothing written yet)

### Group 1: the repository already answers these

| ADR | What the repository shows | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, docs and commits are in English. `Readme_zh-CN.md` is a translation, not a separate language choice. | `default: english` |
| 0003 Architecture | A single package of classes under `lib/`, with no I/O layers. | `monolithic` (the ADR itself says this fits a repository that isn't a service) |
| 0004 Languages | `"type": "module"` JavaScript, type-checked with `tsc -p tsconfig.js.json`, plus hand-written `typings/index.d.ts` | `JavaScript`, with a written justification |
| 0008 Documentation | No site: the `gh-pages` branch was last updated in 2015. Pages live in `docs/` and the README. | `tool: none`, `root: docs/`, `audience: public` |
| 0010 Architecture docs | No architecture document, model or diagrams | `none` / `none` / `none` |
| 0012 Delivery | An npm package (`files` in package.json). Version bumps are done by hand (commit `15.1.0`) and CHANGELOG.md is written by hand. There is no publish workflow. | `package`, `manual`, … |
| 0013 Frontend | A command-line parsing library with no user interface | `rejected` |
| 0014 Work tracking | GitHub issues; CONTRIBUTING.md says to open an issue first | `github-issues`, `tj/commander.js` |
| 0015 Secrets | No secrets are handled and there is no guard | `none` / `none` |
| 0017 Agent tooling | No `.claude/` and no `opencode.json` | `[]` |
| 0018 Dependencies | `.github/dependabot.yml` exists; no automerge workflow; people merge the bot's PRs | `dependabot` / `none` |
| 0019 Vulnerabilities | No SBOM and no scanner in CI | `none` ×3 |
| 0021 Build provenance | Published by hand, with no attestation | `0` |
| 0023 License | `LICENSE` and package.json both say MIT | `MIT` |

### Group 2: these need a discussion

| ADR | Why |
|---|---|
| 0005 Validation | Commander is itself an argv validator. Its "zero production dependencies" rule (CONTRIBUTING.md) rules out the recommended `zod`, so the mechanism needs naming. |
| 0006 Commits | Only 15 of the last 300 commit subjects are Conventional Commits, which governance requires. |
| 0007 Tests | `node --test` runs with no coverage tool and no threshold. |
| 0009 Branching | Branches are `develop`, `release/N.x` and `master` (gitflow-like), and PRs are squash-merged. No branch prefix convention can be seen from here. |
| 0011 Forge & CI | Whether a red pipeline blocks a merge depends on a GitHub ruleset I can't see. Nothing audits the workflows. |
| 0020 Adding dependencies | People decide what gets added (CONTRIBUTING.md). Whether install scripts run hasn't been decided anywhere. |
| 0022 Review & merge | Two active maintainers suggests `peer`, but the required approval count isn't visible. |
| 0024 Code scanning | CodeQL runs in `codeql-analysis.yml`, but the blocking threshold is a ruleset setting I can't see. |
| 0025 Tools | The answer depends on whether 0011 or 0015 picks a tool (zizmor or gitleaks), so it goes after them. |
| 0026 Agent identity | It's written for a repository with one maintainer; this one has several. It also depends on 0022. |

**Proposed order:** Group 1 in number order (0002 → 0023), then Group 2 in this order: 0005, 0006, 0007, 0009, 0011, 0020, 0022, 0024, 0025, 0026. Ruling 0012 and 0018 before 0009 means 0009's check won't fail on Dependabot's branches.

Do you agree with this order, or would you like a different one? Once you confirm, I'll start with ADR-0002.
