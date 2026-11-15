## Context

This repository installs `@trivoallan/ontrack-engineering` as `trivoallan` and holds its 26 ruled answers in `docs/adr/trivoallan/`. The tutorial and "Use it" tell adopters to do the same. With `rename-track-namespace`, reinstalling under `engineering` lets `apply` move the folder whole, then list what still points at the old namespace. A trial on a copy of this repository listed about 50 links (local ADRs, `CONTRIBUTING.md`, arc42 pages, `concepts.md`, the schema README) and 4 `supersedes:` entries (`local/ADR-0023`, `local/ADR-0024`), and showed the rules block skipped until those entries are fixed.

Some uses of the alias are not Markdown links, so `apply` does not list them: `.github/dependabot.yml` excludes the dependency by its alias, `.github/workflows/track-updates.yml` runs `npm update trivoallan`, `site/` reads `node_modules/trivoallan/` in four places, `openspec/schemas/spec-driven-with-adr/schema.yaml` names `docs/adr/trivoallan/` in its instructions, and `commitlint.config.mjs` names an ADR path in a comment. The closed issues #192, #193 and #194 are titled `[trivoallan/ADR-…]`, which is how the review prompt recognizes a ruling already tracked.

`trivoallan/ADR-0001`, accepted here, freezes a ruled ADR's body: rule 4 lets a frozen ADR receive only its `status` and its `check:` line. The 7 local ADRs that link to `../trivoallan/` are ruled.

## Goals / Non-Goals

**Goals:**
- The documentation recommends an alias derived from the package name, and this repository follows it.
- After the change, `ontrack plan` prints `engineering: 26 unchanged` and nothing else, `check` gives the result it gives today, and the site has no broken internal link.
- Every link published to an ADR page before the change still arrives.

**Non-Goals:**
- Changing the track: its declared `namespace`, its ADR-0001 prose and the internal repository name it carries are the track's, reported upstream.
- Replacing `trivoallan` where it is a sample alias (specs, tests, `docs/commands.md`, the review prompt) or history (CHANGELOG, archived changes).
- Changing any decision: every trait stays as ruled.

## Decisions

### The alias is the package name without scope and without `ontrack-`

`@trivoallan/ontrack-engineering` → `engineering`. The rule is stated once in "Use it" and applied in the tutorial; a collision between two tracks is solved by prefixing the author (`acme-engineering`).

*Why not `reference`:* it is the track's role for ontrack, not what it holds for the repository that installs it, and it reads as a reference to an ADR.
*Why not keep `trivoallan`:* it names the author, which the scope already does, and says nothing of the content.

### The rename goes through `ontrack apply`

`npm uninstall trivoallan`, `npm i -D engineering@npm:@trivoallan/ontrack-engineering@^0.6.0`, then `npx ontrack apply`. The moved files keep their bytes, so every ruling stays. This is also the change's test of `rename-track-namespace` on a real repository.

*Why not `git mv` by hand:* it proves nothing about the feature adopters will use.

### Ruled ADRs receive reference updates only

In a ruled ADR, a link target and a `supersedes:` entry are rewritten to the new path; no other character changes. `local/ADR-0025` records this as an addition to rule 4 of `trivoallan/ADR-0001` ("what a frozen ADR may still receive"): a reference whose target moved. Because rule 4 is part of an accepted track ADR, ADR-0025 supersedes `trivoallan/ADR-0001`, says that every other rule of it holds, and carries its traits and its `check:` line, so `AGENTS.md` and `check` keep them.

*Why not a superseding ADR for each of the 7 ADRs:* seven restatements for a path change, and the next rename would need seven more.
*Why not leave the references:* dead links in the site, and `supersedes:` entries that match nothing put `ADR-0018` and `ADR-0020` back in force, so the rules block is skipped.
*Why not ask the track to revise ADR-0001 first:* the right fix in the long run, and it is reported upstream; waiting for it would hold this change on another repository's release. When the track revises rule 4, ADR-0025 is ruled again against the revision.

`local/ADR-0024` names the alias in its decision (`dependabot.yml` excludes `trivoallan`) and says that a renamed alias needs a new ADR. `local/ADR-0026` restates the exemption with `engineering`, supersedes it, and carries its traits and its `check:` line.

### The site follows the folder, and redirects

`site/` reads `node_modules/engineering/` (`content.config.ts`, `astro.config.mjs`, `track.mjs`, `pages/llms.txt.ts`). The ADR pages move from `adr/trivoallan/` to `adr/engineering/`; `astro.config.mjs` builds one redirect per file of `docs/adr/engineering/`, from the old URL to the new one, next to the existing redirects.

*Why not a single wildcard redirect:* the site is static; a redirect per page is what Astro emits as a file, and the list is derived from the folder, so a new ADR needs no edit.

### Issue titles are renamed with the maintainer's go-ahead

The three closed issues are retitled `[engineering/ADR-…]` with `gh issue edit`, only once the maintainer agrees, since it changes state outside the repository.

## Risks / Trade-offs

- [The change lands before `rename-track-namespace` is merged] → the branch is stacked on it, and the apply tasks start by checking that `npx ontrack plan` prints the `rename:` line.
- [External links to `adr/trivoallan/…` pages] → the redirects cover every page that existed under that path.
- [A future revision of `trivoallan/ADR-0001` (then `engineering/ADR-0001`)] → `plan` shows it as revised; ruling it again means checking the local ADR still adds only what it adds.
