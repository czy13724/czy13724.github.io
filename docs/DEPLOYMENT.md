# 部署说明

推送 `master` 分支会运行 GitHub Actions，并将 `dist/` 发布到 `gh-pages` 分支。

GitHub 仓库的 **Settings → Pages** 必须选择 `gh-pages` 分支的 `/ (root)` 作为发布来源；不要选择 `master`。否则 GitHub 会额外按 Jekyll 构建 Astro 源码，产生独立的 `pages build and deployment` 失败记录。

项目使用 Astro 7，部署工作流必须使用 Node.js LTS（且不低于 22.12）。发布前可运行：

```bash
pnpm build
```

Vercel 函数位于根目录 `api/`，用于腾讯视频动漫元数据；静态站点内容由 Astro 构建到 `dist/`。
