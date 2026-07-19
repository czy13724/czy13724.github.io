---
layout: post
title: "Jekyll 构建报错排查手册：10 个最常见错误与修复步骤"
subtitle: "从 Front Matter、依赖冲突到端口占用，给博客维护者一份可复制的故障处理流程"
date: 2024-04-22 20:30:00
author: "Levi"
header-img: "img/bg/image_26.jpg"
catalog: true
tags:
    - Jekyll
    - 排错
    - Ruby
    - 博客
---

Jekyll 的问题往往不是“大故障”，而是被一堆小问题反复打断：今天 front matter 报错，明天 gem 版本冲突。
这篇文章把我最常遇到的 10 类构建错误整理成标准排查流程。

## 1. `bundler: command not found: jekyll`

原因：本地依赖未安装完整。

修复：

```bash
bundle install
bundle exec jekyll serve
```

如果你是新机器，先确认 Ruby 与 Bundler 已安装。

## 2. Front Matter 解析失败

常见错误信息：

```text
YAML Exception reading ...
```

高频原因：

- `---` 没有成对出现
- 缩进混用空格和 tab
- `title` 等字段含未转义特殊字符

修复建议：

- 先从报错文件顶部 30 行开始查
- 用 2 空格统一缩进

## 3. 日期格式导致文章不显示

原因：`date` 字段格式非法或未来时间策略不一致。

检查：

- 是否使用 `YYYY-MM-DD HH:MM:SS`
- `_config.yml` 中 `future` 设置是否符合预期

## 4. 端口占用，服务启动失败

报错示例：

```text
Address already in use - bind(2)
```

修复：

```bash
lsof -i :4000
kill -9 <PID>
bundle exec jekyll serve --port 4001
```

## 5. 中文路径或编码问题

有些系统环境下，非 UTF-8 文件会导致解析异常。

建议：

- Markdown 文件统一 UTF-8
- 文件名尽量使用英文、数字、连字符

## 6. 插件环境差异（本地能跑，线上失败）

原因：本地插件和 GitHub Pages 支持插件集合不一致。

处理：

- 优先使用 GitHub Pages 白名单插件
- 或改成 Actions 自构建后发布 `_site`

## 7. Liquid 语法错误

常见在 include 和循环中。

示例问题：

- 标签未闭合
- 变量名拼错
- 条件判断写法不合法

排查技巧：

- 从最近改动的布局文件开始定位
- 临时注释可疑块做二分排查

## 8. 资源路径 404

多见于 `baseurl` 配置不一致。

建议：

- 本地和线上都统一通过 `{{ site.baseurl }}` 拼路径
- 图片与脚本避免硬编码绝对路径

## 9. 增量构建缓存导致“改了不生效”

修复：

```bash
bundle exec jekyll clean
bundle exec jekyll serve
```

## 10. 依赖版本冲突

症状：更新 gem 后突然无法构建。

处理流程：

1. 先看 `Gemfile.lock` 变更
2. 回退到上一个可用锁版本
3. 分批升级 gem，不要一次性全升

## 一套通用排查流程

1. 先看第一条报错，不要被后续连锁错误干扰
2. 锁定“最近修改文件”优先检查
3. 先恢复可构建，再做优化

## 总结

Jekyll 排错的关键是流程化，而不是临时猜测。
把这 10 条高频问题掌握后，90% 的构建故障都能快速定位。

## 延伸阅读

- [Jekyll SEO 技术优化清单]({{ site.baseurl }}/2024/07/16/jekyll-seo-technical-optimization/)
- [GitHub Actions 博客质量流水线]({{ site.baseurl }}/2024/11/18/github-actions-blog-ci-cd/)
- [Jekyll 发布前内容质量自检模板]({{ site.baseurl }}/2025/03/09/jekyll-content-quality-checklist/)
