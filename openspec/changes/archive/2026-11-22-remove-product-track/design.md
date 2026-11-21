## Context

Pull request #230 did three things at once: it ruled on the product track,
it made the site's catalogue serve every installed track, and it moved the
desk-test data to `experiments/`. Only the first is being withdrawn, along
with the product-management artifacts in `research/` and the data in
`experiments/`, which only `research/` explained. The catalogue code reads
tracks from track discovery and never names the product track
(`site/src/track.mjs`, `site/astro.config.mjs`). Once the dependency is
gone, it serves one track with no code change.

Three pages outside the product track link to what is deleted:
`docs/find-a-track.md`, `docs/why-ontrack.md` and
`docs/ontrack-engineering/use-it.md`. No ADR that stays links to them.

The in-force ADRs that bear on this change are `local/ADR-0025`, whose rule 4
says the ADR directory is a log of decisions, `local/ADR-0028` and the
`local/ADR-0026` it superseded, the five `product/` ADRs, and
`engineering/ADR-0016`, which plans this work as an OpenSpec change.

## Goals / Non-Goals

**Goals:**

- No trace of the product track or of its artifacts is left in force: no
  dependency, ADR, instruction, page, check or config line.
- Everything else #230 brought, the multi-track catalogue above all, keeps
  working and stays specified.

**Non-Goals:**

- Changing the package `@trivoallan/ontrack-product` or its repository.
- Editing archived changes that cite `research/` or `experiments/`.
- Simplifying the catalogue code back to a single track.

## Decisions

**Delete the ADRs, do not supersede them.** The maintainer's decision.
Superseding them would follow rule 4 of local/ADR-0025, which keeps every
ruled ADR in the directory as a log. It would also leave five ADRs of a track
the repository no longer installs in the site's navigation. The git history
and this change are the record.

**Delete local/ADR-0028 instead of superseding it.** ADR-0028 superseded
ADR-0026 only to add the product track, with the same traits. Deleting it
puts ADR-0026 back in force as written. `.npmrc` and `dependabot.yml` are
restored to what they were before #230, and `AGENTS.md` gets ADR-0026's block
back. Writing a new ADR to supersede ADR-0028 would restate ADR-0026 under a
new number.

**Point the "Use it" link at ADR-0026, not ADR-0024.** Before #230 it linked
to ADR-0024, which ADR-0026 had already superseded. The link follows the
decision in force.

**Keep the multi-track specs, with a fictitious track.** The scenarios used
`ontrack-product` as their second track. They now use
`@example/ontrack-security` under the alias `security`, a name the spec
already uses for a missing track. The requirements do not change. The
alternative, removing those scenarios and the code paths they cover
(a second track, a README with no domain table), would undo a generic
capability the change keeps.

**Delete the archive `2026-11-21-dogfood-product-track`.** The maintainer's
decision. The specs it shaped stay, and the git history holds the change.

## Risks / Trade-offs

- [The catalogue's second-track and no-domain-table paths no longer run
  against a real track in any build] → They stay specified, and the next
  track ontrack installs exercises them again.
- [17 archived changes link to `research/`, and 3 to `experiments/`, and
  those links stop resolving] → Accepted. Archives are not edited.
  `site/check-links.mjs` checks the site's pages, not `openspec/`.
- [Rule 4 of local/ADR-0025 is not followed for these ADRs] → Recorded here
  and in the ADR review manifest. The rule itself is not changed.
- [`npm ci` on an old lockfile] → The lockfile is regenerated with
  `npm uninstall product`, not edited by hand.

## Migration Plan

One pull request. Rollback is reverting it: every deleted file is in its
parent commit.

## Open Questions

- local/ADR-0025's rule 4 does not foresee deleting the ADRs of a withdrawn
  track. This change does it once, on the maintainer's decision. If it should
  become the rule, a later ADR superseding ADR-0025 says so; this change
  writes none.
