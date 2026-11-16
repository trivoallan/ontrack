## 1. Home page

- [x] 1.1 In `docs/index.mdx`, move the section "It governs itself" to just after "A question, an answer, a rule the agent reads", and retitle it "It governs itself, and opens an issue where it falls short", keeping its paragraph word for word
- [x] 1.2 Add the paragraph on what the agent does once a review is ruled, with a link to `adr/engineering/ADR-0014-work-tracking.md`
- [x] 1.3 Add the example: the answer `fail_on: critical`, then the title and body of trivoallan/ontrack#193 in a plain code block, without the first line of the body
- [x] 1.4 Add the outcome (the link to the issue, closed the same day by a change to the ruleset, and why no linter would have found it) and the two closing points (label and title, `none`)

## 2. Verification

- [x] 2.1 Check the section against the `review` contract in `docs/commands.md`: it says nothing the contract does not
- [x] 2.2 Check that the word "ticket" is not in the section, and that nothing links to `#it-governs-itself`
- [x] 2.3 Run `npm run build` in `site/`: the build and the link check pass
