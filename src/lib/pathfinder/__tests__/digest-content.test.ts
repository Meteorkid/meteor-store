import { afterEach, describe, expect, it, vi } from 'vitest';

// 单测没有 Next 的缓存上下文；与 api/admin/pathfinder 的测试同一种处理
vi.mock('next/cache', () => ({
  unstable_cache: (callback: (...args: unknown[]) => unknown) => callback,
}));

import { fetchDigestContent, parseDigestMarkdown, restructureDigestBody } from '../digest-content';

/** 一期日报的真实结构：出处引用行 → H1 → 综述节 → 带小节的观察节。 */
const SAMPLE = `> 出处:AGI HUNT · https://agihunt.info · AI 资讯日报 2026-09-05

# AI 资讯日报 · 2026-09-05

## 今日总结

讨论从「Astra 已正式发布」转到「用户开始摸到它」，重点如下：

- **自主 Agent 疑似批量篡改多个 Wiki** — 取证指向不止一个站点。

## 分频道观察

### 编程与Agent

编程相关的讨论集中在长任务与工具调用。[详情](https://agihunt.info/p/1a06aaa) 又见 [这条](https://agihunt.info/p/1a06bbb)，以及重复引用 [同一条](https://agihunt.info/p/1a06aaa)。

### 研究

若干论文与基准结果。[详情](https://agihunt.info/p/1a06ccc)
`;

describe('日报全文解析', () => {
  it('取出上游自带的出处声明', () => {
    // 这行必须原样展示：全文是转载，出处不能省
    expect(parseDigestMarkdown(SAMPLE).attribution)
      .toBe('出处:AGI HUNT · https://agihunt.info · AI 资讯日报 2026-09-05');
  });

  it('按 ## 切章节，H1 与出处不算章节', () => {
    const sections = parseDigestMarkdown(SAMPLE).sections;
    expect(sections.map((s) => s.heading)).toEqual(['今日总结', '分频道观察']);
  });

  it('有小节的章节默认折叠，没有的直接展开', () => {
    /*
     * 实测一期 228,602 字里「分频道观察」占 132,728、「分公司动态」占 88,464，
     * 两节合计 97%。全部铺开页面重到没法读，所以按小节折叠。
     */
    const [summary, channels] = parseDigestMarkdown(SAMPLE).sections;
    expect(summary.collapsed).toBe(false);
    expect(summary.html).toContain('Astra');
    expect(channels.collapsed).toBe(true);
    expect(channels.subsections.map((s) => s.heading)).toEqual(['编程与Agent', '研究']);
  });

  it('全篇条目数按去重算', () => {
    /*
     * 同一条快讯常被今日总结和分频道观察各引一次，不去重会把数字吹起来。
     * 这个数会显示在详情页侧栏——去掉恒定的「地区」之后，日报的关键信息
     * 只剩发布时间一行，靠它才说得出点东西。
     */
    expect(parseDigestMarkdown(SAMPLE).itemCount).toBe(3);
  });

  it('按去重后的 /p/ 链接数统计小节条目', () => {
    // 折叠状态下让人在展开前知道值不值得点；同一条被引用多次只算一条
    const [, channels] = parseDigestMarkdown(SAMPLE).sections;
    expect(channels.subsections.map((s) => s.itemCount)).toEqual([2, 1]);
  });

  it('渲染走站内 sanitize 管线，原生 HTML 被丢弃', () => {
    // 全文来自第三方，必须当成不受信任的输入
    const evil = parseDigestMarkdown('## X\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n正常段落。\n');
    expect(evil.sections[0].html).not.toMatch(/script/i);
    expect(evil.sections[0].html).not.toMatch(/onerror/i);
  });

  it('没有 ## 章节时不当作一期日报', () => {
    expect(parseDigestMarkdown('只有一段散文，没有任何章节标题。').sections).toEqual([]);
  });
});

describe('日报全文抓取', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['http://agihunt.info/daily/x.md', 'http 明文'],
    ['https://evil.test/daily/x.md', '非白名单主机'],
    ['not a url', '非法地址'],
  ])('拒绝 %s（%s）', async (url) => {
    /*
     * 地址由条目的 canonicalUrl 推导，而那是抓取管线写进数据库的值——
     * 不能当成可信输入直接 fetch。
     */
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchDigestContent(url, 'agihunt.info')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('上游异常时返回 null，不抛错', async () => {
    // 详情页其余部分照常展示，不该因为拿不到全文整页 500
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
    expect(await fetchDigestContent('https://agihunt.info/daily/x.md', 'agihunt.info')).toBeNull();
  });

  it('正常响应解析成章节', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      text: async () => SAMPLE,
    }));
    const content = await fetchDigestContent('https://agihunt.info/daily/x.md', 'agihunt.info');
    expect(content?.sections.map((s) => s.heading)).toEqual(['今日总结', '分频道观察']);
  });
});

describe('全文失效告警', () => {
  afterEach(() => vi.unstubAllGlobals());

  /** 每个用例换一个地址：告警按地址节流，复用会被上一条压掉。 */
  let seq = 0;
  const freshUrl = () => `https://agihunt.info/daily/2026-01-${++seq}.md`;

  it('抓到内容却切不出章节时报 parse-empty', async () => {
    /*
     * 这是最要紧的一种：意味着上游改了 .md 结构（比如「今日总结」改名）。
     * 其余失败多半会自愈，这一种不会，而且表现是页面安静退回只显示摘要。
     */
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, headers: new Headers(), text: async () => '没有任何二级标题的一段散文。',
    }));
    expect(await fetchDigestContent(freshUrl(), 'agihunt.info')).toBeNull();
    expect(error).toHaveBeenCalledWith(expect.objectContaining({
      event: 'pathfinder_digest_unavailable',
      reason: 'parse-empty',
    }));
    error.mockRestore();
  });

  it('HTTP 错误与网络异常各自归因', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, headers: new Headers() }));
    await fetchDigestContent(freshUrl(), 'agihunt.info');
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ reason: 'http-error', status: 404 }));

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
    await fetchDigestContent(freshUrl(), 'agihunt.info');
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ reason: 'request-failed' }));
    error.mockRestore();
  });

  it('同一地址一小时内只报一次', async () => {
    /*
     * 失败不进缓存，所以上游挂掉时每次请求都会走失败分支。爬虫扫一遍
     * 180 天窗口就是几百行日志，会把 syslog 里真正的信号淹掉。
     */
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const url = freshUrl();
    for (let i = 0; i < 5; i++) await fetchDigestContent(url, 'agihunt.info');
    expect(error).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it('地址非法时不报警也不请求', async () => {
    // 这类是我们自己传错，不是上游的问题，报出来只会制造噪声
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await fetchDigestContent('https://evil.test/x.md', 'agihunt.info')).toBeNull();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

describe('把行内链接提到行首', () => {
  /*
   * 上游写法是「一句话。[详情](u) 又一句话。[详情](u) [详情](u)」串成一整段。
   * 每个「详情」其实是一条独立快讯，混在文字中间时连着出现就成了
   * 「详情 详情 详情」，既看不出哪条链接对应哪句话，也没有固定的可点位置。
   */
  const BULLET = '- **标题** — 句子甲。[详情](https://x/p/a) 句子乙。[详情](https://x/p/b) [详情](https://x/p/c)';

  it('加粗小标题独占一行，每条快讯各自成行且链接在前', () => {
    expect(restructureDigestBody(BULLET).trim().split('\n')).toEqual([
      '- **标题**',
      '  - [详情](https://x/p/a) 句子甲。',
      '  - [详情](https://x/p/b) [详情](https://x/p/c) 句子乙。',
    ]);
  });

  it('段落形态同样重排', () => {
    // 分频道观察那边不是列表而是段落，写法一样
    expect(restructureDigestBody('正文一。[详情](https://x/p/a) 正文二。[详情](https://x/p/b)').trim().split('\n'))
      .toEqual(['- [详情](https://x/p/a) 正文一。', '- [详情](https://x/p/b) 正文二。']);
  });

  it('只重排，不增删链接与文字', () => {
    const out = restructureDigestBody(BULLET);
    expect((out.match(/https:\/\/x\/p\//g) ?? []).length).toBe(3);
    for (const piece of ['标题', '句子甲。', '句子乙。']) expect(out).toContain(piece);
  });

  it('标题、引用与无链接的导语原样透传', () => {
    // 重排是为了固定可点位置，不是重写别人的排版
    const untouched = '#### 小标题\n\n没有链接的一段导语。\n\n> 出处:某站';
    expect(restructureDigestBody(untouched)).toBe(untouched);
  });

  it('句尾只有单条链接且无小标题时不硬拆', () => {
    const single = '一句话带一个链接。[详情](https://x/p/a)';
    expect(restructureDigestBody(single)).toBe(single);
  });
});

