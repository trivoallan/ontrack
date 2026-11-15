---
artifact: experiment-results
created: 2026-11-15
hypothesis: research/hypothesis-first-proposal.md (H1)
status: final
---

# Desk test results: can the agent find the practice? (H1)

## Verdict

**H1 is invalidated by its own pre-registered criteria.** On the 42 values
where a repository's practice departs from the track's recommendation, the
agent's proposal matched **19 (45%)**. The criteria said "invalidated if
H1 < 50%". Following the hypothesis, the H2 observation sessions are not
run.

The headline hides a clean split. It is the most useful finding of the
test:

- **When the practice is something present in the files, the agent finds
  it.** A language or a licence that departs from the recommendation was
  matched **8 of 8** times (JavaScript, Rust, Apache-2.0, Artistic-2.0, `MIT
  OR Apache-2.0`).
- **When the practice is an absence, the agent keeps the recommendation.** No
  workflow audit tool, no tool manager, no branch-prefix convention: **7 of
  27** matched. In 11 of those mismatches the agent wrote, in substance, "I
  found nothing that argues against the recommendation" and kept it.

That is the anchoring the hypothesis worried about, measured. The review
prompt's step 2 says: "Start from the recommendation… Look in this
repository for evidence that it does not apply here." Absence of a tool is
not evidence that the recommendation "does not apply", so the agent
proposes the track's answer. The agent follows the prompt correctly. The
proposal it makes is the track's answer, not the team's practice.

## Setup

- Track `@trivoallan/ontrack-engineering` 0.6.0. ADRs 0002, 0004, 0006, 0009,
  0011, 0023, 0025.
- 10 public repositories, at the commits in [repos-at.txt](repos-at.txt).
- One headless Claude Code run per repository and ADR (70 runs), with the
  exact prompt `ontrack review ADR-xxxx` prints, read-only tools, no MCP
  servers, no `gh`. Script: [run-one.sh](run-one.sh). Cost $15.84, about 45
  agent-minutes.
- [Answer key](answer-key.md) written before any run. Raw proposals:
  [proposals/](proposals/).
- Scoring by two independent scorers (subagents with no access to the
  runs' setup or this verdict), 5 repositories each, against the key and
  fixed rules.

## Primary metric: departing values (D), by key

| Key | Kind of departure | Matched | Notes |
|---|---|---|---|
| `languages.main.name` | present (JavaScript, Rust) | **5 / 5** | |
| `license.spdx` | present (Apache-2.0, Artistic-2.0, dual) | **3 / 3** | |
| `branching.model` | observed pattern (ky pushes to main) | 1 / 1 | matched via the key's Alt (github-flow); the agent named trunk-based as an option |
| `commits.tool` | the ADR's conditional recommendation | 3 / 6 | the 3 hits are where versions are set by hand, so the condition fails. The misses: release-please and h3 generate versions from commits with no enforcement, and the agent proposed `commitlint` (the condition holds, the practice is `none`). eslint: options offered without a choice |
| `branching.prefixes` | absence or loose convention | 4 / 10 | the agent can't see merged-PR branch names without `gh`; 1 explicit "kept the recommendation" (ky) |
| `tools.manager` | absence (no tool outside npm) | 3 / 9 | 5 of 6 misses count tools that *other proposed ADRs* would add (zizmor, gitleaks) and propose `mise` for a future that hasn't been decided |
| `forge.audit` | absence (no audit tool), or actionlint | **0 / 8** | 7 kept `zizmor` "for lack of evidence against it". eslint runs actionlint in CI, the agent saw it, and still proposed zizmor |
| **Total** | | **19 / 42 (45%)** | |

Grouped: present in files **8 / 8**; conditional or observed **4 / 7**;
absence **7 / 27**.

## Secondary metrics

| Metric | Result |
|---|---|
| Match rate on all 90 scored values | 62 / 90 (69%) |
| Match rate on values that equal the recommendation (non-D) | 43 / 48 (90%). Misses: biome and fastify `commits.tool` (CI checks PR titles; the agent said `none`), starlight `commits.scopes` (built from `labeler.yml`), plus 2 unscorable (below) |
| ADR-0002 Localization (the first ADR in catalogue order) | 10 / 10 `english`. Every repository matches the recommendation, so the first proposal under today's order **carries no information** about whether the agent finds the practice |
| `forge.gate` (not scored) | 10 / 10 proposed `blocking`. 10 / 10 said they could not read the ruleset from the repository |

## Guardrails

| Guardrail | Result |
|---|---|
| Wrong evidence (≤ 1 in 20 proposals) | **0 / 70.** One scorer flagged npm/cli's "no `.github/dependabot.yml`" as implausible; checked: the file is absent in the clone, so the claim is correct |
| Proposals that say which values were kept for lack of evidence | Not measurable as a field: today's prompt doesn't ask for it. In prose, 11 values were explicitly "kept, no evidence against", and every one of them is a mismatch |

## What this changes

1. **H2 as designed would test the wrong thing.** Starting adopters with
   ADR-0006 (commits) would show the agent at its best on a presence-type
   question, and say nothing about the questions where it echoes the track.
   And ADR-0002, today's first proposal, can't fail anywhere: it shows
   nothing either way.
2. **The anchoring is in the prompt, not the agent.** The next hypothesis
   to test is a change to step 2 of the review prompt, e.g. "Start from what
   this repository does today. Where it does nothing, say so, then compare
   with the recommendation." That is a code change in `src/review.ts` and
   the documented prompt in `docs/commands.md`, and it can be tested with the
   same harness and answer key.
3. **"Kept for lack of evidence" is the dominant failure, and it is
   invisible in the ruling.** It confirms the third decision in "Who sets the
   order, and who can appeal" (hypothesis doc): a proposal must say which
   values it kept for lack of evidence. Here those 11 values would all have
   reached `AGENTS.md` as "the repository's decision".
4. **Prospective answers leak across ADRs.** `tools.manager: mise` was
   proposed for tools that other, still-proposed ADRs recommend. A ruling
   should describe the repository as decided so far, not as the track would
   like it.

## Limits

- **One key writer, same model family** as the agent under test. The second
  reader on 3 repositories, asked for in the hypothesis, is still missing.
- **The agent had no `gh`.** An adopter's agent usually does, so
  `branching.prefixes` (merged-PR branch names) and `forge.gate` (rulesets)
  would likely do better in real use. This handicap does not explain
  `forge.audit` or `tools.manager`, which are fully visible in the clone.
- **2 values unscorable** (npm/cli and h3 `commits.scopes`): headless mode
  keeps only the agent's last message, and those two put the scope list in an
  earlier one.
- **Selection.** Well-known, well-run public repositories. Absence-type
  practice is probably *more* common in private repositories, so the absence
  result is unlikely to improve there.
- **Track 0.6.0 imports ADR-0001 as proposed**, so `apply` reports 25
  questions to rule, not the 24 in the tutorial.

## Run 2: step 2 reworded (v2)

Same repositories, commits, ADRs, harness and answer key. The only change is
step 2 of the review prompt, applied to the 70 saved prompts (the source is
unchanged):

| | Step 2 |
|---|---|
| v1 (shipped) | Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line. |
| v2 (tested) | Start from what this repository does today on this question: its files, configuration, CI and history. Where it does nothing, say so: an absence is evidence too. Describe the repository as it is, not as the other `proposed` ADRs would make it. Then compare with the recommendation the ADR makes, and name every difference. |

Example full prompt: [prompt-v2-example.txt](prompt-v2-example.txt). Raw
proposals: [proposals-v2/](proposals-v2/). This time the harness kept every
agent message, so no value was unscorable. Cost $19.90, about 64
agent-minutes. Scored by two new scorers who saw neither the v1 results nor
this write-up.

### Verdict

**Better, but still inconclusive: 25 of 42 departing values (60%).** The
criteria in the hypothesis put 50–70% as inconclusive, so the H2 sessions
still don't run. (24 / 42 if starlight's prefixes are scored strictly, see
below.)

| Kind of departure | v1 | v2 |
|---|---|---|
| Present in files (language, licence) | 8 / 8 | 8 / 8 |
| Conditional or observed (`commits.tool`, ky's model) | 4 / 7 | 5 / 7 |
| Absence (`prefixes`, `tools.manager`, `forge.audit`) | 7 / 27 | 12 / 27 |
| **Departing values, total** | **19 / 42 (45%)** | **25 / 42 (60%)** |
| Values equal to the recommendation | 43 / 48 (2 unscorable) | 45 / 48 |
| All scored values | 62 / 90 | 70 / 90 |
| Values kept "for lack of evidence" | 11 | 1 |
| Wrong evidence | 0 / 70 | 2 / 70 (≤ 1 in 20 guardrail holds) |

### By key

| Key (departing values) | v1 | v2 | What changed |
|---|---|---|---|
| `languages.main.name` | 5 / 5 | 5 / 5 | — |
| `license.spdx` | 3 / 3 | 3 / 3 | — |
| `commits.tool` | 3 / 6 | 4 / 6 | eslint now chooses `none`. release-please and h3 still get `commitlint`: the agent sees that nothing enforces the format and still applies the ADR's condition (versions come from commits) |
| `branching.prefixes` | 4 / 10 | 6 / 10 | fastify and starlight now match. ky: the one value still "kept, no convention" |
| `tools.manager` | 3 / 9 | 6 / 9 | the cross-ADR leak mostly stopped (fastify, release-please, npm, h3 fixed). **ky regressed** to `mise` "ruling ahead" on ADR-0011/0015 despite the new sentence. biome and eslint still mismatch, on how to count tools they *do* have |
| `forge.audit` | **0 / 8** | **0 / 8** | the failure changed nature: in v1 the agent kept zizmor "for lack of evidence". In v2 it states that nothing audits the workflows, then **proposes adopting zizmor** anyway |

### What this means

1. **The rewording fixed what it targeted.** "Kept for lack of evidence"
   went from 11 to 1. The cross-ADR leak on `tools.manager` mostly stopped.
   Values that already matched didn't regress, except ky `tools.manager`.
2. **What's left is not about seeing; it's about what a ruling is.** On
   `forge.audit` and `commits.tool`, the v2 agent describes the repository
   correctly (no audit tool, no enforcement) and then proposes the
   recommendation as the decision to take. The answer key measures "what the
   repository does"; the agent answers "what the repository should decide".
   For a security tool, the agent's reading is defensible. The review prompt
   doesn't say which of the two a proposed value is, and nothing in the
   proposal marks it.
3. **So the next fix is a field, not a wording.** Each proposed value needs
   to carry where it comes from: **observed** (the repository does it
   today) or **absent** (the repository doesn't, and the ruling would change
   that). This is the third decision in the hypothesis doc ("which values
   were kept for lack of evidence"), refined by this run. With it, the
   adopter can tell their practice from the track's proposal, and both
   readings of `forge.audit` become legitimate.
4. **Ship v2's step 2 regardless.** It is strictly better on 4 of 7 keys and
   equal on the rest, at a 25% higher run cost (more exploration).

### v2 wrong evidence

- eslint ADR-0009 says the pull request title "is checked in CI". No eslint
  workflow checks titles (checked in the clone), and the same agent's
  ADR-0006 run says so.
- npm/cli ADR-0006 says merges are squashed with a `(#N)` suffix, while its
  ADR-0009 run counts about 270 of 462 commits this year pushed without one.
  An overgeneralisation.
- Not counted: npm/cli's "no `.github/dependabot.yml`" was flagged again by a
  scorer and is again correct (absent from the clone).

### v2 scored values, where they differ from v1

| Repository | Key | v1 | v2 |
|---|---|---|---|
| eslint | commits.tool (D) | no-evidence | none, match |
| fastify | prefixes (D) | mismatch (no `perf`) | `[feat, fix, docs, perf, …]`, match |
| fastify | tools (D) | mise, mismatch | none, match |
| release-please | prefixes (D) | 8 types, mismatch | `[feat, fix, docs]`, mismatch (kept the recommendation, citing `feat/` and `fix/` branches) |
| release-please | tools (D) | mise, mismatch | none, match |
| npm/cli | scopes | unscorable | workspace names, match |
| npm/cli | tools (D) | mise, mismatch | none, match |
| ky | tools (D) | none, match | **mise, mismatch** |
| h3 | scopes | unscorable | 29 scopes, match |
| h3 | tools (D) | mise, mismatch | none, match |
| starlight | prefixes (D) | `[feat, fix, docs, chore]`, mismatch | `[feat, fix, docs, chore, ci]`, match on a lenient reading (holds `fix`, extras are valid types). Strict: mismatch |

Every other value scored the same in both runs.

## Appendix: scored values (v1)

Combined from the two scorers' tables (`forge.gate` and localization rows
omitted, see above). `kept` = the agent kept the recommendation for lack of
evidence.

| Repository | Key | Expected | Proposed | Score | D | kept |
|---|---|---|---|---|---|---|
| biome | languages | Rust | Rust | match | D | |
| biome | scopes | lint, deps, format/*, parse/*… | lint, format, parse, analyze, deps, cli, lsp… | match | | |
| biome | commits.tool | commitlint (CI PR-title check) | none | mismatch | | |
| biome | model | github-flow | github-flow | match | | |
| biome | merge | squash | squash | match | | |
| biome | prefixes | fix, docs, feat, chore, perf | feat, fix, chore, refactor, perf, ci, docs, test | match | D | |
| biome | audit | zizmor | zizmor | match | | |
| biome | license | MIT OR Apache-2.0 | MIT OR Apache-2.0 | match | D | |
| biome | tools | script | mise | mismatch | D | |
| commitlint | languages | TypeScript | TypeScript | match | | |
| commitlint | scopes | package names | 38 package names + container | match | | |
| commitlint | commits.tool | commitlint | commitlint | match | | |
| commitlint | model | github-flow | github-flow | match | | |
| commitlint | merge | squash | squash | match | | |
| commitlint | prefixes | feat, fix, ci, docs, test | feat, fix, perf, refactor, docs, test, ci, build, chore | match | D | |
| commitlint | audit | none | zizmor | mismatch | D | yes |
| commitlint | license | MIT | MIT | match | | |
| commitlint | tools | mise | mise | match | | |
| eslint | languages | JavaScript | JavaScript | match | D | |
| eslint | scopes | [] | [] | match | | |
| eslint | commits.tool | none | commitlint / none (no choice) | no-evidence | D | |
| eslint | model | github-flow | github-flow | match | | |
| eslint | merge | squash | squash | match | | |
| eslint | prefixes | chore, docs, fix, feat | feat, fix, docs, chore, ci, test, refactor, perf | match | D | |
| eslint | audit | actionlint | zizmor | mismatch | D | |
| eslint | license | MIT | MIT | match | | |
| eslint | tools | none | script | mismatch | D | |
| express | languages | JavaScript | JavaScript | match | D | |
| express | scopes | [deps] | deps, deps-dev | match | | |
| express | commits.tool | none | none | match | D | |
| express | model | github-flow | github-flow | match | | |
| express | merge | squash | squash | match | | |
| express | prefixes | [] | feat, fix, docs, test | mismatch | D | |
| express | audit | none | zizmor | mismatch | D | yes |
| express | license | MIT | MIT | match | | |
| express | tools | none | none | match | D | |
| fastify | languages | JavaScript | JavaScript | match | D | |
| fastify | scopes | types, validation, ecosystem, route, server… | types, validation, route, reply, request, server, ecosystem | match | | |
| fastify | commits.tool | commitlint (CI PR-title check) | none | mismatch | | |
| fastify | model | github-flow | github-flow | match | | |
| fastify | merge | squash | squash | match | | |
| fastify | prefixes | docs, feat, fix, perf | feat, fix, docs, refactor, test, ci | mismatch | D | |
| fastify | audit | none | zizmor | mismatch | D | yes |
| fastify | license | MIT | MIT | match | | |
| fastify | tools | none | mise | mismatch | D | |
| release-please | languages | TypeScript | TypeScript | match | | |
| release-please | scopes | deps, main + strategies | main, deps, deps-dev, cli… + strategies | match | | |
| release-please | commits.tool | none | commitlint | mismatch | D | |
| release-please | model | github-flow | github-flow | match | | |
| release-please | merge | squash | squash | match | | |
| release-please | prefixes | fix, chore | feat, fix, docs, chore, build, ci, test, refactor | mismatch | D | |
| release-please | audit | none | zizmor | mismatch | D | yes |
| release-please | license | Apache-2.0 | Apache-2.0 | match | D | |
| release-please | tools | none | mise | mismatch | D | yes |
| npm/cli | languages | JavaScript | JavaScript | match | D | |
| npm/cli | scopes | workspace names | (in an earlier message, not kept) | unscorable | | |
| npm/cli | commits.tool | commitlint | commitlint | match | | |
| npm/cli | model | github-flow | github-flow | match | | |
| npm/cli | merge | squash | squash | match | | |
| npm/cli | prefixes | fix, chore, deps, feat | feat, fix, docs, chore | match | D | |
| npm/cli | audit | none | zizmor | mismatch | D | yes |
| npm/cli | license | Artistic-2.0 | Artistic-2.0 | match | D | |
| npm/cli | tools | none | mise | mismatch | D | yes |
| ky | languages | TypeScript | TypeScript | match | | |
| ky | scopes | [] | [] | match | | |
| ky | commits.tool | none | none | match | D | |
| ky | model | trunk-based (Alt github-flow) | github-flow | match | D | |
| ky | merge | squash | squash | match | | |
| ky | prefixes | [] | feat, fix, docs | mismatch | D | yes |
| ky | audit | none | zizmor | mismatch | D | yes |
| ky | license | MIT | MIT | match | | |
| ky | tools | none | none | match | D | |
| h3 | languages | TypeScript | TypeScript | match | | |
| h3 | scopes | response, rules, session… | (in an earlier message, not kept) | unscorable | | |
| h3 | commits.tool | none | commitlint | mismatch | D | |
| h3 | model | github-flow | github-flow | match | | |
| h3 | merge | squash | squash | match | | |
| h3 | prefixes | fix, perf, build | feat, fix, docs, chore, build | mismatch | D | |
| h3 | audit | none | zizmor | mismatch | D | yes |
| h3 | license | MIT | MIT | match | | |
| h3 | tools | none | mise | mismatch | D | yes |
| starlight | languages | TypeScript | TypeScript | match | | |
| starlight | scopes | [] | core, tailwind, docsearch, markdoc, file-icons, docs, i18n, deps | mismatch | | |
| starlight | commits.tool | none | none | match | D | |
| starlight | model | github-flow | github-flow | match | | |
| starlight | merge | squash | squash | match | | |
| starlight | prefixes | fix | feat, fix, docs, chore | mismatch | D | |
| starlight | audit | zizmor | zizmor | match | | |
| starlight | license | MIT | MIT | match | | |
| starlight | tools | none | none | match | D | |
