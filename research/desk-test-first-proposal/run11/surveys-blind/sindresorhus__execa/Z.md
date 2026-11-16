I'll start with the survey. This step only reads files and writes nothing.
---
I'm reading all 25 ADRs for the survey, and nothing is written yet. ADRs 0008–0010 came back too large to show inline, so I'm reading them from the saved output.
---
I've read ADRs 0002–0015 and have the trait keys for 0016–0026. Next I'm reading the recommendation tables for 0016–0026 and collecting the repository evidence. Nothing is written yet.
---
**Survey.** I read all 25 ADRs and the repository, and wrote nothing. This is `sindresorhus/execa`: a Node ESM library with hand-written `.js` and a `.d.ts` type layer. It has one workflow (`.github/workflows/main.yml`), and every commit is by one author, directly on `main`.

I couldn't use a question tool (none is available here), so the order is a plain-text question at the end.

## Group 1: the repository already answers these (7)

Each citation below shows the value itself, unless I say it shows only something next to it.

| ADR | Value | Citation | Shows |
|---|---|---|---|
| 0002 Localization | `default: english` | `readme.md` and `docs/*.md` are English. `lib/**` comments are English (e.g. `lib/pipe/pipe-arguments.js`). `git log` messages are English. | the value itself, for documentation, comments, commits and code |
| 0004 Languages | `main.name: JavaScript` | `lib/**/*.js`, `"type": "module"` and `files` in `package.json`, plus a hand-written `index.d.ts` | the value itself. It departs from the recommended Python or TypeScript, so the ADR needs a justification. |
| 0010 Architecture documentation | `document: none`, `model: none`, `diagrams: none` | `docs/` has no `architecture/`, and `git ls-files` finds no `.c4`. A grep for mermaid, plantuml and likec4 finds nothing outside `docs/adr`. | the value itself, but by absence |
| 0013 Frontend | question doesn't apply (`rejected`) | `package.json` lists no UI framework, and the package is a Node process library | the value itself, by absence |
| 0016 Changes | `framework: none`, `schema: none` | there is no `openspec/` directory, and a grep for `openspec` outside `docs/adr` finds nothing | the value itself, by absence |
| 0023 License | `spdx: MIT` | `"license": "MIT"` in `package.json`, and `license` at the root holds the MIT text | the value itself |
| 0025 Tools | `manager: none` | no `mise.toml`, `aqua.yaml` or install script. The workflow gets lychee through an action, not a binary. | the value itself, by absence. `none` only holds while no accepted ADR names such a tool, so ruling 0011, 0015 or 0019 later would undo it. |

## Group 2: not fully answered (18)

| ADR | Value that is missing | Where it lives | Shows |
|---|---|---|---|
| 0003 Architecture | `pattern` | Nowhere. `lib/` is split by concern (`arguments`, `io`, `pipe`, …), which would be `layered` or `monolithic`. | only something next to it |
| 0005 Validation | `boundary` | The repo validates by hand (`throw new TypeError` in `lib/pipe/pipe-arguments.js`, `lib/methods/*`), and neither allowed form (a library name or `none`) fits. | something next to it |
| 0005 Validation | `data_files` | Nowhere. | nothing found |
| 0006 Commits | `tool: none` | No commitlint or hook in `package.json` or the repo. | the value itself |
| 0006 Commits | `scopes: []` | `git log` only. | history alone |
| 0007 Tests | `coverage_target` | `c8` config in `package.json` has no threshold, and `.github/codecov.yml` sets no target. No number is held anywhere. | only something next to it |
| 0008 Documentation | `tool: none`, `root: docs/` | `docs/*.md` exists and no site generator is present. | the value itself |
| 0008 Documentation | `audience` | GitHub repository visibility, outside the repo. `readme.md` is written for users. | something next to it |
| 0009 Branching | `model`, `merge` | GitHub settings, outside the repo. History is linear, with no merge commits. | something next to it |
| 0009 Branching | `prefixes` | Only `main` exists, so there is nothing to observe. | nothing found |
| 0011 Forge and CI | `gate` | A GitHub ruleset, outside the repo. The workflow runs on `push` and `pull_request`. | something next to it |
| 0011 Forge and CI | `audit: none` | The workflow has no zizmor job. | the value itself |
| 0012 Delivery | `target`, `environments`, `release_notes`, `registry`, `manifests` | npm publishing and GitHub releases happen outside the repo. `package.json` `files` and `exports` and the `v*` tags only suggest a package. | something next to it |
| 0012 Delivery | `release_tool: manual` | Version-bump commits ("10.2.1") and no `release-please-config.json`. | something next to it |
| 0014 Work tracking | `tool`, `project` | `repository: "sindresorhus/execa"` in `package.json` and the GitHub remote. Whether Issues are enabled lives on GitHub. | something next to it |
| 0015 Secrets | `storage` | The maintainer's machine. | nothing found |
| 0015 Secrets | `guard: none` | No gitleaks config or hook. | the value itself |
| 0017 Agent tooling | `hosts` | There is no `.claude/`, copilot or opencode settings in the repo. The agent in use lives on the user's machine. | nothing found |
| 0018 Dependencies | `updater`, `automerge` | There is no `dependabot.yml` or `renovate.json`, but Dependabot security updates can be switched on in GitHub settings. | the value itself for the file, but not for the setting |
| 0019 Vulnerabilities | `sbom`, `scanner`, `fail_on` | No SBOM or scanner in the workflow. GitHub's Dependabot alerts are outside the repo. | something next to it |
| 0020 Adding a dependency | `approver` | Working practice, outside the repo. | nothing found |
| 0020 Adding a dependency | `install_scripts` | `.npmrc` holds only `package-lock=false`, so scripts are not ignored, which is `allowed`. | the value itself |
| 0021 Build provenance | `build_level` | No build or publish job in the workflow. Publishing happens outside the repo. | something next to it |
| 0022 Review and merge | `by`, `approvals` | A GitHub ruleset, outside the repo. History shows a single author committing directly. | something next to it |
| 0024 Code scanning | `tool`, `fail_on` | No CodeQL workflow, but GitHub's default setup needs no file. | something next to it |
| 0026 Agent identity | `identity` | The machine and the GitHub account, outside the repo. | nothing found |

## Proposed order

Group 1 first, in ADR order: 0002, 0004, 0010, 0013, 0016, 0023, 0025. Then group 2 in ADR order: 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0018, 0019, 0020, 0021, 0022, 0024, 0026.

One dependency to know about: 0009's `check:` expects 0012 and 0018 to be ruled with or before it, otherwise bot branches fail it. This repository has no bots today.

**Do you agree to this order, or do you want another?** I won't write anything until you answer. For each ADR you can then rule it, skip it, or stop.
