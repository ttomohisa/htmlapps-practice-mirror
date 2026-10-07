# Offline / local-processing verification

Practice Mirror is intended to run without runtime network access after the HTML file has loaded.

## Static checks

- Confirm generated HTML contains `connect-src 'none'`.
- Confirm no external runtime script/style/font/image/API dependency.
- Confirm `dependencies.json` is empty.
- Confirm camera capture uses `audio: false`.
- Confirm clip saving uses browser-local Canvas / VideoDecoder / MediaRecorder / Blob APIs.
- Confirm camera switching stores only generic facing preference, not device IDs.

## Runtime checks

1. Build `dist/index.html`.
2. Open DevTools > Network.
3. Start with 3 seconds, then test presets 5 / 10 / 15.
4. Test custom values 1 and 30 seconds.
5. Confirm invalid values such as 0, 31, blank, and non-integer input cannot start as entered.
6. On a multi-camera phone, switch rear → front → rear and confirm each switch restarts warm-up.
7. Confirm single-camera environments keep Switch camera disabled.
8. Enter and exit fullscreen.
9. Toggle Screen Wake Lock and confirm Stop releases it.
10. On a smartphone, wait for Practice controls to auto-hide, then tap the video to restore them.
11. Rotate portrait ↔ landscape and verify there is no horizontal page scroll or covered control.
12. Enter Review and test slow playback, seek, frame stepping, guides, and Mirror.
13. Save a Review clip and open it in a normal player.
14. Confirm no audio, guide overlay, or Mirror transform is present in the saved file.
15. Confirm no application network requests occur after initial document load.
16. Stop and confirm camera use ends.

Camera permission behavior for `file://` differs by browser. A local HTTPS/localhost environment may be required for camera access even though the app itself has no runtime server dependency.
