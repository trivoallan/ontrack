# Design

## Context

See proposal.md (Why). `discoverSources(root)` (capability `sources`) lists
sources with their ADR directory; `readRevision` and `compareRevision`
(capability `adr-revision`) work on file contents. The CLI calls a command's
`handler({ ...argv, io })` and uses its return value as the exit code.

## Goals / Non-Goals

**Goals:**
- A pure planning step, testable without the CLI, and a thin command that prints it.

**Non-Goals:**
- `apply`, schemas, traits, `--json`, counting links a migration would break (v2).
- Recursing into a source's ADR subdirectories.

## Decisions

**Two layers: `buildPlan(root) → Plan` and `formatPlan(plan) → string`, in `src/plan.mjs`.**
The command module only calls them and maps the plan to an exit code. Tests
check the plan as data, and the output format separately, against README
examples. *Alternative:* one function that prints as it goes, which makes
every test a string comparison.

**The project root comes from `io.cwd()`.**
`bin/ontrack.mjs` passes `process`, which has `cwd()`; tests pass
`{ cwd: () => root }`. *Alternative:* a `--cwd` option, a user-visible flag
nobody asked for.

**`unreadable` joins the output contract.**
An unreadable ADR needs a different fix (repair the file) from an
undetermined one (confirm the verdict). The README is updated first, as the
contract requires.

**Exit `2` on anything a human must act on**, including `undetermined` and
`unreadable`. A historical repository stays in `2` until its verdicts are
confirmed, which is the honest answer for CI. *Alternative:* only on upstream
movement, which lets a never-confirmed verdict pass silently.

**Migration format is generic.** `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`
then one `move` line per file, in the same 12-character category column as ADR lines. The README's example pattern
(`docs/adr/SDR-*.md`) was specific to one catalogue.

**Read errors are errors.** A missing or unreadable source ADR directory
throws with the source name and path; the CLI turns it into code `1`. A
local file that cannot be read is not a special case: Node's error message
names it and the CLI reports it.

## Risks / Trade-offs

- [Large catalogues] → One `readdir` and one read per file; fine for tens of ADRs.
- [A flat file that only shares its name with a source ADR] → It is treated as the imported copy. Name collisions are what namespacing removes once the migration is applied.
