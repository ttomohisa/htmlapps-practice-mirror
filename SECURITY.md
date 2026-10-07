# Security and privacy

Practice Mirror v0.4.0 processes camera frames, Review playback, and clip export locally in the browser.

## Trust boundary

- Camera access is requested only after the user selects **Start camera**.
- Audio is never requested or exported.
- Camera frames and encoded chunks remain in memory and are not persisted automatically.
- Review keeps only a bounded compressed snapshot; it does not create a raw-frame history.
- A file is generated only after the user explicitly selects **Save Review clip**.
- Export uses a temporary Canvas, temporary MediaStream, temporary VideoDecoder, and browser-native MediaRecorder.
- The temporary export Blob URL is revoked after triggering the local download.
- Guide lines are DOM overlays and are not included in exported video.
- Mirror is a display transform and is not included in exported video.
- The app has no runtime API, analytics, telemetry, CDN, external font, or media upload.
- CSP uses `connect-src 'none'`.
- Only language, delay, and Mirror preferences are stored in localStorage.
- Output filename and guide positions are not persisted.

## Reporting a security issue

Please use the repository's private security reporting mechanism when available. Do not publish sensitive exploit details in a public issue before a fix is available.
