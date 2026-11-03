#!/usr/bin/env bash
#
# 站点流量与转化报表（直接读 nginx access log，不依赖任何第三方统计）
#
# 为什么不需要前端埋点：
#   转化事件本身就是服务端请求 —— /api/download/<product> 与 /api/claim
#   每被调用一次 nginx 就写一行。所以「下载了几次、领取了几个码」从日志即可数出。
#
# 头条指标为什么是「落在真实路由上的请求」而不是 PV：
#   这台机器上 70% 的请求是漏洞扫描（/.env、/.git/config、/wp-admin…），
#   而且扫描器会伪造正常的 Chrome UA，靠 UA 过滤会把 PV 高估 100 倍以上。
#   所以只有命中站内真实路由（/products、/blog、/pricing…）的请求才算「有人在看站」。
#   任何不存在的路径都是攻击面探测，单独计数、不计入 PV。
#
# 用法：
#   ./traffic-report.sh          # 最近 7 天
#   ./traffic-report.sh 1        # 最近 1 天
#   ./traffic-report.sh 30       # 最近 30 天
#
# 环境变量：LOGDIR / SELF_HOST / FLOOD_THRESHOLD

set -uo pipefail

DAYS="${1:-7}"
LOGDIR="${LOGDIR:-/var/log/nginx}"
SELF_HOST="${SELF_HOST:-imagentx.top}"
FLOOD_THRESHOLD="${FLOOD_THRESHOLD:-40}"

BOT_UA='[Bb]ot|[Cc]rawl|[Ss]pider|[Ss]lurp|[Ss]entry|[Uu]ptime|[Mm]onitor|scan|zgrab|masscan|nmap|curl|wget|python-|Go-http-client|Java/|libwww|okhttp|axios|node-fetch|[Hh]eadlessChrome|[Pp]hantomJS|[Aa]hrefs|[Ss]emrush|[Bb]ytespider|[Pp]etal[Bb]ot|[Yy]isou|[Bb]aidu|[Ss]ogou|[Ee]xabot|facebookexternalhit|[Ss]lackbot|[Dd]iscordbot|[Tt]elegram[Bb]ot|WhatsApp|prerender|Pingdom|[Nn]agios|[Zz]abbix'
SCAN_PATH='(^|/)\.(git|env|aws|svn|DS_Store|ssh|config)|/wp-(admin|login|content|includes|json)|/wordpress|/xmlrpc\.php|/phpmyadmin|/phpinfo|/info\.php|/admin\.php|/(config|credentials|backup|shell|vendor|actuator|cgi-bin|HNAP1|solr|owa|autodiscover|docker-compose|geoserver|webui|pub)'
STATIC='(^|/)(_next|static|assets|images|fonts|favicon)/|\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|mp4|map)$'

# 站内真实路由白名单（去掉语言前缀后再匹配）。不在此列的路径一律视为扫描。
REAL_ROUTE='^/$|^/products(/|$)|^/blog(/|$)|^/account(/|$)|^/pricing(/|$)|^/open-source(/|$)|^/about(/|$)|^/apps(/|$)|^/login(/|$)|^/register(/|$)|^/changelog(/|$)|^/submissions(/|$)|^/masters(/|$)|^/phd(/|$)|^/pathfinder(/|$)|^/api/(download|claim|payment)/'

# ---- 一次性采集，避免反复解压 ----
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
for n in $(seq 0 $((DAYS - 1))); do
  d=$(date -d "-${n} day" +%Y%m%d 2>/dev/null || date -v-"${n}"d +%Y%m%d)
  [ -f "$LOGDIR/access.log-$d.gz" ] && gzip -dc "$LOGDIR/access.log-$d.gz" >> "$TMP"
  [ -f "$LOGDIR/access.log-$d" ] && cat "$LOGDIR/access.log-$d" >> "$TMP"
done
[ -f "$LOGDIR/access.log" ] && cat "$LOGDIR/access.log" >> "$TMP"

# ip \t 归一路径 \t referer \t ua \t is_static \t is_route   （未做任何剔除）
PARSED="$TMP.parsed"
trap 'rm -f "$TMP" "$PARSED"' EXIT
awk -v route="$REAL_ROUTE" '
  {
    n = split($0, a, "\"")
    if (n < 6) next
    split($0, b, " ")
    req = a[2]; ref = a[4]; ua = a[6]
    split(req, r, " ")
    path = r[2]
    if (path == "" || path == "*") next
    sub(/\?.*/, "", path)
    gsub(/^\/(zh|en)(\/|$)/, "/", path)
    is_static = (path ~ /(^|\/)(_next|static|assets|images|fonts|favicon)\// || path ~ /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|mp4|map)$/) ? 1 : 0
    is_route = (path ~ route) ? 1 : 0
    print b[1] "\t" path "\t" ref "\t" ua "\t" is_static "\t" is_route
  }' "$TMP" > "$PARSED"

RAW=$(wc -l < "$TMP" | tr -d ' ')

echo "════════════════════════════════════════════════════════"
echo " 最近 ${DAYS} 天"
echo "════════════════════════════════════════════════════════"
if [ "$RAW" -eq 0 ]; then echo "  （窗口内无日志）"; exit 0; fi
echo "  nginx 原始请求数: $RAW"

# ---- 头条：落在真实路由上、且不是监控/bot UA 的请求 ----
realfilter='$6 == 1 && $5 == 0 && $4 !~ bot'
REAL_PV=$(awk -F'\t' -v bot="$BOT_UA" "$realfilter {c++} END{print c+0}" "$PARSED")
REAL_UV=$(awk -F'\t' -v bot="$BOT_UA" "$realfilter {print \$1}" "$PARSED" | sort -u | grep -c . || true)
SCAN_N=$(awk -F'\t' '$6 == 0 && $2 !~ /robots\.txt|favicon\.ico/' "$PARSED" | wc -l | tr -d ' ')

echo
echo "  ══ 站内真实页面（真实路由 + 非 bot UA + 排除静态资源与攻击面探测）════"
echo "     PV: $REAL_PV    UV(独立 IP): $REAL_UV"
echo "     不存在的路径请求（扫描/探测）: $SCAN_N"
if [ "$REAL_PV" -gt 0 ]; then
  echo "     看了哪些页:"
  awk -F'\t' -v bot="$BOT_UA" "$realfilter {print \$2}" "$PARSED" |
    sort | uniq -c | sort -rn | head -10 | awk '{ printf "       %5d  %s\n", $1, $2 }'
fi

# ---- 转化事件：不过滤，扫描器不调这些接口 ----
DL=$(awk -F'\t' '$2 ~ /^\/api\/download\//' "$PARSED" | wc -l | tr -d ' ')
CL=$(awk -F'\t' '$2 ~ /^\/api\/claim/' "$PARSED" | wc -l | tr -d ' ')
LIC=$(awk -F'\t' '$2 ~ /^\/api\/software-licenses/' "$PARSED" | wc -l | tr -d ' ')
echo
echo "  ══ 转化事件（漏斗）════"
echo "     /api/download/<product>   : $DL"
echo "     /api/claim                : $CL"
echo "     /api/software-licenses/*  : $LIC"
if [ "$REAL_PV" -gt 0 ]; then
  echo "     下载率(PV 口径): $(awk -v a="$DL" -v b="$REAL_PV" 'BEGIN{printf "%.1f%%", a*100/b}')"
else
  echo "     下载率: 无分母（真实 PV 为 0）"
fi

# ---- 外部来源 ----
echo
echo "  ══ 外部来源 referer（排除自家域名 / 空值 / 扫描构造）════"
awk -F'\t' '$3 != "-" && $3 !~ /imagentx\.top/ && $3 !~ /^https?:\/\/([0-9]{1,3}\.){3}[0-9]{1,3}/ && $3 !~ /redirect\.php|ref_host=/' "$PARSED" |
  cut -f3 | sort | uniq -c | sort -rn | head -8 | awk '{ printf "     %5d  %s\n", $1, $2 }' ||
  echo "     （无）"

# ---- 攻击面探测 Top（说明「看起来有流量」的来源）----
echo
echo "  ══ 不存在的路径 Top 10（攻击面探测，不是访客）════"
awk -F'\t' '$6 == 0 && $2 !~ /robots\.txt|favicon\.ico/ {print $2}' "$PARSED" |
  sort | uniq -c | sort -rn | head -10 | awk '{ printf "     %5d  %s\n", $1, $2 }'
echo
