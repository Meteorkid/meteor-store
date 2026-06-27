# Meteor Store 设置指南

## 🎉 恭喜！网站已创建

你的售卖网站已经创建完成并推送到 GitHub：https://github.com/Meteorkid/meteor-store

## 📋 下一步：配置支付系统

### 1. 注册 Lemon Squeezy

1. 访问 https://www.lemonsqueezy.com
2. 注册账号并创建商店
3. 获取 API Key 和 Store ID

### 2. 创建产品

在 Lemon Squeezy 中为每个软件创建产品：

| 产品 | 变体 |
|------|------|
| **OmniCrawl** | Starter ($29/月), Pro ($79/月), Enterprise ($199/月) |
| **Ex-Memory** | Basic ($9/月), Premium ($19/月), Ultimate ($39/月) |
| **Skeleton Anatomy** | Student ($19/年), Professional ($49/年), Institution ($199/年) |
| **UI Design System** | Solo ($9/月), Team ($29/月), Enterprise ($99/月) |
| **Statux** | Pro ($9 买断) |
| **XIsland** | Pro ($12 买断) |
| **Tollow** | Pro ($15/月) |
| **XNook** | Pro ($9 买断) |
| **Chakra Visualizer** | Premium ($5/月) |

### 3. 配置环境变量

1. 复制 `.env.example` 为 `.env.local`
2. 填入你的 Lemon Squeezy 配置

### 4. 部署到 Vercel

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 配置环境变量
4. 点击 Deploy

## 🚀 快速命令

```bash
# 本地开发
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 📝 需要你做的

1. **注册 Lemon Squeezy** 并创建产品
2. **配置环境变量**（API Key, Store ID, Variant IDs）
3. **部署到 Vercel**
4. **测试支付流程**
5. **添加自定义域名**（可选）

## 🎨 自定义

### 修改产品信息

编辑 `src/data/products.ts` 文件

### 修改样式

编辑 `src/app/globals.css` 和组件

### 添加新产品

1. 在 `src/data/products.ts` 添加数据
2. 在 Lemon Squeezy 创建产品
3. 更新环境变量

## 📞 支持

如有问题，查看：
- [Lemon Squeezy 文档](https://docs.lemonsqueezy.com)
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)

## 🎯 营销建议

1. **Product Hunt** - 发布产品
2. **Reddit** - r/SideProject, r/Entrepreneur
3. **Twitter/X** - 分享开发过程
4. **GitHub** - 开源部分代码
5. **开发者社区** - V2EX, 掘金, SegmentFault

祝你赚大钱！🚀💰
