# Practice Mirror

A local-first delayed camera mirror for sports, dance, training, and other self-practice.

> v0.5.0 expands the Practice workflow with 1–30 second delay settings, camera switching, fullscreen, Screen Wake Lock, auto-hiding controls, and a landscape-focused mobile layout.

## Features

- 3 / 5 / 10 / 15 second delay presets
- Custom delay from 1 to 30 seconds
- Rear-camera preference and front/rear switching on multi-camera devices
- Fixed previous-10-second Review
- Play / pause / seek and 0.25x / 0.5x / 1x playback
- Previous-frame / next-frame controls
- Draggable vertical and horizontal guides
- Keyboard guide adjustment and deletion
- Mirror display
- Fullscreen workspace
- Optional Screen Wake Lock
- Practice controls that auto-hide on appropriate mobile/fullscreen layouts
- Two-column short-landscape mobile layout
- Editable Review output filename
- MP4-preferred / WebM-fallback local clip saving
- Japanese / English UI
- No microphone request
- Runtime CSP blocks external connections
- Readable and self-extracting standalone HTML builds

## Usage

1. Choose 3, 5, 10, or 15 seconds, or enter a custom delay from 1 to 30 seconds.
2. Select **Start camera** and allow camera access.
3. After warm-up, practice while the display shows the selected delay.
4. Use **Switch camera**, **Fullscreen**, **Keep screen awake**, guides, or **Mirror** when useful.
5. On mobile Practice, controls may hide automatically; tap/interact with the video to show them again.
6. Select **Review** after enough history is available.
7. Inspect the previous 10 seconds using slow playback, seek, or frame stepping.
8. Save the Review clip locally if needed.
9. Select **Back to practice** to rebuild the delay buffer.

## Privacy

Camera frames, Review, and clip creation stay in the browser.

Practice Mirror does not:

- upload video,
- send camera frames to an API,
- request microphone audio,
- automatically save video,
- send analytics or telemetry.

CSP uses `connect-src 'none'`.

Local settings may store language, delay, generic front/rear camera preference, Mirror preference, and Wake Lock preference. Device IDs, device labels, media buffers, Review clips, and guide positions are not persisted automatically.

## Browser support

Core Practice / Review requires:

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- a supported H.264 or VP8 WebCodecs pair

Optional capabilities:

- Fullscreen API
- Screen Wake Lock API
- multiple `videoinput` devices for camera switching
- Canvas `captureStream()` + `MediaRecorder` for Review saving

Unsupported optional capabilities are disabled without disabling the core delayed mirror.

## Limitations in v0.5.0

Not yet included:

- adaptive frame rate / resolution
- long-session reliability completion
- audio recording
- guide / Mirror burn-in
- AI / pose estimation

## Single HTML / offline behavior

The build produces:

```text
dist/index.html
practice-mirror.html
dist/index.self-extract.html
```

No third-party runtime library is used.

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
