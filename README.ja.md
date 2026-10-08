# Practice Mirror

[![GitHub Pages](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ttomohisa/htmlapps-practice-mirror/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Single HTML](https://img.shields.io/badge/distribution-single%20HTML-16624F)](https://ttomohisa.github.io/htmlapps-practice-mirror/)

[English README](README.md)

スポーツ・ダンス・トレーニング・姿勢確認などの自主練で、カメラ映像を数秒遅らせて表示する練習ミラーです。動き終わって画面を見ると、ちょうどさっきの自分をその場で確認できます。

## 🚀 デモ

### [GitHub PagesでPractice Mirrorを開く](https://ttomohisa.github.io/htmlapps-practice-mirror/)

GitHub Pagesから最初のHTMLを読み込んだ後、カメラ取得・遅延表示・Review・ガイド・性能監視・クリップ作成はブラウザ内で処理されます。カメラ映像をアプリから外部へアップロードせず、マイク音声も要求しません。

[![Practice Mirrorの画面](assets/screenshot.png)](https://ttomohisa.github.io/htmlapps-practice-mirror/)

スマートフォン版: [assets/screenshot-mobile.png](assets/screenshot-mobile.png)

## 主な機能

- **遅延ミラー** — 3 / 5 / 10 / 15秒、または1〜30秒の自由設定。
- **Review履歴を10〜180秒で設定** — デフォルトは10秒。約10秒たまればReviewを使え、その後は設定した上限まで履歴を保持します。
- **細かく見返す** — 0.25× / 0.5× / 1× / 2×、シーク、1コマ戻る/進む。
- **フォーム確認用ガイド** — 縦・横ガイドを追加してドラッグ。キーボードでも位置調整できます。
- **左右反転・カメラ操作** — 表示の左右反転、複数カメラ端末での前面/背面切替、全画面、Screen Wake Lock。
- **必要なReviewだけ保存** — 固定したReviewをシーク可能なWebMとして保存。ダウンロード前にduration metadataを端末内で補正します。
- **スマホ向けPractice UI** — タップ領域、safe-area、横向きレイアウト、操作UI自動非表示、スマホでは操作パネルを初期状態で閉じます。
- **負荷と長時間利用への対策** — 継続負荷時は処理品質を段階的に下げ、圧縮映像キューは上限管理。復旧可能なカメラ/codec異常は回数制限付きで再初期化します。
- **日本語 / English** — 同じ単一HTML内で切り替え。
- **ローカル処理** — カメラ映像、Review、ガイド、性能/Reliability情報はブラウザ内で扱います。

## すぐに使う

### Webで使う

[デモを開く](https://ttomohisa.github.io/htmlapps-practice-mirror/)だけで利用できます。インストールやアカウント登録は不要です。**カメラを開始** を押したときだけ、ブラウザがカメラ権限を確認します。

### ダウンロードして使う

1. リポジトリから [practice-mirror.html](practice-mirror.html) をダウンロードします。
2. WebCodecsとカメラ利用に対応した現在のブラウザで開きます。
3. 遅延秒数を選び、**カメラを開始** を押します。

HTMLには必要なruntime依存を内包しており、CDNは不要です。ただし `file://` で開いたローカルHTMLへのカメラ許可はブラウザ/OSによって異なります。ローカルファイルでカメラが使えない場合はHTTPSのGitHub Pages版を利用してください。

### ビルドして使う（advance）

1. このリポジトリをダウンロードまたはクローンします。
2. Windowsで `build-standalone.bat` をダブルクリックするか、PowerShellで `./build-standalone.ps1` を実行します。
3. 初回だけ `dependencies.json` / `dependencies.lock.json` で固定された依存パッケージを取得します。
4. `dist/index.html`、`dist/index.self-extract.html`、リポジトリ直下の `practice-mirror.html` が生成されます。
5. 読みやすい版または自己展開版の単一HTMLを任意の場所へコピーして使えます。

通常のPowerShellビルドにPython、Node.js、ローカルWebサーバーは不要です。Node.js / Playwrightはリリース用スクリーンショットのCIだけで使い、配布アプリには含まれません。

## 使い方

1. 遅延表示の時間を3 / 5 / 10 / 15秒、または1〜30秒の自由設定から選びます。
2. Reviewを10秒より長く残したい場合は、開始前に **Review設定** を開いて10〜180秒の上限を指定します。
3. **カメラを開始** を押し、カメラ利用を許可します。
4. Warm-upが終わると、選択した秒数だけ遅れた映像が表示されます。
5. スマートフォンでは必要なときだけ **操作** を開き、ガイド・左右反転・カメラ切替・全画面・画面スリープ防止を使います。
6. 約10秒の履歴がたまると **Review** を使えます。その後は設定した上限まで履歴が伸びます。
7. 再生速度、シーク、コマ送りでフォームを確認します。
8. 残したい場合だけ **クリップ保存** を開いて保存します。
9. **練習に戻る** で固定Reviewを捨てて遅延バッファを作り直すか、**終了** でカメラを解放します。

### Review設定

Review履歴はデフォルト10秒です。開始前に10・30・60・180秒のボタン、または10〜180秒の整数入力で上限を指定できます。ボタンを選ぶと入力エラーも解消します。言語を切り替えても入力途中の値と検証メッセージは維持され、再読み込みすると最後に有効だった設定だけを復元します。

設定を180秒にしても3分待つ必要はありません。約10秒でReviewが使えるようになり、その後は圧縮履歴が設定上限まで伸びます。履歴を長くすると端末メモリ使用量が増え、180秒では処理品質によって圧縮映像だけでも数十MB規模になる場合があります。

### Review再生と保存

Reviewでは0.25× / 0.5× / 1× / 2×再生、シーク、1コマ戻る/進むができます。シークやflush後にDecoderを再開するときは、必ず実際のkey frameから復号をやり直します。

保存はWebMです。固定したReviewを一時Canvas / MediaRecorderへ端末内で再構成し、内包した `fix-webm-duration` でduration metadataを補正してからダウンロードします。これにより通常の動画プレイヤーでシークできるファイルにします。長いReviewの保存は、クリップ時間と同程度かかる場合があります。

ガイド線と左右反転表示は保存動画へ焼き込みません。音声トラックも作成しません。

### ガイドのキーボード操作

| キー | 動作 |
| --- | --- |
| 矢印キー | 選択したガイドを1%移動 |
| Shift + 矢印 | 5%移動 |
| Home / End | 端へ移動 |
| Delete / Backspace | 選択したガイドを削除 |

## GitHub Pagesで公開する

このリポジトリには、必要なruntimeを内包したstandalone HTMLを再ビルドし、`dist/` をGitHub Pagesへ自動公開するワークフローが含まれています。

1. リポジトリ名を `htmlapps-practice-mirror` としてGitHubへプッシュします。
2. **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択します。
3. `main` ブランチへプッシュするか、Actions画面から **Deploy standalone app to GitHub Pages** を手動実行します。
4. ビルド成功後、`https://ttomohisa.github.io/htmlapps-practice-mirror/` で公開されます。

`main` へのpush時には、固定済みdependency lockから単一HTMLを再生成し、リポジトリ契約・外部通信防止を検査し、build artifactを保存してから `dist/` を公開します。

## 開発とビルド

```text
.
├─ src/index.template.html                 # アプリ本体のテンプレート
├─ assets/favicon.svg                     # favicon / 左上アプリアイコンの正
├─ assets/screenshot*.png                 # 日英・PC/スマホのスクリーンショット
├─ dependencies.json                      # 依存パッケージ定義
├─ dependencies.lock.json                 # tarball URL / SHA-256 lock
├─ build-standalone.bat                   # Windows用ビルド入口
├─ build-standalone.ps1                   # 単一HTML生成処理
├─ practice-mirror.html                   # 生成済みの読みやすい単一HTML
├─ dist/index.html                        # GitHub Pages用生成物
├─ dist/index.self-extract.html           # gzip自己展開版
├─ scripts/check-repository.ps1           # ビルド + アプリ固有の退行チェック
└─ .github/workflows/
   ├─ build-standalone.yml                # Pull Request時のビルド検証
   ├─ capture-release-screenshots.yml     # Review/保存/レイアウト検証 + スクショ
   └─ deploy-pages.yml                    # mainからPagesへ自動公開
```

### 依存ライブラリを更新する

`fix-webm-duration` はexact versionで固定しています。更新する場合:

1. `dependencies.json` のversionを変更します。
2. `./scripts/sync-dependency-lock.ps1` を実行し、tarball URLとSHA-256 lockを更新します。
3. `./scripts/check-repository.ps1` を実行し、standalone size reportも確認してからcommitします。

ビルド処理は以下を自動で行います。

- cacheにない場合だけ固定済みnpm tarballを取得
- lockされたtarball SHA-256を検証
- 対象assetを単一HTMLへ内包し、効果がある場合はgzip圧縮
- `assets/favicon.svg` の同一SVGをbrowser faviconと左上アプリアイコンへ埋め込み
- 未置換placeholderや禁止されたruntime通信パターンを検査
- 読みやすいstandalone HTMLとself-extract版を検証
- dependency / self-extract / build-size manifestを生成
- 読みやすいbuildを `practice-mirror.html` へコピー

## プライバシーと通信防止

生成された単一HTMLには以下の境界があります。

- `connect-src 'none'` を含むContent Security Policy
- 外部runtime script / stylesheet / font / Analytics / telemetry / media upload endpointなし
- カメラ取得は `audio:false`
- `fix-webm-duration` は単一HTML内のasset bundleから、Review保存時だけローカルBlob URLで読み込み
- raw frame履歴ではなく、時間・packet数を制限した圧縮映像履歴
- 一時Blob URLは端末内だけで使い、処理後に解放

GitHub Pages版では最初のHTML配信は発生しますが、カメラ映像やReview映像をアプリから送信しません。生成済み単一HTML自体は実行時サーバー依存を持ちませんが、ローカルファイルへのカメラ許可はブラウザ依存です。

## 制限事項

- 遅延ミラー本体にはWebCodecs（`VideoEncoder` / `VideoDecoder`）と `requestVideoFrameCallback()` が必要です。
- カメラ利用にはブラウザが認める安全なコンテキストが必要です。`file://` のカメラ挙動はブラウザ/OSで異なります。
- v1.0.0のReview保存は、シーク可能性を優先してWebMのみです。
- Review履歴を長くするとメモリ使用量が増えます。180秒では圧縮映像だけでも数十MB規模になる場合があります。
- 長いReviewの保存はクリップ時間と同程度かかる場合があります。
- Fullscreen、Screen Wake Lock、カメラ切替、background動作にはブラウザ/OS差があります。
- 長時間のカメラ処理はCPUとバッテリーを使用します。
- 音声録音は意図的に含めていません。
- AI姿勢推定や自動採点は意図的に含めていません。

## 使用ライブラリ

| ライブラリ | バージョン | ライセンス | 用途 |
| --- | ---: | --- | --- |
| fix-webm-duration | 1.0.6 | MIT | MediaRecorderのWebMへduration情報を補い、保存したReviewをシーク可能にする |

詳細は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を確認してください。

## コントリビューション

バグ報告や機能提案はIssueからお願いします。開発への参加方法は [CONTRIBUTING.md](CONTRIBUTING.md) を確認してください。

## ライセンス

Copyright © 2026 ttomohisa

このプロジェクトは [MIT License](LICENSE) で公開されています。
