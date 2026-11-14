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
directory, and the ADRs in it.

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
trivoallan: 1 new, 0 unchanged
  new           ADR-0001  Record significant decisions as ADRs
```

## Usage

```bash
npx ontrack --help      # list commands
npx ontrack --version
npx ontrack plan          # what importing the sources would change
npx ontrack instructions  # the decided traits, as a block for AGENTS.md
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

`instructions` prints the decided traits as a block to paste into `AGENTS.md`:

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

## Development

Development uses Node 24 (see `.nvmrc`): the coverage thresholds of `npm test`
need Node 22.8 or later. CI also runs the tests on Node 20.19.

```bash
npm install
npm test     # tests and coverage; fails below 95% lines, branches or functions
```
