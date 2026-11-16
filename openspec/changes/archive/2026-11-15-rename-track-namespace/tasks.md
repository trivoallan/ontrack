## 1. Plan

- [x] 1.1 In `src/plan.ts`, find the orphan folders of `docs/adr/` (neither `local` nor an installed alias) and, for each track with no `docs/adr/<alias>/`, the ones holding at least one file it ships; throw on two folders for one track or one folder for two tracks, naming them
- [x] 1.2 Give `planTrack` the folder to read and pass the orphan folder when a rename is pending; carry an optional `rename` (the old namespace) on `TrackPlan`, and skip the flat-layout fallback for files that folder holds
- [x] 1.3 Count a rename as pending in `hasPendingChanges`, and print `rename: docs/adr/<old>/ → docs/adr/<alias>/` in `formatPlan` after the ADR lines, before the migration lines
- [x] 1.4 Tests in `test/plan.test.ts`: every scenario of *Namespace rename* and *Rename line*

## 2. Apply

- [x] 2.1 In `src/apply.ts`, add a `renamed` action, first in `KINDS`, built from `track.rename`, with the target-exists check; run it with one `git mv` of the folder (fallback to a rename)
- [x] 2.2 Print `renamed` in the counts and `  renamed       docs/adr/<old>/ → docs/adr/<alias>/`; make `planAfter` clear the rename so `--dry-run` reports what the run leaves
- [x] 2.3 Feed the renamed files (old path → new path) to `findLinks` with the migration moves
- [x] 2.4 Add a reader of `supersedes:` entries with their line, reusing the parsing in `src/instructions.ts`, and print `supersedes to update:` with one `<file>:<line>  <old>/<adr> → <alias>/<adr>` line per entry naming the old namespace
- [x] 2.5 Tests in `test/apply.test.ts` and `test/links.test.ts`: every scenario of *Namespace rename*, *Superseding entries naming the old namespace* and the two new *Links to moved files* scenarios, with and without git

## 3. Documentation

- [x] 3.1 In `docs/commands.md`, add the `rename:` line to the `plan` output contract and the `renamed` action and `supersedes to update:` block to the `apply` output
- [x] 3.2 In `docs/ontrack-engineering/use-it.md` (or the page on installing a track), say how to change an alias: reinstall under the new name, `plan`, `apply`, then fix the listed links and `supersedes:` entries

## 4. Verification

- [x] 4.1 `npm test` passes and coverage stays at or above 95%
- [x] 4.2 In a scratch copy of this repository, install the track as `engineering`: `plan` prints `engineering: 26 unchanged` and the rename line; `apply` moves the folder and lists the 7 local ADRs' links and the two `supersedes:` entries of `local/ADR-0024`; after fixing them, `apply` writes AGENTS.md (same rules, sorted under the new namespace) and the failures left by `check` come from the scratch copy (untrusted `mise.toml`, one-commit history), not from the rename
- [x] 4.3 `openspec validate rename-track-namespace --strict` passes
