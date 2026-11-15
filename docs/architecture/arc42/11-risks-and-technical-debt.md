---
title: Risks and Technical Debt
---

# Risks and Technical Debt

## Rulings the repository does not follow yet

Each gap between a ruled ADR and the repository is a tracking issue
([ADR-0014](../../adr/engineering/ADR-0014-work-tracking.md)). The issue says
what is missing and closes when the gap closes, so this list holds numbers
and titles only. The
[open issues](https://github.com/trivoallan/ontrack/issues) are the current
state.

| Issue | Gap | ADR it serves |
| --- | --- | --- |
| [#39](https://github.com/trivoallan/ontrack/issues/39) | Release tagged versions with release-please | [ADR-0012](../../adr/engineering/ADR-0012-delivery.md) |

## Risks that follow from the design

| Risk | Why it is accepted |
| --- | --- |
| The frontmatter scanner is not a YAML parser: a frontmatter that is valid YAML but unusual (a key that is not at column zero, a multi-line value) may be read as `unreadable` or `undetermined`. | The outcome is a category a person sees in `plan`, never a silent write. See [Solution Strategy](04-solution-strategy.md). |
| A `check:` command comes from an imported ADR and runs through the shell with the caller's environment. | It runs only once the repository holds the ADR as `accepted`, which is a reviewed change. The commands reference says to read it as one reads an npm install script. |
| This document, the LikeC4 model and the code are kept in step by hand. | Each section names the files it was written from, and a change that adds a module or an import includes [Building Block View](05-building-block-view.mdx) and `docs/architecture/model/model.c4`. |
