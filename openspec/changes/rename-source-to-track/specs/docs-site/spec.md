## ADDED Requirements

### Requirement: Renamed pages redirect
When a page of `docs/` is renamed, the site SHALL serve a redirect from its former URL to the new one, so that a link published before the rename still arrives. The pages `find-a-source` and `write-your-own-source` SHALL redirect to `find-a-track` and `write-your-own-track`.

#### Scenario: A link to the former guide
- **WHEN** a reader opens `/ontrack/write-your-own-source/`
- **THEN** the reader arrives at `/ontrack/write-your-own-track/`

#### Scenario: A link to the former search guide
- **WHEN** a reader opens `/ontrack/find-a-source/`
- **THEN** the reader arrives at `/ontrack/find-a-track/`
