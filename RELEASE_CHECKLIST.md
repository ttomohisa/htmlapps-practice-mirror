# Practice Mirror v0.9.0 — Release Checklist

Do not mark manual/device checks complete unless they were actually tested.

## Repository / packaging

- [ ] app.config/UI/help/footer are v0.9.0.
- [ ] User-approved `assets/favicon.svg` is canonical.
- [ ] Favicon and upper-left app icon use the same SVG.
- [ ] `dist/index.html` builds.
- [ ] `practice-mirror.html` matches `dist/index.html` byte-for-byte.
- [ ] self-extract build verifies.
- [ ] no unresolved build placeholder remains.

## Runtime privacy / security

- [ ] `connect-src 'none'` is present.
- [ ] camera capture uses `audio:false`.
- [ ] no external runtime script/style/font exists.
- [ ] no application fetch/XHR/WebSocket/EventSource endpoint exists.
- [ ] media is not persisted without explicit save.
- [ ] export Blob URLs are revoked.

## Desktop / mobile / language

- [ ] desktop start screen checked.
- [ ] smartphone portrait checked.
- [ ] short landscape checked.
- [ ] no horizontal page scroll.
- [ ] Japanese main flow checked.
- [ ] English main flow checked.
- [ ] Help/error/unsupported states checked in both languages.

## Camera / Review / save

- [ ] camera allow flow.
- [ ] camera deny flow.
- [ ] 3 / 5 / 10 / 15 presets.
- [ ] custom 1 / 30 seconds and invalid values.
- [ ] Review availability and entry.
- [ ] 0.25x / 0.5x / 1x.
- [ ] frame stepping and seeking.
- [ ] guides / Mirror.
- [ ] multi-camera switching where available.
- [ ] Review clip save.
- [ ] saved clip has no audio.
- [ ] saved clip does not burn in guides/Mirror.

## Accessibility / reliability

- [ ] Complete `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`.
- [ ] Complete `RELIABILITY_TEST_MATRIX.md`.

## Release assets

The four screenshot files below were regenerated from the v0.9.0 standalone build by the pinned Playwright capture workflow and visually reviewed before this final RC validation pass.


- [ ] current `assets/screenshot.png`.
- [ ] current `assets/screenshot-en.png`.
- [ ] current `assets/screenshot-mobile.png`.
- [ ] current `assets/screenshot-mobile-en.png`.
- [ ] README screenshot references resolve.

## v1.0.0 promotion

Promote only when static checks pass, the required device gates are completed or explicitly excepted, and no Critical/High issue remains.
