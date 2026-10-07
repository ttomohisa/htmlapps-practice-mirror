# Offline / local-processing verification

Practice Mirror must perform delayed video, Review, export, and adaptive performance decisions without runtime network access.

## Static checks

- generated HTML contains `connect-src 'none'`
- no external runtime script/style/font/API dependency
- `dependencies.json` remains empty
- camera capture uses `audio: false`
- adaptive performance code has no fetch/XHR/WebSocket/EventSource/telemetry endpoint
- device capability hints are not persisted
- camera IDs and labels are not persisted

## Runtime checks

1. Build `dist/index.html`.
2. Open DevTools Network and verify no application runtime request after initial load.
3. Start Practice at 3s, 10s, and 30s delays.
4. Confirm Technical details shows processing quality and performance status.
5. On a normal device, confirm stable operation does not randomly downgrade from one isolated slow moment.
6. With CPU throttling or a deliberately constrained test environment, sustain load for multiple 4-second windows.
7. Confirm the first downgrade changes target processing from 30fps to 20fps without restarting Warm-up.
8. Continue sustained load and confirm a later downgrade may restart Warm-up while requesting lower resolution.
9. If possible, test a camera that rejects `applyConstraints()`; confirm the session continues at reduced software FPS.
10. Confirm adaptation never automatically raises quality during the same session.
11. Switch camera after an adaptive downgrade.
12. Enter Review, use frame stepping/guides/Mirror, and save a Review clip after adaptation.
13. Rotate portrait ↔ landscape and test Fullscreen and Wake Lock.
14. Stop and confirm camera and Wake Lock are released.
15. Confirm no performance sample or hardware hint is written to localStorage.

Real-device threshold tuning remains required; passing static/CI checks alone does not prove performance behavior across phones.
