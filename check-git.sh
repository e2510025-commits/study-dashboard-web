#!/bin/bash
cd /workspaces/study-dashboard-web

# Git設定
echo "Setting Git config..."
git config --global user.email "dev@example.com"
git config --global user.name "Study Dashboard"

# Git状態確認
echo "=== Git Status ==="
git status

echo ""
echo "=== Git Log (last 5) ==="
git log --oneline -5 2>/dev/null || echo "No commits yet"

echo ""
echo "=== Untracked Files ==="
git ls-files --others --exclude-standard 2>/dev/null || echo "No untracked files"

echo ""
echo "=== Modified Files ==="
git diff --name-only 2>/dev/null || echo "No modified files"
