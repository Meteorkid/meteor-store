#!/usr/bin/env bash
# 阿里云轻量服务器部署脚本 —— 由 GitHub Actions 远程触发，或手动执行
#
# 作用：git pull → 安装依赖 → 构建 → 重启 PM2
# 与 Vercel 体验一致：你只管 git push，这里自动完成剩下的。
set -euo pipefail

APP_DIR="/var/www/meteor-store"
ENV_FILE="$APP_DIR/.env.production"

cd "$APP_DIR"

# 0. 环境文件必须存在。它不进 git，需要首次部署时手动放到服务器。
#    缺了它，NEXT_PUBLIC_* 无法内联进构建，运行时变量也无从加载。
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE 不存在，请先创建（复制 .env.example，填好全部变量）" >&2
  exit 1
fi

echo "==> git pull"
git pull --ff-only origin main

echo "==> pnpm install"
pnpm install --frozen-lockfile

echo "==> pnpm build"
# 2G 内存机器构建容易 OOM：限制 Node 堆内存（留内存给系统/nginx）+ 建议配 swap
export NODE_OPTIONS="--max-old-space-size=1536"
pnpm build

echo "==> 重启 PM2"
# 首次 start，之后 reload（--update-env 让进程读取最新环境变量）
pm2 reload ecosystem.config.cjs --update-env 2>/dev/null || pm2 start ecosystem.config.cjs

echo "==> 保存进程表"
pm2 save

echo "==> 部署完成"