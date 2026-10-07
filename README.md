# Practice Mirror

A local-first delayed camera mirror for sports, dance, training, and other self-practice.

> v0.7.0 focuses on reliability: generation-safe media callbacks, bounded queues, background/resume handling, camera/codec recovery, and Review failure isolation.

## Features

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay
- Adaptive processing profiles from 720p/30fps down to 360p/12fps targets
- Front/rear camera switching on multi-camera devices
- Fixed previous-10-second Review
- 0.25x / 0.5x / 1x playback, seek, and frame stepping
- Draggable guides and Mirror display
- Local Review clip saving with editable filename
- Fullscreen and optional Screen Wake Lock
- Mobile Practice auto-hide and short-landscape layout
- Bounded live/history queues
- Live camera/codec stall watchdog
- Limited automatic live recovery
- Background / foreground suspend-resume behavior
- Review-only decoder recovery and degraded-safe fallback
- Session reliability diagnostics
- Japanese / English UI
- No microphone request
- CSP blocks runtime external connections
- Single-HTML builds

## Reliability behavior

Practice Mirror does not try to hide every failure.

For recoverable live issues it:

1. invalidates the old media generation,
2. clears stale delayed buffers,
3. attempts a bounded recovery,
4. returns through Warm-up.

Automatic live recovery is limited to two attempts per minute. Repeated failure becomes a normal error instead of an endless reconnect loop.

Review decoder failures are isolated from the camera session. One Review-only recovery is attempted; after repeated failure, broken Review controls are disabled while **Back to Practice** remains available.

When the page is backgrounded, live media processing is suspended and Wake Lock is released. Foreground Practice restarts from a fresh Warm-up. A frozen Review is preserved where possible.

## Memory bounds

The app does not retain a raw-frame history.

- delayed video is compressed,
- Review history is time-bounded and packet-count bounded,
- live delay queue growth beyond the expected delay margin triggers recovery,
- Review clips are fixed-duration,
- export Blob URLs are temporary.

## Privacy

Camera media and reliability data stay local.

Practice Mirror does not upload or persist:

- camera frames,
- Review media,
- recovery counters,
- queue sizes,
- performance windows,
- device capability hints,
- camera IDs or labels.

CSP uses `connect-src 'none'`, and microphone audio is never requested.

## Validation

Static CI cannot prove a 60-minute real-camera session.

Before release, complete [RELIABILITY_TEST_MATRIX.md](./RELIABILITY_TEST_MATRIX.md), including long-session, repeated Review, camera switching, background/resume, export, memory, and resource-release checks.

## Browser support

Core delayed Practice requires camera access, `requestVideoFrameCallback()`, and WebCodecs.

Optional features use Fullscreen, Screen Wake Lock, multiple camera inputs, Canvas `captureStream()`, and `MediaRecorder`.

## Limitations in v0.7.0

- real-device long-session matrix is still pending
- adaptive thresholds still need broader hardware tuning
- no audio recording
- no AI / pose estimation

## Single HTML / offline behavior

The build produces `dist/index.html`, `practice-mirror.html`, and `dist/index.self-extract.html`. No third-party runtime library is used.

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
