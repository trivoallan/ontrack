## Context

`src/schemas.ts` holds the zod models of what ontrack reads, and derives `schema/ontrack.schema.json` from one of them with `z.toJSONSchema`; `scripts/schema.ts` writes the file and a test compares it with the derived one. The documents of `--json` are built in `src/json.ts` as plain objects, with inferred types and no model.

## Goals / Non-Goals

**Goals:**
- A reader of a document can validate it, and generate types from it.
- A schema cannot drift from what the command prints.
- The way of the existing schema is followed, not a second one invented.

**Non-Goals:**
- Validating the documents at run time before printing them.
- A JSON Schema validator among the dependencies.
- A `$schema` key in the documents, or versioned addresses.

## Decisions

**Models in zod, in their own file.** `src/schemas.ts` says it holds what ontrack reads from outside and nothing else. What it writes goes to `src/documents.ts`.

**The types of the code come from the models.** `src/json.ts` and the handlers declare their documents as `z.infer` of the models. A key the code adds and the model lacks, or a value of another type, fails `npm run typecheck`.

**The model is strict, the schema is open.** A model refuses a key it does not name, so that parsing a document in the tests catches what the types let through. The published schema drops that refusal (`additionalProperties`), because the contract lets a later version add a key and an older schema must still accept the document.

**One file per document.** A validator takes a schema whose root is the document. Six small files beside `ontrack.schema.json`, named after the command, rather than one file of definitions to point into.

**The address is the file on `main`.** As for `ontrack.schema.json`: `https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/<name>.schema.json`. The package ships the same files, which are the ones of the installed version.

**No validator is added.** The tests parse the documents with the models, and the schemas are derived from the models by zod. Checking the derivation itself would test zod.

## Risks / Trade-offs

- The schema on `main` may be ahead of the installed version. → The schemas are open, so a newer one only fails on a key the older version does not print yet; the installed package holds the exact one.
- `review` names its ADRs in three shapes, which the schema gives as alternatives without tying each to its `kind`. → Said in the reference; tying them would need a schema per kind for little gain.
- Descriptions live in the models and can go stale. → They are short, and the commands reference stays the specification.
