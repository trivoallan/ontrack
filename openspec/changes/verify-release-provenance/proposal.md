Issue served: trivoallan/ontrack#105

# Proposal

## Why

ADR-0021 rules build level 2 for the published package. The release workflow
now publishes with the provenance flag, but the last version on the registry
(0.3.0) predates it and carries registry signatures only. Until a release
made after the flag is checked on the registry, nothing shows that the
attestation is actually attached.

## What Changes

- After the next release, the new version is installed in a scratch project
  and `npm audit signatures` is run there; the package must be listed among
  those with a verified attestation.
- If it is not, the cause is investigated: why trusted publishing did not
  attach an attestation, and the finding is reported back on the issue.

## Capabilities

### New Capabilities
<!-- none: release verification only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- No file of the package, its behaviour or its dependencies changes.
- Depends on a release happening first; the verification cannot be done
  before it.
- A failure may lead to a follow-up change to the release workflow.
