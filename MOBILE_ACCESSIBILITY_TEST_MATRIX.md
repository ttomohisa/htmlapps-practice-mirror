# Practice Mirror v1.0.0 — Mobile & Accessibility Test Matrix

Record browser/device, viewport or orientation, language, result, and notes for each case.

## A. Smartphone layout

### A1 — Narrow portrait

Test around 320px, 360px, 390px, and 430px CSS width.

Verify:

- Practice tools panel starts collapsed and opens from Controls,
- no horizontal page scroll,
- delay buttons fit,
- Practice tool buttons fit in two columns,
- Review / Stop remain visible,
- Review transport does not overlap and the whole video + seek bar fit in the viewport,
- 0.25x / 0.5x / 1x / 2x speed controls fit,
- long filename stays inside its control,
- dialogs stay inside viewport,
- toast stays inside safe area.

### A2 — Long content

Use:

- a 120-character output filename,
- English UI,
- visible error notice,
- expanded Technical details.

Verify wrapping does not push content horizontally.

## B. Landscape

On at least one iPhone-size and one Android-size phone:

- rotate Practice portrait → landscape → portrait,
- enter Review while landscape,
- expand diagnostics,
- open Help.

Verify:

- no horizontal scroll,
- video remains usable,
- right control rail is scrollable,
- no control is covered by browser/safe-area edges.

## C. Touch targets

Using touch/device emulation and at least one physical phone:

- header language/help,
- delay buttons,
- all Practice toolbar buttons,
- Review/Stop,
- frame-step buttons,
- speed buttons,
- Back to Practice,
- seek bar,
- filename,
- Save,
- guide lines.

Verify practical target size is about 44px or larger.

For guides, confirm the visible line stays thin while drag acquisition is forgiving.

## D. Keyboard

Without using a pointer:

1. Tab from the top of the page through Start.
2. Start camera where permissions allow.
3. Navigate Practice controls.
4. Enter Review.
5. Use playback, speed, seek, frame buttons.
6. Return to Practice.
7. Stop.
8. Open/close Help with keyboard.

Verify:

- visible focus indicator,
- no focus trap,
- no focus placed in hidden controls,
- Practice controls do not auto-hide while keyboard navigation is active,
- focus moves out of panels that become hidden.

## E. Guide keyboard controls

Add one vertical and one horizontal guide.

Verify:

- vertical guide exposes horizontal slider orientation,
- horizontal guide exposes vertical slider orientation,
- Arrow movement follows the movement axis,
- Shift + Arrow moves more,
- Home / End reach edges,
- Delete / Backspace removes the guide,
- screen reader label includes orientation/name and position.

## F. Screen reader / status

With a screen reader where available, verify important announcements:

- camera started / Warm-up,
- Review becomes available,
- Review starts,
- return to Practice,
- background pause/resume,
- guide add/remove,
- visible errors.

Verify continuous video frames, timers, seek motion, and diagnostics do not create announcement spam.

## G. Review accessibility

Verify:

- Play/Pause receives focus after keyboard Review entry,
- seek exposes current / total time through accessible value text,
- degraded Review disables broken playback/seek/save controls,
- Back to Practice remains reachable,
- export progress has an accessible label,
- filename is associated with export explanation.

## H. Form validation

### Review maximum setting

Test 10, 180, blank, 9, 181, and decimal input.

Verify:

- default is 10 seconds,
- 10 and 180 are valid,
- out-of-range / decimal input exposes invalid state,
- invalid input does not replace the last valid persisted setting,
- the collapsed Review settings summary reflects the saved value,
- Start with invalid Review input opens the setting and focuses the field.



For custom delay test:

- blank,
- 0,
- 31,
- decimal,
- valid 1,
- valid 30.

Verify:

- invalid state is exposed,
- error is associated with the input,
- Start with invalid input focuses the field,
- valid input clears invalid state.

## I. Language

Repeat core Start → Practice → Review → Back flow in Japanese and English.

Verify visible labels and accessible names change together.

## J. Reduced motion

Enable OS/browser reduced-motion preference.

Verify:

- no essential information is lost,
- controls remain understandable,
- Warm-up/status remains readable without relying on animation.

## K. Regression

Also complete the relevant items in `RELIABILITY_TEST_MATRIX.md`.

This matrix is part of the v1.0.0 release validation and does not replace the long-session reliability gate.
