# Proposal

## Why

ADR-0011 rules `forge.gate: blocking`, but the ruleset "main requires test"
only requires the `test` check. The `node-20` job, which is the only thing
checking the lowest supported Node version (`engines.node: >=20.19`), reports
without blocking: a pull request that breaks Node 20 can merge.
Source: trivoallan/ontrack#38.

## What Changes

- The ruleset "main requires test" (id `27253716`) requires the `node-20`
  status check in addition to `test`.
- ADR-0011's "Adopted as recommended" line names both required checks.

This is a GitHub setting, not a file of the repository: the change is made
through the GitHub API and nothing in the tree enforces it.

## Capabilities

### New Capabilities
<!-- none: forge setting only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- GitHub ruleset `27253716` of `trivoallan/ontrack`; needs admin rights on
  the repository.
- `docs/adr/trivoallan/ADR-0011-forge-and-ci.md` (one sentence).
- Open pull requests need a green `node-20` run to merge from then on.
- `migrate-to-typescript` raises the Node floor to 22.18 and renames this
  job `node-22`. If it lands first, this change requires `node-22` instead;
  if it lands after, it swaps the required check itself. Either way the
  intent is the same: the lowest supported Node version blocks.
