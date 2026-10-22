#!/usr/bin/env bash
# 每分钟运行；只做GET与本机私有状态更新，不发送外部消息。
# 用法：HEALTH_CHECK_NODE=/usr/local/bin/node bash scripts/health-check.sh [站点URL]
set -euo pipefail
umask 077

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="${HEALTH_CHECK_STATE_FILE:-${SCRIPT_DIR}/../data/monitoring/health.json}"
NODE_BIN="${HEALTH_CHECK_NODE:-node}"
export HEALTH_CHECK_STATE_FILE="$STATE_FILE"
mkdir -p "$(dirname "$STATE_FILE")"
chmod 700 "$(dirname "$STATE_FILE")"

if command -v flock >/dev/null 2>&1; then
  exec 9>"${STATE_FILE}.lock"
  chmod 600 "${STATE_FILE}.lock"
  flock -n 9 || exit 0
  exec "$NODE_BIN" "$SCRIPT_DIR/health-check.mjs" "$@"
fi

# macOS没有flock命令；系统文件锁在进程退出时释放，不留下需要猜测回收的PID锁。
# Python仅作本地兼容，不在生产cron中安装任何依赖。
if ! command -v python3 >/dev/null 2>&1; then
  echo '{"error":"monitoring-lock-unavailable"}' >&2
  exit 2
fi
exec python3 -c '
import fcntl, os, sys
lock = os.open(sys.argv[1], os.O_CREAT | os.O_WRONLY, 0o600)
os.fchmod(lock, 0o600)
try:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    sys.exit(0)
os.set_inheritable(lock, True)
os.execvp(sys.argv[2], sys.argv[2:])
' "${STATE_FILE}.lock" "$NODE_BIN" "$SCRIPT_DIR/health-check.mjs" "$@"
