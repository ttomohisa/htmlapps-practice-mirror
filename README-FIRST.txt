Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.

v0.3.0 provides the delayed Practice view, fixed Review of up to the previous 10 seconds, 0.25x / 0.5x / 1x playback, frame stepping, draggable vertical / horizontal guides, and Mirror display.
Clip saving, camera switching, Wake Lock, fullscreen, and adaptive quality remain later milestones.

Edit src/index.template.html, not generated HTML.
On Windows run build-standalone.bat, or run the syntax/repository checks documented in README.
Use the freshly generated dist/index.html, dist/index.self-extract.html, or practice-mirror.html.

Camera video stays local to the browser. The standalone app has no runtime CDN, API, analytics, telemetry, or media upload, and audio is not requested.
Review keeps only bounded compressed history. Guides are DOM overlays; Mirror is a display transform.

Review the associated Actions run for exact build and preview evidence.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
