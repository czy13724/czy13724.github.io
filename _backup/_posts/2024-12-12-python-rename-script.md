---
layout: post
title: "Python 自动化办公：5分钟写一个批量重命名脚本"
subtitle: "告别枯燥的手工劳动，用几十行代码拯救你的下班时间"
date: 2024-12-12 16:00:00
author: "Levi"
header-img: "img/bg/image_41.jpg"
catalog: true
tags:
    - Python
    - 自动化
    - 脚本
    - 教程
---

你是否遇到过这种情况：
老板发给你 500 张活动照片，文件名全是 `IMG_20260131_123456.jpg` 这种乱码，要求你全部改成 `活动现场_001.jpg`, `活动现场_002.jpg`...？

手动改？那你要改到明年。用 Python，只需要喝口水的功夫。

## 1. 准备工作

确保电脑已安装 Python。我们只需要用到内置的 `os` 库，无需安装任何第三方包。

## 2. 核心代码

新建一个文件 `rename.py`：

```python
import os

def batch_rename(path, prefix):
    # 1. 确保路径存在
    if not os.path.exists(path):
        print(f"路径 {path} 不存在！")
        return

    # 2. 获取该目录下所有文件
    files = os.listdir(path)
    # 按原始文件名排序，防止乱序
    files.sort()

    count = 0
    for filename in files:
        # 跳过隐藏文件（如 .DS_Store）和脚本自己
        if filename.startswith('.') or filename == 'rename.py':
            continue
            
        # 3. 构造新文件名
        # 获取文件扩展名 (如 .jpg)
        ext = os.path.splitext(filename)[1]
        
        # 格式化数字，例如 001, 002
        new_name = f"{prefix}_{count+1:03d}{ext}"
        
        old_file = os.path.join(path, filename)
        new_file = os.path.join(path, new_name)
        
        # 4. 执行重命名
        try:
            os.rename(old_file, new_file)
            print(f"✅ {filename} -> {new_name}")
            count += 1
        except Exception as e:
            print(f"❌ 重命名 {filename} 失败: {e}")

    print(f"\n🎉 完成！共处理 {count} 个文件。")

if __name__ == "__main__":
    # 在这里修改你的文件夹路径和想要的前缀
    target_path = "./photos"
    new_prefix = "活动现场"
    
    batch_rename(target_path, new_prefix)
```

## 3. 代码解析

1.  `os.listdir(path)`: 列出文件夹里所有的东西。
2.  `path.join()`: 智能拼接路径，不用担心 Windows/Mac 斜杠方向不一样的问题。
3.  `f"{prefix}_{count+1:03d}{ext}"`: 这是 Python 的 f-string 格式化大法。`:03d` 的意思是“不足3位自动补零”，于是你就得到了 `001`, `009`, `010` 这样整齐的序号。

## 4. 扩展思路

一旦掌握了这个逻辑，你能做更多事：
*   **按日期归档**：读取文件的创建时间，自动把文件移动到 `2026-01` 文件夹里。
*   **筛选文件**：只处理 `.pdf` 文件，把 `.txt` 删掉。

学会编程思维，哪怕只是这种小脚本，也能极大提升你的职场幸福感。
