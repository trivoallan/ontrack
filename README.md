# ontrack

ontrack imports inherited ADRs and OpenSpec schemas into a repository from
**sources**. A source is an npm dependency whose `package.json` carries an
`ontrack` key; its npm alias is its namespace.

## Installation

Node 24 LTS or later.

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git
```

Add a source with npm, under the alias of your choice:

```bash
npm i -D <alias>@git+<source-repository-url>
```

## Usage

```bash
npx ontrack --help      # list commands
npx ontrack --version
npx ontrack plan        # what importing the sources would change
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
  revised       SDR-0006  revision 1 → 2
  revised       SDR-0010  revision 3 → 4
  new           SDR-0015
migration: 5 files docs/adr/ → docs/adr/platform/
  move          SDR-0001.md
  move          SDR-0003.md
  move          SDR-0006.md
  move          SDR-0008.md
  move          SDR-0010.md
```

- Line 1, per source: `<alias>: <count per category>`, in the order revised, new, removed, undetermined, unreadable, unchanged. Zero counts are omitted, except "unchanged".
- Then one line per ADR that is not unchanged, sorted by name: two spaces, the category in a 12-character column, two spaces, the file name without `.md`. A `revised` line ends with `revision <local> → <upstream>`.
- Categories: `new` (not imported yet), `revised` (the question moved upstream), `removed` (no longer shipped by the source), `undetermined` (no usable `revision:` to compare), `unreadable` (no recognizable frontmatter).
- A flat-layout migration (`docs/adr/<file>` that belongs to the source but is not under `docs/adr/<alias>/`) is always shown: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one `move` line per file.
- When there is nothing to do, one line per source (`platform: 14 unchanged`), and the exit code is `0`. Any other category, or a migration, gives `2`.
- With no source at all, `plan` prints `no ontrack source found` and exits with `0`.

Any change to this format goes through this README first.

## Development

```bash
npm install
npm test     # tests and coverage; fails below 95% lines, branches or functions
```
