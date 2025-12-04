#!/bin/bash
set -e

cd /workspaces/study-dashboard-web

echo "📤 Pushing commits to GitHub..."
echo ""

# リモートを確認
echo "🔍 Checking remote..."
git remote -v

echo ""
echo "📊 Current status:"
git status

echo ""
echo "✅ Latest commit:"
git log --oneline -1

echo ""
echo "🚀 Pushing to origin/main..."
git push origin main

echo ""
echo "✅ Push completed successfully!"
git status
