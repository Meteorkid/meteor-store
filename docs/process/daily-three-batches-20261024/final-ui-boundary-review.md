# 三批改动：最终UI数据边界只读复核

范围：当前工作区的NotificationBell、announcement-client、DailyNotificationPanel、panel-client active、DailyHub新日/关注CAS、entry-navigation、daily/navigation；辅助核对Header的弹层和断点处理。未改源码/生产，未重复运行已有绿色测试。主代理另行进行隔离构建、API与浏览器验收。

## 结论

当前只读复核未留下未解决的阻塞缺陷。唯一发现的修饰键定位问题已由主代理修复，本分工已回读确认。

## 本轮发现与关闭

### 已关闭：修饰键新开标签也会触发原页锚点聚焦

位置：`src/components/daily/entry-navigation.ts:24-33`。

修复前document click处理只排除`target=_blank`，未检查Ctrl/Meta/Shift/Alt或非主键。触发链：当前日刊已有一个有效entry hash，用户滚动离开该条目，再Ctrl/⌘点击同日期另一个条目以新开标签；处理器仍清空handled并安排reveal，reveal读取的是原窗口仍然保留的旧hash，因此原窗口会被滚动/聚焦回旧条目。这不是用户这次新标签操作的目标。

证据层：直接源码控制流，未追加真实浏览器复现。主代理已在处理器入口排除非主键以及Meta/Ctrl/Shift/Alt，RAF执行前再确认window.location.hash等于目标url.hash；本分工回读代码确认该触发链被阻断。没有机械跳过defaultPrevented，因此保留Next Link正常站内导航的同hash词条展开路径。针对性运行验证由主代理负责，本分工未重复执行。

未发现其他可确认的新阻塞缺陷或跨账号数据泄漏。

## 已核对且正常的边界

- **公告状态**：公共公告store与私人设置分开；显式“标为已读”使用点击时渲染快照的服务端发布时间，不用浏览器当前时间。失败保留旧内容并有重试；Promise.race超时释放占位，旧请求身份检查防迟到回包覆盖。
- **跨标签公告已读**：结合本页、存储和storage事件值保持最大时间；可恢复另一标签旧快照后写入造成的持久值回退。
- **隐藏面板**：NotificationBell keepalive使用hidden；daily active严格由open及daily页签共同决定。panel-client inactive不订阅store、不注册轮询/focus/storage；关闭会解除监听，重开强制确认云端设置，正文仍可复用TTL。在途请求允许完成且有15秒上限，这不等于关闭后新增后台轮询。
- **Header断点疑点已排除**：当前Header只有一个utilities中的NotificationBell（Header.tsx:346）；1024断点变化会closeUtilityMenus（180-188），没有“CSS隐藏已打开桌面铃铛仍active”的已确认路径。
- **账号及草稿**：NotificationBell按userId为DailyNotificationPanel设key；面板编辑会话另绑定owner和Symbol；换号卸载清旧会话。active=false保持同账号草稿，显式取消/成功保存清理；旧保存完成不会关闭新的编辑会话。
- **私有回包**：panel-client读取/保存验证response owner并分桶；强制读取通过request对象识别迟到回包；旧GET不能覆盖保存结果。编辑revision固定到开始编辑，后台读取不清冲突提示。
- **日刊关注CAS**：DailyHub同账号编辑固定draftRevision，409保留草稿并要求显式重读；错误owner要求刷新会话；卸载后旧保存不派发事件或路由跳转。原关注版本与panel版本独立。
- **午夜导航**：subscribeDailyDate只更新today，日历上限、后一日按钮和今日提示随之更新，正在阅读的date/课文/作答不被自动切换。
- **新读数据**：DailyHub会接收同日期新的RSC editions；entry导航随editions重试未出现目标。已处理同一锚点不因普通后台内容刷新反复抢焦点。
- **最近一期深链**：词汇、条目及“查看本栏”均使用contentDate（若无则preview.date）；fallback展示其真实期次，并保留currentStatus提示。全局date仍是请求日，不被拿来拼错历史条目链接。
- **锚点一致性**：预览和全文使用同一dailyEntryAnchor；词汇共同使用term.trim+索引，保留重复词条区分。来源id保持原值，UTF8编码为base64url后只用于内部DOM锚点。
- **登录回跳**：仅/daily路径、单值date/view白名单、真实日历日期、注册栏目/有界entry锚点可通过；重建后整体encodeURIComponent作为next，未发现外部URL或任意参数可逃逸。
- **失败与空稿**：hideEmpty不再隐藏failed或currentStatus=failed；historyFailed单独提示，不遮已有今日内容；历史回退具体日期与状态可同时解释。

## 复核方法与限制

另外委派只读子代理独立检查announcement-client/NotificationBell，其未找到可确认缺陷；Header相关疑点由本分工追踪后排除。没有因缺少新测试就把已有绿色测试升级为新增验证，也没有把本轮静态复核称作实体多设备或生产账号写入验收。

本报告已反映主代理随后提交到工作区的修饰键修复。主代理正在重建最终隔离snapshot；API/PG等验收以其对应日志为准，不在本轮静态复核中重复宣称。
