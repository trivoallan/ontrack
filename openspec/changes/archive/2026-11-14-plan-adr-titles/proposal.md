# Proposal

## Why

`ontrack plan` names each ADR by its file name only (`new  ADR-0001`). A
downstream developer cannot tell what the decision is about without opening
the file, which defeats a summary meant to answer "do I need to revisit a
verdict?" at a glance. The first real run against a published source
(trivoallan/governance) made this obvious.

## What Changes

- `plan` shows each ADR's title after its name: `  new           ADR-0001  Record significant decisions as ADRs`.
- A `revised` line keeps its revision, now in parentheses after the title: `  revised       SDR-0006  Commits (revision 1 → 2)`. **BREAKING** for anyone parsing that line.
- The title is read from the frontmatter `title:` key, or else from the first `# ` heading of the body, without a leading `<name>: ` that repeats the file name.
- The title comes from the source's copy (the current question), or from the local copy for a `removed` ADR. An ADR without a title shows its name only.
- The README output contract is updated first.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `plan`: the "Output format" requirement adds the title to ADR lines and moves the revision into parentheses.
- `adr-revision`: adds a requirement for reading an ADR's title.

## Impact

- `src/revision.mjs` (new `readTitle`), `src/plan.mjs` (title in the plan and in the output), `README.md` (contract and example source), `test/revision.test.mjs`, `test/plan.test.mjs`.
- No new dependency.
