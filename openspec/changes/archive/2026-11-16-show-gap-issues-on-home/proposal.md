Issue served: none

## Why

Once a review is ruled, the agent lists the rulings the repository does not
follow yet and proposes one issue for each. That step is what turns an
answer into work, and the site shows it nowhere a reader would look: it
exists only inside the prompt of `ontrack review` and in one line of its
contract, both in `docs/commands.md`. The home page tells the story as
question, answer, rule, revision, and stops short of it. A reader comparing
ontrack to a rules sync tool cannot see the difference.

This repository has three such issues (trivoallan/ontrack#192, #193 and
#194), each closed by a real change. That is enough for one true example,
and not enough for a claim about volume.

## What Changes

- On the home page (`docs/index.mdx`), the section "It governs itself"
  becomes "It governs itself, and opens an issue where it falls short".
  Its current paragraph stays word for word.
- The section then says what happens once a review is ruled: the agent
  lists the rulings the code, configuration or tooling does not match,
  proposes one issue for each, and creates only the ones the user agrees
  to, in the tracker the repository named when it answered the question on
  work tracking (ADR-0014).
- It shows trivoallan/ontrack#193 as the example: its title and its body,
  without the first line of the body, which cites the ADR under the
  namespace the track had before it was renamed.
- It says how the issue ended (closed the same day, by a change to the
  ruleset) and why no linter would have found it.
- Two points close the section: the label `ontrack` and the title that
  starts with the ruling keep the next review from proposing an issue
  twice; a repository that answered `none` on work tracking gets a list and
  no issue.
- The section moves up, right after "A question, an answer, a rule the
  agent reads" and before "When a question changes, every repository is
  told". The home page keeps the same number of sections.

Not in this change:

- The page of ADR-0014 in the ontrack-engineering track does not say that
  its answer tells the agent where to open these issues. Saying it there is
  a revision of the track's question, made in the track's repository.
- A page listing every capability with the page that specifies it, under
  "Reference". Considered, and left for later.
- Any change to what `ontrack review` prints.

## Capabilities

### New Capabilities
<!-- none: documentation only, `skip_specs: true` -->

### Modified Capabilities
<!-- none: the behaviour is already specified in `review`, and the home
     page's content is not under a requirement of `docs-site` -->

## Impact

- `docs/index.mdx` only. No code, dependency or CI change.
- The heading's anchor changes from `#it-governs-itself`. No page of the
  site, nor the README, links to it.
- The home page links to an issue on GitHub: an external link, which the
  link check does not follow.
