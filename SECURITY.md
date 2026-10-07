# Security and privacy

Practice Mirror v0.5.0 processes camera frames, Review playback, and clip export locally in the browser.

## Trust boundary

- Camera access is requested only after **Start camera**.
- Audio is never requested or exported.
- Camera frames and encoded chunks remain in memory and are not automatically persisted.
- Review keeps a bounded compressed snapshot rather than raw-frame history.
- A file is generated only after **Save Review clip**.
- Export uses temporary browser-local media objects and revokes the temporary Blob URL.
- Guide lines are DOM overlays and are not included in exported video.
- Mirror is a display transform and is not included in exported video.
- Camera switching stores no device ID or device label.
- The app has no runtime API, analytics, telemetry, CDN, external font, or media upload.
- CSP uses `connect-src 'none'`.

## Local preferences

The app may store:

- language,
- delay seconds,
- generic `user` / `environment` camera preference,
- Mirror preference,
- Screen Wake Lock preference.

It does not automatically store media content, device identifiers, output filenames, or guide positions.

## Reporting a security issue

Use the repository's private security reporting mechanism when available. Do not publish sensitive exploit details in a public issue before a fix is available.
