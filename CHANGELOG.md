# Changelog

## [1.0.1] - 2026-10-08

### Added

- Quick 10 / 30 / 60 / 180 second Review-history presets, with the existing custom field retained.
- Camera-free source-level regression tests for timing drafts, preset selection, persistence, and bilingual header labels.

### Fixed

- Language changes no longer replace invalid or empty timing drafts with the last saved value or hide custom delay entry.
- A custom delay equal to a preset remains editable instead of unexpectedly collapsing.
- The header keeps its version badge visible at 320px instead of clipping it alongside the app name.
- The language button identifies its destination in localized accessible labels/tooltips, Help exposes a matching tooltip, and its hit target stays at least 44 pixels.

## [1.0.0] - 2026-10-07

### Stable release

- Promoted the v0.9.0 release-candidate feature set to the first stable Practice Mirror release.
- Published the verified GitHub Pages demo and repository-root single HTML download path.
- Rewrote Japanese / English README files using the public-app structure established by PDF Organizer: demo, quick start, usage, Pages publishing, build layout, privacy, limitations, dependencies, and contribution guidance.
- The release includes the generated repository-root `practice-mirror.html`; release CI regenerates and verifies the current Japanese / English desktop/mobile screenshots.
- Core behavior remains: configurable delayed Practice, 10–180 second Review history, frame inspection, guides/Mirror, seekable WebM save, adaptive performance, reliability recovery, and mobile/accessibility support.


## [0.9.0] - 2026-10-07

### Fixed

- Review playback recreates the decoder from the nearest actual key frame after seek/flush, preventing `VideoDecoder` delta-frame restart failures.
- Review export now prioritizes seekability: MediaRecorder creates one WebM Blob, then embedded `fix-webm-duration` 1.0.6 repairs duration metadata before download.
- Fullscreen centers the video horizontally and aligns the control rows with the video width.
- Review mode constrains video height so the complete video and seek bar fit in the normal desktop/mobile viewport.

### Added

- Configurable Review history from 10 to 180 seconds, defaulting to 10 seconds and persisted locally.
- Review remains available after about 10 seconds even when a longer maximum is selected.
- 2x Review playback.
- Smartphone Practice tools toggle with the panel closed by default.
- Collapsed Review Save section.
- Pinned `fix-webm-duration` dependency and lock entry.

### Changed

- Long Review history reuses encoded packet payloads when freezing Review and batches history pruning to avoid unnecessary long-buffer overhead.
- Review controls are grouped into a compact Review dock with Back to practice and Stop together.
- Review saving is WebM-only in v0.9.0 so the file can be post-processed locally for seekability.
- Release documentation and checklist updated for the revised Review/save behavior.
- User-approved Practice Mirror SVG remains the canonical favicon/header icon.

## [0.8.0] - 2026-10-07

### Added

- Dedicated polite screen-reader status region.
- Keyboard-aware Practice auto-hide.
- 44px-class touch targets and mobile accessibility test matrix.

### Changed

- Smartphone/landscape layout, focus transitions, guide ARIA semantics, safe-area handling, and Review accessibility were polished.

## [0.7.0] - 2026-10-07

### Added

- Generation-safe media callbacks, bounded queues, live watchdog, limited recovery, background/resume lifecycle, Review decoder isolation, and reliability test matrix.

## [0.6.0] - 2026-10-07

### Added

- Capability tiers, four-second performance monitoring, and adaptive processing profiles down to lower FPS/resolution targets.

## [0.5.0] - 2026-10-07

### Added

- 1–30 second delay controls, camera switching, Fullscreen, Screen Wake Lock, Practice auto-hide, and landscape layout.

## [0.4.0] - 2026-10-07

### Added

- Explicit local Review clip saving and editable output filename.

## [0.3.0] - 2026-10-07

### Added

- 0.25x playback, frame stepping, guides, and Mirror.

## [0.2.0] - 2026-10-07

### Added

- Fixed previous-10-second Review with playback, seek, and return-to-practice.

## [0.1.0] - 2026-10-07

### Added

- Initial delayed-camera implementation, local-only CSP, Japanese/English UI, and standalone build.
