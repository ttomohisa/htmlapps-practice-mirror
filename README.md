# Practice Mirror

A local-first delayed camera mirror for checking sports, dance, and training form without repeatedly recording, stopping, finding, and replaying a clip.

> v0.4.0 adds explicit local saving for the frozen Review clip. MP4 is preferred when the browser supports it; otherwise WebM is used.

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
- Editable Review output filename
- MP4-preferred / WebM-fallback local clip saving
- Save progress and explicit unsupported-save state
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
5. Add guides or enable **Mirror** when useful.
6. Select **Review** after enough history is available.
7. Use slow playback, seek, or frame stepping to inspect the movement.
8. Edit the filename and select **Save Review clip** if you want to keep it.
9. Select **Back to practice** to rebuild the delay buffer and continue.
10. Select **Stop** when finished.

Creating a saved clip takes roughly the duration of the Review because the browser-native recorder runs on wall-clock timing. Guides and mirrored display are not baked into the saved video.

## Privacy

Camera frames, Review playback, and clip creation are processed in the browser.

Practice Mirror does not:

- upload video,
- call an external API,
- request microphone audio,
- automatically save video,
- send analytics or telemetry.

A video file is created only after the explicit save action. The runtime CSP uses `connect-src 'none'`. Only language, delay, and Mirror preferences are stored in localStorage.

## Browser support

Core Practice / Review requires:

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- an H.264 or VP8 encoder/decoder pair supported by WebCodecs

Clip saving additionally requires:

- `HTMLCanvasElement.captureStream()`
- `MediaRecorder`
- at least one supported MP4 or WebM MediaRecorder MIME type

Saving is disabled without those APIs; Review remains available.

## Limitations in v0.4.0

Not yet included:

- Front / rear camera switch UI
- Fullscreen
- Screen Wake Lock
- Adaptive quality
- Audio recording
- Guide / Mirror burn-in
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
