#!/usr/bin/env bash
# ============================================================
# Staging 环境部署脚本
# 用法：bash deploy/deploy-staging.sh
#
# 与生产环境隔离：独立端口、独立 .next、独立 PM2 进程
# ============================================================
set -euo pipefail

STAGING_PORT="${STAGING_PORT:-3001}"
STAGING_PM2_NAME="meteor-store-staging"
PROJECT_DIR="/var/www/meteor-store"
STAGING_DIR="${PROJECT_DIR}/staging"

echo "==> 构建 staging 产物（本地）"
cd "$(dirname "$0")/.."
STAGING=true NEXT_PUBLIC_SITE_URL="${STAGING_URL:-https://staging.imagentx.top}" pnpm build

echo "==> 打包 .next"
tar -czf /tmp/meteor-store-staging-next.tar.gz -C . .next
echo "    产物 $(du -h /tmp/meteor-store-staging-next.tar.gz | cut -f1)"

echo "==> 上传到服务器"
scp /tmp/meteor-store-staging-next.tar.gz "${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/"

echo "==> 服务器端部署"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" bash << 'REMOTE'
set -euo pipefail

STAGING_DIR="/var/www/meteor-store/staging"
STAGING_PORT="${STAGING_PORT:-3001}"
STAGING_PM2_NAME="meteor-store-staging"

# 准备目录
mkdir -p "$STAGING_DIR"
cd /var/www/meteor-store

# 同步依赖（staging 和生产共享 node_modules）
pnpm install --frozen-lockfile || true

cd "$STAGING_DIR"

# 同步源码
cp -r /var/www/meteor-store/src . 2>/dev/null || true
cp /var/www/meteor-store/next.config.ts . 2>/dev/null || true
cp /var/www/meteor-store/tsconfig.json . 2>/dev/null || true
cp /var/www/meteor-store/package.json . 2>/dev/null || true

# 部署 .next
if [[ -d .next ]]; then mv .next .next.rollback; fi
tar -xzf /tmp/meteor-store-staging-next.tar.gz
rm -f /tmp/meteor-store-staging-next.tar.gz

# 启动/重启
export PORT="$STAGING_PORT"
pm2 stop "$STAGING_PM2_NAME" 2>/dev/null || true
pm2 start node_modules/.bin/next --name "$STAGING_PM2_NAME" -- start -p "$STAGING_PORT" || true
pm2 restart "$STAGING_PM2_NAME" --update-env
pm2 save

echo "==> Staging 部署完成，端口: $STAGING_PORT"
echo "    BUILD_ID: $(cat .next/BUILD_ID)"
REMOTE

echo ""
echo "==> Staging 地址: ${STAGING_URL:-http://localhost:$STAGING_PORT}"
echo "==> 运行冒烟测试: STAGING_URL=${STAGING_URL:-http://localhost:$STAGING_PORT} pnpm test:e2e:smoke"
