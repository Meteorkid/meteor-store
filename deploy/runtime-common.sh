#!/usr/bin/env bash
# 由部署入口source；备份含PM2环境，只写root私有目录，不进入部署输出。
METEOR_NODE=/usr/local/bin/node
METEOR_CONFIG_CHANGED=0
METEOR_PM2_CHANGED=0
METEOR_RUNTIME_BACKUP=

meteor_assert_product_idle() {
  "$METEOR_NODE" --env-file=.env.production --experimental-strip-types --disable-warning=MODULE_TYPELESS_PACKAGE_JSON deploy/assert-idle-product-updates.mjs
}

meteor_prepare_runtime() {
  [[ "$(id -u)" == "0" ]] || { echo "ERROR: 当前生产运行与日志配置由root管理" >&2; return 1; }
  meteor_assert_product_idle
  METEOR_RUNTIME_BACKUP=$(mktemp -d /var/backups/meteor-store-runtime-XXXXXXXX)
  chmod 700 "$METEOR_RUNTIME_BACKUP"
  cp -p /etc/nginx/conf.d/imagentx.top.conf "$METEOR_RUNTIME_BACKUP/nginx.conf"
  cp -p /etc/logrotate.d/imagentx.top "$METEOR_RUNTIME_BACKUP/logrotate.conf"
  sha256sum /etc/logrotate.d/nginx > "$METEOR_RUNTIME_BACKUP/default-nginx-logrotate.sha256"
  "$METEOR_NODE" deploy/pm2-runtime.mjs snapshot "$METEOR_RUNTIME_BACKUP/pm2-before.json"
  echo "运行回滚目录：$METEOR_RUNTIME_BACKUP"
}

meteor_install_runtime_config() {
  mkdir -p /var/log/meteor-store
  "$METEOR_NODE" deploy/migrate-nginx-logs.mjs apply "$METEOR_RUNTIME_BACKUP/logs"
  METEOR_CONFIG_CHANGED=1
  install -m 644 deploy/logrotate.conf /etc/logrotate.d/imagentx.top
  install -m 644 deploy/nginx.conf /etc/nginx/conf.d/imagentx.top.conf
  # 整份配置一起验证，才能发现系统通配规则与站点规则的重复。
  /usr/sbin/logrotate -d /etc/logrotate.conf
  sha256sum -c "$METEOR_RUNTIME_BACKUP/default-nginx-logrotate.sha256"
  nginx -t
  nginx -s reload
}

meteor_stop_runtime() {
  meteor_assert_product_idle
  METEOR_PM2_CHANGED=1
  "$METEOR_NODE" deploy/pm2-runtime.mjs stop
}

meteor_activate_runtime() {
  METEOR_PM2_CHANGED=1
  "$METEOR_NODE" deploy/pm2-runtime.mjs activate
}

meteor_restore_runtime() {
  [[ -n "$METEOR_RUNTIME_BACKUP" ]] || return 0
  local failed=0
  # 先移回同一inode，再恢复旧配置；不能把备份日志覆盖部署后的新增行。
  if [[ -f "$METEOR_RUNTIME_BACKUP/logs/nginx-log-migration.json" ]]; then
    "$METEOR_NODE" deploy/migrate-nginx-logs.mjs rollback "$METEOR_RUNTIME_BACKUP/logs" || failed=1
  fi
  if [[ "$METEOR_CONFIG_CHANGED" == "1" && "$failed" == "0" ]]; then
    cp -p "$METEOR_RUNTIME_BACKUP/nginx.conf" /etc/nginx/conf.d/imagentx.top.conf || failed=1
    cp -p "$METEOR_RUNTIME_BACKUP/logrotate.conf" /etc/logrotate.d/imagentx.top || failed=1
    nginx -t && nginx -s reload || failed=1
  fi
  if [[ "$METEOR_PM2_CHANGED" == "1" ]]; then
    "$METEOR_NODE" deploy/pm2-runtime.mjs restore "$METEOR_RUNTIME_BACKUP/pm2-before.json" || failed=1
  fi
  [[ "$failed" == "0" ]] || echo "ERROR: 自动回滚未完整完成，保留 $METEOR_RUNTIME_BACKUP 供恢复" >&2
  return "$failed"
}
