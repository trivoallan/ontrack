# Proposal

## Why

`ontrack plan` (#4) needs the list of sources a project uses, and where each
one keeps its ADRs. A source is added with plain npm
(`npm i -D <alias>@git+<url>`), so the project's `package.json` and
`node_modules` already hold everything: ontrack only has to read them.
Source: trivoallan/ontrack#3.

## What Changes

- A function that lists the project's sources: dependencies whose installed `package.json` carries an `ontrack` key.
- The dependency name (the npm alias) becomes the source's local namespace.
- A dependency without an `ontrack` key is ignored; a declared dependency missing from `node_modules`, or a malformed `ontrack` key, is a clear error.

## Capabilities

### New Capabilities
- `sources`: discovering a project's ontrack sources from its npm dependencies.

### Modified Capabilities
<!-- none -->

## Impact

- New files: `src/sources.mjs`, `test/sources.test.mjs` (fixtures built in a temporary directory).
- No new dependency. Not wired into the CLI yet: #4 consumes it.
