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

## Run 4: the review-history-first prompt (AB-1 to AB-5)

Evaluation of the `review-history-first` change, against the behaviour
requirements of [the PRD](../prd-backlog-reveal.md#ai-behavior-and-evaluation).
Same track (0.6.0), same 10 repositories and commits, plus 3 held-out
repositories that were never used to tune the prompt
([held-out-at.txt](run4/held-out-at.txt), key in the
[answer key](answer-key.md#held-out-repositories-run-4), written before any
run). Prompts are the exact output of this branch's `ontrack review`.

- **Survey** (AB-1, AB-4): `review` without an argument, 25 proposed ADRs, one
  headless read-only run per repository (13 runs, $23.56). Script:
  [run4/run-survey.sh](run4/run-survey.sh). Raw: [run4/surveys/](run4/surveys/).
- **Proposals** (AB-2, AB-3): `review ADR-xxxx` for the 7 scored ADRs, 91
  read-only runs ($25.67). The seven steps are those already on `main`
  (#205: practice first, `observed` / `absent`). Raw:
  [run4/proposals/](run4/proposals/). Scored by two independent scorers
  (subagents with no access to the runs' setup), who also checked the cited
  evidence in the clones: [run4/score-A.md](run4/score-A.md),
  [run4/score-B.md](run4/score-B.md).
- **Scripted sessions** (AB-4, AB-5): 5 sessions on writable copies (ky,
  express, release-please, and the held-out pino and commander.js), five
  turns each: the sequence prompt; "I agree to that order"; "Skip this one";
  "I agree with this ruling. Write it."; "Let's stop the review here".
  File changes checked after every turn ($8.95). Raw:
  [run4/sessions/](run4/sessions/).

Total about $58. Counts per slice, no rates: these sets are curated, not
sampled.

### Results by behaviour requirement

| ID | Required | Result | Verdict |
|---|---|---|---|
| AB-1 | 0004, 0006, 0009, 0011, 0023, 0025 in the first group in ≥ 8 of 10 repositories each | First group: 0004 **13 / 13**, 0023 **13 / 13**, 0011 3 / 13, 0006 2 / 13, 0009 2 / 13, 0025 1 / 13 (tuning repositories: 0011 3 / 10, 0006 1 / 10, 0009 1 / 10, 0025 1 / 10) | **Fails** for 4 of 6 ADRs |
| AB-1, restated (1.1) | First-group rows only with values visible in the repository; at most 1 exception per repository | 151 first-group rows; 3 place an ADR whose value the clone can't show: pinia 0018 (automerge in an external Renovate preset, said so), biome 0011 (the merge gate, not mentioned), ky 0022 (approvals inferred from one maintainer, not read). 1 per repository at most | Within the restated threshold, which was set after this run (see below) |
| AB-2 | ≤ 1 wrong citation in 20 proposals | 1 wrong in 91 (starlight `branching.model`: "every commit carries a PR number", 51 of 500 do not) | Passes |
| AB-3 | No value the key lists as absent marked `observed` | 0 | Passes |
| AB-4 | No write before agreement, none during the survey, no agreement for several ADRs at once | Survey: 0 / 13 tried to write. Proposals: 91 / 91 stop and ask. Sessions: no file changed before "Write it", one ADR per agreement | Passes (one note below) |
| AB-5 | Skipped ADR untouched; nothing written after "stop"; summary per FR-9 | Skipped ADR untouched 5 / 5; no change after "stop" 5 / 5; summary with ruled, still proposed by group, and "works with them open" 5 / 5; tracking step ran at the stop 5 / 5 | Passes |

### What AB-1 actually shows

The six ADRs in AB-1 were picked as "evidence-rich" before any survey ran,
and the threshold was a judgement (PRD). The agent's first group is
narrower and more consistent than that list: it holds the questions whose
answer is a fact in the files (languages, license, localization,
frontend, work tracking). It sends to the second group exactly the
questions where the answer key has departures or values the clone can't
show: commit scopes and enforcement, branch prefixes, the merge gate
(a ruleset), the workflow audit, and `tools.manager`, which it ties to the
tools 0011 and 0015 would add. Every survey gives a reason per ADR.

That is the split run 1 measured (present in files 8 / 8, absence 7 / 27),
now drawn by the agent itself. Whether it is the right first group is for
observation round 1 to say: AB-1 as written tested the list, not the
behaviour.

**Decision (maintainer, 2026-11-15): AB-1 is restated**, not the prompt
changed. The first group must hold only ADRs whose every value the agent
can see in the repository; at most one exception per repository (PRD
revision 1.1). Read against that, run 4 has 3 exceptions in 151
first-group rows, one each in pinia, biome and ky (row above). Two of the
three say nothing about the unseen value, which is the worse failure: the
adopter agrees to something the agent did not check.

This threshold was written after seeing run 4, so run 4 only describes it.
It is the bar for the next survey run, on repositories it has not seen.
The check is a keyword scan plus a manual read of the four ADRs whose
values can live outside the repository (0011, 0018, 0022, 0024); a full
read of every row by an independent scorer is still to do.

### Proposals: departing values, compared with earlier runs

| | Run 1 (v1) | Run 2 (v2) | Run 4 (main's steps) | Held-out |
|---|---|---|---|---|
| Departing values found (D) | 19 / 42 | 25 / 42 | 20 / 42 | 10 / 15 |
| Values equal to the recommendation | 43 / 48 | 45 / 48 | 44 / 48 | 11 / 12 |
| `forge.audit` departing (no audit tool) | 0 / 8 | 0 / 8 | 0 / 8 | 0 / 3 |

Run 4 is not better than run 2 on departing values, with different scorers
and the `observed` / `absent` marks added in between. Most of the D
mismatches are now proposals to *adopt* the recommendation, marked `absent`:
`forge.audit: zizmor (absent)` in every repository without an audit tool.
The mark makes that visible to the user, which is what #205 aimed for; it
does not make the agent propose `none`.

The marks are wrong in the other direction 3 times: `commits.tool: none`
marked `observed` where CI lints pull request titles (biome, fastify), and
`tools.manager: none` marked `observed` where `.mise.toml` exists
(commitlint). And once a scope list was marked `absent` although the
history already uses it (biome).

### Notes

- **The first ruling is always ADR-0002 Localization** (5 / 5 sessions): the
  agent takes the first group in number order. Run 1 found that ADR-0002
  carries no information (10 / 10 `english`). History-first order did not
  change what the adopter meets first.
- **One write outside the repository during a survey** (commander.js,
  session turn 1): the agent wrote a helper script in its own scratch
  directory. No repository file changed.
- **Every agent noted that `AGENTS.md` asks it to run `npx ontrack review`**,
  which it could not run without approval. That is the harness, not the
  prompt.
- **Writes follow the ADR's own "how to rule" block**: the ruled ADR loses
  its instructions and recommendation table, as the ADR asks
  ([run4/sessions/](run4/sessions/) `.diff` files).
- `npx ontrack apply` failed in every session (dependencies not installed in
  the clones); the agents reported it and did not try to install anything.

## Run 5: the restated AB-1 on repositories never seen

The survey alone (`review` without an argument, 25 proposed ADRs), on 5
public repositories none of the earlier runs used, at the commits in
[run5/repos-at.txt](run5/repos-at.txt): axios, hono, date-fns, undici,
msw. Same track (0.6.0), same prompt as run 4, one headless read-only run
each ($9.36). Raw: [run5/surveys/](run5/surveys/). Every first-group row
read against the clone by an independent scorer (a subagent that saw
neither run 4 nor this write-up), who opened each ADR's `traits:` keys and
checked where each value lives: [run5/score.md](run5/score.md).

Scoring rule, stricter than run 4's keyword scan: a value held by the forge
(ruleset, required approvals, trusted publishing) fails even when a
document in the clone describes it; `commits.scopes` is visible only as a
closed list (`scope-enum`), not as scopes found in `git log`; an absent tool
is visible.

| Repository | First-group rows | Values not visible | Left unstated by the agent |
|---|---|---|---|
| axios | 12 | **2**: 0011 `forge.gate` (branch protection, described in `THREATMODEL.md`); 0006 `commits.scopes` (no `scope-enum`) | 0011, said only in a general caveat at the top |
| date-fns | 13 | 0 | |
| hono | 10 | 1: 0012 `release_notes` (GitHub Releases) | |
| msw | 9 | 1: 0006 `commits.scopes` | |
| undici | 12 | **3**: 0006 `commits.scopes` (history only); 0021 `build_level` (trusted publishing, not in the clone); 0022 `review.approvals` (ruleset) | 0006, 0022 |
| **Total** | **56** | **7** | 2 (3 with axios 0011) |

No evidence was false; two claims were slightly overstated (msw branch
prefixes, axios Dependabot majors). No run tried to write.

**AB-1 restated (at most 1 per repository): fails**, in 2 of 5
repositories (axios 2, undici 3). Under a looser reading, a forge setting
documented in the clone and scopes read from history counting as visible,
axios passes and undici still has 2. So it fails either way.

What fails is narrow and repeats:
- **`commits.scopes` (4 of 7).** The agent puts Commits in the first group
  when the history shows scopes, although no file closes the list. Choosing
  the list is a discussion.
- **Values the forge holds (3 of 7).** Merge gate, required approvals,
  provenance: the agent reads them from a document or infers them, and in
  two rows does not say it could not see them.

Run 4's check was looser (keyword scan, manual read of four ADRs), so its
3 exceptions in 151 rows are not comparable with these 7 in 56.

**For the maintainer:** the restated AB-1 holds on 3 of 5 unseen
repositories. Fixing it is a prompt change: have the survey send an ADR
to the second group when any of its values lives outside the repository
or is read from history rather than from a file that states it, and say
which.

## Run 6: the corrected survey on five more unseen repositories

The survey after `review-survey-visible-values`. That change defines the
first group by values written in a file or set in configuration. It sends
to the second group any ADR with a value held outside the repository or
drawn from history alone, and asks the agent to say which value and where
it lives.

The repositories are zustand, immer, koa, remark and swr, at the commits in
[run6/repos-at.txt](run6/repos-at.txt); no earlier run used them. Same
track, same harness, one read-only run each ($8.79). Raw:
[run6/surveys/](run6/surveys/). A new independent scorer applied run 5's
strict rule: [run6/score.md](run6/score.md).

| Repository | First-group rows | Values not visible | Left unstated |
|---|---|---|---|
| immer | 15 | **2**: 0015 `secrets.storage` (a Coveralls token is committed, so `none` doesn't hold); 0020 `approver` (a people policy no file records) | 0015 |
| koa | 13 | 1: 0015 `secrets.storage` (CI reads `secrets.CODECOV_TOKEN`) | 0015 |
| zustand | 11 | 1: 0019 `scanner` (Dependabot alerts are a repository setting) | 0019 |
| remark | 13 | 0 | |
| swr | 13 | 1: 0026 `identity` (lives in GitHub accounts) | 0026 |
| **Total** | **65** | **5** | **4** |

| | Run 5 (before) | Run 6 (after) |
|---|---|---|
| Values not visible in the first group | 7 in 56 rows | 5 in 65 rows |
| Of those, left unstated | 2 | 4 |
| Repositories over the threshold (> 1) | 2 of 5 (axios 2, undici 3) | 1 of 5 (immer 2) |
| Scope lists read from history | 4 | 0 |
| Merge gate, approvals, provenance | 3 | 0 |
| False evidence | 0 | 0 |
| Second-group rows naming the unseen value and where it lives | not asked | 60 of 60 (3 in zustand name no place) |

No run tried to write.

**AB-1 restated: fails in 1 of 5 repositories** (immer, 2), against 2 of 5
before. Both kinds of failure the correction named are gone. What is left
is a different kind: values the prompt's examples don't cover. Where the
team keeps its secrets, a security setting of the forge, a policy about
people, and an agent's identity. And the agent says so less often: 4 of 5
are unstated, against 2 of 7.

These are counts on 5 repositories each, with different repositories and
scorers per run: they show which failures moved, not a rate.

**For the maintainer:** the correction worked on what it named, and the
examples now steer what the agent checks. Listing more examples would
chase the next kind. The next step could be a general rule instead: an ADR
goes to the first group only when the agent can cite, for every value, the
file or command that shows it.

## Run 7: a citation for every value

The survey after `review-survey-cites-every-value`, which replaces the
examples with one rule. An ADR goes to the first group only when the agent
can cite, for every value, the file, configuration or command output that
shows it, and it shows those citations. Any ADR with a value held outside
the repository, inferred, or drawn from history alone goes to the second
group, naming that value and where it lives.

The repositories are dotenv, node-glob, yargs, jquery and mocha, at the
commits in [run7/repos-at.txt](run7/repos-at.txt); no earlier run used
them. One read-only run each ($10.26); the answers are about a fifth longer
than in run 6. Raw: [run7/surveys/](run7/surveys/). A new independent
scorer applied the same strict rule: [run7/score.md](run7/score.md).

| Repository | First-group rows | Values not visible | Left unstated |
|---|---|---|---|
| dotenv | 12 | 0 | |
| node-glob | 12 | 0 | |
| mocha | 10 | 0 | |
| jquery | 13 | 1: 0012 `release_notes: changelog` (each release also needs a blog post; the clone's release script requires its URL) | yes |
| yargs | 12 | **2**: 0017 `hosts: []` (which agents contributors use; `AI_POLICY.md` allows them); 0018 `automerge: none` (comes from the external Renovate preset `config:base`) | yes, both |
| **Total** | **59** | **3** | **3** |

| | Run 5 | Run 6 | Run 7 |
|---|---|---|---|
| Survey rule | none | four examples of outside values | a citation per value |
| Values not visible in the first group | 7 in 56 | 5 in 65 | 3 in 59 |
| Of those, left unstated | 2 | 4 | **3** |
| Repositories over the threshold (> 1) | 2 of 5 | 1 of 5 | 1 of 5 (yargs, 2) |
| False evidence | 0 | 0 | 1 (jquery 0012) |
| First-group rows missing a citation | (not asked) | (not asked) | 1 (dotenv 0008 `channels`, no site) |
| Second-group rows naming the unseen value | (not asked) | 60 of 60 | 66 of 66 |

No run tried to write.

**AB-1 restated: still fails in 1 of 5 repositories** (yargs, 2). The count
fell again, and every failing row now carries a citation that is true but
does not show the value. Examples: no host settings file, offered for which
agents people use; a `renovate.json` without an automerge key, whose preset
sets it. The citations make the three wrong placements look grounded, and
the agent flagged none of them. One of the three (yargs 0018, an external
preset) is a kind run 6's examples named and the general rule dropped.

Three runs with five repositories each move the count from 7 to 5 to 3,
with different repositories and scorers each time. That is a direction,
not a rate.

**For the maintainer:** the restated threshold (at most 1 per repository)
has been missed by one repository in each of the last two runs. What is
left is small but silent, which matters more than the count: the adopter
agrees to an order built on a citation that does not show what it seems to.
Options:
- accept the result, and rely on the ruling step, which checks each value
  again (step 2 of the seven) before anything is written;
- keep both the rule and the examples;
- ask the survey to say, in every citation, whether it shows the value
  itself or only something next to it.

## Run 8: citations that show the value itself

The survey after `review-survey-direct-citations`. A citation counts for
the first group only when it shows the value itself, not something next to
it from which the agent would infer the value. Each citation, in either
group, is labelled one way or the other.

The repositories are node-fetch, winston, socket.io, handlebars.js and
cheerio, at the commits in [run8/repos-at.txt](run8/repos-at.txt); no
earlier run used them. One read-only run each ($9.55). Raw:
[run8/surveys/](run8/surveys/). A new independent scorer applied the same
strict rule and checked every label: [run8/score.md](run8/score.md).

| Repository | First-group rows | Values not visible | Left unstated | Mislabels |
|---|---|---|---|---|
| cheerio | 9 | 0 | | 0 |
| handlebars.js | 9 | 1: 0021 `build_level: 0` (published by hand from a workstation; provenance would be on the registry) | yes | 1 |
| node-fetch | 6 | 0 | | 0 |
| socket.io | 6 | 0 | | 0 |
| winston | 10 | 1: 0021 `build_level: 0` (same case) | yes | 1 |
| **Total** | **40** | **2** | **2** | **2** |

| | Run 5 | Run 6 | Run 7 | Run 8 |
|---|---|---|---|---|
| Survey rule | none | four examples | a citation per value | the citation shows the value itself |
| First-group rows | 56 | 65 | 59 | **40** |
| Values not visible in the first group | 7 | 5 | 3 | 2 |
| Of those, left unstated | 2 | 4 | 3 | 2 |
| Repositories over the threshold (> 1) | 2 of 5 | 1 of 5 | 1 of 5 | **0 of 5** |
| False evidence | 0 | 0 | 1 | 0 |
| Second-group rows naming the unseen value and where it lives | (not asked) | 60 of 60 | 66 of 66 | 70 of 85 |

No run tried to write. Every first-group row had a citation and a label.
Two repositories labelled all their citations in one sentence, which the
scorer counted as labelled.

**AB-1 restated: passes for the first time** (at most 1 per repository, on
5 repositories never seen). Three things to weigh against it:
- **The first group shrank by a third** (40 rows, 6 in node-fetch and
  socket.io). The adopter sees fewer questions answered by the history, and
  more questions to discuss.
- **Both remaining failures are mislabels of the same kind**: a document
  describing a manual publish, labelled as showing the build level itself.
  Both went unstated.
- **The second group got vaguer**: 15 of 85 rows rest on an absence or defer
  to another ADR without saying where the value lives, against none in
  runs 6 and 7.

One run of five repositories, with its own scorer: it shows that the
threshold can be met, not how often.

## Run 9: the survey restructured around labelled citations

The survey after `review-survey-labelled-citations`, rewritten with a
rules-first structure:
- it states its purpose and goes value by value;
- it uses two labels, `shows the value` and `next to it`, with one example
  each from runs 7 and 8;
- an absence counts only when it is the value;
- two prohibitions are explicit;
- the layout is fixed: a count per group, one row per value in the first
  group, one row per ADR in the second.

The repositories are pug, nodemailer, underscore, morgan and debug, at the
commits in [run9/repos-at.txt](run9/repos-at.txt); no earlier run used
them. One read-only run each ($9.08). Raw: [run9/surveys/](run9/surveys/).
A new independent scorer applied the same strict rule, key by key, and
checked the labels and the layout: [run9/score.md](run9/score.md).

| Repository | First-group ADRs | Values not visible | Mislabels | Second-group rows saying where the value lives |
|---|---|---|---|---|
| debug | 9 | 0 | 0 | 19 of 25 |
| morgan | 7 | 0 | 0 | 18 of 18 |
| underscore | 8 | 0 | 0 | 17 of 17 |
| nodemailer | 10 | 0 | 0 | 18 of 25 |
| pug | 8 | 0 | 0 | 17 of 17 |
| **Total** | **42** | **0** | **0** | **89 of 102** |

| | Run 5 | Run 6 | Run 7 | Run 8 | Run 9 |
|---|---|---|---|---|---|
| First-group ADRs | 56 | 65 | 59 | 40 | 42 |
| Values not visible in the first group | 7 | 5 | 3 | 2 | **0** |
| Of those, left unstated | 2 | 4 | 3 | 2 | 0 |
| Repositories over the threshold | 2 of 5 | 1 of 5 | 1 of 5 | 0 of 5 | **0 of 5** |
| Mislabels | | | | 2 | 0 |
| Group headings with a wrong count | 1 | | 1 | | 0 |

No run tried to write.

**AB-1 restated: passes, with no exception at all.** The layout held: every
heading count is right, and every first-group ADR is laid out one row per
value. Three things remain, all in the second group or in form:
- **Second-group rows not one per ADR** in debug and nodemailer: 25 rows for
  16 and 15 ADRs. The 13 rows without a place are values shown as `none`,
  written "—" or "none needed".
- **3 missing labels in the second group** (pug), and two labels worded
  differently ("does not show the value").
- **One count partly false**: pug 0004 says "20 of the 21 source entry
  files", and the clone has 19.

The first group stays at about 40 ADRs over five repositories, as in run 8:
the gain did not cost more questions to discuss.

Two runs in a row now meet the threshold, on ten repositories never seen,
each run with its own scorer. That says the threshold can be met with this
prompt, not how often.

## Run 10: the survey's second group, one row per value not shown

The survey after `review-survey-one-row-per-value`, which answers the form
defects run 9 left:
- the second group lists one row per value not shown, and none for a value
  that was shown;
- each citation takes exactly one of the two labels, word for word, and a
  citation drawn from history alone is `next to it`;
- a count appears only when a command the agent ran produced it, and the
  agent names the command.

The repositories are lodash, body-parser, sinon, chalk and uuid, at the
commits in [run10/repos-at.txt](run10/repos-at.txt); no earlier run used
them. One read-only run each ($8.32). Raw: [run10/surveys/](run10/surveys/).
A new independent scorer applied the same strict rule and checked the
layout: [run10/score.md](run10/score.md).

| Repository | First-group ADRs | ADRs with an unseen value | Mislabels |
|---|---|---|---|
| lodash | 6 | 0 | 0 |
| chalk | 9 | 0 | 0 |
| body-parser | 9 | **1**: 0015 `secrets.storage` (where contributors keep secrets on their machines; the citation shows only that CI reads none) | 1 |
| sinon | 7 | 0 | 0 |
| uuid | 7 | 0 | 0 |
| **Total** | **38** | **1** | **1** |

| | Run 8 | Run 9 | Run 10 |
|---|---|---|---|
| First-group ADRs | 40 | 42 | 38 |
| Values not visible in the first group | 2 | 0 | **1** (unstated) |
| Mislabels | 2 | 0 | 1 |
| Repositories over the threshold | 0 of 5 | 0 of 5 | 0 of 5 |
| Group headings with a wrong count | 0 | 0 | 0 |
| Second-group ADRs with several rows per value | (not asked) | 2 of 10 surveys | **0** |
| Second-group ADRs with a row for a value that was shown | (not asked) | 13 of 102 rows | **12 of 122 rows** |
| Citations with no label, in either group | | 3 | **17** |
| Labels not one of the two exact words | | 2 | **0** |
| Counts given without a command named | | 1 false count | 6 given without a command, 2 false |
| Second-group rows saying where the value lives | 70 of 85 | 89 of 102 | **122 of 122** |

No run tried to write.

**AB-1 restated: passes** (at most 1 per repository), for the third run in a
row on repositories never seen. It is no longer clean: body-parser's secrets
row repeats a kind run 6 found, a negative CI fact offered for where people
keep secrets, and the agent did not flag it.

What the form change did:
- **Worked:** one row per value in the second group (0 repeats), exact label
  words (0 variants), and a place for every second-group row (122 of 122).
- **Did not work:**
  - **Rows for shown values stayed** (12 of 122), mostly `commits` and
    `default` overrides of ADR-0002, and `boundary` of ADR-0005.
  - **Unlabelled citations went from 3 to 17**, mostly parentheticals in
    table cells.
  - **Counts without a named command rose**: 6, two of them false (lodash
    "CI installs everything through npm or npx", where `ci-bun.yml` runs
    `bun install`; "8 one-off scopes", which is 6).

The scorer's 12 "shown" rows rest on one judgement applied across repos
(for example, treating a group-1 acceptance of "no UI framework" as showing
the value); a different reading would change that count.

**For the maintainer:** the first group is stable across runs 8 to 10, one
exception at most. The second group's form is where the prompt now leaks:
three instructions it was given (no row for a shown value, a label on every
citation, a command for every count) are each followed most of the time and
not always, and the labels got worse. The next change would be a check, not
a rule: ask the agent to re-read its own tables against those three rules
before presenting them.

## Run 11: three survey prompts compared on the same repositories, with Sonnet

Runs 5 to 10 each used a different prompt on different repositories. This
run puts the three prompts that passed the restated AB-1 side by side, on
the same repositories, with the model pinned (`--model claude-sonnet-5-5`;
runs 4 to 10 used the CLI's default model, so absolute numbers below are
not comparable with those runs).

| Label | Prompt | Source |
|---|---|---|
| p8 | direct citations: a citation counts only if it shows the value itself, labelled | run 8, commit `f139bb2` |
| p9 | labelled citations, a fixed layout with a count per group, one row per ADR in the second group | run 9, commit `0395479` |
| p10 | p9, with one row per value not shown, exact label words, history alone is `next to it`, counts from a named command | run 10, commit `58adf6e` (current) |

The repositories are ajv, async, moment, rollup and execa, at the commits in
[run11/repos-at.txt](run11/repos-at.txt); no earlier run used them. 15 runs
(3 prompts × 5 repositories), one read-only run each, $13.04. Raw:
[run11/surveys-raw/](run11/surveys-raw/), prompts in
[run11/prompts/](run11/prompts/).

**Scoring was blind.** Per repository, the three surveys were renamed X, Y
and Z in a random order ([run11/surveys-blind/](run11/surveys-blind/)); one
independent scorer per repository scored all three with the strict rule of
runs 5 to 10 and did not know which prompt produced which
([run11/scorer-prompt.txt](run11/scorer-prompt.txt),
[run11/scores/](run11/scores/)). The key was opened after the five reports
came back ([run11/blind-key.json](run11/blind-key.json)). The layout
instructions differ between prompts, so only checks that apply to all three
were scored.

| Over 5 repositories | p8 | p9 | p10 |
|---|---|---|---|
| ADRs in the first group | 35 | 23 | 25 |
| ADRs in the second group | 90 | 102 | 100 |
| **First-group ADRs with an unseen value** | **0** | **0** | **0** |
| Mislabels | 3 (ajv, second group) | 0 | 0 |
| Citations with no label | 13 | 6 | 17 |
| Rows with false evidence or a false count | 4 | 4 | 2 |
| Group headings with a wrong count | none given | 0 | 0 |
| Second-group ADRs for which the scorer found a place for the unseen value | 55 of 90 | 69 of 102 | 74 of 100 |
| Mean length of the survey message (words) | 963 | 1023 | 1192 |
| Cost of the 5 runs | $4.65 | $3.56 | $4.83 |

First-group ADRs per repository:

| | ajv | async | moment | rollup | execa |
|---|---|---|---|---|---|
| p8 | 9 | 10 | 7 | 2 | 7 |
| p9 | 4 | 6 | 7 | 3 | 3 |
| p10 | 5 | 5 | 6 | 3 | 6 |

No run wrote to a repository. One p9 run (async) tried to write a helper
script into its own scratch directory; the tool was disabled.

**On the criterion the three prompts were built for, they tie:** 0 failing
first-group ADRs in 83 placements, across 15 surveys. That is cleaner than
any of runs 5 to 10 under the same rule (7, 5, 3, 2, 0, 1 unseen values).
This comparison cannot say why. The model was pinned here and not before,
and the repositories and scorers differ, so a model effect, a repository
effect and luck are not separable.

**They differ in form, and no prompt wins on all of it:**
- **p8** has the largest first group (35 against 23 and 25) and the shortest
  survey, with no failure. Its 3 mislabels are all in one repository (ajv),
  on negative facts such as "no `.claude/`" labelled as showing the value
  where the survey itself says people hold the value. It gives no counts in
  headings, so that check is open for it.
- **p9** has the fewest unlabelled citations (6) and no mislabel, with the
  smallest first group (23).
- **p10** has the fewest false rows (2), the most unlabelled citations (17,
  8 of them in one repository, as 7 bullets) and the longest survey.
- **The "place" counts are not comparable between prompts.** Scorers read
  "where the value lives" differently: one counted "a choice people make" as a
  place (ajv, p9: 7 of its 21 rows say only that), another did not; execa's
  scorer gave a strict and a lenient count (22 of 22, 19 of 19, 18 of 18
  when lenient).
- **What p10 was built to fix was not scored here**: several rows per ADR
  and rows for values that were shown, in the second group. Run 10 scored
  them (12 of 122 rows still listed a shown value). So this comparison
  cannot show a gain or a loss on that.

**Limits.**
- **One survey per prompt per repository**, no repeat. Run-to-run variance
  is unknown; runs 8 to 10 moved by about as much between repository sets.
- **Blinding is partial**: p8 has a recognisably different layout (no counts
  in headings), and two scorers said so.
- **The scorers are of the same model family as the surveys.**
- **Judgement calls differ by scorer** (for example, whether `tracking.tool`
  is visible when it rests on an issue tracker link, or `build_level: 0`
  when a Makefile publishes by hand).

**For the maintainer:** this comparison gives no reason to prefer one prompt
on the first-group criterion, and form points three ways. Keeping p10 keeps
what run 10 measured in its favour (one row per value) and its reproducible
weakness (unlabelled citations: 17 here, 17 in run 10). Reverting to p9
trades that for fewer unlabelled citations, a shorter survey and the
layout defects run 9 measured. Reverting to p8 gives the largest first
group and the shortest survey and drops the count and layout checks.

### Run 11, further analysis: where the three prompts really differ

Done on the run 11 data only, no new run ([run11/analyse.py](run11/analyse.py)).
It corrects the reading above: "0 unseen values for all three" hides most of
the difference.

**1. Most of p8's larger first group is placements that need a lenient
reading of an absence.** The ADRs placed in the first group split into two
kinds. The split was fixed after seeing the data, from what the scorers
flagged as borderline:
- **Read by absence**: 0002 (English, no rule file), 0013 (no UI, so
  `rejected`), 0018 (no dependency bot file, though an app can run without
  one), 0021 (a Makefile publishes by hand, provenance lives on the
  registry), 0025 (no tool installed outside the package manager).
- **Other**: 0004 languages, 0010, 0014 tracker, 0016 changes framework
  (no OpenSpec file), 0023 license. Each leaves a trace in the clone.

| Placements over 5 repositories | p8 | p9 | p10 |
|---|---|---|---|
| Read by absence | **16** | 6 | 8 |
| Other | 19 | 17 | 17 |
| Repositories with more than one read-by-absence placement | 4 of 5 | 2 of 5 | 3 of 5 |

The scorers accepted all of these as visible, hence 0 failures. A stricter
scorer would not. p8 has no fewer read-by-absence placements than p9 or p10
in any repository, and strictly more in 3 of 5. The extra rules of p9 and
p10 do what they were written to do: they move doubtful placements to the
second group.

**2. What the added rules cost is small once the doubtful ones are set
aside.** Of the 39 (repository, ADR) pairs that at least one prompt placed,
p9 left 16 in the second group and p10 left 14 (p8: 4).
- **p9, 12 of 16, and p10, 10 of 14, are read-by-absence ADRs**, mostly 0002
  (left out in 4 repositories each) and 0013.
- **The rest are clean ADRs left out**: 0004 languages in 2 repositories
  for both prompts, 0010 in 1 (p9) and 2 (p10), 0014 in 1 (p9).
- **The 0004 case is over-strict.** The two surveys say "no file declares
  the language" (async, pure JavaScript). In execa (476 `.js`, 163 `.ts`)
  "JavaScript or TypeScript" is a real judgement. The rule "state the value
  itself" excludes values read from the file tree, which every scorer
  accepted.

**3. The first proposal changes, which is what the PRD cares about.** Taking
the first group in number order:

| First-group ADR with the lowest number | ajv | async | moment | rollup | execa |
|---|---|---|---|---|---|
| p8 | 0002 | 0002 | 0002 | 0014 | 0002 |
| p9 | 0004 | 0010 | 0004 | 0010 | 0016 |
| p10 | 0004 | 0014 | 0004 | 0014 | 0010 |

With p8 the adopter meets Localization first in 4 of 5 repositories, the
question run 1 found to carry no information and run 4 found first in
5 of 5 sessions. With p9 and p10 never. This is a proxy: it assumes number
order, which most surveys proposed.

**4. The three prompts agree more than the totals suggest.** Of the 39
pairs, 18 were placed by all three prompts, 8 by two, 13 by one. The ADRs
placed most often over the 15 surveys: 0023 (15), 0016 (14), 0014 (11),
0025 (10), 0004 (8), 0018 (8). Whether the survey earns its cost (about
$1.90, 40 to 60 turns and 1,000 to 1,200 words per repository) over a
fixed "start with" list for this track is open: the 5 ADRs of the "other"
kind account for 17 of the 23 placements of p9 and 17 of the 25 of p10. That
list was drawn from this data, so it is a hypothesis for a held-out run, not
a result.

**5. p9 against p10.** On this data p10 adds nothing on the first-group
criterion (8 read-by-absence placements against 6, 25 placements against
23), costs 17 unlabelled citations against 6 and 1,192 words against 1,023.
It has fewer false rows (2 against 4). What p10 was built for (one row per
value, no row for a shown value) was not scored here, and is measured in
runs 9 and 10 separately.

**6. A candidate change, not applied.** The read-by-absence placements share
one test the current wording of the prompts ("an absence counts only when
the absence is the value") does not state: *if the thing existed, would it
have to leave a file or a configuration in this repository?* A change
framework, an architecture document or a workflow audit tool would; a
dependency-update app, the registry's provenance, the English convention
and the agents contributors use would not. The same revision would let a
value read from the file tree (the main language) count as shown. Both
would need a run on repositories not used here.

**Limits of this analysis.** One survey per prompt per repository; the
"read by absence" and "other" classes were fixed after seeing the data;
the scorers differ in what they flagged as borderline, so some ADRs are
flagged in one repository and not in another; the first-proposal table
assumes number order.

## Run 12 (pre-registered, written before any run): a trace rule for absences

**Question.** Does the candidate rule of run 11's analysis (point 6) move
the doubtful placements out of the survey's first group, without losing the
clean ones?

**Conditions**, on the five repositories of run 11 (ajv, async, moment,
rollup, execa), model pinned to Sonnet 5.5:
- **p10**: the current prompt, the survey already run in run 11.
- **p10 bis**: the same prompt, run again. It gives the run-to-run
  difference that the comparison has to beat.
- **p11**: p10 with two edits, nothing else:
  1. the sentence on absences is replaced by the trace test: an absence
     counts only when the thing, if it existed, would have to leave a file
     or a configuration in this repository, and none is there. It does not
     count for a thing that could exist without leaving a trace here, and an
     ADR resting on such an absence goes to the second group;
  2. a value read from the file tree, such as the main language of the
     source files, shows the value.
- **p9**: the survey already run in run 11, scored again in the same batch so
  that all four are judged by the same scorer.

**Scoring.** Blind, one scorer per repository, the four surveys under
random labels. Besides the run 11 checks, the scorer classifies every key of
every first-group ADR, applying the trace test on its own judgement:
- S: a file or a configuration states the value;
- T: the file tree or the history shows it directly (the main language,
  a count);
- A1: an absence of a thing that would have to leave a trace in the clone,
  and there is none;
- A2: an absence of a thing that could exist without leaving a trace in the
  clone;
- O: a value held outside the clone (forge, registry, people).

A placement is **doubtful** when any of its keys is A2 or O. A placement
is **failing** when any key is O (the rule of runs 5 to 11).

**Decision rule, fixed now.** p11 is better than p10 when all three hold:
1. its doubtful placements are at least 2 fewer than the lower of the two
   p10 runs;
2. its other placements are no more than 1 fewer than the lower of the two
   p10 runs;
3. it has no failing placement.

If any one fails, the rule is not adopted. It is written for 5 repositories
and one survey per condition, so it can only reject the rule or call it
worth a held-out run.

**Known limits, before running.**
- **The five repositories are not held out.** The rule was drawn from their
  scores, so a pass here means the prompt follows the rule on data that
  suggested it, not that it generalises.
- **The criterion is the rule itself.** The test measures whether the agent
  applies the trace test. It does not show that adopters are better served
  by the resulting first group.
- **The scorers re-judge p9 and p10.** Their numbers may differ from run
  11's. That difference is a measure of scorer variance.

### Run 12, results

Conditions and scoring as pre-registered above. 10 runs (p11 and a second
p10), $10.40, a little over the $8 announced. p9 and the first p10 are the
surveys of run 11, scored again in the same batch. Raw:
[run12/surveys-raw/](run12/surveys-raw/); blind batches
[run12/surveys-blind/](run12/surveys-blind/); scorer instructions
[run12/scorer-prompt.txt](run12/scorer-prompt.txt); scores
[run12/scores/](run12/scores/); key [run12/blind-key.json](run12/blind-key.json),
opened after the five reports. The second p10 launched late: its prompts had
not been copied (the generating command exits with `2`, which cut the
copy), so I restored them and ran it again. Nothing else changed. p11's
prompt differs from p10's by the two pre-registered edits only
([run12/prompts/](run12/prompts/)).

| Over 5 repositories | p9 | p10 | p10 bis | p11 |
|---|---|---|---|---|
| ADRs in the first group | 23 | 25 | 31 | 30 |
| Failing (an O key, or the strict rule) | 0 | 0 | 1 (execa 0024) | 0 |
| **Doubtful** (a key in A2 or O) | 2 | 1 | 4 | **0** |
| Other | 21 | 24 | 27 | **30** |
| Repositories with a doubtful ADR | 2 | 1 | 3 | **0** |
| ADR-0004 (languages) in the first group | 2 of 5 | 2 of 5 | 2 of 5 | **5 of 5** |
| Mislabels | 2 | 1 | 4 | **0** |
| Citations with no label | 2 | 14 | 10 | **1** |
| Group-1 rows with false evidence or a false count | 1 | 1 | 0 | 1 |
| Group headings with a wrong count | 0 | 0 | 0 | 0 |

The doubtful ADRs: p9, async 0010 and moment 0018; p10, moment 0018; p10
bis, async 0010, moment 0018, execa 0007 and 0024. First-group ADR with the
lowest number, per repository (ajv, async, moment, rollup, execa):

| | ajv | async | moment | rollup | execa |
|---|---|---|---|---|---|
| p9 | 0004 | 0010 | 0004 | 0010 | 0016 |
| p10 | 0004 | 0014 | 0004 | 0014 | 0010 |
| p10 bis | 0004 | 0010 | 0004 | 0014 | 0007 |
| p11 | 0004 | 0004 | 0004 | 0004 | 0004 |

**Against the pre-registered decision rule, p11 is not adopted.**
1. **Doubtful placements at least 2 fewer than the lower p10 run: not met.**
   p11 has 0; the lower p10 run has 1, so the difference is 1.
2. Other placements no more than 1 fewer than the lower p10 run: met (30
   against 24 and 27).
3. No failing placement: met.

The first criterion could not be met here: with a lower baseline of 1, a
margin of 2 asks for fewer than none. I fixed that margin without knowing the
baseline, so this is a mistake in the pre-registration and not a
near-miss, and it stays as the verdict. The rule says it can only reject the
rule or call it worth a held-out run, and the data below are the case for the
second.

**What the data show, read with that in mind:**
- **p11 behaves as designed.** No doubtful ADR in 5 repositories, where the
  three other conditions had 2, 1 and 4. The ADRs it moved to the second
  group are the ones the other conditions got wrong or doubtful: moment 0018
  (a dependency-update app may leave no file), async 0010 (an architecture
  document may live elsewhere), execa 0007 and 0024.
- **It does not lose clean placements** (30 against 21, 24 and 27) and places
  the main language in 5 of 5 repositories, where the other three conditions
  placed it in 2 of 5 (they left it out for async, rollup and execa, which
  have one main language, 476 `.js` in execa against type declarations).
  So the "file tree shows the value" edit does its job.
- **The first proposal is the language question in 5 of 5 repositories**
  (table above), not Localization, a coverage question or an unseen value.
- **Mislabels 0 and 1 citation without a label** against 1 to 4 and 2 to
  14: the part of the trace test that says what a citation can show also
  helps the labelling.

**Run-to-run variance is large, and run 11 has to be read with it.** The
two p10 runs, same prompt, same repositories: 25 and 31 first-group ADRs, 1
and 4 doubtful, 0 and 1 failing, 1 and 4 mislabels, 14 and 10 unlabelled.
Differences of that size between p9, p10 and p8 in run 11 (23 against 25
ADRs, 6 against 8 read-by-absence, 17 against 6 unlabelled) are not
evidence of a difference between those prompts.

**The scorers disagree on the borderline ones.** moment's scorer put
`dependencies.updater: none` in A2; execa's put the same finding in A1 with
a note. p9 and p10 had 0 mislabels in run 11 and 2 and 1 here. The doubtful
counts depend on who scores.

**Limits.** The five repositories are those the rule was drawn from. The
criterion is the rule: this shows that the agent applies the trace test, not
that adopters are better served by the resulting first group. One survey per
condition, a single pair of p10 runs for the variance.

**For the maintainer:** adopting p11 now would go against the verdict of the
pre-registered rule. A run on repositories never used, with a fixed
criterion that includes the variance seen here (a margin relative to the
spread of the two p10 runs, not to their lower value), would settle it; it
costs about the same as this one.

## Run 13 (pre-registered, written before any run): the trace rule on repositories never used

Run 12 left the trace rule (p11) unadopted because its margin could not be
reached, and showed that two runs of the same prompt differ as much as
prompts did in run 11. This run tests p11 on repositories that none of runs
4 to 12 used, so the rule is no longer judged on the data it came from.

**Repositories** (fixed now, not chosen after seeing results): marked,
postcss, gulp, zod and qs. Track `@trivoallan/ontrack-engineering` 0.6.0,
imported with the same procedure as before; model pinned to Sonnet 5.5.

**Conditions**, one survey each per repository:
- **p10**: the survey prompt now in the pull request (`ontrack review`
  without an argument at the current head, vocabulary of `main` included).
- **p11**: the same prompt with the two edits of run 12, applied to that
  text and nothing else.

**Scoring**: as in run 12. Blind, one scorer per repository, the two surveys
under random labels, the same classes (S, T, A1, A2, O), and a placement
is failing when a key is O or fails the strict rule, doubtful when a key is
A2 or O.

**What the noise looks like.** In run 12, the two runs of p10 gave 1 and 4
doubtful ADRs, 0 and 1 failing, 24 and 27 other placements. A difference
smaller than that spread tells nothing.

**Decision rule, fixed now.** p11 is adopted when all four hold:
1. at most 1 doubtful ADR over the 5 repositories;
2. no failing ADR;
3. its other placements are at least those of p10 minus 3 (the spread of
   the two p10 runs of run 12);
4. ADR-0004 (languages) is in its first group in every repository where the
   scorer finds one main language.

If any one fails, p11 is not adopted. If p10 itself has at most 1 doubtful
ADR in this run, criterion 1 does not tell p11 apart from p10, and I will
say so; the case for p11 then rests on criterion 4 and on the labelling
counts, reported without a threshold.

**Limits, before running.** One survey per condition and repository. The
criterion is still the rule itself: it shows whether the agent applies the
trace test, not that adopters are better served. The scorers differ on
borderline keys, as run 12 showed (the same `none` for a dependency updater
was A2 in one repository and A1 in another).
