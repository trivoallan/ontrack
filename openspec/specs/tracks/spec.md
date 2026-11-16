# tracks Specification

## Purpose
Lists the tracks a project uses, by reading its npm dependencies, so that commands know each track's local namespace and where its ADRs live.

## Requirements

### Requirement: Tracks come from npm dependencies
The system SHALL read the `dependencies` and `devDependencies` of the project's `package.json`, open each one's installed `node_modules/<name>/package.json`, and keep as a track every dependency whose installed `package.json` carries an `ontrack` object. Tracks SHALL be returned sorted by local namespace.

#### Scenario: One track among other dependencies
- **WHEN** the project depends on `platform` (installed with an `ontrack` key) and on `left-pad` (installed without one)
- **THEN** exactly one track is returned, `platform`

#### Scenario: No track
- **WHEN** no installed dependency carries an `ontrack` key
- **THEN** an empty list is returned

### Requirement: The npm alias is the local namespace
Each track's local namespace SHALL be the dependency name as written in the project's `package.json`, even when it differs from the installed package's own `name`. The namespace the track declares in its `ontrack` key SHALL be returned alongside, for information only.

#### Scenario: Alias different from the package name
- **WHEN** the project declares `"platform": "git+https://example.com/adr-catalog.git"` and the installed package is named `adr-catalog` with `"ontrack": { "namespace": "catalog", "adr": "docs/adr" }`
- **THEN** the track's local namespace is `platform`, and its declared namespace is `catalog`

#### Scenario: Scoped alias
- **WHEN** a scoped dependency such as `@acme/rules` carries an `ontrack` key
- **THEN** discovery fails with an error that calls `@acme/rules` a track and asks for an unscoped alias

### Requirement: The alias local is reserved
`local` is the namespace of the project's own ADRs. When a dependency that carries an `ontrack` key is declared under the name `local`, discovery SHALL fail with an error that names `local` and asks for another alias.

#### Scenario: A track aliased local
- **WHEN** the project declares `"local": "npm:adr-catalog@1"` and the installed package carries an `ontrack` key
- **THEN** discovery fails with an error that names `local` and asks for another alias

### Requirement: Track ADR directory
The `ontrack` key SHALL hold an `adr` string, a path relative to the installed package. The system SHALL return it resolved to an absolute directory, and MUST reject it when it is missing, not a string, or resolves outside the installed package.

#### Scenario: Valid ADR directory
- **WHEN** the installed track declares `"adr": "docs/adr"`
- **THEN** the track's ADR directory is `<project>/node_modules/<alias>/docs/adr`

#### Scenario: Path escaping the package
- **WHEN** the installed track declares `"adr": "../../etc"`
- **THEN** discovery fails with an error that names the track and its `adr` value

#### Scenario: Missing adr
- **WHEN** the installed track declares `"ontrack": { "namespace": "x" }`
- **THEN** discovery fails with an error that names the track and the missing `adr`

### Requirement: Missing installation is an error
When a declared dependency has no `node_modules/<name>/package.json`, discovery SHALL fail with an error that names the dependency and suggests running `npm install`. When the project has no `package.json`, discovery SHALL fail with an error that names the expected path. When that file is not valid JSON, or its `dependencies` or `devDependencies` is not a map of names to versions, the error SHALL name the path and the cause: the parser's reason, or the field.

#### Scenario: Dependency not installed
- **WHEN** the project declares `platform` but `node_modules/platform/package.json` does not exist
- **THEN** discovery fails with an error naming `platform` and `npm install`

#### Scenario: No package.json
- **WHEN** the project root has no `package.json`
- **THEN** discovery fails with an error naming `<project>/package.json`

### Requirement: Published schema for the ontrack key
The project SHALL publish a JSON Schema that describes the `ontrack` key of a track's `package.json`, at the path `schema/ontrack.schema.json` of the repository and of the installed package. The schema SHALL apply to a `package.json` document: it constrains the document's `ontrack` property and nothing else. It SHALL agree with track discovery on the key's shape: `adr` is a required string, `namespace` is an optional string, and properties discovery ignores are allowed. The schema's title and description SHALL call the package a track. The published file MUST be the one derived from the model discovery validates with; a published file that differs from the derived one SHALL make the test suite fail.

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

#### Scenario: The schema names a track
- **WHEN** `schema/ontrack.schema.json` is read
- **THEN** its title and the description of the `ontrack` property say "track", and neither says "source"
