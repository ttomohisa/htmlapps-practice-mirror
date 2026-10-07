# Changelog

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
