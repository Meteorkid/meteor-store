#!/usr/bin/env bash
# ============================================================
# 健康检查脚本 —— 由 cron 定时执行
# 用法：bash scripts/health-check.sh [url]
#
# crontab 示例（每 5 分钟）：
#   */5 * * * * /bin/bash /var/www/meteor-store/scripts/health-check.sh https://imagentx.top
# ============================================================
set -euo pipefail

SITE_URL="${1:-${NEXT_PUBLIC_SITE_URL:-https://imagentx.top}}"
HEALTH_URL="${SITE_URL}/api/health"
LOG_FILE="/tmp/meteor-store-health-check.log"
ALERT_HOOK="${HEALTH_ALERT_WEBHOOK:-}"  # 飞书/Discord/Slack webhook URL

echo "[$(date -Iseconds)] 健康检查 ${HEALTH_URL}" >> "$LOG_FILE"

# 调用健康检查接口（10 秒超时）
RESPONSE=$(curl -sS -w '\n%{http_code}' --max-time 10 "${HEALTH_URL}" 2>&1) || {
  echo "  ❌ 网络错误: $RESPONSE" >> "$LOG_FILE"
  send_alert "🚨 Meteor Store 不可达" "无法连接到 ${HEALTH_URL}，可能服务器宕机。\n错误: $RESPONSE"
  exit 1
}

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "  ✅ 健康 (HTTP $HTTP_CODE)" >> "$LOG_FILE"
  echo "  $BODY" >> "$LOG_FILE"
else
  echo "  ❌ 降级 (HTTP $HTTP_CODE)" >> "$LOG_FILE"
  echo "  $BODY" >> "$LOG_FILE"

  # 解析 failure 详情
  FAILURES=$(echo "$BODY" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    checks = data.get('checks', {})
    failed = [f'{k}: {v.get(\"error\", \"unknown\")}' for k, v in checks.items() if v.get('status') == 'error']
    print('\n'.join(failed)) if failed else print('unknown')
except: print('parse error')
" 2>/dev/null || echo "parse error")

  send_alert "⚠️ Meteor Store 降级" "健康检查失败 (HTTP $HTTP_CODE)\n\n失败组件:\n${FAILURES}"
  exit 1
fi

# ============================================================
# 发送告警
# ============================================================
send_alert() {
  local title="$1"
  local body="$2"

  echo "  📢 发送告警: $title" >> "$LOG_FILE"

  if [[ -n "$ALERT_HOOK" ]]; then
    # 飞书 webhook 格式
    curl -sS -X POST "$ALERT_HOOK" \
      -H 'Content-Type: application/json' \
      -d "$(python3 -c "
import json, sys
print(json.dumps({
    'msg_type': 'interactive',
    'card': {
        'header': {'title': {'tag': 'plain_text', 'content': '${title}'}, 'template': 'red'},
        'elements': [{'tag': 'div', 'text': {'tag': 'lark_md', 'content': '${body}'}}]
    }
}))
")" > /dev/null 2>&1 || true
  fi
}

# 清理旧日志（保留最近 1000 行）
tail -n 1000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
