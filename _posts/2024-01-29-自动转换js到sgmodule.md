---
layout: post
title: 自动将qx专用js文件转换为sgmodule文件
subtitle: " \"Automate convert qx's js to sgmodule\""
date: 2024-01-29 12:45:06
author: "Levi"
header-img: img/bg/image_28.jpg
catalog: true
tags:
    - 教程
    - 工作流
---

> “Figure out what you like. Try to become the best in the world of it. ”
> “找到你喜欢做的事，并努力成为这个领域里的顶尖人物。”


<span style="color:red;">本文只针对习惯写qx脚本的作者。如你不是写qx脚本的作者请忽略本文。如转换有问题，请单独使用script-hub进行转换。</span>



## 脚本说明

### 脚本用途

- 脚本是将qx的js格式的脚本自动转换为sgmodule的文件。
- 脚本自动监测存放js文件夹下的改动自动运行。只需要存放js的文件夹，如监测不到存放sgmodule的文件夹会自动创建surge文件夹。

### 脚本问题

- 目前脚本只能转换重写规则为一条规则的脚本。由于语法逻辑限制等待完善。
- 由于测试阶段，js文件内容必须含有**[rewrite_local]**和**[mitm]**/**[MITM]**；如为[Mitm]或其他格式会导致无法匹配。
- 脚本内如存在***项目名称***和***使用说明***，则会自动匹配；如没有该内容则会提取raw链接的文件名。
- 偶现上传一个脚本所有脚本更新情况。
- 使用者如有某部分匹配为空的情况，请应检查完善sgmodule丢失内容。

## 简明教程

如不需要个性化文件夹名称，只需要将工作流及其脚本放置在对应的仓库下并给予工作流写入权限即可。然后将你的js文件放置在名为*scripts*的文件夹内即可。

## 详细教程

#### 添加工作流

首先来到自己即将存放js文件的仓库下，点击settings，点击actions，滑到底部的Workflow permissions这里，勾选read and write permission，给予工作流写入权限。![01]({{site.baseurl}}/img/workflow_convert_js_to_sgmodule/01.png)

![02]({{site.baseurl}}/img/workflow_convert_js_to_sgmodule/02.png)

点击下图中所示的*actions*。点击*new workflow*。![03]({{site.baseurl}}/img/workflow_convert_js_to_sgmodule/03.png)

填入文件名称：*convert_js_to_sgmodule.yml*。将[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/workflows/convert_js_to_sgmodule.yml)的内容进行复制粘贴进来保存。

或复制该文本内容（建议通过链接复制）：

```python
# author:Levi
# 搭配convert js to sgmodule.py使用。可将qx的js文件转换为sgmodule文件。

name: convert js to sgmodule

on:
  push:
    paths:
      - 'scripts/**' # Trigger on changes in scripts folder
  pull_request:
    paths:
      - 'Surge/**' # Trigger on changes in Surge folder
  workflow_dispatch:

jobs:
  generate_sgmodule:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.8

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install PyGithub

      - name: Run script
        run: python .github/scripts/convert_js_to_sgmodule.py
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Archive artifacts
        uses: actions/upload-artifact@v2
        with:
          name: sgmodule-artifacts
          path: ${{ github.workspace }}/Surge
        
      - name: Push to Quantumult-X Repository
        run: |
          set -x
          git config user.name "${{ github.actor }}"
          git config user.email "${{ github.actor }}@users.noreply.github.com"
          git add .
          git commit -m "Add converted sgmodule file"
          git push origin HEAD:main --force
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

注意：上述工作流中，你需要将第9行的*scripts*替换为你想要存放js的文件夹名称（以下以qx为例），第12行和第42行的*Surge*替换为你想要存放sgmodule的文件夹名称（以下以surge为例）。第50行的*Add converted sgmodule file*可改可不改。
如果你直接复制的上述工作流，需要将第36行、第53行内容补全，
![04]({{site.baseurl}}/img/workflow_convert_js_to_sgmodule/04.png)

#### 添加py脚本

在仓库添加完工作流后，仓库根目录会多出一个.github的文件夹，在该文件夹下创建一个新的文件夹名为scripts（注意此处的名称和工作流内的不是一个文件夹，请不要更改该文件夹名称），在.github/scripts下新建一个名为*convert_js_to_sgmodule.py*的文件，并复制粘贴[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/scripts/convert_js_to_sgmodule.py)的内容保存。

```python
import os
import re

def insert_append(content):
    # Insert %APPEND% after the first '=' sign
    return re.sub(r'=', '= %APPEND%', content, count=1)

def js_to_sgmodule(js_content):
    # Extract information from the JS content
    name_match = re.search(r'项目名称：(.*?)\n', js_content)
    desc_match = re.search(r'使用说明：(.*?)\n', js_content)
    mitm_match = re.search(r'\[([Mm])itm\]\s*([^=\n]+=[^\n]+)\s*', js_content, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    hostname_match = re.search(r'hostname\s*=\s*([^=\n]+=[^\n]+)\s*', js_content, re.DOTALL | re.MULTILINE)

    # If there is no project name and description, use the last part of the matched URL as the project name
    if not (name_match and desc_match):
        url_pattern = r'url\s+script-(?:response-body|request-body|echo-response|request-header|response-header|analyze-echo-response)\s+(\S+.*?)$'
        last_part_match = re.search(url_pattern, js_content, re.MULTILINE)
        if last_part_match:
            project_name = os.path.splitext(os.path.basename(last_part_match.group(1).strip()))[0]
        else:
            raise ValueError("JS内容格式不符合要求")
        
        project_desc = f"{project_name} is automatically converted by LEVI SCRIPT; if not available plz use Script-Hub."

    else:
        project_name = name_match.group(1).strip()
        project_desc = desc_match.group(1).strip()

    mitm_content = mitm_match.group(2).strip() if mitm_match else ''
    hostname_content = hostname_match.group(1).strip() if hostname_match else ''

    # Insert %APPEND% into mitm and hostname content
    mitm_content_with_append = insert_append(mitm_content)

    # Generate sgmodule content
    sgmodule_content = f"""#!name={project_name}
#!desc={project_desc}

[MITM]
{mitm_content_with_append}

[Script]
"""

    # Process each rewrite rule
    rewrite_local_pattern = re.compile(r'\[rewrite_local\]\s*(.*?)\s*(?:\[([Mm])itm\]\s*hostname\s*=\s*(.*?)\s*|$)', re.DOTALL | re.MULTILINE)
    rewrite_local_matches = list(rewrite_local_pattern.finditer(js_content))

    if not rewrite_local_matches:
        raise ValueError("找不到[rewrite_local]规则")

    # Append to sgmodule content
    for rewrite_match_item in rewrite_local_matches:
        rewrite_local_content = rewrite_match_item.group(1).strip()

        # Extract pattern and script type from rewrite_local_content
        pattern_script_matches = re.finditer(r'^(.*?)\s*url\s+script-(response-body|request-body|echo-response|request-header|response-header|analyze-echo-response)\s+(\S+.*?)$', rewrite_local_content, re.MULTILINE)

        if not pattern_script_matches:
            raise ValueError("[rewrite_local]格式不正确，请删除JS文件该部分的注释")

        # Append to sgmodule content
        for pattern_script_match in pattern_script_matches:
            pattern = pattern_script_match.group(1).strip()
            script_type = pattern_script_match.group(2).strip()
            script = pattern_script_match.group(3).strip()

            # Remove the '-body' or '-header' suffix from the script type
            script_type = script_type.replace('-body', '').replace('-header', '')

            # Append to sgmodule content
            sgmodule_content += f"{project_name} = type=http-{script_type},pattern={pattern},requires-body=1,max-size=0,script-path={script}\n"

    return sgmodule_content

def main():
    # Process each file in the 'scripts' folder
    qx_folder_path = 'scripts'
    if not os.path.exists(qx_folder_path):
        print(f"Error: {qx_folder_path} does not exist.")
        return

    for file_name in os.listdir(qx_folder_path):
        if file_name.endswith(".js"):
            file_path = os.path.join(qx_folder_path, file_name)
            with open(file_path, 'r', encoding='utf-8') as js_file:
                js_content = js_file.read()
                sgmodule_content = js_to_sgmodule(js_content)

                # Write sgmodule content to 'surge' folder
                surge_folder_path = 'Surge'
                os.makedirs(surge_folder_path, exist_ok=True)
                sgmodule_file_path = os.path.join(surge_folder_path, f"{os.path.splitext(file_name)[0]}.sgmodule")
                with open(sgmodule_file_path, "w", encoding="utf-8") as sgmodule_file:
                    sgmodule_file.write(sgmodule_content)

                print(f"Generated {sgmodule_file_path}")

                # Add a dummy change and commit
                with open(file_path, 'a', encoding='utf-8') as js_file:
                    js_file.write("\n// Adding a dummy change to trigger git commit\n")

                os.system(f'git add {file_path}')
                os.system('git commit -m "Trigger update"')

if __name__ == "__main__":
    main()
```

上述内容需要修改的是：

第79行的scripts，将其修改为工作流改动的文件夹名称（以qx为例）；

第92行的Surge也要修改为工作流改动的文件夹名称（以surge为例）。

第24行的project_desc双引号内容可以修改。（可选）

第102行的*Adding a dummy change to trigger git commit*可以修改，但注意保留双引号内其他内容。（可选）


添加完成之后你的分支如下图所示：
![05]({{site.baseurl}}/img/workflow_convert_js_to_sgmodule/05.png)
手动运行检查是否有问题。