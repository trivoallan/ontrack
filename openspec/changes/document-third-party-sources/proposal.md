## Why

A person who wants to install a source written by someone else, or to read one before writing their own, has no way to find it: the documentation links to one source in use and nothing else. The guide for authors says how to publish to an npm registry (#119), but not how a published source is found. Source: trivoallan/ontrack#127.

## What Changes

Documentation only. No command, output or file format changes.

- `docs/write-your-own-source.md`, step "Publish it": ask authors to add the keyword `ontrack-source` to the `package.json` of a published source. The keyword `ontrack` is already used on npm by unrelated packages; `ontrack-source` returns nothing today.
- Same guide: say what the README of a source tells a person before they install it: how many questions it asks, on which subjects, which ones carry a `check` command, and the alias it proposes.
- New page `docs/find-a-source.md`: one link to the npm search for `keywords:ontrack-source`, what to read before installing, how to install under an alias, and that a repository takes the whole source and may answer `rejected` to the questions that do not apply to it.
- `site/astro.config.mjs`: list the new page in the sidebar.
- `docs/index.md`: one question in the FAQ that links to the new page.

Not in this change:

- A hand-maintained list of sources. Revisit it when at least three sources exist that are written by other people.
- Finding sources published by git URL only.
- Adding the keyword to `@trivoallan/ontrack-governance`: that package lives in trivoallan/governance. Until it is done, the search link returns no result.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The change edits the content of pages; no requirement of `docs-site` or `sources` moves. Source discovery inside a repository still reads the `ontrack` key and ignores `keywords`. The change declares `skip_specs`, as earlier documentation-only changes did.

## Impact

- `docs/write-your-own-source.md`, `docs/find-a-source.md` (new), `docs/index.md`.
- `site/astro.config.mjs`: one sidebar entry.
- No code under `src/`, no test, no dependency.
- Follow-up outside this repository: the keyword on `@trivoallan/ontrack-governance`.
