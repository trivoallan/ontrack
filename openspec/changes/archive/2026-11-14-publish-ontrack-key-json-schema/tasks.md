# Tasks

## 1. Prerequisite

- [x] 1.1 Verify `validate-boundaries-with-zod` has landed: the `src/schemas` module exports `ontrackKey` and `zod` is in `dependencies`; if not, stop and report rather than hand-writing a schema

## 2. Generate and publish

- [x] 2.1 Add a function that builds the document-level schema from `ontrackKey` (root object, `ontrack` property, `$schema`, `$id`, descriptions including the "inside the package" rule) and a script, exposed as `npm run schema`, that writes it to `schema/ontrack.schema.json` with a trailing newline; verify running it twice leaves `git status` unchanged after the first run
- [x] 2.2 Commit the generated `schema/ontrack.schema.json` and add `schema/` to `files` in `package.json`; verify `npm pack --dry-run` lists `schema/ontrack.schema.json`

## 3. Tests

- [x] 3.1 Add a test that derives the schema and compares it with the committed file, failing with a message that names `npm run schema`; verify it passes, and fails with that message after a temporary edit of the committed file
- [x] 3.2 Add tests for the spec's scenarios on the derived schema's structure: `ontrack.required` is exactly `["adr"]`, `adr` and `namespace` are of type `string`, additional properties are not forbidden at the root or inside `ontrack`, and the root requires nothing; verify they pass

## 4. Documentation

- [ ] 4.1 Add a README section for source authors: what the schema is, its URL, and the VS Code `json.schemas` entry that applies it to `package.json`; verify in VS Code that a scratch `package.json` with `"ontrack": { "namespace": "x" }` shows a missing-`adr` diagnostic and that adding `"adr": "docs/adr"` clears it

## 5. Verify

- [x] 5.1 Run `npm test`; verify all suites pass and coverage holds at 95 %, and that the pull request's `test` and `node-20` checks pass
- [x] 5.2 After merge, verify the `$id` URL returns the committed file
