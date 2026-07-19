---
title: "Git 冲突处理实战手册：从定位到收敛的一套标准流程"
published: 2024-12-03
description: "告别手忙脚乱：处理 merge/rebase 冲突时的步骤、命令与风险控制"
tags: ["Git", "排错", "协作", "DevOps"]
category: "Git"
---

代码冲突不可怕，可怕的是在冲突时临时发挥，把历史改乱、逻辑改坏。
这篇文章给你一个冲突处理 SOP，适合团队协作场景。

## 1. 先判断你在 merge 还是 rebase

命令：

```bash
git status
```

如果提示 `rebase in progress`，处理方式和 merge 不同。

## 2. 冲突处理前的 3 条原则

1. 先保证代码语义正确，再追求历史好看。
2. 冲突阶段不做额外需求改动。
3. 每次解决一小块，及时运行测试。

## 3. Merge 冲突处理流程

```bash
git pull origin main
# 出现冲突后，编辑冲突文件
# 删除 <<<<<<< ======= >>>>>>> 标记

git add <resolved-files>
git commit
```

## 4. Rebase 冲突处理流程

```bash
git fetch origin
git rebase origin/main
# 修复冲突

git add <resolved-files>
git rebase --continue
```

若发现 rebase 路线错误：

```bash
git rebase --abort
```

## 5. 最常见的 5 类冲突

1. 同一行被两边同时修改
2. 文件重命名与内容修改同时发生
3. 删除文件与编辑文件冲突
4. 锁文件（如 `package-lock.json`）频繁冲突
5. 自动格式化工具导致大面积无意义差异

## 6. 实用技巧

- `git diff --name-only --diff-filter=U`：只看冲突文件
- 优先解决核心业务文件，再处理配置或格式文件
- 锁文件冲突尽量通过重新生成解决，不手改复杂段落

## 7. 冲突后回归检查

至少执行：

1. 项目构建
2. 核心测试用例
3. 关键页面手动冒烟测试

这一步不能省，否则“冲突虽解，功能已坏”。

## 8. 团队层面的预防

- 小步提交，减少超大 PR
- 长分支每天同步上游
- 合并前先跑 CI
- 统一 formatter 和 lint 规则

## 总结

冲突处理不是技术难题，而是工程纪律问题。
有流程、有边界、有回归检查，冲突就不会成为团队效率黑洞。

## 延伸阅读

- [Git Rebase vs Merge 工作流](/2024/09/12/git-rebase-vs-merge-pr-workflow/)
- [Git Commit 规范指南](/2024/08/20/git-commit-convention/)
- [Git Fork 同步上游实战](/2023/12/06/git-sync-fork-upstream-guide/)
