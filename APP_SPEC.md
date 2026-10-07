# Practice Mirror — Application Specification

Status: implementation specification  
Current development version: v0.8.0  
Target: Browser Kitty

## Product definition

Practice Mirror is a local-first delayed camera mirror for self-practice.

Core loop:

```text
Move → see the movement later → Review if needed → save only if needed → adjust → move again
```

The app prioritizes smartphone practice, local media processing, bounded memory use, and a UI that remains operable with touch, keyboard, and assistive technology.

## Existing behavior retained

v0.8.0 retains:

- 3 / 5 / 10 / 15 second presets and 1–30 second custom delay.
- Adaptive performance profiles.
- Front / rear camera switching where supported.
- Fullscreen and Screen Wake Lock.
- Previous-10-second Review.
- 0.25x / 0.5x / 1x playback, seek, frame stepping.
- Vertical / horizontal guides and Mirror display.
- Local Review clip saving.
- Generation-safe reliability recovery and bounded media queues.
- Background / foreground lifecycle recovery.
- No microphone access and no runtime network access.

## v0.8.0 — Mobile Polish & Accessibility

### 1. Touch targets

Primary interactive controls should provide approximately 44 CSS px or more of touch area.

This includes:

- header actions,
- delay presets,
- Practice toolbar actions,
- Review playback controls,
- frame-step controls,
- Review seek control,
- export controls,
- toast action,
- guide-line drag hit areas.

Guide visual lines remain thin, but the invisible/transparent draggable hit area is enlarged to 44px.

### 2. Mobile Practice layout

At smartphone widths:

- Practice tool actions use a two-column grid.
- Review and Stop use a full-width two-column action row.
- long engine/status text may wrap instead of forcing page overflow.
- Review playback controls use a stable grid rather than relying only on flex wrapping.
- speed buttons share available width evenly.
- save action uses the available width.
- technical diagnostics collapse to one column.

At very narrow widths:

- delay presets become a two-column grid,
- Review heading/action can stack,
- filename extension padding is reduced,
- toast placement respects safe areas.

### 3. Short landscape layout

For short landscape phone viewports:

- video remains the dominant left region,
- controls use a narrower right rail,
- tool actions remain in a two-column grid,
- Review / notice / diagnostics remain inside the scrollable rail,
- right-rail children use `min-width: 0`,
- horizontal page scrolling should not be required.

### 4. Safe areas

Use `env(safe-area-inset-*)` where it materially affects:

- smartphone page side/bottom padding,
- fullscreen workspace padding,
- help dialog content,
- toast placement.

No fixed bottom UI may cover content.

### 5. Auto-hide and keyboard modality

Practice auto-hide is a pointer-oriented convenience, not a keyboard behavior.

When keyboard navigation is detected:

- show Practice controls,
- stop auto-hiding them,
- keep them keyboard reachable.

When controls are hidden for pointer Practice:

- mark hidden groups `aria-hidden="true"`,
- use `inert` when supported,
- explicitly set descendant focusables to `tabindex="-1"`,
- restore each prior tabindex state when controls become visible.

A pointer interaction switches back to pointer modality.

### 6. Focus transitions

Avoid leaving focus inside content that is about to become hidden.

Required transitions:

- Start camera from keyboard → move focus into visible session controls.
- Review button → after successful Review entry, move focus to Play/Pause.
- Review failure/degraded state → move focus to Back to Practice.
- Back to Practice → move focus to a visible Practice control.
- Stop → return focus to Start camera.
- Help dialog open → focus Close.
- Help dialog close/Escape/backdrop → restore focus to Help.

Focus movement uses `preventScroll` where available.

### 7. Dedicated status announcements

Do not mark the entire application workspace as an `aria-live` region.

Use one dedicated visually-hidden polite status region for important state changes, including:

- camera started / Warm-up beginning,
- Review becoming available,
- Review opened,
- return to Practice,
- background suspension/resume,
- guide add/remove.

Existing visible error/status components may continue to use their own appropriate status semantics.

Avoid announcing every frame, timer tick, performance sample, or seek update.

### 8. Guide accessibility

Guide lines act as sliders.

- Vertical guide moves left/right → `aria-orientation="horizontal"`.
- Horizontal guide moves up/down → `aria-orientation="vertical"`.
- expose 0–100 position values,
- expose localized value text,
- expose relevant keyboard shortcuts,
- Arrow keys move by 1,
- Shift + Arrow moves by 5,
- Home / End moves to an edge,
- Delete / Backspace removes the focused guide.

### 9. Review accessibility

- Review seek provides localized visible label and dynamic `aria-valuetext` containing current / total time.
- Review controls expose disabled state during export or degraded Review.
- Review/export containers expose busy state during asynchronous work.
- Output filename has a visible label and describes the current export-format explanation.
- Export progress is associated with its visible progress text.

### 10. Form validation

Custom delay:

- keeps a visible accepted range,
- connects range/error text through `aria-describedby`,
- toggles `aria-invalid`,
- moves focus to the field if Start is attempted with invalid custom input.

Do not clamp invalid input silently while typing.

### 11. Language consistency

Japanese / English switching must update:

- visible text,
- button accessible names,
- stage/diagnostics labels,
- error text already visible,
- help content.

Initial HTML should not contain stale text that contradicts the runtime translation.

### 12. Motion

Continue respecting `prefers-reduced-motion: reduce`.

No essential state may be communicated only by animation.

## v0.8.0 acceptance criteria

1. Main touch controls are approximately 44px or larger.
2. Guide-line drag hit areas are 44px while visual lines remain thin.
3. 320–430px width layouts do not require horizontal page scrolling.
4. Short landscape phone layout keeps video and controls usable.
5. Long output filenames remain contained inside the filename control.
6. Safe-area insets are respected in mobile/fullscreen/dialog/toast surfaces.
7. Keyboard use prevents Practice auto-hide.
8. Hidden Practice controls cannot receive Tab focus, including browsers without `inert`.
9. Focus does not remain in a hidden Start/Review/Practice panel after state transitions.
10. Help dialog restores focus to its trigger.
11. Important state changes use a dedicated polite live region instead of the whole workspace.
12. Guide ARIA orientation matches the axis of movement.
13. Review seek exposes current/total accessible value text.
14. Custom delay exposes range, error, and `aria-invalid`.
15. Japanese and English accessible names update consistently.
16. Existing v0.7.0 Reliability behavior remains intact.
17. `connect-src 'none'` and `audio:false` remain intact.
18. Standalone/self-extract builds continue to pass template checks.

## Validation gate

Complete `MOBILE_ACCESSIBILITY_TEST_MATRIX.md` before release progression.

The existing `RELIABILITY_TEST_MATRIX.md` remains required before v1.0.0.

## Development roadmap

### v0.1.0 — Core Delay Mirror
Stable delayed playback.

### v0.2.0 — Review
Freeze and review the previous 10 seconds.

### v0.3.0 — Frame Review & Guides
Slow playback, frame stepping, guides, Mirror.

### v0.4.0 — Save Clip
Explicit local Review saving.

### v0.5.0 — Practice UX
Delay controls, camera switching, fullscreen, Wake Lock, responsive Practice UI.

### v0.6.0 — Adaptive Performance
Capability tiers and adaptive FPS/resolution.

### v0.7.0 — Reliability
Bounded queues, lifecycle recovery, Review isolation, long-session safeguards.

### v0.8.0 — Mobile Polish & Accessibility
Touch targets, narrow/landscape layouts, keyboard/focus behavior, screen-reader semantics.

### v0.9.0 — Release Candidate
Final Browser Kitty integration, screenshots, metadata, privacy/CSP audit, and production readiness.

### v1.0.0 — Practice Mirror
Public release.
