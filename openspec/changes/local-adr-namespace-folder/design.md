## Context

`src/instructions.ts` reads `docs/adr/*.md` as namespace `local` and `docs/adr/<dir>/*.md` as namespace `<dir>`. A directory `docs/adr/local/` is therefore already read correctly; what assumes the root layout is everything that *writes* or *classifies* own ADRs:

- `review`'s supersession prompt (`src/review.ts`) tells the agent to write in `docs/adr/`;
- `plan` (`src/plan.ts`) treats root files that match a source ADR as a migration to `docs/adr/<alias>/`, and ignores the others as "the project's own";
- `openspec/schemas/spec-driven-with-adr/schema.yaml` and `.github/workflows/propose.yml` (write permission `Edit(docs/adr/**)`, publish check `docs/adr/ADR-[0-9]{4}-[a-z0-9-]+\.md`) name the root;
- the site (`site/astro.config.mjs`) lists `adr/trivoallan` only, and titles come from the frontmatter `title:`, which holds no number.

Constraints: imported ADRs under `docs/adr/trivoallan/` are never edited; accepted ADR bodies are frozen (moving a file does not change its body); the governance source's ADR-0001 says own ADRs live "in `docs/adr/`, outside that directory", which `docs/adr/local/` satisfies. Pilot repositories adopt ontrack before 2026-12-18 and are expected to move their own ADRs.

## Goals / Non-Goals

**Goals:**
- One layout: every ADR sits in `docs/adr/<namespace>/`, and a reference `<namespace>/<name>` is its path.
- A repository moves its own ADRs with one `ontrack apply`, losing nothing.
- A reader finds an ADR page from its number, by search or by scanning the navigation.

**Non-Goals:**
- Renumbering or renaming any ADR, or editing the body of one.
- Changing the governance source's text (another repository).
- Making the ADR directory configurable.
- Redirects from the old URLs of the four own ADR pages.

## Decisions

**1. The root is a historical layout, not a second supported one.** Root files are still read as `local/…`, so nothing breaks between upgrading ontrack and running `apply`; `plan` reports them as a migration, which keeps a blocking CI red until they move. Alternative: read both forever. Rejected: two places to look for the next number, and the user decided that adopting repositories move.

**2. Reuse the flat-layout migration.** The own-ADR migration is the same action (`moved`) with `local` as destination: same `git mv`, same list of broken links, same `--dry-run`. In `plan`, own files are the root `*.md` files claimed by no source's migration; they are reported once, after the sources, since they belong to none. `Plan` is an array of `SourcePlan`; the smallest change is a trailing entry `{ namespace: 'local', adrs: [], migration }` whose header line is not printed, rather than a new type through `apply`, `planAfter` and the formatters. To settle when implementing against the tests.

**3. A duplicate name is an error, in both readers.** `docs/adr/X.md` and `docs/adr/local/X.md` would both be `local/X`. Silently preferring one hides a decision; `instructions`/`check`/`review` fail naming both paths, and `apply` refuses the move. Alternative: `local/` wins, as the source copy does for sources. Rejected: for a source the two files are copies of one ADR; here they can be two different decisions.

**4. `local` is refused as a source alias.** Otherwise `plan` would classify the repository's own ADRs as `removed` from that source and `--prune` would delete them. Checked in `src/sources.ts`, next to the scoped-alias error.

**5. `supersedes:` needs no change.** A bare name resolves in the ADR's own namespace, which stays `local`. `supersedes: [ADR-0001]` in ADR-0002 keeps working after the move.

**6. Site: frontmatter transform, not a hand-built sidebar.** `site/src/content.config.ts` already transforms each page to add the status badge; the same transform sets `sidebar.label` to `<adr> <title>` when the page declares `adr:`. The sidebar group autogenerates from `adr` instead of `adr/trivoallan`, which yields one subgroup per directory. The reference on the page is one more node in the `ruling` the remark plugin already inserts, from `readAdrs()`. Alternative: build sidebar items from `readAdrs()` in `astro.config.mjs`. Rejected: more code, and it loses the status dot the schema transform provides. The `adr` key must be added to the schema extension (`z.string().optional()`).

**7. The page shows the full reference, the navigation the number.** `trivoallan/ADR-0011-forge-and-ci` is what `review` accepts and what AGENTS.md prints, so it can be copied; it contains `ADR-0011`, which is what the search needs. In the navigation the group already names the namespace, so the entry carries `ADR-0011` only.

**8. This change's own ADR is written at `docs/adr/ADR-0005-…` and moved with the others.** The propose workflow in force accepts only that path; the apply moves five files.

## Risks / Trade-offs

- [A caller pinned to an older `propose.yml` writes new ADRs at the root] → still read; `plan` reports the migration again; documented in `docs/draft-a-change-from-an-issue.md`.
- [Links to moved ADRs break in adopting repositories] → `apply` lists each one with its new target, as for a source migration.
- [`plan` turns red in pilot CIs on upgrade] → intended; one `apply` clears it. Say so in the changelog entry.
- [A repository without any source gets a migration from `plan`, which so far only said "no ontrack source found"] → specified; one more code path to test.
- [Old URLs of the four own ADR pages 404] → internal links are checked by `site/check-links.mjs`; external ones are accepted as lost.
- [Open proposals drafted before this change add `docs/adr/ADR-NNNN`] → `verify-release-provenance` is open: check its `adr.md`; a root ADR it adds is moved by `apply`.

## Migration Plan

1. Ship the readers and the migration (`instructions`, `plan`, `apply`, `sources`), then the writers (`review`, schema, `propose.yml`), in one release.
2. In this repository: `npx ontrack apply`, fix the links it lists, update comments in the workflows.
3. Adopting repositories: upgrade, `npx ontrack apply`, fix listed links.

Rollback: `git mv docs/adr/local/* docs/adr/`; the previous release reads the root.

## Open Questions

- Should the governance source's ADR-0001 name `docs/adr/local/` explicitly? To raise in the governance repository; nothing in force here contradicts the new layout.
