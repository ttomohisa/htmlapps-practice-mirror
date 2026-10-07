# Practice Mirror v0.9.0 — Release Checklist

Do not mark manual/device checks complete unless they were actually tested.

## Repository / packaging

- [ ] app.config/UI/help/footer are v0.9.0.
- [ ] User-approved `assets/favicon.svg` is canonical.
- [ ] Favicon and upper-left app icon use the same SVG.
- [ ] `fix-webm-duration` is pinned at 1.0.6 and lock hash verifies.
- [ ] `dist/index.html` builds.
- [ ] `practice-mirror.html` matches `dist/index.html` byte-for-byte.
- [ ] self-extract build verifies.
- [ ] no unresolved build placeholder remains.

## Runtime privacy / security

- [ ] `connect-src 'none'` is present.
- [ ] camera capture uses `audio:false`.
- [ ] no external runtime script/style/font exists.
- [ ] embedded WebM helper is loaded only from the standalone asset bundle.
- [ ] no application fetch/XHR/WebSocket/EventSource endpoint exists.
- [ ] media is not persisted without explicit save.
- [ ] export Blob URLs are revoked.

## Desktop / mobile / language

- [ ] desktop start screen checked.
- [ ] smartphone portrait checked.
- [ ] short landscape checked.
- [ ] no horizontal page scroll.
- [ ] smartphone Practice tools panel starts closed.
- [ ] fullscreen video is horizontally centered.
- [ ] fullscreen controls align with the video instead of floating at the far edge.
- [ ] Japanese main flow checked.
- [ ] English main flow checked.

## Review

- [ ] whole Review video and seek bar fit in one viewport on desktop.
- [ ] whole Review video and seek bar fit in one viewport on smartphone.
- [ ] 0.25x / 0.5x / 1x / 2x.
- [ ] frame stepping and seeking.
- [ ] Play after Review entry.
- [ ] Play after seek.
- [ ] Play after frame stepping.
- [ ] no `VideoDecoder` key-frame error.
- [ ] Review Save section is collapsed initially.
- [ ] Review clip save produces WebM.
- [ ] saved WebM has finite duration and can be seeked in a normal player.
- [ ] saved clip has no audio.
- [ ] saved clip does not burn in guides/Mirror.

## Camera / Practice

- [ ] camera allow flow.
- [ ] camera deny flow.
- [ ] 3 / 5 / 10 / 15 presets.
- [ ] custom 1 / 30 seconds and invalid values.
- [ ] guides / Mirror.
- [ ] multi-camera switching where available.

## Accessibility / reliability

- [ ] Complete `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`.
- [ ] Complete `RELIABILITY_TEST_MATRIX.md`.

## Release assets

- [ ] current `assets/screenshot.png`.
- [ ] current `assets/screenshot-en.png`.
- [ ] current `assets/screenshot-mobile.png`.
- [ ] current `assets/screenshot-mobile-en.png`.
- [ ] README screenshot references resolve.

## v1.0.0 promotion

Promote only when static checks pass, the required device gates are completed or explicitly excepted, and no Critical/High issue remains.
