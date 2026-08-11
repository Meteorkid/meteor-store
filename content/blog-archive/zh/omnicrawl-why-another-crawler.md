---
title: OmniCrawl：为什么我们要重新发明爬虫框架
excerpt: 现有爬虫框架的痛点、OmniCrawl 的设计哲学，以及我们如何用三个引擎解决反反爬难题。
date: 2026-07-01
draft: true

section: tech
tags: [Python, 爬虫, 反爬, OmniCrawl]
---
## 问题

市面上不缺爬虫框架。requests、Scrapy、Playwright——每一个都足够成熟。但当你真正面对生产级的数据采集任务时，单一框架总有力不从心的时候。

requests 快但扛不住 WAF；Scrapy 强大但学习曲线陡峭；Playwright 能渲染 JS 但太重太慢。

## 设计哲学

OmniCrawl 的核心理念是 **「一个 API，三个引擎」**：

```python
from omnicrawl import Crawler

crawler = Crawler(engine="auto")  # 自动选择最优引擎
result = await crawler.fetch("https://example.com")
```

`engine="auto"` 时，OmniCrawl 会根据目标站点的特征自动选择：
- **curl_cffi**：速度最快，适合无 JS 渲染的页面
- **Scrapling**：中间层，带 TLS 指纹模拟
- **Playwright**：最后手段，完整浏览器渲染

## 反反爬

绕过 Cloudflare、Akamai 这些 WAF 是真正的硬骨头。OmniCrawl 的做法是：

1. TLS 指纹轮换——不只是改 User-Agent
2. 浏览器指纹模拟——canvas、WebGL、字体列表全套
3. 智能重试——根据响应码和 WAF 特征自动换策略

## 开源

OmniCrawl 完全开源，MIT 协议。代码在 GitHub 上，欢迎 Star 和贡献。
