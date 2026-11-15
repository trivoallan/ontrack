## MODIFIED Requirements

### Requirement: ADRs are added under docs/adr
With the `adr` entry enabled, the agent SHALL add ADRs only as new `ADR-NNNN-slug.md` files directly in `docs/adr/local`, the directory ontrack assigns to a repository's own ADRs. A caller MUST NOT be able to choose another directory. The refusal of an ADR that declares a `check:` command SHALL stay as it is.

#### Scenario: An ADR in docs/adr
- **WHEN** the agent adds `docs/adr/local/ADR-0004-cache-results.md` with the `adr` entry enabled
- **THEN** `publish` accepts the file

#### Scenario: An ADR directly in docs/adr
- **WHEN** the agent adds `docs/adr/ADR-0004-cache-results.md`
- **THEN** `publish` refuses the patch and nothing is pushed

#### Scenario: An ADR elsewhere
- **WHEN** the agent adds `decisions/ADR-0004-cache-results.md`
- **THEN** `publish` refuses the patch and nothing is pushed
