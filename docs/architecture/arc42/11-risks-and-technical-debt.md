---
title: Risks and Technical Debt
---

# Risks and Technical Debt

## Rulings the repository does not follow yet

Each gap between a ruled ADR and the repository is a tracking issue
([ADR-0014](../../adr/trivoallan/ADR-0014-work-tracking.md)). The issue says
what is missing and closes when the gap closes, so this list holds numbers
and titles only. The
[open issues](https://github.com/trivoallan/ontrack/issues) are the current
state.

| Issue | Gap | ADR it serves |
| --- | --- | --- |
| [#32](https://github.com/trivoallan/ontrack/issues/32) | Publish a JSON Schema for a source's `ontrack` key | [ADR-0005](../../adr/trivoallan/ADR-0005-validation.md) |
| [#33](https://github.com/trivoallan/ontrack/issues/33) | Enforce commit format and scopes with commitlint in CI | [ADR-0006](../../adr/trivoallan/ADR-0006-commits.md) |
| [#36](https://github.com/trivoallan/ontrack/issues/36) | Model the architecture with LikeC4 | [ADR-0010](../../adr/trivoallan/ADR-0010-architecture-documentation.md) |
| [#37](https://github.com/trivoallan/ontrack/issues/37) | Pin GitHub Actions by commit SHA | [ADR-0011](../../adr/trivoallan/ADR-0011-forge-and-ci.md) |
| [#38](https://github.com/trivoallan/ontrack/issues/38) | Require the lowest-Node check on `main` | [ADR-0011](../../adr/trivoallan/ADR-0011-forge-and-ci.md) |
| [#39](https://github.com/trivoallan/ontrack/issues/39) | Release tagged versions with release-please | [ADR-0012](../../adr/trivoallan/ADR-0012-delivery.md) |
| [#40](https://github.com/trivoallan/ontrack/issues/40) | Install the gitleaks pre-commit hook | [ADR-0015](../../adr/trivoallan/ADR-0015-secrets.md) |

## Risks that follow from the design

| Risk | Why it is accepted |
| --- | --- |
| The frontmatter scanner is not a YAML parser: a frontmatter that is valid YAML but unusual (a key that is not at column zero, a multi-line value) may be read as `unreadable` or `undetermined`. | The outcome is a category a person sees in `plan`, never a silent write. See [Solution Strategy](04-solution-strategy.md). |
| A `check:` command comes from an imported ADR and runs through the shell with the caller's environment. | It runs only once the repository holds the ADR as `accepted`, which is a reviewed change. The README says to read it as one reads an npm install script. |
| This document and the code are kept in step by hand. | Each section names the files it was written from, and a change that adds a module includes [Building Block View](05-building-block-view.md). |
