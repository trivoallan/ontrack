# Tasks

## 1. Fixtures

- [x] 1.1 Write a test helper that builds a fixture project in a temporary directory from a description (project dependencies, and each installed package's `package.json`), so the cases below (one source plus a plain dependency; alias different from package name; no source; scoped source; `adr` escaping the package; missing `adr`; dependency not installed; no `package.json`) need no committed `node_modules`; check that the helper's temporary directories are removed after the tests

## 2. Discovery

- [x] 2.1 Write `discoverSources(projectRoot)` in `src/sources.mjs`: read `dependencies` and `devDependencies`, open each `node_modules/<name>/package.json`, keep those with an `ontrack` object, return `{ namespace, declaredNamespace, packageName, adrDir }` sorted by `namespace`; check it with the "Sources come from npm dependencies" and "The npm alias is the local namespace" scenarios in `test/sources.test.mjs`
- [x] 2.2 Validate the `ontrack` key (unscoped alias, `adr` present, a string, resolving inside the package) with errors that name the source; check it with the "Scoped alias" and "Source ADR directory" scenarios
- [x] 2.3 Fail clearly on a missing `package.json` and on a declared dependency missing from `node_modules`; check it with the "Missing installation is an error" scenarios

## 3. Verification

- [x] 3.1 Run `npm test` on Node 24 and check that it passes with coverage at or above 95% on lines, branches and functions
- [x] 3.2 Run `openspec validate source-discovery --strict` and check that it passes
