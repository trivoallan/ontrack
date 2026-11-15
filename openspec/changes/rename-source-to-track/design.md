## Context

"Source" is ontrack's word for an npm package that ships ADRs as questions. It appears about 300 times in the documentation, 90 times in `src/`, 120 times in `test/`, and in five specs.

What was checked before writing this design:

- **No file format carries the word.** The `ontrack` key of a package holds `adr` and `namespace`. The ADR frontmatter and the rules block of `AGENTS.md` do not say "source". A repository therefore has nothing to migrate.
- **The npm keyword `ontrack-source` is a documentation convention.** No code reads it.
- **One line of specified output says it**: `no ontrack source found`, in `plan`. Error messages and the prompts of `review` say it too, in text the specs do not quote.
- **"track" is free.** It appears nowhere in `src/` or the user documentation as a noun. "Tracking" appears in `review` for the `tracking` trait (work tracking), a different word in a different place.
- **"line", the other railway candidate, is not free**: `line` and `lines` appear 166 times in `src/` for lines of text.

In-force ADRs that bear on this change: `trivoallan/ADR-0002-localization` (English), `trivoallan/ADR-0006-commits` (the scope list), `trivoallan/ADR-0008-documentation` (Starlight, `docs/`), `trivoallan/ADR-0010-architecture-documentation` (arc42 and LikeC4, which name the term), `trivoallan/ADR-0016-changes` (this workflow), `local/ADR-0005-own-adrs-live-in-docs-adr-local` (imported ADRs are not edited).

## Goals / Non-Goals

**Goals:**

- One word, "track", wherever ontrack names the package of questions: documentation, output, errors, prompts, schema, code, specs, architecture pages.
- Links to the two renamed guides keep working.
- A reader who knew "source" finds the new word explained once, where the term is defined.

**Non-Goals:**

- No other term is renamed. The railway metaphor stops at this one word.
- No change to any file a repository holds, to any exit code, or to any command or option.
- No compatibility layer in the code: there is no input that says "source" to keep accepting.
- No edit of the imported ADRs, the changelog or the archived changes.

## Decisions

### The term is "track", singular, countable

A repository installs one or several tracks, each under an alias: "the `platform` track". A repository with nothing pending is on track. The decision and the names it was preferred to are recorded in `docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md`.

### The npm keyword is `ontrack-tracks`

*Why not `ontrack-track`:* it stutters, and it reads as a tracking plugin. *Why not `ontrack` alone:* it cannot tell a track from the CLI or from a tool built on it. The plural reads as a category on the registry ("ontrack tracks"), which is what a keyword is.

The documentation names the new keyword only. `find-a-track` says once that packages published before this release may still carry `ontrack-source`, and links that search too. That sentence goes when the known packages have moved.

### `plan` prints `no track found`

*Why not `no ontrack track found`:* the stutter again, and the command that prints it is already `ontrack`.

### The capability `sources` is replaced by `tracks`, through deltas

The delta removes the six requirements of `sources` and adds them, reworded, to `tracks`. *Why not rename the folder by hand:* the archive step is what keeps `openspec/specs/` true; a hand rename would bypass it for the one capability whose name changes. After the archive, the empty `openspec/specs/sources/` is deleted.

### Other specs are reworded in place

`apply`, `review`, `agents-file`, `shared-change-workflows` and the rest of `plan` say "source" in prose and in scenario wording, with no observable text. They are edited directly in `openspec/specs/`, in the same pull request. *Why not deltas:* a MODIFIED delta must restate each requirement in full; some forty requirements would be restated to change one word, and the review of the change would drown in them.

### Occurrences are reviewed, not replaced blindly

"Source" has other senses in the repository: source code, open source, the `source` keys of `marketplace.json`, lockfiles, the licence, the name of this very word in the changelog. Each file is edited by reading its hits. The verification is a search that must return only the allowed files (see tasks).

### The renamed pages redirect with Astro's `redirects`

`site/astro.config.mjs` gets a `redirects` entry for the two former slugs. It is the framework's own option; no page stub is written.

### The commit scope follows, by ruling again

The scope list is a trait of `trivoallan/ADR-0006-commits`, an imported ADR this repository has ruled. Changing `sources` to `tracks` in its `scopes` trait changes the repository's answer, not the question, and `commitlint.config.mjs` and `AGENTS.md` follow from it. Whether that edit is made in place or needs a recorded reason in the ADR is an open question below.

## Risks / Trade-offs

- [A reader of an older article or issue meets "source" and finds no such word in the documentation] → The glossary and `how-it-works` say once that a track was called a source before this release.
- [The imported ADRs of `docs/adr/trivoallan/` still say "source", on pages of the same site] → Accepted. They are another publisher's text. The publisher is told (task), and its next revision brings the new word.
- [`local-adr-namespace-folder` is not archived; its deltas restate requirements with the old word, and one of them adds to `sources`] → It is archived first. Otherwise this change's REMOVED delta names a requirement the main spec does not hold yet.
- [A blind replace breaks `marketplace.json` or rewrites history files] → Occurrences are reviewed file by file, and the final search lists what may remain.
- ["track" is read as the verb, as in "ontrack tracks revisions"] → The documentation does not use the verb for what ontrack does; it says "compares", "reports".
- [Scripts that match `no ontrack source found` or an error text stop matching] → Marked breaking in the commit, so the release notes say it. Exit codes are unchanged, and they are what the CI guide tells scripts to rely on.

## Migration Plan

1. Archive `local-adr-namespace-folder`.
2. Apply this change in one pull request: code and tests, schema, documentation, architecture pages, specs prose, tooling.
3. Merge as `feat!`, so that release-please writes the breaking notes.
4. After the release, tell the authors of published tracks to add the keyword `ontrack-tracks`.

Rollback is a revert of the pull request: no data was migrated.

## Open Questions

- **The ruling of `trivoallan/ADR-0006-commits`.** Is replacing `sources` by `tracks` in its `scopes` trait an edit the repository makes in place, with a line of reason in its copy, or does the user want it recorded another way? The task stops and asks before touching that file.
