Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.

v0.5.0 provides:
- 1–30 second delayed Practice
- multi-camera front/rear switching
- Review, slow playback, frame stepping, guides, Mirror
- local Review clip saving
- fullscreen, Screen Wake Lock, Practice control auto-hide
- short-landscape mobile layout

Adaptive performance is the next planned milestone.

Edit src/index.template.html, not generated HTML.
Run the template PowerShell syntax/repository checks before completion.
Use freshly generated dist/index.html, dist/index.self-extract.html, or practice-mirror.html.

Camera video stays local. No runtime CDN, API, analytics, telemetry, media upload, or microphone audio is used.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
