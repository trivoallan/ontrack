# Design

## Context

See proposal.md for motivation. The document describes a small monolithic
CLI (ADR-0003): ten modules under `src/`, four subcommands (`plan`, `apply`,
`instructions`, `review`), one runtime dependency. Three other sources
already hold part of what arc42 asks for:

- `docs/adr/trivoallan/`: the decisions (section 9) and most constraints
  (section 2).
- `openspec/specs/`: behaviour, per capability (`sources`, `plan`, `apply`,
  `agents-file`, `instructions`, `review`, `adr-revision`, `cli`).
- The LikeC4 model, not written yet, which ADR-0010 makes the only source of
  structural diagrams for sections 3, 5 and 7.

The audience is `public` (ADR-0008) and the language English (ADR-0002).

## Goals / Non-Goals

**Goals:**
- Every architecture fact has one place, and a reader of any section is one
  link away from the authoritative source.
- The document is true on the day it merges: written from the code, not
  from intent.

**Non-Goals:**
- Diagrams of structure (the model's job) or the site that renders them.
- Restating behaviour that a spec defines, or a decision an ADR records.
- Describing the changes still in flight (TypeScript, zod, releases) as if
  they were done.

## Decisions

**What each section holds**, so that two authors would write the same
document:

| Section | Content | Source |
| --- | --- | --- |
| 1 Introduction and Goals | what ontrack is for, its three top quality goals (repeatable imports, no silent overwrite of a ruled ADR, few dependencies), stakeholders (repository maintainer, source author, coding agent) | README, specs' Purpose lines |
| 2 Constraints | Node ≥ 20.19, installed from git, the rulings that constrain design | `package.json`, ADR-0003/0004/0005/0012, linked |
| 3 Context and Scope | prose and a table of neighbours: the project's `package.json` and `node_modules`, source packages, `docs/adr/<namespace>/`, `AGENTS.md`, the agent reading printed prompts | `src/sources`, `src/apply`, `src/agents`, `src/review` |
| 4 Solution Strategy | plan-then-apply; npm as the transport; revision comparison instead of content diff; frontmatter read without a YAML parser | specs `plan`, `apply`, `adr-revision` |
| 5 Building Block View | one paragraph per module and the dependency direction between them (commands → domain modules → `revision`/`sources`) | `src/` imports |
| 6 Runtime View | two Mermaid sequence diagrams: `ontrack plan`, `ontrack apply` | `src/commands/` |
| 7 Deployment View | short: a dev dependency run with `npx` on a developer machine or in CI | ADR-0012 |
| 8 Cross-cutting Concepts | error reporting and exit codes, idempotence of `apply`, the managed block of `AGENTS.md`, test strategy and coverage | specs `cli`, `agents-file`, ADR-0007 |
| 9 Architecture Decisions | one link to `docs/adr/`, and how ontrack itself maintains that directory | ADR-0010 |
| 10 Quality Requirements | the quality goals of section 1 as checkable scenarios, linked to the spec scenarios that test them | specs |
| 11 Risks and Technical Debt | the gaps the open tracking issues record (#30 to #40), linked | GitHub issues |
| 12 Glossary | source, namespace, alias, ruling, revision, trait, plan, managed block | README, specs |

**Structural sections are prose now, views later.** Sections 3, 5 and 7 end
with one line saying their diagram comes from the model. No Mermaid
stand-in is drawn: ADR-0010 forbids redrawing in Mermaid what the model
holds, and a temporary diagram is exactly the second source that drifts.

**Links to specs and ADRs are relative file links.** They work on GitHub
today; the site rewrites them at build time. Links to `openspec/specs/`,
outside `docs/`, are full GitHub URLs, because the site does not serve that
directory.

**Section 11 links to issues rather than listing debt inline.** The issues
close as the gaps close; a copied list would need editing each time.

## Risks / Trade-offs

- [The document ages as the pending changes land] → each of those changes
  touches at most one section (2, 5 or 7); section 11 points at the issues
  instead of describing their state.
- [Short sections look empty] → accepted by ADR-0010: a file with one honest
  line beats a missing file.
- [Prose in section 5 overlaps the future model] → the prose says what each
  module is responsible for; the model says what exists and what depends on
  what. The overlap is reviewed when the model lands.
