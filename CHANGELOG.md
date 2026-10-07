# Changelog

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
