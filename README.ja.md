# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するWebアプリです。

> v0.7.0ではReliabilityを重点的に強化しました。古いmedia callbackの世代分離、バッファ上限、background復帰、カメラ/codec復旧、Review失敗の分離を追加しています。

## Features

- 3 / 5 / 10 / 15秒プリセット + 1〜30秒自由設定
- 720p/30fps〜360p/12fps目標のAdaptive Performance
- 複数カメラ端末での前面/背面切替
- 直前10秒Review
- 0.25× / 0.5× / 1×、シーク、コマ送り
- 縦横ガイド、左右反転
- Reviewクリップのローカル保存
- 全画面、Screen Wake Lock
- スマホPracticeの操作UI自動非表示
- live/historyバッファの上限監視
- カメラ/codec停止を検知するwatchdog
- 回数制限付きlive自動復旧
- background / foregroundの一時停止・再開
- Review decoderだけを対象にした復旧
- Review復旧不能時でも「練習に戻る」を残す縮退状態
- セッションReliability診断
- 日本語 / English
- 音声取得なし
- `connect-src 'none'`
- 単一HTML

## Reliability

復旧可能なlive異常では、

1. 古いmedia generationを無効化
2. 古い遅延バッファを破棄
3. 限定的な自動復旧を実施
4. Warm-upから再開

します。

live自動復旧は **1分あたり最大2回** です。繰り返し失敗する場合は無限再接続せず、通常のエラー状態で停止します。

Review decoderはliveカメラと分離しています。Reviewだけ1回再生成を試し、それでも失敗した場合は壊れたReview操作を無効にしますが、**練習に戻る** は残します。

backgroundではencode/decode処理とWake Lockを止めます。Practiceへ戻ると古い遅延映像を再利用せずWarm-upから再開します。Review中なら固定済みReviewを可能な限り保持します。

## Memory bounds

raw frame履歴は保持しません。

- 遅延映像は圧縮状態
- Review履歴は時間上限 + packet数上限
- live delay queueが想定範囲を超えた場合は復旧
- Reviewは固定長
- export Blob URLは一時利用後に解放

という構成です。

## Privacy

映像だけでなくReliability情報も端末内だけで扱います。

以下を外部送信・自動保存しません。

- カメラ映像
- Review映像
- 復旧回数
- queueサイズ
- performance window
- 端末性能ヒント
- camera ID / label

CSPは `connect-src 'none'`、マイクは取得しません。

## Validation

静的CIだけでは60分の実カメラ動作は証明できません。

v1.0.0前に [RELIABILITY_TEST_MATRIX.md](./RELIABILITY_TEST_MATRIX.md) の長時間利用、Review反復、カメラ切替、background復帰、保存、メモリ、resource releaseを実機確認します。

## Browser support

コア機能にはカメラ、`requestVideoFrameCallback()`、WebCodecsが必要です。

Fullscreen、Screen Wake Lock、複数カメラ、Canvas `captureStream()`、`MediaRecorder` は任意機能です。

## Limitations in v0.7.0

- 実機での長時間Reliabilityマトリクスはまだ未完了
- Adaptive Performanceの閾値はより広い端末検証が必要
- 音声録音なし
- AI / 姿勢推定なし

## Single HTML / offline behavior

`dist/index.html`、`practice-mirror.html`、`dist/index.self-extract.html` を生成します。外部ランタイムライブラリは使用しません。

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
