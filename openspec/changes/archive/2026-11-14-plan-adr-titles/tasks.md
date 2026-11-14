# Tasks

## 1. Contract first

- [x] 1.1 Update the README output contract: title after the name, revision in parentheses after the title, title source (frontmatter `title:`, else first `# ` heading without a repeated `<name>: `), and the example output with titles; update the "Example source" output to `  new           ADR-0001  Record significant decisions as ADRs`; check that every example in `specs/plan/spec.md` matches the README format

## 2. Title

- [x] 2.1 Export `readTitle(text, name)` from `src/revision.mjs` per the "Reading the title" requirement; check it with every scenario in `specs/adr-revision/spec.md`, in `test/revision.test.mjs`

## 3. Plan output

- [x] 3.1 In `src/plan.mjs`, add `title` to each ADR in the plan (source copy, local copy for `removed`) and print it per the modified "Output format" requirement; check it with the four new scenarios in `test/plan.test.mjs`
- [x] 3.2 Update the existing plan tests whose expected `revised` lines change, and keep the test that compares `formatPlan` with the README example; check that `npm test` passes

## 4. Verification

- [x] 4.1 Run `ontrack plan` in a fresh project with `trivoallan/governance` installed and check that the output matches the README "Example source" block exactly
- [x] 4.2 Run `npm test` on Node 24 and check coverage at or above 95% on lines, branches and functions, then `openspec validate plan-adr-titles --strict`
