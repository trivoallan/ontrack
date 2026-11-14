# sources Specification

## Purpose

Lists the ontrack sources a project uses, by reading its npm dependencies, so that commands know each source's local namespace and where its ADRs live.

## Requirements

### Requirement: Sources come from npm dependencies
The system SHALL read the `dependencies` and `devDependencies` of the project's `package.json`, open each one's installed `node_modules/<name>/package.json`, and keep as a source every dependency whose installed `package.json` carries an `ontrack` object. Sources SHALL be returned sorted by local namespace.

#### Scenario: One source among other dependencies
- **WHEN** the project depends on `platform` (installed with an `ontrack` key) and on `left-pad` (installed without one)
- **THEN** exactly one source is returned, `platform`

#### Scenario: No source
- **WHEN** no installed dependency carries an `ontrack` key
- **THEN** an empty list is returned

### Requirement: The npm alias is the local namespace
Each source's local namespace SHALL be the dependency name as written in the project's `package.json`, even when it differs from the installed package's own `name`. The namespace the source declares in its `ontrack` key SHALL be returned alongside, for information only.

#### Scenario: Alias different from the package name
- **WHEN** the project declares `"platform": "git+https://example.com/adr-catalog.git"` and the installed package is named `adr-catalog` with `"ontrack": { "namespace": "catalog", "adr": "docs/adr" }`
- **THEN** the source's local namespace is `platform`, and its declared namespace is `catalog`

#### Scenario: Scoped alias
- **WHEN** a scoped dependency such as `@acme/rules` carries an `ontrack` key
- **THEN** discovery fails with an error that names `@acme/rules` and asks for an unscoped alias

### Requirement: Source ADR directory
The `ontrack` key SHALL hold an `adr` string, a path relative to the installed package. The system SHALL return it resolved to an absolute directory, and MUST reject it when it is missing, not a string, or resolves outside the installed package.

#### Scenario: Valid ADR directory
- **WHEN** the installed source declares `"adr": "docs/adr"`
- **THEN** the source's ADR directory is `<project>/node_modules/<alias>/docs/adr`

#### Scenario: Path escaping the package
- **WHEN** the installed source declares `"adr": "../../etc"`
- **THEN** discovery fails with an error that names the source and its `adr` value

#### Scenario: Missing adr
- **WHEN** the installed source declares `"ontrack": { "namespace": "x" }`
- **THEN** discovery fails with an error that names the source and the missing `adr`

### Requirement: Missing installation is an error
When a declared dependency has no `node_modules/<name>/package.json`, discovery SHALL fail with an error that names the dependency and suggests running `npm install`. When the project has no `package.json`, discovery SHALL fail with an error that names the expected path.

#### Scenario: Dependency not installed
- **WHEN** the project declares `platform` but `node_modules/platform/package.json` does not exist
- **THEN** discovery fails with an error naming `platform` and `npm install`

#### Scenario: No package.json
- **WHEN** the project root has no `package.json`
- **THEN** discovery fails with an error naming `<project>/package.json`
