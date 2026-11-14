# Proposal

## Why

ADR-0006 rules `commits.tool: commitlint` and a closed list of scopes, but
nothing checks either: an off-format message or an invented scope reaches
`main` unnoticed. It matters more once versions are generated from the
history (release-please, ADR-0012). Source: trivoallan/ontrack#33.

## What Changes

- A commitlint configuration: Conventional Commits with its eleven types,
  and `scope-enum` set to the scopes of ADR-0006 (`apply`, `cli`,
  `governance`, `instructions`, `openspec`, `plan`, `review`, `revision`,
  `sources`). A message without a scope stays valid.
- A CI job that lints the **pull request title**: with squash merges
  (ADR-0009) the title is the commit that lands on `main`.
- The ruleset on `main` requires that job, so the check blocks
  (`forge.gate: blocking`, ADR-0011).

## Capabilities

### New Capabilities
<!-- none: CI and tooling only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- New `commitlint.config.mjs`, new `.github/workflows/commitlint.yml`.
- Two dev dependencies: `@commitlint/cli`, `@commitlint/config-conventional`.
- GitHub ruleset `27253716` gains a required check (needs admin rights).
- A new subcommand or module needs its scope added to ADR-0006 **and** to the
  configuration.
