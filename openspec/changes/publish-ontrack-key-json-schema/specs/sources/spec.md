# Spec Delta

## ADDED Requirements

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
