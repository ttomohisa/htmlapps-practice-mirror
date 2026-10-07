# Security and privacy

Practice Mirror v1.0.0 processes camera frames, Review playback, reliability state, and clip export locally in the browser.

## Trust boundary

- Camera access is requested only after **Start camera**.
- Audio is never requested or exported.
- Camera frames and encoded chunks remain in memory and are not automatically persisted.
- Review keeps a bounded compressed snapshot rather than raw-frame history.
- Live and Review media queues have time / packet bounds.
- A file is generated only after **Save Review clip**.
- Export uses temporary browser-local media objects and revokes the temporary Blob URL.
- Guide lines are DOM overlays and are not included in exported video.
- Mirror is a display transform and is not included in exported video.
- Camera switching stores no device ID or device label.
- CSP uses `connect-src 'none'`.
- The app has no runtime API, analytics, telemetry, CDN, external font, or media upload.
- `fix-webm-duration` 1.0.6 is exact-version pinned, hash-locked, embedded at build time, and loaded only from a local Blob URL during explicit Review export.

## Reliability data

The following values may exist transiently in memory:

- last encoded/rendered progress timestamps,
- recovery-attempt counters,
- queue pressure/counts,
- Review recovery state,
- background/suspended state,
- adaptive performance counters.

They are used only for local runtime recovery and diagnostics.

They are not written to localStorage, included in saved video, or sent over the network.

## Background behavior

When hidden, the app releases Wake Lock and suspends active encoding/decoding.

A browser may keep the existing camera track alive or end it. On foreground resume the app reuses a live track when available, otherwise it may request the same generic camera-facing preference again.

A frozen Review can remain in memory across a temporary background suspension. Closing/leaving the page performs cleanup.

## Accessibility state

Accessibility-only runtime values such as input modality, live-region message text, focus bookkeeping, and auto-hide tabindex backups exist only in the page session.

They are not persisted, transmitted, or derived from camera content.

## Local preferences

The app may store:

- language,
- delay seconds,
- generic `user` / `environment` camera preference,
- Mirror preference,
- Screen Wake Lock preference.

It does not automatically store media, reliability counters, device identifiers, output filenames, or guide positions.

## Reporting a security issue

Use the repository's private security reporting mechanism when available. Do not publish sensitive exploit details in a public issue before a fix is available.
