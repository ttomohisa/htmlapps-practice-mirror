# Practice Mirror — Application Specification

Status: Release Candidate
Current version: v0.9.0
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice.

Move → delayed view → Review if needed → adjust → move again.

## v0.9.0 RC behavior

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay.
- Local camera capture with `audio:false`.
- Configurable Review history:
  - default: 10 seconds,
  - valid setting: integer 10–180 seconds,
  - Review becomes usable after approximately 10 seconds,
  - before the configured maximum has accumulated, Review freezes the history currently available,
  - after enough time, Review freezes up to the configured maximum.
- 0.25x / 0.5x / 1x / 2x playback, seeking, and frame stepping.
- Review playback restarts decoders from an actual key frame after seek/flush.
- Review UI is compact enough to keep the whole video and seek bar in one viewport on normal desktop/mobile review layouts.
- Review save settings are collapsed until requested.
- Review exports seekable WebM only.
- `fix-webm-duration` 1.0.6 is pinned and embedded through the template dependency pipeline.
- MediaRecorder output is finalized as one Blob, then duration metadata is repaired before download.
- Guides and Mirror are not burned into exported video.
- On smartphones the general Practice tools panel starts collapsed.
- Fullscreen centers the video horizontally and aligns controls to the video width.
- Review history remains compressed; raw VideoFrames are not retained.
- Entering Review reuses the existing encoded packet buffers instead of duplicating every packet payload, avoiding a temporary near-2x memory spike for long history.
- History pruning is batched at roughly one-second intervals once the buffer is populated, while hard packet limits still apply immediately.
- Existing Adaptive Performance, Reliability, and Accessibility behavior remains intact.

## Export privacy / trust boundary

- WebM metadata repair occurs entirely in the browser.
- The helper script is embedded in the standalone HTML; no runtime CDN/request is used.
- CSP remains `connect-src 'none'`.
- Saved media contains video only; microphone audio is never requested.

## Browser behavior

Core Practice requires WebCodecs. Review saving additionally requires Canvas `captureStream()`, `MediaRecorder`, and a supported WebM MediaRecorder MIME type.

If seekable WebM save is unavailable, Review remains usable and only Save is disabled.

## Release assets

- `assets/favicon.svg` — canonical icon/favicon source.
- `assets/screenshot.png` — Japanese desktop.
- `assets/screenshot-en.png` — English desktop.
- `assets/screenshot-mobile.png` — Japanese mobile.
- `assets/screenshot-mobile-en.png` — English mobile.

## v0.9.0 acceptance criteria

1. Version is consistently v0.9.0.
2. Approved SVG remains canonical favicon/header icon.
3. Review playback has 0.25x / 0.5x / 1x / 2x.
4. Seek/Play/Frame-step do not restart a VideoDecoder from a delta frame.
5. Review video + seek bar fit in one viewport for normal desktop and smartphone Review layouts.
6. Smartphone Practice tools panel starts collapsed.
7. Fullscreen video is horizontally centered and controls align with it.
8. Review Save produces WebM with repaired duration metadata.
9. `fix-webm-duration` is exact-version pinned and lock-verified.
10. `connect-src 'none'` and `audio:false` remain intact.
11. Reliability and Accessibility regression contracts pass.
12. Review maximum defaults to 10 seconds, validates 10–180, persists locally, and restores on reload.
13. Review can be entered after about 10 seconds even when a longer maximum is configured.
14. History retention is bounded to the configured Review maximum plus key-frame margin and does not duplicate packet payloads when freezing Review.
15. Standalone/self-extract builds and PR Preview pass.

## v1.0.0 gate

Complete `RELEASE_CHECKLIST.md`, `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`, and `RELIABILITY_TEST_MATRIX.md`, then promote only if no Critical/High issue remains in the main practice loop.
