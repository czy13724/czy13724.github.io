---
title: "GitHub Actions 静态博客 CI/CD 实战：从提交校验到自动发布"
published: 2024-11-18
updated: 2026-11-25
description: "将博客自动化流水线升级到 Astro + pnpm 工程实践：分离 PR 质量门禁与生产部署，配置并发取消、最小权限与 GitHub Pages 兼容项。"
tags: ["GitHub Actions", "CI/CD", "静态博客", "自动化"]
category: "GitHub Actions"
---

## 复盘背景

以前用 Jekyll 时，工作流只写了简单的 `bundle exec jekyll build`，经常在把博客迁到 Astro + TypeScript 之后才发现问题：**本地能跑不代表 CI 能过，CI 能编出 `dist/` 也不代表线上能正常访问**。

我们在后续迭代里先后踩过三个典型的部署坑：一是每次推送都在构建过程中触发并发抢跑，旧构建覆盖新构建；二是部署到 `gh-pages` 分支时漏掉了空文件 `.nojekyll`，导致 `_astro/` 下的所有 JS/CSS 资源被 GitHub Pages Jekyll 引擎吞掉，全站样式崩溃 404；三是把 `gh-pages` 分支顺带触发了 Vercel 的 Preview 构建，白白浪费配额还产生失败邮件。

这份 SOP 把 **PR 质量校验（`lint.yml`）** 与 **主分支构建发布（`deploy.yml`）** 拆开，做到快速反馈与安全发布。

## 前置条件与输入参数

- **代码托管**：GitHub 仓库，默认发布源分支为 `main` 或 `master`，部署产物分支为 `gh-pages`。
- **本地工具链**：Node.js LTS（20/22+）、`pnpm`（`packageManager` 已声明在 `package.json`）。
- **仓库设置**：Settings → Actions → General 中允许 `GITHUB_TOKEN` 读写；若推送到 `gh-pages`，Settings → Pages 指向 `gh-pages` 分支根目录。

## 操作步骤（SOP）

### 1. 配置 PR 质量门禁工作流（`.github/workflows/lint.yml`）

PR 阶段**只读校验，不拿写权限**，把类型检查、代码规范、单元测试和产物构建全部跑一遍：

```yaml
name: Quality Check

on:
  pull_request:
    branches: [master, main]
  push:
    branches: [master, main]

concurrency:
  group: lint-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check & Lint
        run: pnpm run type-check && pnpm exec biome check ./src

      - name: Run unit tests
        run: node --test tests/*.mjs

      - name: Build & verify static output
        run: pnpm run build
```

### 2. 配置主分支自动发布工作流（`.github/workflows/deploy.yml`）

仅当 `master`（或 `main`）有推送或手动触发时执行发布，并开启 `clean: true` 自动清除已删除页面残留在 `gh-pages` 的旧文件：

```yaml
name: Deploy Static Site

on:
  push:
    branches: [master]
  workflow_dispatch:

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm run build

      - name: Ensure .nojekyll and ignore Vercel on gh-pages
        run: |
          touch dist/.nojekyll
          echo '{"ignoreCommand":"exit 0"}' > dist/vercel.json

      - name: Deploy to gh-pages branch
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist
          clean: true
```

### 3. 开启分支保护规则

在 GitHub 仓库 `Settings → Branches → Branch protection rules` 中勾选：

1. `Require a pull request before merging`
2. `Require status checks to pass before merging`，把 `verify` 加入必过检查。

（如果仓库同时保留旧 Jekyll 内容，只需把 `Type check & Lint` 替换为 `bundle exec jekyll build` 与 `lychee` 死链扫描即可，流程完全同构。）

## 真实踩坑复盘与排查记录

1. **现象：部署完成后首页纯 HTML 裸奔，F12 显示 `_astro/*.css` 全部 404**
   - **定位**：GitHub Pages 默认会把任何不含 `.nojekyll` 的目录交给 Jekyll 处理，而 Jekyll 会忽略以下划线 `_` 开头的文件夹（恰好撞上 Astro 的 `_astro/` 构建目录）。
   - **解决**：在 `public/.nojekyll` 放入零字节空文件，并在 CI 构建后强制 `touch dist/.nojekyll` 兜底（注意千万别在 `.nojekyll` 里写注释文本，部分同步脚本会误判文件类型）。

2. **现象：`gh-pages` 每次推送都会收到 Vercel 构建失败通知**
   - **定位**：Vercel 连接整个仓库后，会自动监听所有新推送的分支（包括产物分支 `gh-pages`），把静态 HTML 再当成 Astro 源码构建一次，必然报错。
   - **解决**：构建后写入 `dist/vercel.json`（`{"ignoreCommand":"exit 0"}`），或在仓库根目录 `vercel.json` 中用 `ignoreCommand` 跳过 `VERCEL_GIT_COMMIT_REF == "gh-pages"`。

3. **现象：本地更新了依赖，CI 跑 `pnpm install --frozen-lockfile` 失败**
   - **定位**：本地只改了 `package.json` 却没把最新 `pnpm-lock.yaml` 一并提交，或本地 pnpm 主版本号与 CI 不一致。
   - **解决**：在 `package.json` 固定 `"packageManager": "pnpm@10.x"`，并养成改依赖必提交 lockfile 的习惯。

## 验收清单

```bash
# 1. 本地模拟 CI 全流程（无需等推送）
pnpm install --frozen-lockfile && pnpm run type-check && pnpm exec biome check ./src && node --test tests/*.mjs && pnpm run build

# 2. 确认产物关键边界文件存在
test -f dist/.nojekyll && test -f dist/robots.txt && test -f dist/sitemap-index.xml && echo "OK: deploy artifacts ready"
```

预期结果：本地与 GitHub Actions `verify` 任务均返回退出码 `0`；`gh-pages` 分支更新后，线上请求 `https://blog.example.com/_astro/` 下的样式和脚本返回 HTTP 200。

## 延伸阅读

- [Astro 静态站上线前自动化验收与 CI 流水线：拦截死链、构建回归与合规漏洞](/posts/astro-ci-prelaunch-verification-pipeline/)
- [Astro 静态站图片 404 排查：从引用路径到浏览器回归的完整流程](/posts/astro-static-assets-404-debugging/)
- [Git Rebase vs Merge：团队 PR 工作流如何选才不翻车](/posts/git-rebase-vs-merge-pr-workflow/)
