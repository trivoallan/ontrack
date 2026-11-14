# Proposal

## Why

ADR-0011 rule 3 asks for actions pinned by commit SHA, because a tag such as
`actions/checkout@v7` can be moved. `.github/workflows/test.yml` uses movable
tags in both jobs. Source: trivoallan/ontrack#37.

## What Changes

- The four `uses:` lines of `.github/workflows/test.yml` (`actions/checkout`
  and `actions/setup-node`, in the `test` and `node-20` jobs) reference a
  full commit SHA, with the tag kept in a trailing comment.
- A `.github/dependabot.yml` for the `github-actions` ecosystem, so that SHA
  updates arrive as pull requests instead of being a chore to remember.

## Capabilities

### New Capabilities
<!-- none: CI configuration only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- `.github/workflows/test.yml`, new `.github/dependabot.yml`.
- No change to the package, its behaviour or its dependencies.
- Dependabot pull request titles must pass the commit format of ADR-0006:
  prefix `chore`, no scope.
