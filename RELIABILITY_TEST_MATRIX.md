# Practice Mirror v0.7.0 — Reliability Test Matrix

This file defines the real-device reliability gate that static CI cannot prove.

Record device/browser/version, selected delay, result, and any observed recovery count for each run.

## A. Long-session baseline

### A1 — 60-minute Practice

Run continuously for 60 minutes at:

- 10-second delay,
- default quality,
- rear camera,
- no Review.

Pass when:

- delayed playback continues,
- delay does not visibly drift without bound,
- controls remain responsive,
- memory does not grow proportionally with elapsed session time,
- no repeated recovery loop occurs,
- Stop releases the camera and Wake Lock.

Run on at least:

- recent iPhone Safari,
- recent/mid-range Android Chrome,
- desktop Chrome or Edge.

### A2 — 30-second delay

Run 30 minutes at the maximum 30-second delay.

Pass when:

- live queue remains bounded,
- Review remains available,
- no progressive UI slowdown appears.

## B. Repeated transitions

### B1 — Practice ↔ Review

Repeat 50 times:

1. Practice,
2. enter Review,
3. seek near start/middle/end,
4. step backward/forward,
5. return to Practice,
6. wait for Warm-up.

Pass when no cycle requires page reload.

### B2 — Review export

Create 20 Review files across one session.

Pass when:

- each completed download is non-empty,
- exported WebM files remain playable and seekable in a normal player,
- Blob/export memory is released between saves,
- Review remains usable after each export.

## C. Camera switching

### C1 — Rear/front switching

On a multi-camera phone, switch camera 20 times.

Pass when:

- every successful switch rebuilds Warm-up,
- failed switch recovers the previous camera,
- no old stream reappears after Stop,
- only one camera stream is active after each transition.

### C2 — Stop during switch

Start a camera switch and immediately stop when practical.

Pass when a late `getUserMedia()` result cannot restart the camera after Stop.

## D. Background / lifecycle

### D1 — Practice background/foreground

Repeat 10 times:

1. enter Practice,
2. background the browser for 5–20 seconds,
3. return.

Pass when:

- Wake Lock is released while hidden,
- old delayed media is not resumed,
- foreground return starts a fresh Warm-up,
- the app either reuses a live track or safely reacquires it.

### D2 — Review background/foreground

Repeat 10 times while paused at different Review positions.

Pass when:

- frozen Review packets remain bounded,
- Review returns near the same position,
- camera interruption during background does not destroy the frozen Review,
- Back to Practice reconnects the camera when needed.

### D3 — BFCache/navigation

Where the browser supports BFCache for the page, navigate away/back.

Pass when stale encoder/decoder callbacks do not mutate the resumed/new session.

## E. Layout / device state

### E1 — Orientation

Rotate portrait ↔ landscape 20 times during Practice and Review.

Pass when:

- no horizontal page scroll,
- no hidden controls,
- guide percentages remain stable,
- no duplicate capture pipeline appears.

### E2 — Fullscreen

Enter/exit fullscreen 20 times.

Pass when controls and Wake Lock state remain consistent.

## F. Recovery paths

### F1 — Sustained CPU load

Use browser CPU throttling or another controlled load source.

Pass when:

- a single slow moment does not downgrade quality,
- sustained load can trigger adaptive downgrade,
- recovery/watchdog does not enter a loop,
- resolution changes restart Warm-up safely.

### F2 — Camera interruption

Where possible, interrupt camera availability while Practice is active.

Pass when:

- at most two automatic live recovery attempts occur within one minute,
- successful recovery returns through Warm-up,
- repeated failure stops safely with a usable error state.

### F3 — Review decoder failure

Use a development-only fault injection or corrupted Review fixture if available in a test harness.

Pass when:

- Review attempts one decoder recreation,
- a repeated failure degrades only Review,
- Back to Practice remains usable,
- the live camera session is not unnecessarily destroyed.

## G. Memory / resource release

Observe browser memory tooling where available.

Confirm after:

- 60-minute Practice,
- 50 Review cycles,
- 20 exports,
- 20 camera switches.

Pass when:

- encoded/history arrays remain time/packet bounded,
- discarded VideoFrames are closed,
- old Blob URLs do not accumulate,
- only one watchdog/timer remains active,
- Stop returns the app to idle and camera indicator turns off.

## H. Network / privacy

With DevTools Network open:

- perform Practice,
- Review,
- camera switching,
- adaptive downgrade,
- background/resume,
- export,
- automatic recovery.

Pass when the application makes no runtime network request and no camera/reliability data is transmitted.
