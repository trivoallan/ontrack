## 1. Features page

- [x] 1.1 Write `docs/features.md`: one section per need, each capability a line with a link to the page that specifies it
- [x] 1.2 Write its section on gap issues, with trivoallan/ontrack#193 quoted without the first line of its body
- [x] 1.3 Write its last section on what ontrack leaves alone
- [x] 1.4 List the page first in "Start here" in `site/astro.config.mjs`

## 2. Home page

- [x] 2.1 Add the six capabilities under the hero of `docs/index.mdx`, each linked to its section of the features page
- [x] 2.2 Lay the list out in three columns and shorten the hero, in `site/src/theme.css`

## 3. Verification

- [x] 3.1 Check every line of the features page against the page it links to
- [x] 3.2 Run `npm run build` in `site/`: the build and the link check pass
- [x] 3.3 Look at the home page at 1280 by 720, at 1440 by 900 and on a phone, light and dark
