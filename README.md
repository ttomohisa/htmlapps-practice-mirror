# Practice Mirror

A local-first delayed camera mirror for checking sports, dance, and training form without repeatedly recording, stopping, finding, and replaying a clip.

> v0.3.0 adds frame-focused Review controls, movable guides, and display mirroring. Clip saving and camera switching are later milestones.

## Features

- 5 and 10 second delayed camera view
- Freeze up to the previous 10 seconds in Review
- Play / pause / seek
- 0.25x / 0.5x / 1x Review playback
- Previous-frame / next-frame controls
- Draggable vertical and horizontal guides
- Keyboard guide adjustment and deletion
- Clear-all guides with Undo
- Optional mirrored display without modifying encoded video
- Rear-camera preference
- Runtime H.264 / VP8 capability selection
- WebCodecs-compressed bounded in-memory video queues
- Japanese / English UI
- No microphone request
- CSP blocks runtime network access
- Readable standalone HTML plus gzip self-extracting HTML build

## Usage

1. Choose a 5 or 10 second delay.
2. Select **Start camera** and allow camera access.
3. Wait for the selected delay to buffer.
4. Practice while the screen shows the camera feed a few seconds late.
5. Add vertical / horizontal guides or enable **Mirror** when useful.
6. Select **Review** after enough history is available.
7. Use slow playback, seek, or the frame buttons to inspect the movement.
8. Select **Back to practice** to rebuild the delay buffer and continue.
9. Select **Stop** when finished.

Guide lines can be dragged. When focused, Arrow keys move a guide, Shift + Arrow moves farther, Home / End moves to an edge, and Delete / Backspace removes it.

## Privacy

Camera frames and Review video are processed in the browser.

Practice Mirror does not:

- upload video,
- call an external API,
- request microphone audio,
- automatically save video,
- send analytics or telemetry.

The runtime CSP uses `connect-src 'none'`. Only language, delay, and Mirror preferences are stored in localStorage. Guide positions and media buffers are session-only.

## Browser support

Required APIs:

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- an H.264 or VP8 encoder/decoder pair supported by WebCodecs

The app reports missing capabilities instead of silently failing.

## Limitations in v0.3.0

Not yet included:

- Clip saving
- Front / rear camera switch UI
- Fullscreen
- Screen Wake Lock
- Adaptive quality
- AI / pose estimation

## Single HTML / offline behavior

The build produces:

```text
dist/index.html
practice-mirror.html
dist/index.self-extract.html
```

`dist/index.html` and `practice-mirror.html` are byte-identical. No third-party runtime library is used.

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
