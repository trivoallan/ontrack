## Context

`propose.yml` (376 lines) and `apply.yml` (134 lines) run only on ontrack's
own issues and pull requests. Most of their lines are security posture:
the agent and the write token never meet (ADR-0011 rule 5), the command line
is owned by root, the agent runs in a sandbox, and `publish` filters the
patch. Other repositories of the same maintainer want the same path:
`governance`, the pilot repositories (all on GitHub Actions) and several
open source projects. Some of them use OpenSpec, others plain ADRs, Spec Kit
or a home-grown framework.

ADRs in force that this design keeps: ADR-0011 (actions pinned by SHA, no
agent with a write token, `pull_request_target` checks out nothing),
ADR-0014 (the tracker text is data), ADR-0016 (the `changes` trait),
ADR-0020 (a new dependency is approved by a person), ADR-0002 (a label asks
for a change) and ADR-0003 (an approved pull request's label starts its
apply).

## Goals / Non-Goals

**Goals:**
- Other repositories call `propose` and `apply` by commit SHA, and the
  security posture is maintained in one place.
- ontrack keeps using both workflows on itself, unchanged for its maintainer.
- No caller can widen what the agent may write.

**Non-Goals:**
- Spec Kit and the home-grown framework. Each one joins the catalog later
  through its own pull request, when a calling repository needs it.
- A dedicated repository, an action, a GitHub App or a hosted service.
- Rolling the workflows out to the pilot repositories before the pilot
  review of 2026-12-18, unless a pilot team asks for it.

## Decisions

### 1. Host the workflows in ontrack, add `workflow_call`

Each file keeps its trigger (`issues: labeled`, `pull_request_target:
labeled`) and gains `workflow_call`. A run in ontrack and a call from
another repository go through the same jobs.

Alternatives: a dedicated repository (`issue-to-change`) gives the workflows
their own versions, but adds a dependency that every caller has to follow
and splits the history. Hosting them in `governance` keeps rules and their
implementation together, but the real dependency is ontrack: the workflows
read the `AGENTS.md` that ontrack writes and refuse the `check:` commands
that `ontrack check` runs. Every caller already uses ontrack. Moving the
workflows out is one pull request per caller, the day a caller wants them
without ontrack.

The cost: callers bump the workflows with each ontrack release, CLI-only
releases included. These are patch bumps that the Dependabot automerge
handles (ADR-0018). A breaking change to the catalog or the inputs is a
major version of ontrack.

### 2. The catalog is written in the workflow file

In a called workflow, `actions/checkout` checks out the caller's
repository, not ontrack: a separate catalog file would not be on disk. The
catalog is a fixed table inside `propose.yml`, one step that turns the
enabled entry names into the agent's tool rules, the command lines to
install and the `publish` filter. A name outside the table fails the step.

| Entry | Agent may write | Installed | `publish` accepts |
|---|---|---|---|
| `openspec` | `openspec/changes/**` | the OpenSpec command line, the version pinned in the catalog | new `.md` and `.yaml` files under `openspec/changes/<name>/` |
| `adr` | `<adr directory>/**` | nothing | new `ADR-NNNN-slug.md` files in the ADR directory, without `check:` |

The input is `frameworks`, a comma-separated list of entry names, with
`openspec,adr` as the default. `governance` passes `openspec`.

Alternative: let the caller pass paths or a pattern. Rejected because the
filter is the only barrier between an issue written by anyone and the
branch. A filter supplied by each caller is a filter nobody reviews.

### 3. The command line is installed from the catalog, not from the caller's lockfile

Today the job copies `package.json` and `package-lock.json` from the
checkout to install OpenSpec. A caller may not list OpenSpec, or may pin
another version. The catalog entry names an exact version, installed with
`--ignore-scripts` outside the checkout and given to root as today. Node
comes from the caller's `.nvmrc` when it exists, and from a fixed version in
the workflow otherwise. Bumping the pinned version is a pull request to
ontrack.

### 4. The run checks the `changes` trait before any cost

A step before the agent extracts the YAML blocks of the caller's
`AGENTS.md` and reads `changes.framework` with `yq`, which the runner image
provides. When the trait names a framework that the caller did not enable,
the run fails with the fixed failure comment. No trait means no check: the
agent's own reading of `AGENTS.md` decides, as today.

### 5. The ADR directory comes from an ADR-0001 trait

The governance source gains a trait under ADR-0001,
`record-architecture-decisions.directory`. That trait is proposed in
`trivoallan/governance` and not written here. The run reads it from the
caller's `AGENTS.md`, with `docs/adr` as the default. The value is checked
before the agent starts: a relative path, no `..`, not under `.github`,
`.claude`, `.githooks` or `node_modules`. It feeds both the agent's
`Edit(...)` rule and the `publish` filter.

Today ontrack itself writes every consumer's ADRs to `docs/adr` (`apply.ts`,
`plan.ts`). The trait therefore reads `docs/adr` in every repository until
ontrack lets a repository move its ADRs. That is a separate change.

### 6. Labels and apply credentials are inputs

- `label` (default `ontrack:propose`) and `label` on `apply` (default
  `ontrack:apply`). They reach the scripts through `env`. The job conditions
  compare `github.event.label.name` with the input.
- `apply` takes `routine_id` as an input and `fire_token` as a declared
  secret. On ontrack's own trigger, they fall back to
  `vars.ONTRACK_APPLY_ROUTINE_ID` and `secrets.ONTRACK_APPLY_FIRE_TOKEN`, so
  nothing is renamed here.
- The federation identifiers stay `vars` of each caller.

### 7. The caller grants the union of the permissions

A called workflow can only lower the permissions its caller grants. The
calling job must grant what both jobs need (`contents: write`,
`pull-requests: write`, `issues: write`, `id-token: write`), and the jobs of
`propose.yml` narrow them as today. The caller file shows an agent and
write rights side by side, while the separation that makes it safe lives in
ontrack. The example caller in the documentation says so in a comment.

## Risks / Trade-offs

- [The federation rule rejects a call from another repository] → Checked
  on 2026-11-15 from a private sandbox repository: the exchange passes. In a
  called workflow, `sub` names the caller
  (`repo:<owner>@<owner id>/<repo>@<repo id>:ref:refs/heads/main`) and
  `job_workflow_ref` names ontrack's file at the SHA the caller pinned. Each
  caller needs its own rule, which matches its exact `sub` in pattern mode,
  as ontrack's rule does.
- [The rule does not check which workflow uses the token] → It cannot do so
  usefully today. Extra claim conditions are exact matches only, and an
  exact `job_workflow_ref` breaks at every SHA bump. A CEL condition can use
  `startsWith`, but the Console refuses a compound CEL condition on the
  GitHub issuer unless a subject prefix is set beside it, and the CEL mode
  shows no such field. Accepted: only the caller's maintainers decide what
  its `main` calls. Revisit if the Console exposes a subject prefix with
  CEL.
- [The Anthropic routine API changes its beta header] → Every caller's
  `apply` breaks at once, and is fixed in one place. A test runs the
  answer parsing against a recorded answer.
- [A caller pins an old SHA and misses a security fix] → Dependabot proposes
  the bump. The documentation tells callers to keep it on.
- [The trait reader misreads an `AGENTS.md`] → The reader only fails a run.
  It never widens what the agent may write: the catalog does that.
- [This work comes before the pilot review] → Done as the verdict of #152.
  The roadmap is updated to say so.

## Migration Plan

1. Run the OIDC check from a sandbox repository calling a branch of ontrack.
2. Change both workflows and their tests in one pull request. ontrack's own
   runs keep working, because every new input defaults to today's value.
3. After the merge, call `propose` from `governance` with `openspec`, then
   from one open source project. Each one gets its own federation rule,
   variables and labels.
4. Rollback: a caller removes its calling file. In ontrack, revert the pull
   request.

## Open Questions

- Where does Node come from when a caller has no `.nvmrc`: a fixed version,
  or an input?
