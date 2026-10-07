Practice Mirror
===============

Read README.md or README.ja.md for the current development scope.
Read AGENTS.md and APP_SPEC.md before editing.

v0.4.0 provides delayed Practice, fixed Review, slow/frame inspection, draggable guides, Mirror display, and explicit local saving of the Review clip.
Save prefers a browser-supported MP4 MediaRecorder type and falls back to WebM. The export filename is user-editable before saving.
Camera switching, Wake Lock, fullscreen, and adaptive quality remain later milestones.

Edit src/index.template.html, not generated HTML.
On Windows run build-standalone.bat, or run the syntax/repository checks documented in README.
Use the freshly generated dist/index.html, dist/index.self-extract.html, or practice-mirror.html.

Camera video stays local to the browser. The standalone app has no runtime CDN, API, analytics, telemetry, or media upload, and audio is not requested.
Review and export use bounded / temporary in-memory media only. Guides and Mirror are display-only and are not baked into saved files.

Review the associated Actions run for exact build and preview evidence.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
