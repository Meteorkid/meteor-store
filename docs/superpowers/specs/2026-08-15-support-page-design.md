# Meteor Store「支持我」赞赏页设计

> 日期：2026-08-15

## 目标

新增一个独立的轻量赞赏页面 `/support`（中英双语，自动跟随站点语言），展示店主个人的支付宝与微信收款二维码，定位为「赞赏支持作者」而非慈善募捐。纯静态展示，不接任何支付 API、不做金额统计、不改动现有公司支付体系。

## 背景与约束

- 收款码是**个人码**（不走公司帐），页面文案必须避开「慈善募捐」类措辞，定位为「支持我 / 请我喝杯咖啡」。
- 站内已有 `public/wechat-qr.png`（旧图，本次将被新微信码替换）；支付宝码为本次新增，转 PNG 存入 `public/alipay-qr.png`。
- 全站暗色主题、玻璃材质；二维码图片必须**白底原样渲染**（`next/image` 用 `unoptimized`，避免优化管线破坏可扫码性）。
- 双语 i18n：`messages/zh.json` + `messages/en.json` 各加 `SupportPage` 命名空间与 `Footer.support` 键；路由用 next-intl `[locale]` 段，无需额外配置（`localePrefix: 'always'`）。

## 已确认决策

- 页面路径：`/support`（`src/app/[locale]/support/page.tsx`）。
- 入口：仅页脚 `resourceLinks` 增加「支持我 ☕」链接，不动 Header 导航、不动首页。
- 文案语气：轻松真诚（方案 A）。
- 布局：桌面双卡片并排、移动端堆叠；支付宝卡蓝色调、微信卡绿色调；卡片标题 + 二维码 + 扫码提示。
- 底部小字免责：「赞赏是自愿的，不附带任何权益或售后服务」。
- 二维码图片：`<Image unoptimized>` 渲染，尺寸约 260×260。

## 页面结构

```
src/app/[locale]/support/page.tsx     # 服务端组件：generateMetadata + 双卡布局
public/alipay-qr.png                  # 新图（由用户 JPG 转换）
public/wechat-qr.png                  # 替换为新微信码
messages/zh.json / en.json            # SupportPage + Footer.support
src/components/Footer.tsx             # resourceLinks 加一项
src/app/sitemap.ts                    # staticPages 加 /support
```

### 文案（zh）

| key | 文案 |
|-----|------|
| title | 支持我 |
| description | 如果这些工具真的帮到了你，请我喝杯咖啡吧。 |
| eyebrow | 赞赏支持 |
| alipayTitle | 支付宝 |
| alipayHint | 打开支付宝扫一扫 |
| wechatTitle | 微信 |
| wechatHint | 微信扫一扫 |
| disclaimer | 赞赏是自愿的，不附带任何权益或售后服务 |
| footer 链接 | 支持我 ☕ |

### 文案（en）

| key | 文案 |
|-----|------|
| title | Support Me |
| description | If these tools truly helped you, buy me a coffee. |
| eyebrow | Buy Me a Coffee |
| alipayTitle | Alipay |
| alipayHint | Scan with Alipay |
| wechatTitle | WeChat |
| wechatHint | Scan with WeChat |
| disclaimer | Tips are voluntary and come with no benefits or after-sales service. |
| footer 链接 | Support Me ☕ |

## 验证

- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src`
- `pnpm test`
- `pnpm build`
- 手工冒烟：`/zh/support` 与 `/en/support` 可访问、双语切换正确；两码在暗色卡片上白底清晰可扫；页脚「支持我 ☕」链接可达；sitemap 含双语 `/support` 条目。

## 非目标

- 不做赞赏金额统计、不做后端接口、不接支付 API、不做登录态。
- 不加 Header 导航入口、不动首页布局。
- 不改动现有 `PaymentModal` / 公司支付体系。
- 不做「慈善募捐」定位与文案。
