### vercel__swr.json cost=1.72 turns=38 subtype=success writes=[]
I'll start the survey by reading the ADRs and the repository's configuration.
---
Still surveying: I've read 18 of the 25 ADRs and I'm moving on to the rest and to the repository's files.
---
Now the repository itself: manifest, CI, tooling and history.
---
Still surveying the repository: checking contributors, security policy and whether the GitHub CLI is available.
---
Survey done. I read all 25 ADRs and the repository's manifest, CI, tooling and history, and wrote nothing.

## Survey

**Group 1: the repository's files already answer these** (each value can be read from a file or a config setting)

| ADR | What the repository shows |
|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English |
| 0003 Software architecture | A library: `src/{index,infinite,mutation,…}` entry points over a shared `_internal`, with no service layering |
| 0004 Languages | TypeScript (`tsconfig.json`, `src/**/*.ts`, `typescript` 7.0.2) |
| 0005 Validation | No validation library in the dependencies. `.oxlintrc.json` and `.oxfmtrc.json` each carry a `$schema` |
| 0007 Tests | `jest --coverage` exists, but `jest.config.js` sets no `coverageThreshold` |
| 0010 Architecture documentation | No architecture document, model or diagrams anywhere |
| 0013 Frontend | It's a hooks library with no UI of its own (the ADR says a library rules `rejected`) |
| 0014 Work tracking | GitHub Issues on `vercel/swr` (`CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/`) |
| 0015 Secrets | `.gitignore` lists `.env`. No gitleaks or other guard. CI publishes through OIDC with no stored secret |
| 0016 Changes | No OpenSpec and no change framework |
| 0023 License | `MIT` in `package.json` and in `LICENSE` |
| 0025 Tools | No tool outside pnpm is pinned or installed (no mise, aqua or script) |
| 0026 Agent identity | Several maintainers (`CODEOWNERS`: two people, many authors). The ADR covers only one-person repositories |

**Group 2: these need a discussion**

| ADR | Value held outside the repository, or drawn only from history |
|---|---|
| 0006 Commits | `commits.scopes` would come from history alone: `mutation`, `infinite`, `mutate`, `deps` each appear once or twice in 400 commits |
| 0008 Documentation | The docs site lives in another repository, `vercel/swr-site` (per `CONTRIBUTING.md`), deployed to swr.vercel.app |
| 0009 Branching | `branching.merge` is a GitHub setting (every commit has the `(#NNNN)` squash form, and there is 1 merge commit in 400). `branching.prefixes` would come from history alone: remote branches are mixed (`feat/`, `fix/`, `shu/`, `v0/`, `copilot/`) |
| 0011 Forge and CI | `forge.gate` depends on the default branch's ruleset on GitHub |
| 0012 Delivery | `delivery.release_notes` lives in GitHub Releases (there's no CHANGELOG file) |
| 0017 Agent tooling | `agent.hosts` depends on which agents contributors use. Branches `copilot/…` and `v0/…` suggest some, but none of them is covered |
| 0018 Dependencies | Dependabot runs from GitHub settings (it has commits and branches), but there's no `.github/dependabot.yml` |
| 0019 Vulnerabilities | Any scanning today means Dependabot alerts, a GitHub setting |
| 0020 Adding a dependency | `admission.approver` is a policy that no file records. `install_scripts` is visible in files (pnpm `allowBuilds`) |
| 0021 Build provenance | npm trusted publishing is set up on npmjs.org (the comment in `trigger-release.yml` says so) |
| 0022 Review and merge | The ruleset and the required approvals are GitHub settings |
| 0024 Code scanning | CodeQL "default setup" may be turned on in the GitHub settings. No workflow holds it |

I couldn't run `gh` without your approval, so I haven't read any GitHub settings.

**Proposed order:** Group 1 in list order, then Group 2 in list order. One thing to consider: ADR-0025's answer depends on what ADR-0011 (`forge.audit`) and ADR-0015 (`secrets.guard`) rule. Moving 0025 to right after 0011 would avoid ruling it twice.

Do you agree with this order? You can also give another one, or ask me to move 0025 after 0011.
