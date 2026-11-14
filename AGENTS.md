<!-- ontrack:begin -->
## Project rules (ontrack)

### Record architecture decisions (trivoallan/ADR-0001-record-architecture-decisions)

```yaml
record-architecture-decisions:
  format: nygard
```

### Localization (trivoallan/ADR-0002-localization)

```yaml
localization:
  language:
    default: english
    documentation:
    commits:
    code:
    comments:
```

### Software architecture (trivoallan/ADR-0003-architecture)

```yaml
architecture:
  pattern: monolithic
```

### Languages (trivoallan/ADR-0004-languages)

```yaml
languages:
  main:
    name: TypeScript
```

### Validation (trivoallan/ADR-0005-validation)

```yaml
validation:
  boundary: zod
  data_files: json-schema
```

### Commits (trivoallan/ADR-0006-commits)

```yaml
commits:
  scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, sources]
  tool: commitlint
```

### Tests (trivoallan/ADR-0007-tests)

```yaml
tests:
  coverage_target: 95
```

### Documentation (trivoallan/ADR-0008-documentation)

```yaml
docs:
  tool: starlight
  root: docs/
  audience: public
```

### Branching (trivoallan/ADR-0009-branching)

```yaml
branching:
  model: github-flow
  merge: squash
  prefixes: [feat, fix, docs, chore]
```

### Architecture documentation (trivoallan/ADR-0010-architecture-documentation)

```yaml
architecture:
  document: arc42
  model: likec4
  diagrams: mermaid
```

### Forge and continuous integration (trivoallan/ADR-0011-forge-and-ci)

```yaml
forge:
  gate: blocking
```

### Delivery (trivoallan/ADR-0012-delivery)

```yaml
delivery:
  target: package
  environments:
    - { name: github, trigger: tag }
    - { name: npm, trigger: tag }
  release_tool: release-please
  registry: none
deployment:
  manifests: none
```

### Work tracking (trivoallan/ADR-0014-work-tracking)

```yaml
tracking:
  tool: github-issues
  project: trivoallan/ontrack
```

### Secrets (trivoallan/ADR-0015-secrets)

```yaml
secrets:
  storage: keychain
  guard: gitleaks
```

### Changes (trivoallan/ADR-0016-changes)

```yaml
changes:
  framework: openspec
  schema: spec-driven-with-adr
```

### Agent tooling (trivoallan/ADR-0017-agent-tooling)

```yaml
agent:
  host: claude-code
```

### Dependencies (trivoallan/ADR-0018-dependencies)

```yaml
dependencies:
  updater: dependabot
  automerge: patch
```

### Not yet decided

- Vulnerabilities (trivoallan/ADR-0019-vulnerabilities)
- Adding a dependency (trivoallan/ADR-0020-adding-dependencies)
- Build provenance (trivoallan/ADR-0021-build-provenance)

<!-- ontrack:end -->
