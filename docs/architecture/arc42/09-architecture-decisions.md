---
title: Architecture Decisions
---

# Architecture Decisions

The decisions are the ADRs under
[`docs/adr/`](https://github.com/trivoallan/ontrack/tree/main/docs/adr). On
the documentation site they are the pages of the `adr` group in the
navigation, each opening with its status and its decided traits. They are
not repeated here.

ontrack maintains that directory with ontrack. The ADRs under
`docs/adr/<namespace>/` are imported from a track declared in the dev
dependencies of `package.json`: `ontrack plan` says when a convention moved
upstream, `ontrack apply` imports new ones, and each is ruled in its own
file, where the reason for the ruling is written. A decision that changes is
not edited: a new ADR placed directly in `docs/adr/` supersedes it. The
rulings in force are gathered in the instructions block of
[`AGENTS.md`](https://github.com/trivoallan/ontrack/blob/main/AGENTS.md).
