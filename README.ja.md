# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するためのWebアプリです。

> v0.3.0ではReviewのコマ送り、0.25×スロー再生、ガイド線、左右反転まで追加しています。動画保存やカメラ切り替えは後続バージョンで実装します。

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
7. **練習に戻る**で遅延バッファを作り直し、練習を再開します。
8. 終了時は **終了** を押します。

ガイド線は直接ドラッグできます。フォーカス中は矢印キーで移動、Shift + 矢印で大きく移動、Home / Endで端へ移動、Delete / Backspaceで削除できます。

## Privacy

カメラ映像とReview映像はブラウザ内で処理します。

Practice Mirrorでは以下を行いません。

- 映像アップロード
- 外部API送信
- 音声取得
- 動画の自動保存
- Analytics / telemetry

CSPは `connect-src 'none'` です。localStorageへ保存するのは言語、遅延秒数、左右反転設定のみです。ガイド位置と映像バッファは永続保存しません。

## Browser support

以下が必要です。

- `navigator.mediaDevices.getUserMedia()`
- `HTMLVideoElement.requestVideoFrameCallback()`
- `VideoFrame`
- `VideoEncoder`
- `VideoDecoder`
- H.264またはVP8のencode/decode対応

必要なブラウザ機能が不足している場合は開始前または初期化時に案内します。

## Limitations in v0.3.0

まだ以下は利用できません。

- 動画保存
- 前面 / 背面カメラ切り替えUI
- 全画面
- Screen Wake Lock
- 自動画質調整
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
