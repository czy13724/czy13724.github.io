# AdSense 配置说明

本站已接入 Google AdSense 自动广告：

- **脚本注入**：在 `src/layouts/Layout.astro` 中按需加载，自动排除 404 与协议页面。
- **校验文件**：根目录 `public/ads.txt`，构建后通过 `/ads.txt` 提供访问。
