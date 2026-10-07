# Security and privacy

Practice Mirror v0.1.0 processes camera frames locally in the browser.

## Trust boundary

- Camera access is requested only after the user selects **Start camera**.
- Audio is never requested.
- Camera frames and encoded chunks remain in memory and are not persisted automatically.
- The app has no runtime API, analytics, telemetry, CDN, external font, or media upload.
- CSP uses `connect-src 'none'`.
- Only language and delay preferences are stored in localStorage.

## Reporting a security issue

Please use the repository's private security reporting mechanism when available. Do not publish sensitive exploit details in a public issue before a fix is available.
