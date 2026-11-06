# Practice Mirror v1.1.0 — Release Checklist

The checkboxes are owner review gates; current automated results are shown on the PR. Automated Chromium/emulated viewports are distinct from physical-device checks. Do not mark a device item complete without testing it. The owner decides when to merge; merging activates the main-only tag/Release workflow.

## Automated release checks

- [ ] PowerShell syntax/encoding and repository/standalone verification.
- [ ] Readable HTML, root copy and self-extracting HTML match the build contract.
- [ ] Canonical embedded favicon, pinned dependency hash, CSP and no runtime external requests.
- [ ] All settings, history/range, mobile layout and release-safety unit tests.
- [ ] File-open readable/root/self-extract settings and help behavior.
- [ ] Japanese/English at 320/375/390/430px portrait, phone landscape and desktop.
- [ ] Preview → warm-up → delayed practice → displayed-frame Review → return.
- [ ] Review stays visible/tappable after auxiliary auto-hide; video tap restores tools.
- [ ] Millisecond-rounded range fields preserve exact unchanged endpoints and native input validity.
- [ ] Slow playback, frame steps, range loop and seekable 2-second WebM with an edited filename.
- [ ] Fullscreen alignment, help scrolling, visible keyboard focus and logical transport focus order.
- [ ] Both HTML release assets and SHA256SUMS prepared for the tested commit.
- [ ] PR release-validation job succeeds; publish job is skipped on PRs.

## Manual / physical-device checks — pending

- [ ] Android Chrome: physical camera, front/back switching and sustained delayed practice.
- [ ] Android reporting device: line-like noise is absent with synchronized drawing.
- [ ] iPhone/iPad Safari: camera permission, positioning, delayed playback, Review and WebM export where supported.
- [ ] Device-specific background/resume, screen lock, orientation and safe-area behavior.
- [ ] Sustained long-history/resource tests in RELIABILITY_TEST_MATRIX.md.

## Release preparation

- [ ] README/help/spec/CHANGELOG match v1.1.0 and the final behavior.
- [ ] Four committed Japanese/English desktop/mobile screenshots are current.
- [ ] Release notes include the physical-device and Android-noise verification limits.
- [ ] Main-only publisher validates artifact commit and hashes before creating a tag.
- [ ] Failed uploads leave a draft; retries never overwrite a published release or move a conflicting tag.

After merge, confirm the release workflow publishes `v1.1.0` at its tested main commit with both HTML files and SHA256SUMS. Actual tag creation and GitHub upload/publication are intentionally not exercised from the unmerged PR.
