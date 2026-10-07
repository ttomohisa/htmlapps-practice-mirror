# Practice Mirror

A local-first delayed camera mirror for sports, dance, training, and other self-practice.

> v0.8.0 focuses on mobile polish and accessibility: larger touch targets, safer narrow/landscape layouts, keyboard-safe auto-hide, focus management, and clearer screen-reader semantics.

## Features

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay
- Adaptive processing and long-session reliability safeguards
- Front/rear camera switching where supported
- Previous-10-second Review
- slow playback, seek, and frame stepping
- draggable / keyboard-adjustable guides
- Mirror display
- local Review clip saving
- Fullscreen and Screen Wake Lock
- mobile Practice auto-hide
- narrow portrait and short-landscape layouts
- 44px-class touch targets for primary controls and guide hit areas
- keyboard-aware auto-hide
- explicit focus transitions between Start / Practice / Review
- dedicated polite status announcements
- Japanese / English accessible names
- no microphone request
- `connect-src 'none'`
- single-HTML builds

## Mobile & accessibility

Practice controls use larger touch targets and smartphone-specific layouts. Guide lines retain thin visuals but use wider draggable hit areas.

When keyboard navigation is active, Practice controls do not auto-hide. Hidden pointer-mode controls are removed from keyboard reach even when the browser does not support `inert`.

Important state transitions use a dedicated status region rather than marking the full app as live content.

Review seek exposes current/total accessible time. Guide sliders expose movement-axis orientation and keyboard shortcuts.

See [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](./MOBILE_ACCESSIBILITY_TEST_MATRIX.md) for the release test matrix.

## Privacy

Camera media, performance data, reliability data, and accessibility state stay local.

The app does not upload video, request microphone audio, or send analytics/telemetry.

## Release validation

Before v1.0.0 complete both:

- [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](./MOBILE_ACCESSIBILITY_TEST_MATRIX.md)
- [RELIABILITY_TEST_MATRIX.md](./RELIABILITY_TEST_MATRIX.md)

## Browser support

Core delayed Practice requires camera access, `requestVideoFrameCallback()`, and WebCodecs.

Optional capabilities include Fullscreen, Screen Wake Lock, multiple camera inputs, Canvas `captureStream()`, and `MediaRecorder`.

## Limitations in v0.8.0

- physical-device accessibility testing is still required
- long-session Reliability matrix is still required
- adaptive thresholds still need broad real-device tuning
- no audio recording
- no AI / pose estimation

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
