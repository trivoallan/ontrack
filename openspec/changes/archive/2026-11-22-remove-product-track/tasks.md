## 1. Uninstall the track

- [x] 1.1 `npm uninstall product`; check that `package.json` has no `product` key and `package-lock.json` no `@trivoallan/ontrack-product`
- [x] 1.2 Delete `docs/adr/product/` (ADR-0001 to ADR-0005)
- [x] 1.3 `npx ontrack plan` lists `engineering` alone and no `product` entry

## 2. Restore the cooldown decision for one track

- [x] 2.1 Delete `docs/adr/local/ADR-0028-the-tracks-of-this-owner-skip-the-cooldown.md`; check that ADR-0026 is accepted and superseded by nothing
- [x] 2.2 Restore `.npmrc` and `.github/dependabot.yml` to their content before #230 (`git show 5f2f16b:<file>`): one `min-release-age-exclude[]` line, `exclude: ["engineering"]`, comments citing local/ADR-0026
- [x] 2.3 In `docs/ontrack-engineering/use-it.md`, link the cooldown exemption to local/ADR-0026

## 3. Remove the product-management artifacts

- [x] 3.1 Delete `research/` and `experiments/`
- [x] 3.2 Delete `openspec/changes/archive/2026-11-21-dogfood-product-track/`
- [x] 3.3 `git grep -nE "research/|experiments/|ontrack-product|adr/product|ADR-0028"` outside `openspec/` returns nothing (the specs are task 5.1, synced at archive); leave the archived changes as they are

## 4. Remove the track from the site

- [x] 4.1 Delete `docs/ontrack-product.mdx` and `docs/ontrack-product/`
- [x] 4.2 `docs/find-a-track.md`: name the engineering track alone, as the track ontrack uses on itself, with its repository and its "Use it" page
- [x] 4.3 `docs/why-ontrack.md`: "This repository imports ontrack-engineering", with no mention of the product track and without calling it "the reference track"

## 5. Specs and instructions

- [x] 5.1 The delta specs of this change replace the product track by `@example/ontrack-security` in `track-catalogue` and `docs-site`; check that no file of `openspec/specs/` names `ontrack-product` once they are synced
- [x] 5.2 Regenerate `AGENTS.md` with the ontrack built from source (`npm run build`, then `node dist/bin/ontrack.js apply`): no product block, no ADR-0028 block, ADR-0026's block back

## 6. Verify

- [x] 6.1 `node dist/bin/ontrack.js check` passes and runs no `ontrack-product-check`; `node dist/bin/ontrack.js plan` reports nothing pending
- [x] 6.2 `npm test` passes at the coverage target and `npm run typecheck` passes
- [x] 6.3 `npm run build` in `site/` passes, `check-links.mjs` included; the navigation's "Tracks catalogue" holds `ontrack-engineering` alone, and "Example: how ontrack ruled" lists `local` and `engineering`
- [x] 6.4 `openspec validate remove-product-track --strict` passes
