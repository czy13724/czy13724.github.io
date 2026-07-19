---
title: "告别 git push -f：团队协作中的 Git Commit 规范指南"
published: 2024-08-20
description: "如何写出优雅的 Commit Message？Conventional Commits 最佳实践"
tags: ["Git", "团队协作", "规范", "DevOps"]
category: "Git"
---

在团队代码 Review 时，最让人头大的不是代码逻辑，而是看到满屏的 Commit 记录写着：
*   `update`
*   `fix bug`
*   `temp 123`

这种“天书”让回溯历史变成了侦探游戏。今天我们来聊聊如何引入 **Conventional Commits (约定式提交)**，让你的 Git 历史像说明书一样清晰。

## 1. 为什么需要规范？

1.  **自动化生成 Changelog**：如果格式规范，脚本可以自动抓取 `feat` 开头的提交生成版本更新日志。
2.  **快速定位问题**：看到 `fix(user-auth)` 就能瞬间知道修的是用户登录模块的 Bug。
3.  **触发 CI/CD**：某些类型的提交（如 `docs`）可以配置为跳过耗时的构建流程。

## 2. 标准格式

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### 结构图解

```text
  Header:  feat(auth): add google login support
           │    │      │
           │    │      └─ Subject (简短描述)
           │    └─ Scope (影响范围，可选)
           └─ Type (类型：功能/修复/文档等)

    Body:  (空一行)
           Specifically, used the OAuth2.0 SDK.
           Added a new callback route.

  Footer:  (空一行)
           Closes #123 (关联 Issue)
```

### 2.1 常用的 Type
*   `feat`: 新功能 (Feature)
*   `fix`: 修补 Bug
*   `docs`: 文档修改
*   `style`: 格式调整（不影响代码运行，如空格、分号）
*   `refactor`: 重构（即不是新功能，也不是修 Bug）
*   `perf`: 性能优化
*   `test`: 增加测试
*   `chore`: 构建过程或辅助工具变动

### 2.2 范例
> `feat(login): add google oauth login support`
>
> `fix(nav): fix navbar overlap on mobile screen`

## 3. 工具辅助：Commitizen

不想每次手动记这些规则？用工具强制约束。

安装 commitizen：
```bash
npm install -g commitizen
```

初始化适配器：
```bash
commitizen init cz-conventional-changelog --save-dev --save-exact
```

以后提交代码时，不要用 `git commit`，而是用：
```bash
git cz
```
它会弹出一个交互式界面，引导你选择类型、填写描述。

## 4. 强制校验：Husky + Commitlint

为了防止团队成员“偷懒”绕过规范，可以在 Commit 钩子 (Hook) 中做拦截。

1.  安装 Husky 和 Commitlint。
2.  配置 `commit-msg` 钩子。

当有人试图提交 `git commit -m "update"` 这种不规范信息时，Git 会直接报错拒绝提交。

## 常见报错与解决

1.  **Husky 不生效？**
    *   确保你执行过 `npm install` 并且脚本中触发了 `husky install`。
    *   在 CI 环境中，可能需要显式执行 `npm run prepare`。

2.  **Windows 下的乱码或换行符问题**
    *   在 Windows 上使用 `git cz` 可能会遇到 emoji 显示乱码。建议使用 Windows Terminal 或 Git Bash，并设置 UTF-8 编码。

3.  **想从规范中“逃逸”**
    *   如果你真的急着修一个线上 Bug，不想填那些复杂的表单，可以使用 `--no-verify` 参数跳过检查：
        ```bash
        git commit -m "hotfix" --no-verify
        ```
    *   *注：慎用！*

## 5. 总结

Git 记录是一个项目的历史档案。编写规范的 Commit Message，是对队友的尊重，也是对自己职业素养的体现。
