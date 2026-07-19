# 部署说明

推送 `master` 分支会运行 GitHub Actions，并将 `dist/` 发布到 `gh-pages` 分支。

GitHub 仓库的 **Settings → Pages** 必须选择 `gh-pages` 分支的 `/ (root)` 作为发布来源；不要选择 `master`。否则 GitHub 会额外按 Jekyll 构建 Astro 源码，产生独立的 `pages build and deployment` 失败记录。

当前站点使用 `https://levifree.dpdns.org/`。自定义域名由 GitHub Pages 后台的 Custom domain 字段维护；构建产物不保留 `CNAME`，避免旧分支文件覆盖后台配置。

发布工作流会额外删除 `gh-pages` 分支中被部署工具保护的旧 `CNAME` 文件。GitHub Pages 后台的“Custom domain”字段不由仓库文件控制；若仍填写 `levifree.dpdns.org`，需在 Settings → Pages 中手动清空后保存。

`public/.nojekyll` 必须保留。Astro 将样式、脚本和优化图片输出到 `_astro/`；没有该文件时，GitHub Pages 会按 Jekyll 规则忽略该目录，线上页面会出现 CSS 404 和布局错乱。

为避免自定义域名和 CDN 代理环境下的异步页面切换卡住，当前发布使用浏览器原生页面跳转，不启用 Swup 过渡动画。

项目使用 Astro 7，部署工作流必须使用 Node.js LTS（且不低于 22.12）。发布前可运行：

```bash
pnpm build
```

Vercel 函数位于根目录 `api/`，用于腾讯视频动漫元数据；静态站点内容由 Astro 构建到 `dist/`。
