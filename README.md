# Practice Mirror

[![GitHub Pages](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Single HTML](https://img.shields.io/badge/distribution-single%20HTML-16624F)](practice-mirror.html)

[日本語版 README](README.ja.md)

A privacy-focused delayed camera mirror for sports, dance, training, and other self-practice. Practice Mirror shows the camera a few seconds late so you can finish a movement, look back at the screen, and immediately see what you actually did.

## Screenshot

[![Practice Mirror screenshot](assets/screenshot-en.png)](practice-mirror.html)

Mobile screenshot: [assets/screenshot-mobile-en.png](assets/screenshot-mobile-en.png)

## Features

- **Delayed mirror** — 3 / 5 / 10 / 15 second presets or a custom 1–30 second delay.
- **Previous-10-second Review** — Freeze the movement you just made without a normal record/stop workflow.
- **Detailed inspection** — 0.25x / 0.5x / 1x playback, seeking, and frame stepping.
- **Alignment guides** — Add draggable vertical/horizontal guides; keyboard users can move them with Arrow keys.
- **Mirror display** — Flip the displayed image without modifying encoded media.
- **Explicit local save** — Save only the frozen Review clip. MP4 is preferred where supported; WebM is the fallback.
- **Practice UX** — Camera switching, Fullscreen, optional Screen Wake Lock, mobile auto-hide, and short-landscape layout.
- **Adaptive / reliable processing** — Sustained load can reduce processing quality, buffers remain bounded, and limited recovery handles recoverable camera/codec failures.
- **Japanese / English UI** — Both languages are included in the same standalone HTML.
- **Local processing** — Camera frames, Review media, guides, performance counters, and reliability state stay in the browser.

## Usage

1. Choose the delay.
2. Select **Start camera** and allow camera access.
3. Wait for Warm-up.
4. Practice while the screen shows the selected delay.
5. Select **Review** after enough history is available.
6. Inspect the frozen clip with slow playback, seek, or frame stepping.
7. Save the clip only if you want to keep it.
8. Select **Back to practice** to rebuild the delayed buffer.
9. Select **Stop** when finished.

## Privacy

The standalone app does not upload camera video and does not request microphone audio.

- CSP contains `connect-src 'none'`.
- No external runtime scripts, styles, or fonts are loaded.
- No application analytics or telemetry are sent.
- Media is not persisted automatically.
- Temporary Blob URLs are used only for explicit local export and are revoked.

## Browser requirements

Core delayed Practice requires a secure camera context plus `getUserMedia()`, `requestVideoFrameCallback()`, `VideoFrame`, `VideoEncoder`, `VideoDecoder`, and a supported H.264 or VP8 WebCodecs pair.

Optional capabilities include Fullscreen, Screen Wake Lock, multiple video inputs, Canvas `captureStream()`, and `MediaRecorder`.

## Standalone build

The build generates:

- `dist/index.html`
- `practice-mirror.html`
- `dist/index.self-extract.html`

`practice-mirror.html` is byte-identical to the readable standalone build.

## v0.9.0 Release Candidate

Feature work is frozen. The release candidate focuses on packaging, screenshots, Japanese/English UI, CSP/runtime networking, camera/save error states, mobile/accessibility, and long-session reliability.

Release gates:

- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](MOBILE_ACCESSIBILITY_TEST_MATRIX.md)
- [RELIABILITY_TEST_MATRIX.md](RELIABILITY_TEST_MATRIX.md)

## Limitations

- Core delayed playback requires WebCodecs support.
- MP4 export support varies by browser; WebM is used when appropriate.
- Camera, Wake Lock, Fullscreen, and background behavior differ by browser/OS.
- Long sessions and camera switching consume CPU/battery.
- Audio recording and AI pose estimation are intentionally not included.

## Development

Run the template checks before completion:

    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1

## License

Copyright © 2026 ttomohisa

Licensed under the [MIT License](LICENSE).
