# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するためのWebアプリです。

> v0.1.0 は遅延表示エンジンを検証する開発版です。Review、スロー再生、ガイド線、動画保存などはまだ実装していません。

## Features

- 5秒 / 10秒の遅延表示
- 背面カメラを優先して起動
- H.264 / VP8 を実行時に判定
- WebCodecsで圧縮した映像を端末メモリ内に一時保持
- 準備中・カメラ拒否・非対応・処理失敗を分けて表示
- 日本語 / English 切り替え
- カメラ音声は取得しない
- 実行時の外部ネットワーク通信をCSPで禁止
- 読みやすい単一HTMLとgzip自己展開版の2種類を生成

## Usage

1. 5秒または10秒を選びます。
2. **カメラを開始**を押します。
3. ブラウザのカメラ利用を許可します。
4. 選択した時間分の準備が終わると、遅れた映像が表示されます。
5. 練習を終えるときは **終了** を押します。

## Privacy

カメラ映像はブラウザ内で処理します。

v0.1.0では以下を行いません。

- 映像アップロード
- 外部API送信
- 音声取得
- 自動録画
- 動画の永続保存
- Analytics / telemetry

CSPは `connect-src 'none'` とし、アプリ実行中の外部通信を禁止しています。

localStorageには言語と遅延秒数の設定だけを保存します。

## Browser support

以下が必要です。

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- H.264またはVP8のencode/decode対応

ブラウザAPIやコーデックが不足している場合は、カメラ開始前または初期化時に案内します。

## Limitations in v0.1.0

まだ以下は利用できません。

- Review
- スロー再生
- コマ送り
- ガイド線
- 動画保存
- 前面 / 背面カメラ切り替えUI
- 全画面
- Screen Wake Lock

## Single HTML / offline behavior

ビルドすると以下を生成します。

```text
dist/index.html
practice-mirror.html
dist/index.self-extract.html
```

`dist/index.html` と `practice-mirror.html` は同一内容です。

外部ライブラリは使用していません。

## Development

PowerShellで検証します。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
