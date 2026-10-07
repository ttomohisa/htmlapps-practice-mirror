# Practice Mirror

A local-first delayed camera mirror for checking sports, dance, and training form without repeatedly recording, stopping, finding, and replaying a clip.

> v0.1.0 is a development milestone focused on proving the delayed-playback engine. Review, slow motion, guides, and clip saving are not implemented yet.

## Features

- 5 and 10 second delayed camera view
- Rear-camera preference
- Runtime H.264 / VP8 capability selection
- WebCodecs-compressed in-memory delay queue
- Separate warm-up, permission, unsupported, and runtime-failure states
- Japanese / English UI
- No microphone request
- CSP blocks runtime network access
- Readable standalone HTML plus gzip self-extracting HTML build

## Usage

1. Choose a 5 or 10 second delay.
2. Select **Start camera**.
3. Allow camera access.
4. Wait for the selected delay to buffer.
5. Practice while the screen shows the camera feed a few seconds late.
6. Select **Stop** when finished.

## Privacy

Camera frames are processed in the browser.

v0.1.0 does not:

- upload video,
- call an external API,
- request microphone audio,
- automatically record,
- persist video,
- send analytics or telemetry.

The runtime CSP uses `connect-src 'none'`. Only language and delay preferences are stored in localStorage.

## Browser support

Required APIs:

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- an H.264 or VP8 encoder/decoder pair supported by WebCodecs

The app reports missing capabilities instead of silently failing.

## Limitations in v0.1.0

Not yet included:

- Review mode
- Slow motion
- Frame stepping
- Guides
- Clip saving
- Camera switching UI
- Fullscreen
- Screen Wake Lock

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
