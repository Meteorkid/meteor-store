# Meteor Store

高质量的开发者工具和 AI 应用售卖平台。

## 产品列表

| 产品 | 描述 | 价格 |
|------|------|------|
| **OmniCrawl** | 万能爬虫框架 | $29-199/月 |
| **Ex-Memory** | 前任记忆智能体 | $9-39/月 |
| **Skeleton Anatomy** | 3D 骨骼解剖平台 | $19-199/年 |
| **UI Design System** | AI Agent 设计系统 | $9-99/月 |
| **Statux** | CLI 状态栏工具 | 免费 / $9 买断 |
| **XIsland** | macOS Dynamic Island for AI | 免费 / $12 买断 |
| **Tollow** | 智能追踪工具 | 免费 / $15/月 |
| **XNook** | macOS 工具中心 | 免费 / $9 买断 |
| **Chakra Visualizer** | 手势忍术特效 | 免费 / $5/月 |

## 技术栈

- **框架**: Next.js 16 + TypeScript
- **样式**: Tailwind CSS 4
- **支付**: Lemon Squeezy
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```bash
cp .env.example .env.local
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 推送到 GitHub

```bash
git add .
git commit -m "feat: initial store setup"
git push origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量
5. 点击 Deploy

### 3. 配置域名（可选）

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录

## 支付系统配置

### Lemon Squeezy 设置

1. 注册 [Lemon Squeezy](https://www.lemonsqueezy.com) 账号
2. 创建你的产品和变体
3. 获取 API Key 和 Store ID
4. 获取每个产品的 Variant ID
5. 更新 `.env.local` 文件

### 创建产品

1. 登录 Lemon Squeezy Dashboard
2. 点击 "Products" → "New Product"
3. 为每个产品创建对应的变体（不同价格方案）
4. 复制每个变体的 ID 到环境变量

## 项目结构

```
meteor-store/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── layout.tsx            # 根布局
│   │   ├── globals.css           # 全局样式
│   │   └── products/
│   │       ├── page.tsx          # 产品列表页
│   │       └── [id]/
│   │           └── page.tsx      # 产品详情页
│   ├── components/
│   │   ├── Header.tsx            # 头部导航
│   │   ├── Footer.tsx            # 底部信息
│   │   ├── ProductCard.tsx       # 产品卡片
│   │   └── PricingCard.tsx       # 定价卡片
│   ├── data/
│   │   └── products.ts          # 产品数据
│   └── lib/
│       └── lemonsqueezy.ts      # 支付集成
├── public/                       # 静态资源
├── .env.example                  # 环境变量示例
└── package.json
```

## 自定义

### 添加新产品

1. 在 `src/data/products.ts` 中添加产品数据
2. 在 Lemon Squeezy 中创建对应产品
3. 更新环境变量

### 修改样式

编辑 `src/app/globals.css` 和组件中的 Tailwind 类名。

### 接入其他支付方式

修改 `src/lib/lemonsqueezy.ts` 或创建新的支付模块。

## 支持

如有问题，请提交 GitHub Issue 或联系支持。

## 许可证

MIT License
