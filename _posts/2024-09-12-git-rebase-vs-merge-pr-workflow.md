---
layout: post
title: "Git Rebase vs Merge：团队 PR 工作流如何选才不翻车"
subtitle: "从提交历史可读性、冲突处理到回滚策略，给出可落地的协作规范"
date: 2024-09-12 21:00:00
author: "Levi"
header-img: "img/bg/image_29.jpg"
catalog: true
tags:
    - Git
    - 团队协作
    - PR
    - DevOps
---

“到底用 rebase 还是 merge”是每个团队都会争论的话题。
争论本身没意义，关键是你们的目标是什么：历史整洁、排查效率、还是风险最小化？

## 1. 两者本质区别

- `merge`：保留分叉历史，新增 merge commit。
- `rebase`：重写提交基线，让历史线性化。

简单说：

- 你想看见真实开发分支轨迹，用 merge。
- 你想得到干净主线历史，用 rebase。

## 2. 推荐规则（可直接落地）

1. 个人功能分支：允许 rebase，先整理提交再提 PR。
2. 主分支（main/master）：禁止 rebase 历史，只接受受控合并。
3. 公共分支已被他人基于开发后，不要再强推 rebase。

## 3. 常见流程模板

### 场景 A：保持主分支线性

```bash
git checkout feature/login
git fetch origin
git rebase origin/main
# 解决冲突后
# git rebase --continue

git push --force-with-lease
```

然后在 GitHub 用 `Squash and merge`。

### 场景 B：保留分支语义

如果团队重视“功能分支完整上下文”，可使用 merge commit：

```bash
git checkout main
git pull origin main
git merge --no-ff feature/login
git push origin main
```

## 4. 冲突处理与风险控制

最容易翻车的是“边 rebase 边改业务逻辑”。
建议：

- rebase 冲突阶段只做必要冲突消解
- 逻辑改动另起提交
- 大分支每天小步同步上游，减少一次性冲突量

## 5. 回滚策略

- merge 模式下可直接回滚 merge commit
- squash 模式下回滚更简单，但会丢失中间提交语义

所以你要在“历史简洁”和“历史细节”之间做取舍。

## 6. 一个实用团队约定

- PR 合并前：必须通过 CI
- PR 合并前：提交历史自检（去掉 `fix typo` 等噪音提交）
- 发布前：为高风险改动打 tag

## 总结

rebase 和 merge 没有绝对优劣，只有是否契合团队协作模型。
把规则写进团队文档并执行一致，比任何“偏好争论”都更重要。

## 延伸阅读

- [Git Commit 规范指南]({{ site.baseurl }}/2024/08/20/git-commit-convention/)
- [Git 冲突处理实战手册]({{ site.baseurl }}/2024/12/03/git-conflict-resolution-playbook/)
- [Git Fork 同步上游实战]({{ site.baseurl }}/2023/12/06/git-sync-fork-upstream-guide/)
