# Tasks

## 1. Contract first

- [x] 1.1 Update the README: `apply` writes the rules block of `AGENTS.md` (replace, append, create), the `AGENTS.md:` lines printed by `plan` and `apply`, the `skipped` case, the Claude Code warning with its fix, and that the text between the markers belongs to ontrack; update the `instructions` section, which says the block is pasted by hand; check that every message in `specs/agents-file/spec.md` appears verbatim in the README

## 2. Block state and writing

- [x] 2.1 Write `agentsStatus(root)` in `src/agents.mjs` (needed or not, `current` / `out of date` / `missing` / `skipped` with reason, CRLF ignored when comparing, trait conflict caught); check it with the "The rules block" and "Block state" scenarios in `test/agents.test.mjs`
- [x] 2.2 Write `writeAgents(root, status)` (replace the pair, append with an empty line, create; line endings kept); check it with the "apply writes the block" scenarios, comparing bytes outside the markers
- [x] 2.3 Add the Claude Code warning to `agentsStatus` (`CLAUDE.md` or `CLAUDE.local.md` present, no `@AGENTS.md` line in `CLAUDE.md`, only when the block is needed); check it with the two warning scenarios

## 3. Commands

- [x] 3.1 In `src/commands/plan.mjs`, print the `AGENTS.md:` state line and the warning after `formatPlan`, and return `2` when the state is `missing`, `out of date` or `skipped`; check it with the "plan reports the block" scenario and the new `plan` "Exit code" scenario, and that the read-only test still passes
- [x] 3.2 In `src/commands/apply.mjs`, after the ADR actions call `agentsStatus` then `writeAgents`, print `rules block created|updated` or `skipped, <reason>` and the warning, handle the no-ADR-action path and `--dry-run` (`to create` / `to update`), and compute the exit code per the modified "Output and exit code"; check it with the `apply` scenarios through `main`, including "Skipped does not stop the ADR actions" and "Dry run with an import"
- [x] 3.3 Add a test that runs `apply` twice and checks `AGENTS.md` is byte-identical the second time and the second run exits like `plan`

## 4. Verification

- [x] 4.1 Run `ontrack apply` in the ontrack repository itself (governed by `trivoallan/governance`) and check that the `AGENTS.md` block equals `ontrack instructions` output and that `ontrack plan` then exits with `0`
- [x] 4.2 Run `npm test` on Node 24 with coverage at or above 95% on lines, branches and functions, and `openspec validate apply-agents-md --strict`
