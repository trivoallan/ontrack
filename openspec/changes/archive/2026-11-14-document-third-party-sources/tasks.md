## 1. Author guide

- [x] 1.1 In `docs/write-your-own-source.md`, step 4 "Publish it", ask authors to add `"keywords": ["ontrack-source"]` before `npm publish`, with a link to `find-a-source.md`; verify the registry and git paths written in #119 are unchanged
- [x] 1.2 In the same step, add a short paragraph on the README of a source: number of questions, subjects, which carry a `check`, proposed alias; verify it names no field ontrack would have to read
- [x] 1.3 In "Go further", link to `find-a-source.md`; verify the frontmatter `description` still matches the page

## 2. Page for the reader who installs

- [x] 2.1 Create `docs/find-a-source.md` with `title:` and `description:`: the npm search link for `keywords:ontrack-source`, a link to `@trivoallan/ontrack-governance` by name, what to read before installing, the install line under an alias, then `npx ontrack plan`; verify the search URL opens the npm search in a browser
- [x] 2.2 In the same page, state the cost of a source: every question arrives as `proposed`, `rejected` is a full answer, a revised question comes back even when rejected; verify each statement against `docs/how-it-works.md` and `docs/commands.md` and link to them
- [x] 2.3 Add `{ slug: 'find-a-source' }` to the sidebar in `site/astro.config.mjs`, after `tutorial`; verify the page shows in the navigation of the built site

## 3. Home page

- [x] 3.1 In `docs/index.md`, add a question to the FAQ, "Where do I find a source someone else wrote?", that links to `find-a-source.md`; verify the link resolves

## 4. Verification

- [x] 4.1 Build the site with its link check, as CI does; verify it exits with `0`
- [x] 4.2 Open an issue in trivoallan/governance to add the keyword `ontrack-source` to `@trivoallan/ontrack-governance`, and reference it from trivoallan/ontrack#127
