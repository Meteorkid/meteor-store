---
title: "OmniCrawl: Why We Reinvented the Crawler Framework"
excerpt: The pain points of existing crawler frameworks, OmniCrawl's design philosophy, and how we tackle the anti-anti-crawl problem with three engines.
date: 2026-07-01
draft: true

section: tech
tags: [Python, 爬虫, 反爬, OmniCrawl]
---
## The Problem

There's no shortage of crawler frameworks out there. requests, Scrapy, Playwright — each one is mature enough on its own. But when you actually face production-grade data collection tasks, a single framework always has moments where it falls short.

requests is fast but can't stand up to WAFs; Scrapy is powerful but has a steep learning curve; Playwright can render JS but is too heavy and too slow.

## Design Philosophy

The core idea behind OmniCrawl is **"one API, three engines"**:

```python
from omnicrawl import Crawler

crawler = Crawler(engine="auto")  # Automatically picks the optimal engine
result = await crawler.fetch("https://example.com")
```

With `engine="auto"`, OmniCrawl automatically selects based on the target site's characteristics:
- **curl_cffi**: the fastest, suited for pages with no JS rendering
- **Scrapling**: the middle layer, with TLS fingerprint simulation
- **Playwright**: the last resort, full browser rendering

## Anti-Anti-Crawl

Bypassing WAFs like Cloudflare and Akamai is the real hard part. OmniCrawl's approach:

1. TLS fingerprint rotation — not just changing the User-Agent
2. Browser fingerprint simulation — canvas, WebGL, font list, the whole package
3. Intelligent retry — automatically switches strategy based on response codes and WAF signatures

## Open Source

OmniCrawl is fully open source under the MIT license. The code is on GitHub — stars and contributions welcome.
