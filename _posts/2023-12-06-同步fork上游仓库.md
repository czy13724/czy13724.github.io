---
layout: post
title: "Git 实战：三种方法让你的 Fork 仓库与上游保持同步"
subtitle: "从点击按钮到自动化脚本：全方位掌握 Git Upstream 同步技巧"
date: 2023-12-06 22:01:00
author: "Levi"
header-img: "img/bg/image_20.jpg"
catalog: true
tags:
    - Git
    - GitHub
    - 教程
    - 自动化
---

> "We loved with a love that was more than love."

<div class="alert alert-info" role="alert">
  <strong>场景描述：</strong> 当我们在 GitHub 上 Fork 了一个开源项目后，原作者（Upstream）更新了代码，而我们的 Fork 仓库还停留在旧版本。如何将上游的更新合并到我们的仓库中？本文提供三种解决方案：不仅包含最简单的 UI 操作，还有硬核的 CLI 命令，以及“懒人必备”的 GitHub Actions 自动化脚本。
</div>

## 方法一：GitHub 网页端一键同步 (最简单)

从 2021 年开始，GitHub 原生支持了网页端同步功能，适合绝大多数普通用户。

1.  打开你的 Fork 仓库页面。
2.  点击代码列表上方的 **Fetch upstream** 下拉菜单。
3.  点击 **Fetch and merge** 按钮。

![GitHub Sync Button](https://docs.github.com/assets/cb-25535/images/help/repository/fetch-upstream-drop-down.png)

*优点：无需任何命令，操作极简。*
*缺点：需要手动点，且解决冲突能力较弱。*

---

## 方法二：Git 命令行同步 (最专业)

如果你是开发者，建议掌握命令行（CLI）方式，因为这能让你完全控制合并过程，方便处理代码冲突。

### 1. 配置上游仓库
首先，我们需要告诉本地 git，"上游"在哪里。

```bash
# 查看当前远程仓库
git remote -v
# 输出通常只有 origin (你的仓库)

# 添加上游仓库 (请将 URL 替换为原作者的仓库地址)
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git

# 再次查看，应该能看到 upstream
git remote -v
```

### 2. 拉取并合并
```bash
# 1. 切换到主分支 (main 或 master)
git checkout main

# 2. 从上游拉取最新代码到本地缓存
git fetch upstream

# 3. 将上游代码合并到你的本地分支
git merge upstream/main

# 4. 推送到你的 GitHub 仓库
git push origin main
```

*优点：完全控制权，可处理复杂冲突。*
*缺点：步骤较多，需要 Git 基础。*

---

## 方法三：GitHub Actions 定时自动同步 (最省心)

如果你 Fork 仓库是为了做一个镜像（Mirror），或者单纯想保持最新而懒得手动去点，可以使用 GitHub Actions 设置定时任务。

### 1. 创建工作流文件
在你的仓库中，点击 **Actions** -> **New workflow**，创建一个名为 `.github/workflows/sync.yml` 的文件。

如果你 Fork 的仓库里已存在其他工作流，点击 `Actions` 后可能需要先点击 `New workflow`，如下图所示：
![新建工作流]({{site.baseurl}}/img/syncworkflow/createworkflow.png)

### 2. 填入配置代码
复制以下 YAML 内容，并**务必修改第四步中的上游仓库地址**。

```yaml
name: Upstream Sync

permissions:
  contents: write

on:
  schedule:
    - cron: "0 0 * * *" # 每天 UTC 时间 0:00 (北京时间 8:00) 执行一次
  workflow_dispatch: # 允许手动点击按钮触发

jobs:
  sync_latest_from_upstream:
    name: Sync latest commits from upstream repo
    runs-on: ubuntu-latest
    if: ${{ github.event.repository.fork }}

    steps:
      # 第一步：检出代码
      - name: Checkout target repo
        uses: actions/checkout@v3

      # 第二步：执行同步动作
      - name: Sync upstream changes
        id: sync
        uses: aormsby/Fork-Sync-With-Upstream-action@v3.4
        with:
          # ⚠️⚠️ 请修改下方这两行！填入原作者的仓库地址和分支 ⚠️⚠️
          upstream_sync_repo: original-author/original-repo
          upstream_sync_branch: main
          
          # 你的分支名
          target_sync_branch: main
          target_repo_token: ${{ secrets.GITHUB_TOKEN }}
          test_mode: false

      # 第三步：检查是否失败（通常是因为上游改动了 workflow 文件，出于安全 GitHub 会暂停自动更新）
      - name: Sync check
        if: failure()
        run: |
          echo "[Error] 自动同步失败。可能是上游仓库更新了 .github/workflows 文件。"
          echo "请手动前往 GitHub 界面 Fetch Upstream 一次以恢复自动化。"
          exit 1
```

请参考下图说明进行修改：
![修改说明]({{site.baseurl}}/img/syncworkflow/modification.png)

以下是配置完成后的完整代码示例图（注意：部分密钥无需手动填写）：
![全部代码]({{site.baseurl}}/img/syncworkflow/sync.jpg)

### 3. 注意事项
*   **首次运行**：创建完文件后，建议切到 Actions 页面手动触发一次（Run workflow）以验证配置是否正确。
*   **保护机制**：如果上游仓库修改了 workflow 文件，GitHub 为了安全会暂停你的自动任务，此时需要手动 Sync 一次来重新激活。

---

## 总结

*   **偶尔同步**：直接用 **方法一**（网页点一下）。
*   **开发代码**：必须用 **方法二**（命令行），因为你需要处理 Merge 冲突。
*   **纯粹备份**：使用 **方法三**（Actions），设置好后就可以当甩手掌柜了。

## 免责声明

<div class="well">
    <ul>
        <li>本文提供的自动化脚本仅用于合规的开源项目同步。</li>
        <li>请勿用于恶意克隆或违反 GitHub 服务条款的行为。</li>
        <li>自动化同步可能会覆盖你对仓库的自定义修改，请谨慎使用。</li>
    </ul>
</div>
