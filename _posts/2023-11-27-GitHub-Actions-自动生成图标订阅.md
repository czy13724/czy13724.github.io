---
layout: post
title: "GitHub Actions 实战：自动生成 Quantumult X / Loon 图标订阅 (JSON)"
subtitle: "告别手动编辑：基于 Python 的全自动图标仓库构建指南"
date: 2023-11-27 17:28:00 +0800
author: "Levi"
header-img: "img/bg/image_19.jpg"
catalog: true
tags:
    - GitHub Actions
    - 自动化
    - 教程
    - Python
---

> "If you care about me at all, please don't say anything to anyone."

<div class="alert alert-info" role="alert">
  <strong>教程简介：</strong> 本文将教你如何利用 GitHub Actions 搭建一个全自动化的图标仓库。你只需要将图标文件上传到仓库，GitHub 就会自动运行 Python 脚本，生成符合 Quantumult X、Loon、Surge 等软件要求的 JSON 订阅文件。
</div>

## 为什么需要这个？

许多网络调试工具（如 Quantumult X）支持导入外部图标订阅。标准格式通常是一个包含图标名称和 URL 的 JSON 文件。
手动维护这个 JSON 文件非常繁琐：每次上传新图标，都要手动复制 URL、粘贴、修改 JSON 格式，还容易因为少写一个逗号导致解析失败。

通过本教程，我们可以实现 **"传图即用"** 的丝滑体验。

---

## 核心原理

我们将构建一个 GitHub Actions 工作流 (Workflow)，它包含以下步骤：
1.  **监听**：当仓库中有新图片上传时自动触发。
2.  **执行**：运行一个 Python 脚本，扫描特定目录下的所有图片。
3.  **生成**：自动拼接图片的 `raw.githubusercontent.com` 直链，生成标准的 JSON 文件。
4.  **推送**：将生成的 JSON 文件自动提交回仓库。

---

## 详细操作步骤

### 第一步：准备 GitHub 仓库

1.  新建一个公开 (Public) 仓库，例如命名为 `Icon-Repo`。
2.  在仓库中新建一个文件夹（例如命名为 `icons`），用于存放你的 PNG 图标。
3.  上传测试图片：随便找一张 `.png` 图片放入 `icons` 文件夹。

### 第二步：创建 Python 脚本

在仓库根目录下创建目录 `.github/scripts/`，并在其中新建文件 `generate_json.py`。
复制以下代码，**不需要修改任何内容**（脚本会自动识别仓库信息）：

```python
import os
import json

def generate_json():
    # 配置区
    ICON_FOLDER = 'icons'  # 你的图标文件夹名称
    OUTPUT_FILE = 'icons.json' # 生成的订阅文件名
    REPO_NAME = os.environ.get('GITHUB_REPOSITORY') # 自动获取 "用户名/仓库名"
    BRANCH = 'main' # 分支名称

    # 基础数据结构
    json_data = {
        "name": "Levi 自用图标订阅",
        "description": "基于 GitHub Actions 自动生成",
        "icons": []
    }

    # 遍历文件夹
    if not os.path.exists(ICON_FOLDER):
        print(f"Error: Folder {ICON_FOLDER} not found!")
        return

    for filename in os.listdir(ICON_FOLDER):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.ico')):
            # 构建直链
            # 格式: https://raw.githubusercontent.com/用户名/仓库名/分支/路径
            raw_url = f"https://raw.githubusercontent.com/{REPO_NAME}/{BRANCH}/{ICON_FOLDER}/{filename}"
            
            icon_entry = {
                "name": filename,
                "url": raw_url
            }
            json_data["icons"].append(icon_entry)

    # 写入文件
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Generated {len(json_data['icons'])} icons to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_json()
```

### 第三步：配置 GitHub Actions 工作流

在仓库根目录下创建目录 `.github/workflows/`，并在其中新建文件 `auto_build.yml`。
复制以下代码：

```yaml
name: Auto Build Icon JSON

on:
  push:
    paths:
      - 'icons/**' # 监听 icons 文件夹的变化
  workflow_dispatch: # 允许手动点击按钮触发

permissions:
  contents: write # 赋予写权限，以便回传 json 文件

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Run Generator Script
        run: |
          python .github/scripts/generate_json.py

      - name: Commit and Push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add icons.json
          # 如果文件没有变化，commit 会失败，所以加个判断
          git commit -m "Auto-update icon subscription" || echo "No changes to commit"
          git push
```

最后两处由于格式限制，path和GITHUB_TOKEN的内容只显示了$，需要在$之后分别手动添加图示内容：
![图示]({{site.baseurl}}/img/Pack_raw_to_jsonfile/Pack_raw_to_jsonfile(1).jpg)

---

## 如何使用

1.  **上传图标**：直接将你收集的图标上传到仓库的 `icons` 文件夹。
2.  **自动构建**：GitHub Actions 会在几秒钟内自动运行。
3.  **获取链接**：等待运行完成后，仓库根目录会出现一个 `icons.json` 文件。
    *   **订阅地址**：`https://raw.githubusercontent.com/你的用户名/Icon-Repo/main/icons.json`

将这个链接填入 Quantumult X 或 Loon 的图标引用处即可！

---

## 常见问题 (FAQ)

**Q: 为什么生成的 JSON 为空？**
A: 请检查你的图标是否放在 `icons` 文件夹内，且格式是否为 png/jpg。

**Q: 工作流报错 "Permission denied"？**
A: 请确保你在 `.yml` 文件中配置了 `permissions: contents: write`，或者在仓库设置 (Settings -> Actions -> General) 中勾选了 "Read and write permissions"。

**Q: 支持子文件夹吗？**
A:目前的脚本仅支持单层目录遍历。如果你需要递归扫描，需要修改 Python 脚本中的 `os.listdir` 为 `os.walk`。

---

## 免责声明

<div class="well">
    <ul>
        <li>本教程提供的脚本仅用于技术交流与学习构建自动化工作流。</li>
        <li>请勿上传包含版权纠纷或违反 GitHub 内容政策的图片。</li>
        <li>作者不对因使用本脚本导致的任何数据丢失负责。</li>
    </ul>
</div>
