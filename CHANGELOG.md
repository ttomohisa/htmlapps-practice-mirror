# Changelog

## [0.3.0] - 2026-10-07

### Added

- 0.25x Review playback.
- Previous-frame and next-frame Review controls.
- Multiple draggable vertical and horizontal guide lines.
- Keyboard guide movement, edge jumps, and deletion.
- Clear-all guide action with Undo.
- Mirror display toggle that flips the Canvas without changing encoded video.

### Changed

- Updated Japanese / English help and documentation for Frame Review & Guides.
- Tightened standalone size warning budgets for the now-concrete application.

## [0.2.0] - 2026-10-07

### Added

- Fixed Review snapshot of up to the previous 10 seconds.
- Review play / pause / seek.
- 0.5x and 1x Review playback.
- Return-to-practice flow that reuses the live camera and rebuilds the delay buffer.
- Bounded compressed Review history and keyframe-based seeking.

## [0.1.0] - 2026-10-07

### Added

- Initial Practice Mirror implementation based on the current Browser Kitty single-HTML app template contract.
- User-initiated camera access with rear-camera preference.
- 5 second and 10 second delayed playback modes.
- WebCodecs H.264 / VP8 capability selection.
- Timestamp-based encoded delay queue and Canvas playback.
- Warm-up progress and explicit failure states.
- Japanese and English UI.
- Local-only CSP with `connect-src 'none'`.
- Standalone and self-extract build scripts.
