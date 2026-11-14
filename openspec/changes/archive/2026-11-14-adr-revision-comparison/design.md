# Design

## Context

See proposal.md (Why). Inherited ADRs often show, under a "More Information"
section, an example of their own frontmatter, fences included. A naive
search for the first `---` after line one would read that example on a
truncated file, and report the example's `revision:`.

## Goals / Non-Goals

**Goals:**
- Pure functions over file contents (strings in, values out), so #4 decides how to read files and what to show.

**Non-Goals:**
- Reading or writing files, writing `revision:` into a file (that is `apply`'s job).
- Parsing YAML.

## Decisions

**Rewrite from the specification, not extraction.**
The issue asked to extract existing code, but that code's licence is not
settled and ontrack is public. The spec captures the behavior; the code is
new. *Alternative:* copying with a licence check first, which blocks the
work on a decision outside this repository.

**No YAML parser.**
Two fences and a column-zero regular expression are enough to find one key.
A parser would accept far more input than needed, from files ontrack did not
write. *Alternative:* `yaml` or `js-yaml`, a dependency for one integer.

**The closing fence is searched with a stop condition.**
The search ends at the first line that cannot belong to a frontmatter (see
spec). That is what keeps a truncated frontmatter from swallowing a body
example. Block sequences at column zero (`- Jane` under `authors:`) are
allowed, because that is standard YAML for a list an author fills in.

**`unreadable` is its own category.**
A file whose frontmatter cannot be found is not "undetermined": its revision
was never read, and nothing should be said about it beyond that. #4 decides
how to show it against the output contract.

**An upstream copy without `revision:` makes the result `undetermined`.**
With nothing to compare against, calling the ADR `up-to-date` would claim
something unknown. *Alternative:* `up-to-date`, which hides a missing key
upstream.

**API.**
`readRevision(text) → number | null` and
`compareRevision(importedText, upstreamText) → 'up-to-date' | 'stale' | 'undetermined' | 'unreadable'`,
exported from `src/revision.mjs`. The frontmatter bounding stays internal.

## Risks / Trade-offs

- [A legitimate frontmatter line shape the stop condition rejects] → The file is reported `unreadable`, never misread. Add the shape to the spec when one shows up.
- [Windows line endings] → Lines are split on `\n` and fences match `---` followed by optional whitespace, so a trailing `\r` is tolerated.
