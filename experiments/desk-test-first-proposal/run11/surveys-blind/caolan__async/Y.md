I'll start with the survey, reading every ADR and the repository without writing anything.
---
Reading the remaining ADRs, with the repeated "how to rule" boilerplate stripped out so the output stays manageable.
---
All 25 ADRs are read. Next I'm looking at the repository itself (CI, config, history, tooling), still without writing anything.
---
I've finished the survey and written nothing. Here are the two groups.

**Evidence labels.** *Itself* means the cited file or output shows the value. *Next to* means it only lets me infer the value. "Absence" means the value is `none`, and a missing file or config shows that directly.

## Group 1: this repository already answers these

| ADR | Value | Citation | Shows |
|---|---|---|---|
| 0002 Localization | `default: english` | `README.md`, `lib/map.js` JSDoc comments, `git log` subjects, all English | *itself* |
| 0004 Languages | `languages.main.name: JavaScript` | `lib/*.js`, `package.json` (`main: dist/async.js`), `.eslintrc.json` | *itself*. Not one of the two recommended languages, so the ruling needs a written reason. |
| 0010 Architecture docs | `document: none`, `model: none`, `diagrams: none` | There is no `docs/architecture/`. The glob for `.c4`, `.likec4`, `.puml` and `.mmd` files finds nothing. | *itself* (absence) |
| 0013 Frontend | `rejected` (no UI) | `package.json` has no UI framework. `lib/` is a utility library. | *itself* (absence) |
| 0014 Work tracking | `github-issues`, `caolan/async` | `package.json` `bugs.url` is `https://github.com/caolan/async/issues`. `.github/ISSUE_TEMPLATE.md` exists. | *itself* |
| 0016 Changes | `framework: none`, `schema: none` | There is no `openspec/` and no config. `CHANGELOG.md` is kept by hand. | *itself* (absence) |
| 0018 Dependencies | `updater: dependabot`, `automerge: none` | `.github/dependabot.yml` is present. The only workflow is `ci.yml`, with no `dependabot/fetch-metadata` step. | *itself* for both |
| 0021 Build provenance | `build_level: 0` | The grep for `attest`, `provenance` and `id-token` finds nothing in `.github/`. `Makefile:156` runs `npm publish` by hand. | *itself* (absence) |
| 0023 License | `MIT` | `package.json` has `"license": "MIT"`. The `LICENSE` text is MIT. | *itself* |
| 0025 Tools | `none` | There is no `mise.toml`, `aqua.yaml` or install script. No accepted ADR names an outside tool yet. | *itself* (absence) |

## Group 2: these are not answered by the repository

| ADR | Value held elsewhere or inferred | Citation | Shows |
|---|---|---|---|
| 0003 Architecture | `pattern` | No file states it. `lib/` is one module per function, so I would infer `monolithic`. | *next to* |
| 0005 Validation | `boundary`, `data_files` | The library reads no data at run time that I can see. `none` versus rejecting is a judgement. | *next to* |
| 0006 Commits | `scopes` | The history has 159 conventional subjects out of 1628 non-merge commits, and no scope list. | *next to* |
| 0006 Commits | `tool` | There is no commitlint or hook config. | *itself* (absence) |
| 0007 Tests | `coverage_target` | `nyc` has no threshold. Coveralls is configured in CI, but any threshold lives in Coveralls settings, outside the repository. | *next to* |
| 0008 Documentation | `tool`, `audience`, `channels` | `docs/v2` and `docs/v3` are jsdoc HTML, and jsdoc is not an allowed value. Audience and channels are not stated anywhere. | *next to* |
| 0009 Branching | `model`, `merge`, `prefixes` | The merge setting lives in the GitHub forge settings. Recent history looks squashed (`(#2090)`) but older history has merge commits. No branch naming rule exists. | *next to* |
| 0011 Forge and CI | `gate` | `ci.yml` exists, but whether a ruleset makes it required is a GitHub setting. | *next to* |
| 0011 Forge and CI | `audit` | There is no zizmor job. | *itself* (absence) |
| 0012 Delivery | `release_notes`, `environments` | Releases are manual: `Makefile:145-158` and `support/xyz.sh` tag, then `npm publish`. What accompanies a GitHub release is outside the repository. | *next to* |
| 0015 Secrets | `storage` | `Makefile:156` publishes with the maintainer's npm credentials, held on their machine. I don't know where. | held outside |
| 0015 Secrets | `guard` | There is no gitleaks config or hook. | *itself* (absence) |
| 0017 Agent tooling | `hosts` | There is no `.claude/` or `opencode.json`. Which agents contributors use is not in the repository. | *next to* |
| 0019 Vulnerabilities | `scanner`, `sbom`, `fail_on` | There is no scan job. Dependabot alerts or other scanning on GitHub are outside the repository. | held outside |
| 0020 Adding a dependency | `approver`, `install_scripts` | `package-lock.json` is committed and there is no `.npmrc`. The practice is not written down. | *next to* |
| 0022 Review and merge | `by`, `approvals` | These live in a GitHub ruleset. I don't know them. | held outside |
| 0024 Code scanning | `tool`, `fail_on` | There is no CodeQL workflow. GitHub default setup would leave no file. | held outside |
| 0026 Agent identity | `identity` | This depends on GitHub credentials on the maintainer's machine. I don't know them. | held outside |

## Proposed order

Group 1 first, in ADR number order: 0002, 0004, 0010, 0013, 0014, 0016, 0018, 0021, 0023, 0025. Then group 2, also in number order: 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0015, 0017, 0019, 0020, 0022, 0024, 0026.

I have no question tool in this session, so I'm asking in text. Do you agree to this order, or do you want another? You can also name ADRs to skip, or stop here. Once you agree, I'll start with ADR-0002 and propose its ruling before writing anything.
