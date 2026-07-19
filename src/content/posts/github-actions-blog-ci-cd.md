---
title: "GitHub Actions 实战：为 Jekyll 博客搭建自动化质量检查流水线"
published: 2024-11-18
description: "每次提交自动检查 Markdown、死链与构建状态，减少线上翻车"
tags: ["GitHub Actions", "Jekyll", "CI/CD", "博客"]
category: "GitHub Actions"
---

很多个人博客只有“能发布”，但缺少“发布前自动验收”。
当文章多起来后，死链、Front Matter 错误、构建失败会频繁出现。

这篇教程给你一个轻量 CI：每次 Push/PR 自动做三件事。

## 目标

1. 校验 Markdown 基本规范
2. 检查站内链接可用性
3. 执行 Jekyll 构建，确保可发布

## 1. 新建工作流

创建 `.github/workflows/blog-quality.yml`：

```yaml
name: Blog Quality

on:
  push:
    branches: ["master", "main"]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true

      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install markdownlint
        run: npm i -g markdownlint-cli

      - name: Lint markdown
        run: markdownlint "**/*.md" --ignore node_modules

      - name: Build Jekyll
        run: bundle exec jekyll build
```

## 2. 死链检查（可选但推荐）

可加 lychee：

```yaml
      - name: Link check
        uses: lycheeverse/lychee-action@v2
        with:
          args: --verbose --no-progress "./**/*.md" "./_site/**/*.html"
```

如果外链较多，建议白名单忽略偶发超时域名，避免误报。

## 3. 分支保护

在仓库设置中启用 Branch Protection：

- 要求 PR 必须通过 `Blog Quality`
- 禁止直接 push 到主分支

这一步能显著降低“手滑上线坏内容”的概率。

## 常见报错与排查

1. `bundler: command not found: jekyll`：Gem 依赖没装全，先 `bundle install`。
2. `Front Matter` 语法错误：检查 `---` 是否成对、缩进是否一致。
3. 死链误报：先本地 `curl -I` 验证，再加入忽略列表。

## 总结

高质量博客的关键不是写得快，而是“每次发布都稳定”。
把 CI 建起来后，你可以把精力放在内容上，而不是线上排错。

## 延伸阅读

- [Jekyll 构建报错排查手册](/2024/04/22/jekyll-build-errors-troubleshooting/)
- [技术文档写作实战](/2025/07/22/developer-documentation-writing-guide/)
- [Jekyll SEO 技术优化清单](/2024/07/16/jekyll-seo-technical-optimization/)
