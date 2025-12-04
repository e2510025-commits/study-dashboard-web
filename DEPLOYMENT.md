# Vercelデプロイガイド

## 準備

### 1. GitHubアカウント
- GitHubでアカウントを作成
- このリポジトリをGitHubにプッシュ

### 2. Vercelアカウント
- [Vercel公式サイト](https://vercel.com)にアクセス
- GitHubアカウントでサインアップ

## デプロイ手順

### ステップ1: コミットしてプッシュ

```bash
# リポジトリディレクトリに移動
cd study-dashboard-web

# Gitユーザー設定
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# ファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Study Dashboard Web with Vercel Analytics"

# メインブランチにプッシュ
git push origin main
```

### ステップ2: Vercelでプロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「Add New... > Project」をクリック
3. GitHubリポジトリを検索・選択
4. インポートボタンをクリック

### ステップ3: プロジェクト設定

プロジェクト設定画面で以下を確認：

- **Framework Preset**: Other（静的サイト）
- **Root Directory**: ./（ルート）
- **Build Command**: エンターキーを押して スキップ
- **Output Directory**: ./（カレントディレクトリ）

### ステップ4: 環境変数設定（オプション）

分析IDを設定する場合：

1. プロジェクト設定 > Environment Variables
2. 新しい環境変数を追加
3. Key: `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`
4. Value: Vercelダッシュボードから取得したID

## デプロイ後

### 自動機能

Vercelへのデプロイ後、以下が自動的に有効になります：

✅ **Web Analytics**
- ページビュー
- ユーザーセッション
- リアルタイム分析

✅ **SpeedInsights**
- Core Web Vitals測定
- ページロード時間
- インタラクティビティ測定

### カスタムイベント追跡

以下のイベントが自動的に追跡されます：

- **SessionCompleted**: フォーカスセッション完了時
  - `duration`: セッション時間（分）
  
- **TaskCompleted**: ToDoタスク完了時
  - `taskName`: タスク名

- **PageView**: ページ訪問時
  - `path`: ページパス
  - `referrer`: リファラー情報

## トラブルシューティング

### デプロイが失敗する場合

1. **GitHub接続を確認**
   - Vercelでリポジトリが正しく選択されているか確認
   - GitHubの認可状態を確認

2. **ファイルを確認**
   - `dashboard.html` が存在しているか
   - すべてのJSファイルが正しく配置されているか

3. **Vercelログを確認**
   - デプロイページで詳細なエラーログを確認

### アナリティクスが表示されない場合

1. Vercelプロジェクト設定を確認
2. Analytics IDが正しく設定されているか確認
3. ブラウザのコンソールでエラーを確認
4. 24時間待機（初回データ集計）

## カスタマイズ

### 独自ドメインを設定

1. Vercelプロジェクト > Settings > Domains
2. 「Add」をクリック
3. ドメイン名を入力
4. DNSレコードを設定

### 本番環境以外の設定

1. Preview環境へのアクセス制限
2. 環境別の環境変数設定
3. キャッシュ戦略の調整

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Analytics](https://vercel.com/analytics)
- [Web Vitals](https://web.dev/vitals/)
