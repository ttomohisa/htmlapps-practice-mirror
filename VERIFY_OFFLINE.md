# Offline / local-processing verification

Practice Mirror must perform delayed video, Review, export, adaptive performance, reliability recovery, and accessibility UI behavior without runtime network access.

## Static checks

- generated HTML contains `connect-src 'none'`
- no external runtime script/style/font/API dependency; the WebM duration helper is embedded in the standalone asset bundle
- `fix-webm-duration` is pinned at 1.0.6 and its tarball hash is locked
- camera capture uses `audio: false`
- no analytics / telemetry endpoint
- dedicated `appLiveRegion` exists
- entire workspace is not an aria-live region
- auto-hide has explicit keyboard-focus fallback
- guide hit areas and primary action sizes meet the app's touch-target contract
- custom delay and Review maximum expose aria-invalid / described-by
- Review seek exposes aria-valuetext

## Runtime checks

1. Build `dist/index.html`.
2. Confirm no runtime network request after load.
3. Run Japanese and English Start → Practice → Review → Back flows.
4. Verify mobile portrait and landscape without horizontal scrolling.
5. Verify keyboard navigation does not allow controls to auto-hide.
6. Verify focus transitions out of hidden panels.
7. Verify Help restores focus.
8. Verify custom-delay invalid state and focus.
9. Verify guide keyboard operation.
10. Verify Review seek accessible value text.
11. Save a Review clip and verify the resulting WebM reports a finite duration and can seek in a normal player.
12. Confirm saving does not create any runtime network request.
13. Set Review maximum to 180 seconds, reload, and verify the setting persists without any network request.
14. Verify important state announcements do not spam on every frame/timer tick.
15. Complete `MOBILE_ACCESSIBILITY_TEST_MATRIX.md`.
16. Complete relevant `RELIABILITY_TEST_MATRIX.md` cases.

Static/CI checks do not replace physical-device or screen-reader testing.
