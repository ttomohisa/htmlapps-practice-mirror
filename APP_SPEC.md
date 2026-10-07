# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.6.0  
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice. It removes the repeated “record → stop → find → replay” loop by showing the camera feed a few seconds late and freezing the previous 10 seconds for Review when needed.

Core loop:

```text
Move → see the movement later → Review if needed → save only if needed → adjust → move again
```

Practice Mirror is not a video editor, sports scoring system, medical device, or cloud coaching service.

## Product principles

- No account or installation.
- Camera frames stay in the browser.
- No runtime CDN, API, analytics, telemetry, or media upload.
- Smartphone is a first-class target.
- Stable long-running Practice is more important than maximum resolution.
- Long-lived media buffers use compressed video chunks.
- Performance adaptation should degrade gracefully rather than crash or freeze.
- Automatic adaptation must avoid rapid quality oscillation.

## Existing Practice / Review behavior

v0.6.0 retains:

- 3 / 5 / 10 / 15 second delay presets.
- Integer custom delay from 1–30 seconds.
- Front / rear camera switching when multiple inputs are available.
- Fullscreen workspace and optional Screen Wake Lock.
- Practice control auto-hide and short-landscape mobile layout.
- Fixed previous-10-second Review.
- 0.25x / 0.5x / 1x playback, seek, and frame stepping.
- Draggable vertical / horizontal guides and Mirror display.
- Explicit local Review clip saving with editable filename.
- MP4-preferred / WebM-fallback browser-native export.
- No microphone access and no runtime network access.

## v0.6.0 — Adaptive Performance

### Capability tier

At runtime classify the current browser into:

- **Full**: core delayed-camera APIs plus Review saving, Fullscreen, and Screen Wake Lock.
- **Limited/Core**: the core delayed-camera APIs are available, but one or more optional capabilities are missing.
- **Unsupported**: one or more APIs required for the delayed-camera core are missing.

The tier is shown only inside the collapsed technical diagnostics. Optional capability loss must not disable the delayed mirror.

### Initial processing profile

Use the following profiles:

| Profile | Target resolution | Target capture/encode FPS |
| --- | ---: | ---: |
| High | 1280×720 | 30 |
| Balanced | 1280×720 | 20 |
| Efficient | 960×540 | 15 |
| Low load | 640×360 | 12 |

Initial profile is selected locally from broad browser/device hints and requested delay:

- normal modern device: High,
- lower core count / device-memory hint: Balanced or Efficient,
- long delays (15s+) start no higher than Balanced,
- very long delays (24s+) start no higher than Efficient.

These hints are used only in memory. They are not stored or transmitted.

### Runtime performance window

While the app is in **Practice** (not Warm-up or Review), evaluate performance every 4 seconds.

Track at minimum:

- rendered delayed-video FPS,
- encoder queue peak,
- decoder queue peak,
- capture frames that became due,
- capture frames skipped because encoder backpressure was already high.

Do not use a single slow frame as a downgrade signal.

### Sustained overload detection

Treat a window as overloaded when any strong signal is present, including:

- backpressure-skip ratio at or above approximately 10%,
- encoder queue repeatedly reaching the high-pressure range,
- decoder queue reaching a sustained backlog,
- measured delayed render FPS falling substantially below the current target.

Require two consecutive overloaded windows before automatically reducing the profile.

After a quality change, apply a cooldown (approximately 12 seconds) before another automatic change.

### Downgrade order

Automatic adaptation only moves downward during one Practice session:

```text
High 720p / 30fps
↓ sustained load
Balanced 720p / 20fps
↓ sustained load
Efficient target 540p / 15fps
↓ sustained load
Low-load target 360p / 12fps
```

Do not automatically move upward during the same session. A new Start-camera session recalculates the initial profile. This avoids repeated Warm-up cycles and quality oscillation.

### FPS-only downgrade

High → Balanced keeps the same target resolution.

- Reduce software capture/encode cadence to 20fps.
- Do not discard the delayed buffer.
- Do not force a new Warm-up.

The encoder may remain configured for a higher nominal frame rate; actual encoded cadence is governed by the capture scheduler.

### Resolution downgrade

Balanced → Efficient and Efficient → Low load may change camera constraints.

When resolution is reduced:

1. stop live capture/decode loops,
2. discard delayed/Review history for the old geometry,
3. attempt `MediaStreamTrack.applyConstraints()` with the lower target resolution and FPS,
4. if the camera refuses the resolution constraint, keep the actual camera geometry and still reduce the software target FPS,
5. choose a compatible WebCodecs configuration for the resulting track settings,
6. resize the display Canvas,
7. restart the delayed pipeline and Warm-up,
8. explain that the delay buffer is being rebuilt.

Do not reacquire a new camera permission merely for an adaptive quality reduction.

### Diagnostics

The collapsed technical details show:

- actual camera geometry / camera FPS,
- selected codec,
- current measured delay,
- current processing profile + actual processing geometry + target FPS,
- capability tier + measured delayed render FPS + performance state.

Performance state values are approximately:

- Watching,
- Stable,
- High load.

Diagnostics must not include camera labels, device IDs, video content, or personally identifying data.

## Privacy and persistence

May persist:

- language,
- selected delay,
- generic front/rear preference,
- Mirror preference,
- Wake Lock preference.

Do not persist or transmit:

- performance samples,
- device-memory / CPU-core hints,
- camera IDs or labels,
- frames or encoded buffers,
- Review clips,
- guide positions,
- output filename,
- adaptive quality profile.

## v0.6.0 acceptance criteria

1. Core v0.5.0 Practice, Review, guides, Mirror, export, camera switching, Fullscreen, and Wake Lock remain functional.
2. A capability tier is computed without sending capability data off-device.
3. Performance is evaluated in repeated multi-second windows rather than per-frame spikes.
4. Runtime monitoring includes encoder pressure, decoder pressure, backpressure skips, and rendered FPS.
5. One overloaded window alone does not reduce quality.
6. Two consecutive overloaded windows can reduce the profile.
7. High → Balanced lowers target FPS without rebuilding the delay buffer.
8. A later sustained overload may attempt lower camera resolution and restart Warm-up safely.
9. Failure of `applyConstraints()` falls back to lower software FPS rather than ending the session solely because resolution could not change.
10. Automatic adaptation is downward-only during one session and observes a cooldown between changes.
11. Diagnostics reflect current profile and measured performance.
12. No adaptive-performance data is persisted or transmitted.
13. `connect-src 'none'` and `audio:false` remain intact.
14. Readable and self-extracting standalone builds are generated from source.

## Validation note

Actual performance thresholds require device validation. Before release progression, test:

- recent high-end phone,
- mid-range Android phone,
- iPhone/Safari,
- desktop Chrome/Edge/Safari where available,
- 3s, 10s, and 30s delay,
- long Practice session,
- forced CPU throttling where a browser tool supports it,
- observed 30 → 20fps downgrade without Warm-up restart,
- observed resolution downgrade with clean Warm-up restart,
- camera switch after a downgrade,
- Review and export after adaptive changes,
- Stop releasing camera and Wake Lock.

## Development roadmap

### v0.1.0 — Core Delay Mirror
Stable delayed playback and capability/error handling.

### v0.2.0 — Review
Freeze the previous 10 seconds for playback and seek.

### v0.3.0 — Frame Review & Guides
Slow playback, frame stepping, guides, Mirror.

### v0.4.0 — Save Clip
Save only the frozen Review clip locally.

### v0.5.0 — Practice UX
1–30 second delay, camera switching, Fullscreen, Wake Lock, control auto-hide, orientation polish.

### v0.6.0 — Adaptive Performance
Capability tiers, runtime pressure monitoring, adaptive FPS and resolution.

### v0.7.0 — Reliability
Long-session, lifecycle, repeated-transition, and memory regression testing.

### v0.8.0 — Mobile Polish & Accessibility
Final mobile/tablet/desktop polish and accessibility review.

### v0.9.0 — Release Candidate
Browser Kitty integration, privacy/CSP audit, screenshots, README, and production build review.

### v1.0.0 — Practice Mirror
Stable public release of the complete practice loop.
