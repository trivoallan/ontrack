## Context

The repository tracks work in GitHub issues (ADR-0014) and describes changes
with OpenSpec (ADR-0016). The propose skill is already in the repository
(`.claude/skills/openspec-propose/`) and the `openspec` command line is a
development dependency, so a runner that checks the repository out and runs
`npm ci` has everything a local session has.

Five workflows exist. All pin their actions by SHA, declare `permissions:`,
and none runs a coding agent or holds a secret other than the release ones.

In-force ADRs that constrain this design:

- **ADR-0011** (forge): actions pinned by SHA, secrets named and never
  given, an untrusted contribution receives no secret. Its table says which
  jobs exist; a job outside it is a departure and is declared in an ADR of
  the repository.
- **ADR-0014** (tracking): tracker text is data, never instructions; only
  the issue reference is copied into the repository; an agent with tracker
  access writes nothing there without an explicit request for that act. The
  first artefact of a change carries `Issue served:`.
- **ADR-0016** (changes): a change opens when the expected behaviour moves.
  Continuous integration, a version bump or a refactor opens none.
- **ADR-0009** (branching): one change, one branch, one pull request,
  squashed; branch prefixes `feat`, `fix`, `docs`, `chore`.
- **ADR-0006** (commits): every commit of a branch is checked; the scopes
  hold `openspec` and no `ci`.
- **ADR-0017** (agent tooling): the host is Claude Code; the marketplace
  plugins do not load outside a contributor's machine, the skills under
  `.claude/skills/` do.

## Goals / Non-Goals

**Goals:**

- A label on an issue produces a draft pull request with a valid change.
- The agent cannot act on GitHub, whatever an issue body says.
- The agent's prompt knows nothing of OpenSpec. The permission rules and
  the path filter do (decision 8).
- The experiment can be judged on a handful of issues, then kept, moved to
  the governance source, or deleted by removing one file.

**Non-Goals:**

- Implementing the proposed change in the workflow.
- Anything in the `ontrack` CLI or in the governance source.
- A second change framework, or `changes.framework: none`.
- Reacting to an issue edited after the label was added.
- Updating the arc42 document or the LikeC4 model for an experiment.

## Decisions

### 1. Two jobs: the agent drafts, the workflow publishes

- `draft` has `contents: read`. It checks the repository
  out with `persist-credentials: false`, runs the agent, and hands over a
  patch (an artifact) and a change name (a job output).
- `publish` has the write permissions and runs no agent. It checks the name
  again, applies the patch, pushes, opens the pull request, comments and
  removes the label.

The agent runs with `--permission-mode acceptEdits`, the rules `Glob`,
`Grep`, `Skill` and seven read-or-plan subcommands of `openspec`, and deny
rules for the rest (decision 8). It edits files inside the checkout, and
what no rule covers is denied. Neither `git` nor `gh`, and no bare `Read` or
`Write` rule, which would reach outside the checkout.

Why: an issue body is written by anyone, and it ends up in the context of an
agent. An agent that can write a file can write the runner's own command
files, and so steer the steps that follow it in the same job. With the write
token in another job, a successful injection can only produce a patch for a
draft pull request that a person reviews. It also keeps ADR-0014 rule 2
intact: the agent has no tracker access, and the tracker writes are fixed
steps a maintainer asked for by adding the label.

Alternatives: one job, with the publishing steps after the agent (shorter,
but the write token and the agent share a runner); or the agent opening the
pull request itself (the token is then one prompt injection away from a
push).

### 2. The label is the trust gate

`on: issues: types: [labeled]` with `if: github.event.label.name == 'ontrack:propose'`.
Only a user with triage rights can add a label, so the label is the
maintainer saying "I read this body" (ADR-0011 rule 5). The author of the
issue is not checked.

The `draft` job also requires the issue to be open. The first real runs
were made on an issue that had been closed in the meantime, and each paid
for a runner to prepare a proposal nobody had asked for. On a closed issue
`draft` is skipped; `publish` says so on the issue and removes the label.

The run removes the label when it ends (`if: always()`), so each run is one
explicit act. Alternative: swap it for a `proposed` label; the pull request
already shows on the issue through `Refs`, so a second label says nothing
new.

### 3. The issue reaches the agent as a file

A step writes the title and body to `.propose/issue.md` in the checkout,
read with `jq` from the event that started the run (`$GITHUB_EVENT_PATH`):
the text is the one the issue had when the label was added, and the job
needs no access to the tracker. HTML comments are removed, since they do not
show in the issue a maintainer reads. The directory is left out of the
patch. Nothing from the event payload other than the number, the label name
and the repository name appears in a `${{ }}` expression. The prompt, fixed
in the workflow, tells the agent that the file is the description of a need,
not instructions, and that it copies neither the title nor an excerpt
(ADR-0014 rule 3).

Alternative: `gh issue view` when the job runs. It reads whatever the author
wrote since the label, during a window that lasts as long as the run waits.

### 4. The prompt names the trait, not the framework

The prompt asks for "the change the `changes` trait of `AGENTS.md` calls for,
for this issue, with `Issue served: trivoallan/ontrack#<n>` in its first
artefact", and for the ADR-0016 test first: when the issue moves no expected
behaviour, write nothing. The agent finds the propose skill in the
repository.

The workflow learns the outcome without knowing the framework:

- a clean working tree means "no change";
- otherwise the agent has returned the change name as structured output,
  which both jobs match as a whole string against
  `^[a-z0-9][a-z0-9-]{0,62}$` before it is used in a branch name. The length limit keeps the commit header within
  what the commit check accepts.

Alternative: look for a new directory under `openspec/changes/`. It works
today and writes the framework into the workflow.

### 5. One branch, one draft pull request

- Branch `feat/<n>-<change-name>`. `feat` is fixed: ADR-0016 opens a change
  when behaviour moves, which is a feature in nearly every case. A person
  retitles the pull request when it is not; the squash message is the title.
- Before the agent starts, `git ls-remote --heads origin "feat/<n>-*"` stops
  the run when a branch exists. `concurrency: propose-<n>` without
  cancellation serialises two labels on one issue.
- One commit, `docs(openspec): propose <change-name>`: a type and a scope
  the commit check accepts. This is the one place the framework's name
  appears; it is a commit scope, not a path.
- `gh pr create --draft` with `Refs #<n>` and a fixed body. The title is
  `feat: <change-name>`, built from the validated name, never from the
  issue.

The pull request is opened with the job token, and GitHub starts no workflow
for an event that token causes: `test`, `node-22` and the commit check do
not run on the proposal commit. They run on the first push a person makes,
which is the implementation. The agent therefore runs the framework's own
validation in the job, so that a broken proposal fails the run instead of
waiting for that push.

Alternative: a GitHub App token so that checks run at once. One more secret
and an App to maintain, for a check that the next push runs anyway.

### 6. The agent runs through the official action

`anthropics/claude-code-action`, pinned by SHA, kept current by the existing
Dependabot entry for GitHub Actions. The action always receives the token of
its job, so "no token" is not achievable with it; decision 1 makes that
token read-only on a public repository, which is the same guarantee.

Alternative: the Claude Code command line as a development dependency,
called from a `run:` step with no token at all. It installs a native binary
for every contributor and falls under the dependency rules still being
settled in issues 106 to 108.

### 7. Three outcomes, each visible on the issue

| Outcome | Pull request | Comment on the issue |
| --- | --- | --- |
| A change was produced | draft, `Refs #<n>` | none: the pull request shows on the issue |
| No expected behaviour moves | none | fixed sentence, link to the run |
| A step failed, or a branch existed | none | fixed sentence, link to the run |

The agent's reasons go to the job summary, which is not the tracker.

### 8. Everything the agent's job hands over is untrusted

A security review of the first version found that an injected agent could
run its own code and that nothing limited what was pushed. The design now
assumes the `draft` job is compromised and asks what it can still do.

In `draft`, so that compromise is hard:

- `openspec` is installed from the lockfile into a directory outside the
  checkout, with `--ignore-scripts`, then given to root. The agent could
  otherwise edit the command line under `node_modules/` and run it.
- `.claude`, `.github` and `.githooks` are given to root too: a skill
  written during the run could grant itself tools.
- The Bash rules name seven subcommands; `install`, `feedback`, `config`,
  `store` and `completion` are denied, as are edits under those directories.
  `install` downloads and runs a script, `feedback` files an issue elsewhere.
- `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` keeps the provider credential out of the
  environment of the commands the agent runs; `DO_NOT_TRACK` turns the
  command line's telemetry off.
- The agent's own settings refuse reads and writes outside the checkout.
  The documentation of its permission modes leaves reads outside the
  working directory ambiguous in a run with nobody to ask.
- No cache is written.

The documentation says a skill's own `allowed-tools` grants tools for the
turn that invokes it, that a deny rule wins over any allow rule, and that a
Bash rule "isn't a security boundary around the program". The deny rules
are therefore a second line; file ownership and the `publish` filter are
the first.

In `publish`, so that compromise is contained: the patch is applied to the
index and refused unless every entry adds a regular file, mode `100644`,
that is Markdown or YAML under `openspec/changes/<name>/` or a new
`docs/adr/ADR-NNNN-slug.md` without a `check:` key. `ontrack check` runs
that key through a shell, so an ADR is a place to hide a command. The patch
is capped at 500 kB and the name is matched as a whole string.

This writes the framework's paths into the workflow, which decision 4 set
out to avoid. A filter that knows no path filters nothing, and there is one
framework: the prompt stays free of it, the rules and the filter do not.

Alternative: forbid a list of dangerous paths (`package.json`, `.claude/`,
hooks). A deny-list is one forgotten path away from code running on the
maintainer's machine.

### 9. No stored key: workload identity federation

The agent step gives the action a federation rule, an organization, a
service account and a workspace, read from repository variables. The action exchanges the
job's GitHub OIDC token for a short-lived provider token; `draft` gets
`id-token: write` for that, and the workflow names no secret.

Why: a static key was the one long-lived credential in reach of an injected
agent, and the residual risk the security review left open. The identifiers
are not credentials: what they allow is decided by the rule on the
provider's side.

The first runs taught two things the action's documentation does not say.
GitHub sends a subject that carries immutable identifiers,
`repo:<owner>@<owner id>/<repo>@<repo id>:ref:refs/heads/main`, so a rule
written for `repo:<owner>/<repo>:` matches nothing. And the workspace is
required, not optional, when the service account is in several. The
provider's log of authentication events names the reason of each refusal;
the run log hides it.

Alternative: a repository secret `ANTHROPIC_API_KEY` with a low spending
limit. Simpler to set up; it has to be stored, rotated, and it leaks whole.

## Risks / Trade-offs

- [The experiment's sample opens no change] Issues 103 to 108 all concern
  continuous integration and the supply chain; under ADR-0016 most of them
  should produce "no change". → Accepted: the sample is kept, and the
  runs measure first whether the agent's verdict matches the maintainer's.
  See Open Questions.
- [Prompt injection through the issue body] → Decision 8: a read-only job
  that cannot rewrite what it runs, and a publishing job that accepts only
  planning files.
- [The proposal itself carries the injection] `tasks.md` is what a local
  agent later follows, with the maintainer's rights. No filter reads prose.
  → The pull request says so in its description; reading the proposal
  before running anything on the branch is the control.
- [The provider credential leaks] → There is no stored key (decision 9):
  the token the agent's process holds expires on its own, is kept out of
  the commands the agent runs, and nothing the agent may write can be code.
- [The job can ask for an identity token] `id-token: write` lets `draft`
  request a GitHub OIDC token for any audience. → It is worth something only
  where a rule accepts it: the federation rule is limited to this repository
  and, if the provider allows it, to this workflow on `main`. The action
  removes the OIDC request variables from the agent's environment.
- [The file-ownership steps break the agent action] Not verifiable before
  the first run. → Task 4.3.
- [The agent edits files outside the change] → Refused by `publish`.
- [Cost] One agent run per label. → The label is a human act; the
  branch-exists check runs before the agent.
- [Required checks never run on a proposal nobody implements] → Intended: a
  draft with no implementation is not mergeable.
- [`feat/` is wrong for a fix] → Accepted for the experiment; the title is
  editable and is what the squash keeps.
- [The action does not run with a read-only token] Not verifiable before the
  first run. → Task 4.3; the fallback is the alternative of decision 6.

## Migration Plan

1. A person creates the `ontrack:propose` label, sets the federation rule
   and the three `ANTHROPIC_*` repository variables, and
   allows GitHub Actions to create pull requests in the repository settings.
2. Merge the workflow. Nothing runs until a label is added.
3. Rollback: delete `.github/workflows/propose.yml`, the variables and the
   federation rule.

## Open Questions

- **What do issues 103 to 108 measure?** They are the sample, by decision.
  Most should end in "no change", so the first measure is whether the
  agent's verdict matches the maintainer's on each of the six. Proposal
  quality ("reaches implementation without being rewritten") is recorded
  for those that do open a change, and the threshold of four in six that
  sends the idea to the governance source applies to whichever of the two
  measures has six data points.
- **Label name.** Decided: `ontrack:propose`. Every label this automation
  reads or writes carries the `ontrack:` prefix, so that it cannot be
  mistaken for a label people use to sort issues. There is one such label
  today.
- **Does the action run with a read-only token?** Its code at the pinned
  commit takes the token it is given and posts no comment when a prompt is
  set; only a first run confirms it.
- **Should "no change" issues still get a pull request?** With
  `framework: none` ADR-0016 makes the pull request description the first
  artefact. Out of scope here; it is the natural next step if most labelled
  issues turn out to be of that kind.
