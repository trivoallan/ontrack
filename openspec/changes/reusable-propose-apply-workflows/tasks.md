## 1. Check the federation first

- [x] 1.1 From a sandbox repository, call `propose.yml` on a branch of ontrack that only adds `workflow_call`, and record what the OIDC `sub` and `job_workflow_ref` claims say and whether the token exchange succeeds
- [x] 1.2 Record in the Claude Console whether a federation rule can match `job_workflow_ref` as well as `sub`, and write the rule a caller needs in the documentation draft
- [x] 1.3 Stop the change here and revise the design if no rule lets a call from another repository through

## 2. Make `propose.yml` callable

- [x] 2.1 Add `workflow_call` with the inputs `label` (default `ontrack:propose`) and `frameworks` (default `openspec,adr`), keeping `issues: labeled`; condition both jobs on the label taken from the input or its default
- [x] 2.2 Write the catalog step: turn `frameworks` into the agent's `allowedTools` and `disallowedTools`, the command lines to install and the `publish` pattern; fail on a name outside the catalog with the fixed failure comment
- [x] 2.3 Install OpenSpec at the version pinned in the catalog, with `--ignore-scripts`, outside the checkout and owned by root, instead of copying the checkout's `package.json` and `package-lock.json`; install nothing when the `openspec` entry is not enabled
- [x] 2.4 Take Node from the caller's `.nvmrc` when it exists, and from a fixed version otherwise
- [x] 2.5 Read `changes.framework` from the YAML blocks of the caller's `AGENTS.md` with `yq`, and fail before the agent when it names an entry that is not enabled
- [x] 2.6 Keep ADRs in `docs/adr`, a fixed path: no trait and no input (a directory trait was proposed in trivoallan/governance#89 and abandoned)
- [x] 2.7 Feed the enabled entries to the agent's rules, to the prompt's list of what it may write, and to the `publish` filter
- [x] 2.8 Pass the label to every script through `env`, and remove that label in the final step

## 3. Make `apply.yml` callable

- [x] 3.1 Add `workflow_call` with the inputs `label` (default `ontrack:apply`) and `routine_id`, and the secret `fire_token`, keeping `pull_request_target: labeled`
- [x] 3.2 Fall back to `vars.ONTRACK_APPLY_ROUTINE_ID` and `secrets.ONTRACK_APPLY_FIRE_TOKEN` on ontrack's own trigger
- [x] 3.3 Post the fixed "could not be started" comment when the token or the routine is missing

## 4. Test

- [x] 4.1 In `test/propose-workflow.test.ts`: an unknown entry fails; `openspec` only refuses an ADR; `adr` only refuses a change file; a trait that names an entry that is not enabled fails; a renamed label is removed at the end
- [x] 4.2 In `test/apply-workflow.test.ts`: a renamed label starts the gate; a missing token gives the fixed comment; the answer parsing still finds the session address in a recorded answer
- [x] 4.3 Run `npm test` and `npx ontrack check`

## 5. Document

- [x] 5.1 Add a documentation page with an example caller for each workflow: trigger, the union of the permissions with a comment on why, `uses:` pinned by SHA with its tag, inputs, the federation variables, and a reminder to keep Dependabot on
- [x] 5.2 List the prerequisites per caller: labels, federation rule, variables, routine and its secret, `.github/apply-session.md`
- [x] 5.3 Head both workflow files with a comment naming ADR-0004

## 6. Roll out

- [x] 6.2 After the merge, label one issue of ontrack and one pull request, and confirm both runs behave as before (issue 145: nothing left to propose, the migration exists; pull request 144: refused, not approved)
- [x] 6.3 Call `propose` from `governance` with `frameworks: openspec`, label one issue, and confirm a draft pull request with a valid change and no ADR (trivoallan/governance#92 calls it; issue 75 gave trivoallan/governance#93, a valid `add-tools-adr` change, OpenSpec files only)
- [ ] 6.4 Call both workflows from one open source project and confirm a draft proposal and an apply session
- [x] 6.5 Mark tasks 5.3 of `propose-change-on-issue-label` done with the verdict "keep", and update the roadmap to say this work came before the pilot review
