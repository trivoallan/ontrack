# Design

## Context

See proposal.md (Why). Sources are installed by npm under the alias the
project chose (`npm i -D platform@git+…`), so `node_modules/platform/` holds
the source whatever its own package name is.

## Goals / Non-Goals

**Goals:**
- One function, `discoverSources(projectRoot) → Source[]`, reading files only, no network and no npm invocation.

**Non-Goals:**
- Installing or updating sources (npm does that).
- Reading the ADRs themselves (#4), or schemas and traits (v2).
- `peerDependencies` and `optionalDependencies`: a source is something the project chose to install.

## Decisions

**Read `node_modules` directly, not `npm ls` or `package-lock.json`.**
The installed `package.json` is the only place the `ontrack` key exists, so
it must be read anyway. *Alternative:* `npm ls --json`, which spawns npm and
still does not expose the `ontrack` key.

**A declared but missing dependency is an error, even if it might not be a source.**
ontrack cannot tell whether an uninstalled dependency is a source, and a
silent skip would hide an out-of-date checkout behind "nothing to do".
*Alternative:* skipping missing dependencies, which makes `plan` lie on a
fresh clone.

**Scoped aliases are rejected.**
The alias becomes a directory name (`docs/adr/<alias>/`). A scoped name would
create nested directories and a namespace containing `/`. *Alternative:*
flattening `@acme/rules` to `acme-rules`, a rename nobody asked for.

**The `adr` path must stay inside the installed package.**
The value comes from a third-party `package.json`. A path such as `../..`
would point ontrack at files outside the source. *Alternative:* trusting
the value, which `plan` would then read from anywhere.

**Return shape.**
`{ namespace, declaredNamespace, packageName, adrDir }`: `namespace` is the
alias, `declaredNamespace` the source's own suggestion (or `null`),
`packageName` the installed `name`, `adrDir` an absolute path.

## Risks / Trade-offs

- [Hoisted or workspace layouts where `node_modules/<alias>` lives higher up] → Out of scope for v1; the error message names the path that was looked up.
- [A non-source dependency missing from `node_modules` blocks discovery] → The error says which one and suggests `npm install`, which is the fix in practice.
