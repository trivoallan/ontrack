## 1. Component

- [x] 1.1 Add `site/src/components/SiteTitle.astro`: Starlight's title, then the mark, `next` when `SITE_CHANNEL` is `next`, `v<version>` from the repository's `package.json` otherwise, each with its link and an accessible name
- [x] 1.2 Register it under `components` in `site/astro.config.mjs`
- [x] 1.3 Style the mark in `site/src/theme.css`, in both themes

## 2. Verification

- [x] 2.1 Build without `SITE_CHANNEL`: the header of the home page and of one guide shows `v<version>`, linked to the release notes
- [x] 2.2 Build with `SITE_CHANNEL=next` and `SITE_BASE=/ontrack/next`: both show `next`, linked to the root of the site
- [x] 2.3 Look at the header at 375, 1280 and 1440 pixels, light and dark: the mark is visible and nothing scrolls sideways
- [x] 2.4 Run `npm run build` in `site/`: the build and the link check pass
