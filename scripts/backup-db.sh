#!/usr/bin/env bash
# ============================================================
# 数据库定时备份 —— 由 cron 每天执行
#
# 用法：bash scripts/backup-db.sh [保留天数]
#
# crontab 示例（每天 03:40，与其它任务错开）：
#   40 3 * * * /usr/bin/flock -n /run/lock/meteor-db-backup.lock \
#     /bin/bash /var/www/meteor-store/scripts/backup-db.sh 2>&1 \
#     | /usr/bin/logger -t meteor-db-backup
#
# 为什么有它：2026-09-01 Neon 出网配额被打满，SQL over HTTP 和 TCP 两条通道
# 同时返回 402 长达约 23 小时——那段时间**没有任何本地备份**，25 笔订单、
# 4 个用户、19 篇投稿全部只存在于一个够不着的地方。备份与用哪家数据库无关，
# 它防的是「够不着」「删错了」「账号出问题」这一整类事，而不只是某一家的限流。
#
# 退出码非 0 时 cron 会把 stderr 交给 logger，用 `journalctl -t meteor-db-backup`
# 查看。**失败必须能被发现**——静默失败的备份比没有备份更危险，
# 它给的是虚假的安全感。
# ============================================================
set -euo pipefail

KEEP_DAYS="${1:-14}"
BACKUP_DIR="${DB_BACKUP_DIR:-/var/backups/meteor-store}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="${BACKUP_DIR}/meteor-store-${STAMP}.dump"

fail() { echo "❌ $*" >&2; exit 1; }

[[ -n "${DATABASE_URL:-}" ]] || fail "缺少 DATABASE_URL（cron 里用 --env-file 或在脚本前 source .env.production）"

# pg_dump 的版本必须 >= 服务端，否则直接拒绝连接。
# 优先用 PATH 里的，其次找常见的版本化安装路径（Homebrew / PGDG）。
find_pg_dump() {
  if command -v pg_dump >/dev/null 2>&1; then command -v pg_dump; return; fi
  for p in /usr/pgsql-18/bin/pg_dump /usr/pgsql-17/bin/pg_dump \
           /opt/homebrew/opt/postgresql@18/bin/pg_dump; do
    [[ -x "$p" ]] && { echo "$p"; return; }
  done
  return 1
}
PG_DUMP="$(find_pg_dump)" || fail "找不到 pg_dump。服务端是 PostgreSQL 18，客户端版本必须不低于它"

mkdir -p "$BACKUP_DIR"

# --no-owner / --no-privileges：还原到自建库时不要求存在同名角色，
# 否则恢复过程会因为 owner 不存在而中断
# **先写临时文件，校验通过后再原子改名**，绝不让 pg_dump 直接写最终路径。
# 原因：`-f` 会在启动瞬间截断目标文件。若直接写最终名，一次失败的备份
# （网络断、配额超、磁盘满）会把同名的上一份好备份截成 0 字节——
# 而备份目录看上去文件还在，只有真去还原时才发现是空的。
# 实测踩过：同一分钟内跑两次，第二次失败把第一次 320K 的备份毁成 0 字节。
TMP="${TARGET}.partial"
rm -f "$TMP"
"$PG_DUMP" "$DATABASE_URL" -Fc --no-owner --no-privileges -f "$TMP" \
  || { rm -f "$TMP"; fail "pg_dump 失败，已有备份未受影响"; }

# ---- 校验：能读出目录、且关键表都在 ----
# 只检查文件存在是不够的：连接中断可能留下一个体积正常但内容截断的文件
# 校验不过一律删除：一份读不出来或缺表的 dump 没有任何价值，
# 而把它留在目录里会让「现存 N 份备份」这个数字变成谎话
reject() { rm -f "$TMP"; fail "$*（已丢弃，已有备份未受影响）"; }

SIZE=$(wc -c < "$TMP")
(( SIZE > 10240 )) || reject "备份只有 ${SIZE} 字节，明显不完整"

PG_RESTORE="${PG_DUMP%/pg_dump}/pg_restore"
LISTING="$("$PG_RESTORE" -l "$TMP" 2>/dev/null)" || reject "备份无法被 pg_restore 读取，文件已损坏"

for t in users orders posts license_keys; do
  grep -q "TABLE DATA public ${t} " <<<"$LISTING" || reject "备份里缺少关键表 ${t}"
done

# 校验全部通过，这一刻才让它成为正式备份
mv "$TMP" "$TARGET"

TABLE_COUNT=$(grep -c "TABLE DATA" <<<"$LISTING")
echo "✅ 备份完成 ${TARGET}（$(du -h "$TARGET" | cut -f1)，${TABLE_COUNT} 张表）"

# ---- 清理过期备份 ----
# 先确认新备份有效再删旧的：顺序反过来的话，一次失败的备份会连着把旧的也清掉
DELETED=$(find "$BACKUP_DIR" -name 'meteor-store-*.dump' -type f -mtime "+${KEEP_DAYS}" -print -delete | wc -l | tr -d ' ')
REMAIN=$(find "$BACKUP_DIR" -name 'meteor-store-*.dump' -type f | wc -l | tr -d ' ')
echo "   保留 ${KEEP_DAYS} 天，删除 ${DELETED} 份过期备份，现存 ${REMAIN} 份"
