# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するためのWebアプリです。

> v0.4.0では、固定したReviewクリップを必要なときだけ端末へ保存できるようになりました。ブラウザが対応していればMP4を優先し、利用できない場合はWebMで保存します。

## Features

- 5秒 / 10秒の遅延表示
- 直前最大10秒を固定してReview
- 再生 / 一時停止 / シーク
- 0.25× / 0.5× / 1×再生
- 1コマ戻る / 1コマ進む
- ドラッグできる縦ガイド / 横ガイド
- ガイドのキーボード微調整・削除
- ガイド全消去 + Undo
- エンコード映像を変更しない左右反転表示
- Review保存ファイル名の編集
- MP4優先 / WebMフォールバックのローカル保存
- 保存進捗表示
- 背面カメラを優先して起動
- H.264 / VP8を実行時に判定
- WebCodecsで圧縮した映像だけを時間制限付きで端末メモリに保持
- 日本語 / English 切り替え
- カメラ音声を取得しない
- CSPで実行時の外部通信を禁止
- 読みやすい単一HTMLとgzip自己展開版を生成

## Usage

1. 5秒または10秒を選びます。
2. **カメラを開始**を押し、カメラ利用を許可します。
3. 選択した時間分の準備が終わると遅延映像が表示されます。
4. 必要なら縦・横ガイドを追加したり、**左右反転**を有効にします。
5. 履歴が十分たまったら **Review** を押します。
6. スロー再生・シーク・コマ送りで動きを確認します。
7. 必要ならファイル名を編集して **Reviewクリップを保存** を押します。
8. **練習に戻る**で遅延バッファを作り直し、練習を再開します。
9. 終了時は **終了** を押します。

保存用動画の作成にはReviewクリップと同程度の時間がかかります。ガイド線と左右反転表示は保存動画へ焼き込みません。

## Privacy

カメラ映像、Review表示、保存用動画の作成はすべてブラウザ内で行います。

Practice Mirrorでは以下を行いません。

- 映像アップロード
- 外部API送信
- 音声取得
- 動画の自動保存
- Analytics / telemetry

動画ファイルを作るのはユーザーが明示的に保存したときだけです。CSPは `connect-src 'none'` です。localStorageへ保存するのは言語、遅延秒数、左右反転設定のみです。

## Browser support

Practice / Reviewには以下が必要です。

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- H.264またはVP8のencode/decode対応

動画保存には追加で以下が必要です。

- `HTMLCanvasElement.captureStream()`
- `MediaRecorder`
- MP4またはWebMのMediaRecorder対応形式

保存機能が使えないブラウザでもReviewまでは利用できます。

## Limitations in v0.4.0

まだ以下は利用できません。

- 前面 / 背面カメラ切り替えUI
- 全画面
- Screen Wake Lock
- 自動画質調整
- 音声録音
- ガイド / 左右反転の焼き込み
- AI / 姿勢推定

## Single HTML / offline behavior

ビルドすると以下を生成します。

```text
dist/index.html
practice-mirror.html
dist/index.self-extract.html
```

`dist/index.html` と `practice-mirror.html` は同一内容です。外部ランタイムライブラリは使用していません。

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
