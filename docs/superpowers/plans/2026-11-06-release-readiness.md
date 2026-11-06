# Practice Mirror v1.1.0 Release Readiness Plan

**Goal:** Correct final-review findings and make PR #13 produce a version tag and a complete GitHub Release after the user merges it.
**Architecture:** Keep the current single-HTML runtime. A read-only validation job builds and tests the exact revision and prepares release artifacts. A separate main-only job creates a draft release, uploads verified assets, and publishes only after every upload succeeds.
**Tech stack:** Native browser APIs, Node.js tests, PowerShell build scripts, GitHub Actions and GitHub REST APIs.
**Spec:** APP_SPEC.md and the user's final-review/release request.

## Constraints

- The user merges; do not merge, tag or publish the unmerged PR.
- Version is 1.1.0; preserve local processing and both standalone variants.
- Do not overwrite published releases or move existing tags.
- Physical Android/iOS checks and the reported Android tearing fix remain unverified.

## Review focus

- Rounded range endpoints must survive editing the other boundary.
- Missing/corrupt release files must fail before publication.
- PRs and non-main dispatches must not publish.
- Failed uploads must leave a draft, never a partial public release.
- Re-runs must preserve published tags/assets.

## Tasks

- [x] Add an endpoint-rounding regression; fix numeric parsing without weakening range validation; run camera workflow.
- [x] Add release packaging and publication scripts with tests for integrity, branch guards, tag conflicts, retries and upload failures.
- [x] Add a read-only PR/main validation job and a main-only publication job; document release notes and actual verification limits.
- [ ] Run packaging, unit and browser suites; review the final diff; update PR #13 and confirm CI/preview.
