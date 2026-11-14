# Tasks

## 1. Dependency and models

- [ ] 1.1 Add `zod` (version 4) to `dependencies`; verify `npm ci` succeeds and `node -e "import('zod').then(m => console.log(typeof m.z.toJSONSchema))"` prints `function` on Node 20.19
- [ ] 1.2 Add the `src/schemas` module exporting `projectManifest`, `sourceManifest`, `ontrackKey` and `adrFrontmatter` as described in design.md, with a test file covering each model's accepted and refused values (`adr` missing, `adr: 1`, `namespace: null`, unknown keys kept, `revision` of `"3"`, `"0"`, `"1.5"`, `"-1"`, `"abc"`, quoted and empty `title`); verify the new tests pass

## 2. Source discovery

- [ ] 2.1 Make `discoverSources` parse the project manifest and each installed manifest through the models, mapping issues to the existing error messages, and keep the "outside its package" check in place; verify `node --test test/sources.test.*` passes with no change to the existing assertions
- [ ] 2.2 Add a test that a project `package.json` whose `dependencies` is not a string map fails with the `cannot read <manifest>` error; verify it passes
- [ ] 2.3 Remove the now unused `isObject`/`typeof` checks; verify `grep -n "typeof" src/sources.*` prints nothing

## 3. Frontmatter values

- [ ] 3.1 Make `readRevision`, `compareRevision` and `readTitle` obtain `revision` and `title` by parsing the scanner's top-level pairs with `adrFrontmatter`, leaving `frontmatter()` and `setRevision()` untouched; verify `node --test test/revision.test.*` passes with no change to the existing assertions
- [ ] 3.2 Verify `git diff main -- src/revision.*` shows no change inside `frontmatter`, `mayBelongToFrontmatter` or `setRevision`

## 4. Verify

- [ ] 4.1 Run `npm test`; verify every suite passes and the three coverage thresholds hold at 95 %
- [ ] 4.2 Verify `git diff main --stat -- test/` shows only added tests (no edited expectation in existing ones), and that `ontrack plan` in this repository prints the same output as on `main`
- [ ] 4.3 Verify the pull request's `test` and `node-20` checks pass
