# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.3.0  
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice. It removes the repeated “record → stop → find → replay” loop by continuously showing the camera feed a few seconds late and, when needed, freezing the previous few seconds for detailed Review.

Core loop:

```text
Move → see the movement a few seconds later → Review if needed → adjust → move again
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

## Current scope — v0.3.0 Frame Review & Guides

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

### Guides

- Users can add multiple vertical and horizontal guides over the video.
- Guides are separate DOM overlays; they are not burned into video frames.
- Guides can be dragged directly with pointer/touch input.
- A focused guide can be adjusted with arrow keys.
- Shift + Arrow moves a guide in larger steps.
- Home / End moves a guide to an edge.
- Delete / Backspace removes the focused guide.
- Clear Guides removes all guides and provides Undo through the canonical toast.
- Guides stay in screen coordinates when the video display is mirrored.
- Guide data is session-only in v0.3.0 and is not persisted.

### Mirror display

- A Mirror toggle horizontally flips only the rendered Canvas.
- The underlying encoded video data is unchanged.
- Guide positions remain unchanged because they live in screen coordinates.
- The Mirror preference may be persisted in localStorage.

### Not included in v0.3.0

- Clip saving.
- Front / rear camera switch UI.
- Wake Lock.
- Fullscreen.
- Adaptive quality.
- AI / pose estimation.

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
  ↓ Back to practice
WARMING_UP
  ↓
PRACTICE
```

Stopping or leaving the page releases camera/media state. Fatal processing failures transition to an explicit error state and release the camera.

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
- Apply encoder backpressure; skip capture when the encoder queue is already high.
- Delay timing uses monotonic timestamps derived from `performance.now()`.
- Keep approximately 14 seconds of compressed history so Review can include a valid keyframe before its visible 10-second range.

## Review seek / frame step

For a target Review timestamp:

1. Find the nearest keyframe at or before the target.
2. Recreate/reset the Review decoder.
3. Decode sequentially from that keyframe through the target.
4. Keep only the closest decoded candidate frame needed for the target.
5. Render that frame and release it.
6. Continue playback from the corresponding packet index if requested.

Frame stepping uses the measured camera frame interval to choose the next target. It intentionally reuses the seek path so v0.3.0 does not create a decoded-frame cache.

## Codec selection

At runtime check both `VideoEncoder.isConfigSupported()` and `VideoDecoder.isConfigSupported()`.

Preference:

1. H.264 (`avc1.42E01F`) when both encode and decode are available.
2. VP8 when both encode and decode are available.
3. Clear unsupported state when neither pair is available.

## Camera target

Initial constraints:

- audio: false
- facingMode: environment (ideal)
- width: 1280 (ideal)
- height: 720 (ideal)
- frameRate: 30 (ideal / max)

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
- camera labels,
- derived biometric / pose data.

## Accessibility

- Keyboard-operable buttons and range input.
- Visible focus.
- SVG icons instead of emoji controls.
- Icon-only frame buttons have localized accessible names.
- Guide lines expose slider semantics and keyboard movement.
- Help dialog closes with its close button, Escape, and backdrop interaction.
- Reduced-motion preference respected.
- Smartphone controls remain close to the video.

## v0.3.0 acceptance criteria

1. v0.2.0 delayed Practice and fixed Review remain functional.
2. Review supports 0.25x, 0.5x, and 1x playback.
3. Previous-frame and next-frame controls pause Review and render a nearby frame without retaining decoded frame history.
4. Vertical and horizontal guides can be added and dragged.
5. Guides support keyboard adjustment and individual keyboard deletion.
6. Clear Guides removes all lines and offers Undo.
7. Mirror flips only the Canvas display and does not alter encoded Review data.
8. Guides remain in screen coordinates when Mirror is toggled.
9. Guide / Mirror controls remain usable at smartphone width without horizontal page scrolling.
10. Camera and Review media remain local and are not uploaded or persisted.
11. Readable and self-extracting standalone builds are generated from source rather than manually edited.

## Validation note

Real-camera stability remains a release gate. Before release progression, verify on actual supported devices:

- 720p / target 30fps / 10 second delay,
- at least 10 minutes continuous Practice,
- repeated Practice → Review → Practice transitions,
- repeated seeks and frame steps near the beginning, middle, and end,
- 0.25x / 0.5x / 1x playback,
- drag and keyboard guide movement in portrait and landscape,
- Mirror during Practice and Review,
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
Save only the Review clip with runtime format capability detection and local mux / export.

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
