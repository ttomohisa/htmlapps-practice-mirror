Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.

v0.2.0 provides the delayed Practice view plus a fixed Review of up to the previous 10 seconds with play, pause, seek, 0.5x, and 1x playback.
Frame stepping, guides, clip saving, camera switching, Wake Lock, and fullscreen remain later milestones.

Edit src/index.template.html, not generated HTML.
On Windows run build-standalone.bat, or run the syntax/repository checks documented in README.
Use the freshly generated dist/index.html, dist/index.self-extract.html, or practice-mirror.html.

Camera video stays local to the browser. The standalone app has no runtime CDN, API, analytics, telemetry, or media upload, and audio is not requested.
Review keeps only a bounded compressed history in memory; it does not keep a full raw-frame history.

Review the associated Actions run for exact build and preview evidence.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
