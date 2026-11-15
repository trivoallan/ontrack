### expressjs__express.json cost=1.69 turns=33 subtype=success writes=[]
I'll start the survey: read every ADR and look at the repository, writing nothing.
---
Still surveying: I've read ADR-0002 through ADR-0021 and have five left, then I'll look at the repository's config, CI and history before presenting the two groups.
---
Now the repository itself.
---
The survey is done. I read all 25 ADRs and the repository: `package.json`, `.npmrc`, `.github/dependabot.yml`, the five workflows, `lib/`, `Readme.md`, `History.md`, branches, tags and the last 40 commits. I haven't written anything.

**Group 1: the repository already answers these.** Each line gives the likely ruling and its evidence.

| ADR | Likely ruling | Evidence |
| --- | --- | --- |
| 0002 Localization | `default: english` | The Readme, the code, the comments and every commit are in English |
| 0003 Software architecture | `monolithic` (not the recommended `hexagonal`) | It's a library, not a service: six flat files in `lib/`, 2,765 lines |
| 0004 Languages | `JavaScript` (outside the recommended pair) | No TypeScript anywhere; `.eslintrc.yml` targets es2022/node |
| 0010 Architecture docs | `none` / `none` / `none` | There's no architecture document, `.c4` file or diagram |
| 0012 Delivery | `package`, `[{npm, tag}]`, `manual` release tool | `npm-publish.yml` runs on release; versions are set by hand (commit "5.3.0 (#7468)"); `History.md` is written by hand |
| 0013 Frontend | `rejected` | No user interface; it's a server framework |
| 0014 Work tracking | `github-issues`, `expressjs/express` | Every commit cites `(#NNNN)` |
| 0016 Changes | `none` / `none` | No `openspec/`; the intent of each change lives in its pull request |
| 0018 Dependencies | `dependabot`, automerge `none` | `.github/dependabot.yml` exists and no workflow uses `fetch-metadata` |
| 0021 Build provenance | `2` | npm trusted publishing (`id-token: write`, `npm stage publish`); the check may not detect it |
| 0023 License | `MIT` | `"license": "MIT"` in `package.json`, plus the `LICENSE` file |
| 0026 Agent identity | `rejected` | The ADR covers one-maintainer repositories, and the Readme lists a Technical Committee and triagers |

**Group 2: these need a discussion.**

| ADR | What's open |
| --- | --- |
| 0005 Validation | Inputs are checked by hand (`TypeError` throws in `lib/`), not by a schema library |
| 0006 Commits | The history mixes Conventional Commits with `deps:`, `Upgrade …` and `Improve …`. The scope list is open; with hand-set versions, `none` is a fair tool answer |
| 0007 Tests | `nyc` and Coveralls measure coverage, but no threshold is enforced |
| 0008 Documentation | The user docs live on expressjs.com, not in this repository |
| 0009 Branching | Squash is visible in the linear history with PR numbers. Branch names are mixed (`feat/`, `fix/`, `test/`, `ulises/`, `release/`), and there are maintenance branches `4.x` and `5.x` |
| 0011 Forge and CI | The blocking gate is a ruleset I can't see. There's no `zizmor`; CodeQL scans the `actions` language instead |
| 0015 Secrets | No local secrets and no guard |
| 0017 Agent tooling | It depends on which agents contributors use; there's no `.claude/` or `opencode.json` |
| 0019 Vulnerabilities | No scanner and no SBOM, only Scorecard and Dependabot |
| 0020 Adding a dependency | `.npmrc` sets `ignore-scripts=true` (which the ADR warns against) and `package-lock=false` (which conflicts with its lockfile rule) |
| 0022 Review and merge | Several maintainers suggest `peer`; I can't see the approval count in the ruleset |
| 0024 Code scanning | CodeQL is in place, but with `paths-ignore: test` and without `tools: linked`; the severity threshold isn't visible |
| 0025 Tools | It follows from 0011 and 0015 |

**Proposed order:** group 1 first, then group 2, each in list order. This also handles two dependencies: ADR-0009 asks for 0012 and 0018 to be ruled first, and 0025 comes after 0011 and 0015.

Do you agree with this order, or would you like a different one?
