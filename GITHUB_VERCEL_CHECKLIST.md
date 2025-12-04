# GitHub & Vercel デプロイ チェックリスト

## 📋 準備確認

- [ ] GitHubアカウント作成済み
- [ ] Vercelアカウント作成済み
- [ ] ローカル環境でダッシュボード動作確認済み

## 📤 GitHub コミット手順

### 1. Gitユーザー設定
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### 2. リモートリポジトリ設定
```bash
# 既存のリモートを確認
git remote -v

# 必要に応じてリモートを追加
git remote add origin https://github.com/your-username/study-dashboard-web.git
```

### 3. ファイルをステージング
```bash
git add .
```

### 4. コミット
```bash
git commit -m "Initial commit: Study Dashboard Web with Vercel Analytics integration"
```

### 5. プッシュ
```bash
git branch -M main
git push -u origin main
```

## 🚀 Vercelデプロイ手順

### 1. Vercel Dashboardへアクセス
https://vercel.com/dashboard

### 2. 新規プロジェクト作成
- 「Add New...」 > 「Project」をクリック
- GitHubリポジトリを検索・選択
- 「Import」をクリック

### 3. プロジェクト設定確認
- **Framework Preset**: Other（Static Site）
- **Root Directory**: ./
- **Build Command**: (empty - press Enter)
- **Output Directory**: ./

### 4. デプロイ
- 「Deploy」ボタンをクリック
- デプロイ完了待機（2-3分）

### 5. Analytics 設定（オプション）
- プロジェクト > Settings > Analytics
- 自動的に有効化されます

## ✅ デプロイ後の確認

### 確認項目
- [ ] ダッシュボードが正常に表示される
- [ ] フォーカスタイマーが動作する
- [ ] ToDoリストが動作する
- [ ] オーディオビジュアライザーが動作する
- [ ] セッション統計が表示される

### Vercel機能確認
- [ ] Web Analytics ダッシュボード表示
- [ ] SpeedInsights データ収集
- [ ] カスタムイベント追跡

## 🔗 便利なリンク

| リソース | URL |
|---------|-----|
| GitHub | https://github.com/your-username/study-dashboard-web |
| Vercel Dashboard | https://vercel.com/dashboard |
| Deployed Site | https://study-dashboard-web.vercel.app |
| Analytics | https://vercel.com/dashboard/study-dashboard-web/analytics |

## 📝 主要ファイル

| ファイル | 説明 |
|---------|------|
| `dashboard.html` | メインUI |
| `vercel.json` | Vercel設定 |
| `package.json` | プロジェクト設定 |
| `vercel-analytics.js` | Analytics統合 |
| `README.md` | プロジェクト説明 |
| `DEPLOYMENT.md` | デプロイガイド |

## ⚠️ 注意事項

1. **初回アナリティクス**
   - データが表示されるまで24時間待機してください

2. **キャッシュクリア**
   - 問題が発生した場合、ブラウザキャッシュをクリア

3. **環境変数**
   - 機密情報は.envファイルに、非機密は.env.exampleに記載

4. **ドメイン**
   - デフォルトは `study-dashboard-web.vercel.app`
   - カスタムドメイン設定後は別のURLになります
