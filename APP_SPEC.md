# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.2.0  
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice. It removes the repeated “record → stop → find → replay” loop by continuously showing the camera feed a few seconds late and, when needed, freezing the previous few seconds for Review.

Core loop at v1.0.0:

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
- Keep raw-frame retention to an absolute minimum; long-lived buffers must use compressed video chunks.

## Current scope — v0.2.0 Review

v0.2.0 keeps the v0.1.0 delayed mirror and adds a fixed Review workflow.

### Delayed practice

- User-initiated camera permission request.
- Rear-camera preference where `facingMode: environment` is supported.
- 5 second delay preset.
- 10 second delay preset (default).
- `getUserMedia()` capture with `audio: false`.
- `requestVideoFrameCallback()` + `VideoFrame` capture.
- WebCodecs encoding with H.264 preference and VP8 fallback.
- Timestamp-based compressed delay queue.
- WebCodecs decoding to Canvas.
- Explicit warm-up state.
- Explicit permission, unavailable-camera, unsupported-codec, and runtime-error states.
- Japanese / English UI in one HTML.

### Review

- Review becomes available only after a complete 10-second compressed history exists.
- Selecting Review freezes up to the previous 10 seconds at that moment.
- Once Review begins, new camera frames must not mutate the Review clip.
- Review supports:
  - play,
  - pause,
  - seek,
  - 0.5x playback,
  - 1x playback.
- Review seeking must restart decoding from the closest prior keyframe rather than retaining decoded raw frames for the whole clip.
- Returning to practice discards the Review clip and rebuilds the delayed buffer from zero.
- Returning to practice should reuse the existing live camera stream when it is still available, avoiding a second permission prompt.

### Not included in v0.2.0

- 0.25x playback.
- Frame stepping.
- Guides.
- Clip saving.
- Front / rear camera switch UI.
- Mirror toggle.
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

Any active state may transition to `IDLE` through Stop, page hide, or unload. Fatal processing failures transition to an explicit error state and release the camera.

## Video pipeline

### Practice pipeline

```text
getUserMedia()
  ↓
HTMLVideoElement (off-screen capture source)
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
```

Rules:

- Do not retain raw RGBA frame history.
- Close every captured and decoded `VideoFrame` when no longer needed.
- Target a keyframe at least every 2 seconds.
- Apply encoder backpressure; skip capture when `encodeQueueSize` is already high.
- Delay timing uses monotonic timestamps derived from `performance.now()`.

### Review history

- Keep approximately 14 seconds of compressed encoded chunks during practice.
- The visible Review range is the latest 10 seconds.
- Extra history exists only to preserve a keyframe before the visible Review start.
- On Review entry, copy only the required compressed packets into the fixed Review snapshot, then release the live history.
- Review memory must stay bounded by time; it must not grow with total practice duration.

### Review seek

For a target Review timestamp:

1. Find the nearest keyframe at or before the target.
2. Recreate / reset the Review decoder.
3. Decode sequentially from that keyframe through the target.
4. Keep only the best candidate decoded frame needed for the seek result.
5. Render that frame, close it, and continue playback from the corresponding packet index.

Do not decode the full Review clip into an array of raw frames.

## Codec selection

At runtime check both `VideoEncoder.isConfigSupported()` and `VideoDecoder.isConfigSupported()`.

Preference:

1. H.264 (`avc1.42E01F`) when both encode and decode are available.
2. VP8 when both encode and decode are available.
3. Clear unsupported state when neither pair is available.

When the encoder provides `metadata.decoderConfig`, retain a safe copy and use it for Review decoder initialization.

## Camera target

Initial constraints:

- audio: false
- facingMode: environment (ideal)
- width: 1280 (ideal)
- height: 720 (ideal)
- frameRate: 30 (ideal / max)

Actual track settings may be shown as compact diagnostic information.

## Review interaction rules

### Availability

Review is disabled until at least approximately 10 seconds of compressed history has accumulated.

### Entry

When Review is selected:

- stop scheduling new capture and delayed decoding,
- flush pending encoder output,
- freeze the Review snapshot,
- close the live encoder / decoder,
- keep the camera stream alive,
- show Review only after the snapshot is fixed.

### Playback

- Initial position is the beginning of the Review range.
- Initial speed is 1x.
- Supported speeds are 0.5x and 1x.
- The seek slider represents only the visible Review range, not the keyframe preroll.
- Reaching the end pauses Review.
- Starting playback from the end restarts from the beginning.

### Back to practice

- Stop and close the Review decoder.
- Discard the Review packets.
- Verify the camera track is still live.
- Create fresh live encoder / decoder state.
- Clear old delay and history queues.
- Enter Warm-up again before delayed output resumes.

## Privacy and persistence

May persist:

- language,
- selected delay preset.

Must not persist automatically:

- frames,
- encoded video chunks,
- Review clips,
- screenshots,
- camera labels,
- derived biometric / pose data.

Stopping, reloading, closing, backgrounding, or returning from Review to practice discards the relevant in-memory media buffers.

## Accessibility

- Keyboard-operable buttons and range input.
- Visible focus.
- SVG icons instead of emoji controls.
- `aria-label` on icon-only controls.
- Help dialog closes with its close button, Escape, and backdrop interaction.
- Reduced-motion preference respected.
- Smartphone controls remain close to the video and do not overlap safe areas.

## v0.2.0 acceptance criteria

1. v0.1.0 delayed playback behavior remains available at 5 and 10 seconds.
2. Review is unavailable before a full 10-second history exists.
3. Selecting Review freezes the Review range so later camera frames cannot change it.
4. Review supports play, pause, seek, 0.5x, and 1x playback.
5. Seeking does not retain a raw-frame history and starts decode from a valid prior keyframe.
6. Returning to practice discards Review state and enters Warm-up with a fresh delay buffer.
7. Returning to practice does not request camera permission again when the original camera stream remains live.
8. Stop releases the camera from both Practice and Review.
9. Review and delayed buffers remain bounded and do not grow with total session duration.
10. Camera video and Review content are not uploaded, persisted, or sent to an API.
11. Japanese and English controls fit at smartphone width without horizontal scrolling.
12. Readable and self-extracting standalone builds are generated from source rather than manually edited.

## Validation note

The v0.1.0 real-device 10-minute stability gate could not be completed in the prior execution environment because local and `file://` browser pages were blocked by managed Chromium policy. This remains a release validation requirement; v0.2.0 implementation does not waive it.

Before v0.3.0 / release progression, verify on actual supported devices:

- 720p / target 30fps / 10 second delay,
- at least 10 minutes continuous Practice,
- repeated Practice → Review → Practice transitions,
- repeated seeks at 0%, middle, and end,
- 0.5x and 1x playback,
- no memory growth proportional to total session duration,
- no obvious accumulated delay drift,
- Stop releases the camera.

## Development roadmap

### v0.1.0 — Core Delay Mirror
Stable 5 / 10 second delayed playback and capability / error handling.

### v0.2.0 — Review
Freeze the previous 10 seconds for play / pause / seek and return safely to practice.

### v0.3.0 — Frame Review & Guides
0.25x playback, frame stepping, horizontal / vertical guides, mirror display.

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
