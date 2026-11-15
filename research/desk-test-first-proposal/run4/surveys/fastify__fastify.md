### fastify__fastify.json cost=1.97 turns=44 subtype=success writes=[]
I'll start by checking what ontrack itself says about the review, then survey the ADRs and the repository.
---
The `npx ontrack review` call wasn't approved, so I'll work from the review instructions I was given. Reading the ADRs and the repository now.
---
Still in the survey: I've read ADRs 0001–0010 and am reading the other 16 before I look at the repository's files, CI and history.
---
Now the repository itself: manifest, CI, config and history.
---
I've read all 25 open ADRs and surveyed the repository. I haven't written anything. Before the groups, three facts change how the rulings land:

- **The ADRs and AGENTS.md aren't committed.** `docs/adr/` is untracked, and `.gitignore` excludes `AGENTS.md`, `CLAUDE.md` and `.claude`. Rulings would stay local unless they're committed on purpose, and any rule that needs a committed `.claude/settings.json` (ADR-0017, ADR-0022) would clash with the ignore file.
- **The project has many maintainers.** CONTRIBUTING.md:32 says "at least two contributors, or one core member, must approve", and CONTRIBUTING.md:38 bans pull requests opened by AI with no human involved.
- **`npx ontrack review` was not approved**, so I'm following the review instructions as given.

## Group 1: the repository already answers these

The repository's own files give a value for every key, even when that value is `none`.

| ADR | What the repository shows |
|---|---|
| 0002 Localization | Everything is in English: docs, commits, code and comments |
| 0004 Languages | `JavaScript` (264 `.js` files against 33 `.ts`, mostly `.d.ts`). This differs from the recommendation, which the ADR allows if a reason is written |
| 0005 Validation | Server options and route inputs are checked against JSON Schema with Ajv (`@fastify/ajv-compiler`, `build/build-validation.js`). Nothing validates data files statically |
| 0007 Tests | The threshold is 100, from `coverage:ci-check-coverage --lines 100`, enforced in `coverage-nix.yml` |
| 0010 Architecture docs | None exists: no arc42, no model, no Mermaid. There are only hand-drawn `.drawio`/`.svg` diagrams |
| 0011 Forge and CI | GitHub. A red pipeline blocks the merge, per CONTRIBUTING.md:34. Nothing audits the workflows |
| 0012 Delivery | An npm `package`. Versions are made by hand ("Bumped v6.0.0-alpha.6"), so the release tool is `manual`. There is no registry for images and no manifests |
| 0013 Frontend | No user interface, so this is `rejected` |
| 0014 Work tracking | `github-issues` in `fastify/fastify` (the `bugs.url` in `package.json`) |
| 0015 Secrets | No secret tooling and no secret guard |
| 0016 Changes | No change framework: intent lives in the pull request descriptions |
| 0017 Agent tooling | `[]`: all agent files are gitignored, and a recent commit is "chore: npm ignore remaining agent files" |
| 0019 Vulnerabilities | No SBOM and no scanner in this repository |
| 0021 Build provenance | Level `0`: the package is published by hand through `prepublishOnly`, with no `--provenance` |
| 0023 License | `MIT` in both `package.json` and `LICENSE` |
| 0024 Code scanning | No CodeQL workflow in the repository |
| 0025 Tools | `none` if 0011 and 0015 end up naming no tool |
| 0026 Agent identity | `rejected`: the ADR excludes repositories with several maintainers |

## Group 2: these need a discussion

| ADR | Why |
|---|---|
| 0003 Architecture | This is a plugin-based library, not a service, so none of the six patterns fits cleanly |
| 0006 Commits | Scopes are free-form. Pull request titles are checked by a regex, not commitlint, and the regex allows a type `types` that isn't one of the eleven allowed types |
| 0008 Documentation | The site is built in another repository (`fastify/website`), which `website.yml` triggers. So the `docs.tool` value and its check don't fit here |
| 0009 Branching | The repository keeps `next` and `*.x` maintenance branches with backports, and has no branch prefixes |
| 0018 Dependencies | The automerge job in `ci.yml` would break fixed rules 3 and 4: it merges GitHub Actions updates and major updates |
| 0020 Adding dependencies | `ignore-scripts=true` and `min-release-age=7` are already set, but `package-lock=false` breaks fixed rule 5 (commit the lockfile, install from it in CI) |
| 0022 Review and merge | Reviews are by `peer`, but the required number of approvals isn't visible from here, and the required deny entries need a `.claude/settings.json` that is gitignored |

**Proposed order:** Group 1 in number order, then Group 2 in number order. Number order already puts 0011 and 0015 before 0025, and 0011 before 0018, 0019 and 0024.

Do you agree to this order, or would you like another? You can also move any ADR from one group to the other.
