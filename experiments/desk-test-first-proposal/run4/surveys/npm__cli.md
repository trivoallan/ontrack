### npm__cli.json cost=2.21 turns=52 subtype=success writes=[]
I'll start the survey: reading every proposed ADR and the repository's configuration, CI and history, without writing anything.
---
Still surveying: I've read 17 of the 25 ADRs. Next I'll read the last 8, then check the repository's config, CI and history.
---
All 25 ADRs read. Now the repository itself: manifests, configuration, workflows and history.
---
Now the integration/publish workflow, and searches across the repo for the remaining signals.
---
Survey nearly done: I've read all 25 ADRs and the workflows, manifest and history. I'm doing one last check on how releases get published, then I'll present the two groups.
---
I've finished the survey and written nothing yet. I read all 25 proposed ADRs and the repository's manifest, `.commitlintrc.js`, `.npmrc`, `release-please-config.json`, the `.github/` workflows, `CONTRIBUTING.md` and the git history. I could not read the GitHub-side settings (rulesets, required checks, merge methods) because the `gh api` call wasn't approved, so anything that lives only on GitHub is marked unverified.

## Group 1: the repository already answers these

| ADR | What the repository shows |
|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English → `default: english` |
| 0004 Languages | It's JavaScript on Node.js (CommonJS). There are no `.ts` files in `lib/`, `bin/` or `workspaces/*/lib`. That's outside the two recommended languages, and the reason is that this is the npm CLI itself. |
| 0007 Tests | tap 16 fails under 100% coverage. `CONTRIBUTING.md` says so, and a recent commit is "restore 100% coverage" → `100` |
| 0008 Documentation | Pages live in `docs/content/`. The `docs` workspace builds them into `docs/output/` and man pages that ship in the package. No Starlight, Docusaurus or MkDocs site is built here, and docs.npmjs.com is built elsewhere → `tool: none`, `audience: public` |
| 0010 Architecture docs | There is no `docs/architecture/`, no `.c4` file and no diagrams → `none` ×3 |
| 0012 Delivery | It publishes an npm package. Versions come from release-please (through `template-oss-release-please`), with a generated `CHANGELOG.md`. A maintainer publishes by hand with `scripts/publish.js`, which asks for confirmation and an OTP. |
| 0013 Frontend | There is no user interface → `rejected` |
| 0014 Work tracking | GitHub issues are used (`bugs.url`, `.github/ISSUE_TEMPLATE/`) → `github-issues`, `npm/cli` |
| 0016 Changes | There is no `openspec/`. The intent of a change lives in its pull request → `none` / `none` |
| 0023 License | `"license": "Artistic-2.0"` and a root `LICENSE` file |
| 0026 Agent identity | The ADR is written for one-maintainer repositories. npm/cli has a team (`CODEOWNERS`, many authors) → `rejected` |

## Group 2: these need a discussion

| ADR | Why |
|---|---|
| 0003 Architecture | A CLI with `lib/commands/`, and libraries split into `workspaces/`. None of the allowed patterns fits obviously. |
| 0005 Validation | Config is checked through `@npmcli/config` definitions (nopt types). `ajv` is only used in tests. No data file has a `$schema`. |
| 0006 Commits | commitlint already runs in CI, but it allows only 5 types, including `deps`, which is not one of the 11 fixed types. Scopes are used freely: `arborist` 78 times, `config`, `view`, `publish`… |
| 0009 Branching | Pull requests are squashed, but there are also `release/vN` and `backport/` branches. Branch names are mixed: `user/…`, `feat/`, `fix/`. |
| 0011 Forge & CI | Actions are pinned to tags (`@v6`), not SHAs, which breaks the fixed rule 3. Nothing audits the workflows. I couldn't read the ruleset. |
| 0015 Secrets | No guard and no storage convention. |
| 0017 Agent tooling | No `.claude/` folder or `opencode.json`, but this repository is being worked on with an agent. |
| 0018 Dependencies | No `dependabot.yml`. A `dependabot/…` branch exists, so security updates are probably turned on in the GitHub settings. `CONTRIBUTING.md` says the team updates dependencies itself. |
| 0019 Vulnerabilities | `npm audit` runs weekly but not on pull requests, and blocks nothing. No SBOM is published with releases. |
| 0020 Adding a dependency | No `min-release-age` or `allowScripts`. CI uses `--ignore-scripts`, which the ADR advises against. |
| 0021 Build provenance | Publishing happens from a workstation, with no `--provenance`. Today that's level 0; the recommendation is 2. |
| 0022 Review & merge | A team, so `peer`, but I couldn't check the approval count. |
| 0024 Code scanning | `codeql-analysis.yml` exists, but it isn't pinned and doesn't set `tools: linked`. The `fail_on` threshold lives on GitHub. |
| 0025 Tools | The answer depends on 0011 and 0015, so it goes last. |

**My suggested order:** Group 1 in list order (0002 → 0026), then Group 2 in list order, with 0025 last.

Do you agree with this order, or would you like a different one? You can also skip any ADR when we reach it.
