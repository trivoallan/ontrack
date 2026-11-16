---
title: Error messages
description: Troubleshooting - every error ontrack prints, what it means and what to do about it.
---

Use this page for troubleshooting: it lists every error ontrack prints, what
it means, and what to do.

An error is one line on standard error, starting with `ontrack:`, and the
command exits with `1`. Nothing was written: `apply` runs every check before
its first write. In the messages below, `<…>` stands for a name or a path of
your repository.

A command that exits with `2` did not fail: it reports work for a person.
See [exit codes](commands.md#exit-codes).

## The command line

| Message | It means | Do |
| --- | --- | --- |
| `Unknown argument: <word>` | The command or the option does not exist | Run `npx ontrack --help`, or `npx ontrack <command> --help`. The [commands reference](commands.md) lists every option |
| `Not enough arguments following: confirm` | `--confirm` came without a name | Give the name of an `undetermined` ADR, or `all`: `npx ontrack apply --confirm ADR-0003` |
| `cannot read <directory>/package.json; run ontrack from the root of an npm project` | There is no `package.json` in the directory ontrack runs in | Run ontrack from the root of the npm project |
| `cannot read <directory>/package.json: it is not valid JSON (<reason>)` | The `package.json` does not parse; `<reason>` is what the parser found, with the position | Correct the file where `<reason>` points |
| `cannot read <directory>/package.json: "<field>" must map names to versions` | `dependencies` or `devDependencies` is not a map of names to versions | Correct `<field>`, or let npm rewrite it: `npm install` |

## Tracks

ontrack reads the tracks from `package.json` and `node_modules`. These errors
come from `plan` and `apply`.

| Message | It means | Do |
| --- | --- | --- |
| `dependency "<alias>" is not installed; run npm install` | `package.json` declares the dependency, and `node_modules` does not hold it | Run `npm install` |
| `dependency "<alias>" has an invalid package.json ("<field>")` | The installed package has a `package.json` ontrack cannot read; `<field>` is what is wrong in it | Reinstall the dependency. If the message stays, the package is at fault: tell its author |
| `track "<alias>" must be installed under an unscoped alias` | The track is installed under its scoped name, such as `@acme/standards`. The alias is the namespace, and the name of a directory under `docs/adr/` | Remove it, and install it under an alias: `npm i -D acme@npm:@acme/standards` |
| `track "local" must be installed under another alias: local names the repository's own ADRs` | `local` is the namespace of the ADRs the repository wrote itself | Install the track under any other alias |
| `track "<alias>" has no "<field>" string in its ontrack key` | The `ontrack` key of the track lacks `namespace` or `adr`, or holds something that is not text | The track is at fault: tell its author. [File formats](file-formats.md#the-ontrack-key-of-a-track) says what the key holds |
| `track "<alias>" declares adr "<path>" outside its package` | The `adr` of the track points out of the package | The track is at fault: tell its author |
| `track "<alias>" has no readable ADR directory <directory>` | The directory the track names does not exist in the installed package, often because the track did not publish it | The track is at fault: tell its author. If it is yours, list the directory under `files` in its `package.json`: see [Write your own track](write-your-own-track.md) |
| `track "<alias>" could be renamed from docs/adr/<old>/ or docs/adr/<older>/; remove the folder that is not its own` | The track has no folder yet, and two folders that belong to no installed track hold files it ships: either could be its folder from a previous alias | Delete or rename the stale folder, or create `docs/adr/<alias>/` if neither is the track's |
| `docs/adr/<old>/ could be renamed to tracks "<one>" and "<two>"; create the folder of the one it is not` | Two tracks without a folder ship files that `docs/adr/<old>/` holds | Create `docs/adr/<alias>/` for the track the folder does not belong to |

## ADRs

ontrack reads the ADRs under `docs/adr/`. These errors come from `apply`,
`instructions` and `check`.

| Message | It means | Do |
| --- | --- | --- |
| `<file>: write traits: as an indented block, not "<value>"` | The frontmatter holds `traits:` and a value on the same line | Write the keys under `traits:`, indented, one per line: see [the frontmatter of an ADR](file-formats.md#the-frontmatter-of-an-adr) |
| `trait "<key>" is decided by both <reference> and <reference>; supersede one of them (supersedes:) to settle it` | Two ADRs in force decide the same key, so a coding agent would read two rules | Decide which one stands. `npx ontrack review <reference>` prints the prompt that supersedes an accepted ADR |
| `docs/adr/<file> and docs/adr/local/<file> are the same ADR; keep one` | The same file is in the former layout and in the current one | Compare them, and delete the one under `docs/adr/` |
| `<path> already exists; nothing was written` | `apply` has a file to import or to move, and another file holds its place | Compare the two files, remove or rename the one that should not be there, and run `apply` again |
| `cannot confirm "<name>": it is not an undetermined ADR with an upstream revision` | `--confirm` names an ADR that `plan` does not report as `undetermined`, or whose track gives it no `revision:` | Run `npx ontrack plan` and copy the name of an `undetermined` line |

## `review`

| Message | It means | Do |
| --- | --- | --- |
| `no ADR named "<name>" under docs/adr/` | No file under `docs/adr/` matches the name | Give the identifier (`ADR-0006`), the file name, or the reference (`<namespace>/<file name without .md>`). If the ADR is not imported yet, run `npx ontrack apply` first |
| `"<name>" names several ADRs: <references>; name one by its reference` | Two namespaces hold an ADR of that name | Give one of the references the message lists |
| `<reference> is <status>, neither proposed nor accepted: nothing to review` | The ADR is `rejected`, or its `status:` is one ontrack does not know: there is nothing to rule, and nothing to supersede | To decide again, write a new ADR of your own under `docs/adr/local/` |
| `<reference> is already superseded by <reference>: name that one` | Another ADR replaced the one you named | Run `review` on the second reference |
| `no ADR is proposed or revised, nothing to review` | Every ADR is ruled. This is not an error: the command exits with `0` | Nothing |

## Lines about `AGENTS.md`

`plan` and `apply` print these on standard output, after the tracks. They are
not errors, but `plan` exits with `2` while one of the first two stands.

| Line | It means | Do |
| --- | --- | --- |
| `AGENTS.md: skipped, expected one <!-- ontrack:begin --> line followed by one <!-- ontrack:end --> line` | The markers of the rules block are doubled, lone or in the wrong order, so ontrack does not know what it may rewrite | Leave one `begin` line followed by one `end` line, or delete both: `apply` then writes a new block |
| `AGENTS.md: skipped, trait "<key>" is decided by both …` | Two ADRs decide the same key, so there is no block to write | Settle the conflict, as above |
| `AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md` | Claude Code reads `AGENTS.md` only when the repository has no `CLAUDE.md` | Add the line `@AGENTS.md` to `CLAUDE.md` |

## A message that is not here

Open an [issue](https://github.com/trivoallan/ontrack/issues) with the
command, what it printed, and the output of `npx ontrack --version`.
