Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.

v0.6.0 provides:
- 1–30 second delayed Practice
- camera switching, Fullscreen, Wake Lock, responsive Practice UX
- Review, frame stepping, guides, Mirror, local clip saving
- capability tiers and adaptive runtime performance monitoring
- sustained-load downgrade: 720p/30 → 720p/20 → 540p/15 → 360p/12 targets

Adaptive changes are downward-only during one session to avoid quality oscillation.
Resolution changes restart Warm-up; FPS-only 30→20 does not.
Performance/hardware hints stay local and are not persisted.

Reliability and long-session testing is the next planned milestone.

Edit src/index.template.html, not generated HTML.
Run the template PowerShell syntax/repository checks before completion.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
