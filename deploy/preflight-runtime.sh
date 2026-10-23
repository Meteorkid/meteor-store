#!/usr/bin/env bash
# 本脚本随构建包传入，在git pull之前source；首次升级不依赖服务器已有新版helper。
set -euo pipefail
cd /var/www/meteor-store
meteor_lock_matches_fd() {
  # /var/lock可能指向/run/lock；worker目录也可有父目录别名，比较实际文件身份。
  /usr/local/bin/node --input-type=module -e 'import {statSync,fstatSync} from "node:fs"; try { const expected=statSync(process.argv[1]); const held=fstatSync(Number(process.argv[2])); if(!expected.isFile() || expected.dev!==held.dev || expected.ino!==held.ino) process.exit(1); } catch { process.exit(1); }' "$1" "$2"
}
if [[ "${METEOR_DEPLOY_LOCK_HELD:-}" == "1" ]]; then
  meteor_lock_matches_fd /var/lock/meteor-store-deploy.lock 9 || { echo "ERROR: 部署锁描述符不匹配" >&2; exit 1; }
else
  exec 9>/var/lock/meteor-store-deploy.lock
fi
flock -n 9 || { echo "ERROR: 已有部署在进行" >&2; exit 1; }
export METEOR_DEPLOY_LOCK_HELD=1

METEOR_UPDATE_DIRECTORY=$(/usr/local/bin/node --env-file=.env.production --experimental-strip-types --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --input-type=module -e 'import path from "node:path"; import {updateDirectory} from "./src/lib/product-updates/state.ts"; console.log(path.resolve(updateDirectory()));')
METEOR_WORKER_LOCK_FILE="$METEOR_UPDATE_DIRECTORY/worker.lock"
if [[ "${METEOR_WORKER_LOCK_HELD:-}" == "1" ]]; then
  meteor_lock_matches_fd "$METEOR_WORKER_LOCK_FILE" 8 || { echo "ERROR: 产品同步锁描述符不匹配" >&2; exit 1; }
else
  mkdir -p -m 700 "$METEOR_UPDATE_DIRECTORY"
  [[ ! -L "$METEOR_WORKER_LOCK_FILE" ]] || { echo "ERROR: 产品同步锁不能是符号链接" >&2; exit 1; }
  METEOR_SAVED_UMASK=$(umask)
  umask 077
  exec 8<>"$METEOR_WORKER_LOCK_FILE"
  umask "$METEOR_SAVED_UMASK"
fi
flock -n 8 || { echo "ERROR: 产品同步worker持锁，拒绝部署" >&2; exit 1; }
export METEOR_WORKER_LOCK_HELD=1

meteor_assert_bootstrap_idle() {
  /usr/local/bin/node --env-file=.env.production --experimental-strip-types --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --input-type=module <<'NODE'
import {readStateFile, processIdentity, isActiveJob} from './src/lib/product-updates/state.ts';
try {
  const record = await readStateFile('job');
  if (record !== null) {
    if (!record?.job || !['queued','running','completed','partial','failed'].includes(record.job.status)
      || (record.pid !== null && (!Number.isSafeInteger(record.pid) || record.pid <= 0)) || isActiveJob(record.job)) throw new Error();
    if (record.pid) {
      let alive = true;
      try { process.kill(record.pid, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; }
      if (alive) {
        const identity = await processIdentity(record.pid);
        if (!record.processIdentity || !identity || identity === record.processIdentity) throw new Error();
      }
    }
  }
} catch {
  console.error('ERROR: 产品同步进行中或状态无法确认，拒绝修改源码/依赖/运行配置');
  process.exitCode = 1;
}
NODE
}
meteor_assert_bootstrap_idle
