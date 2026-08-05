#!/usr/bin/env bash
# 一条命令发布：提交 → push → 本地构建 → 上传部署
#
# 用法：
#   bash deploy/release.sh               # 交互式：手动输入提交信息
#   bash deploy/release.sh "feat: 新增 XXX"   # 直接带提交信息
#
# 说明：
#   - 服务器只有 2G 内存，构建在本地（Mac）完成，避免 OOM
#   - 未指定提交信息时交互式输入；直接传参会跳过交互
#   - 提交信息建议用 Conventional Commits：feat:/fix:/refactor:/docs:/deploy:
set -euo pipefail

cd "$(dirname "$0")/.."   # 切到项目根目录

echo "==> 0. 检查分支"
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  echo "⚠️  当前分支是 $BRANCH，不是 main。请切到 main 再发布。" >&2
  exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "⚠️  没有未提交的改动（工作区干净），无需发布。" >&2
  echo "   如果只是想重新部署现有代码，请直接运行：bash deploy/deploy-local.sh" >&2
  exit 1
fi

# 提交信息：优先取命令行参数，否则交互式输入
COMMIT_MSG="${1:-}"
if [[ -z "$COMMIT_MSG" ]]; then
  read -r -p "提交信息（Conventional Commits，如 feat: 新增XXX）: " COMMIT_MSG
  if [[ -z "$COMMIT_MSG" ]]; then
    echo "⚠️  未输入提交信息，已取消。" >&2
    exit 1
  fi
fi

echo "==> 1. git add + commit"
git add -A
git commit -m "$COMMIT_MSG"

echo "==> 2. git push"
git push origin main

echo "==> 3. 本地构建 + 上传部署"
bash deploy/deploy-local.sh

echo "==> 发布完成 🚀"