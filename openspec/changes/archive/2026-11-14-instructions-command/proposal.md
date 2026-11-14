# Proposal

## Why

Coding agents read `AGENTS.md`, not the ADRs where a repository records its
decisions. In ontrack's own history, only 6 of 10 commits carry a scope. The
decisions already exist in machine-readable form: a trivoallan/governance ADR
ships `traits:` keys left empty (the question), and the repository fills them
when it rules (the answer), for example
`commits: { scopes: [api, cli, docs], tool: commitlint }`. These answers must
reach the agent without someone copying them by hand.

## What Changes

- New command `ontrack instructions`. It prints to standard output a Markdown
  block between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`, ready to
  paste into `AGENTS.md`.
- The block holds, for each ADR of the repository that is `accepted`, not
  superseded, and carries a `traits:` block, its title, its reference, and its
  `traits:` block copied verbatim as YAML. ontrack does not interpret the values.
- The ADRs still `proposed` are listed under "Not yet decided", so that an
  agent does not take a recommendation for a decision.
- The ADRs read are the repository's own: `docs/adr/*.md` and
  `docs/adr/<namespace>/*.md`. Sources in `node_modules` are not read: a
  shipped ADR's traits are empty until the repository rules.
- The same top-level trait key in two decided ADRs is an error (exit code `1`)
  that names both. Superseding one of them settles it.
- `instructions` writes no file. Writing the block into `AGENTS.md`, and having
  `plan` report a stale block, are left to `apply`.
- `ontrack --help` lists `instructions`. The README documents the output
  contract first.

## Capabilities

### New Capabilities
- `instructions`: which ADRs carry decided traits, conflicts between them, and
  the `ontrack instructions` output contract.

### Modified Capabilities
- `cli`: the "Command help" requirement lists `instructions` next to `plan`.

## Impact

- New `src/instructions.mjs` and `src/commands/instructions.mjs`. `src/cli.mjs`
  registers the command. `src/revision.mjs` exports its frontmatter reader, and
  `src/plan.mjs` exports its `*.md` lister.
- `README.md`: a new section for the `instructions` output contract.
- New `test/instructions.test.mjs`; `test/cli.test.mjs` checks the help text.
- No new dependency.
