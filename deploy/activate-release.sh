#!/usr/bin/env bash
# 只负责服务器已上传产物的激活；构建仍在本地/Runner，不在2GB生产机执行。
set -euo pipefail
cd /var/www/meteor-store
ARCHIVE="${1:?缺少构建包路径}"
[[ -f "$ARCHIVE" ]] || { echo "ERROR: 构建包不存在" >&2; exit 1; }
source deploy/preflight-runtime.sh
source deploy/runtime-common.sh
NEW_BUILD_STARTED=0
HAD_BUILD=0
HAD_ROLLBACK=0
FINISHED=0

restore_release() {
  local status=$?
  local build_restore_failed=0
  trap - EXIT INT TERM
  if [[ "$FINISHED" != "1" ]]; then
    echo "ERROR: 激活失败，恢复原产物与运行配置" >&2
    if [[ "$NEW_BUILD_STARTED" == "1" ]]; then
      if [[ -d .next ]]; then mv .next "$METEOR_RUNTIME_BACKUP/failed-next" || build_restore_failed=1; fi
    fi
    if [[ -L .next.rollback && "$(readlink .next.rollback)" == "$METEOR_RUNTIME_BACKUP/next-before" ]]; then rm .next.rollback; fi
    if [[ "$HAD_BUILD" == "1" ]]; then
      if [[ ! -e .next ]]; then mv "$METEOR_RUNTIME_BACKUP/next-before" .next || build_restore_failed=1
      else build_restore_failed=1; fi
    fi
    if [[ "$HAD_ROLLBACK" == "1" ]]; then
      if [[ ! -e .next.rollback && ! -L .next.rollback ]]; then mv "$METEOR_RUNTIME_BACKUP/previous-next-rollback" .next.rollback || build_restore_failed=1
      else build_restore_failed=1; fi
    fi
    if [[ "$build_restore_failed" == "1" ]]; then
      echo "ERROR: 原产物未能完整恢复，停止自动启动，保留备份供人工恢复" >&2
      METEOR_PM2_CHANGED=0
      status=1
    fi
    meteor_restore_runtime || status=1
    [[ "$status" != "0" ]] || status=1
  fi
  exit "$status"
}
trap restore_release EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

meteor_prepare_runtime
meteor_install_runtime_config
meteor_stop_runtime
if [[ -e .next.rollback || -L .next.rollback ]]; then
  mv .next.rollback "$METEOR_RUNTIME_BACKUP/previous-next-rollback"
  HAD_ROLLBACK=1
fi
if [[ -d .next ]]; then mv .next "$METEOR_RUNTIME_BACKUP/next-before"; HAD_BUILD=1; fi
NEW_BUILD_STARTED=1
tar -xzf "$ARCHIVE" .next
test -f .next/BUILD_ID
chmod 755 .next
find .next/static -type d -exec chmod 755 {} +
find .next/static -type f -exec chmod 644 {} +
meteor_activate_runtime
if [[ "$HAD_BUILD" == "1" ]]; then ln -s "$METEOR_RUNTIME_BACKUP/next-before" .next.rollback; fi
FINISHED=1
trap - EXIT INT TERM
rm -f "$ARCHIVE"
echo "==> 激活完成，BUILD_ID: $(cat .next/BUILD_ID)，回滚目录: $METEOR_RUNTIME_BACKUP"
