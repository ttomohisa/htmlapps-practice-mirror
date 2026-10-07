# Practice Mirror

[![GitHub Pages](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Single HTML](https://img.shields.io/badge/distribution-single%20HTML-16624F)](practice-mirror.html)

[English README](README.md)

スポーツ・ダンス・トレーニングなどの自主練で、カメラ映像を数秒遅らせて表示する練習ミラーです。動き終わって画面を見ると、ちょうどさっきの自分を確認できます。

## スクリーンショット

[![Practice Mirror screenshot](assets/screenshot.png)](practice-mirror.html)

スマートフォン版: [assets/screenshot-mobile.png](assets/screenshot-mobile.png)

## 主な機能

- **遅延ミラー** — 3 / 5 / 10 / 15秒、または1〜30秒の自由設定。
- **直前10秒Review** — 通常の録画開始/停止をせず、気になった動きを固定して確認。
- **細かく見返す** — 0.25× / 0.5× / 1×、シーク、1コマ戻る/進む。
- **縦横ガイド** — ドラッグとキーボード操作に対応。
- **左右反転** — 表示だけを反転し、圧縮映像自体は変更しません。
- **必要な場面だけ保存** — Reviewクリップを明示操作で端末へ保存。MP4対応時はMP4を優先し、それ以外ではWebM。
- **Practice向けUI** — カメラ切替、全画面、Screen Wake Lock、スマホauto-hide、横向きレイアウト。
- **Adaptive / Reliability** — 継続負荷時の品質調整、bounded buffer、カメラ/codec異常の限定復旧。
- **日本語 / English** — 同じ単一HTML内で切り替え。
- **ローカル処理** — カメラ映像、Review、ガイド、性能/Reliability情報はブラウザ内で扱います。

## 使い方

1. 遅延秒数を選びます。
2. **カメラを開始** を押し、カメラ利用を許可します。
3. Warm-upを待ちます。
4. 遅延映像を見ながら練習します。
5. 履歴がたまったら **Review** を押します。
6. スロー再生、シーク、コマ送りで確認します。
7. 残したい場合だけReviewクリップを保存します。
8. **練習に戻る** で遅延バッファを作り直します。
9. 終わったら **終了** を押します。

## プライバシー

単一HTML版はカメラ映像を外部サーバーへアップロードせず、マイク音声も要求しません。

- CSPは `connect-src 'none'`。
- 外部runtime script/style/fontなし。
- アプリ独自のAnalytics / telemetryなし。
- 動画の自動永続保存なし。
- 明示保存時だけ一時Blob URLを使用し、後で解放。

## 対応ブラウザ条件

コア機能には安全なカメラ利用環境と `getUserMedia()`、`requestVideoFrameCallback()`、`VideoFrame`、`VideoEncoder`、`VideoDecoder`、WebCodecsのH.264またはVP8対応が必要です。

Fullscreen、Screen Wake Lock、複数カメラ、Canvas `captureStream()`、`MediaRecorder` は任意機能です。

## 単一HTML

ビルドすると以下を生成します。

- `dist/index.html`
- `practice-mirror.html`
- `dist/index.self-extract.html`

リポジトリ直下の `practice-mirror.html` は読みやすいstandalone buildと同一内容です。

## v0.9.0 Release Candidate

機能追加を止め、公開前の最終確認を行います。スマートフォン/PC、日本語/English、保存、カメラ生命周期、アクセシビリティ、長時間利用、単一HTML、CSP/外部通信、README、favicon、スクリーンショットを確認します。

確認項目:

- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](MOBILE_ACCESSIBILITY_TEST_MATRIX.md)
- [RELIABILITY_TEST_MATRIX.md](RELIABILITY_TEST_MATRIX.md)

## 制限

- 遅延ミラー本体にはWebCodecs対応が必要です。
- MP4保存対応はブラウザ差があり、必要に応じてWebMを使用します。
- カメラ、Wake Lock、Fullscreen、background動作にはブラウザ/OS差があります。
- 長時間利用やカメラ切替はCPU/バッテリーを使用します。
- 音声録音とAI姿勢推定は意図的に含めていません。

## Development

    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1

## License

Copyright © 2026 ttomohisa

[MIT License](LICENSE)
