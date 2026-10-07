# Practice Mirror

[![GitHub Pages](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Single HTML](https://img.shields.io/badge/distribution-single%20HTML-16624F)](https://ttomohisa.github.io/htmlapps-practice-mirror/)

[日本語版 README](README.ja.md)

A privacy-focused delayed camera mirror for sports, dance, training, posture checks, and other self-practice. It shows the camera feed a few seconds late so you can finish a movement, look back at the screen, and immediately see what you actually did.

## 🚀 Live demo

### [Open Practice Mirror on GitHub Pages](https://ttomohisa.github.io/htmlapps-practice-mirror/)

GitHub Pages delivers the initial HTML. After it loads, camera capture, delayed playback, Review, guides, performance monitoring, and clip creation are processed locally in your browser. Camera frames are not uploaded by the app, and microphone audio is not requested.

[![Practice Mirror screenshot](assets/screenshot-en.png)](https://ttomohisa.github.io/htmlapps-practice-mirror/)

Mobile screenshot: [assets/screenshot-mobile-en.png](assets/screenshot-mobile-en.png)

## Features

- **Delayed practice mirror** — Choose 3 / 5 / 10 / 15 seconds, or enter a custom delay from 1–30 seconds.
- **Configurable Review history** — Defaults to 10 seconds and can be set from 10–180 seconds. Review becomes available after about 10 seconds and keeps growing up to the configured maximum.
- **Detailed frame review** — Play at 0.25x / 0.5x / 1x / 2x, seek through the clip, or step one frame backward/forward.
- **Guides for alignment** — Add vertical/horizontal guides, drag them on the video, or adjust them with the keyboard.
- **Mirror and camera controls** — Flip the displayed image, switch front/rear cameras when multiple inputs are available, enter fullscreen, and optionally keep the screen awake.
- **Save only the clip you need** — Export the frozen Review as a seekable WebM. Duration metadata is repaired locally before download so normal players can seek.
- **Mobile-first Practice UI** — Touch targets, safe areas, short-landscape layout, auto-hiding Practice controls, and a collapsed tools panel on smartphones.
- **Adaptive and bounded processing** — Sustained load can reduce processing FPS/resolution; compressed queues are bounded and recoverable live failures use limited automatic recovery.
- **Japanese / English UI** — Both languages are included in the same standalone HTML.
- **Local processing** — Camera frames, Review media, guides, performance counters, and reliability state stay in the browser.

## Quick start

### Use the web demo

Just [open the demo](https://ttomohisa.github.io/htmlapps-practice-mirror/). No installation or account is required. The browser asks for camera permission only after you select **Start camera**.

### Use the download file

1. Download [practice-mirror.html](practice-mirror.html) from this repository.
2. Open it in a current browser that supports WebCodecs and camera access.
3. Choose the delay and select **Start camera**.

The HTML contains its runtime dependency and does not need a CDN. Camera permission for a local `file://` page varies by browser/OS; if a downloaded file cannot access the camera, use the HTTPS GitHub Pages version.

### Build it yourself (advanced)

1. Download or clone this repository.
2. Double-click `build-standalone.bat` on Windows, or run `./build-standalone.ps1` in PowerShell.
3. The first build downloads the exact dependency version pinned in `dependencies.json` / `dependencies.lock.json`.
4. The build generates `dist/index.html`, `dist/index.self-extract.html`, and the repository-root `practice-mirror.html`.
5. Copy the readable or self-extracting single HTML wherever you need it.

Python, Node.js, and a local web server are not required for the normal PowerShell build. The release screenshot workflow uses Node.js/Playwright only in CI and is not part of the distributed app.

## Usage

1. Choose the delayed-view time: 3 / 5 / 10 / 15 seconds, or a custom 1–30 second value.
2. Open **Review settings** if you want more than the default 10-second Review history. The maximum can be set from 10–180 seconds.
3. Select **Start camera** and allow camera access.
4. Wait for Warm-up. Practice Mirror then shows the camera with the selected delay.
5. On smartphones, open **Controls** only when you need guides, Mirror, camera switching, fullscreen, or screen wake lock.
6. After about 10 seconds of history, select **Review**. History continues accumulating up to your configured maximum.
7. Use playback speed, seek, or frame stepping to inspect the movement.
8. Open **Save clip** only if you want to keep the frozen Review.
9. Select **Back to practice** to discard the frozen Review and rebuild the delayed buffer, or **Stop** to release the camera.

### Review settings

Review history defaults to 10 seconds. You can configure any whole-number maximum from 10 through 180 seconds before starting the camera.

Review does not make you wait for the full maximum: it becomes available after about 10 seconds, then the retained compressed history keeps growing until it reaches the configured limit. Longer history uses more device memory. At the 180-second maximum, compressed video can reach tens of megabytes depending on the active encoder settings.

### Review playback and saving

Review supports 0.25x, 0.5x, 1x, and 2x playback, seeking, and frame stepping. Decoder restarts always begin from an actual key frame after seek/flush.

Saving creates a WebM locally. Practice Mirror records the frozen Review to a temporary Canvas/MediaRecorder stream, then uses embedded `fix-webm-duration` to repair duration metadata before download. This makes the output seekable in normal video players. Saving a long Review can take about the clip duration because the video is reconstructed locally in real time.

Guides and the Mirror display transform are not burned into the saved clip, and no audio track is recorded.

### Guides and keyboard controls

| Key | Action |
| --- | --- |
| Arrow key | Move the focused guide by 1% |
| Shift + Arrow | Move by 5% |
| Home / End | Move to an edge |
| Delete / Backspace | Remove the focused guide |

## Publish with GitHub Pages

The repository includes a workflow that rebuilds the fully embedded standalone HTML and deploys `dist/` to GitHub Pages.

1. Push the repository to GitHub as `htmlapps-practice-mirror`.
2. Open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. Push to `main`, or manually run **Deploy standalone app to GitHub Pages** from the Actions tab.
4. After a successful deployment, the app is available at `https://ttomohisa.github.io/htmlapps-practice-mirror/`.

Each push to `main` rebuilds the standalone HTML from the pinned dependency lock, verifies repository/runtime-network contracts, uploads the build artifact, and publishes the generated `dist/` directory.

## Development and build layout

```text
.
├─ src/index.template.html                 # Application source template
├─ assets/favicon.svg                     # Canonical favicon / app icon
├─ assets/screenshot*.png                 # Japanese / English desktop / mobile screenshots
├─ dependencies.json                      # Pinned dependency declaration
├─ dependencies.lock.json                 # Tarball URL / SHA-256 lock
├─ build-standalone.bat                   # Windows build entry point
├─ build-standalone.ps1                   # Standalone HTML builder
├─ practice-mirror.html                   # Generated readable single HTML
├─ dist/index.html                        # Generated GitHub Pages artifact
├─ dist/index.self-extract.html           # Generated gzip self-extracting HTML
├─ scripts/check-repository.ps1           # Build + app-specific regression checks
└─ .github/workflows/
   ├─ build-standalone.yml                # Pull request build validation
   ├─ capture-release-screenshots.yml     # Review/export/layout tests + screenshots
   └─ deploy-pages.yml                    # Automatic Pages deployment from main
```

### Update dependencies

`fix-webm-duration` is exact-version pinned. To update it:

1. Change the version in `dependencies.json`.
2. Run `./scripts/sync-dependency-lock.ps1` to refresh the tarball URL and SHA-256 lock.
3. Run `./scripts/check-repository.ps1` and review the standalone-size report before committing.

The build process automatically:

- downloads the pinned npm tarball when it is not already cached,
- verifies the locked tarball SHA-256,
- embeds the selected dependency asset into the single HTML (gzip-compressed when beneficial),
- embeds the exact `assets/favicon.svg` into both the browser favicon and upper-left app icon,
- rejects unresolved build placeholders and forbidden runtime-network patterns,
- verifies the readable standalone HTML and the self-extracting HTML,
- generates dependency/self-extract/build-size manifests,
- copies the readable build to `practice-mirror.html`.

## Privacy and runtime network protection

The generated standalone HTML includes:

- a Content Security Policy containing `connect-src 'none'`,
- no external runtime scripts, stylesheets, fonts, analytics, telemetry, or media-upload endpoint,
- browser-native camera capture with `audio:false`,
- an embedded asset loader for `fix-webm-duration`, loaded from a local Blob URL only when saving a Review clip,
- bounded compressed video history rather than raw-frame history,
- temporary local Blob URLs that are revoked after use.

The GitHub Pages version requires the initial HTML request, but camera frames and Review media selected/generated by the app are not transmitted. For network-disconnected use, the generated standalone HTML has no runtime server dependency, although camera permission for local files remains browser-dependent.

## Limitations

- Core delayed playback requires WebCodecs (`VideoEncoder` / `VideoDecoder`) and `requestVideoFrameCallback()`.
- Camera access requires a secure/trusted context supported by the browser. Local `file://` camera behavior differs across browsers and operating systems.
- Review export is WebM-only in v1.0.0 so duration metadata can be repaired locally for reliable seeking.
- A longer Review history uses more memory; 180 seconds can retain tens of megabytes of compressed video.
- Saving a long Review can take approximately the clip duration.
- Fullscreen, Screen Wake Lock, camera switching, and background behavior vary by browser/OS.
- Long sessions and camera processing consume CPU and battery.
- Audio recording is intentionally not included.
- AI pose estimation or automatic scoring is intentionally not included.

## Dependencies

| Library | Version | License | Purpose |
| --- | ---: | --- | --- |
| fix-webm-duration | 1.0.6 | MIT | Repairs WebM duration metadata after MediaRecorder export so saved Review clips can be seeked |

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details.

## Contributing

Bug reports and feature proposals are welcome through GitHub Issues. See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidance.

## License

Copyright © 2026 ttomohisa

Licensed under the [MIT License](LICENSE).
