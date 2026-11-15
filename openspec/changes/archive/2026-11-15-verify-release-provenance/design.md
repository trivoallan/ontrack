## Context

ADR-0021 (`supply_chain.build_level: 2`) says that an unverified provenance
proves nothing and that the consumer verifies it with `npm audit signatures`.
Its own check only sees that the workflow holds the flag; whether a release
carries an attestation is read on the registry, after it. This change is that
reading, for the first release that can show one.

## Goals / Non-Goals

**Goals**
- Confirm, on a real install from the registry, that the next release has a
  verified attestation.
- If it has none, find the cause.

**Non-Goals**
- Changing the release workflow, unless the investigation shows it is needed
  (that would be its own change).
- Moving to build level 3.

## Decisions

- **Verify from a scratch project, with the registry as the only source.**
  The check must see what a consumer sees, so nothing from the repository's
  working tree is used. Alternative: inspect the workflow logs only; rejected,
  as the logs show an upload attempt, not what the registry holds.
- **No specification.** No expected behaviour of the repository moves, so the
  change skips its specs.
- **Investigation order if it fails:** the publish job's log (was the flag
  honoured), the trusted-publisher configuration on npmjs.com (repository,
  workflow file name), the npm CLI version in the job, then the job
  permissions. Cheapest and most likely causes first.

## Risks / Trade-offs

- [Registry propagation delay makes the check fail right after release] →
  retry after a few minutes before concluding.
- [The release is delayed, leaving the issue open] → the task stays pending;
  nothing else depends on it.

## Migration Plan

None: nothing is deployed.

## Open Questions

None. No in-force ADR needs revisiting.
