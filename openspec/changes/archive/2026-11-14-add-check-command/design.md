# Design

## Context

See proposal.md for the motivation. `src/instructions.mjs` already reads every
ADR under `docs/adr/` (reference, status, `supersedes:`, traits block) and
`buildInstructions(root)` returns the decided ADRs or throws on a trait
conflict. Frontmatter is read line by line, never with a YAML parser: values
are "read without interpretation". Commands return the exit code and write to
an injected `io`; tests build throwaway projects with `test/helpers/project.mjs`.

## Goals / Non-Goals

**Goals:**
- One deterministic command an agent can run before opening a pull request,
  and that a CI job can run unchanged.
- A failure names the decision and where to read it.

**Non-Goals:**
- A GitHub Action. It will wrap this command once the contract has been used.
- Telling ontrack what the commands compare (base branch, changed files). The
  command is the repository's, and it knows.
- Timeouts, parallel runs, a `--only <adr>` filter.

## Decisions

**The command lives in the ADR's frontmatter, as a top-level `check:` key.**
The decision and its enforcement sit in one file, and supersession already
answers the override question: a local ADR that supersedes a source's ADR
silences its check and may carry its own. Alternatives: a key inside
`traits:` (rejected: traits are copied verbatim and never interpreted, and the
command would land in `AGENTS.md`); the `ontrack` key of the source's
`package.json` (rejected: ontrack would execute text from `node_modules` that
no one in the repository reviewed, and a local ADR could not override it).

**One line, read like `status:`.** `topValue()` already returns a column-zero
value without its trailing comment and surrounding quotes. A multi-line
command belongs in a script the one line calls. Alternative: a list of
commands (rejected: `a && b` does it).

**Reuse `buildInstructions()` for the set of ADRs in force.** `readAdr()`
gains a `check` field for `accepted` ADRs. `check` reports the decided ADRs
plus the `accepted`, non-superseded ADRs that have a check and no traits. A
trait conflict therefore throws before any command runs, which is wanted:
governance that contradicts itself should not be enforced.

**`spawnSync(command, { shell: true, cwd: root, encoding: 'utf8' })`.**
Sequential and synchronous: the output order is the reference order with no
bookkeeping, and checks are few. stdin is not inherited, so a command cannot
hang on a prompt. Output is captured and printed only on failure. Any status
other than `0`, including `null` (signal) and a spawn error, is a failure:
"commitlint is not installed" must stop the agent as surely as a bad commit,
and the shell's message says why. Alternative: exit `1` when the program is
missing (rejected: exit codes 126 and 127 are also legitimate tool results,
and telling them apart buys nothing the output does not already say).

**Exit `2` on a failed check.** It keeps the three codes the CLI promises: `1`
stays "ontrack could not do its job". The `cli` requirement is reworded
accordingly.

**Tests run real shell commands** (`true`, `exit 3`, `echo x; exit 1`,
`touch marker`). No runner is injected: the commands are portable POSIX and
the suite already runs on a Unix shell.

## Risks / Trade-offs

- [A source can ship an `accepted` ADR with a `check:`, as governance does for
  ADR-0001, and `apply` copies it] → The command still only runs once it is
  committed under `docs/adr/`, where the pull request that imports it shows
  it. This is the trust already given to an npm dependency's install scripts.
  The README says so.
- [A value holding ` #` is cut there, and a value that starts and ends with
  the same quote loses both] → Documented in the README; put such a command in
  a script.
- [A slow or hanging command blocks the run] → No timeout in this change; CI
  has its own.
- [The same word `2` now means "pending" and "failed"] → Both mean "the
  repository is not where its governance says it should be", and each command
  only ever emits one of them.
- [governance's `.mdschema.yml` may not know the `check:` key] → To verify in
  that repository when it adds the key; nothing here depends on it.

## Open Questions

- Should the `AGENTS.md` block ask agents to run `ontrack check` before
  opening a pull request? Left for after the command has been used by hand.
