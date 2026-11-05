# Practice workflow implementation plan

> Execute inline using superpowers:executing-plans. User approved implementation of the preceding detailed brief.

**Goal:** Position the camera, practice, review the movement actually seen, and loop/export a selected range.
**Architecture:** Retain the single HTML source, existing codec pipeline and bounded compressed history. Add an explicit preview phase, display-anchored snapshots and range state. Preserve generated readable/self-extract builds.
**Tech stack:** Native browser APIs, PowerShell builder, Node unit tests and Chromium browser tests.
**Spec:** User-approved implementation brief in this conversation; final behavior recorded in APP_SPEC.md.

## Constraints
- No runtime networking, microphone, new libraries, main-branch writes or merge.
- Japanese/English, #16624F, intrinsic video geometry, keyboard and safe areas.
- Version 1.1.0; generated files only through builder.

## Review focus
- Late camera/decoder work must not replace a stopped or newer session.
- A 15-second delay with 10-second history must include the displayed frame.
- History truncation must retain a decodable keyframe and report reduced coverage.
- Range changes/loop boundaries/export must not display frames outside the range.
- Portrait media, short landscape and enlarged text must leave primary controls reachable.

## Task 1: Display-anchored history and range model
- [x] Add failing behavioral tests in scripts/verify-review-range.test.mjs for snapshot timestamps, keyframes, short history, memory limits and range validation.
- [x] Change src/index.template.html: buildReviewSnapshot(anchorUs), reviewHistoryKeepUs(), pruneHistory(), setReviewRange(startUs,endUs), reviewExportWindow().
- [x] Run new tests plus existing settings tests. Snapshot ends at the displayed frame; initial seek pauses on it. Keep requested preceding duration when available.

## Task 2: Preview and replay/export integration
- [x] Add preview lifecycle and range-loop tests before implementation.
- [x] Add preview phase and explicit beginPractice(), retaining generation guards across switching and background/resume.
- [x] Integrate selected range into playback, looping and export, and keep the selection on failure.
- [x] Run unit tests and browser workflow tests using numbered synthetic video.

## Task 3: Responsive interface
- [x] Simplify start screen, move stop to settings, add range controls and explicit guide editing.
- [x] Use intrinsic aspect ratio and a landscape side column; overlays hide without blank layout space.
- [x] Verify 320/375/390/430 portrait, landscape and desktop in both languages, fullscreen and help.

## Task 4: Release verification
- [x] Update APP_SPEC, READMEs, help, changelog and config; align old layout assertions with new behavior.
- [x] Run PowerShell preflight/repository checks; unit/browser/export checks; regenerate screenshots and both HTML variants.
- [x] Fresh whole-branch review, address important findings, commit and open PR without merging.

## Execution ledger
- Baseline fc26f17: clean checkout, no open PRs. PowerShell preflight and repository build passed on Linux with PowerShell 7.6.
- Template checked at 643044c; existing components retained. Fresh isolated checkout on codex/practice-mirror-v1.1.

- Verification: 19 unit tests; real synthetic-camera workflow with range loop and seekable 2s export, 14 JA/EN sizes; settings across file variants; responsive/help and fullscreen checks. Fresh review found and fixed preview stop, dead-track start, and stale range validation. Physical camera/iOS/Android not tested.
