## Context

Each command builds data (`Plan`, `Action[]`, `CheckResult[]`, `Instructions`, the ADRs `review` selects), then a formatter turns it into the text the commands reference specifies. `apply` and `plan` add lines on standard error; `review` writes its "nothing to review" line there. Errors are caught in `src/cli.ts`.

## Goals / Non-Goals

**Goals:**
- A program reads what every command reports, and every error, without parsing text.
- The JSON and the text cannot disagree.
- The documents are stable enough to be a contract.

**Non-Goals:**
- A JSON Schema file for the documents.
- A streaming form, or progress lines.
- Parsing the traits: ontrack reads them as lines, and has no YAML parser.

## Decisions

**Every command, in one change.** The maintainer chose all five commands over the two a CI job reads today. One option, declared once as global, behaves the same everywhere.

**The documents are built from the data the text is built from.** `src/json.ts` maps `Plan`, `Action`, `CheckResult`, `Adr` to plain objects. It does not serialize the internal types as they are: absolute paths become relative, optional fields become `null`, and a renamed field of the code does not rename a key.

**Every key is always present.** `null` or an empty list stands for what the text omits. A reader tests a value, never the presence of a key.

**Two shapes for an ADR.** An ADR of a track (`name`, `title`, `category`, `status`, `revision`, `check`) in `plan` and `apply`; an ADR of the repository (`ref`, `title`, `status`, `path`) in `check`, `instructions` and `review`. They are the two things the code already tells apart.

**`plan --json` always holds every ADR.** The text hides the unchanged ones unless `--all`, to stay short. A document is filtered by its reader, so `--all` has no effect on it.

**`apply --json` has one shape.** The text of `apply` is the text of `plan` when there is nothing to apply. The document always has `actions` (empty then) and `remaining`.

**Standard error stays empty unless the command fails.** The next step becomes `next` (two counts); "nothing to review" becomes `kind: "none"`. A program that captures both streams gets one document.

**`agents` is the list of lines.** The lines about `AGENTS.md` are already short sentences with a stable start, specified by `agents-file`. Giving them a second, structured form would be a second contract for the same fact.

**`review --json` keeps the prompt as text.** The prompt is the product of `review`; the document adds which prompt it is and the ADRs it names.

**The error document carries the address of its row.** `docs` is the Error messages page and the code in lower case. It is `null`, with `code`, for a failure ontrack did not foresee.

**`--json` is read from the arguments for a usage error.** yargs has parsed nothing when it refuses a command line, so `src/cli.ts` looks for the literal `--json`.

**Indented output.** Two spaces: a person reads it too, and a program does not care.

## Risks / Trade-offs

- Five documents are five contracts to keep. → Each is built in one place, and `test/json.test.ts` fixes the keys of each.
- `traits` is YAML in a string. → Said in the reference; parsing it is left to a later change, which can add a key without breaking this one.
- The address in `docs` is the released site: an error added on `main` has no row there until the release. → The same holds for every link to the documentation.
