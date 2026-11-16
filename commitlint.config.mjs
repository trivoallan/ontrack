// Commit format of ADR-0006. With squash merges (ADR-0009), CI lints the
// pull request title. The scopes are `commits.scopes` in
// docs/adr/engineering/ADR-0006-commits.md: change both together.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['apply', 'check', 'cli', 'governance', 'instructions', 'openspec', 'plan', 'review', 'revision', 'tracks'],
    ],
  },
};
