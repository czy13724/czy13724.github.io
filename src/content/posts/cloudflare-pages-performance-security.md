---
title: "Cloudflare Pages 性能与安全配置：先验证默认行为，再做最小改动"
published: 2025-03-18
description: "从 Pages 默认缓存、静态响应头到上线后的验证，避免为了优化而制造陈旧内容或安全回归"
tags: ["Cloudflare", "性能优化", "安全", "静态网站"]
category: "Cloudflare"
---

Cloudflare Pages 的性能优化最容易犯的错误，是还没确认默认行为就叠加缓存规则。Pages 已为静态资源提供 CDN 缓存与 ETag；自定义规则应只解决已经测到的问题，而不是作为默认动作。[Cloudflare 的 Pages 文档](https://developers.cloudflare.com/pages/configuration/serving-pages/) 也明确提醒，额外缓存可能造成部署后的陈旧资源。

## 1. 先建立基线

在修改前记录三个页面：首页、带图片的文章页、404 页。用浏览器网络面板或 `curl -I` 保存响应状态、`cache-control`、`etag` 和资源体积。部署后使用同一组 URL 对比，而不是只看一次 Lighthouse 分数。

```bash
curl -I https://example.com/
curl -I https://example.com/assets/app.abc123.css
```

如果 HTML 更新后仍显示旧版本，先确认是否已经完成新部署，再排查浏览器缓存与自定义 Cache Rule；不要一开始就给所有路径设置超长 TTL。

## 2. 只对不可变资源加浏览器缓存

带内容哈希的 CSS、JS 与构建产物适合长缓存，因为文件名变化就代表内容变化。不要把同样的规则套到文章 HTML、RSS 或 API 数据上。Cloudflare Pages 支持在静态资产目录放置 `_headers` 文件；若项目使用 Functions/SSR，响应头应在函数响应中设置，而不是依赖 `_headers`。

```text
/assets/*
  Cache-Control: public, max-age=31556952, immutable
```

上线后强制刷新一次首页，并在无痕窗口确认新部署的 HTML 能引用到新资源。出现旧页面时，立即撤回该规则或清理缓存，再重新验证。

## 3. 采用低风险安全响应头

静态站可从不会破坏站内资源的头开始：

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

`Content-Security-Policy` 需要在真实页面加载后再逐步收紧。先从 report-only 或明确列出已有脚本、字体、图片域名开始；直接套用 `default-src 'self'` 可能使分析、评论或字体加载失效。

## 4. 上线验收清单

1. 首页、文章页与 404 返回正确状态码。
2. 主 CSS、JS 和图片没有 404。
3. 新部署后无痕窗口可立即看到更新。
4. 移动端菜单、搜索与外部组件没有被 CSP 阻断。
5. 仅在确定内容完全静态时才扩大缓存范围。

这套顺序的目标不是“配置越多越好”，而是让每一条规则都有可复核的收益和明确回滚点。
