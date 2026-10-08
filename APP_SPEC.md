# Practice Mirror — Application Specification

Status: Stable release
Current version: v1.0.1
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice.

Move → delayed view → Review if needed → adjust → move again.

## v1.0.1 settings polish

- Review settings offers 10 / 30 / 60 / 180 second presets alongside the existing 10–180 second integer field.
- Presets commit immediately to local storage and clear any invalid Review draft. Only the last valid setting is restored after reload.
- Language changes preserve unfinished/invalid delay and Review drafts, custom delay mode, and localized validation messages. A custom delay that matches a preset remains editable until a preset is chosen.
- The Review summary shows the last valid maximum; no preset is highlighted for a different or invalid draft.
- Language control displays the destination EN / JA with localized destination `aria-label` / `title`; Help has a matching localized title.
- No camera capture, microphone, codec, export, persistence-key, or network boundary changes.
- Camera-free settings behavior is covered by source-level unit tests; physical-camera capture, timing/latency, and device-specific checks remain separate manual gates.

## v1.0.0 release scope

v1.0.0 promotes the validated v0.9.0 release-candidate behavior without adding a new product category.

- Delayed Practice: 3 / 5 / 10 / 15 second presets and custom 1–30 seconds.
- Review history: default 10 seconds, configurable 10–180 seconds, available after about 10 seconds.
- Review playback: 0.25x / 0.5x / 1x / 2x, seek, frame stepping, key-frame-safe decoder restart.
- Review export: seekable WebM with embedded `fix-webm-duration` 1.0.6.
- Guides, Mirror, camera switching, Fullscreen, Screen Wake Lock.
- Adaptive performance, bounded compressed queues, limited live recovery, background/resume handling.
- Mobile-first layout, keyboard access, focus management, and screen-reader status announcements.
- Japanese / English UI in the same standalone HTML.
- No microphone capture and no runtime external connection from the standalone app.

## Distribution

The normal build generates:

- `dist/index.html` — readable standalone / GitHub Pages artifact.
- `practice-mirror.html` — byte-identical repository-root copy.
- `dist/index.self-extract.html` — gzip self-extracting standalone.

The v1.0.0 release branch includes the generated `practice-mirror.html`. The screenshot workflow regenerates and verifies the Japanese/English desktop/mobile screenshots on release PRs.

## Privacy boundary

- CSP contains `connect-src 'none'`.
- Camera capture uses `audio:false`.
- Camera frames and Review data remain in browser memory.
- `fix-webm-duration` is exact-version pinned, SHA-256 locked, and embedded at build time.
- Export uses temporary local Canvas / MediaRecorder / Blob URLs only after explicit Save.
- No app analytics, telemetry, CDN runtime, or media-upload endpoint.

## Release validation

`RELEASE_CHECKLIST.md`, `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`, and `RELIABILITY_TEST_MATRIX.md` remain the release validation references. Static CI verifies packaging, runtime-network boundaries, key-frame restart safety, seekable WebM output, Review layout, configurable Review history, icon consistency, and accessibility/reliability regression markers.

Manual device checks must not be represented as completed unless they were actually run.
