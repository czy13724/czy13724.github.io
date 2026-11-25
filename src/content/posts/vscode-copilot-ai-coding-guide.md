---
title: "VS Code + GitHub Copilot 工程化工作流：自定义指令、上下文管理与代码审查"
published: 2024-05-15
updated: 2026-11-25
description: "告别把 Copilot 当聊天玩具：配置仓库级 copilot-instructions.md、上下文引用边界与提交前类型/Diff 门禁的实操手册。"
tags: ["VS Code", "AI 编程", "GitHub Copilot", "工作流"]
category: "VS Code"
---

## 复盘背景

旧文只写了“按 Tab 补全、右键 Explain This”，在实际工程项目里这样用 Copilot 很快就会碰壁：打开了太多无关标签页导致生成代码风格飘忽不定，或者 AI 顺手写出过时的 API（比如按老版本路由写法生成新框架代码），Review 时反而更花时间。

把过去一年在 TypeScript、Astro 和脚本项目里磨合出来的 **VS Code + Copilot 工程化配置**整理成 SOP，核心思路是：**用仓库级规则文件约束 AI 的输出口径，用精准上下文切片控制作用域，用本地静态检查接管最终验收**。

## 前置条件与输入参数

- **编辑器**：VS Code 最新稳定版，已安装并登录 `GitHub Copilot` 与 `GitHub Copilot Chat` 扩展。
- **工程仓**：包含明确技术栈声明（如 `package.json`、`tsconfig.json`）和测试脚本的 Git 仓库。

## 操作步骤（SOP）

### 1. 在仓库中写入 `.github/copilot-instructions.md`

Copilot Chat 和代码生成会自动读取仓库根目录下的 `.github/copilot-instructions.md`，把高频团队规范写死在这里，就不用每次提示词里重复啰嗦：

```markdown
# Repository Instructions

- Language & Stack: TypeScript (strict), Astro static build, Svelte 5 runes, Tailwind CSS v4.
- Package Manager: Always use `pnpm` (never suggest `npm` or `yarn`).
- Validation: Every code change must pass `pnpm run type-check`, `pnpm exec biome check ./src`, and `pnpm run build`.
- Safety & Quality:
  - Validate external inputs as `unknown` at trust boundaries; avoid `any` and non-null assertions (`!`).
  - Reuse existing helpers in `src/utils/` before adding new utilities.
  - Never hardcode production domains or secrets in source files.
```

### 2. 配置 `.vscode/settings.json` 控制补全与文件忽略范围

屏蔽构建产物与敏感配置文件，避免无效上下文干扰建议质量，同时保留本地格式化一致性：

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "dotenv": false
  },
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "editor.formatOnSave": false,
  "files.exclude": {
    "**/dist": true,
    "**/.astro": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/pnpm-lock.yaml": true
  }
}
```

关闭 `.env`（`dotenv: false`）的补全建议是基本安全习惯，防止意外把本地测试 Key 顺手拼进提示上下文。

### 3. 使用精准上下文变量而非“打开一堆 Tab”

在 Copilot Chat 或 Inline Chat（`Cmd + I` / `Ctrl + I`）里，显式指定引用范围比依赖开放标签页靠谱得多：

- **定位类型问题**：`#file:src/utils/url-utils.ts` + `#file:src/layouts/Layout.astro`，明确要求“只修改调用边界，保持其余导出签名不变”。
- **先写失败测试再补实现**：选中目标函数接口定义 `#selection`，提示词模板：

```text
基于 #file:src/utils/url-utils.ts 的 isAdDisallowedPath 函数签名，
在 #file:tests/url-utils.test.mjs 中补充边界测试用例（根路径、子路径、前缀相似但非同路径、含404路径），
使用 Node 内置 node:test 与 node:assert/strict，不要引入第三方测试库。
```

- **终端报错秒级定位**：命令报错后直接选中终端错误堆栈，在 Chat 中使用 `#terminalSelection` 结合具体文件提问，避免手动复制贴漏上下文。

### 4. 建立“Diff 审查 + 自动化门禁”提交前卡点

把 AI 当成能快速出初稿的初级搭档，合入前必须过三关：

```bash
# 1. 先看 AI 到底改了哪些文件与行（重点看是否夹带了未要求的重构）
git diff --stat && git diff

# 2. 跑通类型、Lint、单测与生产构建
pnpm run type-check && pnpm exec biome check ./src && node --test tests/*.mjs && pnpm run build
```

## 真实踩坑复盘与排查记录

1. **现象：AI 顺手生成了看起来很完整的代码，但一运行报错 `X is not a function`**
   - **定位**：项目使用的是较新大版本依赖（如 Tailwind v4 / Svelte 5 Runes / Astro 7），模型默认记忆停留在旧版 API（如 Svelte 4 `export let` 或 Next.js 14 默认缓存行为）。
   - **解决**：在 `.github/copilot-instructions.md` 第一行就锁死精确的主版本号与禁止使用的旧语法，并用 `#file:package.json` 锚定当前依赖版本。

2. **现象：让 Copilot 修一个小 Bug，它把整个文件 200 行顺手重写并删掉了原有注释**
   - **定位**：提示词没有约束变更范围，且在全文件 Chat 模式下接受了整文件覆盖。
   - **解决**：小改动优先用行内 `Cmd + I`（仅作用于选区），提交前必跑 `git diff` 核对是否误删无关注释或错误处理逻辑。

3. **现象：为了省事让 Copilot 生成校验函数，结果它在 `catch` 块里悄悄写了 `return true` 或静默吞异常**
   - **定位**：AI 倾向于给出“不报错能跑通”的乐观实现，容易削弱边界防御。
   - **解决**：Review 时重点盯 `catch`、`if (!...)` 和正则放行条件，凡涉及安全边界与权限判断的分支必须手写或核对反向失败测试。

## 验收清单

```bash
# 1. 确认指令文件与 VS Code 配置已受版本控制且无敏感变量
test -f .github/copilot-instructions.md && test -f .vscode/settings.json && echo "OK: workspace AI config present"

# 2. 确认暂存区 diff 中无硬编码密钥、无多余依赖、且门禁全绿
git diff --cached --stat
pnpm run type-check && pnpm exec biome check ./src
```

预期结果：VS Code Copilot Chat 回复时能主动遵循 `pnpm` 与项目约定；`git diff` 范围收敛在目标文件内；所有静态检查与测试退出码均为 `0`。

## 延伸阅读

- [TypeScript 存量代码重构实战：用类型收窄与边界校验消除隐性 Bug](/posts/typescript-refactoring/)
- [告别 git push -f：团队协作中的 Git Commit 规范指南](/posts/git-commit-convention/)
