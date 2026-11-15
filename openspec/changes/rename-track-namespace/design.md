## Context

The namespace of a track is the alias it is installed under (`tracks`, *The npm alias is the local namespace*), and `local` is reserved for the repository's own ADRs (local/ADR-0005). `plan` compares each shipped file with `docs/adr/<alias>/<file>`, falling back to `docs/adr/<file>` for the flat layout; it never looks at another folder of `docs/adr/`. So after an alias change the old folder is invisible: every ADR is `new`, and `apply` imports them with empty answers next to the old copies. AGENTS.md then sees each trait decided twice and is skipped.

ontrack already moves files for two migrations (flat layout, own ADRs to `local/`): the plan carries the files, `apply` turns them into `moved` actions run with `git mv`, and `findLinks` lists the links the moves break without rewriting them. This change adds a third move of the same kind.

Tried on this repository with `@trivoallan/ontrack-engineering@^0.6.0` installed as `engineering`: 26 `new` in `plan`; after `apply`, 25 proposed ADRs, AGENTS.md skipped, 16 checks failed. Seven local ADRs link to `../trivoallan/`, and ADR-0024 lists `trivoallan/ADR-0018` and `trivoallan/ADR-0020` in `supersedes:`.

## Goals / Non-Goals

**Goals:**
- Reinstalling a track under another alias keeps every ruling: after `apply`, `plan` reads as it did before the alias changed.
- The repository sees the rename in `plan` before anything moves.
- Every reference the move breaks is listed.

**Non-Goals:**
- Rewriting links or `supersedes:` entries. `apply` lists them, as it does today for migrations.
- Changing the alias the documentation recommends, or renaming the namespace in this repository. A change of its own follows.
- Renaming issue titles or any state outside the repository's files.
- A track's ADR prose that names its install folder (`imports them into docs/adr/trivoallan/`): the track's to fix.

## Decisions

### The rename is inferred from file names

A track with no folder of its own, and exactly one orphan folder of `docs/adr/` (neither `local` nor an installed alias) holding at least one file the track ships, is a rename of that folder.

*Why not an explicit `ontrack rename <old> <new>`:* the repository has already said what it wants by changing `package.json`; a second command repeats it and leaves `plan` wrong until it runs. `plan` stays the place where every pending move shows up.
*Why not a record of installed tracks:* ontrack keeps no state outside the ADR files and `AGENTS.md`; adding one for this case would make every other command depend on it.
*Why not the package name in each ADR:* imported ADRs are byte copies of the track's files and carry no package name; writing one would break `unchanged`.
*Why "at least one file", not "all files":* a track that dropped or added ADRs since the last import still shares most names with the old folder. The ambiguous cases (two candidate folders, one folder for two tracks) fail with a message instead of guessing.

### The folder moves as a whole, first

`apply` moves `docs/adr/<old>/` to `docs/adr/<alias>/` before the track's other actions, so imports, confirmations and prunes run on the moved copies, and the files the track no longer ships stay with the others as `removed`. Each file is moved with `git mv`, as the migrations are, so history follows. The target-exists check that `planActions` runs on moves applies to the folder.

*Why not move only the shipped files:* files the track dropped would stay in an orphan folder, which `plan` would then offer as a rename again.

### Classification reads the old folder

`planTrack` takes the folder to read as an argument: `docs/adr/<alias>/` normally, the orphan folder when a rename is pending. Categories and verdicts are then computed as if the move were done, so `plan` shows the real state of the rulings (`26 unchanged`), not 26 `new`.

### References are listed, never rewritten

The moved files go through `findLinks` like migration moves. A new reader lists `supersedes:` entries of the form `<old>/<adr>` in every ADR under `docs/adr/`, reusing the parsing in `src/instructions.ts`. This keeps the rule that `apply` writes only ADRs it imports, moves, confirms, syncs or prunes.

## Risks / Trade-offs

- [A folder a person keeps by hand, for example `docs/adr/archive/`, shares a file name with a track that has no folder yet] → `plan` reports it as a rename. The repository sees it before anything moves and can create `docs/adr/<alias>/` or rename the folder; the risk is a surprise in `plan`, not a silent move.
- [Two orphan folders after two alias changes] → `plan` fails and names both. The repository removes the stale one.
- [The listed `supersedes:` entries stay wrong until edited] → until then they match nothing (`supersededBy` compares namespaces), so the superseded ADR is in force again next to the one that replaced it. When both decide a trait, as `local/ADR-0024` and `ADR-0018` do here, the rules block is `skipped` and `apply` exits with `2`. The output names each line to fix; once they are edited, the next `apply` writes the block. Rewriting the entries would avoid the step, but `apply` would then edit ruled ADRs it neither imports nor moves, which no other action does.
