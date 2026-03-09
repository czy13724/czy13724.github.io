---
layout: post
title: "Jekyll SEO 技术优化清单：从可抓取到可排名的实战配置"
subtitle: "Sitemap、结构化数据、Canonical 与内容聚合页，给个人博客一套可执行的 SEO 基线"
date: 2024-07-16 20:10:00
author: "Levi"
header-img: "img/bg/image_30.jpg"
catalog: true
tags:
    - Jekyll
    - SEO
    - 博客
    - Web
---

很多博客“写了很多”，但搜索曝光一直上不去，通常不是内容完全不行，而是技术层面没有打底。
本文给你一套适用于 Jekyll 站点的 SEO 技术清单，目标是先做到“可抓取、可理解、可归档”。

## 1. 抓取与索引基础

先确认三件事：

1. `robots.txt` 可访问且规则正确
2. `sitemap.xml` 可访问并包含文章 URL
3. 文章页面不含误设的 `noindex`

最小检查命令：

```bash
curl -I https://your-domain.com/robots.txt
curl -I https://your-domain.com/sitemap.xml
```

## 2. 统一 Canonical 规则

Jekyll 很容易因为分页、分类页或参数链接出现重复 URL。
建议每篇文章都输出 canonical，指向唯一正式地址。

示例（放在 `<head>`）：

```html
<link rel="canonical" href="{{ site.url }}{{ page.url | replace:'index.html','' }}">
```

## 3. 结构化数据（JSON-LD）

给文章页补 `BlogPosting` 结构化数据，帮助搜索引擎理解正文类型与作者信息。

关键字段至少包含：

- `headline`
- `datePublished`
- `dateModified`
- `author`
- `mainEntityOfPage`

如果你有封面图，补上 `image` 字段效果更好。

## 4. 信息架构：聚合页要有价值

很多站点的标签页/归档页只有一堆链接，内容太薄。
建议：

- 每个聚合页增加主题说明
- 给重点分类写导读段
- 在聚合页内部做“新手入口”与“进阶入口”

这样不仅提升用户体验，也能减少“薄内容页面”信号。

## 5. 内链策略

每篇技术文至少做两类内链：

- 横向内链：同主题相关文章
- 纵向内链：前置知识和进阶教程

原则：内链要服务阅读路径，而不是为了凑数量。

## 6. 元数据与可读标题

发布前检查：

- `title` 不做标题党，包含明确主题词
- `subtitle` 补充场景和收益
- `tags` 与正文一致，避免泛标签
- 首段 80-120 字讲清“这篇文帮你解决什么”

## 7. 性能与 SEO 联动

技术 SEO 不只是标签，页面体验也影响结果。

建议优先优化：

- 首屏图片体积
- 阻塞渲染的 JS/CSS
- 移动端可读性

## 8. 发布后的验证流程

1. 本地 `bundle exec jekyll build` 确认构建成功
2. 上线后手动检查关键页面状态码
3. 在搜索控制台提交 sitemap
4. 观察 2-4 周曝光和索引变化

## 总结

对个人博客来说，SEO 的第一步不是“研究黑科技”，而是先把技术基线做完整。
当抓取、结构和体验都达标时，优质内容的价值才会被更稳定地放大。

## 延伸阅读

- [静态博客内容集群策略]({{ site.baseurl }}/2025/10/14/static-blog-content-cluster-strategy/)
- [Jekyll 构建报错排查手册]({{ site.baseurl }}/2024/04/22/jekyll-build-errors-troubleshooting/)
- [AdSense 低价值内容恢复实战]({{ site.baseurl }}/2025/03/09/adsense-low-value-content-recovery/)
