## MODIFIED Requirements

### Requirement: Renamed pages redirect
When a page of `docs/` is renamed, the site SHALL serve a redirect from its former URL to the new one, so that a link published before the rename still arrives. The pages `find-a-source` and `write-your-own-source` SHALL redirect to `find-a-track` and `write-your-own-track`. The pages `revise-a-question` and `ontrack-engineering/questions` SHALL redirect to `revise-a-convention` and `ontrack-engineering/conventions`. Each page once served under `adr/trivoallan/` SHALL redirect to the page of the same name under `adr/engineering/`.

#### Scenario: A link to the former guide
- **WHEN** a reader opens `/ontrack/write-your-own-source/`
- **THEN** the reader arrives at `/ontrack/write-your-own-track/`

#### Scenario: A link to the former search guide
- **WHEN** a reader opens `/ontrack/find-a-source/`
- **THEN** the reader arrives at `/ontrack/find-a-track/`

#### Scenario: A link to an ADR under its former namespace
- **WHEN** a reader opens `/ontrack/adr/trivoallan/adr-0006-commits/`
- **THEN** the reader arrives at `/ontrack/adr/engineering/adr-0006-commits/`

#### Scenario: A link to the former guide on revising
- **WHEN** a reader opens `/ontrack/revise-a-question/`
- **THEN** the reader arrives at `/ontrack/revise-a-convention/`

#### Scenario: A link to the former list of the track
- **WHEN** a reader opens `/ontrack/ontrack-engineering/questions/`
- **THEN** the reader arrives at `/ontrack/ontrack-engineering/conventions/`
