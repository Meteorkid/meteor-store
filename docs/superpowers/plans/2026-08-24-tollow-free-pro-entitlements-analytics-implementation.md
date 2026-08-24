# Tollow Free / Pro 权益与真实统计实施清单

1. 为 `orders` 增加可空 `plan_id`、增量迁移和历史 Tollow 套餐回填；支付、免费入库与导出写入/读取稳定套餐 ID。
2. 扩展单品 entitlement 并实现 `getTollowAccess` / `requireTollowPro`，覆盖订单、邀请码、Meteor Pass、管理员、历史回退和最高等级合并。
3. 将 Tollow 定价改为 Free ¥0 与 Pro ¥29 买断；产品页支付提交稳定 `planId`，应用服务端挂载页传入可信 `free/pro` 等级。
4. 给进度、练习记录、导入、收藏及收藏详情 API 增加统一 Pro 门控，保持 401/403/429/5xx 可区分。
5. 为 Tollow 客户端增加 Free 本地模式：不发云端请求但保留本地收藏 outbox；Pro 沿用账号同步并在升级后冲刷本地数据。
6. 新增真实统计查询与 `/api/tollow/analytics`，支持 7/30/90 天和全部历史、用户时区、汇总、趋势、书籍分布与最近记录。
7. 用真实 Tollow 分析页替换随机仪表盘，提供时间筛选、统计卡、SVG 趋势、书籍分布、最近记录、Free 升级态与错误/空态。
8. 新增 Pro 练习记录 CSV 导出，处理 BOM、RFC 4180 转义和公式注入；在分析页增加打印学习报告布局，保持全账户 JSON 导出免费。
9. 补充权益、商业流程、API 门控、客户端模式、统计、CSV 和页面合同测试；运行聚焦测试、全量 Vitest、TypeScript、目标 ESLint 与生产构建。
10. 更新 Obsidian 项目总结，仅提交 Tollow 相关文件与 `schema.ts` 中对应片段，避免带入工作区现有 Pathfinder 改动。
