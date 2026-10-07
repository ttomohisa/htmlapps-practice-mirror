# Changelog

## [0.9.0] - 2026-10-07

### Fixed

- Review playback now recreates the decoder from the nearest actual key frame after seek/flush, preventing `VideoDecoder` failures when Play follows Review preparation, seeking, or frame stepping.

### Release candidate

- Froze feature work for final release validation.
- Replaced the canonical favicon/header icon with the user-approved Practice Mirror artwork.
- Reworked Japanese / English README files for public release.
- Added RELEASE_CHECKLIST.md.
- Added reproducible Japanese / English desktop/mobile screenshot capture from the generated standalone HTML.
- Added English screenshot assets to the release-asset contract.
- Final validation focuses on packaging, privacy/CSP, camera/save states, mobile/accessibility, and long-session reliability.


## [0.8.0] - 2026-10-07

### Added

- Dedicated polite screen-reader status region for important state changes.
- Keyboard-modality detection that prevents Practice auto-hide.
- Explicit tabindex fallback for hidden controls when `inert` is unavailable.
- Accessible current/total value text for Review seek.
- Guide keyboard shortcut metadata and movement-axis slider orientation.
- Custom-delay `aria-describedby` / `aria-invalid` behavior.
- `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`.

### Changed

- Primary touch targets and guide drag hit areas increased to approximately 44px.
- Smartphone Practice toolbar uses a two-column grid.
- Review transport and speed controls are more stable at narrow widths.
- Short-landscape control rail is narrower and hardened against horizontal overflow.
- Mobile/fullscreen/dialog/toast spacing respects safe-area insets.
- Start / Review / Back to Practice / Stop / Help transitions restore focus to visible controls.
- Whole-workspace `aria-live` usage was removed in favor of targeted status announcements.
- Long output filenames remain contained within the export control.


## [0.7.0] - 2026-10-07

### Added

- Generation-safe live encoder/decoder callbacks.
- Two-second live reliability watchdog with encoded/rendered progress checks.
- Hard packet bounds for compressed Review history.
- Live delay queue time/packet growth guard.
- Limited automatic live recovery, capped at two attempts per minute.
- Camera-track `ended` handling.
- Background/foreground suspension and resume behavior.
- BFCache-aware page lifecycle handling.
- Review-only decoder recovery with degraded-safe fallback.
- Session reliability diagnostics.
- Dedicated real-device `RELIABILITY_TEST_MATRIX.md`.

### Changed

- Practice resume discards stale delayed media and restarts Warm-up.
- Frozen Review can survive background suspension where possible.
- Review decoder failure no longer automatically destroys the live camera session.
- Camera switch, adaptive quality, recovery, and camera activation use stale-result guards.
- Repeated Review failure disables broken Review controls while preserving Back to Practice.
- Stop invalidates pending camera-switch/adaptive/recovery work.


## [0.6.0] - 2026-10-07

### Added

- Full / Core / Unsupported runtime capability tier.
- Four-second Practice performance monitoring using rendered FPS, encoder/decode queue pressure, and backpressure skips.
- Local initial-quality selection using broad device hints and requested delay.
- Automatic sustained-load downgrade profiles: 720p/30 → 720p/20 → 540p/15 → 360p/12 targets.
- Processing-quality and performance diagnostics.

### Changed

- A single overloaded window no longer triggers a quality change; two consecutive overload windows are required.
- Quality changes observe a cooldown to avoid rapid repeated adaptation.
- 30 → 20fps adaptation keeps the existing delayed buffer.
- Resolution reductions restart Warm-up and fall back to software FPS reduction when camera constraints cannot be changed.
- Automatic quality changes are downward-only within one Practice session.


## [0.5.0] - 2026-10-07

### Added

- 3 / 5 / 10 / 15 second delay presets and 1–30 second custom delay.
- Front/rear camera switching when multiple video inputs are available.
- Fullscreen workspace mode.
- Optional Screen Wake Lock.
- Practice control auto-hide on appropriate mobile/fullscreen layouts.
- Two-column short-landscape mobile layout.

### Changed

- Delay selection now follows preset + custom numeric-field behavior.
- Camera switching rebuilds the delay buffer and attempts to recover the previous camera if switching fails.
- Generic camera-facing and Wake Lock preferences can be stored locally without storing device IDs.

## [0.4.0] - 2026-10-07

### Added

- Explicit local saving of the frozen Review clip.
- Editable output filename with a separate predictable extension.
- Runtime MP4-preferred / WebM-fallback MediaRecorder format detection.
- Local export progress while the clip is reconstructed.
- Clear unsupported-save state without disabling Review.

### Changed

- Review save uses a separate temporary Canvas so guides and CSS Mirror are not baked into the exported file.
- Conflicting Review / Stop actions are disabled during export.

## [0.3.0] - 2026-10-07

### Added

- 0.25x Review playback.
- Previous-frame and next-frame Review controls.
- Multiple draggable vertical and horizontal guide lines.
- Keyboard guide movement, edge jumps, and deletion.
- Clear-all guide action with Undo.
- Mirror display toggle that flips the Canvas without changing encoded video.

## [0.2.0] - 2026-10-07

### Added

- Fixed Review snapshot of up to the previous 10 seconds.
- Review play / pause / seek.
- 0.5x and 1x Review playback.
- Return-to-practice flow that reuses the live camera and rebuilds the delay buffer.
- Bounded compressed Review history and keyframe-based seeking.

## [0.1.0] - 2026-10-07

### Added

- Initial delayed-camera implementation.
- User-initiated camera access.
- WebCodecs delayed playback.
- Japanese and English UI.
- Local-only CSP with `connect-src 'none'`.

## [0.8.0] - 2026-10-07

### Added

- Dedicated polite screen-reader status region for important state changes.
- Keyboard-modality detection that prevents Practice auto-hide.
- Explicit tabindex fallback for hidden controls when `inert` is unavailable.
- Accessible current/total value text for Review seek.
- Guide keyboard shortcut metadata and movement-axis slider orientation.
- Custom-delay `aria-describedby` / `aria-invalid` behavior.
- `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`.

### Changed

- Primary touch targets and guide drag hit areas increased to approximately 44px.
- Smartphone Practice toolbar uses a two-column grid.
- Review transport and speed controls are more stable at narrow widths.
- Short-landscape control rail is narrower and hardened against horizontal overflow.
- Mobile/fullscreen/dialog/toast spacing respects safe-area insets.
- Start / Review / Back to Practice / Stop / Help transitions restore focus to visible controls.
- Whole-workspace `aria-live` usage was removed in favor of targeted status announcements.
- Long output filenames remain contained within the export control.


## [0.7.0] - 2026-10-07

### Added

- Generation-safe live encoder/decoder callbacks.
- Two-second live reliability watchdog with encoded/rendered progress checks.
- Hard packet bounds for compressed Review history.
- Live delay queue time/packet growth guard.
- Limited automatic live recovery, capped at two attempts per minute.
- Camera-track `ended` handling.
- Background/foreground suspension and resume behavior.
- BFCache-aware page lifecycle handling.
- Review-only decoder recovery with degraded-safe fallback.
- Session reliability diagnostics.
- Dedicated real-device `RELIABILITY_TEST_MATRIX.md`.

### Changed

- Practice resume discards stale delayed media and restarts Warm-up.
- Frozen Review can survive background suspension where possible.
- Review decoder failure no longer automatically destroys the live camera session.
- Camera switch, adaptive quality, recovery, and camera activation use stale-result guards.
- Repeated Review failure disables broken Review controls while preserving Back to Practice.
- Stop invalidates pending camera-switch/adaptive/recovery work.


## [0.6.0] - 2026-10-07

### Added

- Full / Core / Unsupported runtime capability tier.
- Four-second Practice performance monitoring using rendered FPS, encoder/decode queue pressure, and backpressure skips.
- Local initial-quality selection using broad device hints and requested delay.
- Automatic sustained-load downgrade profiles: 720p/30 → 720p/20 → 540p/15 → 360p/12 targets.
- Processing-quality and performance diagnostics.

### Changed

- A single overloaded window no longer triggers a quality change; two consecutive overload windows are required.
- Quality changes observe a cooldown to avoid rapid repeated adaptation.
- 30 → 20fps adaptation keeps the existing delayed buffer.
- Resolution reductions restart Warm-up and fall back to software FPS reduction when camera constraints cannot be changed.
- Automatic quality changes are downward-only within one Practice session.


## [0.5.0] - 2026-10-07

### Added

- 3 / 5 / 10 / 15 second delay presets and 1–30 second custom delay.
- Front/rear camera switching when multiple video inputs are available.
- Fullscreen workspace mode.
- Optional Screen Wake Lock.
- Practice control auto-hide on appropriate mobile/fullscreen layouts.
- Two-column short-landscape mobile layout.

### Changed

- Delay selection now follows preset + custom numeric-field behavior.
- Camera switching rebuilds the delay buffer and attempts to recover the previous camera if switching fails.
- Generic camera-facing and Wake Lock preferences can be stored locally without storing device IDs.

## [0.4.0] - 2026-10-07

### Added

- Explicit local saving of the frozen Review clip.
- Editable output filename with a separate predictable extension.
- Runtime MP4-preferred / WebM-fallback MediaRecorder format detection.
- Local export progress while the clip is reconstructed.
- Clear unsupported-save state without disabling Review.

### Changed

- Review save uses a separate temporary Canvas so guides and CSS Mirror are not baked into the exported file.
- Conflicting Review / Stop actions are disabled during export.

## [0.3.0] - 2026-10-07

### Added

- 0.25x Review playback.
- Previous-frame and next-frame Review controls.
- Multiple draggable vertical and horizontal guide lines.
- Keyboard guide movement, edge jumps, and deletion.
- Clear-all guide action with Undo.
- Mirror display toggle that flips the Canvas without changing encoded video.

## [0.2.0] - 2026-10-07

### Added

- Fixed Review snapshot of up to the previous 10 seconds.
- Review play / pause / seek.
- 0.5x and 1x Review playback.
- Return-to-practice flow that reuses the live camera and rebuilds the delay buffer.
- Bounded compressed Review history and keyframe-based seeking.

## [0.1.0] - 2026-10-07

### Added

- Initial delayed-camera implementation.
- User-initiated camera access.
- WebCodecs delayed playback.
- Japanese and English UI.
- Local-only CSP with `connect-src 'none'`.
