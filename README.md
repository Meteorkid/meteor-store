# Meteor Store

面向开发者的软件商店，提供精心打磨的工具与 AI 应用。

站点：<https://www.imagentx.top>

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Neon Postgres + Drizzle ORM
- Upstash Redis

## 本地开发

```bash
pnpm install
pnpm dev
```

## 部署

自托管：nginx 反代 + PM2 运行 `next start`。构建放在本地做（服务器内存不足以跑
`pnpm build`），产物上传后重启进程。脚本与说明见 `deploy/` 目录。

## 许可证

专有许可。保留所有权利。详见 [LICENSE](LICENSE)。
