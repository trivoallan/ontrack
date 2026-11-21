### jashkenas__underscore.json cost=1.86 turns=27 subtype=success writes=[]
I'll start the survey: reading every ADR and the repository's files, configuration, CI and history.
---
The ADRs are long; reading them in full from the saved outputs.
---
All ADRs read. Now the repository's own files, CI and history.
---
Survey nearly done — I've read all 25 ADRs and the repo's config, CI and history; a few last checks before I present the two groups.
---
# Survey: 25 proposed ADRs

Nothing has been written. For each ADR I looked for a citation of every trait value in the repo's files, its config, CI (`.travis.yml`, `.github/workflows/codeql-analysis.yml`) and its git history: 2,903 commits, tags up to `1.13.8`, remote `jashkenas/underscore`.

## Group 1: the repository already answers these (8 ADRs)

| ADR | Key | Value | Citation (`shows the value`) |
|---|---|---|---|
| 0002 Localization | `localization.language.default` | `english` | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, every identifier in `modules/*.js` and every commit subject in `git log` are in English |
| 0002 | `documentation`, `commits`, `code`, `comments` | empty (same as default) | same citations: nothing departs from English |
| 0004 Languages | `languages.main.name` | `JavaScript` | `modules/*.js`, `package.json` `"type": "commonjs"`, `"lint": "eslint modules/*.js test/*.js"` |
| 0010 Architecture documentation | `architecture.document` | `none` | `git ls-files` lists no `docs/architecture/` and no architecture document |
| 0010 | `architecture.model` | `none` | `git ls-files` lists no `.c4` or `.likec4` file |
| 0010 | `architecture.diagrams` | `none` | `git grep mermaid` finds nothing, and there is no PlantUML file |
| 0014 Work tracking | `tracking.tool` | `github-issues` | `CONTRIBUTING.md`: "[search](https://github.com/jashkenas/underscore/issues) for previous discussions" |
| 0014 | `tracking.project` | `jashkenas/underscore` | the same URL, and `git remote -v` → `https://github.com/jashkenas/underscore.git` |
| 0016 Changes | `changes.framework` | `none` | no `openspec/` directory |
| 0016 | `changes.schema` | `none` | follows from `framework: none`; no `openspec/config.yaml` |
| 0018 Dependencies | `dependencies.updater` | `none` | no `.github/dependabot.yml` and no Renovate config; `git log --format=%an` has 0 commits by dependabot or renovate. Action bumps were done by a person (PR #2991, `bump-github-workflow-actions`) |
| 0018 | `dependencies.automerge` | `none` | no workflow uses `dependabot/fetch-metadata` and none runs `gh pr merge --auto` |
| 0023 License | `license.spdx` | `MIT` | `package.json` `"license": "MIT"`; `LICENSE` holds the MIT text |
| 0025 Tools | `tools.manager` | `none` | no `mise.toml`, `aqua.yaml` or tool-install script, and no accepted ADR names an outside tool |

## Group 2: these need a discussion (17 ADRs)

| ADR | Value I could not show | Where it lives | Citations I have |
|---|---|---|---|
| 0003 Software architecture | `architecture.pattern` | a choice people make. A function library is not a service, so `monolithic` or `rejected` | `modules/` is a flat set of one-function modules bundled by `rollup.config.js` (`next to it`) |
| 0005 Validation | `validation.boundary`, `validation.data_files` | a choice: a library has caller arguments, not I/O boundaries. Likely `rejected` or `none` | no validation library in `package.json` (`next to it`) |
| 0006 Commits | `commits.scopes` | history only: 6 of 2,074 non-merge subjects are Conventional Commits | `git log` (`next to it`). `commits.tool: none` is shown: no commitlint, and the husky hooks only bundle (`shows the value`) |
| 0007 Tests | `tests.coverage_target` | a choice people make: nothing sets a threshold | `nyc` and `coveralls` in `package.json` with no `check-coverage` and no `.nycrc` (`next to it`) |
| 0008 Documentation | `docs.tool`, `docs.root`, `docs.audience`, `docs.channels` | `tool`: docco plus a hand-written `index.html`, not in the allowed values; `audience`: a choice; `channels`: the GitHub Pages / `gh-pages` setting on the forge | `CNAME` → `underscorejs.org`, the `doc` script uses docco, `SECURITY.md` says master is published as "edge" (all `next to it`) |
| 0009 Branching | `branching.model`, `branching.merge`, `branching.prefixes` | `merge`: a forge setting; `model`: history; `prefixes`: none in use today | 452 of the last 500 merges are "Merge pull request" merge commits, with free-form branch names (`next to it`) |
| 0011 Forge and CI | `forge.gate` | a GitHub ruleset on the forge (unknown) | `forge.audit: none` is shown: no workflow runs zizmor (`shows the value`). CI also runs on Travis (`.travis.yml`) |
| 0012 Delivery | `environments`, `release_tool`, `release_notes` | how releases are made, by people (manual npm publish) | `package.json` `files` and `prepublishOnly` show `target: package` (`shows the value`); `CONTRIBUTING.md` "before cutting a new release", and the change log in `index.html` (`next to it`); no Dockerfile or manifests → `registry: none`, `manifests: none` (`shows the value`) |
| 0013 Frontend | `frontend.framework`, or `rejected` | a choice: library, no app UI; the website is hand-written | `index.html`, `docs/main.js` (`next to it`) |
| 0015 Secrets | `secrets.storage` | contributors' workstations: the Sauce Labs credentials read in `karma.conf-sauce.js:50` | `.travis.yml` `secure:` entries are CI secrets, which this ADR does not cover (`next to it`); `guard: none` is shown: no gitleaks or secret hook (`shows the value`) |
| 0017 Agent tooling | `agent.hosts` | which agents contributors use (unknown) | no `.claude/` or `opencode.json`; the untracked `AGENTS.md` is ontrack's own file. Neither shows the value. `CONTRIBUTING.md` AI policy (`next to it`) |
| 0019 Vulnerabilities | `scanner`, `fail_on`, `sbom` | Dependabot alerts / Tidelift are forge or outside settings (unknown) | no scan workflow, no SBOM in releases (`next to it`) |
| 0020 Adding a dependency | `admission.approver`, `admission.install_scripts` | a choice people make; the npm version contributors run | no `.npmrc`, no `allowScripts` (`next to it`) |
| 0021 Build provenance | `supply_chain.build_level` | the npm registry | no publish workflow and no `--provenance`; publishing is `prepublishOnly` by hand (`next to it`) |
| 0022 Review and merge | `review.by`, `review.approvals` | a GitHub ruleset; several maintainers merge others' PRs | merges by Julian Gonggrijp of contributors' PRs (#3026, #3018, #3024) (`next to it`) |
| 0024 Code scanning | `code_scanning.fail_on` | a GitHub ruleset ("Require code scanning results") (unknown) | `code_scanning.tool: codeql` is shown: `github/codeql-action/analyze@v3` in `.github/workflows/codeql-analysis.yml` (`shows the value`) |
| 0026 Agent identity | `agent.identity` | a choice people make, and GitHub accounts | `CONTRIBUTING.md`: "**Never** allow your tools to publish anything on your behalf" (`next to it`) |

## Proposed order

First the 8 from Group 1, in list order: 0002, 0004, 0010, 0014, 0016, 0018, 0023, 0025. Then the 17 from Group 2, in list order: 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0013, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

I don't have a question tool in this session, so please reply here: **do you agree to this order, or would you like another?** Once you answer, I'll start with ADR-0002 and present a proposed ruling before writing anything.
