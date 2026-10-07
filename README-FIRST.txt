Practice Mirror
===============

Read README.md or README.ja.md for the current scope.
Read AGENTS.md and APP_SPEC.md before editing.
Read MOBILE_ACCESSIBILITY_TEST_MATRIX.md and RELIABILITY_TEST_MATRIX.md before v1.0.0 release validation.

v0.8.0 adds:
- 44px-class touch targets
- mobile two-column Practice controls
- narrower short-landscape control rail
- safe-area-aware page/fullscreen/dialog/toast spacing
- keyboard-aware Practice auto-hide
- tabindex fallback when hidden controls are inert
- focus restoration across Start / Review / Practice / Help
- dedicated screen-reader status announcements
- corrected guide slider orientation semantics
- Review seek accessible current/total time
- custom-delay aria-invalid / described-by behavior

The v0.7.0 Reliability protections remain required and must not regress.

Edit src/index.template.html, not generated HTML.
Run the template PowerShell syntax/repository checks before completion.
The user merges the PR. Do not merge, publish a release/tag, or change Browser Kitty itself.
