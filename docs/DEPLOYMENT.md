# 部署流程说明

本站采用 GitHub Actions 自动化构建并部署至 GitHub Pages：

- **代码触发**：推送 `master` 分支自动触发 CI 构建。
- **发布分支**：编译产物自动发布到 `gh-pages` 分支根目录。
- **域名配置**：绑定自定义域名 `https://levifree.com/`，由 `public/CNAME` 自动维护。
- **关键标记**：`public/.nojekyll` 用于防止 GitHub Pages 拦截 Astro 的 `_astro/` 静态资源。
- **本地构建**：运行 `pnpm build` 进行本地打包测试。
