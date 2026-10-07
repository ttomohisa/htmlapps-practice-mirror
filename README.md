# Practice Mirror

A local-first delayed camera mirror for sports, dance, training, and other self-practice.

> v0.6.0 adds adaptive performance. The app monitors sustained browser load and lowers processing FPS/resolution step by step when needed instead of letting a heavy session become unstable.

## Features

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay
- Front/rear camera switching on multi-camera devices
- Fixed previous-10-second Review
- 0.25x / 0.5x / 1x playback, seek, and frame stepping
- Draggable vertical / horizontal guides and Mirror display
- Local Review clip saving with editable filename
- MP4-preferred / WebM-fallback export
- Fullscreen and optional Screen Wake Lock
- Mobile Practice control auto-hide and short-landscape layout
- Capability tier shown in technical diagnostics
- Four-second runtime performance monitoring
- Automatic 30 → 20 → 15 → 12fps load reduction
- Progressive 720p → 540p → 360p target resolution reduction under sustained load
- No automatic upward oscillation during a session
- Japanese / English UI
- No microphone request
- CSP blocks runtime external connections
- Readable and self-extracting standalone HTML builds

## Adaptive performance

Practice Mirror tracks delayed render FPS, encoder/decoder queue pressure, and capture frames skipped by backpressure. It only reduces processing quality after sustained overload across multiple windows.

The first downgrade keeps 720p and reduces the capture cadence from 30fps to 20fps without rebuilding the delay buffer. Further sustained pressure may request 540p/15fps and later 360p/12fps. Resolution changes restart Warm-up because old and new encoded geometry must not be mixed.

If a camera refuses a lower resolution constraint, the app keeps the actual camera geometry and still lowers the software processing FPS.

## Privacy

All performance decisions happen locally.

Practice Mirror does not upload:

- camera video,
- Review clips,
- performance samples,
- hardware capability hints,
- camera IDs or labels.

Broad `hardwareConcurrency` / `deviceMemory` hints may be read once to choose a conservative starting profile. They are not stored or sent anywhere.

CSP uses `connect-src 'none'`, and microphone audio is never requested.

## Browser support

Core delayed Practice requires camera access, `requestVideoFrameCallback()`, and WebCodecs (`VideoFrame`, `VideoEncoder`, `VideoDecoder`).

Optional features use Fullscreen, Screen Wake Lock, multiple camera inputs, Canvas `captureStream()`, and `MediaRecorder`. Missing optional features produce a limited/core capability tier rather than disabling the delayed mirror.

## Limitations in v0.6.0

- adaptive thresholds still require broad real-device tuning
- automatic recovery to a higher profile is intentionally deferred to avoid quality oscillation
- long-session reliability completion is the next milestone
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
