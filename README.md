<p align="center"><img src="docs/assets/logo.png" alt="" width="160"></p>

# ontrack

ontrack imports inherited ADRs and OpenSpec schemas into a repository from
**sources**. A source is an npm dependency whose `package.json` carries an
`ontrack` key; its npm alias is its namespace.

## Installation

Node 20.19 or later.

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git
```

Add a source with npm, under the alias of your choice:

```bash
npm i -D <alias>@git+<source-repository-url>
```

### Example source

[trivoallan/governance](https://github.com/trivoallan/governance) is a
minimal source: a `package.json` whose `ontrack` key points to its `adr/`
directory, and the ADRs in it. Its catalogue grows over time, so the output
below is a snapshot.

```json
{
  "name": "governance",
  "ontrack": { "adr": "adr", "namespace": "trivoallan" }
}
```

Install it under the namespace it proposes, then see what importing it would
change:

```bash
npm i -D trivoallan@git+https://github.com/trivoallan/governance.git
npx ontrack plan
```

```
trivoallan: 4 new, 0 unchanged
  new           ADR-0001-record-architecture-decisions
  new           ADR-0002-localization
  new           ADR-0006-commits
  new           ADR-0009-branching
```

## Usage

```bash
npx ontrack --help         # list commands
npx ontrack --version
npx ontrack plan          # what importing the sources would change
npx ontrack apply         # do it (see below)
npx ontrack instructions  # the decided traits, as a block for AGENTS.md
npx ontrack review        # a prompt asking a coding agent to rule the proposed ADRs
```

### Exit codes

Every command shares the same exit codes:

| Code | Meaning |
|------|---------|
| `0` | Nothing to do |
| `2` | Changes pending |
| `1` | Error (unknown command, unreadable source…) |

A CI job can detect an out-of-date repository on `2` without parsing the output.

## `ontrack plan` output contract

`plan` never modifies a file and makes no network call. Its output follows
this format, one block per source, sources sorted by alias:

```
platform: 2 revised, 1 new, 3 unchanged
  revised       SDR-0006  Commits (revision 1 → 2)
  revised       SDR-0010  Forge and CI (revision 3 → 4)
  new           SDR-0015  Observability
migration: 5 files docs/adr/ → docs/adr/platform/
  move          SDR-0001.md
  move          SDR-0003.md
  move          SDR-0006.md
  move          SDR-0008.md
  move          SDR-0010.md
```

- Line 1, per source: `<alias>: <count per category>`, in the order revised, new, removed, undetermined, unreadable, unchanged. Zero counts are omitted, except "unchanged".
- Then one line per ADR that is not unchanged, sorted by name: two spaces, the category in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title, unless the name already carries a slug (`ADR-0006-commits`). A `revised` line ends with `(revision <local> → <upstream>)`.
- The title is the frontmatter `title:` key, or else the first `# ` heading, without a leading `<name>: ` that repeats the file name. It comes from the source's copy (the local copy for a `removed` ADR). An ADR without a title shows its name only.
- Categories: `new` (not imported yet), `revised` (the question moved upstream), `removed` (no longer shipped by the source), `undetermined` (no usable `revision:` to compare), `unreadable` (no recognizable frontmatter).
- A flat-layout migration (`docs/adr/<file>` that belongs to the source but is not under `docs/adr/<alias>/`) is always shown: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one `move` line per file.
- When there is nothing to do, one line per source (`platform: 14 unchanged`), and the exit code is `0`. Any other category, or a migration, gives `2`.
- With no source at all, `plan` prints `no ontrack source found` and exits with `0`.

Any change to this format goes through this README first.

## `ontrack apply`

`apply` brings the repository in line with what `plan` reports, in one
command. It is the only command that writes, it never commits, and it never
touches an ADR you already decided on. Besides `docs/adr/`, it writes one
file: the rules block of `AGENTS.md` (see below).

```bash
npx ontrack apply --dry-run          # print what apply would do, write nothing
npx ontrack apply                    # import new ADRs, move flat files
npx ontrack apply --prune            # also delete ADRs the source no longer ships
npx ontrack apply --confirm SDR-0003 # declare an undetermined verdict still holds
npx ontrack apply --confirm all      # same, for every undetermined ADR
```

What it does, per source:

- `imported`: a `new` ADR is copied, byte for byte, into `docs/adr/<alias>/`.
- `moved`: a flat-layout file moves from `docs/adr/` to `docs/adr/<alias>/` (`git mv` in a git repository, a plain rename otherwise).
- `pruned`, only with `--prune`: a `removed` ADR is deleted.
- `confirmed`, only with `--confirm`: an `undetermined` ADR gets the upstream `revision:`; nothing else in the file changes.

A `revised` or `unreadable` ADR is never written to or deleted (only moved by
a migration): its verdict must be taken again by a person.

Its output lists the actions, then every Markdown link the migration breaks
(links to a moved file, and links held by a moved file to a file left in
place; it lists them, it does not rewrite them), then what still needs a
human, in the `plan` format:

```
dry run: nothing written
platform: 1 imported, 2 moved
  imported      SDR-0015  Observability
  moved         SDR-0006.md
  moved         SDR-0010.md
links to update:
  docs/arc42.md:12  adr/SDR-0006.md → adr/platform/SDR-0006.md
remaining:
platform: 1 revised, 2 unchanged
  revised       SDR-0010  Forge and CI (revision 3 → 4)
```

The first line only appears with `--dry-run`. With nothing to do, `apply`
prints the same output as `plan`. Exit codes are those of `plan`, computed on
what remains after the run: `0` nothing left, `2` something still needs a
human, `1` error. Every check runs before the first write, so an error never
leaves a half-applied repository.

## `ontrack instructions` output contract

Coding agents read `AGENTS.md`, not ADRs. A trivoallan/governance ADR ships
its question as empty **trait** keys. Your repository answers in its own copy:
it fills the keys and switches `status:` to `accepted`.

```yaml
---
adr: ADR-0006
title: Commits
status: accepted
traits:
  commits:
    scopes: [api, cli, docs]
    tool: commitlint
---
```

`instructions` prints the decided traits as the rules block of `AGENTS.md`. You do not paste it: `ontrack apply` writes it (see below), and `instructions` only previews it:

~~~
<!-- ontrack:begin -->
## Project rules (ontrack)

### Commits (trivoallan/ADR-0006-commits)

```yaml
commits:
  scopes: [api, cli, docs]
  tool: commitlint
```

### Not yet decided

- Localization (trivoallan/ADR-0002-localization)

<!-- ontrack:end -->
~~~

- The ADRs read are the repository's: `docs/adr/*.md`, named `local/<file name without .md>`, and `docs/adr/<namespace>/*.md`, named `<namespace>/<file name without .md>`. Sources in `node_modules` are not read, because a shipped ADR holds a question, not an answer.
- An ADR carries decided traits when it is `accepted`, is not superseded, and has an indented `traits:` block. The block is copied verbatim, dedented, and its values are never interpreted. `traits: {}` declares nothing, and any other inline value is an error.
- An `accepted` ADR supersedes the ADRs named in its `supersedes:` key (`[A, B]` or `- A` lines). A plain name matches an ADR's `adr:` value, or its file name, in the same directory. `<namespace>/<name>` and `local/<name>` reach another directory.
- `proposed` ADRs are listed under "Not yet decided". Every other status is ignored.
- Two decided ADRs sharing a top-level trait key are an error that names both. Superseding one of them settles it.
- Sections are sorted by reference. With nothing decided and nothing pending, the block holds only its heading.
- `instructions` never writes a file and makes no network call. It exits with `0`, or with `1` on an error; it never returns `2`.

Any change to this format goes through this README first.

## `ontrack review` prompt contract

An ADR stays `proposed` until someone rules. `review` prints a prompt that
asks a coding agent to rule them with you, one at a time: the agent proposes,
you agree, and only then does it write.

```bash
claude "$(npx ontrack review)"           # every proposed ADR, in sequence
claude "$(npx ontrack review ADR-0006)"  # this one alone
```

Without an argument, the prompt lists every `proposed` ADR and gives the
steps once:

~~~
Review the architecture decision records of this repository that are still `proposed`, one at a time, in this order:

- `docs/adr/trivoallan/ADR-0002-localization.md` (Localization)
- `docs/adr/trivoallan/ADR-0006-commits.md` (Commits)

Each is a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where an ADR itself says how to rule, it prevails over this prompt.

For each ADR, in turn:

1. Read its file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under `traits:` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose `rejected` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the `traits:` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run `npx ontrack apply` to update AGENTS.md.

Then take the next ADR in the list. Do not start an ADR before the previous one is ruled.
~~~

With an argument, the prompt names that ADR alone, with the same steps. It is
the same text for every ADR, apart from its path and title:

~~~
Review one architecture decision record of this repository: `docs/adr/trivoallan/ADR-0006-commits.md` (Commits).

It is `proposed`: a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where the ADR itself says how to rule, it prevails over this prompt.

1. Read its file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under `traits:` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose `rejected` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the `traits:` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run `npx ontrack apply` to update AGENTS.md.
~~~

- The ADRs read are those of `instructions`. Without an argument, the prompt lists every `proposed` ADR in reference order, the order of "Not yet decided", even when there is only one.
- An argument with a `/` is a reference (`trivoallan/ADR-0006-commits`). Any other argument is a file name without `.md` (`ADR-0006-commits`) or an `adr:` identifier (`ADR-0006`), looked up in every directory. It must name exactly one ADR, and that ADR must be `proposed`.
- An ADR without a title is named by its path alone.
- `review` never writes a file and makes no network call. Two decided ADRs sharing a trait key do not stop it.
- It exits with `2` when it prints a prompt, because a ruling is pending. With no `proposed` ADR it exits with `0`, says so on standard error and prints nothing, so that no agent receives that sentence as a prompt. An unknown, ambiguous or already ruled name is an error, with `1`.

Any change to this prompt goes through this README first.

## The rules block in `AGENTS.md`

`ontrack apply` keeps the block printed by `ontrack instructions` current in
the `AGENTS.md` at the root of the repository, and `ontrack plan` reports its
state. The text between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`
belongs to ontrack and is overwritten; everything outside the markers is
yours and is never touched.

- `apply` replaces the block when the file holds one marker pair, appends it after an empty line when the file has no marker, and creates `AGENTS.md` when there is none. It prints `AGENTS.md: rules block updated` or `AGENTS.md: rules block created`. With `--dry-run` it prints `AGENTS.md: rules block to update` or `AGENTS.md: rules block to create` and writes nothing.
- `plan` prints `AGENTS.md: rules block missing` or `AGENTS.md: rules block out of date` and exits with `2`, like any other pending change.
- The block is needed as soon as one ADR is decided or pending. With none, and no marker in `AGENTS.md`, nothing is printed and no file is created.
- When the block cannot be written (a marker without its pair, more than one pair, or two decided ADRs sharing a trait key), only this step is skipped: the ADRs are still handled, `AGENTS.md` is left untouched, and both commands print `AGENTS.md: skipped, <reason>` and exit with `2`.
- Claude Code reads `AGENTS.md` on its own only when the repository has no `CLAUDE.md` and no `CLAUDE.local.md`. When one of them exists and `CLAUDE.md` holds no line `@AGENTS.md`, both commands print `AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md`. ontrack never writes `CLAUDE.md`; this warning does not change the exit code.

## Development

Development uses Node 24 (see `.nvmrc`): the coverage thresholds of `npm test`
need Node 22.8 or later. CI also runs the tests on Node 20.19.

```bash
npm install
npm test     # tests and coverage; fails below 95% lines, branches or functions
```

## License

[Apache License 2.0](LICENSE).
