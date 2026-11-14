# Tasks

## 1. Verify the release

- [x] 1.1 Wait for the next release and note its version; verify with `npm view @trivoallan/ontrack version` that the registry serves it
- [x] 1.2 In an empty scratch project, run `npm install @trivoallan/ontrack@<version>` then `npm audit signatures`; verify the output lists the package among those with a verified attestation

## 2. If no attestation is listed

- [ ] 2.1 Retry after a few minutes, to rule out registry propagation delay
- [ ] 2.2 Read the `publish` job log of the release run and verify the `--provenance` flag was passed and honoured
- [ ] 2.3 Check the trusted-publisher settings of the package on npmjs.com (repository and workflow file name) and the job's `id-token: write` permission; record the cause on the issue and open a follow-up change if the workflow must be fixed
