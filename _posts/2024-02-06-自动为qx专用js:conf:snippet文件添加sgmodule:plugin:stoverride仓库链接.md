---
layout: post
title: 自动为qx专用js/conf/snippet文件添加sgmodule/plugin/stoverride仓库链接
subtitle: " \"Automate add raw-url of qx's js/conf/snippet\""
date: 2024-02-06 14:15:06
author: "Levi"
header-img: img/bg/image_31.jpg
catalog: true
tags:
    - 教程
    - 工作流
    - workflow
---

> “No one but ourselves can degrade us.”
> “没人能够贬低我们，除非是我们自己。”


<span style="color:blue;">本文只针对习惯写qx脚本的作者。如你不是写qx脚本的作者请忽略本文。如有问题，请单独使用issue或在此文章下进行留言。</span>


## 脚本说明
为qx的js/conf/snippet脚本内添加适用于Surge、Loon、Stash、ShadowRocket存放在其他位置的raw链接注释。

## 添加工作流

首先来到自己即将存放js/conf/snippet文件的仓库下，点击settings，点击actions，滑到底部的Workflow permissions这里，勾选read and write permission，给予工作流写入权限。

![01]({{site.baseurl}}/img/workflow_generate_desc/01.png)

![02]({{site.baseurl}}/img/workflow_generate_desc/02.png)

点击下图中所示的*actions*。点击*new workflow*。

![03]({{site.baseurl}}/img/workflow_generate_desc/03.png)

填入文件名称：*generate_desc.yml*。将[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/workflows/generate_desc.yml)的内容进行复制粘贴进来保存。

或复制该文本内容（单独使用建议通过复制下方内容）：

```python
# 需要搭配generate_desc.py使用。
# author: Levi

# 给qx的文件在文件开头增加综合链接注释，如下所示：
# // Quantumult X引用地址
# // Surge/Shadowrocket 模块地址
# // Loon 插件地址
# // Stash 覆写地址

name: generate_desc

on: # 注释内容默认关闭，如单一使用工作流使其自动运行取消#即可（中文前的#不能删除）。
 # push:
   # branches:
     # - main
   # paths:
     # - 'scripts/**' # 监测qx脚本的文件夹
  workflow_dispatch: # 这是手动触发

jobs:
  generate-desc:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout the code
      uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.9' 

    - name: Install Python dependencies
      run: |
        python -m pip install --upgrade pip
        pip install requests

    - name: Run script
      run: python .github/scripts/generate_desc.py
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Check for changes
      id: check_changes
      run: |
        if git diff --quiet; then 
          echo "No changes in the commit."
        else 
          echo "::set-output name=changes_exist::true"
        fi

    - name: Sync with remote
      if: steps.check_changes.outputs.changes_exist == 'true'
      run: |
        git fetch origin
        git reset --soft origin/main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}   
    
    - name: Commit and push if changes exist
      if: steps.check_changes.outputs.changes_exist == 'true'
      run: |
        git config user.name "${{ github.actor }}"
        git config user.email "${{ github.actor }}@users.noreply.github.com"
        git add -A
        git commit -m "为js/conf/snippet增加综合注释"
        git push --force origin HEAD:main #若不使用强制推送请移除‘--force’
```

注意在上述工作流中，你需要将
第17行的*scripts*替换为你想要存放js/conf/snippet的文件夹名称（以下以qx为例），第66行的*为js/conf/snippet增加综合注释*可改可不改。

⚠️如果你选择直接复制本文中上述工作流，需要按照图示内容补全：
![04]({{site.baseurl}}/img/workflow_generate_desc/04.png)

## 添加py脚本

在仓库添加完工作流后，仓库根目录会多出一个.github的文件夹，在该文件夹下创建一个新的文件夹名为scripts<span style="color:red;">（注意此处的名称和工作流内的不是一个文件夹，请不要更改该文件夹名称）</span>，在.github/scripts下新建一个名为*generate_desc.py*的文件，并复制粘贴[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/scripts/generate_desc.py)的内容保存。

```python
# 需要搭配generate_desc.yml使用。
# author: Levi
# 给qx的文件在文件开头增加综合链接注释

import os
import requests
import base64
import re

# Repository details
GITHUB_USERNAME = 'czy13724'
REPO_NAME = 'Quantumult-X'
FOLDER_NAME = 'scripts'

# GitHub API URL
GITHUB_API = 'https://api.github.com'

# Headers for using the default GITHUB_TOKEN provided by GitHub Actions
headers = {
    'Authorization': f'token {os.getenv("GITHUB_TOKEN")}',
    'Accept': 'application/vnd.github.v3+json'
}

def get_file_list(folder_name):
    contents_url = f"{GITHUB_API}/repos/{GITHUB_USERNAME}/{REPO_NAME}/contents/{folder_name}"
    response = requests.get(contents_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching repo contents: {response.status_code}")
        return None

def update_file(file_path, b64_encoded_content, sha):
    update_url = f"{GITHUB_API}/repos/{GITHUB_USERNAME}/{REPO_NAME}/contents/{file_path}"
    message = f"为{file_path}增加综合注释"
    data = {
        'message': message,
        'content': b64_encoded_content,
        'sha': sha
    }
    response = requests.put(update_url, headers=headers, json=data)
    if response.status_code == 200:
        print(f"File updated successfully: {file_path}")
    else:
        print(f"Error updating file: {response.status_code}, Response: {response.json()}")

# Generate the custom header
def generate_custom_header(file_name, file_extension):
    # Custom header format
    header_format = """
// Quantumult X引用地址： https://raw.githubusercontent.com/{username}/{repo}/main/{folder}/{file}{ext}
// Surge/Shadowrocket 模块地址： https://raw.githubusercontent.com/{username}/{repo}/main/Surge/{file}.sgmodule
// Loon 插件地址： https://raw.githubusercontent.com/{username}/{repo}/main/Loon/{file}.plugin
// Stash 覆写地址： https://raw.githubusercontent.com/{username}/{repo}/main/Stash/{file}.stoverride
"""
    return header_format.format(username=GITHUB_USERNAME, repo=REPO_NAME, folder=FOLDER_NAME, file=file_name, ext=file_extension)

# Check if the file already contains any of the key comments to be replaced
def contains_key_comments(file_content):
    key_comments = [
        "// Quantumult X引用地址",
        "// Surge/Shadowrocket 模块地址",
        "// Loon 插件地址",
        "// Stash 覆写地址"
    ]
    for comment in key_comments:
        if comment in file_content:
            return True
    return False

# Fetch the list of files
files = get_file_list(FOLDER_NAME)

# Regular expression pattern for replacing old custom headers
pattern = re.compile(r'(// Quantumult X引用地址.*?// Stash 覆写地址.*?)\n', re.DOTALL)

for file in files:
    file_name, file_extension = os.path.splitext(file['name'])
    
    if file_extension in ('.js', '.conf', '.snippet'):  
        download_url = file['download_url']
        file_sha = file['sha']
        
        # Download the existing file content
        file_content_response = requests.get(download_url)
        
        if file_content_response.status_code == 200:
            file_content = file_content_response.content.decode('utf-8')
            custom_header = generate_custom_header(file_name, file_extension)

            # Check if the file contains the key comments
            if contains_key_comments(file_content):
                # Replace the existing custom header with the new one
                updated_file_content = pattern.sub(custom_header, file_content, count=1)
            else:
                # Prepend the custom header if key comments do not exist
                updated_file_content = custom_header + '\n' + file_content

            # Encode the updated file content in base64
            b64_encoded_content = base64.b64encode(updated_file_content.encode('utf-8')).decode('utf-8')

            # Update the file on GitHub
            update_file(file['path'], b64_encoded_content, file_sha)
        else:
            print(f"Failed to download file content: {file_content_response.status_code}")
```

上述代码中，你需要将

[11-13]修改为适用于你自己的内容。（GitHub用户名、仓库名称、文件夹名称）

[51]若分支为main则无需修改，若不是将该行main替换。

[52]若分支为main则无需修改，若不是将该行main替换。若存放sgmodule的文件夹为Surge则无需修改，若不是将该行Surge替换。

[53]若分支为main则无需修改，若不是将该行main替换。若存放plugin的文件夹为Loon则无需修改，若不是将该行Loon替换。

[54]若分支为main则无需修改，若不是将该行main替换。若存放stoverride的文件夹为Stash则无需修改，若不是将该行Stash替换。


## 模版

可以参考以下模版进行撰写文件。
⚠️<span style="color:red;">撰写脚本时必须含有**[rewrite_local]**、**[mitm]**/**[MITM]**、**hostname**字符。[task_local]为可选项。</span>
```python
/*
项目名称：demo1
使用说明：demo1。
...
*/

[rewrite_local]
# 第一条重写规则（尽量不要写该注释）
^https:\/\/api.example1.com\/v1\/user\/profile url script-response-body https://raw.githubusercontent.com/user/repo/main/scripts/demo1.js
# 第二条重写规则（尽量不要写该注释）
^https:\/\/shop.example2.com\/api\/list url script-request-header https://raw.githubusercontent.com/user/repo/main/scripts/demo2.js

[mitm]
hostname = api.example1.com, shop.example2.com

[task_local]
1 */6 * * * https://raw.githubusercontent.com/user/repo/main/scripts/demo.js, tag=demo, img-url=https://example.com/icon.png, enabled=true
```



## 免责声明

* 项目内所涉及脚本、LOGO 仅为资源共享、学习参考之目的，不保证其合法性、正当性、准确性；切勿使用项目做任何商业用途或牟利；
* 遵循避风港原则，若有图片和内容侵权，请在 Issues 告知，核实后删除，其版权均归原作者及其网站所有；
* 本人不对任何内容承担任何责任，包括但不限于任何内容错误导致的任何损失、损害;
* 其它人通过任何方式登陆本网站或直接、间接使用项目相关资源，均应仔细阅读本声明，一旦使用、转载项目任何相关教程或资源，即被视为您已接受此免责声明。
* 本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。
* 本项目涉及的数据由使用的个人或组织自行填写，本项目不对数据内容负责，包括但不限于数据的真实性、准确性、合法性。使用本项目所造成的一切后果，与本项目的所有贡献者无关，由使用的个人或组织完全承担。
* 本项目中涉及的第三方硬件、软件等，与本项目没有任何直接或间接的关系。本项目仅对部署和使用过程进行客观描述，不代表支持使用任何第三方硬件、软件。使用任何第三方硬件、软件，所造成的一切后果由使用的个人或组织承担，与本项目无关。
* 本项目中所有内容只供学习和研究使用，不得将本项目中任何内容用于违反国家/地区/组织等的法律法规或相关规定的其他用途。
* 所有基于本项目源代码，进行的任何修改，为其他个人或组织的自发行为，与本项目没有任何直接或间接的关系，所造成的一切后果亦与本项目无关。
* 所有直接或间接使用本项目的个人和组织，应24小时内完成学习和研究，并及时删除本项目中的所有内容。如对本项目的功能有需求，应自行开发相关功能。
* 本项目保留随时对免责声明进行补充或更改的权利，直接或间接使用本项目内容的个人或组织，视为接受本项目的特别声明。
