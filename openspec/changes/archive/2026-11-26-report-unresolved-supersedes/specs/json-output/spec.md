## MODIFIED Requirements

### Requirement: The plan document
`plan --json` SHALL print the keys `tracks`, `unresolved`, `agents` and `pending`. A track SHALL hold `namespace`, `adrs`, `rename` and `migration`; an ADR SHALL hold `name`, `title`, `category`, `status`, `revision` and `check`. `adrs` SHALL hold every ADR of the track, the unchanged ones too, whether or not `--all` is given. `unresolved` SHALL hold one `{ "ref", "name" }` per `supersedes:` entry that designates no ADR (see `plan`). `pending` SHALL be `true` when the exit code is `2`.

#### Scenario: A revised ADR
- **WHEN** the track ships `A.md` at revision 2 and the repository accepted it at revision 1
- **THEN** its entry has `"category": "revised"`, `"status": "accepted"` and `"revision": { "from": 1, "to": 2 }`

#### Scenario: A rename
- **WHEN** a rename from `docs/adr/old/` is pending for track `engineering`
- **THEN** the track has `"rename": { "from": "docs/adr/old/", "to": "docs/adr/engineering/" }`

#### Scenario: An unresolved supersedes entry
- **WHEN** `local/ADR-0002-new` is accepted with `supersedes: [ADR-0001-old]`, which designates no ADR
- **THEN** `unresolved` is `[{ "ref": "local/ADR-0002-new", "name": "ADR-0001-old" }]`
