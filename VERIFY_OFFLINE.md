# Offline / local-processing verification

Practice Mirror must perform delayed video, Review, export, adaptive performance, and reliability recovery without runtime network access.

## Static checks

- generated HTML contains `connect-src 'none'`
- no external runtime script/style/font/API dependency
- `dependencies.json` remains empty
- camera capture uses `audio: false`
- no fetch/XHR/WebSocket/EventSource/telemetry endpoint
- camera IDs/labels are not persisted
- reliability/performance counters are not persisted
- Review/live buffers are bounded in source logic
- background lifecycle has no server dependency

## Runtime checks

1. Build `dist/index.html`.
2. Open DevTools Network.
3. Start Practice and confirm no runtime application request.
4. Enter Review, export, switch camera, rotate, use Fullscreen, and background/resume.
5. Confirm no network request is introduced by recovery paths.
6. Confirm background Practice returns through a new Warm-up rather than stale delayed frames.
7. Confirm background Review can resume its frozen clip where supported.
8. Confirm Stop releases camera and Wake Lock.
9. Confirm no reliability/performance key is added to localStorage.
10. Complete the real-device cases in `RELIABILITY_TEST_MATRIX.md`.

Static/CI verification does not replace long-session camera testing.
