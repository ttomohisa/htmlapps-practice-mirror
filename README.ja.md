# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するWebアプリです。

> v0.6.0ではAdaptive Performanceを追加しました。端末負荷が継続して高い場合、処理fpsや解像度を段階的に下げ、重い端末でもセッションが破綻しにくい方向へ自動調整します。

## Features

- 3 / 5 / 10 / 15秒プリセット + 1〜30秒自由設定
- 複数カメラ端末での前面/背面切替
- 直前10秒を固定するReview
- 0.25× / 0.5× / 1×、シーク、コマ送り
- 縦横ガイド、左右反転
- Reviewクリップのローカル保存
- MP4優先 / WebMフォールバック
- 全画面、Screen Wake Lock
- スマホPracticeの操作UI自動非表示
- 短い横画面向け2カラムUI
- 動作情報内のCapability tier
- 4秒単位の端末負荷監視
- 30 → 20 → 15 → 12fpsの段階的な自動負荷低減
- 継続負荷時の720p → 540p → 360p目標への段階的調整
- セッション中の自動画質上昇を行わず、上下往復を防止
- 日本語 / English
- 音声取得なし
- `connect-src 'none'`
- 単一HTML

## Adaptive Performance

Practice中に以下を端末内で確認します。

- 遅延映像の実測描画fps
- encoder queueの混雑
- decoder queueの混雑
- backpressureにより処理を見送ったフレーム数

一瞬の負荷では画質を落としません。複数の監視区間で負荷が続いた場合だけ段階を下げます。

最初の自動調整は720pのまま30fps → 20fpsに下げるため、遅延バッファを作り直しません。それでも重い場合は540p/15fps、その後360p/12fpsを試します。解像度を変更した場合は古い映像と混在させないためWarm-upをやり直します。

カメラが解像度変更を受け付けない場合でも、それだけを理由に停止せず、実際のカメラ解像度を維持したまま処理fpsを下げます。

## Privacy

性能判定もすべて端末内です。

以下を外部へ送りません。

- カメラ映像
- Review
- 性能サンプル
- CPUコア数 / device-memoryのヒント
- カメラID / ラベル

開始時の初期品質選択に `hardwareConcurrency` や `deviceMemory` の大まかな値を利用する場合がありますが、保存・送信しません。

CSPは `connect-src 'none'`、マイク音声は取得しません。

## Browser support

コア機能にはカメラ、`requestVideoFrameCallback()`、WebCodecsが必要です。

Fullscreen、Screen Wake Lock、複数カメラ、Canvas `captureStream()`、`MediaRecorder` は任意機能です。これらの一部がない場合は「基本」Capabilityとして表示し、遅延ミラー本体は使える設計です。

## Limitations in v0.6.0

- 自動調整の閾値は実機の幅広い検証がまだ必要
- セッション中の品質自動回復は、頻繁な上下動を防ぐため意図的に未実装
- 長時間Reliability検証は次のマイルストーン
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
