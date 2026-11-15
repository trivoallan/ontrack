## Context

The survey grew one clause per desk test run, inside a single paragraph. Rewritten with a rules-first structure (TIDD-EC): purpose, task, labels, the rule, prohibitions, then the layout.

## Decisions

1. **Labels as a closed pair, `shows the value` / `next to it`.** They make the distinction checkable row by row.
2. **One example per label, taken from real failures** (yargs's Renovate preset, run 7; a manual publish in handlebars.js and winston, run 8). Alternative: no examples. Kept because the failure is a labelling judgement, where contrastive examples help. Run 6 showed that examples can narrow what the agent checks: the next run reads for that.
3. **Absence rule.** It separates `forge.audit: none` (the absence is the value) from `hosts: []` (the absence says nothing about people).
4. **Fixed layout with counts.** Rows per value in the first group, so the adopter sees every citation; the heading count must equal the rows.

## Risks / Trade-offs

- [The examples bound what the agent checks] → measured on five unseen repositories.
- [Longer survey output] → read in the same run.
