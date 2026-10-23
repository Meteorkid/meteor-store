# 每日公告面板：最终安全与边界复核

日期：2026-10-23，最终检查时间约22:00北京时间。

## 结论

**在本批限定文件中未发现可确认的新安全漏洞或需要阻止合并的边界缺陷。** 没有新增可报告的P0/P1/P2问题。此结论是本地静态代码复核与定向测试结果，不替代主代理正在进行的真实PostgreSQL、双账号/双设备和浏览器验收。

本轮未改任何源代码、数据库、配置或迁移；只新增本报告与文件哈希记录。未检查或修改并行Ex-Memory任务。未启动覆盖并行改动的整仓持久化安全扫描，因此不把本报告称为正式Codex Security全仓扫描结果。

## 覆盖范围

主范围16个文件的SHA256见 `final-review-sha256.json`：

- `src/lib/daily/panel-types.ts`、`panel-service.ts`、`preview.ts`、`panel-client.ts`
- `src/app/api/daily/panel-preferences/route.ts`、`preview/route.ts`
- `src/components/daily/DailyNotificationPanel.tsx`、`DailyPanelSettings.tsx`、`panel-text.ts`、`DailyNotificationPanel.module.css`
- `src/components/NotificationBell.tsx`
- `src/lib/db/schema.ts`、`src/lib/user-data-export.ts`
- `drizzle/0050_daily_panel_settings.sql`、`drizzle/meta/0050_snapshot.json`、`drizzle/meta/_journal.json`

支持链路只读追踪：原`daily/service.ts`的公开投影/偏好合同、`daily/opportunities.ts`的当天机会过滤、`auth.ts`的会话校验、`csrf.ts`、`account-deletion.ts`及相关测试。最终哈希再次核对，16个主范围文件在测试和最终复核期间均未变化。

威胁与数据边界：未登录访问、另一账号读写、跨站写入、旧会话/迟到响应、双设备并发覆盖、恶意或超大JSON、未公开日刊/内部错误泄漏、外部内容到React/链接、旧应用和新迁移并存。

## 核对结果

### 私人API、owner与CSRF

- `panel-preferences/route.ts:9-16` GET只从`getSession()`取得身份；不接受URL/body指定他人userId。服务`panel-service.ts:16-18`以该userId查询一行。
- 原`auth.ts:66-96`验签并重新核对用户存在、邮箱验证和tokenVersion，数据库故障fail closed；新接口复用此边界。
- PUT在写入前经过Origin、登录、`X-Daily-User`与会话一致性、账号+IP限流、实际请求流4096字节上限和strict schema（`panel-preferences/route.ts:19-64`）。未知字段/非法类型/重复栏目/越界条数在服务调用前被拒绝。
- GET/PUT的成功、未登录、错owner、冲突、限流、大小错误、格式错误和服务器错误响应均no-store。异常原文未进入HTTP响应。
- 原CSRF帮助函数允许缺失Origin，但本接口还要求PUT+自定义owner头；普通跨站表单无法构造该请求，未新增基于宽松Origin的可利用写路径。

### CAS与原有数据兼容

- 首次写入是`INSERT ... ON CONFLICT DO UPDATE ... WHERE panel_updated_at IS NULL`；已有版本是`UPDATE WHERE user_id AND panel_updated_at = expectedRevision`（`panel-service.ts:21-30`）。没有先查后写窗口。
- 新版本至少为旧版本+1ms，防同毫秒及系统时间回拨复用版本。冲突返回0行，由API返回409，不自动重放。
- 更新集合仅`panelSettings`/`panelUpdatedAt`；旧channels、reminders、updatedAt不被覆盖。新建行才采用全部阅读选项和reminders=false。
- 恢复默认写settings=null但保留新的revision；显式channels=[]仍是空选。旧`getDailyPreferences`依旧显式选择channels/reminders，旧保存也仅更新原字段；没有把新字段塞入原strict合同。

### 公开预览和内容泄漏

- 公开接口只使用合法近30天date，不查询身份或设置，不返回userId/private preferences；可公共缓存与私人接口分离（`preview/route.ts:5-13`）。
- `preview.ts:36-65`从既有`getDailyEditions`读取，沿用非published清空投影及当天已关闭岗位/已开赛赛事过滤。再校验content.kind与栏目一致；草稿、下架、空稿、失败或损坏正文不会输出标题/正文。
- DTO白名单不含sourceKey、error、automationPaused、passage、questions、originalAbstract、authors全文或大段eligibility。每栏最多5条、开源1条；字段裁剪、URL 2048 UTF8字节上限及最终128KiB上限均有回归覆盖。
- 外链只接受https、不含凭据；超长/不安全URL省略但保留站内详情入口。界面以React文本输出，无dangerouslySetInnerHTML；原文链接使用noopener noreferrer（`DailyNotificationPanel.tsx:36-78`）。未发现新XSS/自动抓取外链/SSRF路径。
- 历史日期聚合独立失败只省略previousDate，不拖累今日内容；核心公开内容失败仍抛至503。UI无“没有历史”的错误推论。

### 客户端会话、超时与未读隔离

- 公共预览单独store，私有设置按`user:{owner}`分桶，游客独立。GET/PUT响应均核对owner，错误身份不会落入当前账号设置。
- 预览请求带明确日期，回包核对`data.date`及当前北京时间日期；午夜或旧日期payload不能伪装今日（`panel-client.ts:51-85`）。
- 强制刷新和保存开始会取消/移除旧GET，读取回包检查请求对象身份及abort状态。账号GET/PUT均拒收超时后的成功数据。
- 重新打开面板强制读取云端设置；保存使用开始编辑时的revision，不被后台刷新替换。后台读取不再清掉保存冲突提示（`panel-client.ts:107-146,199-246`）。
- UI编辑会话绑定owner和Symbol；换账号永久丢弃旧草稿。旧保存回调不能关闭新账号/同账号重新创建的编辑会话，也不会抢旧触发器焦点（`DailyNotificationPanel.tsx:113-162`）。
- guest本机设置不会写云端或自动导入账号；存储失败不报告已保存。401/账号变化/版本冲突阻止继续提交并给显式重载，未知保存结果提示核对，不伪称失败前数据一定未写入。
- `panel-client.ts`不写9:30提醒或公告已读key；`NotificationBell`保留原reminder unread逻辑。实时预览和晚到内容不会制造新的提醒已读/未读状态。

### 迁移、导出和注销

- `0050`仅新增可空JSONB panel_settings和可空text panel_updated_at；无回填、无NOT NULL、无默认、无其他表变更。对0049/0050快照结构化比较确认只增加这两列。
- 旧应用不识别新增可空列仍可运行；旧偏好更新不清新值。部署需先完成0050再运行读取新列的应用，这是既定发布顺序，尚未在本轮对生产执行。
- `user-data-export.ts:202-204`原为明确字段投影，现包含面板设置和版本并仍按请求用户过滤；测试验证新字段存在、不增加userId泄漏。
- `account-deletion.ts:43`按userId删除daily_preferences整行，自动涵盖新列；无需新增独立遗留数据清理。

## 已收敛的先前问题

当前代码已确认：请求/响应日期绑定；打开面板强制云端刷新；超时后迟到成功不采用；自动读取保留保存冲突提示；失败文案不再声称一定使用默认设置；历史查询独立降级。没有把旧审查意见重复记作未解决发现。

## 验证证据与限制

- 22:00重新运行10个定向测试文件，**81/81通过**：panel-types、panel-service、preview、panel-client、panel-routes、DailyNotificationPanel、DailyNotificationPanel-session、DailyPanelSettings、user-data-export、account-deletion。
- 另一个只读子代理独立复核client/UI会话与超时边界，未发现可确认新缺陷。
- 独立复核指出：PUT超时依赖浏览器原生fetch响应AbortSignal；忽略abort且永不settle的mock会让saving一直等待。现用原生浏览器fetch，没有发现可触发此行为的真实线上路径，因此没有升级为缺陷。现有测试覆盖忽略abort的迟到成功被拒收。
- 这里不宣称真实PostgreSQL并发、真实浏览器焦点/多设备或生产迁移通过；以主代理对应验收记录为准。
