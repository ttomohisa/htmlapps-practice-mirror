# Offline / local-processing verification

Practice Mirror is intended to run without runtime network access after the HTML file has loaded.

## Static checks

- Confirm the generated HTML contains `connect-src 'none'`.
- Confirm it contains no external `<script src>`, stylesheet link, font URL, image URL, fetch call, XHR, WebSocket, EventSource, analytics, or telemetry endpoint.
- Confirm `dependencies.json` is empty.
- Confirm camera capture uses `audio: false`.

## Runtime checks

1. Build `dist/index.html`.
2. Open browser DevTools > Network.
3. Load the HTML from a trusted local/HTTPS environment that permits camera access.
4. Start the camera and let the delay view run.
5. Confirm no application network requests occur after the initial document load.
6. Enter Review and test 0.25x / 0.5x / 1x playback, seek, previous frame, and next frame.
7. Add and drag vertical / horizontal guides, then keyboard-adjust and delete one.
8. Toggle Mirror in both Practice and Review; confirm guides remain at the same screen positions.
9. Clear guides and verify Undo restores them.
10. Return to Practice and confirm the delay buffer warms up again without another camera permission prompt.
11. Stop and confirm the camera indicator turns off.

Camera permission behavior for `file://` differs by browser. A local HTTPS/localhost test environment may be required for camera access even though the application itself has no runtime server dependency.
