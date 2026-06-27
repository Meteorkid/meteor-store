# Meteor Store - 项目上下文

## 项目信息

- **项目名称**: Meteor Store
- **项目类型**: 前端网站
- **技术栈**: Next.js 16 + TypeScript + Tailwind CSS 4
- **部署平台**: Vercel
- **域名**: imagentx.top
- **创建时间**: 2026-06-25

## 项目目标

优化 Meteor Store 网站的前端设计，提升用户体验和视觉效果，使其成为一个专业、现代、高转化率的软件销售网站。

## 核心功能

1. **产品展示**: 展示 9 款软件产品
2. **定价系统**: 支持多级定价（Basic/Pro/Enterprise）
3. **支付集成**: 支付宝 + 微信收款码
4. **用户体验**: 现代化 UI 设计，流畅交互

## 技术架构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── products/          # 产品页面
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── Header.tsx         # 导航栏
│   ├── Footer.tsx         # 页脚
│   ├── ProductCard.tsx    # 产品卡片
│   ├── PricingCard.tsx    # 定价卡片
│   ├── PaymentModal.tsx   # 支付弹窗
│   └── WechatPayModal.tsx # 微信支付弹窗
├── data/                  # 数据文件
│   └── products.ts        # 产品数据
└── lib/                   # 工具库
    ├── alipay.ts          # 支付宝集成
    └── payment.ts         # 支付配置
```

## 设计现状

### 当前设计

- 紫色渐变主题 (#667eea → #764ba2)
- 响应式布局
- 基础动画效果
- 简洁的卡片设计

### 需要优化

1. **视觉层次**: 增强页面层次感
2. **动画效果**: 添加更流畅的过渡动画
3. **组件设计**: 优化卡片、按钮等组件
4. **响应式**: 改进移动端体验
5. **品牌一致性**: 统一设计语言

## 产品列表

1. **OmniCrawl** - 万能爬虫框架
2. **Ex-Memory** - 前任记忆智能体
3. **Skeleton Anatomy** - 骨骼解剖图谱
4. **UI Design System** - UI 设计系统
5. **Statux** - 状态管理工具
6. **XIsland** - 虚拟岛屿游戏
7. **Tollow** - 任务管理工具
8. **XNook** - 笔记应用
9. **Chakra-Visualizer** - 脉轮可视化器

## 定价策略

| 产品 | Basic | Pro | Enterprise |
|------|-------|-----|------------|
| OmniCrawl | $29 | $99 | $299 |
| Ex-Memory | $19 | $69 | $199 |
| Skeleton Anatomy | $15 | $49 | $149 |
| UI Design System | $39 | $149 | $449 |
| Statux | $19 | $69 | $199 |
| XIsland | $9 | $29 | $89 |
| Tollow | $15 | $49 | $149 |
| XNook | $12 | $39 | $119 |
| Chakra-Visualizer | $19 | $69 | $199 |

## 参考设计

### 优秀参考网站

- **Vercel**: 现代、简洁、专业
- **Stripe**: 优雅的渐变和动画
- **Linear**: 极简主义设计
- **Raycast**: 精致的 UI 细节

### 设计原则

1. **简洁**: 去除冗余元素
2. **层次**: 清晰的视觉层次
3. **一致**: 统一的设计语言
4. **流畅**: 自然的动画过渡
5. **专业**: 商业级视觉效果

## 成功指标

- **加载速度**: < 2s
- **Lighthouse 分数**: > 90
- **转化率**: 提升 20%
- **用户停留时间**: 增加 30%
- **跳出率**: 降低 15%
