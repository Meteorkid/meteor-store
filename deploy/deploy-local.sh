#!/usr/bin/env bash
# 本地构建 + 上传产物 的部署脚本（半自动）
#
# 为什么有它：服务器只有 2G 内存，`pnpm build`（Next 16 Turbopack）会 OOM 被杀，
# 导致「git push 自动部署」每次都在构建阶段失败、线上一直是旧版本。
# 本脚本把构建从服务器搬到本地（Mac 内存充足），只把产物 .next 上传到服务器。
#
# 用法：
#   1. 代码提交并 push 到 main（脚本会校验本地 HEAD 与 origin/main 一致）
#   2. 运行：  bash deploy/deploy-local.sh
#
# 服务器用户：默认 root（PM2 与应用目录以 root 运行，无 deploy 用户）。
# 若将来切换为独立部署用户，可用环境变量覆盖：DEPLOY_USER=deploy bash deploy/deploy-local.sh
#
# 流程：本地生产构建 → 打包 .next → scp 上传 → 服务器替换 .next 并重启 PM2
set -euo pipefail

# 服务器 SSH 用户默认 root：服务器上无 deploy 用户，PM2 与应用目录均以 root 运行。
# 可用环境变量 DEPLOY_USER 覆盖。
SERVER="${DEPLOY_USER:-root}@47.120.20.26"
APP_DIR="/var/www/meteor-store"
TAR="/tmp/meteor-store-next.tar.gz"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# 服务器 host key 固定在仓库内（deploy/known_hosts），拒绝陌生主机密钥。
# 换服务器 / 重装 SSH 时需重新生成：ssh-keyscan <host> > deploy/known_hosts
SSH_OPTS=(-o "UserKnownHostsFile=$SCRIPT_DIR/known_hosts" -o StrictHostKeyChecking=yes)

echo "==> 0. 检查本地工作区已提交，且 HEAD 已 push 到 origin/main"
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
git fetch origin main
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then
  echo "⚠️  本地 main 与 origin/main 不一致（有未 push 的提交或落后远端）。" >&2
  echo "   请先 git push / git pull 对齐后再部署。" >&2
  exit 1
fi

echo "==> 1. 本地生产构建（NEXT_PUBLIC_* 与线上一致，见 .env.production）"
export NODE_ENV=production
SKIP_TYPE_CHECK=1 pnpm build

echo "==> 2. 打包 .next（排除 .next/dev 开发缓存，避免产物膨胀到数百 MB）"
rm -f "$TAR"
tar -czf "$TAR" --exclude='.next/dev' -C . .next
echo "   产物 $(du -h "$TAR" | cut -f1)"

echo "==> 3. 上传 .next 到服务器"
scp "${SSH_OPTS[@]}" "$TAR" "$SERVER:$APP_DIR/.next.tar.gz"

echo "==> 4. 服务器同步源码 + 替换 .next + 重启 PM2"
ssh "${SSH_OPTS[@]}" "$SERVER" bash -s <<'REMOTE'
set -euo pipefail
cd /var/www/meteor-store
# 直连 GitHub 官方源。不用第三方镜像（如 ghfast.top）：镜像可投毒，
# 服务器会执行仓库里的代码与安装脚本，等于把供应链交给陌生中间人。
git remote set-url origin https://github.com/Meteorkid/meteor-store.git 2>/dev/null || true
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
# 安装失败必须终止部署——带着旧 node_modules 跑新产物是未定义行为
pnpm install --frozen-lockfile
# 安装/更新 logrotate 配置（公安备案：日志留存 ≥ 60 天）—— root 权限走 sudo
# logrotate.conf 指向 /var/log/meteor-store/pm2-*.log，目录不存在的话 PM2 写不进去，
# missingok 会让 logrotate 静默跳过，于是日志留存这项直接落空。
sudo mkdir -p /var/log/meteor-store
sudo cp deploy/logrotate.conf /etc/logrotate.d/imagentx.top
# 同步 nginx 配置（含日志格式声明）—— root 权限走 sudo
#
# **先备份再覆盖**：nginx -t 只能校验「已经装好的整份配置」，没法预检一个游离文件
# （conf.d 的 include 是 *.conf，改名放进去根本不会被读到）。所以必须先落到位再校验，
# 那就得自己保证校验失败时能把旧配置放回去——否则线上配置已被覆盖，
# 下一次 reload 或机器重启时 nginx 直接起不来。
NGINX_CONF=/etc/nginx/conf.d/imagentx.top.conf
sudo cp -f "$NGINX_CONF" "$NGINX_CONF.bak" 2>/dev/null || true
sudo cp deploy/nginx.conf "$NGINX_CONF"
if sudo nginx -t; then
  sudo nginx -s reload
else
  echo "ERROR: 新的 nginx 配置校验失败，已回滚到上一版" >&2
  if [[ -f "$NGINX_CONF.bak" ]]; then
    sudo cp -f "$NGINX_CONF.bak" "$NGINX_CONF"
    sudo nginx -t && sudo nginx -s reload
  fi
  exit 1
fi
# 停止 PM2 释放内存，备份旧产物，解压新产物
pm2 stop meteor-store 2>/dev/null || true
rm -rf .next.rollback
if [[ -d .next ]]; then mv .next .next.rollback; fi
tar -xzf .next.tar.gz
rm -f .next.tar.gz
pm2 restart meteor-store --update-env
pm2 save
echo "==> 部署完成，BUILD_ID: $(cat .next/BUILD_ID)"
REMOTE

echo "==> 验证"
sleep 3
curl -s -o /dev/null -w "%{http_code}" "https://www.imagentx.top/zh/apps/tollow/trial"
echo "  <- trial 路由状态码"

# 预热 next/image 缓存。
#
# 部署会整个换掉 .next，**图片优化缓存（.next/cache/images）也跟着没了**。
# 缓存空的时候每张封面都要现做一次 sharp 转换，而这台机器只有 2G 内存、
# 空闲常年在 200MB 上下——头几个访客会撞上超时或失败，看到的就是一张裂图。
# 这里先把产品列表页的封面挨个拉一遍，把缓存填热再放用户进来。
# 逐个串行、失败不阻断部署（|| true）：预热本身不成功也只是回到原来的状态。
echo "==> 预热 next/image 缓存（部署清空了 .next/cache/images）"
warmed=0
for id in $(grep -oE "^    id: '[a-z0-9-]+'" src/data/products.ts | sed "s/.*'\(.*\)'/\1/"); do
  for w in 375 768 1536; do
    curl -s -o /dev/null --max-time 20 \
      "https://www.imagentx.top/_next/image?url=%2Fproducts%2F${id}%2Fcover.webp&w=${w}&q=75" || true
  done
  warmed=$((warmed + 1))
done
echo "  已预热 $warmed 个产品封面 × 3 种宽度"
