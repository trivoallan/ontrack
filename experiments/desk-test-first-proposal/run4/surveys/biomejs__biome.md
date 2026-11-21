### biomejs__biome.json cost=2.08 turns=48 subtype=success writes=[]
I'll start the survey: read every ADR and look at the repository, writing nothing.
---
I'm partway through the survey: 14 of 25 ADRs read. Next I'll read the remaining ADRs, then check the repository.
---
All 25 ADRs read. Now the repository itself.
---
Still in the survey: checking the remaining evidence (secrets, coverage, agent settings, tool install) before I present the two groups.
---
The survey is done and I haven't written anything. ADR-0001 is already decided, so 25 ADRs are open. Here they are in two groups.

**Group 1: the repository already answers these** (the ruling would mostly write down what it does today)

| ADR | What the repository does today |
| --- | --- |
| 0002 Localization | Everything is in English (`AGENTS.md`, `CONTRIBUTING.md`, the commits). `.coderabbit.yaml` sets `language: "en-GB"`. |
| 0004 Languages | Rust: `Cargo.toml` workspace with 106 crates under `crates/`, plus `rust-toolchain.toml`. TypeScript is only used for the npm wrappers. |
| 0005 Validation | Configuration is read through `biome_deserialize` (`crates/biome_deserialize*`). `packages/@biomejs/biome/configuration_schema.json` is generated from it. |
| 0011 Forge and CI | GitHub. zizmor runs in `.github/workflows/actions_linter.yml`. Every action is pinned by SHA. |
| 0012 Delivery | npm packages and crates. Releases go through changesets (`.github/workflows/release.yml`, `changesets/action`) and publish to npm when the `ci: release` PR merges. |
| 0013 Frontend | There is no user interface here. The playground and website live in `biomejs/website` (`CONTRIBUTING.md`, "Documentation"). |
| 0014 Work tracking | GitHub issues, `biomejs/biome` (`CONTRIBUTING.md`, "Reporting bugs"). |
| 0018 Dependencies | Renovate (`.github/renovate.json5`) with `minimumReleaseAge: "3 days"` and no automerge. |
| 0021 Build provenance | `"provenance": true` in every `packages/@biomejs/*/package.json`, plus `actions/attest` in `release.yml` and `release_cli.yml`. That is SLSA Build level 2. |
| 0023 License | `"license": "MIT OR Apache-2.0"` in the root manifest and all package manifests, with `LICENSE-MIT` and `LICENSE-APACHE` at the root. |
| 0026 Agent identity | Rule it `rejected`: the ADR is written for a repository kept by one person, and this one has three maintainer teams (`CONTRIBUTING.md`, "Current Members"). |

**Group 2: these need a discussion**

| ADR | Why it needs a discussion |
| --- | --- |
| 0003 Architecture | The crate pipeline (parser → syntax → analyzer/formatter → service → cli/lsp) only roughly fits the allowed values. |
| 0006 Commits | PR titles are checked by `amannn/action-semantic-pull-request`, not commitlint. Biome's types include `release` but not `style`, and there is no closed list of scopes. |
| 0007 Tests | No line coverage is measured. The "coverage" jobs measure conformance against suites such as test262. |
| 0008 Documentation | User docs live in another repository. Rule docs are written as rustdoc here. |
| 0009 Branching | There is a `main` + `next` model, and `next` merges into `main` with a merge commit. Branch names are free-form (`dyc3/…`, `conaclos/…`), so the prefix check would fail. |
| 0010 Architecture documentation | There is no arc42. There are `CONTRIBUTING.md` files in each crate. |
| 0015 Secrets | No commit guard exists, and nothing says how secrets are stored. |
| 0016 Changes | Changesets are release notes, not change intent. Probably `none`. |
| 0017 Agent tooling | There are skills in `.agents/skills/`, but no `.claude/`, `opencode.json` or Copilot settings. |
| 0019 Vulnerabilities | `cargo deny check bans advisories` runs on PRs, with no SBOM, no schedule and npm left out. |
| 0020 Adding a dependency | `pnpm-workspace.yaml` has `allowBuilds` and a cooldown, but Cargo `build.rs` scripts always run. |
| 0022 Review and merge | Review is by other maintainers. The ruleset could not be read: the `gh api` call needed approval. |
| 0024 Code scanning | No CodeQL or Semgrep workflow exists. |
| 0025 Tools | `just install-tools` pins versions through `cargo binstall`, without checksums. The answer depends on 0011 and 0015. |

The order I propose is group 1 first (0002, 0004, 0005, 0011, 0012, 0013, 0014, 0018, 0021, 0023, 0026), then group 2 in number order (0003, 0006, 0007, 0008, 0009, 0010, 0015, 0016, 0017, 0019, 0020, 0022, 0024, 0025).

Do you agree with this order, or would you like a different one? There's no question tool in this session, so please reply in text.
