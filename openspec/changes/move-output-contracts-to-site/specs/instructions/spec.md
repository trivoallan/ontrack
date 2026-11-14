## MODIFIED Requirements

### Requirement: Output format
The output SHALL follow the contract in the commands reference, `docs/commands.md`, as lines:
1. `<!-- ontrack:begin -->`, then `## Project rules (ontrack)`, then an empty line;
2. for each ADR carrying decided traits, sorted by reference: `### <title> (<reference>)`, an empty line, a line holding three backticks followed by `yaml`, the traits block, a line holding three backticks, then an empty line. The title is read as in `adr-revision`; without one, the heading is the reference alone;
3. when at least one ADR is pending: `### Not yet decided`, an empty line, one line `- <title> (<reference>)` per pending ADR sorted by reference, then an empty line;
4. `<!-- ontrack:end -->`.

The output SHALL be the same for the same files, whatever the order the file system lists them in. With no decided and no pending ADR, the block SHALL still be printed, reduced to items 1 and 4. On success the exit code SHALL be `0`.

#### Scenario: One decided, one pending
- **WHEN** `trivoallan/ADR-0006-commits` (title `Commits`) is `accepted` with the traits block `commits:`, `  scopes: [api, cli, docs]`, `  tool: commitlint`, and `trivoallan/ADR-0002-localization` (title `Localization`) is `proposed`
- **THEN** the output is the example of the commands reference, `docs/commands.md`, byte for byte
- **AND** the exit code is `0`

#### Scenario: Nothing decided, nothing pending
- **WHEN** the project has no `docs/adr/` directory
- **THEN** the output is exactly `<!-- ontrack:begin -->`, `## Project rules (ontrack)`, an empty line and `<!-- ontrack:end -->`
- **AND** the exit code is `0`
