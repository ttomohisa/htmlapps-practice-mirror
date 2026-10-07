# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するWebアプリです。

> v0.5.0では、1〜30秒の遅延設定、前面/背面カメラ切替、全画面、Screen Wake Lock、練習中の操作UI自動非表示、スマホ横向きレイアウトまで追加しています。

## Features

- 3秒 / 5秒 / 10秒 / 15秒プリセット
- 1〜30秒の自由設定
- 背面カメラ優先 + 複数カメラ端末での前面/背面切替
- 直前最大10秒を固定するReview
- 再生 / 一時停止 / シーク
- 0.25× / 0.5× / 1×再生
- 1コマ戻る / 1コマ進む
- ドラッグできる縦・横ガイド
- ガイドのキーボード微調整・削除
- 左右反転表示
- 全画面表示
- Screen Wake Lockによる画面スリープ防止
- スマホ/全画面Practiceでの操作UI自動非表示
- 低い横向き画面での動画＋操作の2カラム表示
- Review保存ファイル名の編集
- MP4優先 / WebMフォールバックのローカル保存
- 日本語 / English切り替え
- 音声取得なし
- CSPによる実行時外部通信禁止
- 単一HTML + gzip自己展開版

## Usage

1. 3 / 5 / 10 / 15秒、または自由設定で1〜30秒を選びます。
2. **カメラを開始**を押し、カメラ利用を許可します。
3. 準備後、選択した秒数だけ遅れた映像を見ながら練習します。
4. 必要に応じて **カメラ切替**、**全画面**、**画面を点灯**、ガイド、**左右反転**を使います。
5. スマホのPractice中は操作UIが自動的に隠れることがあります。映像をタップすると再表示されます。
6. 履歴が十分たまったら **Review** を押します。
7. スロー再生・シーク・コマ送りで直前10秒を確認します。
8. 必要なReviewだけ端末へ保存します。
9. **練習に戻る**で遅延バッファを作り直します。

## Privacy

カメラ映像、Review、保存用動画の作成はすべてブラウザ内で行います。

Practice Mirrorでは以下を行いません。

- 映像アップロード
- 外部APIへのカメラ映像送信
- 音声取得
- 動画の自動保存
- Analytics / telemetry

CSPは `connect-src 'none'` です。

localStorageへ保存する可能性があるのは、言語、遅延秒数、前面/背面の一般設定、左右反転、Wake Lock設定です。カメラのdevice ID・ラベル、映像バッファ、Reviewクリップ、ガイド位置は自動保存しません。

## Browser support

Practice / Reviewには以下が必要です。

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- H.264またはVP8のWebCodecs対応

任意機能として以下を利用します。

- Fullscreen API
- Screen Wake Lock API
- カメラ切替用の複数 `videoinput`
- Review保存用のCanvas `captureStream()` + `MediaRecorder`

任意APIがない場合、その機能だけを無効にして遅延ミラー本体は利用できるようにします。

## Limitations in v0.5.0

まだ以下は未完了です。

- 端末負荷に応じたFPS / 解像度の自動調整
- 長時間利用を含むReliability仕上げ
- 音声録音
- ガイド / 左右反転の保存動画への焼き込み
- AI / 姿勢推定

## Single HTML / offline behavior

ビルドすると以下を生成します。

```text
dist/index.html
practice-mirror.html
dist/index.self-extract.html
```

外部ランタイムライブラリは使用していません。

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
