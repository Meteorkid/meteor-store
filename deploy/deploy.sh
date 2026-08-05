#!/usr/bin/env bash
# 阿里云轻量服务器部署脚本 —— 由 GitHub Actions 远程触发，或手动执行
#
# 作用：git pull → 安装依赖 → 构建 → 重启 PM2
# 与 Vercel 体验一致：你只管 git push，这里自动完成剩下的。
set -euo pipefail

APP_DIR="/var/www/meteor-store"
ENV_FILE="$APP_DIR/.env.production"
LOCK_FILE="/var/lock/meteor-store-deploy.lock"
ROLLBACK_DIR="$APP_DIR/.next.rollback"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "ERROR: 已有部署在进行，拒绝重叠构建" >&2
  exit 1
fi

BUILD_STARTED=0
ROLLBACK_READY=0
DEPLOY_FINISHED=0

restore_previous_build() {
  local status=$?
  trap - EXIT INT TERM

  if [[ "$DEPLOY_FINISHED" != "1" ]]; then
    echo "ERROR: 部署失败，正在恢复上一份构建产物" >&2
    if [[ "$BUILD_STARTED" == "1" ]]; then
      rm -rf "$APP_DIR/.next"
      if [[ "$ROLLBACK_READY" == "1" && -d "$ROLLBACK_DIR" ]]; then
        mv "$ROLLBACK_DIR" "$APP_DIR/.next"
      fi
    fi
    pm2 reload "$APP_DIR/ecosystem.config.cjs" --update-env 2>/dev/null \
      || pm2 start "$APP_DIR/ecosystem.config.cjs" 2>/dev/null \
      || true
    pm2 save >/dev/null 2>&1 || true
  fi

  if [[ "$status" -eq 0 && "$DEPLOY_FINISHED" != "1" ]]; then
    status=1
  fi
  exit "$status"
}

trap restore_previous_build EXIT INT TERM

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
pull_succeeded=0
for i in 1 2 3; do
  if git pull --ff-only origin main; then
    pull_succeeded=1
    break
  fi
  echo "git pull 第 $i 次失败，重试中..."
  sleep 5
done
if [[ "$pull_succeeded" != "1" ]]; then
  echo "ERROR: git pull 连续失败，终止部署" >&2
  exit 1
fi

echo "==> pnpm install"
pnpm install --frozen-lockfile

echo "==> 停止 PM2（释放内存给构建）"
pm2 stop meteor-store 2>/dev/null || true
sync && echo 3 > /proc/sys/vm/drop_caches

echo "==> pnpm build"
# 保留上一份完整产物；新构建失败时 EXIT trap 会自动恢复并重启 PM2。
rm -rf "$ROLLBACK_DIR"
if [[ -d .next ]]; then
  mv .next "$ROLLBACK_DIR"
  ROLLBACK_READY=1
fi
BUILD_STARTED=1
# 2G 内存机器构建容易 OOM：
# - 限制 Node 堆内存 + 停 PM2 释放内存 + drop_caches
# - 跳过 TypeScript 检查（CI 已跑过 tsc --noEmit，部署时无需重复）
export NODE_OPTIONS="--max-old-space-size=1024"
SKIP_TYPE_CHECK=1 pnpm build

echo "==> 启动 PM2"
pm2 reload ecosystem.config.cjs --update-env 2>/dev/null || pm2 start ecosystem.config.cjs

echo "==> 保存进程表"
pm2 save

rm -rf "$ROLLBACK_DIR"
DEPLOY_FINISHED=1
trap - EXIT INT TERM

echo "==> 部署完成"
