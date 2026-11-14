# Proposal

## Why

`ontrack plan` (#4) has to tell, for each imported ADR, whether the question
it answers has moved upstream. That decision rests on one value, the
`revision:` key of the ADR's frontmatter, and on reading it safely from files
ontrack did not write. Source: trivoallan/ontrack#2.

The issue asked to extract this logic from the current installation tool.
That tool's licence is not settled, and ontrack is public, so this change
**rewrites the behavior from its specification** instead of copying code.

## What Changes

- A module that finds an ADR's frontmatter without a YAML parser, bounded so that a `---` fence further down the body is never taken for its end.
- A function that reads `revision:` from that frontmatter only.
- A function that classifies an imported ADR against its upstream copy: `up-to-date`, `stale`, `undetermined` or `unreadable`.
- Only `revision:` counts: an ADR's status, filled-in fields and local verdict never make it differ.

## Capabilities

### New Capabilities
- `adr-revision`: reading an inherited ADR's `revision:` and classifying an imported ADR against its upstream copy.

### Modified Capabilities
<!-- none -->

## Impact

- New files: `src/revision.mjs`, `test/revision.test.mjs`.
- No new dependency. Not wired into the CLI yet: #4 consumes it.
