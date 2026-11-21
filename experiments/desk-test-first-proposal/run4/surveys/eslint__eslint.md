### eslint__eslint.json cost=1.90 turns=40 subtype=success writes=[]
I'll start the survey by reading the ADRs and the repository's setup.
---
Still surveying: I've read ADRs 0002–0013, and I'm now reading 0014–0026 before looking at the repository.
---
I've read all 25 ADRs. Now the repository itself.
---
Still gathering repository evidence (release tooling, docs site, CI); the grouping comes next.
---
I've read all 25 ADRs and compared them with the repository (workflows, `package.json`, `.c8rc`, `.github/`, `docs/`, the contributor guide and the last 500 commits). I haven't written anything yet.

## Group 1: already answered by the repository (12)

For these, every key can be filled with a value the repository already uses.

| ADR | What the repository does today |
| --- | --- |
| 0002 Localization | Everything is in English: code, comments, docs and commits. |
| 0003 Architecture | `layered`. The strict layers are bin → cli → eslint → linter → rules (AGENTS.md, `docs/src/contribute/architecture/`). This differs from the recommended hexagonal pattern. |
| 0004 Languages | JavaScript (CommonJS), with `.d.ts` types. This is outside the recommended list, but it's justified because ESLint is a JS linter. |
| 0007 Tests | Coverage gate at 99 % lines (`npm test` thresholds), which is above the recommended 90. |
| 0010 Architecture docs | `elsewhere` (`docs/src/contribute/architecture/index.md`). There's no model, and the only diagram is an SVG. |
| 0012 Delivery | `package` (npm), released with `eslint-release` (`Makefile.js` release targets, commits by Jenkins), with release notes and a blog post. The registry and manifests are `none`. |
| 0013 Frontend | `rejected`: the library has no UI of its own. |
| 0014 Work tracking | `github-issues`, `eslint/eslint`. |
| 0016 Changes | `none`: intent lives in issues, PRs and the separate RFC process. |
| 0017 Agent tooling | `[]`: there's no `.claude/`, `opencode.json` or `marketplace/`. |
| 0023 License | `MIT`, in both `package.json` and `LICENSE`. |
| 0026 Agent identity | `rejected`: the ADR excludes repositories with several maintainers, and this one has a team (`.github/CODEOWNERS`). |

## Group 2: needs a discussion (13)

| ADR | Why |
| --- | --- |
| 0005 Validation | Config and rule options are validated with JSON Schema (ajv) and `@eslint/object-schema`, not zod. I need to settle which name to write. |
| 0006 Commits | Versions come from commit messages, so the ADR recommends `commitlint`. The repository has no commitlint; PR titles are checked outside this repo. |
| 0008 Documentation | The site uses Eleventy, which isn't an allowed value. It's deployed by Netlify, not `deploy-pages`, with `latest` and `head` channels plus older majors. |
| 0009 Branching | It uses github-flow and squash, but contributors' branches have no prefix (`issue1234`), so the check would fail fork PRs. |
| 0011 Forge & CI | Actions aren't pinned by SHA (`actions/checkout@v7`), only actionlint audits the workflows, and the ruleset can't be seen from here. |
| 0015 Secrets | There's no guard, and no local secrets are handled. |
| 0018 Dependencies | Both Dependabot (actions) and Renovate (npm) are configured, and the key allows only one. |
| 0019 Vulnerabilities | There's no scanner and no SBOM. |
| 0020 Adding a dependency | `allowScripts` is present, but `package-lock = false` breaks rule 5 (commit the lockfile). |
| 0021 Build provenance | npm publishing from Jenkins has no provenance (level 0 today, 2 recommended). |
| 0022 Review & merge | Team review (`peer`), but I can't see the required number of approvals from the repository. |
| 0024 Code scanning | CodeQL is present, but not pinned, without `tools: linked`, and its blocking threshold isn't visible. |
| 0025 Tools | actionlint is installed with `go install @v1.7.10`, with a version but no checksum. |

**Proposed order:** group 1 first, then group 2 in numerical order. One exception: I'd move 0009 after 0018. ADR-0009's check exempts bot branches only once 0012 and 0018 are ruled, and Renovate and Dependabot open PRs here.

Do you agree with this order, or would you like a different one? Once you confirm, I'll start with ADR-0002.
