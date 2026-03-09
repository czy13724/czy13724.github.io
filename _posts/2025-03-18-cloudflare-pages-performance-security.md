---
layout: post
title: "Cloudflare Pages 进阶配置：性能与安全双优化实战"
subtitle: "边缘缓存、压缩、响应头与 WAF 思路，打造更稳的静态站点"
date: 2025-03-18 21:00:00
author: "Levi"
header-img: "img/bg/image_32.jpg"
catalog: true
tags:
    - Cloudflare
    - 性能优化
    - 安全
    - 静态网站
---

把博客托管到 Cloudflare Pages 后，很多人只停留在“能访问”。
其实再做几步配置，就能在性能和安全上都明显提升。

## 1. 缓存策略

建议按资源类型分层缓存：

- HTML：短缓存（便于更新）
- CSS/JS：长缓存 + 文件名指纹
- 图片：长缓存 + 格式协商（WebP/AVIF）

关键点是：可变内容短缓存，不变内容长缓存。

## 2. 压缩与传输

启用 Brotli 与 HTTP/3，可以有效减少传输时延。
如果你站点图片较多，配合 Cloudflare 的图像优化策略，收益会很明显。

## 3. 安全响应头

可在 `_headers` 中加入基础策略：

```text
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

如果你的站内脚本来源明确，可进一步加 CSP。

## 4. Bot 与异常流量控制

对于个人站，建议策略是“温和拦截”：

- 对明显异常 UA 或高频请求加挑战
- 对 RSS、搜索引擎和监控探针做白名单
- 避免一刀切导致正常爬虫被封

## 5. 监控与回归

每次调整后至少观察：

- TTFB 与 LCP 变化
- 错误码比例（403/429/5xx）
- 搜索引擎抓取是否受影响

不要一次性叠太多规则，分批上线才能快速回滚。

## 总结

Pages 只是起点，真正拉开差距的是上线后的持续调优。
把缓存、头部和流量治理做扎实，站点稳定性会长期受益。

## 延伸阅读

- [WebP vs AVIF 实战指南]({{ site.baseurl }}/2025/06/16/webp-vs-avif/)
- [Jekyll SEO 技术优化清单]({{ site.baseurl }}/2024/07/16/jekyll-seo-technical-optimization/)
- [Uptime Kuma 监控实战]({{ site.baseurl }}/2025/05/21/self-hosted-monitoring-uptime-kuma-guide/)
