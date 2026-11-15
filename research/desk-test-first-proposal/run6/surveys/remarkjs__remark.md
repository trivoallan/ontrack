### remarkjs__remark.json cost=1.66 turns=45 subtype=success writes=[]
I'll start by following the project rule: run the ontrack review command, then survey the ADRs and repository.
---
The `ontrack review` command needs your approval to run, so for now I'll do the survey by reading the files directly.
---
Now the repository itself: manifest, CI, packages, configuration and history.
---
Quick update: I've read all 25 proposed ADRs and the repository's files, CI and history, and written nothing. The survey is below. (The project rule says to run `npx -p @trivoallan/ontrack ontrack review`, but the command is waiting for your approval. Until you approve it, I'm reading the files directly.)

## Survey

Some context first: this repo is the **remark monorepo**. It holds four MIT-licensed npm packages written in JavaScript with JSDoc types that `tsc` checks. Its CI is two GitHub Actions workflows, versions are bumped by hand, and the documentation site (remark.js.org) lives outside the repo.

### Group 1: the repository already answers these
Every value is in a file of the repository or in its configuration (a missing file counts as an answer too).

| ADR | Where the answer is |
|---|---|
| 0002 Localization | The readme, `doc/`, code and comments are all in English |
| 0003 Architecture | `package.json` `workspaces`: four libraries, no service |
| 0004 Languages | `.js` files with JSDoc, and `tsconfig.json` `checkJs: true` |
| 0005 Validation | There is no schema library in any manifest; options and the CLI are checked in code (`unified-args`) |
| 0007 Tests | `test-coverage` runs `c8 --100` |
| 0010 Architecture docs | There is no `docs/architecture/` and no diagram files |
| 0013 Frontend | There is no user interface (these are libraries plus a CLI) |
| 0014 Work tracking | `package.json` `bugs` points to `github.com/remarkjs/remark/issues` |
| 0016 Changes | There is no `openspec/` |
| 0018 Dependencies | There is no `.github/dependabot.yml` and no automerge workflow |
| 0021 Build provenance | No workflow publishes anything, so there is no provenance step |
| 0023 License | `"license": "MIT"` and a root `license` file |
| 0025 Tools | There is no `mise.toml`, `aqua.yaml` or install script. Its answer also depends on what 0011 and 0015 name |

### Group 2: these need a discussion
Each one has at least one value that is held outside the repo or could only be drawn from history.

| ADR | Value(s) not in a file, and where they live |
|---|---|
| 0006 Commits | `scopes`: could only come from history (old `cli:`, `parse:` and `stringify:` prefixes; recent commits don't use Conventional Commits) |
| 0008 Documentation | `tool` and `channels`: the remark.js.org site is built outside this repo. `audience`: the repo's visibility is a GitHub setting |
| 0009 Branching | `merge`: the allowed merge methods are a GitHub repo setting. `prefixes`: could only come from history |
| 0011 Forge & CI | `gate`: whether the checks are required is set by a GitHub ruleset |
| 0012 Delivery | `release_notes`: written on GitHub Releases (`changelog.md` points there). `environments`: `npm publish` runs from the maintainer's machine |
| 0015 Secrets | `storage`: the npm publish token lives on the maintainer's machine |
| 0017 Agent tooling | `hosts`: which agents contributors use isn't recorded in the repo |
| 0019 Vulnerabilities | `scanner`: Dependabot alerts may be turned on in GitHub settings |
| 0020 Adding deps | `approver`: a policy that isn't written anywhere. Also, `.npmrc` sets `package-lock=false`, which conflicts with fixed rule 5 (lockfile committed) |
| 0022 Review & merge | `by` and `approvals`: set by the GitHub ruleset |
| 0024 Code scanning | `tool`: CodeQL "default setup" may be on in GitHub settings |
| 0026 Agent identity | `identity`: lives in GitHub accounts and on the maintainer's machine |

### Proposed order
1. Group 1, in list order, but with **0025 moved to the end** (it depends on what 0011 and 0015 name) and **0021 moved after 0012** (it only applies once 0012 says the repo ships a `package`).
2. Group 2, in list order.

**Do you agree with this order, or would you like a different one?** You can also tell me to skip any ADR now. (There's no question tool in this session, so just reply here.)
