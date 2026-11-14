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
npx ontrack plan        # what importing the sources would change (not available yet)
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

`plan` never modifies a file. Its output follows this format:

```
platform: 2 revised, 1 new, 11 unchanged
  revised  SDR-0006  revision 1 → 2
  revised  SDR-0010  revision 3 → 4
  new      SDR-0015
migration: 14 files docs/adr/SDR-*.md → docs/adr/platform/
```

- Line 1, per source: `<alias>: <count per category>`. Zero counts are omitted, except "unchanged".
- Then, indented, only the ADRs that are not unchanged. Categories: `new`, `revised`, `undetermined`, `removed`.
- A flat-layout migration is always shown, on its own line, when there is one.
- When there is nothing to do, one line per source, and the exit code is `0`.

Any change to this format goes through this README first.

## Development

```bash
npm install
npm test     # tests and coverage; fails below 95% lines, branches or functions
```
