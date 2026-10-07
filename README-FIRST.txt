Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.
Read RELIABILITY_TEST_MATRIX.md before v1.0.0 release validation.

v0.7.0 provides:
- 1–30 second delayed Practice
- Adaptive Performance
- camera switching, Fullscreen, Wake Lock, responsive Practice UX
- Review, frame stepping, guides, Mirror, local clip saving
- generation-safe media callbacks
- bounded live/Review queues
- live stall watchdog and limited automatic recovery
- background/resume lifecycle handling
- Review-only recovery with degraded-safe fallback

Live automatic recovery is limited to two attempts per minute.
Reliability state remains local and is not persisted.
Real-device long-session validation is still required.

Edit src/index.template.html, not generated HTML.
Run the template PowerShell syntax/repository checks before completion.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
