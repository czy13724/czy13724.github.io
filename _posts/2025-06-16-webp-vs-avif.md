---
layout: post
title: "WebP 与 AVIF：新一代图片格式如何让你的网站飞起来"
subtitle: "图片体积减少 80%？前端性能优化的低垂果实"
date: 2025-06-16 11:30:00
author: "Levi"
header-img: "img/bg/image_43.jpg"
catalog: true
tags:
    - Web
    - 性能优化
    - 前端
    - 图片格式
---

网站加载慢，60% 的原因通常是图片太大。
在很长一段时间里，我们只有 JPEG (适合照片) 和 PNG (适合透明图标) 两个选择。但现在，时代变了。

## 1. WebP：谷歌的馈赠

WebP 由 Google 开发，旨在取代 JPEG、PNG 和 GIF。
*   **压缩率**：在同等画质下，WebP 比 JPEG 小 25-34%。
*   **全能选手**：支持有损压缩、无损压缩、透明通道 (Alpha) 甚至动画。
*   **兼容性**：在 2026 年，所有现代浏览器（Chrome, Firefox, Safari, Edge）都已完美支持。

## 2. AVIF：未来的王者

AVIF 基于 AV1 视频编码技术，是目前的“版本之子”。
*   **极致压缩**：通常比 WebP 还要小 30%！
*   **HDR 支持**：支持 10-bit 和 12-bit 色深，能展现更丰富的色彩。
*   **缺点**：编码速度较慢（服务器生成图片时更耗 CPU），但解码速度已经很快了。

## 3. 如何在项目中使用？

最优雅的方式是使用 HTML5 的 `<picture>` 标签进行“渐进式增强”。

```html
<picture>
  <!-- 优先加载 AVIF (最小) -->
  <source srcset="image.avif" type="image/avif">
  <!-- 其次加载 WebP (兼顾大小和兼容) -->
  <source srcset="image.webp" type="image/webp">
  <!-- 兜底加载 JPG (所有浏览器都认) -->
  <img src="image.jpg" alt="Description">
</picture>
```

浏览器会按顺序扫描。如果它认识 AVIF，就加载 AVIF；如果不认识，就往下找。这样你既享受了新格式的技术红利，又不用担心旧浏览器用户看不了图。

## 4. 自动转换工具

你不需要手动去把每张图导一遍。

*   **构建工具**：Webpack, Vite, Sharp 都有相应的插件，在打包时自动生成多格式图片。
*   **CDN**：Cloudflare 等 CDN 服务商提供 "Polish" 功能，可以根据访问者的浏览器自动把 JPG 转换成 WebP 发送，一行代码都不用改。

## 5. 总结

如果你还在用几百 KB 的 PNG 大图做背景，赶紧换成 WebP 或 AVIF 吧。这是提升 Lighthouse 分数最立竿见影的手段。
