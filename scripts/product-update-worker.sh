#!/usr/bin/env bash
set -euo pipefail
umask 077
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="${PRODUCT_UPDATES_DIR:-${SCRIPT_DIR}/../data/product-updates}"
NODE_BIN="${PRODUCT_UPDATES_NODE:-node}"
mkdir -p "$STATE_DIR"
chmod 700 "$STATE_DIR"
if command -v flock >/dev/null 2>&1; then
  exec 9>"${STATE_DIR}/worker.lock"
  flock -n 9 || exit 1
  exec "$NODE_BIN" --experimental-strip-types "$SCRIPT_DIR/product-update-worker.mjs" "$@"
fi
exec python3 -c '
import fcntl, os, sys
lock = os.open(sys.argv[1], os.O_CREAT | os.O_WRONLY, 0o600)
try:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    sys.exit(1)
os.set_inheritable(lock, True)
os.execvp(sys.argv[2], sys.argv[2:])
' "${STATE_DIR}/worker.lock" "$NODE_BIN" --experimental-strip-types "$SCRIPT_DIR/product-update-worker.mjs" "$@"
