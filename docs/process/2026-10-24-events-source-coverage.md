# 活动栏目：GitHub Universe来源覆盖

状态：第3批源码和定向测试完成，未提交、部署、启用生产来源或手工补跑。此改动补来源覆盖，不承诺近期每天都有活动公告。

## 改动

- 新增唯一来源`github-universe-events`：[GitHub Universe官方RSS](https://github.blog/tag/github-universe/feed/)。复用既有RSS适配器与小时同步，每轮最多10条；fetch/item主机仍只允许`github.blog`，不增加依赖、数据库迁移或cron。
- 活动SQL预筛选和JS最终判定都新增完整`GitHub Universe`品牌，并限于该新来源与`github-ai-blog`。已有URL可能由旧AI来源持有，不迁移其sourceId。
- 品牌匹配有词边界，不接受独立Universe/Build、复数或相似单词，也不把中英标题两列拼成品牌。保留研究/数据集否定规则、真实来源日期、30天窗口、官方主机和历史ID/URL去重。
- 使用RSS pubDate作为来源发布日期，仍是announcement；不从文章时间推断活动开始时间、时区或直播状态。既有人工暂停、历史不回填规则没有改动。

## 本次来源验证

2026-10-24 12:48，本机官方RSS返回200、`application/rss+xml`、142957字节、10个item，均有title/link/pubDate。12:52生产机仅做一次有界GET，200、352ms、相同体积和条目数；未调用同步job或写数据库。

最新样本为[10月1日官方Universe议程推荐](https://github.blog/news-insights/company-news/10-technical-talks-im-excited-about-at-github-universe-2026/)，RSS给出`2026-10-01T15:07:16Z`，网页日期一致。该样本不是近七天新稿，不能为填空而篡成今日日期或重发旧期。

此前只读库复核显示，10/23活动30天窗口内官方记录92条，仅1条命中活动候选，而且此前已经收录；近七天empty不能归因于生成任务失败。现有GitHub来源仅抓AI & ML，而Universe公告在Company news，新增来源解决的是这部分覆盖。

## 验证

- 新增测试先复现5项失败，再实现后，events、ingestion、source-health、content、opportunities、open-source共6个测试文件、201项通过；相关ESLint与diff检查通过。
- 最小RSS fixture仅保留真实链接/pubDate及字段结构，标题和摘要明确为合成文本。覆盖官方URL归一化、错误主机拒绝、真实发布日期、新旧来源URL去重和历史已用不重发。
- 独立本机PostgreSQL18.6仅运行VALUES查询，12组SQL品牌/来源/词边界样本全部通过；端口53874的任务自有实例已关闭并删除数据目录，根任务55445实例未触碰。这不算生产来源已经同步或出刊。

```sh
pnpm exec vitest run src/lib/daily/__tests__/events.test.ts src/lib/pathfinder/__tests__/ingestion.test.ts src/lib/pathfinder/__tests__/source-health.test.ts src/lib/daily/__tests__/content.test.ts src/lib/daily/__tests__/opportunities.test.ts src/lib/daily/__tests__/open-source.test.ts
```

上线后等待原小时同步与日刊补跑，核对来源计数、pubDate和去重；真实没有合格新公告时仍可empty。本批不主动触发生产采集或为验收填充内容。

研究及隔离证据：`/tmp/meteor-daily-three-batches-20261024/events-research.md`、`feed-observations.json`、`github-rss-production-probe.json`、`events-sql-validation.json`。
