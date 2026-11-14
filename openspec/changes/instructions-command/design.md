# Design

## Context

See proposal.md (Why). trivoallan/governance defines what a trait is, in its
ADR-0001. A governance ADR arrives `proposed` with its `traits:` keys empty.
The repository rules in its own copy: it fills the keys and switches the
status to `accepted`, or it removes the block and switches to `rejected`.
Values are structured YAML, such as maps and lists.

`src/revision.mjs` already bounds the frontmatter without a YAML parser:
`frontmatter(text)` returns the lines between the fences, or `null`.
`readTitle` reads the title. A command is a module with `command`,
`describe` and `handler({ io })`, whose return value is the exit code. A
thrown error becomes code `1`.

## Goals / Non-Goals

**Goals:**
- A pure step (`buildInstructions(root)`) and a formatter, testable without
  the CLI, the same way `plan` is built.

**Non-Goals:**
- Interpreting, validating or rendering trait values as prose. Checking that
  a ruled ADR has no empty key is the job of governance's `.mdschema.yml`.
- Writing `AGENTS.md`, finding or replacing an existing block, or reporting a
  stale block: these belong to `apply`.
- Reading sources in `node_modules`.

## Decisions

**The traits block is copied verbatim, not parsed.**
ontrack bounds the block (the indented lines after `traits:`), dedents it, and
prints it in a `yaml` code block. Agents read YAML natively, and governance
says the trait "is read without interpretation". The only structure ontrack
reads is the top-level keys, used to detect conflicts.
*Alternatives:* the `yaml` dependency to render each value as a line of
prose, which is a heavy addition for a rendering an agent does not need; or
a homemade parser, which would sooner or later misread a flow list or a
quoted value.

**Only the repository's copies are read.**
A shipped ADR holds a question, not an answer. Reading `node_modules` would
give empty keys. Before `apply`, the copies exist only when someone copied
them by hand. That is the honest state: nothing has been decided yet.

**Decided means `accepted` and not superseded.**
A superseded ADR stays in the directory as a log, so ignoring supersession
would produce false conflicts between an ADR and its replacement. Only an
`accepted` ADR supersedes, because a proposal does not yet replace anything.
Names in `supersedes:` resolve in the superseding ADR's own directory unless
they carry a `<namespace>/` or `local/` prefix. This lets a local ADR
replace an inherited one without collisions between namespaces.

**Pending ADRs are listed, not hidden.**
An agent that does not know a question is open tends to apply the Decision
section's recommendation as if it had been ruled. One line per pending ADR
tells it otherwise.

**Conflicts are errors, settled by supersession.**
Two decided ADRs that answer the same key leave an agent guessing. The fix
uses the mechanism ADRs already have, so no override rule is needed.

**Exit `0` on success, never `2`.**
Printing a block is "nothing to do" under the shared exit codes. Spotting a
stale `AGENTS.md` is `plan`'s job once `apply` writes the block.

## Risks / Trade-offs

- [A value containing `<!--` or `ontrack:end`] → It would break the markers
  once `apply` searches for them. This is harmless on stdout in v1; `apply`
  must reject it.
- [A flat-layout copy of an inherited ADR is named `local/…`] → Its reference
  is approximate until the flat-layout migration (`plan`) is applied. Its
  traits are still printed.
- [A block-scalar value (`|`) holding a non-indented line] → That cannot
  happen in valid YAML. The block ends at the first non-indented line, as the
  frontmatter reader already assumes.
- [Supersession written another way than the two list forms] → It is not
  recognized, and may produce a false conflict whose message points to
  `supersedes`.
