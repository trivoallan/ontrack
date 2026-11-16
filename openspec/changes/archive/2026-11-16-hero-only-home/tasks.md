## 1. Before

- [x] 1.1 Check that `show-version-in-header` is applied: the header shows the version

## 2. The new page

- [x] 2.1 Write `docs/why-ontrack.md` from the four sections of the home page: the problem, "Proposed, not imposed" with its link to "How it works", the comparison table and its note, "It governs itself"; end with links to the features page and the tutorial
- [x] 2.2 List it first in "Start here" in `site/astro.config.mjs`

## 3. The home page

- [x] 3.1 Remove everything below the six capabilities from `docs/index.mdx`, and the imports it no longer uses
- [x] 3.2 Make the hero's second action "Why ontrack", leading to the new page
- [x] 3.3 Remove `docs/index.mdx` from `extra-files` in `release-please-config.json`

## 4. What the home page said alone

- [x] 4.1 Check each of the five answers of "Common questions" against the page that gives it; add to `docs/features.md` that any agent which reads `AGENTS.md` works
- [x] 4.2 Check that the tutorial gives the minimum Node version and the name of the npm package
- [x] 4.3 Point `docs/how-it-works.md` and `docs/architecture/arc42/01-introduction-and-goals.md` to the new page where they send the reader to the home page for what ontrack is for

## 5. Verification

- [x] 5.1 Run `npm run build` in `site/`: the build and the link check pass
- [x] 5.2 Look at the home page at 1280 by 720, 1440 by 900 and on a phone, light and dark: one screen, no empty band under the list
- [x] 5.3 Look at the new page in both themes, and at its table on a phone
