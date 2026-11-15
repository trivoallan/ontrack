<p align="center"><img src="docs/assets/logo.png" alt="" width="160"></p>

# ontrack

ontrack imports shared architecture decision records (ADRs) into a repository
from **tracks**. A track is an npm dependency whose `package.json` carries
an `ontrack` key; its npm alias is its namespace.

## Why

Teams that share conventions (how to commit, branch, test, deliver) tend to
copy them from repository to repository, where the copies drift. With ontrack
the conventions are written once, as ADRs in a track repository. Each ADR
asks a question and recommends an answer.

- Every repository that depends on the track imports the ADRs and answers them for itself.
- When a question changes upstream, `ontrack plan` says which answers must be taken again; a CI job can rely on its exit code.
- The answers are written to `AGENTS.md`, so coding agents follow the rules the repository decided.

## Installation

Node 22.18 or later. ontrack is published to the npm registry as
`@trivoallan/ontrack`; the command it installs is `ontrack`.

```bash
npm i -D @trivoallan/ontrack
```

The unscoped `ontrack` on the registry is another project: `npx ontrack`
runs yours only once the package above is installed in the project.

Every version is listed on the
[releases page](https://github.com/trivoallan/ontrack/releases). To install
one from the git repository instead, name its tag; npm then compiles ontrack
once, on its own:

<!-- x-release-please-start-version -->

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git#v0.4.0
```

<!-- x-release-please-end -->

Add a track with npm, under the alias of your choice:

```bash
npm i -D <alias>@npm:<track-package>
```

npm 12 fetches no git dependency by default. To install ontrack or a track
from a git repository, set `allow-git=root` in the project's `.npmrc`.

## Usage

```bash
npx ontrack --help         # list commands
npx ontrack --version
npx ontrack plan          # what importing the tracks would change
npx ontrack apply         # do it
npx ontrack instructions  # the decided traits, as a block for AGENTS.md
npx ontrack review        # a prompt asking a coding agent to import the new ADRs, to rule the proposed ones, to rule the revised ones again, or to supersede an accepted one
npx ontrack check         # run the check command of each decided ADR
```

### Exit codes

Every command shares the same exit codes:

| Code | Meaning |
|------|---------|
| `0` | Nothing to do |
| `2` | Changes pending, or a check failed |
| `1` | Error (unknown command, unreadable track…) |

A CI job can detect an out-of-date repository on `2` without parsing the output.

## Documentation

The documentation is at <https://trivoallan.github.io/ontrack/>.

- [Tutorial](https://trivoallan.github.io/ontrack/tutorial/): try ontrack on one repository, with a public track.
- [Commands](https://trivoallan.github.io/ontrack/commands/): what each command does, and the exact format of what it prints. That format is a contract.
- [File formats](https://trivoallan.github.io/ontrack/file-formats/): the `ontrack` key of a track, the frontmatter of an ADR, the rules block of `AGENTS.md`.

## Development

The code is TypeScript, written so that Node runs it as it is: nothing is
compiled to work in this repository. Development uses Node 24 (see `.nvmrc`);
CI also runs the tests on Node 22.18, the lowest supported version.

Install the dependencies with npm 12 (`npm install --global npm@12`), as CI
does on Node 24. npm 12 runs no dependency's install script unless
`package.json` names it, and it applies the three-day cooldown of `.npmrc`,
which npm 10 ignores. It needs Node 22.22.2, 24.15 or 26.

```bash
npm install
node bin/ontrack.ts plan   # the CLI, from the sources
npm test                   # tests and coverage; fails below 95% lines, branches or functions
npm run typecheck          # strict type check of bin/, src/ and test/
npm run build              # compiles bin/ and src/ to dist/, what an install ships
npm run schema             # regenerates schema/ontrack.schema.json from its model
```

Node does not run TypeScript from `node_modules`, so the installed package is
the JavaScript in `dist/`. npm builds it before publishing and when it
installs ontrack from git (`prepare`); `dist/` is never committed.

### Secret scanning

A pre-commit hook scans the staged changes with
[gitleaks](https://github.com/gitleaks/gitleaks) and refuses a commit that
holds a secret (ADR-0015). It runs the gitleaks that `mise.toml` pins, not one
from the `PATH` (ADR-0025). With [mise](https://mise.jdx.dev/installing-mise.html)
installed, at `mise.toml`'s `min_version` or later, enable it once per clone:

```bash
mise trust && mise install --locked   # gitleaks and zizmor, checked against mise.lock
git config core.hooksPath .githooks
```

Without mise or the pinned gitleaks, the hook refuses the commit rather than
skip the scan. `ontrack check` also runs zizmor (ADR-0011): run it as
`mise exec -- npx ontrack check`.

To move a pin, change the version in `mise.toml` and run `mise lock`, in one
pull request: the checksums in `mise.lock` move with it.

### Agent tooling

The repository is set up for Claude Code (ADR-0017). Its plugins are listed
in [`marketplace/.claude-plugin/marketplace.json`](marketplace/.claude-plugin/marketplace.json),
each pinned to a commit, and turned on in `.claude/settings.json`. Enabling
installs nothing, so run this once per clone, after accepting the workspace
trust dialog:

```bash
claude plugin install arc42-toolkit@ontrack-tools --scope project
```

Updating a plugin means changing its `sha` in a pull request.

The OpenSpec skills and commands in `.claude/skills/` and `.claude/commands/`
are committed as [OpenSpec](https://github.com/Fission-AI/OpenSpec) 1.13.1
generates them. To update them, regenerate with the new version and commit
the result:

```bash
npx @fission-ai/openspec@<version> update
```

### Documentation site

The pages under `docs/` are published at
<https://trivoallan.github.io/ontrack/> by a [Starlight](https://starlight.astro.build/)
site. It is a separate package in `site/`, built with Node 24, and it reads
`docs/` in place: to add a page, add a Markdown file with a `title:` under
`docs/`.

```bash
cd site
npm ci
npm run dev      # local preview, reloads on change
npm run build    # build into site/dist/, then check every internal link
```

The architecture diagrams of `docs/architecture/arc42/` are views of a
[LikeC4](https://likec4.dev/) model, the `.c4` files in
`docs/architecture/model/`. To preview the model while editing it, and to
check it as CI does:

```bash
cd site
npx likec4 serve ../docs/architecture/model      # local preview, reloads on change
npx likec4 validate ../docs/architecture/model   # fails on an unknown element or a dangling relationship
```

### Releases

[release-please](https://github.com/googleapis/release-please) keeps a pull
request titled `chore: release X.Y.Z` open, computed from the commits on
`main`. Merging it bumps the version, writes `CHANGELOG.md`, tags `vX.Y.Z`
and creates the GitHub release; it also updates the version in the
installation command above. The same workflow run then publishes that
version to the npm registry as `@trivoallan/ontrack` (ADR-0012), with a
provenance attestation.

The workflow opens that pull request with the repository secret
`RELEASE_PLEASE_TOKEN`, a fine-grained token limited to this repository
(contents and pull requests: read and write). When the token expires, the
`release` workflow fails on the next push to `main`: renew it and update the
secret.

The token's value is kept in the macOS keychain (ADR-0015), so renewing the
secret never shows it:

```bash
# store the new value (prompts for it; -U replaces the existing entry)
security add-generic-password -U -a "$USER" -s ontrack-release-please-token -w
# send it to GitHub
security find-generic-password -s ontrack-release-please-token -w | gh secret set RELEASE_PLEASE_TOKEN --repo trivoallan/ontrack
```

Publishing to npm stores no token. The `publish` job uses npm's
[trusted publishing](https://docs.npmjs.com/trusted-publishers): the
registry accepts the package because the job proves, by OIDC, that it is the
`release.yml` workflow of this repository. It is set up once, on npmjs.com,
in the package's settings, under Trusted Publisher:

| Field | Value |
| --- | --- |
| Publisher | GitHub Actions |
| Organization or user | `trivoallan` |
| Repository | `ontrack` |
| Workflow filename | `release.yml` |
| Environment name | *(empty)* |
| Allowed actions | `npm publish` |

A new configuration expires unless a publish succeeds within two days, so
create it right before merging a release pull request. If the settings of
`@trivoallan/ontrack` cannot be reached because no version exists yet,
publish the first one by hand from a checkout of its tag, then configure:

```bash
npm login
npm publish
```

Once a release has been published by the workflow, set the package's
publishing access to "Require two-factor authentication and disallow
tokens": no token can then publish it.

## License

[Apache License 2.0](LICENSE).
