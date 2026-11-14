# Spec-Driven With ADR OpenSpec Schema

`spec-driven-with-adr` is for changes that need the standard proposal-to-tasks
OpenSpec flow plus durable Architecture Decision Records.

Key references:
- Article: https://intent-driven.dev/blog/2026/04/29/spec-driven-development-with-adr/

[![Spec-Driven Development with ADR](https://img.youtube.com/vi/y5oemaPsmOA/hqdefault.jpg)](https://youtu.be/y5oemaPsmOA)

- Good fit: architectural changes, platform decisions, cross-module work, new
  service boundaries, technology choices, or changes where future contributors
  need a persistent decision trail.
- Not a good fit: small tactical fixes, content-only edits, simple UI changes,
  or work where `specs -> tasks` is enough.

## This copy is a fork

Copied from [openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas)
at commit `4bb6de2f57c9275a18a4106341fe4632f5026ac6`, as
[ADR-0016](../../../docs/adr/trivoallan/ADR-0016-changes.md) rules, and
changed on three points so that it writes in the repository's decision log
instead of starting a second one:

1. ADRs are read from and written in `docs/adr/` (subdirectories included
   when reading), not a top-level `adr/`.
2. They follow ADR-0001's format: Nygard sections and its frontmatter,
   `supersedes:` included.
3. They are named `ADR-NNNN-slug.md`.

It does not follow upstream: a new version is merged by hand from the commit
above. `openspec/config.yaml` activates it with `schema: spec-driven-with-adr`.

## Stage Gates

Artifact order:
`proposal -> specs -> design -> adr -> tasks`

Gate expectations:
- `specs` must be based on the capabilities identified in `proposal.md`.
- `design` must account for the proposal, specs, and currently in-force ADRs.
- `adr` completes by writing `openspec/changes/<change>/adr.md`, a concise
  ADR review manifest created after design and before task planning.
- `tasks` are planned only after proposal, specs, design, and ADR artifacts are
  complete.

## ADR Persistence

`openspec/changes/<change>/adr.md` is the per-change ADR review artifact used
for OpenSpec artifact completion. It records that ADR review happened, lists
the in-force ADR context that was reviewed, and references any durable ADR files
created for the change.

Durable ADR files are written in `docs/adr/`, not inside the OpenSpec change
folder. Create `docs/adr/ADR-NNNN-slug.md` only when the change introduces a
major durable architectural decision. The body of a ruled ADR is frozen. If a
future decision changes a prior ADR, create a new ADR that lists it in
`supersedes:` and leave the original text unchanged.

## Associated Skills

`skills.txt` lists the skills upstream pairs with this schema. They are not
installed here: ADR-0016 rule 3 and ADR-0017 rule 5 allow it only on explicit
request in a session.
