# Proposal

## Why

ADR-0015 rules `secrets.guard: gitleaks`, but no pre-commit hook runs it: a
secret staged by mistake is only stopped by GitHub push protection, after the
commit exists. Source: trivoallan/ontrack#40.

## What Changes

- A committed `.githooks/pre-commit` script that runs
  `gitleaks git --pre-commit --staged --redact` and refuses the commit when
  gitleaks finds a secret, or when gitleaks is not installed.
- The README's development section says how to enable it on a clone
  (`git config core.hooksPath .githooks`) and how to install gitleaks.

## Capabilities

### New Capabilities
<!-- none: developer tooling only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- New `.githooks/pre-commit`; `README.md` (development section).
- No new npm dependency; gitleaks is a local binary each contributor
  installs.
- Not shipped: `files` stays `bin/` and `src/`.
