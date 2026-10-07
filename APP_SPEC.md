# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.4.0  
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice. It removes the repeated “record → stop → find → replay” loop by continuously showing the camera feed a few seconds late and, when needed, freezing the previous few seconds for detailed Review.

Core loop:

```text
Move → see the movement a few seconds later → Review if needed → save only if needed → adjust → move again
```

Practice Mirror is not a video editor, sports scoring system, medical device, or cloud coaching service.

## Product principles

- No account or installation.
- Camera frames stay in the browser.
- No runtime CDN, API, analytics, telemetry, or media upload in the standalone app.
- Smartphone is a first-class target.
- Keep practice controls minimal and close to the video.
- Prefer stable delayed playback over higher resolution or feature count.
- Long-lived video buffers use compressed chunks rather than raw frame history.
- Saving is explicit and limited to the frozen Review clip.

## Current scope — v0.4.0 Save Clip

v0.4.0 retains delayed Practice, Review, frame stepping, guides, and Mirror from v0.3.0 and adds local Review clip export.

### Review clip save

- Saving is available only in Review.
- The output filename is editable before export.
- The app prefers a browser-supported MP4 MediaRecorder type.
- When MP4 is unavailable, the app falls back to a supported WebM MediaRecorder type.
- Saving uses browser-native `MediaRecorder` plus `HTMLCanvasElement.captureStream()`; no runtime dependency is downloaded.
- The frozen Review packets are decoded locally into a separate export Canvas.
- Export runs at normal clip timing because MediaRecorder timestamps are wall-clock based.
- A 10-second Review therefore takes roughly 10 seconds to create.
- Export progress is shown while the file is being created.
- Only video is exported; audio is never requested or written.
- Guide lines are DOM overlays and are not baked into the saved clip.
- Mirror is a display-only CSS transform and is not baked into the saved clip.
- The export Canvas and MediaStream are temporary and released after export.
- The resulting Blob URL is temporary, used only to trigger the explicit user download, and revoked afterward.
- If no suitable MediaRecorder container is supported, Review remains usable and Save is disabled with a clear explanation.

### Delayed Practice

- User-initiated camera permission request.
- Rear-camera preference where `facingMode: environment` is supported.
- 5 second delay preset.
- 10 second delay preset (default).
- `getUserMedia()` capture with `audio: false`.
- `requestVideoFrameCallback()` + `VideoFrame` capture.
- WebCodecs encoding with H.264 preference and VP8 fallback.
- Timestamp-based compressed delay queue.
- WebCodecs decoding to Canvas.
- Explicit warm-up, permission, unsupported-codec, and runtime-error states.
- Japanese / English UI in one HTML.

### Review

- Review becomes available only after a complete 10-second compressed history exists.
- Selecting Review freezes up to the previous 10 seconds.
- New camera frames cannot mutate a frozen Review clip.
- Review supports play, pause, seek, 0.25x, 0.5x, and 1x playback.
- Review supports previous-frame and next-frame controls.
- Frame stepping pauses playback and seeks by the measured frame interval.
- Review seeking and frame stepping restart decoding from the nearest prior keyframe; the app does not retain a raw-frame history.
- Returning to Practice discards Review media and rebuilds the delayed buffer while reusing the live camera stream when possible.

### Guides and Mirror

- Multiple vertical and horizontal guides may be added, dragged, keyboard-adjusted, individually removed, or cleared with Undo.
- Guides remain in screen coordinates.
- Mirror horizontally flips only the rendered Canvas.
- Encoded media data is unchanged by guides or Mirror.

### Not included in v0.4.0

- Front / rear camera switch UI.
- Wake Lock.
- Fullscreen.
- Adaptive quality.
- AI / pose estimation.
- Audio recording.
- Guide or Mirror burn-in during export.

## State model

```text
IDLE
  ↓ Start camera
REQUESTING_CAMERA
  ↓ camera + codec ready
WARMING_UP
  ↓ delayed output begins
PRACTICE
  ↓ Review
REVIEW_PREPARING
  ↓ snapshot fixed + decoder ready
REVIEW
  ├─ Save Review clip → EXPORTING → REVIEW
  └─ Back to practice → WARMING_UP
```

Stopping or leaving the page releases camera/media state. A background/page-hide during export cancels the in-progress export rather than leaving hidden media work running.

## Save pipeline

```text
Frozen compressed Review packets
  ↓
temporary VideoDecoder
  ↓
temporary export Canvas
  ↓ captureStream()
browser MediaRecorder
  ↓
MP4 when supported / WebM fallback
  ↓
Blob
  ↓
user-initiated download
```

The export pipeline does not reuse the visible Canvas. This prevents CSS Mirror and DOM guide overlays from being accidentally baked into the file.

## Video pipeline

```text
getUserMedia()
  ↓
HTMLVideoElement
  ↓ requestVideoFrameCallback()
VideoFrame
  ↓
VideoEncoder
  ├─ delayed playback queue
  └─ bounded compressed history
        ↓
VideoDecoder
  ↓
Canvas
  ↓
optional CSS mirror transform
  ↓
DOM guide overlay
```

Rules:

- Do not retain raw RGBA frame history.
- Close captured and decoded `VideoFrame` objects when no longer needed.
- Target a keyframe at least every 2 seconds.
- Apply encoder backpressure.
- Delay timing uses monotonic timestamps.
- Keep approximately 14 seconds of compressed history so Review can include a valid keyframe before its visible 10-second range.

## Privacy and persistence

May persist:

- language,
- selected delay preset,
- Mirror preference.

Must not persist automatically:

- frames,
- encoded video chunks,
- Review clips,
- guides,
- screenshots,
- output filename,
- camera labels,
- derived biometric / pose data.

A clip file is created only after the user presses the explicit Review save button.

## Accessibility

- Keyboard-operable buttons and range input.
- Visible focus.
- SVG icons instead of emoji controls.
- Guide lines expose slider semantics and keyboard movement.
- Save filename has a visible label and predictable extension.
- Save is disabled while export is running.
- Help dialog closes with its close button, Escape, and backdrop interaction.
- Reduced-motion preference respected.
- Smartphone controls remain close to the video.

## v0.4.0 acceptance criteria

1. v0.3.0 Practice, Review, frame stepping, guides, and Mirror behavior remain functional.
2. Review exposes an editable output filename.
3. The chosen file extension is shown separately from the editable filename.
4. MP4 is preferred when supported by MediaRecorder; otherwise a supported WebM type is selected.
5. Saving a Review produces a non-empty local video file.
6. Export contains no audio.
7. Guide lines and CSS Mirror are not baked into the saved file.
8. Export progress is visible and conflicting Review/Stop actions are disabled while export is active.
9. Unsupported export environments keep Review usable and clearly disable Save.
10. Temporary export decoder, stream, and Blob URL are released after use.
11. Camera and Review media are never uploaded.
12. Japanese and English controls fit at smartphone width without horizontal scrolling.
13. Readable and self-extracting standalone builds are generated from source rather than manually edited.

## Validation note

Real-camera and actual saved-file playback remain device validation gates. Verify on actual supported devices:

- 720p / target 30fps / 10 second delay,
- at least 10 minutes continuous Practice,
- repeated Practice → Review → Practice transitions,
- repeated seeks and frame steps,
- MP4 output where reported supported,
- WebM fallback where MP4 is not supported,
- saved file duration approximately matches Review duration,
- saved file opens in the platform's normal video player,
- output filename edits are respected,
- guides and Mirror are not present in the saved file,
- no memory growth proportional to total session duration,
- Stop releases the camera.

## Development roadmap

### v0.1.0 — Core Delay Mirror
Stable 5 / 10 second delayed playback and capability / error handling.

### v0.2.0 — Review
Freeze the previous 10 seconds for play / pause / seek and return safely to practice.

### v0.3.0 — Frame Review & Guides
0.25x playback, frame stepping, draggable horizontal / vertical guides, and mirror display.

### v0.4.0 — Save Clip
Save only the frozen Review clip locally with runtime MP4 / WebM capability detection.

### v0.5.0 — Practice UX
3 / 5 / 10 / 15 second presets, custom delay, camera switching, fullscreen, Wake Lock, control auto-hide, orientation polish.

### v0.6.0 — Adaptive Performance
Runtime capability tiers, FPS / queue monitoring, adaptive frame rate, adaptive resolution.

### v0.7.0 — Reliability
Long-session, repeated transition, lifecycle, and memory regression testing.

### v0.8.0 — Mobile Polish & Accessibility
Mobile / tablet / desktop polish, keyboard access, focus states, final Japanese / English UI.

### v0.9.0 — Release Candidate
Browser Kitty integration checks, CSP / privacy audit, README, screenshots, icon, and production build review.

### v1.0.0 — Practice Mirror
Stable `Move → delayed view → Review → adjust → move again` loop ready for public release.
