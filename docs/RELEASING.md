# Releasing Practice Mirror

The owner merges PRs. Never tag the unmerged PR as a release.

## v1.1.0

PR #13 adds `.github/workflows/release.yml`. After merging to `main`, the workflow builds and verifies that exact commit, runs unit and Chromium browser tests, and prepares:

- `practice-mirror.html`
- `practice-mirror.self-extract.html`
- `SHA256SUMS`

A separate job with `contents:write` creates `v1.1.0` at the tested main commit. It uploads the three assets to a draft GitHub Release and publishes only after every upload succeeds. PR validation has read-only permissions and cannot publish. No extra repository secret is required beyond `GITHUB_TOKEN`; repository/organization policies must permit the workflow's write permission.

The release notes are `docs/releases/v1.1.0.md`. Read the pending physical-device items in `RELEASE_CHECKLIST.md` before merging. The Android line-noise fix has not been confirmed on the reporting device.

## Subsequent versions and retries

1. Update `app.config.json`, UI/help version markers and CHANGELOG consistently.
2. Add `docs/releases/vX.Y.Z.md`.
3. Merge the reviewed PR. Changes to `app.config.json` trigger the release workflow.
4. Check the release workflow and its GitHub Release link in the job summary.

For a failed run, rerun it or select **Validate and release Practice Mirror → Run workflow → main**. A matching draft is resumed; failed asset uploads leave it unpublished. A tag pointing at another commit fails instead of moving the tag. An already-published version is skipped without changing its assets or tag. Use a new version for a new release.

The workflow also runs on changes to its own YAML. A manual dispatch from another branch can validate, but publication is restricted to `refs/heads/main`.

## Local checks

```powershell
./scripts/check-powershell-syntax.ps1
./scripts/check-repository.ps1
node --test scripts/verify-settings.test.mjs scripts/verify-review-range.test.mjs tests/mobile-layout.test.cjs tests/release.test.cjs
node scripts/package-release.cjs
```

`release/` is local generated output. The packaging command does not create a tag or contact GitHub. Verify HTML checksums with `sha256sum -c SHA256SUMS` (or the equivalent local hashing tool).
