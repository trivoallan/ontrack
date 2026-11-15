---
title: File formats
description: What ontrack reads and writes in the three files it works on - the ontrack key of a track, the frontmatter of an ADR, and the rules block of AGENTS.md.
---

ontrack works on three files. This page says what it reads in each, what it
writes, and what it leaves to you.

| File | Where | Written by |
| --- | --- | --- |
| [`package.json`](#the-ontrack-key-of-a-track) of a track | The track's repository | The track's author |
| [An ADR](#the-frontmatter-of-an-adr) | The track, then `docs/adr/` in each repository | The track, then the repository |
| [`AGENTS.md`](#the-rules-block-in-agentsmd) | The root of each repository | ontrack, between two markers |

## The `ontrack` key of a track

A track is an npm package whose `package.json` has an `ontrack` object.

```json
{
  "name": "@trivoallan/ontrack-engineering",
  "ontrack": { "adr": "adr", "namespace": "trivoallan" }
}
```

| Property | Type | Required | Meaning |
| --- | --- | --- | --- |
| `adr` | string | Yes | The directory that holds the ADRs, relative to the package. It must stay inside the package. |
| `namespace` | string | No | The alias the track proposes to be installed under. A value that is not a string counts as absent. |

- Unknown properties are accepted and ignored.
- A dependency whose `ontrack` is absent, or is not an object, is not a
  track. ontrack skips it.
- The namespace in effect is the npm alias the repository installs the track
  under, whatever `namespace` proposes. The alias must be unscoped: a track
  installed as `@scope/name` is an error, and so is one installed as `local`,
  the namespace of the repository's own ADRs.
- Every `.md` file directly in the `adr` directory is an ADR. Subdirectories
  are not read.

ontrack publishes a JSON Schema for this key,
[`schema/ontrack.schema.json`](https://github.com/trivoallan/ontrack/blob/main/schema/ontrack.schema.json),
derived from the model it validates with. It applies to a whole
`package.json` and constrains its `ontrack` property only. In VS Code, add it
in `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["package.json"],
      "url": "https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/ontrack.schema.json"
    }
  ]
}
```

The schema cannot state one rule: `adr` must resolve inside the package.

## The frontmatter of an ADR

An ADR is a Markdown file with a frontmatter. ontrack reads seven keys of it.
Any other key belongs to the track, which decides the rest of the format and
how to check it.

This is an ADR as its track ships it, then the same ADR once a repository
has ruled:

```yaml
---
adr: ADR-0006
title: Commits
status: proposed
revision: 1
check: npx --no-install ontrack-engineering-check ADR-0006
supersedes: []
traits:
  commits:
    scopes:
    tool:
---
```

```yaml
---
adr: ADR-0006
title: Commits
status: accepted
revision: 1
check: npx --no-install ontrack-engineering-check ADR-0006
supersedes: []
traits:
  commits:
    scopes: [api, web]
    tool: commitlint
---
```

### The keys ontrack reads

| Key | Value | Filled by | What ontrack does with it |
| --- | --- | --- | --- |
| `adr` | A string. Defaults to the file name without `.md`. | The track | Identifies the ADR in `review <adr>` and in `supersedes`. |
| `title` | A string. Surrounding quotes are removed. Defaults to the first `# ` heading of the body. | The track | Shows it in `plan` and in the headings of the rules block. |
| `revision` | An integer, written with digits only. | The track | Compares the repository's value with the track's. See [below](#how-revision-is-compared). |
| `status` | `proposed`, `accepted` or `rejected`. | The repository | Decides how the ADR is treated. See [below](#what-status-decides). |
| `check` | A shell command, on one line. | The track | Runs it in `check`, once the ADR is `accepted`. `apply` copies the track's line into the repository's copy. |
| `supersedes` | A list of ADRs: `[ADR-0003]` on the line, or one `- item` per line below. | The repository | Treats each ADR named by an `accepted` ADR as superseded. |
| `traits` | An indented block. | The track ships the keys, the repository fills the values | Copies the block as it is into the rules block, once the ADR is `accepted`. |

### What `status` decides

| `status` | Rules block | `review` | `check` |
| --- | --- | --- | --- |
| `proposed` | Listed under "Not yet decided" | Prepares a ruling | Not run |
| `accepted` | Its traits are written, unless it is superseded | Drafts an ADR that supersedes it | Run, unless it is superseded |
| `rejected` | Absent | Refused, with an error | Not run |

With any other value, the ADR is neither decided nor listed as pending.

`check`, `supersedes` and `traits` are read only when the status is
`accepted`.

### How `revision` is compared

`plan` compares the `revision` of the repository's copy with the track's.

| Repository's copy | Track | Category in `plan` |
| --- | --- | --- |
| Lower than the track's | An integer | `revised` |
| Equal or higher | An integer | Up to date |
| Absent, `0`, or not an integer | Any | `undetermined` |
| Any | Absent or not an integer | `undetermined` |

Nothing else is compared: not the status, not the traits, not the text.
`apply --confirm` writes the track's `revision` into an `undetermined`
copy. It is the only case where ontrack writes this key.

### How the frontmatter is read

ontrack does not use a YAML parser. It reads the frontmatter line by line,
which sets a few rules a YAML parser would not.

- The file starts with a `---` line, and the frontmatter ends at the next
  one.
- A key is read at column zero, with its value on the same line. Only
  `supersedes` and `traits` continue on the lines below.
- A value can be quoted, except `revision`. For `adr`, `status`, `check` and
  `supersedes`, a `#` that follows a space starts a comment and ends the
  value. This holds inside a `check` command too.
- `traits` must be an indented block. `traits: {}` and an absent key both
  mean no trait. Any other value on the `traits:` line is an error.
- Trait values are never interpreted. ontrack copies the block, with its
  indentation removed.
- An entry of `supersedes` is the `adr` value of another ADR in the same
  namespace, or `<namespace>/<adr>` for one in another namespace.
- Between the two `---` lines, ontrack accepts blank lines, `#` comments,
  `key:` lines, list items and indented lines. Anything else makes the
  frontmatter unreadable: `plan` reports the ADR as `unreadable`, and the
  other commands ignore it.

### What the track decides

ontrack never checks that an ADR is well formed beyond the keys above. Which
other keys exist, which sections the body has, and which values a trait
accepts are the track's to define and to check.
[trivoallan/ontrack-engineering](https://github.com/trivoallan/ontrack-engineering) does it
with one schema file shipped next to its ADRs,
[`adr/.mdschema.yml`](https://github.com/trivoallan/ontrack-engineering/blob/main/adr/.mdschema.yml),
which lists the accepted values of every trait.

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
