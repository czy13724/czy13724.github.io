# 部署说明

推送 `master` 分支会运行 GitHub Actions，并将 `dist/` 发布到 `gh-pages` 分支。

项目使用 Astro 7，部署工作流必须使用 Node.js LTS（且不低于 22.12）。发布前可运行：

```bash
pnpm build
```

Vercel 函数位于根目录 `api/`，用于腾讯视频动漫元数据；静态站点内容由 Astro 构建到 `dist/`。
