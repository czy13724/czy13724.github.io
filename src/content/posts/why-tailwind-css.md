---
title: "Tailwind CSS v4 工程化实战：从 CSS-First 配置到设计令牌落地"
published: 2025-08-05
updated: 2026-11-25
description: "复盘 Tailwind CSS v4 的 CSS-First 架构改造：@tailwindcss/vite 接入、@theme 设计令牌、暗黑模式变体及组件作用域 @reference 避坑。"
tags: ["CSS", "Tailwind CSS", "前端工程化", "Web"]
category: "CSS"
---

## 复盘背景

旧版文章还停留在“原子化 CSS 为什么火”的泛泛科普，甚至留着不严谨的版本假设。过去一年把博客主题和多个前端工具站从 Tailwind v3 迁移到正式的 **Tailwind CSS v4** 后，整个工具链其实发生了根本变化：不再需要维护笨重的 `tailwind.config.js` 和 `postcss.config.js`，构建引擎转向 Rust/Oxide，配置模式也从 JS 对象变成了原生的 **CSS-First**。

但 v4 迁移过程中如果不理解它的级联层（Cascade Layers）和组件样式隔离规则，很容易被 `@apply` 报错或类名被 Tree-shake 坑到。这篇重写把核心迁移与工程落地的 SOP 固定下来。

## 前置条件与输入参数

- **Node.js**：20 LTS 或更高版本，包管理器使用 `pnpm` 9+。
- **构建器**：Vite 6+（或 Astro 5+ / Next.js 15+）。
- **核心依赖**：`tailwindcss`（`^4.x`）与 `@tailwindcss/vite`（`^4.x`）。

## 操作步骤（SOP）

### 1. 安装并接入 Vite 插件

卸载 v3 时代的 `autoprefixer` 和旧 PostCSS 配置，直接安装 v4：

```bash
pnpm add tailwindcss @tailwindcss/vite
```

在 `vite.config.ts`（或 `astro.config.mjs` 的 `vite.plugins`）中注册插件：

```ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
});
```

### 2. 用 CSS-First 方式定义主题与设计令牌

创建 `src/styles/main.css`，用 `@import "tailwindcss";` 替代过去的 `@tailwind base/components/utilities;` 三条指令，并用 `@theme` 和 `@custom-variant` 声明设计令牌与暗黑模式选择器：

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
	--font-sans: "Inter", "PingFang SC", system-ui, sans-serif;
	--font-mono: "JetBrains Mono", ui-monospace, monospace;
	--radius-card: 0.75rem;
}

:root {
	--hue: 240;
	--primary: oklch(0.65 0.16 var(--hue));
	--card-bg: oklch(1 0 0);
	--page-bg: oklch(0.96 0.01 var(--hue));
}

:root.dark {
	--primary: oklch(0.75 0.14 var(--hue));
	--card-bg: oklch(0.22 0.01 var(--hue));
	--page-bg: oklch(0.16 0.01 var(--hue));
}
```

这里把色相抽成 `--hue`，让主色与卡片底色通过 OKLCH 运行时动态计算，比在 JS 配置里枚举色阶简洁得多。

### 3. 在组件作用域样式中正确引用令牌与 `@apply`

在 Astro、Svelte 或 Vue 的 `<style>` 块中直接使用 `@apply` 或 `@variant` 时，v4 会默认把它当成独立 CSS 文件处理，导致找不到主题变量。必须在作用域样式顶部显式加入 `@reference`：

```css
<style>
	@reference "../styles/main.css";
	@custom-variant dark (&:where(.dark, .dark *));

	.nav-pill {
		@apply px-3 py-1.5 rounded-lg text-sm font-medium transition-colors;
		background-color: var(--card-bg);
	}
</style>
```

### 4. 用静态映射替代动态字符串拼接类名

Tailwind 扫描源码采用静态词法提取，禁止拼写诸如 `text-${color}-500` 的字符串。统一收敛到完整类名字典：

```ts
const BADGE_CLASS_MAP = {
	info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
	warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	error: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

export function getBadgeClass(level: keyof typeof BADGE_CLASS_MAP): string {
	return BADGE_CLASS_MAP[level];
}
```

## 真实踩坑复盘与排查记录

1. **现象：迁移后 Svelte/Astro 组件报错 `Cannot apply unknown utility class`**
   - **定位**：组件 `<style>` 是单独编译的，未引入全局样式上下文，导致 `@apply` 解析不到 `main.css` 里的主题定义。
   - **解决**：在用到 `@apply` 的局部样式顶部添加 `@reference "../styles/main.css";`（只引入类型与主题引用，不会重复打包一次全量 CSS）。

2. **现象：本地 `dev` 样式正常，生产 `build` 后部分按钮颜色丢失**
   - **定位**：代码里写了 `bg-(--status-color)` 之外的动态拼接类名，开发期热缓存恰好保留过旧类，全量静态扫描时未命中。
   - **解决**：改用完整静态字面量映射表，或者用内联 CSS 变量 `style={`--badge-color: ${hex}`}` 配合 `bg-(--badge-color)`。

3. **现象：自定义全局 Reset 覆盖了 `p-4`、`m-2` 等工具类**
   - **定位**：v4 把工具类放在 `@layer utilities` 中，如果在入口 CSS 顶层直接写无层级的 `* { margin: 0; padding: 0; }`，按 CSS Cascade Layers 规范，**未分层的样式优先级高于任何 `@layer`**。
   - **解决**：所有基础重置规则必须包裹进 `@layer base { ... }`。

## 验收清单

```bash
# 1. 执行生产构建并检查 CSS 产物体积与是否存在未解析指令
pnpm run build
ls -lh dist/_astro/*.css

# 2. 确认产物中不包含未编译的 @apply 或 @reference 残留
grep -rnE "@apply|@reference|@theme" dist/_astro/*.css || echo "OK: no raw tailwind directives in bundle"
```

预期结果：构建 0 报错，最终 CSS 产物体积稳定在几十 KB 内，且 `dist/_astro/*.css` 中不存在未编译的 `@apply`、`@reference` 或 `@theme` 原始指令；切换 `.dark` 类名后页面色彩与边框即时响应。

## 延伸阅读

- [Next.js App Router 实战指南：服务端组件、缓存语义与数据边界设计](/posts/nextjs-app-router/)
- [WebP vs AVIF 实战指南：如何在真实项目里做图片格式选型](/posts/webp-vs-avif/)
