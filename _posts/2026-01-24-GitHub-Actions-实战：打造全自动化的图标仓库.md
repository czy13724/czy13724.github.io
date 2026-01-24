---
layout: post
title: "GitHub Actions 实战：打造全自动化的 Quantumult X / Surge / Loon / Stash / Shadowrocket 图标仓库"
subtitle: "一套方案，全平台通用：配合 iOS 快捷指令实现无感云端同步"
date: 2026-01-24 18:00:00
author: "Levi"
header-img: "img/bg/image_30.jpg"
catalog: true
tags:
    - GitHub Actions
    - Python
    - iOS
    - 自动化
    - 教程
---

> "Technology is best when it brings people together."
> "科技不仅是冷冰冰的代码，更是便利生活的工具。"

手动维护 **Quantumult X / Loon / Surge / Stash / Shadowrocket** 的图标订阅（JSON 文件）是一件非常繁琐的事情：每加一个图标，都要上传图片 -> 复制直链 -> 修改 JSON 格式。

今天，我将开源我一直在用的 **LeviIcons** 自动化方案。这套工作流实现了：**你在手机上用快捷指令上传一张图片，GitHub 就会自动把它处理好并生成订阅链接，全程无需打开电脑。**

## 🚀 原理架构

这套系统由三个核心部分组成：

1.  **输入端 (iOS)**：通过「快捷指令」将图片转为 Base64 并调用 GitHub API 上传。
2.  **触发器 (GitHub Actions)**：监听仓库变动，一旦有新图片上传自动运行。
3.  **处理器 (Python Script)**：扫描文件夹，自动生成符合 **Quantumult X / Surge / Loon / Stash / Shadowrocket** 标准的 `icons.json` 订阅文件。

**效果演示：**
当你成功上传一张图片后，GitHub Actions 会自动接管，整个过程如下所示：

![自动化运行成功记录]({{site.baseurl}}/img/icons_automation/workflow_run_success_log.png)

---

## 第一步：仓库准备

首先，你需要建立一个结构清晰的 GitHub 仓库。

1.  新建仓库（例如 `My-Icons`）。
2.  在根目录创建一个专门存放图片的文件夹，例如命名为 `leviicons`。
3.  同时你需要确信你的仓库结构如下所示：

![仓库结构概览]({{site.baseurl}}/img/icons_automation/cropped_repo_root.png)

---

## 第二步：部署自动化核心 (Actions)

这是整个系统的“大脑”。我们需要配置一个工作流，告诉 GitHub：“只要 `leviicons` 文件夹里有动静，就干活！”

请在你的仓库中创建 `.github/workflows/generate-icon-json.yml` 文件。

👉 **[点击这里查看并复制 generate-icon-json.yml 源代码](https://github.com/czy13724/LeviIcons/blob/main/.github/workflows/generate-icon-json.yml)**

**配置要点解析**：
*   注意 `paths:` 部分，必须修改为你实际存放图标的文件夹名称。
*   这个配置确保了只有当你上传图片时才会触发构建，避免资源浪费。

---

## 第三步：注入灵魂脚本 (Python)

GitHub Actions 只是搬运工，真正的逻辑处理由 Python 完成。它负责扫描文件名并拼接成 JSON 格式。

请在你的仓库中创建 `.github/scripts/generate_image_json.py` 文件。

👉 **[点击这里查看并复制 generate_image_json.py 源代码](https://github.com/czy13724/LeviIcons/blob/main/.github/scripts/generate_image_json.py)**

**注意事项**：
*   脚本中的 `image_folder` 变量需要与你的图片文件夹名称保持一致。
*   `output_filename` 是生成的 JSON 文件名，如果你修改了它，记得同步修改 yaml 配置文件里的 Git Add 部分。

---

## 第四步：移动端一键上传 (iOS Shortcut)

这是最酷的一步。我们不需要 Git 客户端，直接用 iOS 快捷指令的“获取文件内容”和“调用 URL”功能。

**快捷指令逻辑**：
1.  **输入**：从相册选图 -> 调整大小（建议 108x108、144x144）。
2.  **处理**：将图片转换名为 Base64 编码。
3.  **上传**：通过 GitHub API PUT 接口直接上传到仓库。

你需要准备一个拥有 **Repo** 权限的 GitHub Personal Access Token (PAT)，填入快捷指令的请求头中。

---

## 结语

配置完成后，你的图标管理将变得无比轻松。无论是为了美化自己的代理软件，还是为了分享给社区，这套自动化方案都能让你事半功倍。

Enjoy! 🎈
