# Phase 1: 设计系统建立与视觉升级

## 目标

建立完整的设计系统，为打造精美、吸引人的网站奠定基础。

## 时间规划

- **预计时间**: 2-3 天
- **优先级**: P0（必须完成）

---

## 任务清单

### 1.1 设计 Token 系统（4小时）

#### 颜色系统

```css
/* 主色调 - 紫色渐变 */
--color-primary-50: #f5f3ff;
--color-primary-100: #ede9fe;
--color-primary-200: #ddd6fe;
--color-primary-300: #c4b5fd;
--color-primary-400: #a78bfa;
--color-primary-500: #8b5cf6;
--color-primary-600: #7c3aed;
--color-primary-700: #6d28d9;
--color-primary-800: #5b21b6;
--color-primary-900: #4c1d95;

/* 渐变色 */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-dark: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

/* 语义色 */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

#### 字体系统

```css
/* 字体族 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* 字号 */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
--text-6xl: 3.75rem;
--text-7xl: 4.5rem;

/* 行高 */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

#### 间距系统

```css
/* 间距 */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
--space-20: 5rem;
--space-24: 6rem;
--space-32: 8rem;
```

#### 阴影系统

```css
/* 阴影 */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-glow: 0 0 40px rgb(139 92 246 / 0.3);
```

---

### 1.2 组件库文档（2小时）

#### 组件列表

1. **Button** - 按钮组件
2. **Card** - 卡片组件
3. **Badge** - 徽章组件
4. **Input** - 输入框组件
5. **Modal** - 弹窗组件
6. **Tooltip** - 工具提示
7. **Avatar** - 头像组件
8. **Icon** - 图标组件

#### 文档结构

```
docs/
├── components/
│   ├── Button.md
│   ├── Card.md
│   ├── Badge.md
│   ├── Input.md
│   ├── Modal.md
│   ├── Tooltip.md
│   ├── Avatar.md
│   └── Icon.md
├── brand/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── icons.md
└── getting-started.md
```

---

### 1.3 品牌视觉规范（2小时）

#### Logo 使用规范

- **主 Logo**: 全彩色版本
- **单色 Logo**: 黑白版本
- **最小尺寸**: 24px
- **安全区域**: Logo 高度的 50%

#### 品牌色彩应用

- **主色**: 用于 CTA 按钮、链接、重要元素
- **辅助色**: 用于次要按钮、标签、装饰
- **中性色**: 用于文本、背景、边框

#### 品牌图形元素

- **渐变背景**: 用于 Hero 区域、卡片背景
- **光效**: 用于强调、悬停效果
- **形状**: 用于装饰、分隔

---

## 执行步骤

### Step 1: 创建设计 Token 文件

```bash
# 创建样式目录
mkdir -p src/styles

# 创建 Token 文件
touch src/styles/tokens.css
touch src/styles/components.css
touch src/styles/utilities.css
```

### Step 2: 创建组件库文档

```bash
# 创建文档目录
mkdir -p docs/components
mkdir -p docs/brand
```

### Step 3: 编写品牌规范

```bash
# 创建品牌规范文件
touch docs/brand/colors.md
touch docs/brand/typography.md
touch docs/brand/spacing.md
touch docs/brand/icons.md
```

---

## 验收标准

### 设计 Token 系统

- [ ] 颜色系统完整（主色、辅助色、中性色、语义色）
- [ ] 字体系统完整（字体族、字号、行高）
- [ ] 间距系统完整（基础间距、常用间距）
- [ ] 阴影系统完整（不同层级阴影）
- [ ] 圆角系统完整（不同组件圆角）
- [ ] 所有 Token 可在代码中使用

### 组件库文档

- [ ] 所有组件文档完整
- [ ] 组件使用示例完整
- [ ] 组件属性说明完整
- [ ] 组件最佳实践完整

### 品牌视觉规范

- [ ] Logo 使用规范完整
- [ ] 品牌色彩应用规范完整
- [ ] 品牌字体应用规范完整
- [ ] 品牌图形元素规范完整

---

## 下一步

Phase 1 完成后，进入 **Phase 2: UI 组件优化**，开始：

1. 优化首页 Hero 区域
2. 改进产品卡片设计
3. 优化定价卡片布局
4. 改进导航栏设计
5. 优化 Footer 设计

---

## 注意事项

1. **一致性**: 所有组件必须遵循设计系统
2. **可访问性**: 确保颜色对比度符合 WCAG 标准
3. **响应式**: 所有组件必须支持响应式
4. **性能**: 避免使用影响性能的 CSS 特性
5. **文档**: 所有组件必须有完整文档
