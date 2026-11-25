---
title: "Astro 静态站上线前自动化验收与 CI 流水线：拦截死链、构建回归与合规漏洞"
published: 2026-11-23
description: "构建完整的 Astro 静态站上线前质量门禁：整合 TypeScript、Biome、Pagefind 以及针对 dist/ 产物的死链、XML、无刷新隔离断言脚本。"
tags: ["Astro", "CI/CD", "自动化验收", "静态网站"]
category: "Astro"
---

## 复盘背景

写完文章、本地 `pnpm dev` 能打开页面，远远不等于站点可以放心上线。我们在一次全站合规审计中发现好几个“开发模式看不出、上线后立刻暴雷”的问题：

- 从旧博客迁过来的 14 篇文章里藏着 43 个旧日期格式的站内死链，Astro 静态构建并不会对 Markdown 正文里的绝对路径报错；
- 某个已经关闭的示例功能页（如相册子路由）依然会在 `dist/` 下产出带 `<meta refresh>` 的空壳 HTML；
- 启用了 Swup 无刷新过渡后，用户从首页点进 `/privacy/` 或 `/404` 时，`<head>` 里已经加载的第三方广告脚本并不会自动销毁；
- Atom Feed 自己拼字符串时忘了转义 `&`，导致某些标题直接让 XML 解析失败。

把这些教训全部固化成一条**单命令本地验证 + CI 自动化质量门禁**，在合并发布前直接把缺陷拦截在 `dist/` 阶段。

## 前置条件与输入参数

- **工程环境**：Node.js 20+、`pnpm` 9+、Python 3.10+（用于构建产物断言脚本）。
- **项目工具链**：`tsc`（类型检查）、`@biomejs/biome`（Lint/格式检查）、`astro build`、`pagefind`。

## 操作步骤（SOP）

### 1. 跑通静态类型、规范检查与单元测试

在进入构建前，先把代码层的低级错误清理干净：

```bash
pnpm run type-check && pnpm exec biome check ./src && node --test tests/*.mjs
```

### 2. 执行全量静态构建与 Pagefind 索引

```bash
pnpm run build
```

确认输出包含完整的静态路由构建与 `pagefind` 索引统计（总索引页面数与词条数，避免误把纯跳转占位页灌入搜索索引）。

### 3. 编写 `dist/` 产物回归断言脚本（`scripts/verify-dist.py`）

构建成功只代表编译没挂，还需要对 `dist/` 产物做结构和合规断言：

```python
#!/usr/bin/env python3
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

DIST = Path("dist")
DISALLOWED_AD_PAGES = [
    "404.html",
    "privacy/index.html",
    "devices/index.html",
    "archive/index.html",
    "friends/index.html",
    "rss/index.html",
    "atom/index.html",
]

def main() -> int:
    # 1. 校验 404 页面存在且带有 noindex
    page_404 = (DIST / "404.html").read_text(encoding="utf-8")
    assert "noindex, nofollow" in page_404, "404.html 缺少 noindex, nofollow"

    # 2. 校验非文章/纯导航页不加载广告脚本
    for rel in DISALLOWED_AD_PAGES:
        target = DIST / rel
        assert target.exists(), f"缺少关键页面: {rel}"
        html = target.read_text(encoding="utf-8")
        assert "adsbygoogle.js" not in html, f"广告脚本泄漏到了禁用页面: {rel}"

    # 3. 校验首页具备规范链接（根相对）及语义化地标
    index_html = (DIST / "index.html").read_text(encoding="utf-8")
    for required in ['<link rel="canonical" href="/">', '<header id="navbar"', '<nav id="navbar-links-container"', "<footer", "<aside"]:
        assert required in index_html, f"首页缺少必要结构: {required}"

    # 4. 扫描所有文章页是否存在旧版 /YYYY/MM/DD/ 死链与未闭合代码块残留
    for html_file in (DIST / "posts").rglob("*.html"):
        text = html_file.read_text(encoding="utf-8", errors="ignore")
        assert not re.search(r'href="/202[0-9]/\d{2}/\d{2}/', text), f"发现旧日期格式死链: {html_file}"

    # 5. 校验 XML Feed 语法合法性
    for feed in ["rss.xml", "atom.xml"]:
        ET.parse(DIST / feed)

    # 6. 校验 sitemap 不包含 404
    for sm in DIST.glob("sitemap*.xml"):
        sm_text = sm.read_text(encoding="utf-8")
        assert "/404" not in sm_text, f"Sitemap 误收录了 404: {sm}"

    print("ALL DIST VERIFICATION CHECKS PASSED.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### 4. 在 `package.json` 与 GitHub Actions 中串联执行

在 `package.json` 中增加统一验收命令：

```json
{
  "scripts": {
    "verify": "pnpm run type-check && pnpm exec biome check ./src && node --test tests/*.mjs && pnpm run build && python3 scripts/verify-dist.py"
  }
}
```

并在 CI 工作流中直接运行 `pnpm run verify`，任何一项断言失败立即阻断合并和部署。

## 真实踩坑复盘与排查记录

1. **现象：Swup 切换进入隐私页时，`<head>` 里注入的第三方广告脚本还在工作**
   - **定位**：Swup 的默认行为只替换 `<main>` 容器，不会卸载第一次加载文章页时已经执行过的 `<head>` 脚本。
   - **解决**：抽离统一的禁用路径判断函数 `isAdDisallowedPath()`，并在导航菜单、移动端抽屉、分类条和页脚中指向禁用页的 `<a>` 标签上自动追加 `data-no-swup` 属性，强制浏览器发起完整页面切换以清空上下文。

2. **现象：页脚的 RSS/Atom 链接在特定页面点击毫无反应**
   - **定位**：模板中写了 `onclick="event.preventDefault(); navigateToPage(...)"`，但 `navigateToPage` 是模块化函数，并没有挂载到全局 `window` 上，点击即报错。
   - **解决**：删除内联 `onclick`，直接使用标准 `href` 配合 `data-no-swup`，并在 `verify-dist.py` 中禁止构建产物出现 `navigateToPage(` 内联调用。

3. **现象：本地用 Markdown 写的跨文章链接在 `astro build` 时全部悄悄通过**
   - **定位**：Astro 不会把 Markdown 正文中的 `/2024/08/20/xxx/` 字符串当成模块导入，即使目标路由 404 也不会触发构建失败。
   - **解决**：在验收脚本中增加站内链接存在性正则扫描，要求所有 `/posts/<slug>/` 必须能在 `dist/posts/<slug>/index.html` 中找到实体文件。

## 验收清单

```bash
pnpm run verify
```

预期结果：命令以退出码 `0` 结束，终端打印 `ALL DIST VERIFICATION CHECKS PASSED.`；故意在一个测试文章中写入失效 `/posts/non-existent/` 链接或把广告脚本放入 `/privacy/` 时，脚本能够立刻报错并定位到具体文件。

## 延伸阅读

- [Astro 本地预览验收清单：发布前用 15 分钟发现导航、资源与交互问题](/posts/astro-local-preview-regression-checklist/)
- [Astro 静态站图片 404 排查：从引用路径到浏览器回归的完整流程](/posts/astro-static-assets-404-debugging/)
- [GitHub Actions 静态博客 CI/CD 实战：从提交校验到自动发布](/posts/github-actions-blog-ci-cd/)
