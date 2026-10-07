# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.5.0  
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
- Practice controls must remain usable at a distance.
- Prefer stable delayed playback over higher resolution or feature count.
- Long-lived video buffers use compressed chunks rather than raw frame history.
- Saving is explicit and limited to the frozen Review clip.

## Current scope — v0.5.0 Practice UX

v0.5.0 retains Practice, Review, frame stepping, guides, Mirror, and local clip saving from v0.4.0 and improves the actual practice workflow.

### Delay setting

- Presets: 3, 5, 10, and 15 seconds.
- Custom delay: integer 1–30 seconds.
- 10 seconds remains the default.
- Custom input follows the template preset/custom-setting behavior:
  - do not clamp every keystroke,
  - validate and normalize on change/blur/start,
  - show the accepted range quietly,
  - show a field-local error for invalid input.
- The selected delay is persisted locally.

Review history remains a separate fixed 10-second window. A short Practice delay does not reduce the Review window.

### Camera switching

- Initial camera preference is rear/environment.
- After camera permission, enumerate video inputs.
- Show the camera switch as usable only when at least two video inputs are available.
- Switch between user/front and environment/rear preferences.
- Switching discards the current delayed buffer and starts a fresh warm-up.
- If switching fails, attempt to recover the previous camera.
- Do not store device IDs or labels.
- Only the generic front/rear preference may be persisted.

### Fullscreen

- Fullscreen applies to the complete Practice Mirror workspace rather than the video alone so controls remain accessible.
- Fullscreen is disabled when the browser does not expose the standard Fullscreen API.
- Exiting or entering fullscreen restores Practice controls and restarts the auto-hide timer.
- Stop exits the app fullscreen state when possible.

### Screen Wake Lock

- Screen Wake Lock is enabled by default when supported.
- The user can toggle the preference from Practice controls.
- The lock is requested only while an active Practice/Review session exists and the document is visible.
- Stop, page hide, or runtime failure releases the lock.
- Unsupported browsers keep the rest of the app usable and disable the Wake Lock control.

### Practice control auto-hide

- During Practice, controls auto-hide after approximately four seconds of inactivity on coarse-pointer/mobile devices.
- Fullscreen Practice also uses auto-hide.
- Short-height landscape mode keeps the side control rail visible rather than auto-hiding it.
- Touch/pointer interaction with the video restores controls.
- Review does not auto-hide its controls.
- Focused controls are never hidden.
- Hidden control groups are removed from keyboard focus where `inert` is supported.

### Orientation / responsive layout

Portrait and normal desktop layouts keep controls directly below the video.

For short landscape mobile viewports:

- hide the nonessential page intro,
- use a two-column layout,
- keep the video in the larger left region,
- keep Practice/Review controls in a scrollable right rail,
- preserve guide coordinates as percentages so rotation does not move guides semantically,
- avoid horizontal page scrolling and bottom-control overlap.

### Existing Review and save behavior

- Review freezes up to the previous 10 seconds.
- Review supports play, pause, seek, 0.25x / 0.5x / 1x playback and frame stepping.
- Multiple vertical and horizontal guides may be added and dragged.
- Mirror flips only the rendered Canvas.
- Review saving prefers supported MP4 MediaRecorder output and falls back to WebM.
- Audio is never requested or exported.
- Guides and Mirror are not baked into the saved file.

## State model

```text
IDLE
  ↓
REQUESTING_CAMERA
  ↓
WARMING_UP
  ↓
PRACTICE
  ├─ Switch camera → WARMING_UP
  ├─ Fullscreen / Wake Lock / auto-hide are UI/session capabilities
  ↓ Review
REVIEW_PREPARING
  ↓
REVIEW
  ├─ Save Review → EXPORTING → REVIEW
  └─ Back to practice → WARMING_UP
```

## Privacy and persistence

May persist:

- language,
- selected delay,
- generic front/rear camera preference,
- Mirror preference,
- Wake Lock preference.

Must not persist automatically:

- camera device IDs or labels,
- frames,
- encoded chunks,
- Review clips,
- guide positions,
- screenshots,
- output filename,
- biometric / pose data.

## Accessibility

- Keyboard-operable controls and visible focus.
- SVG icons instead of emoji controls.
- Custom delay has a visible unit, range helper, and field-local error.
- Hidden auto-hide controls are not intentionally left keyboard-focusable.
- Guide lines expose slider semantics and keyboard movement.
- Review save filename has a visible label and separate extension.
- Help dialog remains scrollable on smartphone and short viewports.
- Reduced-motion preference is respected.

## v0.5.0 acceptance criteria

1. 3 / 5 / 10 / 15 second delay presets work.
2. Custom delay accepts whole-number values from 1 through 30 seconds and persists the normalized value.
3. Invalid custom delay cannot start Practice.
4. Camera switch is disabled until multiple video inputs are known.
5. Camera switching restarts warm-up without reloading the page.
6. A failed switch attempts to recover the previous camera.
7. Fullscreen contains both video and the app controls.
8. Screen Wake Lock can be toggled and is released on Stop/page hide.
9. Practice controls auto-hide only in appropriate Practice contexts and reappear on interaction.
10. Review controls stay visible.
11. Short landscape smartphone layout keeps video and controls usable without horizontal page scrolling.
12. v0.4.0 Review saving and filename behavior remain functional.
13. Camera/video data remains local with `connect-src 'none'`.
14. Readable and self-extracting standalone builds are generated from source.

## Validation note

Real-device validation remains required for:

- 1, 3, 5, 10, 15, and 30 second delays,
- front/rear camera switching on a multi-camera phone,
- portrait ↔ landscape rotation,
- fullscreen enter/exit,
- Wake Lock behavior,
- control auto-hide / restore,
- 10+ minute delayed Practice,
- Review and saved-file playback,
- Stop releasing camera and wake lock.

## Development roadmap

### v0.1.0 — Core Delay Mirror
Stable delayed playback and capability/error handling.

### v0.2.0 — Review
Freeze the previous 10 seconds for playback and seek.

### v0.3.0 — Frame Review & Guides
0.25x playback, frame stepping, guides, Mirror.

### v0.4.0 — Save Clip
Save only the frozen Review clip locally.

### v0.5.0 — Practice UX
1–30 second delay, camera switching, fullscreen, Wake Lock, control auto-hide, orientation polish.

### v0.6.0 — Adaptive Performance
Runtime capability tiers, FPS/queue monitoring, adaptive frame rate and resolution.

### v0.7.0 — Reliability
Long-session, lifecycle, repeated-transition, and memory regression testing.

### v0.8.0 — Mobile Polish & Accessibility
Final mobile/tablet/desktop polish and accessibility review.

### v0.9.0 — Release Candidate
Browser Kitty integration, privacy/CSP audit, screenshots, README, and production build review.

### v1.0.0 — Practice Mirror
Stable public release of the complete practice loop.
