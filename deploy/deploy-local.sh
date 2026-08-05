#!/usr/bin/env bash
# 本地构建 + 上传产物 的部署脚本（半自动）
#
# 为什么有它：服务器只有 2G 内存，`pnpm build`（Next 16 Turbopack）会 OOM 被杀，
# 导致「git push 自动部署」每次都在构建阶段失败、线上一直是旧版本。
# 本脚本把构建从服务器搬到本地（Mac 内存充足），只把产物 .next 上传到服务器。
#
# 用法：
#   1. 代码提交并 push 到 main（本地构建基于当前工作区，务必先 push 保证源码同步）
#   2. 运行：  bash deploy/deploy-local.sh
#
# 流程：本地生产构建 → 打包 .next → scp 上传 → 服务器替换 .next 并重启 PM2
set -euo pipefail

SERVER="root@47.120.20.26"
APP_DIR="/var/www/meteor-store"
TAR="/tmp/meteor-store-next.tar.gz"

echo "==> 0. 检查本地工作区已提交（构建基于当前代码，需已 push 保证服务器源码同步）"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "⚠️  检测到未提交/未暂存的改动！" >&2
  echo "   请先提交并 push，再运行本脚本，否则服务器源码与构建产物可能不一致。" >&2
  exit 1
fi
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "⚠️  当前分支是 $CURRENT_BRANCH，不是 main。请切到 main 再部署。" >&2
  exit 1
fi

echo "==> 1. 本地生产构建（NEXT_PUBLIC_* 与线上一致，见 .env.production）"
export NODE_ENV=production
SKIP_TYPE_CHECK=1 pnpm build

echo "==> 2. 打包 .next"
rm -f "$TAR"
tar -czf "$TAR" -C . .next
echo "   产物 $(du -h "$TAR" | cut -f1)"

echo "==> 3. 上传 .next 到服务器"
scp -o StrictHostKeyChecking=no "$TAR" "$SERVER:$APP_DIR/.next.tar.gz"

echo "==> 4. 服务器同步源码 + 替换 .next + 重启 PM2"
ssh -o StrictHostKeyChecking=no "$SERVER" "
  set -euo pipefail
  cd $APP_DIR
  # 同步源码与依赖（只安装，不构建，避免 OOM）
  git remote set-url origin https://ghfast.top/https://github.com/Meteorkid/meteor-store.git 2>/dev/null || true
  for i in 1 2 3; do
    if git pull --ff-only origin main; then break; fi
    echo 'git pull 第 '\$i' 次失败，重试中...'
    sleep 5
  done
  pnpm install --frozen-lockfile || true
  # 停止 PM2 释放内存，备份旧产物，解压新产物
  pm2 stop meteor-store 2>/dev/null || true
  rm -rf .next.rollback
  if [[ -d .next ]]; then mv .next .next.rollback; fi
  tar -xzf .next.tar.gz
  rm -f .next.tar.gz
  pm2 restart meteor-store --update-env
  pm2 save
  echo '==> 部署完成，BUILD_ID:' \$(cat .next/BUILD_ID)
"

echo "==> 验证"
sleep 3
curl -s -o /dev/null -w "%{http_code}" "https://www.imagentx.top/zh/apps/tollow/trial"
echo "  <- trial 路由状态码"