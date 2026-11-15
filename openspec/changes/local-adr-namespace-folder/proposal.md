## Why

A repository's own ADRs sit directly in `docs/adr/`, next to the directories of the imported sources, while ontrack already refers to them as `local/<name>`: the namespace exists in every reference and nowhere on disk. On the documentation site an ADR's number is shown nowhere, although `plan`, `review`, `check` and AGENTS.md all name an ADR by its number, so a reader holding `ADR-0011` cannot find its page, and the repository's own ADRs are not in the navigation at all.

## What Changes

- **BREAKING** A repository's own ADRs live in `docs/adr/local/`. New ones are written there (supersession prompt of `review`, the `spec-driven-with-adr` schema, the propose workflow), numbered after the files of that directory.
- Own ADRs still found directly in `docs/adr/` are a historical layout: they are still read as `local/<name>`, `plan` reports them as a migration to `docs/adr/local/`, and `apply` moves them with the existing migration (git move, broken links listed). Adopting repositories move theirs with one `ontrack apply`.
- The same ADR file name in both `docs/adr/` and `docs/adr/local/` is an error.
- **BREAKING** A source cannot be installed under the alias `local`.
- This repository's four own ADRs move to `docs/adr/local/`, with every link and comment that names them.
- Documentation site: an ADR page shows its full reference (`trivoallan/ADR-0011-forge-and-ci`) next to its status, so that the site search finds a page from its number; navigation entries of ADRs start with the number (`ADR-0011 Forge and continuous integration`); the navigation lists every namespace, `local` included.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `instructions`: own ADRs are read from `docs/adr/local/`, and from `docs/adr/` as a historical layout; a duplicate file name is an error.
- `plan`: own ADRs directly in `docs/adr/` are reported as a migration to `docs/adr/local/` instead of being ignored.
- `apply`: moves own ADRs to `docs/adr/local/`.
- `review`: the supersession prompt writes the new ADR in `docs/adr/local/`.
- `sources`: the alias `local` is refused.
- `shared-change-workflows`: the agent adds ADRs in `docs/adr/local`.
- `issue-proposal`: the publishing job accepts a new ADR at `docs/adr/local/ADR-NNNN-slug.md`.
- `docs-site`: ADR pages show their reference; ADR navigation entries carry the number; every namespace is listed.

## Impact

- Code: `src/instructions.ts`, `src/plan.ts`, `src/apply.ts`, `src/review.ts`, `src/sources.ts`, their tests.
- Workflows: `.github/workflows/propose.yml` (write permission, path check, prompt), comments in `apply.yml`.
- Schema: `openspec/schemas/spec-driven-with-adr/schema.yaml`.
- Site: `site/astro.config.mjs`, `site/src/content.config.ts`.
- Docs: `docs/commands.md` (prompt contract, `plan` output), `docs/file-formats.md`, `docs/draft-a-change-from-an-issue.md`, links to the moved ADRs; the URLs of the four own ADR pages change.
- Adopting repositories: `plan` reports a migration until `apply` has run; a workflow caller pinned to an older `propose.yml` keeps writing to `docs/adr/`, which `plan` then reports again.
- The governance source's ADR-0001 says own ADRs "live in `docs/adr/`, outside that directory": `docs/adr/local/` satisfies it. Its wording belongs to the governance repository and is not touched here.
