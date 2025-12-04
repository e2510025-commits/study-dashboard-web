# Study Dashboard Web

Windowsアプリから移植されたWeb版スタディダッシュボード。フォーカスタイマー、ToDoリスト、オーディオビジュアライザー、セッション統計を備えた包括的な学習支援ツールです。

## 🎯 機能

### フォーカスタイマー
- ポモドーロ・テクニック対応（25分フォーカス + 5分短休憩 + 15分長休憩）
- セッションカウント記録
- カスタマイズ可能な時間設定
- 音声通知機能

### オーディオビジュアライザー
- リアルタイムスペクトラム表示（FFT処理）
- 周波数分析と可視化
- マイク入力対応（利用可能な場合）
- 感度・音量コントロール

### ToDoリスト
- タスク追加・削除・完了管理
- リアルタイム統計
- ローカルストレージで自動保存

### セッション統計
- 14日間の平均集中時間
- ベストデイ検出
- 週間棒グラフ表示
- 最近のセッション履歴
- 過去7日間の詳細分析

## 🚀 デプロイ

### 前提条件
- Git
- Vercelアカウント

### Vercelへのデプロイ手順

1. **GitHubにリポジトリをプッシュ**
```bash
git add .
git commit -m "Initial commit: Study Dashboard Web"
git push origin main
```

2. **Vercelでデプロイ**
   - [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - Framework: 「Other」を選択
   - デプロイをクリック

3. **Vercel SpeedInsights & Web Analyticsの有効化**
   - Vercelプロジェクト設定で自動的に有効化されます
   - カスタムイベント追跡は `vercel-analytics.js` に実装済み

## 🔧 ローカル開発

### サーバーの起動
```bash
python3 -m http.server 8000
```

http://localhost:8000/dashboard.html にアクセス

## 📊 ファイル構成

```
study-dashboard-web/
├── dashboard.html              # メインUI
├── index.html                 # シンプルなホームページ
├── styles.css                 # スタイルシート
├── focus-timer.js             # フォーカスタイマー機能
├── audio-visualizer.js        # オーディオビジュアライザー
├── tasks-widget.js            # ToDoリスト機能
├── session-stats.js           # セッション統計機能
├── vercel-analytics.js        # Vercel統合
├── vercel.json                # Vercel設定
├── .gitignore                 # Git除外設定
└── README.md                  # このファイル
```

## 💾 データ保存

- 全データはブラウザのLocalStorageに自動保存されます
- ブラウザのキャッシュをクリアするとデータが失われます

## 🔍 Vercel統合機能

### Web Analytics
- ページビュー数の追跡
- セッション完了イベントの記録
- タスク完了イベントの記録

### SpeedInsights
- 実際のUser Experience メトリクスの測定
- Core Web Vitals の監視
- パフォーマンス最適化の提案

## 🎨 スタイル

- グラデーション背景（青系）
- レスポンシブデザイン
- ダークモード対応

## ⚙️ ブラウザ互換性

- Chrome/Chromium
- Firefox
- Safari
- Edge

## 📝 ライセンス

MIT License

## 🤝 貢献

改善提案やバグ報告は、GitHubのIssuesからお願いします。
