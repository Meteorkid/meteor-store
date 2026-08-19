# 搜索引擎收录

把站点提交给 Google / Bing / 百度并完成归属验证的操作手册。
换域名、重新验证、或者验证意外掉了的时候翻这篇。

## 机制

三家站长平台都支持「HTML 标签」验证：在页面 `<head>` 里放一个它们指定的
`<meta>`，抓到即证明你控制这个站点。

标签由根布局 [src/app/[locale]/layout.tsx](../../src/app/[locale]/layout.tsx) 的
`siteVerification()` 生成，值来自三个环境变量：

| 环境变量 | 输出的 meta name | 平台 |
|---|---|---|
| `GOOGLE_SITE_VERIFICATION` | `google-site-verification` | [Google Search Console](https://search.google.com/search-console) |
| `BING_SITE_VERIFICATION` | `msvalidate.01` | [Bing 网站管理员工具](https://www.bing.com/webmasters) |
| `BAIDU_SITE_VERIFICATION` | `baidu-site-verification` | [百度搜索资源平台](https://ziyuan.baidu.com/site/index) |

**没配的那家不输出标签。** 挂一个空 `content` 会被平台判定验证失败，比没有更糟。

### 这三个变量不需要重新构建

和 `NEXT_PUBLIC_*` 不同，它们在服务端产物里保留为运行时查找
（`.next/server/chunks/*.js` 里是字面的 `process.env.GOOGLE_SITE_VERIFICATION`），
而且 `/zh`、`/en` 都是按请求渲染的——根布局调 `headers()` 取 CSP nonce，
整条路由不进预渲染，`generateMetadata` 每次请求现算。

所以**改 `.env.production` + `pm2 restart` 就生效**，不用走一遍本地构建上传。
反过来说，改 `layout.tsx` 本身是代码改动，那要正常部署。

## 一、拿到三个 content 值

### Google Search Console

1. 左上角资源下拉 → **添加资源**
2. 二选一：
   - **网域**（`imagentx.top`）：只支持 DNS TXT 验证，但一次覆盖 apex + www +
     http/https 全部变体。域名在阿里云，去 DNS 控制台加条 TXT 记录即可，
     **推荐走这个**，走完就不需要 `GOOGLE_SITE_VERIFICATION` 了
   - **网址前缀**（`https://www.imagentx.top`）：支持 HTML 标签
3. 选了「网址前缀」的话，验证方式默认推荐「HTML 文件」，
   展开下方 **其他验证方法 → HTML 标记**
4. 复制 `content` 引号里那串，不要连标签一起复制

### Bing 网站管理员工具

首页有 **「从 Google Search Console 导入」**，授权后站点和验证状态一起搬过来。
Google 那步做完了就走这个，不用再验一次。

手动的话：**添加站点** → 手动添加 → 填 `https://www.imagentx.top` →
验证方式选 **「将 meta 标记复制到您的默认网页」** → 取 `content`
（32 位大写十六进制）。

### 百度搜索资源平台

1. **用户中心 → 站点管理 → 添加网站**
2. 三步：输入站点（协议选 `https://`，域名 `www.imagentx.top`）→
   选择站点领域 → 验证网站
3. 验证方式选 **HTML 标签验证**，取 `content`（一般以 `codeva-` 开头）

百度对未备案站点基本不收录。ICP 与公安备案号已挂在页脚，这关是过的。

## 二、填到服务器

```bash
ssh root@47.120.20.26
```

先确认没有重复 key：

```bash
grep -n "SITE_VERIFICATION" /var/www/meteor-store/.env.production
```

没有的话再追加。**没申请的那家整行删掉，不要留空值**：

```bash
cat >> /var/www/meteor-store/.env.production <<'EOF'

# ---------- 搜索引擎站长验证 ----------
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
BAIDU_SITE_VERIFICATION=
EOF
```

`next start` 在进程启动时读 `.env.production`，重启即可：

```bash
pm2 restart meteor-store --update-env && pm2 save
```

## 三、确认公网抓得到

在**本地**跑（要验的是公网可达性，不是服务器自己）：

```bash
curl -s https://www.imagentx.top/zh | grep -oE '<meta name="(google-site-verification|msvalidate\.01|baidu-site-verification)"[^>]*>'
```

三行都出来了，再回各平台点「验证」。

## 四、提交 sitemap

验证通过后三家各提交一次 `https://www.imagentx.top/sitemap.xml`：

| 平台 | 位置 |
|---|---|
| Google | 索引 → 站点地图 |
| Bing | 站点地图 → 提交站点地图 |
| 百度 | 普通收录 → 资源提交 → sitemap |

sitemap 由 [src/app/sitemap.ts](../../src/app/sitemap.ts) 生成，
覆盖静态页 / 产品页 / 帮助文章 / 博客分区 / 文章 / 标签的双语条目。

## 时间预期

Google、Bing 一般几天内开始收录。**百度最慢，新站两周到一个月很正常**，
中间不要反复删站重加。查进度看 Search Console 的「网页索引编制」报告，
比 `site:` 搜出来的数字准。

## 相关

- 社交分享图 `public/og-image.png` 由
  [scripts/generate-og-image.mjs](../../scripts/generate-og-image.mjs) 从品牌 banner 生成，
  改了 banner 就重跑一次。不影响收录，影响分享卡片有没有预览图
- `robots.txt` 见 [src/app/robots.ts](../../src/app/robots.ts)，
  屏蔽了 `/api/` 和 `/success`
- 后台、账户、投稿等私密页各自在 `generateMetadata` 里标了
  `robots: { index: false, follow: false }`，新增这类页面记得跟上

## 已知未处理

apex（`imagentx.top`）与 www 目前都返回 200，没有互相 301，页面也没有输出
`canonical`。搜索引擎会当成两个站，权重对半分。要收口的话有两条路：
Nginx 里把 apex 301 到 www，或者给根布局补 `metadataBase` + `alternates.canonical`。
