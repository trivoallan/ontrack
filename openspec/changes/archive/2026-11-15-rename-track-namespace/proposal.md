## Why

A track's namespace is its npm alias. A repository that reinstalls the same package under another alias loses every ruling it made: `plan` sees 26 new ADRs and nothing of the old folder, `apply` imports them `proposed` with empty answers, AGENTS.md is skipped because each trait is decided twice, and `check` fails ([#206](https://github.com/trivoallan/ontrack/issues/206), tried on this repository). Until ontrack can rename a namespace, changing the alias the documentation recommends costs each adopter a full review.

## What Changes

- `plan` recognizes a rename: a track whose `docs/adr/<alias>/` does not exist, and a folder of `docs/adr/` that no installed track and not `local` names, holding at least one file the track ships. It reports `rename: docs/adr/<old>/ → docs/adr/<alias>/`, then classifies the track's ADRs against the copies in the old folder, as if they were already in place.
- `plan` fails when two folders could be the old one for a track, or one folder for two tracks, and names them.
- `apply` moves the old folder to `docs/adr/<alias>/` as a whole, with `git mv` inside a git work tree, content unchanged, before any other action on the track. Statuses, dates, authors and answers stay.
- After a rename, `apply` lists the links the move breaks, as it does for a flat-layout migration, and the `supersedes:` entries that name `<old>/`. It rewrites neither.
- `apply` refuses a rename whose target exists, as it refuses any move onto a taken path.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plan`: a new requirement, *Namespace rename*, and the output format gains the `rename:` line.
- `apply`: a new requirement, *Namespace rename*; *Links to moved files* covers a renamed folder; a new requirement lists `supersedes:` entries naming the old namespace.

## Impact

- **Code**: `src/plan.ts` (detection, classification against the old folder), `src/apply.ts` (a `renamed` action, ordered first), `src/links.ts` reused for the moved files, a reader for `supersedes:` entries (`src/instructions.ts` already parses them).
- **Documentation**: `docs/commands.md` (the `rename:` line in `plan` and `apply` output), the page on using a track (how to change an alias).
- **Outside this change**: the alias the documentation recommends (`trivoallan` → `engineering`) and the rename in this repository come after, as a change of their own; it also covers the site's catalogue glob over `node_modules/trivoallan/adr`. Issue titles that carry the old namespace (`[trivoallan/ADR-0008] …`) are not ontrack's to rename.
- **Compatibility**: no existing output changes. A repository without an orphan folder sees nothing new.
