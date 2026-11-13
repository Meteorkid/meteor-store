# 学习工作台三件套设计（2026-11-13）

用户已确认按顺序实施：① 学习工作台 ② 课程 Deadline + GPA ③ 算法训练和间隔复习。
目标是把网站从「内容入口」变成每天会打开的学习面板，复用现有账号、收藏、通知与申请日历。

## 一、范围

| 功能 | 页面 | 说明 |
|------|------|------|
| 学习工作台 | `/study` | 每天打开的总览：今日日刊、临近截止（课程/申请/收藏机会）、今日复习、学习路径进度、收藏入口 |
| 课程 Deadline + GPA | `/study/courses` | 课程与成绩记录、作业/考试截止、加权平均分与 GPA 参考换算 |
| 算法训练与间隔复习 | `/study/algorithms` | 题目记录、已解决后进入 1/3/7/14/30/60 天间隔复习队列 |

不做：多用户协作、成绩单导入、第三方 OJ 同步、邮件/推送外发。站内提醒只做页面聚合与铃铛入口，不发新消息。

## 二、数据模型（迁移 0056，只新增表）

三张表都沿用全站约定：无外键、`user_id` 归属、ISO 文本时间戳、写入前 zod 校验。

### study_courses

| 列 | 类型 | 说明 |
|----|------|------|
| id | text pk | crypto.randomUUID() |
| user_id | text | 归属账号 |
| term | text | 学期，如 `2026-2027-1`；自由文本，用于分组 |
| name | text | 课程名 |
| credits | numeric(4,1) | 学分，0.5–20 |
| score | numeric(5,1) | 百分制成绩；NULL = 未出分 |
| status | text | in-progress \| completed |
| created_at / updated_at | text | ISO |

索引：`(user_id, term)`。

### study_deadlines

| 列 | 类型 | 说明 |
|----|------|------|
| id | text pk | |
| user_id | text | |
| course_id | text | 可空；课程删除时服务层把关联 deadline 的 course_id 置空，不级联删除 |
| title | text | 作业/考试名 |
| kind | text | assignment \| exam \| project \| other |
| due_at | text | ISO 时刻或 YYYY-MM-DD；有明确时刻才存时刻 |
| status | text | open \| done |
| notes | text | 可空 |
| created_at / updated_at | text | |

索引：`(user_id, due_at)`。

### study_problems

| 列 | 类型 | 说明 |
|----|------|------|
| id | text pk | |
| user_id | text | |
| title | text | 题目名 |
| topic | text | 主题标签，自由文本（如「动态规划」），空串允许 |
| difficulty | text | easy \| medium \| hard |
| url | text | 可空，https 链接 |
| status | text | todo \| solved |
| notes | text | 可空 |
| review_stage | integer | 已复习轮次 0–5；未解决题恒为 0 |
| review_due_on | text | 下次复习日期 YYYY-MM-DD（北京时间）；NULL = 未进入复习 |
| review_interval_days | integer | 当前间隔天数 |
| last_reviewed_on | text | 上次复习日期 |
| created_at / updated_at | text | |

索引：`(user_id, review_due_on)`、`(user_id, status)`。

## 三、核心规则

### 复习调度（`src/lib/study/review.ts`，纯函数）

- 间隔序列：1、3、7、14、30、60 天（stage 0–5）。
- 标记「已解决」：stage=0，interval=1，dueOn=明天（北京时间口径 `dailyDate()`）。
- 复习「记得」：stage+1（封顶 5），interval=序列[stage]，dueOn=今天+interval。
- 复习「忘了」：stage=0，interval=1，dueOn=明天。
- 到期判定：`review_due_on <= 今天` 即今日队列；不按时刻计算，避免时区歧义。
- 改回「未解决」不清除历史 stage，但不再出现在复习队列（查询按 status='solved' 过滤）。

### GPA（`src/lib/study/gpa.ts`，纯函数）

- **加权平均分**：Σ(学分×分数)/Σ学分，只统计已出分课程。这是确定值。
- **GPA 参考换算**：常见 4.0 分档（90+→4.0、85→3.7、82→3.3、78→3.0、75→2.7、72→2.3、68→2.0、64→1.5、60→1.0、<60→0），页面标注「按常见 4.0 分档换算，具体以学校规定为准」。
- 未出分课程不计入两个指标；页面显示已出分/全部学分进度。

### 工作台聚合（`/study`）

服务端渲染，登录后可见（未登录 `redirect` 到 `/login?next=/study`）。数据分区：

1. **今天**：北京时间日期、今日日刊各栏目发布状态（复用 `getDailyEditions`）。
2. **要交的**：课程 deadline 7 天内 + 逾期（新表）；硕士/博士关注轮次 `leadDays !== null`（复用 admissions service）；Pathfinder 收藏条目截止（复用 `getSavedPathfinderItems` + `getDeadlineState`）。
3. **要复习的**：`review_due_on <= 今天` 的已解决题目数 + 前 5 条（新表）。
4. **学习路径**：Pathfinder 已保存路径的当前周任务（复用 `getUserPlan` + 完成状态）。
5. **收藏**：博客收藏数、Pathfinder 收藏数（复用现服务）。

任何分区读取失败只降级该分区并显示「读取失败」，不影响其他分区。

### 提醒集成

- 铃铛「提醒」标签新增学习分区：今日复习题数 + 7 天内课程截止数，链接到 `/study`。只读聚合，不新增未读状态（与监控分区一致）。

## 四、API

三个资源各一条路由，沿用 `/api/phd/watches` 的协议：

- `/api/study/courses`、`/api/study/deadlines`、`/api/study/problems`
- GET 列表 / POST 新建 / PATCH 更新（含复习动作）/ DELETE 删除
- 全部：`getSession` 401、`assertMatchingOrigin` 403、`X-Study-User` 核对 409、限流 429、`Cache-Control: no-store`
- 请求体 ≤ 4KB，zod 严格校验；写接口按项目约定必须调用 `rateLimit`

## 五、接入点

- 导航「学习与机会」新增分区「我的学习」：`/study`、`/study/courses`、`/study/algorithms`。
- `login-return.ts` 白名单加入三个路径。
- 搜索索引与 sitemap 不收录（登录后私人页，与 `/pathfinder/saved` 一致）。
- 账号导出加入三张表；注销清理本人记录。
- 页面文案用本地 text 模块（跟随 daily/competitions 范式），不进 messages JSON。

## 六、回滚

- 迁移只新增表和索引，回滚保留数据；旧代码不读新表即可。
- 部署顺序：先迁移后切应用。
