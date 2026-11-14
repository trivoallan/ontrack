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
  new           ADR-0001-record-architecture-decisions  Record architecture decisions
  new           ADR-0002-localization  Localization
  new           ADR-0006-commits  Commits
  new           ADR-0009-branching  Branching
```

## Usage

```bash
npx ontrack --help      # list commands
npx ontrack --version
npx ontrack plan        # what importing the sources would change
npx ontrack apply       # do it (see below)
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
- Then one line per ADR that is not unchanged, sorted by name: two spaces, the category in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title. A `revised` line ends with `(revision <local> → <upstream>)`.
- The title is the frontmatter `title:` key, or else the first `# ` heading, without a leading `<name>: ` that repeats the file name. It comes from the source's copy (the local copy for a `removed` ADR). An ADR without a title shows its name only.
- Categories: `new` (not imported yet), `revised` (the question moved upstream), `removed` (no longer shipped by the source), `undetermined` (no usable `revision:` to compare), `unreadable` (no recognizable frontmatter).
- A flat-layout migration (`docs/adr/<file>` that belongs to the source but is not under `docs/adr/<alias>/`) is always shown: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one `move` line per file.
- When there is nothing to do, one line per source (`platform: 14 unchanged`), and the exit code is `0`. Any other category, or a migration, gives `2`.
- With no source at all, `plan` prints `no ontrack source found` and exits with `0`.

Any change to this format goes through this README first.

## `ontrack apply`

`apply` brings the repository in line with what `plan` reports, in one
command. It is the only command that writes, it never commits, and it never
touches an ADR you already decided on.

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

## Development

Development uses Node 24 (see `.nvmrc`): the coverage thresholds of `npm test`
need Node 22.8 or later. CI also runs the tests on Node 20.19.

```bash
npm install
npm test     # tests and coverage; fails below 95% lines, branches or functions
```
