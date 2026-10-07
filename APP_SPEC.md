# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.7.0  
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
- Long-lived media buffers must remain bounded.
- Recover only a limited number of times; repeated failure should stop safely rather than loop forever.
- Review failures must not unnecessarily destroy the whole camera session.
- Stale asynchronous work from an earlier camera/session generation must never overwrite newer state.

## Existing behavior retained

v0.7.0 retains:

- 3 / 5 / 10 / 15 second delay presets.
- Integer custom delay from 1–30 seconds.
- Adaptive quality profiles from 720p/30fps down to 360p/12fps targets.
- Front / rear camera switching where multiple video inputs exist.
- Fullscreen, optional Screen Wake Lock, responsive Practice controls.
- Fixed previous-10-second Review.
- 0.25x / 0.5x / 1x playback, seek, and frame stepping.
- Draggable vertical/horizontal guides and Mirror display.
- Explicit local Review clip export.
- MP4-preferred / WebM-fallback browser-native save.
- No microphone access and no runtime network access.

## v0.7.0 — Reliability

### 1. Generation-safe live pipeline

Each live encoder/decoder pipeline has a generation identifier.

- Encoder output from an older generation is ignored.
- Decoder frames from an older generation are closed and ignored.
- Old camera/quality/recovery operations cannot overwrite a newer session after Stop, camera switching, backgrounding, or reinitialization.
- Camera-switch operations also use a dedicated switch token because live pipeline generation changes during successful activation.

This prevents delayed asynchronous callbacks from reviving stale state.

### 2. Live watchdog

While visible and in Warm-up / Practice, run a lightweight watchdog approximately every 2 seconds.

The watchdog checks:

- current camera video track is still `live`,
- encoded output has progressed recently,
- rendered delayed frames continue progressing once in Practice,
- the delayed encoded queue remains within its expected time / packet bounds.

A missing encoded/rendered progress interval of roughly 6 seconds is considered a stall candidate.

The watchdog does not run active recovery while:

- page is hidden,
- session is suspended,
- another recovery is already running,
- adaptive resolution work is in progress,
- Review is active.

### 3. Bounded media queues

#### Review history

Review history is already time-bounded. v0.7.0 also adds a hard packet-count ceiling derived from the history time window and target FPS.

The app must not let Review history grow with total session duration.

#### Live delay queue

The live delay queue is expected to contain approximately the selected delay plus processing margin.

If either:

- queue timestamp span grows beyond approximately `delay + 8 seconds`, or
- packet count exceeds a generous delay/FPS-derived hard ceiling,

treat the queue as stalled rather than allowing it to continue growing.

The safe response is to discard the old live buffer and rebuild Warm-up.

### 4. Limited automatic live recovery

Recoverable live failures include:

- camera track ended unexpectedly,
- encoder/decoder callback failure,
- encoder progress stall,
- delayed-render progress stall,
- live queue growth beyond its bound.

Recovery behavior:

1. move UI to a recovering / Warm-up state,
2. invalidate old generation,
3. stop old live loops/codecs,
4. clear delayed/history buffers,
5. reuse the live camera track when possible,
6. reacquire the same generic front/rear camera preference only when the track is no longer live,
7. select a valid codec for the current geometry,
8. restart Warm-up,
9. restore Wake Lock when appropriate.

Allow at most **2 live recovery attempts within one minute**. A further failure becomes a normal fatal runtime error instead of an infinite recovery loop.

### 5. Camera-track interruption

Bind an `ended` listener to the current video track.

- During Warm-up / Practice: attempt bounded live recovery.
- During Review: keep the frozen Review available and explain that Back to Practice will reconnect the camera.
- Explicit Stop removes the listener before stopping the track so user-initiated Stop is never mistaken for an unexpected camera failure.

Do not treat normal temporary `mute` as a fatal camera end.

### 6. Review decoder isolation

Review decoding is independent from the live camera session.

If Review decoder playback fails:

1. attempt one Review-only decoder recreation at the current position,
2. if recovery succeeds, continue Review,
3. if it fails again, mark Review as degraded,
4. disable Review play/seek/frame-step/save controls,
5. keep **Back to Practice** available.

A Review decoder failure must not automatically stop or release a still-valid camera stream.

Initial Review preparation failure also leaves a return path to Practice.

### 7. Background / foreground lifecycle

When the document becomes hidden during an active session:

- release Wake Lock,
- stop live encode/decode loops,
- dispose live codecs,
- clear live delayed/history buffers,
- cancel in-progress export generation,
- enter a suspended state.

If currently in Review:

- keep the frozen compressed Review packets,
- close only the Review decoder,
- remember the Review position.

The camera track may remain live if the browser keeps it alive; the browser may also end it while backgrounded.

When the document becomes visible again:

#### From Practice / Warm-up

- reuse a still-live track when available,
- otherwise reacquire the same generic facing preference,
- rebuild codec state,
- restart from Warm-up.

#### From Review

- recreate the Review decoder,
- seek back to the saved Review position,
- keep Review available,
- if the camera track ended while hidden, reconnect only when returning to Practice.

For BFCache:

- `pagehide.persisted === true` uses suspension behavior,
- `pageshow.persisted === true` attempts resume,
- a normal non-BFCache page hide performs full cleanup.

### 8. Async transition invalidation

The following operations may await browser APIs and therefore need stale-result guards:

- Start camera,
- Switch camera,
- adaptive `applyConstraints()`,
- live camera reacquisition,
- foreground resume,
- Back to Practice camera reacquisition,
- Review preparation / seek recovery.

If the user stops, backgrounds, starts a newer session, or otherwise invalidates the operation while an await is pending, the old result must be ignored or its newly acquired track immediately stopped.

### 9. Session diagnostics

Technical details include a compact session reliability status:

- Stable,
- Recovering,
- Paused,
- total live + Review recovery attempts,
- successful Review entries in the current session.

Do not expose internal exception text unless it is part of an explicit error state.

### 10. Privacy / persistence

Reliability state is memory-only.

Do not persist or transmit:

- recovery counters,
- stall timestamps,
- queue sizes,
- performance windows,
- Review recovery state,
- background lifecycle history,
- camera IDs / labels,
- media buffers.

Existing local preferences remain limited to user-facing settings such as language, delay, generic facing mode, Mirror, and Wake Lock.

## v0.7.0 acceptance criteria

1. Old encoder/decoder callbacks cannot mutate a newer live generation.
2. Live and history queues remain bounded independently of total session duration.
3. A live camera/codec stall triggers bounded Warm-up recovery rather than unbounded queue growth.
4. No more than two live automatic recovery attempts occur within one minute.
5. Explicit Stop cannot trigger camera-ended recovery.
6. Review decoder failure attempts one Review-only recovery.
7. Repeated Review decoder failure leaves Back to Practice usable and disables broken Review controls.
8. Hidden Practice resumes through fresh Warm-up rather than continuing stale buffered media.
9. Hidden Review preserves its frozen clip and position where possible.
10. BFCache page transitions use suspend/resume semantics.
11. Camera switching / adaptive constraints / recovery results from stale async operations are ignored.
12. Stop releases live codecs, queue data, camera stream, Wake Lock, and watchdog.
13. No reliability metric or media data is persisted or transmitted.
14. `connect-src 'none'` and `audio:false` remain intact.
15. Readable and self-extracting standalone builds are generated from source.

## Release validation gate

v0.7.0 code hardens the app, but real-camera longevity cannot be proven by static CI alone.

Before v1.0.0, complete the cases in `RELIABILITY_TEST_MATRIX.md`, including:

- 60-minute Practice,
- repeated Practice → Review → Practice loops,
- repeated camera switching,
- orientation/background/fullscreen transitions,
- saved clips after long sessions,
- memory trend observation,
- Stop/resource-release verification.

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
Generation-safe lifecycle handling, bounded queues, limited automatic recovery, Review isolation, and long-session validation plan.

### v0.8.0 — Mobile Polish & Accessibility
Final mobile/tablet/desktop polish and accessibility review.

### v0.9.0 — Release Candidate
Browser Kitty integration, privacy/CSP audit, screenshots, README, and production build review.

### v1.0.0 — Practice Mirror
Stable public release of the complete practice loop.
