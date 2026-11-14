# Proposal

## Why

ADR-0012 rules `delivery.release_tool: release-please` and one environment,
`github`, triggered on `tag`. None of it exists: no tag, no release,
`package.json` at `0.1.0`, and the README installs from `main` without a
ref, so a user gets whatever `main` holds that day and cannot name what they
run. Source: trivoallan/ontrack#39.

## What Changes

- A release-please workflow on pushes to `main` that keeps a release pull
  request open; merging it bumps `package.json`, writes `CHANGELOG.md`, tags
  `vX.Y.Z` and creates the GitHub release.
- release-please configuration and manifest files.
- The README installs a tagged version
  (`ontrack@git+https://github.com/trivoallan/ontrack.git#vX.Y.Z`), and
  release-please keeps that version current.
- One CI secret, named `RELEASE_PLEASE_TOKEN`, whose value a maintainer sets
  on GitHub.

## Capabilities

### New Capabilities
<!-- none: release tooling and documentation, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- New `.github/workflows/release.yml`, `release-please-config.json`,
  `.release-please-manifest.json`, and a generated `CHANGELOG.md`.
- `README.md` (install section), `package.json` and `package-lock.json`
  (version, written by release-please from then on).
- A repository secret to create by hand; the first release is `v0.2.0`.
- Versions now follow commit messages: a badly typed squash title produces a
  wrong version, which is what the commitlint change
  (`enforce-commitlint-in-ci`) guards against.
