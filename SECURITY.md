# Security and privacy

Practice Mirror v0.3.0 processes camera frames and Review video locally in the browser.

## Trust boundary

- Camera access is requested only after the user selects **Start camera**.
- Audio is never requested.
- Camera frames and encoded chunks remain in memory and are not persisted automatically.
- Review keeps only a bounded compressed snapshot; it does not create a raw-frame history.
- Guide lines are DOM overlays and are not analyzed or sent anywhere.
- Mirror is a display transform on the Canvas and does not modify encoded video data.
- The app has no runtime API, analytics, telemetry, CDN, external font, or media upload.
- CSP uses `connect-src 'none'`.
- Only language, delay, and Mirror preferences are stored in localStorage.
- Guide positions are not persisted in v0.3.0.

## Reporting a security issue

Please use the repository's private security reporting mechanism when available. Do not publish sensitive exploit details in a public issue before a fix is available.
