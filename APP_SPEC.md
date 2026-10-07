# Practice Mirror — Application Specification

Status: Release Candidate
Current version: v0.9.0
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice.

Move → delayed view → Review if needed → adjust → move again.

v0.9.0 freezes feature work and prepares the current feature set for public release.

## Release-candidate scope

- Keep the complete v0.8.0 Practice / Review / save / Reliability / Accessibility behavior.
- Use the user-approved SVG in `assets/favicon.svg` as the canonical browser favicon and upper-left app icon.
- Replace stale template screenshots with current Japanese/English desktop/mobile captures.
- Keep runtime external networking blocked.
- Keep microphone capture disabled.
- Keep standalone/self-extract packaging deterministic.
- Make remaining real-device checks explicit instead of claiming they were completed.

## Core behavior retained

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay.
- Local camera capture with `audio:false`.
- Adaptive processing profiles.
- Front/rear camera switching where available.
- Fullscreen and Screen Wake Lock.
- Previous-10-second Review.
- 0.25x / 0.5x / 1x, seek, frame stepping.
- Draggable/keyboard guides and Mirror.
- Explicit local Review saving with MP4/WebM capability detection.
- Generation-safe Reliability recovery and bounded buffers.
- Mobile touch targets, short-landscape layout, keyboard/focus/screen-reader behavior.
- Japanese / English UI in one standalone HTML.

## Canonical release assets

- `assets/favicon.svg` — canonical icon/favicon source.
- `assets/screenshot.png` — Japanese desktop.
- `assets/screenshot-en.png` — English desktop.
- `assets/screenshot-mobile.png` — Japanese mobile.
- `assets/screenshot-mobile-en.png` — English mobile.

Screenshots must be captured from freshly generated `dist/index.html`, not from the template starter.

## Runtime privacy boundary

- Generated HTML contains `connect-src 'none'`.
- No external runtime scripts/styles/fonts.
- No application fetch/XHR/WebSocket/EventSource endpoint.
- Camera capture uses `audio:false`.
- Media is not persisted automatically.
- Export occurs only after explicit user action.

## Build outputs

- `dist/index.html`
- `practice-mirror.html`
- `dist/index.self-extract.html`

`practice-mirror.html` must remain byte-identical to `dist/index.html`.

## v0.9.0 acceptance criteria

1. Version is consistently v0.9.0.
2. Approved SVG is the canonical favicon/header icon source.
3. Four current release screenshots exist.
4. Japanese/English README describe the actual product.
5. Existing Reliability and Accessibility regression contracts pass.
6. `connect-src 'none'` and `audio:false` remain intact.
7. Standalone/self-extract builds pass.
8. PR Preview returns HTTP 200.
9. Remaining device checks are recorded in release matrices.

## v1.0.0 gate

Complete `RELEASE_CHECKLIST.md`, `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`, and `RELIABILITY_TEST_MATRIX.md`, then promote only if no Critical/High issue remains in the main practice loop.
