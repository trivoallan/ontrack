# Proposal

## Why

ADR-0005 rules `validation.data_files: json-schema`. A source author writes
an `ontrack` key in their `package.json` and only learns it is wrong when
someone runs ontrack against the installed package. A published JSON Schema
lets their editor flag the mistake while they type.
Source: trivoallan/ontrack#32.

## What Changes

- ontrack publishes a JSON Schema describing the `ontrack` key of a source's
  `package.json`, at a stable path in the repository and in the package.
- The schema is derived from the model that validates the key at run time,
  so the two cannot disagree; a test fails when the committed file is out of
  date.
- The README tells source authors how to point their editor at it.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `sources`: adds a requirement that a JSON Schema for a source's `ontrack`
  key is published and agrees with what discovery accepts.

## Impact

- New `schema/ontrack.schema.json` (generated, committed), a generation
  script and an npm script to run it; `package.json` `files` gains the
  schema.
- `README.md`: a short section for source authors.
- Depends on `validate-boundaries-with-zod`, which introduces the model the
  schema is derived from.
- No change to discovery's behaviour.
