---
title: "静态博客反向代理与域名替换实战：Nginx 与 Cloudflare Workers 零重定向回环方案"
published: 2026-11-22
description: "解决静态博客反代换域名的常见痛点：前端根相对路径解耦、Nginx/Workers 回源配置与响应改写，以及彻底消除 301/308 跨域重定向回环。"
tags: ["Nginx", "Cloudflare Workers", "反向代理", "域名架构"]
category: "Nginx"
---

## 复盘背景

把静态博客部署在 GitHub Pages 或 Vercel 后，经常会遇到需要通过反向代理替换访问域名的场景：比如源站默认域名在部分地区访问受限，或者希望在另一套主域名下统一接入 CDN 与安全策略。

直接套一层 `proxy_pass` 上去往往会立刻撞墙——**访问 `proxy.example.com`，结果被源站一脚 `301`/`308` 踢回 `origin.example.com`**；或者页面好不容易打开了，F12 一看 `<link rel="canonical">`、RSS 订阅链接、分享海报二维码和评论系统全是指向旧域名。更麻烦的是，如果同时对接了广告审核（如 AdSense）或搜索引擎，跨域多跳重定向会被直接判定为“将用户重定向至不相关或误导性的网页”。

这篇复盘把前端解耦与反代层的两种成熟落地方案（Nginx 与 Cloudflare Workers）整理成可直接复现的 SOP。

## 前置条件与输入参数

- **架构拓扑**：
  - 访客入口域名（反代层）：`https://proxy.example.com`
  - 上游静态源站：`https://origin.example.com`
- **前端工程条件**：能修改静态站源码（本文以 Astro 为例，其他框架思路相同），确保核心导航与协议文件不硬编码绝对域名。
- **反代节点**：一台已配置好 TLS 证书的 Nginx 1.24+ 服务器，或一个可绑定自定义路由的 Cloudflare Workers 账号。

## 操作步骤（SOP）

### 1. 前端源站先行解耦域名硬编码

在动反代配置前，先把前端项目里“写死域名”的地方改掉，能靠相对路径和运行时 `window.location` 解决的，绝对不要在构建期写死：

1. **Canonical 与 RSS 发现标签改为根相对路径**：
   - `<link rel="canonical" href={Astro.url.pathname} />`
   - `<link rel="alternate" type="application/rss+xml" href="/rss.xml" />`
2. **版权声明、订阅复制框与二维码使用运行时源站**：
   - 页面展示链接文本、RSS 复制框和分享二维码在客户端用 `window.location.origin` 与 `window.location.href` 动态生成，避免反代站点复制出源站链接。
3. **开放构建期 `SITE_URL` 环境变量覆盖**：
   - 对协议规定必须输出绝对 URL 的文件（`sitemap-*.xml`、`rss.xml`、`atom.xml`、`robots.txt`、`og:url`），在站点配置中支持读取环境变量：

```ts
const rawSiteUrl =
	(typeof process !== "undefined" ? process.env?.SITE_URL : undefined) ||
	"https://origin.example.com/";
export const SITE_URL = rawSiteUrl.endsWith("/") ? rawSiteUrl : `${rawSiteUrl}/`;
```

4. **评论系统（如 Giscus）放行反代域名白名单**：
   - 将 `https://proxy.example.com` 加入 `giscus.json` 的 `origins` 数组（不要偷懒写通配符 `.*`）。

### 2. 方案 A：使用 Nginx 反向代理（含 SNI 与文本替换）

如果源站是托管在 Vercel / Cloudflare / GitHub Pages 上的 HTTPS 服务，Nginx 回源时**必须打开 SNI**，且在做 `sub_filter` 替换协议文件（如 `sitemap` / `rss.xml`）中的旧域名时，需向源站声明不压缩响应体：

```nginx
server {
    listen 443 ssl http2;
    server_name proxy.example.com;

    ssl_certificate     /etc/ssl/proxy.example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/proxy.example.com/privkey.pem;

    location / {
        proxy_pass https://origin.example.com;

        # 关键：传递上游所需的 SNI 与 Host
        proxy_ssl_server_name on;
        proxy_set_header Host origin.example.com;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 重写上游返回的 Location 跳转头，防止把访客踢回源站域名
        proxy_redirect https://origin.example.com/ https://proxy.example.com/;
        proxy_redirect http://origin.example.com/ https://proxy.example.com/;

        # 若未用 SITE_URL 重新构建，可开启 sub_filter 替换 XML/HTML 中的残留绝对 URL
        proxy_set_header Accept-Encoding "";
        sub_filter_types text/html application/xml text/xml application/rss+xml application/atom+xml text/plain;
        sub_filter_once off;
        sub_filter 'https://origin.example.com' 'https://proxy.example.com';
    }
}
```

校验并重载 Nginx：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3. 方案 B：使用 Cloudflare Workers 无服务器反代

如果没有独立 VPS，可以在 Cloudflare Workers 绑定 `proxy.example.com/*` 路由，重写请求 Host、响应 `Location` 重定向头以及 XML/HTML 文本里的绝对域名：

```javascript
const ORIGIN_HOST = "origin.example.com";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const upstreamUrl = new URL(request.url);
    upstreamUrl.hostname = ORIGIN_HOST;
    upstreamUrl.protocol = "https:";

    const headers = new Headers(request.headers);
    headers.set("Host", ORIGIN_HOST);
    headers.set("X-Forwarded-Host", incomingUrl.hostname);

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers,
      redirect: "manual",
    });

    const outHeaders = new Headers(upstreamRes.headers);
    const location = outHeaders.get("Location");
    if (location) {
      outHeaders.set(
        "Location",
        location.replaceAll(`https://${ORIGIN_HOST}`, `https://${incomingUrl.hostname}`)
                .replaceAll(`http://${ORIGIN_HOST}`, `https://${incomingUrl.hostname}`),
      );
    }

    const contentType = outHeaders.get("Content-Type") || "";
    const shouldRewrite =
      contentType.includes("text/html") ||
      contentType.includes("xml") ||
      contentType.includes("text/plain");

    if (!shouldRewrite) {
      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: outHeaders,
      });
    }

    const bodyText = await upstreamRes.text();
    const rewritten = bodyText.replaceAll(
      `https://${ORIGIN_HOST}`,
      `https://${incomingUrl.hostname}`,
    );
    outHeaders.delete("Content-Length");

    return new Response(rewritten, {
      status: upstreamRes.status,
      headers: outHeaders,
    });
  },
};
```

## 真实踩坑复盘与排查记录

1. **现象：直接访问 `proxy.example.com` 被连跳三次重定向到 `www.origin.example.com`**
   - **定位**：GitHub Pages 启用了 `CNAME` 强制跳到根域，Vercel 又把根域 `308` 跳到了 `www` 子域，而反代层默认把上游 `301/308` 原封不动透传给了客户端，形成 `301 -> 308 -> 308` 链条。
   - **解决**：源站保留一个直达无跳转的规范接入点（如 Vercel 的主绑定域与 `siteURL` 一致，或解除多余 `CNAME` 跳转），并在反代层开启 `redirect: "manual"` / `proxy_redirect` 拦截改写 `Location`。

2. **现象：配了 Nginx `sub_filter`，但 `sitemap-0.xml` 里的链接依然没有被替换**
   - **定位**：一是因为上游默认返回了 `gzip`/`br` 压缩流，Nginx 不会解压后再跑 `sub_filter`；二是 `sub_filter_types` 默认只处理 `text/html`，漏掉了 `application/xml` 与 `text/plain`。
   - **解决**：显式加上 `proxy_set_header Accept-Encoding "";` 并在 `sub_filter_types` 中补全 XML/RSS/Atom/TXT MIME 类型。

3. **现象：Nginx 回源 HTTPS 源站直接返回 `502 Bad Gateway` 或 `403`**
   - **定位**：主流 Serverless/CDN 边缘节点依赖 TLS SNI 匹配站点证书，Nginx 默认不发送 SNI 扩展。
   - **解决**：加上 `proxy_ssl_server_name on;`。

## 验收清单

通过 `curl` 逐一核对反代入口的状态码、跳转次数与关键标签输出：

```bash
# 1. 核心页面与静态协议文件必须单跳直出 HTTP 200（不能出现 301/302/308 跨域跳转）
for path in "/" "/ads.txt" "/robots.txt" "/sitemap-index.xml" "/rss.xml" "/atom.xml"; do
  echo -n "$path => "
  curl -sSI --max-time 6 "https://proxy.example.com${path}" | awk 'NR==1{code=$2} /^location:/{loc=$2} END{print code, loc}'
done

# 2. 检查 HTML 中 canonical 与 rss link 不泄露源站域名
curl -sS https://proxy.example.com/ | grep -E '<link rel="(canonical|alternate)"'

# 3. 检查 sitemap / robots 中已替换为反代域名
curl -sS https://proxy.example.com/robots.txt
```

预期结果：所有核心路由均直接返回 `200` 且无 `Location` 跨域跳转；HTML `<link rel="canonical">` 保持根相对路径 `/`，`robots.txt` 与 `sitemap` 中的域名全部为 `https://proxy.example.com`。

## 延伸阅读

- [Nginx 502/504 排错指南：反向代理常见故障的定位与修复](/posts/nginx-502-504-troubleshooting/)
- [Cloudflare Pages 性能与安全配置：先验证默认行为，再做最小改动](/posts/cloudflare-pages-performance-security/)
- [静态站技术 SEO 与可抓取性核验手册：从状态码、规范链接到结构化数据](/posts/static-site-technical-seo-crawlability-checklist/)
