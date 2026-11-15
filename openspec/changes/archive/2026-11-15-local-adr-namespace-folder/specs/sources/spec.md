## ADDED Requirements

### Requirement: The alias local is reserved
`local` is the namespace of the project's own ADRs. When a dependency that carries an `ontrack` key is declared under the name `local`, discovery SHALL fail with an error that names `local` and asks for another alias.

#### Scenario: A source aliased local
- **WHEN** the project declares `"local": "npm:adr-catalog@1"` and the installed package carries an `ontrack` key
- **THEN** discovery fails with an error that names `local` and asks for another alias
