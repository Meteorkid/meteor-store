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
# 阿里云访问 GitHub 不稳定：用镜像加速 + 失败重试
git remote set-url origin https://ghfast.top/https://github.com/Meteorkid/meteor-store.git 2>/dev/null || true
for i in 1 2 3; do
  git pull --ff-only origin main && break
  echo "git pull 第 $i 次失败，重试中..."
  sleep 5
done

echo "==> pnpm install"
pnpm install --frozen-lockfile

echo "==> 停止 PM2（释放内存给构建）"
pm2 stop meteor-store 2>/dev/null || true
sync && echo 3 > /proc/sys/vm/drop_caches

echo "==> pnpm build"
# 清理可能残留的构建进程和锁文件
pkill -f 'next build' 2>/dev/null || true
rm -f .next/build-id.lock 2>/dev/null || true
# 2G 内存机器构建容易 OOM：
# - 限制 Node 堆内存 + 停 PM2 释放内存 + drop_caches
# - 跳过 TypeScript 检查（CI 已跑过 tsc --noEmit，部署时无需重复）
export NODE_OPTIONS="--max-old-space-size=1024"
SKIP_TYPE_CHECK=1 pnpm build

echo "==> 启动 PM2"
pm2 reload ecosystem.config.cjs --update-env 2>/dev/null || pm2 start ecosystem.config.cjs

echo "==> 保存进程表"
pm2 save

echo "==> 部署完成"