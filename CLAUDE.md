# CLAUDE.md

このファイルは、このリポジトリで Claude Code（および各種 AI コーディングエージェント）が作業するときのガイドです。

## 言語

**ユーザーへの応答・ドキュメント本文・UI 文言・コミットメッセージは必ず日本語で書く。**
コード内の識別子（変数名・関数名・ファイル名・型名等）は英語のままで構いません。コメントは日本語優先。

## プロジェクト概要

「まちのできごと」は、地域のイベント（マルシェ・読書会・福祉カフェ・朝市・ワークショップ等）を **投稿・告知・チケット販売** までワンストップで扱うツールです。ギフト県のみ市・きせ市などの中山間地域を最初のターゲットにしています。

詳細な仕様は [SPEC.md](SPEC.md) を参照してください。

## 現状（2026年4月時点）

- まだ仕様策定 + プロトタイプ段階。本番バックエンドは未着手。
- プロジェクト直下 `_.zip` に既存プロトタイプ（PWA）が入っており、検証用に [_extracted/](_extracted/) に展開済みです。
- プロトタイプは **ビルド不要** で動きます：`index.html` を直接ブラウザで開く（または任意の静的サーバーで配信）だけで起動します。React 18 + Babel standalone を CDN から読み込んでいます。
- データはモック：[_extracted/src/data.js](_extracted/src/data.js) の `window.APP_DATA` を直接編集して画面を確認します。永続化は `localStorage` で「フリ」をしているだけです。

## ディレクトリ構成

```
machinodekigoto/
├── CLAUDE.md            ← このファイル
├── SPEC.md              ← サービス仕様書
├── _.zip                ← 配布用に固めたプロトタイプ
└── _extracted/          ← _.zip を展開したもの（編集はこちら側）
    ├── index.html
    ├── handout.html     ← レポートからの PDF 風配布物
    ├── manifest.webmanifest
    ├── service-worker.js
    ├── src/
    │   ├── app.jsx              ← ルーティング・状態の親
    │   ├── data.js              ← モックデータ（window.APP_DATA）
    │   ├── regions.js           ← 地域マスタ
    │   ├── styles.css
    │   └── components/
    │       ├── top.jsx          ← トップ（探す画面）
    │       ├── detail.jsx       ← イベント詳細・レポート
    │       ├── registration.jsx ← 参加登録フォーム
    │       ├── series.jsx       ← シリーズ一覧/詳細
    │       ├── mine.jsx         ← マイページ
    │       ├── dashboard.jsx    ← 主催者ダッシュボード
    │       ├── regionpicker.jsx
    │       └── shared.jsx       ← Icon, FmtDate などの共通部品
    ├── icons/
    ├── screenshots/
    └── uploads/
```

## ローカルでプロトタイプを動かす

ビルドツール不要。任意の静的サーバーから [_extracted/index.html](_extracted/index.html) を開けば動きます。

```bash
# Python が入っていれば
cd _extracted && python -m http.server 5500
# → http://localhost:5500/

# あるいは npx serve
npx serve _extracted
```

直接 `file://` で開いても多くは動きますが、Service Worker は登録されません（プロトタイプ側でその場合はスキップする実装になっています）。

## 編集時の方針

- **新機能の追加**は、まず [SPEC.md](SPEC.md) の該当セクションを読み、必要なら仕様側を先に更新してから実装に入る。
- 既存ファイルを編集することを優先し、新ファイルの追加は最小限に。とくにドキュメント（`*.md`）は、ユーザーから明示的に依頼されない限り新規作成しない。
- 画面の文言は、和紙・町家のトーン（やわらかい言葉・漢字を立てる）を意識する。`〜してください`より`〜どうぞ`、`登録` より `参加を登録する` のような語尾。
- 配色テーマは `kinari` / `roast` / `matcha` の3種があり、`data-theme` 属性で切替。新しい色を追加する場合は CSS 変数（`--accent` `--ink` 等）に紐付ける。
- 絵文字は **使わない**。ユーザーが明示的に依頼した場合のみ。

## 認証のデモ切替

プロトタイプ右下に「○ 未ログイン(デモ切替)」というボタンがあります。これをクリックすると高田和夫さん（モック主催者）としてログイン状態に切り替わり、マイページ・ダッシュボード・レポート追記などの主催者向け機能が見えます。本実装では Supabase Auth または同等の認証基盤を使う想定です（[SPEC.md](SPEC.md#認証ロール) 参照）。

## 既知の未実装・スタブ

- `+ 新規イベント` → `NewEventStub`（`_extracted/src/components/dashboard.jsx` 末尾）はフォームのみ。保存ロジックなし。
- 通知（おしらせ）は `localStorage` への ♥ 保存のみ。実際にメール/Push は飛ばない。
- 決済・チケット販売は **未実装**（プロトタイプは無料 RSVP のみ）。Stripe Connect 想定で SPEC に記載。
- 地図は SVG の架空マップ。実地図 API（MapLibre / Mapbox / Google Maps）への差し替えが必要。
