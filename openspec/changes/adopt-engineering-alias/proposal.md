## Why

The documentation tells adopters to install the reference track as `trivoallan`, and this repository does the same. That alias names a person, repeats the npm scope, and says nothing of the content: every rule reads `trivoallan/ADR-0009-branching`. The rule "the package name without its scope and without `ontrack-`" gives `engineering`, describes what the track holds, and works for any track (`@acme/ontrack-security` → `security`). Now that ontrack can rename a namespace without losing rulings (`rename-track-namespace`, [#206](https://github.com/trivoallan/ontrack/issues/206)), the change costs this repository one `apply` and a pass on the references it lists.

## What Changes

- The documentation recommends the alias rule above, and `engineering` for `@trivoallan/ontrack-engineering`, in the tutorial, "Use it" and the home page; a collision is solved by prefixing the author (`acme-engineering`).
- This repository installs the track as `engineering`. `ontrack apply` moves `docs/adr/trivoallan/` to `docs/adr/engineering/` and regenerates `AGENTS.md`.
- Every reference `apply` lists is updated: Markdown links (local ADRs, `CONTRIBUTING.md`, arc42, `concepts.md`, the OpenSpec schema README, the site pages) and the `supersedes:` entries of `local/ADR-0023` and `local/ADR-0024`.
- In ruled local ADRs, only link targets and `supersedes:` entries change, never a word of text. `local/ADR-0025` records that exception to the frozen body and supersedes `trivoallan/ADR-0001`, whose rule 4 lists what a frozen ADR may still receive. `local/ADR-0026` restates `local/ADR-0024` with the new alias in `dependabot.yml`, as ADR-0024 itself asks for a renamed alias.
- Configuration that names the alias follows: `.github/dependabot.yml` (`exclude`), `.github/workflows/track-updates.yml` (`npm update`), the `commitlint.config.mjs` comment, the OpenSpec schema (`schema.yaml`, the path of the imported ADRs).
- The site reads `node_modules/engineering/`, serves the ADR pages under `adr/engineering/`, and redirects every `adr/trivoallan/…` URL to its new address.
- The three closed issues titled `[trivoallan/ADR-…]` are retitled `[engineering/ADR-…]`, so the review prompt still finds them when it checks for duplicates.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `docs-site`: catalogue pages read from `node_modules/engineering/adr/`; the former `adr/trivoallan/` URLs redirect.
- `track-catalogue`: the reference track is read from `node_modules/engineering/`; the "Use it" page gives the alias rule and installs the track as `engineering`.

## Impact

- **Depends on**: `rename-track-namespace` merged (PR #208). This change is stacked on that branch.
- **Repository files**: `package.json` and lock file, `docs/adr/trivoallan/` → `docs/adr/engineering/` (26 files, content unchanged), `AGENTS.md`, 7 local ADRs (references only), about 15 other Markdown files, `site/`, `.github/`, `commitlint.config.mjs`, `openspec/schemas/spec-driven-with-adr/`.
- **Public URLs**: the 26 ADR pages move; redirects keep old links working.
- **GitHub**: three issue titles change.
- **Outside this repository**: the track declares `"namespace": "trivoallan"` in its `ontrack` key, its ADR-0001 says it is imported into `docs/adr/trivoallan/`, and that ADR names another repository by its internal name. All three are the track's to fix in its next revision; this change only reports them.
- **Not changed**: examples in specs, tests, `docs/commands.md` and the review prompt (`[trivoallan/ADR-0015] secrets.guard`) that use `trivoallan` as a sample alias; the CHANGELOG; archived changes; the text of the imported ADRs.
