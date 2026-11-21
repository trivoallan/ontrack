### date-fns__date-fns.json cost=2.03 turns=45 subtype=success writes=[]
I'll start with the survey: reading every ADR and looking at the repository, writing nothing.
---
Still in the survey: I've read ADR-0002 to 0013 and am reading the remaining thirteen before looking at the repository.
---
All 25 ADRs read. Now the repository itself: manifests, CI, history, tooling.
---
Almost done with the survey: checking a few last points (validation libraries, agent config, ontrack status) before presenting the two groups.
---
The survey is done. I read all 25 ADRs and the repository's manifests, mise tasks, the 6 workflows, release scripts, `.gitignore`, agent and devcontainer config, and git history. I wrote nothing.

The facts that drive the grouping:
- **What it is:** a pnpm monorepo of TypeScript npm libraries (`date-fns`, `@date-fns/tz`, `@date-fns/utc`, `@date-fns/docs`).
- **Releases:** done by hand from a workstation (`pkgs/core/scripts/release/release.sh` → `pnpm publish`).
- **CI:** test, lint and type workflows on push and pull request, actions pinned by tag (`@v6`, `@v4`).
- **Commits:** 2026 history is almost all direct commits by one maintainer (306 of 324), plus one commit by "Sasha's Agent". There are no merge commits.

## Group 1: the repository already answers these

| ADR | What the repository shows |
|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English |
| 0004 Languages | TypeScript (`pkgs/*/src/**/*.ts`, `typescript` in devDependencies) |
| 0010 Architecture documentation | No architecture document or model exists |
| 0012 Delivery | npm packages, versioned by hand on a tag (`release.sh`, `Promote to v4.4.0`), `CHANGELOG.md` per package |
| 0013 Frontend | A library with no user interface, so likely `rejected` |
| 0014 Work tracking | GitHub issues in `date-fns/date-fns` (`.github/ISSUE_TEMPLATE`, `(#4194)` in commits) |
| 0016 Changes | No change framework; intent lives in PRs and commits |
| 0018 Dependencies | No Dependabot or Renovate configuration |
| 0019 Vulnerabilities | No scanner and no SBOM |
| 0021 Build provenance | Published from a workstation without `--provenance`, so level 0 today |
| 0023 License | MIT (`pkgs/*/package.json`, `pkgs/core/LICENSE.md`) |
| 0024 Code scanning | No CodeQL or Semgrep workflow |
| 0025 Tools | mise (`mise.toml`, `jdx/mise-action`) |

For several of these (0010, 0016, 0018, 0019, 0021, 0024), the repository's answer is that it does nothing. The ruling can record that, or adopt the recommendation. I'll set out both options when we get to each one.

## Group 2: these need a discussion

| ADR | Why |
|---|---|
| 0003 Architecture | The repository is a library, not a service, and none of the allowed patterns fits it cleanly |
| 0005 Validation | The only input is function arguments, checked by hand (`isValid`, Invalid Date); it's unclear what counts as a boundary here |
| 0006 Commits | The history doesn't follow Conventional Commits, which the ADR fixes, though it has informal `(tz):`, `(utc):` and `(docs):` scopes |
| 0007 Tests | There's no coverage threshold, and `coverage.yaml` runs only when triggered by hand (it has a `TODO: Enable or remove`) |
| 0008 Documentation | Docs go to an external site through TypeDoc and Firebase, and none of the allowed `docs.tool` values fits |
| 0009 Branching | The maintainer pushes straight to `main`, contributor PRs land without merge commits, and branches have no naming convention |
| 0011 Forge & CI | Actions are pinned by tag, not SHA; I can't see whether a ruleset makes the checks required; nothing audits the workflows |
| 0015 Secrets | Plain-value files sit in the gitignored `secrets/` and `.env`, and nothing blocks a commit that contains a secret |
| 0017 Agent tooling | There's an `.opencode/agents/` folder, Codex credentials mounted in the devcontainer and a `.mcp.json`, but no `.claude/` |
| 0020 Adding a dependency | pnpm `allowBuilds` is set, so install scripts are already blocked by default; who approves a new dependency is unknown |
| 0022 Review & merge | There's one active maintainer, with a second one historically; who reviews is unclear |
| 0026 Agent identity | An agent identity (`agent@nocorp.me`) has been used once; this depends on 0022 |

**Proposed order:** Group 1 in list order (0002, 0004, 0010, 0012, 0013, 0014, 0016, 0018, 0019, 0021, 0023, 0024, 0025), then Group 2 in list order (0003, 0005, 0006, 0007, 0008, 0009, 0011, 0015, 0017, 0020, 0022, 0026). This also respects the dependencies between ADRs: 0012 and 0018 come before 0009, and 0017 before 0022 before 0026.

Do you agree with this order, or would you like a different one? You can also say which ADRs you'd rather skip.
