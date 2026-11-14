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

### Requirement: Published schema for the ontrack key
The project SHALL publish a JSON Schema that describes the `ontrack` key of a source's `package.json`, at the path `schema/ontrack.schema.json` of the repository and of the installed package. The schema SHALL apply to a `package.json` document: it constrains the document's `ontrack` property and nothing else. It SHALL agree with source discovery on the key's shape: `adr` is a required string, `namespace` is an optional string, and properties discovery ignores are allowed. The published file MUST be the one derived from the model discovery validates with; a published file that differs from the derived one SHALL make the test suite fail.

#### Scenario: Valid key
- **WHEN** a `package.json` holding `"ontrack": { "namespace": "catalog", "adr": "docs/adr" }` is validated against the schema
- **THEN** it is valid

#### Scenario: Missing adr
- **WHEN** a `package.json` holding `"ontrack": { "namespace": "x" }` is validated against the schema
- **THEN** it is invalid, and the error points at the missing `adr` property

#### Scenario: Wrong type
- **WHEN** a `package.json` holding `"ontrack": { "adr": 1 }` is validated against the schema
- **THEN** it is invalid

#### Scenario: Package without the key
- **WHEN** a `package.json` with no `ontrack` property is validated against the schema
- **THEN** it is valid, whatever its other properties

#### Scenario: Published file out of date
- **WHEN** the model of the `ontrack` key changes and `schema/ontrack.schema.json` is not regenerated
- **THEN** the test suite fails and names the command that regenerates the file
