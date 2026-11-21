### debug-js__debug.json cost=1.53 turns=38 subtype=success writes=[]
I'm reading the ADR files directly, since the shell loop wasn't allowed.
---
Now the repository itself.
---
The survey is below. I've written nothing yet. I couldn't run `ontrack review` because the command needs approval, so this comes from reading all 25 ADRs and the repository's files, configuration and git history.

Some facts used throughout:
- The repository is a small JavaScript library: four files under `src/` and `"main": "./src/index.js"` in `package.json`.
- The only CI is `.travis.yml`. There is no `.github/` directory; commit `remove .github folder` deleted it.
- `package-lock.json` is gitignored.
- Versions are commits named after the version number (`4.4.3`), and the remote is `github.com/debug-js/debug`.

## Group 1: answered by the repository (9 ADRs)

| ADR | Key | Value | Citation (`shows the value`) |
|---|---|---|---|
| 0002 Localization | `localization.language.default` | `english` | `README.md`, plus the symbols and comments in `src/*.js`, are all in English |
| 0002 Localization | the four overrides | empty (they take `default`) | the same files, with no second language anywhere |
| 0004 Languages | `languages.main.name` | `JavaScript` | `package.json` `"main": "./src/index.js"`; `git ls-files` lists only `.js` source files |
| 0010 Architecture documentation | `architecture.document` | `none` | `git ls-files`: no architecture document |
| 0010 Architecture documentation | `architecture.model` | `none` | `git ls-files`: no `.c4` or `.likec4` file |
| 0010 Architecture documentation | `architecture.diagrams` | `none` | `git ls-files`: no diagram files |
| 0013 Frontend | `frontend.framework` | rule `rejected` (no UI) | `package.json`: the only dependency is `ms`, and the description is "debugging utility" |
| 0016 Changes | `changes.framework` | `none` | no `openspec/` directory |
| 0016 Changes | `changes.schema` | `none` | no `openspec/config.yaml` |
| 0018 Dependencies | `dependencies.updater` | `none` | no `.github/dependabot.yml` and no `renovate.json` |
| 0018 Dependencies | `dependencies.automerge` | `none` | no workflow at all, so no automerge workflow |
| 0023 License | `license.spdx` | `MIT` | `package.json` `"license": "MIT"`; `LICENSE` says "(The MIT License)" |
| 0024 Code scanning | `code_scanning.tool` | `none` | no workflow runs CodeQL or Semgrep (`.github/` is absent) |
| 0024 Code scanning | `code_scanning.fail_on` | `none` | the same absence: no scan, so nothing blocks |
| 0025 Tools | `tools.manager` | `none` | no `mise.toml`, no `aqua.yaml` and no install script; no accepted ADR names a tool |

## Group 2: needs a discussion (16 ADRs)

| ADR | Value I could not show | Where it lives | Citation I have (label) |
|---|---|---|---|
| 0003 Software architecture | `architecture.pattern` | a choice people make | four modules: `src/index.js` picks `node.js` or `browser.js`, both built on `common.js` (`next to it`) |
| 0005 Validation | `validation.boundary`, `validation.data_files` | a choice people make | `src/node.js:124-140` parses `DEBUG_*` environment variables by hand, and `src/browser.js:230-251` reads `localStorage` (`next to it`) |
| 0006 Commits | `commits.scopes` | history alone, and people's choice | the git log mixes `docs:` subjects with free-form ones (`next to it`) |
| 0006 Commits | `commits.tool` | — | no commitlint or hook: `none` (`shows the value`) |
| 0007 Tests | `tests.coverage_target` | a choice people make, or Coveralls settings (outside the repository) | `test:coverage` sends results to Coveralls with no threshold; commit `remove istanbul` (`next to it`) |
| 0008 Documentation | `docs.audience` | repository visibility, a forge setting | public GitHub remote (`next to it`) |
| 0008 Documentation | `docs.root` | a choice people make | the user documentation is `README.md` alone (`next to it`) |
| 0008 Documentation | `docs.tool` | — | no site generator: `none` (`shows the value`) |
| 0009 Branching | `branching.model`, `branching.merge` | forge settings | recent subjects end in `(#1052)`, which looks like squash merges; history also has 83 merge commits (`next to it`) |
| 0009 Branching | `branching.prefixes` | a choice people make | none |
| 0011 Forge and CI | `forge.gate` | a forge setting; it is also unclear whether Travis still runs | `.travis.yml` (`next to it`) |
| 0011 Forge and CI | `forge.audit` | — | no GitHub workflows: `none` (`shows the value`) |
| 0012 Delivery | `delivery.environments`, `delivery.release_tool`, `delivery.release_notes` | the npm registry and the maintainer's manual process | version commits such as `4.4.3`; no release tool; commit `remove changelog` (`next to it`) |
| 0012 Delivery | `delivery.target`, `delivery.registry`, `deployment.manifests` | — | `package.json` `"files"` and `"main"` give `package` (`next to it`); no Dockerfile and no manifests give `none` (`shows the value`) |
| 0014 Work tracking | `tracking.tool`, `tracking.project` | a forge setting (issues turned on) and history | `fixes #987` in commits and a `debug-js/debug` remote (`next to it`) |
| 0015 Secrets | `secrets.storage` | the maintainer's machine (npm publish token) | none |
| 0015 Secrets | `secrets.guard` | — | no gitleaks: `none` (`shows the value`) |
| 0017 Agent tooling | `agent.hosts` | which agents contributors use | an untracked `AGENTS.md` (`next to it`) |
| 0019 Vulnerabilities | `vulnerabilities.scanner`, `vulnerabilities.fail_on` | forge setting (Dependabot alerts) | no scan workflow (`next to it`) |
| 0019 Vulnerabilities | `vulnerabilities.sbom` | — | no SBOM step: `none` (`shows the value`) |
| 0020 Adding a dependency | `admission.approver` | a choice people make | none |
| 0020 Adding a dependency | `admission.install_scripts` | the npm version contributors use | no `.npmrc` (`next to it`) |
| 0021 Build provenance | `supply_chain.build_level` | the npm registry | manual publishing, no publish workflow (`next to it`) |
| 0022 Review and merge | `review.by`, `review.approvals` | the forge ruleset and the number of maintainers | none |
| 0026 Agent identity | `agent.identity` | a choice people make | the local git user (`next to it`) |

## Proposed order

First Group 1, in list order: 0002, 0004, 0010, 0013, 0016, 0018, 0023, 0024, 0025. Then Group 2, in list order: 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0019, 0020, 0021, 0022, 0026.

**Do you agree with this order, or would you like a different one?** You can also skip ADRs or stop at any point.
