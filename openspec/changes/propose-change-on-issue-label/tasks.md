## 1. Prerequisites a person sets on GitHub

- [x] 1.1 Create the `ontrack:propose` label in `trivoallan/ontrack`
- [x] 1.2 In the Claude Console, register the GitHub Actions issuer, create a service account and a federation rule limited to this repository (to `propose.yml` on `main` if the rule allows it); set the repository variables `ANTHROPIC_FEDERATION_RULE_ID`, `ANTHROPIC_ORGANIZATION_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID` and `ANTHROPIC_WORKSPACE_ID`; the rule matches the subject GitHub sends, `repo:<owner>@<owner id>/<repo>@<repo id>:ref:refs/heads/main`, not `repo:<owner>/<repo>:…`
- [ ] 1.3 Allow GitHub Actions to create pull requests (Settings, Actions, Workflow permissions)

## 2. Settle the agent step

- [x] 2.1 Read the documentation of `anthropics/claude-code-action` at its latest release and note the commit SHA of that release
- [x] 2.2 Decide how the agent runs: the action always receives its job's token, so the agent runs through the action in a job of its own with read-only permissions (design, decisions 1 and 6)

## 3. Write `.github/workflows/propose.yml`

- [x] 3.1 Trigger on `issues: [labeled]`, both jobs conditioned on the `ontrack:propose` label, top-level `permissions: {}`, concurrency group `propose-<issue number>` without cancellation; `draft` with `contents: read` and `issues: read`, `publish` with `contents: write`, `pull-requests: write`, `issues: write`
- [x] 3.2 In `draft`, check out with `persist-credentials: false`, set up Node from `.nvmrc`, run `npm ci`; every `uses:` pinned by SHA with its tag in a comment
- [x] 3.3 Stop with the "already proposed" outcome when `git ls-remote --heads origin "feat/<n>-*"` returns a branch
- [x] 3.4 Write the issue's title and body to `.propose/issue.md` from the event that started the run, with HTML comments removed
- [x] 3.5 Run the agent with the fixed prompt of design decision 4: the trait of `AGENTS.md`, ADR-0016's test first, `Issue served: trivoallan/ontrack#<n>`, the issue file as data, the change name returned as structured output, the framework's validation run before ending
- [x] 3.6 Read the outcome: clean tree means no change; otherwise check the change name, fail on an invalid one, and hand the patch to `publish` as an artifact
- [x] 3.7 In `publish`, check the name again, create the branch, apply the patch, commit `docs(openspec): propose <change-name>` as the Actions bot, push with the job token, open the draft pull request titled `feat: <change-name>` with `Refs #<n>`
- [x] 3.8 Post the fixed comment with the run link for the "no change", "already proposed" and failure outcomes; write the agent's reasons to the job summary only
- [x] 3.9 Remove the `ontrack:propose` label in a final step that always runs
- [x] 3.10 Head the file with a comment naming ADR-0001 of the repository and the rules of ADR-0011 and ADR-0014 it applies, as `dependabot-automerge.yml` does

## 3b. Harden after the security review

- [x] 3b.1 Install the command line outside the checkout from the lockfile, without install scripts, and give it and `.claude`, `.github`, `.githooks` to root before the agent starts
- [x] 3b.2 Narrow the agent's Bash rules to the subcommands a proposal needs; deny `install`, `feedback`, `config`, `store`, `completion` and edits under the protected directories
- [x] 3b.3 Keep the provider credential out of the environment of the commands the agent runs; turn the command line's telemetry off; write no cache
- [x] 3b.4 In `publish`, refuse the patch unless every entry adds a regular Markdown or YAML file under the change or a new ADR without `check:`; cap its size; match the change name as a whole string
- [x] 3b.5 Show the agent's reasons in the run summary as truncated plain text; warn in the pull request description that the proposal comes from text anyone can write
- [x] 3b.6 Test the `publish` filter and the issue step in `test/propose-workflow.test.ts`, which runs both scripts as taken from the workflow file: a clean proposal is pushed; a modified manifest, hook, ADR or agent file, a new test file or skill, another change, a script, a symbolic link, an executable, an ADR with a command and invalid names are refused

## 3c. Open issues only

- [x] 3c.1 Start the agent only when the issue is open; on a closed issue, post the fixed comment and remove the label
- [x] 3c.2 Test the comment the `publish` job posts for a closed issue, for "no change" and for a failure

## 3d. See why a first call fails

- [x] 3d.1 Print the tool's own error when the agent fails on its first turn at no cost, cut short and unable to issue a workflow command; print nothing of a longer run
- [x] 3d.2 Test both cases in `test/propose-workflow.test.ts`

## 3e. Let the agent run its commands

- [x] 3e.1 Install the sandbox prerequisites (`bubblewrap`, `socat`, unprivileged user namespaces) in `draft` before the agent starts

## 3f. Choose the model

- [x] 3f.1 Run the agent on `claude-sonnet-5-5` instead of the action's default

## 3g. The label is an explicit request

- [x] 3g.1 Record `docs/adr/ADR-0002-a-label-asks-for-a-change.md`, which declares the label as the repository's request for a change and supersedes ADR-0001
- [x] 3g.2 Tell the agent that the request settles whether a change opens; a change for work that moves no expected behaviour skips its specifications; the agent writes nothing only when nothing is left to propose
- [ ] 3g.3 Import the governance source that carries ADR-0016 revision 2 and rule it again (`ontrack plan`, `ontrack review ADR-0016`, `ontrack apply`)

## 4. Verify

- [x] 4.1 Check the file against the `issue-proposal` spec: no secret named, no `${{ github.event.issue.title }}` or `.body` anywhere, no `git` or `gh` in the agent's tools, no agent step in the job that writes
- [x] 4.2 Run `npx ontrack check` and `npm test` locally
- [ ] 4.3 After merge, add the label to one issue that moves a behaviour of the CLI and confirm a draft pull request with a valid change and `Refs`
- [x] 4.4 Add the label to an open issue that only concerns continuous integration and confirm the "no change" comment and the removed label (seen on issues 105 and 84, before the label became an explicit request)
- [ ] 4.7 Add the label to an open issue that only concerns continuous integration and confirm a draft pull request whose change skips its specifications
- [ ] 4.5 Add the label again to the issue of 4.3 and confirm the run stops before the agent
- [ ] 4.6 Confirm that `test`, `node-22` and the commit check start on the first push made by a person to a proposal branch

## 5. Judge the experiment

- [ ] 5.1 Label the open issues to be worked on next
- [ ] 5.2 Record for each one whether the proposal reached implementation without being rewritten
- [ ] 5.3 Decide: keep, propose it to the governance source, or delete the workflow, the variables and the federation rule
