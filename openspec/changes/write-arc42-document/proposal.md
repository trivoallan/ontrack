# Proposal

## Why

ADR-0010 rules `architecture.document: arc42`, but
`docs/architecture/arc42/` does not exist. Someone, or an agent, who wants
to know what ontrack talks to, how its modules depend on each other or why
it reads frontmatter without a YAML parser has to rebuild that from the
code. Source: trivoallan/ontrack#35.

## What Changes

- Twelve files under `docs/architecture/arc42/`, one per arc42 section, with
  the file names ADR-0010 lists and a `title:` each (ADR-0008).
- Sections with something to say are written from the code, the ADRs and
  the specs as they are today; a section with nothing to say yet keeps its
  file with one line saying so.
- Section 9 links to `docs/adr/` instead of repeating decisions; behaviour
  is linked to `openspec/specs/`, never restated.
- Sections 3, 5 and 7, which show structure, are written in prose and leave
  their diagrams to the LikeC4 model (`model-architecture-with-likec4`);
  flows in section 6 are drawn in Mermaid.

## Capabilities

### New Capabilities
<!-- none: documentation only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- New directory `docs/architecture/arc42/` (12 Markdown files).
- No code, dependency or CI change. Not shipped in the package.
- Readable on GitHub as is; rendered by the Starlight site once
  trivoallan/ontrack#34 lands.
