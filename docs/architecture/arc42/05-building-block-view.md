---
title: Building Block View
---

# Building Block View

ontrack is one package ([ADR-0003](../../adr/trivoallan/ADR-0003-architecture.md)).
Its building blocks are the files of
[`src/`](https://github.com/trivoallan/ontrack/tree/main/src): an entry
point, one thin module per subcommand, and the domain modules that do the
work. This section says what each module is responsible for.

## Entry point and commands

**`bin/ontrack.ts`** is the executable. It passes the arguments and
`process` to `main` and sets the exit code to what `main` returns.

**`src/cli.ts`** declares the command line with yargs, selects the
subcommand, runs its handler and turns a thrown error into a message on
standard error and exit code `1`. It defines `Io`, the three things a
command needs from the outside (current directory, standard output,
standard error), so that tests call `main` without a process.

**`src/commands/`** holds one module per subcommand: `plan`, `apply`,
`instructions`, `review` and `check`. Each exports its name, its
description, its options and a handler. A handler calls domain modules,
writes their formatted result to `Io` and returns the exit code. Only
`commands/apply.ts` holds logic of its own: it orders the steps of an apply
run (see [Runtime View](06-runtime-view.md)).

## Domain modules

**`src/schemas.ts`** holds the zod models of everything ontrack reads from
outside: the project's `package.json`, a dependency's `package.json`, the
`ontrack` key of a source, and the frontmatter values `revision` and
`title`.

**`src/sources.ts`** lists the project's sources. It reads the project's
`package.json`, then the `package.json` of each installed dependency, and
keeps those with an `ontrack` key. It returns, per source, the namespace
(the npm alias) and the directory of its ADRs.

**`src/revision.ts`** reads the frontmatter of an ADR without a YAML
parser: where it starts and ends, its `revision:` and its `title:`. It
classifies a local copy against the source's copy, and can set the
`revision:` line of a file while leaving every other byte as it was.

**`src/plan.ts`** builds the plan: for each source, each ADR and its
category (`new`, `revised`, `removed`, `undetermined`, `unreadable`,
`unchanged`), and the files waiting to move out of a flat layout. It reads
only. It also formats the plan as the text `ontrack plan` prints.

**`src/apply.ts`** turns a plan into actions (`imported`, `moved`,
`confirmed`, `pruned`), checks all of them before any write, executes them,
and formats the result. It is the only module that writes under
`docs/adr/`. It runs `git mv` when the project is a git work tree.

**`src/links.ts`** finds the Markdown links a flat-layout migration breaks,
in every Markdown file of the project. It reads only and imports no other
module.

**`src/instructions.ts`** reads the ADRs the repository holds under
`docs/adr/`, resolves which are in force (accepted and not superseded),
refuses two ADRs that decide the same trait key, and formats the decided
traits as the rules block.

**`src/agents.ts`** compares the rules block with what `AGENTS.md` holds
between the two markers, reports its state, and writes it. It is the only
module that writes `AGENTS.md`.

**`src/review.ts`** selects the ADRs to review and formats the three
prompts: every proposed ADR in sequence, one proposed ADR, or the
supersession of one accepted ADR.

**`src/check.ts`** runs, through the shell, the `check:` command of each
ADR in force and formats the outcome.

## Direction of dependencies

Dependencies point one way: `bin` → `cli` → `commands` → domain modules,
and no domain module imports a command. The `commands` import `cli` for the
`Io` type only.

| Module | Imports |
| --- | --- |
| `cli` | the five `commands`, `yargs`, and `package.json` for the version |
| `commands/plan` | `plan`, `agents` |
| `commands/apply` | `plan`, `apply`, `links`, `agents` |
| `commands/instructions` | `instructions` |
| `commands/review` | `review` |
| `commands/check` | `check` |
| `apply` | `plan`, `revision`, and the `Link` type of `links` |
| `plan` | `sources`, `revision` |
| `agents` | `instructions` |
| `review` | `instructions` |
| `check` | `instructions` |
| `instructions` | `plan` (its listing of Markdown files), `revision` |
| `sources` | `schemas`, which imports `zod` |
| `revision` | `schemas` |
| `links`, `schemas` | no other module of `src/` |

Two groups follow from the table. The modules that deal with *sources*
(`sources`, `plan`, `apply`) are the only ones that read `node_modules`.
The modules that deal with the repository's *own answers* (`instructions`,
`agents`, `review`, `check`) read the project's files only. Both groups rest
on `revision` for frontmatter.

The building block diagram comes from the LikeC4 model in `docs/architecture/model/`.
