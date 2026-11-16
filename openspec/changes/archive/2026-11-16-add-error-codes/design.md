## Context

`src/` throws an `Error` at 21 places; `src/cli.ts` catches it and prints `ontrack: <message>`, and prints the same form for what yargs refuses. `src/agents.ts` catches the trait conflict and quotes its message in the line `AGENTS.md: skipped, <message>`. The tests compare messages; the Error messages page has one row per message.

## Goals / Non-Goals

**Goals:**
- A reader, a script or an agent can name a failure without matching a sentence.
- A code leads to its row on the Error messages page.
- The codes cannot drift from the page without a test failing.

**Non-Goals:**
- A `--json` form of the errors.
- Printing the address of the page in the error line.
- Codes for lines that are not errors (`AGENTS.md:` lines, `next:` lines, check results).

## Decisions

**The form is `ontrack[E105]: <message>`.** The maintainer chose the form rustc gives its errors over a name at the end of the line or before the message. The code sits where a reader and a pattern both look first, and the sentence keeps its place after the colon.

**Three digits, grouped by hundreds.** `E001` is the command line; `E1nn` the project's `package.json` and its tracks; `E2nn` the ADRs; `E3nn` what `review` is asked. The group tells a reader where to look before they open the page, and each group has room to grow. A number says nothing by itself, which is the cost of this form: the page is the registry.

**One code for every usage error.** The sentences of a refused command line are yargs's, not ontrack's (`Unknown argument: …`, `Not enough arguments following: …`). ontrack cannot promise a code per sentence it does not write, so all of them are `E001`.

**The code is a field of the error, not part of its message.** `OntrackError` carries `code` beside `message`. `src/agents.ts` goes on quoting the message in the `AGENTS.md: skipped, …` line, and the tests that compare messages do not change.

**One `throw` per code.** The unreadable `package.json` had one message with three endings; it now has four codes (`E101` missing, `E102` not JSON, `E103` a field that is not a map, `E104` any other reason), chosen where the cause is known.

**An unforeseen failure has no code.** A plain `Error` reaching `src/cli.ts` prints as before. Giving it a catch-all code would promise a stable name for what ontrack does not know.

**The page is checked against the source.** A test reads every `'E<nnn>'` of `src/` and every `<a id="e<nnn>">` of the page, and fails when the two lists differ, when a code is written twice in the source, or when `src/` holds a `new Error(`.

## Risks / Trade-offs

- A script that matched `^ontrack: ` to detect an error breaks. → The changelog says so under BREAKING CHANGES; the exit code was already the documented signal, and ontrack is below 1.0.
- A retired failure leaves a hole in the numbering. → Intended: a code is never reused, and the page may keep a row saying since which version it is no longer printed.
- The test finds codes by their spelling (`'E<nnn>'`), so a code built at run time would escape it. → `src/` writes each code once, as a literal; the test on `new Error(` catches a failure added without one.
