# Third-party notices

Practice Mirror v1.0.0 embeds one runtime helper through the repository's pinned dependency pipeline.

## fix-webm-duration

- Package: `fix-webm-duration`
- Version: `1.0.6`
- License: MIT
- Homepage: https://github.com/yusitnikov/fix-webm-duration
- Purpose: add/fix WebM duration metadata after browser MediaRecorder output so saved Review clips can be seeked.

The package asset is embedded into the generated standalone HTML at build time and is loaded from a Blob URL only when saving a Review clip. It is not fetched from a CDN or external server at runtime.

The application otherwise uses browser-native APIs including WebCodecs, MediaDevices, Fullscreen, Screen Wake Lock, Canvas capture, MediaRecorder, native dialog, and standard ARIA/DOM behavior.

The release screenshot workflow uses Playwright 1.55.0 only in GitHub Actions. Playwright is not embedded in the distributed application.
