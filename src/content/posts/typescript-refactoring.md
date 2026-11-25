---
title: "TypeScript 存量代码重构实战：用类型收窄与边界校验消除隐性 Bug"
published: 2025-01-10
updated: 2026-11-25
description: "一套可直接落地的 TypeScript 存量代码重构 SOP：从开启严格编译基线、信任边界 unknown 收窄、可辨识联合替代标志位，到增量测试验证。"
tags: ["TypeScript", "重构", "代码质量", "类型系统"]
category: "TypeScript"
---

## 复盘背景

旧文只列了“不要用 `any`、多用卫语句”几条入门口号，但在真实项目中接手一个几千行的 TypeScript 仓库时，直接一上来改写业务逻辑大概率会把线上的边缘情况改挂。最近重构博客的构建工具脚本和前端组件状态时，最大的教训是：**用 `as SomeType` 硬强转比写 `any` 更危险——它让编译器彻底闭嘴，却把 `undefined` 运行时崩溃留给了用户。**

这篇重写整理了一套可按步执行的存量重构 SOP：先建类型与测试基线，再在信任边界做校验收窄，最后用可辨识联合消除无效状态。

## 前置条件与输入参数

- **TypeScript**：5.x 以上版本。
- **静态检查与测试**：项目中已配置 `tsc --noEmit`、Linter（Biome / ESLint）以及基础单元测试（如 `node --test` 或 Vitest）。
- **核心原则**：行为重构与格式调整分开提交，每个重构切片必须保持测试通过。

## 操作步骤（SOP）

### 1. 锁定严格编译选项并建立基线

先检查 `tsconfig.json`，确保至少开启 `strict` 与 `noUncheckedIndexedAccess`（数组索引访问返回 `T | undefined`，避免隐式越界）：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true
  }
}
```

把存量报错数量记录下来，作为每次重构收敛的基线：

```bash
pnpm exec tsc --noEmit | wc -l
```

### 2. 在信任边界用 `unknown` + 类型守卫替换 `any` 与 `as`

外部 API 返回、JSON 解析、`localStorage` 读取都属于**不可信输入边界**。不要直接写成 `JSON.parse(raw) as Config`，而是写一个轻量类型守卫，在边界完成校验：

```ts
export interface FeedConfig {
	title: string;
	limit: number;
}

export function isFeedConfig(value: unknown): value is FeedConfig {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const record = value as Record<string, unknown>;
	return (
		typeof record.title === "string" &&
		record.title.trim().length > 0 &&
		typeof record.limit === "number" &&
		Number.isInteger(record.limit) &&
		record.limit > 0
	);
}

export function parseFeedConfig(raw: string): FeedConfig | null {
	try {
		const parsed: unknown = JSON.parse(raw);
		return isFeedConfig(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
```

### 3. 用可辨识联合（Discriminated Union）替换布尔标志位和魔术数字

常见“坏味道”是把加载中、成功、失败全塞进一个大对象：`{ isLoading: boolean; data?: T; error?: string }`，结果经常出现 `isLoading === true` 且 `error !== undefined` 的非法状态。用 `status` 判别字段拆开，并加上 `never` 穷尽检查：

```ts
type RequestState<T> =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; message: string };

function assertNever(value: never): never {
	throw new Error(`Unhandled state: ${JSON.stringify(value)}`);
}

export function renderStatusLabel<T>(state: RequestState<T>): string {
	switch (state.status) {
		case "idle":
			return "等待加载";
		case "loading":
			return "加载中";
		case "success":
			return "已完成";
		case "error":
			return `失败：${state.message}`;
		default:
			return assertNever(state);
	}
}
```

以后只要新增一个状态分支，所有未更新的 `switch` 都会在编译期立刻标红报错。

### 4. 从混杂 I/O 的函数里抽离纯计算核心

不要把“读配置 + 路径拼接 + 字符串解析 + 写文件”全写在一个 150 行的异步函数里。把纯逻辑（例如 URL 规范化、数据过滤、XML 转义）抽成不依赖 DOM 或文件系统的纯函数，测试直接测纯函数即可覆盖 90% 的分支漏洞。

### 5. 小步验证并清除非空断言（`!`）

在清理回调或事件解绑代码时，优先用局部常量收窄替代 `handler!`，既消除 linter 警告，也杜绝隐式空指针：

```ts
const handler = this.boundClickHandler;
if (handler) {
	this.items.forEach((item) => item.removeEventListener("click", handler));
	this.boundClickHandler = null;
}
```

## 真实踩坑复盘与排查记录

1. **现象：重构后编辑器全绿，上线读 `localStorage` 偶发 `Cannot read properties of undefined`**
   - **定位**：旧代码用了 `JSON.parse(str) as UserSettings`，某次配置新增了嵌套字段，老用户浏览器里残留的旧 JSON 缺字段，TypeScript 完全没法察觉。
   - **解决**：统一改为 `unknown` 入口 + 字段级守卫，缺省字段给予安全默认值，不信任任何持久化缓存。

2. **现象：把几组状态写成 `enum` 后打包体积莫名变大且跨文件耦合**
   - **定位**：TypeScript `enum` 会编译出双向映射的运行时对象代码，而静态站与纯类型分发其实只需要字面量联合。
   - **解决**：改用 `const` 映射对象配合 `as const` 与 `keyof typeof MAP`，实现零运行时开销且支持摇树优化（Tree-shaking）。

3. **现象：一次重构顺带格式化了 40 个文件，Code Review 根本看不出改了哪行逻辑**
   - **定位**：业务重构与格式化混在同一个 commit 里，掩盖了边界条件的小修改。
   - **解决**：先单独提交一次纯格式化，再在干净基线上分步提交逻辑重构与对应测试。

## 验收清单

```bash
# 1. 类型检查零报错
pnpm exec tsc --noEmit

# 2. 静态检查无 any / 非空断言新增告警
pnpm exec biome check ./src

# 3. 边界解析与纯函数单测全部通过
node --test tests/*.mjs
```

预期结果：`tsc --noEmit` 退出码 `0`；Linter 0 警告；每个边界守卫函数至少覆盖“正常输入、缺失字段、非法类型、格式损坏 JSON”四类测试样本。

## 延伸阅读

- [技术文档写作实战：把一次排错变成别人能复现的解决方案](/posts/developer-documentation-writing-guide/)
- [告别 git push -f：团队协作中的 Git Commit 规范指南](/posts/git-commit-convention/)
