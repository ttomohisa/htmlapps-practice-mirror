# Practice Mirror

数秒前のカメラ映像を表示し、スポーツ・ダンス・トレーニングなどのフォームをその場で確認するWebアプリです。

> v0.8.0ではMobile / Accessibilityを重点的に磨きました。タップ領域、狭いスマホ画面、横向き、キーボード時のauto-hide、フォーカス移動、読み上げ用状態通知を改善しています。

## Features

- 3 / 5 / 10 / 15秒 + 1〜30秒自由設定
- Adaptive Performance / Reliability
- 前面/背面カメラ切替
- 直前10秒Review
- スロー再生、シーク、コマ送り
- タッチ/キーボード対応の縦横ガイド
- 左右反転
- Reviewクリップのローカル保存
- Fullscreen / Screen Wake Lock
- スマホPracticeのauto-hide
- 狭い縦画面 / 短い横画面向けレイアウト
- 主要操作とガイドhit areaの約44pxタップ領域
- キーボード利用中はauto-hideを停止
- Start / Practice / Review間のフォーカス移動
- 専用の読み上げ用status領域
- 日本語 / Englishのaccessible name
- マイク取得なし
- `connect-src 'none'`
- 単一HTML

## Mobile / Accessibility

スマホではPracticeツールを2列化し、Review/Stopや再生速度も狭い幅で崩れにくい配置にしています。

ガイド線自体は細いままですが、ドラッグ可能な領域は44pxへ広げています。

Tabなどのキーボード操作を検出するとPractice操作は自動で隠れません。pointer向けauto-hideで非表示になった操作は、`inert`非対応ブラウザでもTab移動できないようにtabindexを退避します。

Review開始やReview利用可能、background復帰など重要状態は、画面全体をlive regionにせず専用status領域で通知します。

詳しい実機確認項目は [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](./MOBILE_ACCESSIBILITY_TEST_MATRIX.md) にまとめています。

## Privacy

カメラ映像、性能情報、Reliability情報、アクセシビリティ用状態は端末内だけで扱います。

映像アップロード、マイク取得、Analytics / telemetryはありません。

## Release validation

v1.0.0前に以下を両方確認します。

- [MOBILE_ACCESSIBILITY_TEST_MATRIX.md](./MOBILE_ACCESSIBILITY_TEST_MATRIX.md)
- [RELIABILITY_TEST_MATRIX.md](./RELIABILITY_TEST_MATRIX.md)

## Limitations in v0.8.0

- 物理端末・実screen readerでの最終確認はまだ必要
- 長時間Reliabilityマトリクスは引き続き必要
- Adaptive Performance閾値の幅広い端末確認が必要
- 音声録音なし
- AI / 姿勢推定なし

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License. See `LICENSE`.
