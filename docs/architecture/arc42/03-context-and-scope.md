---
title: Context and Scope
---

# Context and Scope

ontrack is a process started in a repository, the *project*. It reads files
of that project, writes a few of them, prints to the terminal and exits. It
opens no network connection: sources reach the project through npm, before
ontrack runs.

## Business context

| Neighbour | What crosses the boundary |
| --- | --- |
| Repository maintainer, or a CI job | starts a command; reads the report on standard output and the exit code (`0`, `2` or `1`) |
| Coding agent | receives the prompt `ontrack review` prints, and reads the rules block of `AGENTS.md`; ontrack never starts an agent |
| Source author | publishes a package whose `ontrack` key names its ADR directory; ontrack reads the installed copy only |

## Technical context

| Neighbour | Direction | What crosses the boundary | Module |
| --- | --- | --- | --- |
| The project's `package.json` | read | the aliases under `dependencies` and `devDependencies` | `src/sources.ts` |
| Installed packages, `node_modules/<alias>/` | read | each dependency's `package.json` and its `ontrack` key; the ADR files of each source | `src/sources.ts`, `src/plan.ts`, `src/apply.ts` |
| The project's ADR directory, `docs/adr/` and `docs/adr/<namespace>/` | read | local copies, compared with the source's by `revision:`; frontmatter status, traits, `supersedes:` and `check:` | `src/plan.ts`, `src/instructions.ts` |
| The same directory | write | a new ADR copied, a flat-layout file moved, a `revision:` line set, a removed ADR deleted | `src/apply.ts` |
| `AGENTS.md` at the project root | read and write | the rules block between the two `ontrack` markers; the rest of the file is written back as it was read | `src/agents.ts` |
| `CLAUDE.md`, `CLAUDE.local.md` | read | whether they exist and whether `CLAUDE.md` imports `AGENTS.md`, to print a warning | `src/agents.ts` |
| Every other Markdown file of the project | read | relative links that a flat-layout migration breaks; they are listed, never rewritten | `src/links.ts` |
| `git` | spawned | `git rev-parse` to detect a work tree, `git mv` to move a file; a plain rename otherwise | `src/apply.ts` |
| The shell | spawned | the `check:` command of each ADR in force, run from the project root; its exit status and output come back | `src/check.ts` |
| The terminal | write | reports and prompts on standard output, errors on standard error, the exit code | `src/cli.ts` |
| npm | none at run time | installs ontrack and the sources; ontrack never calls it | none |

## Scope

Inside: discovering sources, comparing revisions, importing and moving ADR
files, keeping the rules block current, printing review prompts, running
declared checks. Outside: installing sources (npm), ruling an ADR (a person,
helped by an agent), committing (the maintainer), and judging whether the
repository follows a rule (the tool each `check:` names).

The context diagram comes from the LikeC4 model in `docs/architecture/model/`.
