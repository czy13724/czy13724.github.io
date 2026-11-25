---
title: "静态站技术 SEO 与可抓取性核验手册：从状态码、规范链接到结构化数据"
published: 2026-11-25
description: "一份可直接执行的静态网站技术 SEO 与 AdSense 审核自检 SOP：覆盖重定向链、robots/sitemap 一致性、canonical、Feed 合法性与死链扫描。"
tags: ["SEO", "静态网站", "AdSense", "可抓取性"]
category: "内容运营"
---

## 复盘背景

写博客最容易被忽视的一件事是：你以为文章写完推上去就结束了，但对搜索引擎和 AdSense 审核爬虫来说，它们看到的首先是一张由 **HTTP 状态码、重定向链、robots.txt、sitemap、canonical 与 HTML 语义标签** 构成的技术信号网。

只要其中任何一个环节打架——比如提交审核的是 A 域名，结果线上 301/308 连跳到 B 域名；或者 `sitemap` 里收录了被重定向到 `404` 的功能页；再或者文章里的内链还是迁移前的旧路径——爬虫就会毫不留情地给出“链接到不存在的内容”或“重定向至误导性网页”的判定。

这份核验手册把每次重大改版或提交审核前必查的技术细节收敛为 5 个可执行的检查步骤。

## 前置条件与输入参数

- **检查工具**：`curl`、Python 3.10+。
- **目标站点**：已部署在线上或本地预览的静态站点（示例域名 `https://blog.example.com`）。

## 操作步骤（SOP）

### 1. 核验入口域名重定向链（严禁超过 1 跳且不能跨域漂移）

```bash
curl -sSI -L --max-redirs 5 https://blog.example.com/ | grep -iE "^(HTTP/|location:)"
curl -sSI http://blog.example.com/ | grep -iE "^(HTTP/|location:)"
```

标准健康状态：
- `https://blog.example.com/` 直接返回 `HTTP/2 200`（0 跳转）；
- `http://blog.example.com/` 单跳 `301`/`308` 到 `https://blog.example.com/`；
- 如果同时存在 `www` 与根域名，只能保留**单跳**向规范主域的跳转，切忌出现“平台 A 跳根域 $\rightarrow$ 平台 B 跳 `www`”的多跳链路。

### 2. 对齐 `robots.txt`、`sitemap` 与 `404.html` 索引边界

抓下来对比三者是否自相矛盾：

```bash
curl -sS https://blog.example.com/robots.txt
curl -sS https://blog.example.com/sitemap-index.xml
curl -sS https://blog.example.com/non-existent-probe-url/ | grep -i "robots"
```

核验规则：
1. `robots.txt` 不应屏蔽正文目录（如 `/posts/`、`/assets/`、`_astro/`），但要精确 `Disallow` 已关闭或纯接口路由（如 `/api/` 及已下线功能页）；
2. `sitemap` 中**绝对不能出现** `/404`、已关闭页面或带 `noindex` 的 URL；
3. `404.html` 必须包含 `<meta name="robots" content="noindex, nofollow" />`，且不要把“返回首页”做成软重定向或隐藏外链。

### 3. 检验 `<link rel="canonical">`、OG 标签与 XML Feed 合法性

```bash
# 检查首页和任意文章页的 canonical 与 OG 标签
curl -sS https://blog.example.com/ | grep -iE '<link rel="canonical"|<meta property="og:|application/ld\+json'

# 用 Python 标准库直接解析 rss.xml 与 atom.xml，确保无未转义字符报错
python3 - <<'EOF'
import urllib.request
import xml.etree.ElementTree as ET

for path in ["/rss.xml", "/atom.xml"]:
    data = urllib.request.urlopen("https://blog.example.com" + path, timeout=10).read()
    ET.fromstring(data)
    print(f"OK: {path} valid XML ({len(data)} bytes)")
EOF
```

如果网站同时需要兼容反代域名，`<link rel="canonical">` 使用根相对路径（如 `/posts/example/`）能避免在反代站上指向源站域名。

### 4. 审计 HTML 语义地标与站内导航链接有效性

检查核心模板是否正确使用 `<header>`、`<nav>`、`<main>`、`<aside>`、`<footer>` 语义标签，并消灭以下 4 类高危导航模式：
- `href="#"` 或 `href="javascript:void(0)"` 的伪链接（未绑事件或无法回退时直接变成死交互）；
- 本应作为静态展示卡片却外包空 `<a href="">` 标签；
- 通过无刷新路由（如 Swup）跳转后，未在纯功能页/协议页卸载广告脚本；
- 迁移后残留的旧格式内链。

### 5. AdSense 导航与文件可达性专项核验

```bash
# 1. ads.txt 必须直接返回 200 且内容格式正确
curl -sS -w "\nHTTP=%{http_code}\n" https://blog.example.com/ads.txt

# 2. 检查非内容页（404 / 隐私政策 / 归档 / 友链）是否已隔离广告脚本
for p in "/404.html" "/privacy/" "/archive/" "/friends/"; do
  count=$(curl -sS "https://blog.example.com${p}" | grep -c "adsbygoogle.js" || true)
  echo "$p -> adsbygoogle count: $count"
done
```

预期结果：所有非内容页与纯导航页 `adsbygoogle.js` 出现次数均为 `0`，而首页与正文页正常加载。

## 真实踩坑复盘与排查记录

1. **现象：`sitemap.xml` 过滤器漏掉或误杀文章**
   - **定位**：使用了宽松的 `page.includes("/projects")` 字符串包含匹配，一旦某篇技术文章的 slug 里恰巧包含该词就会被误删；而 `/404` 却因为不在排除列表里被收录进了索引。
   - **解决**：先用 `new URL(page).pathname` 提取规范路径，再按精确前缀 `pathname === route || pathname.startsWith(route)` 匹配，并显式排除 `/404`。

2. **现象：RSS 阅读器订阅 `atom.xml` 报语法错误**
   - **定位**：手工模板拼接 XML 字符串时，某篇文章标题里出现了 `&` 符号（如 `A & B`），未做 `&amp;` 转义。
   - **解决**：对 `<title>`、`<subtitle>`、`<summary>`、`<name>` 及属性字段全部经过 XML 实体转义，并在 CI 构建后强制跑一遍 `xml.etree.ElementTree` 解析校验。

3. **现象：旧功能页关闭后仍然被搜索引擎抓取并报“重定向错误”**
   - **定位**：静态框架下给关闭的页面写了 `return Astro.redirect("/404/")`，静态构建后实际上在 `dist/` 生成了一个返回 HTTP 200 的 `<meta http-equiv="refresh" content="0;url=/404/">` 软跳转页面。
   - **解决**：动态子路由在 `getStaticPaths()` 中直接返回空数组不产出文件，同时在 `robots.txt` 与 `sitemap` 中彻底剔除对应路由。

## 验收清单

- [ ] 主域名单跳可达（HTTP $\rightarrow$ HTTPS 一跳，HTTPS 直出 `200`），无跨域名 301/308 跳转链；
- [ ] `ads.txt` 与 `robots.txt` 直接返回 `200`，规则与线上启用的页面完全一致；
- [ ] `rss.xml`、`atom.xml` 与 `sitemap-index.xml` 全部通过 XML 解析且不含 `/404`；
- [ ] 站内文章与页面无 `404` 内链、`javascript:void(0)` 死交互或伪装导航广告位。

## 延伸阅读

- [AdSense 低价值内容恢复实战：个人技术博客 30 天优化清单](/posts/adsense-low-value-content-recovery/)
- [技术博客内容集群怎么做：用现有文章建立读者能走通的阅读路径](/posts/static-blog-content-cluster-strategy/)
- [静态博客反向代理与域名替换实战：Nginx 与 Cloudflare Workers 零重定向回环方案](/posts/static-site-reverse-proxy-domain-rewrite-guide/)
