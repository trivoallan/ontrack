<!-- ontrack:begin -->
## Project instructions (ontrack)

When asked to review, rule on or supersede an ADR, run `npx ontrack review [adr]` and follow its output.

### Localization (engineering/ADR-0002-localization)

```yaml
localization:
  language:
    default: english
    documentation:
    commits:
    code:
    comments:
```

### Software architecture (engineering/ADR-0003-architecture)

```yaml
architecture:
  pattern: monolithic
```

### Languages (engineering/ADR-0004-languages)

```yaml
languages:
  main:
    name: TypeScript
```

### Validation (engineering/ADR-0005-validation)

```yaml
validation:
  boundary: zod
  data_files: json-schema
```

### Commits (engineering/ADR-0006-commits)

```yaml
commits:
  scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, tracks]
  tool: commitlint
```

### Tests (engineering/ADR-0007-tests)

```yaml
tests:
  coverage_target: 95
```

### Documentation (engineering/ADR-0008-documentation)

```yaml
docs:
  tool: starlight
  root: docs/
  audience: public
  channels: [release, main]
```

### Branching (engineering/ADR-0009-branching)

```yaml
branching:
  model: github-flow
  merge: squash
  prefixes: [feat, fix, docs, chore]
```

### Architecture documentation (engineering/ADR-0010-architecture-documentation)

```yaml
architecture:
  document: arc42
  model: likec4
  diagrams: mermaid
```

### Forge and continuous integration (engineering/ADR-0011-forge-and-ci)

```yaml
forge:
  gate: blocking
  audit: zizmor
  integration: up-to-date
```

### Delivery (engineering/ADR-0012-delivery)

```yaml
delivery:
  target: package
  environments:
    - { name: github, trigger: tag }
    - { name: npm, trigger: tag }
  release_tool: release-please
  release_notes: highlights
  registry: none
deployment:
  manifests: none
```

### Work tracking (engineering/ADR-0014-work-tracking)

```yaml
tracking:
  tool: github-issues
  project: trivoallan/ontrack
```

### Secrets (engineering/ADR-0015-secrets)

```yaml
secrets:
  storage: keychain
  guard: gitleaks
```

### Changes (engineering/ADR-0016-changes)

```yaml
changes:
  framework: openspec
  schema: spec-driven-with-adr
```

### Agent tooling (engineering/ADR-0017-agent-tooling)

```yaml
agent:
  hosts: [claude-code]
```

### Vulnerabilities (engineering/ADR-0019-vulnerabilities)

```yaml
vulnerabilities:
  sbom: cyclonedx
  scanner: grype
  fail_on: critical
```

### Build provenance (engineering/ADR-0021-build-provenance)

```yaml
supply_chain:
  build_level: 2
```

### Review and merge (engineering/ADR-0022-review-and-merge)

```yaml
review:
  by: maintainer
  approvals: 0
```

### License (engineering/ADR-0023-license)

```yaml
license:
  spdx: Apache-2.0
```

### Code scanning (engineering/ADR-0024-code-scanning)

```yaml
code_scanning:
  tool: codeql
  fail_on: high
```

### Tools outside the package manager (engineering/ADR-0025-tools)

```yaml
tools:
  manager: mise
```

### Agent identity (engineering/ADR-0026-agent-identity)

```yaml
agent:
  identity: maintainer
```

### A ruled ADR follows the files it references (local/ADR-0025-a-ruled-adr-follows-the-files-it-references)

```yaml
record-architecture-decisions:
  format: nygard
```

### The engineering track skips the cooldown under its new alias (local/ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias)

```yaml
dependencies:
  updater: dependabot
  automerge: patch
admission:
  approver: person
  install_scripts: ignored
```

### Not yet decided

- Infrastructure (engineering/ADR-0027-infrastructure)

<!-- ontrack:end -->
