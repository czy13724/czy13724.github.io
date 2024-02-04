---
layout: post
title: 自动将qx专用js/conf/snippet文件转换为stoverride文件
subtitle: " \"Automate convert qx's js/conf/snippet to stoverride\""
date: 2024-02-04 22:15:06
author: "Levi"
header-img: img/bg/image_30.jpg
catalog: true
tags:
    - 教程
    - 工作流
    - workflow
---

> “Pains make you stronger, tears make you braver, and heartbreaks make you wiser. So thank the past for a better future. ”
> “伤痛让你更坚强，眼泪让你更勇敢，心碎让你更明智，所以，感谢过去，给我们带来更好的未来。”


<span style="color:blue;">本文只针对习惯写qx脚本的作者。如你不是写qx脚本的作者请忽略本文。如转换有问题，请单独使用script-hub进行转换。</span>



## 脚本说明

### 脚本用途

- 脚本是将qx的js、conf、snippet格式的脚本自动转换为stoverride的文件。
- 脚本自动监测存放js、conf、snippet文件夹下的改动自动运行。只需要存放js、conf、snippet的文件夹，如监测不到存放stoverride的文件夹会自动创建Stash文件夹。

### 脚本问题

- 目前脚本已支持转换重写规则为多条规则的脚本。如有问题请等待完善修复。
- <span style="color:red;">由于测试阶段，js、conf、snippet文件内容必须含有**[rewrite_local]**和**[mitm]**/**[MITM]**；如为[Mitm]或其他格式会导致无法匹配。如文件中没有**[rewrite_local]**和**[mitm]**/**[MITM]**该参数则会跳过转换该文件，请在工作流日志中查看转换详情。</span>
- 脚本内如存在***项目名称***和***使用说明***，则会自动匹配；如没有该内容则会提取raw链接的文件名作为stoverride的文件名及其描述。
- 偶现上传一个脚本所有脚本更新情况（为了防止脚本不更新情况出现而设定，如不需要则移除py脚本中# Add a dummy stoverride change and commit部分内容）。
- 使用者如有某部分匹配为空的情况，请应检查完善stoverride丢失内容。
- 开发者在使用脚本时需注意尽量不要在**[rewrite_local]**和**[mitm]**/**[MITM]**内容里带有注释，如有注释可能有偶现匹配丢失规则的情况。
- 本脚本已增加识别是否存在[task_local]并转换。
- 本脚本转换后的文件中均含有*免责声明*，如您不喜欢该声明可以进行删除或修改。

## 简明教程

如不需要个性化文件夹名称，只需要将工作流及其脚本放置在对应的仓库下并给予工作流写入权限即可。然后将你的js、conf、snippet文件放置在名为*scripts*的文件夹内即可。

## 详细教程

#### 添加工作流

首先来到自己即将存放js/conf/snippet文件的仓库下，点击settings，点击actions，滑到底部的Workflow permissions这里，勾选read and write permission，给予工作流写入权限。![01]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/01.png)

![02]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/02.png)

点击下图中所示的*actions*。点击*new workflow*。![03]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/03.png)

填入文件名称：*convert_js_to_stoverride.yml*。将[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/workflows/convert_js_to_stoverride.yml)的内容进行复制粘贴进来保存。

或复制该文本内容（建议通过链接复制）：

```python
# author: Levi
# 搭配convert_js&conf&snippet_stoverride.py使用。可将qx的js/conf/snippet文件转换为stoverride文件。

name: convert_js_to_stoverride

on:
  push:
    paths:
      - 'scripts/**' # Trigger on changes in 'scripts' folder
  pull_request:
    paths:
      - 'Stash/**' # Trigger on changes in 'Stash' folder
  workflow_dispatch:

jobs:
  generate_stoverride:
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
        run: python .github/scripts/convert_js_to_stoverride.py
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Archive artifacts
        uses: actions/upload-artifact@v2
        with:
          name: stoverride-artifacts
          path: ${{ github.workspace }}/Stash
        
      - name: Check for changes
        id: check_changes
        run: |
          git status
          git diff-index --quiet HEAD || echo "::set-output name=changes_exist::true"
      - name: Commit and push if changes exist
        if: steps.check_changes.outputs.changes_exist == 'true'
        run: |
          git config user.name "${{ github.actor }}"
          git config user.email "${{ github.actor }}@users.noreply.github.com"
          git add .
          git commit -m "已转换为stoverride文件"
          git push origin HEAD:main --force
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

注意在上述工作流中，你需要将
第9行的*scripts*替换为你想要存放js/conf/snippet的文件夹名称（以下以qx为例），
第12行和第42行的*Stash*替换为你想要存放stoverride的文件夹名称（以下以stash为例）。
第55行的*已转换为stoverride文件*可改可不改。

⚠️如果你选择直接复制本文中上述工作流，需要按照图示内容补全，
![04]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/04.png)

#### 添加py脚本

在仓库添加完工作流后，仓库根目录会多出一个.github的文件夹，在该文件夹下创建一个新的文件夹名为scripts<span style="color:red;">（注意此处的名称和工作流内的不是一个文件夹，请不要更改该文件夹名称）</span>，在.github/scripts下新建一个名为*convert_js_to_stoverride.py*的文件，并复制粘贴[该链接](https://raw.githubusercontent.com/czy13724/Quantumult-X/main/.github/scripts/convert_js_to_stoverride.py)的内容保存。

```python
# author: Levi
# 搭配convert_js&conf&snippet_stoverride.yml使用。可将qx的js/conf/snippet文件转换为Stash可用的stoverride文件。

import os
import re
import random

# Generate a random number at the beginning to maintain consistency in usage
random_number = random.randint(0, 99)


def task_local_to_stoverride(js_content, project_name, random_number):
    task_local_content = ''
    # Check if [task_local] section exists
    task_local_block_match = re.search(r'\[task_local\](.*?)\n\[', js_content, re.DOTALL | re.IGNORECASE)
    if task_local_block_match:
        task_local_block = task_local_block_match.group(1)
        # Match the first link in the [task_local] section and its preceding cron expression
        task_local_match = re.search(r'((?:0\s+\d{1,2},\d{1,2},\d{1,2}\s+.*?)+)\s+(https?://\S+)', task_local_block)
        if task_local_match:
            cronexp, script_url = task_local_match.groups()
            # Ensure script-path does not include anything after a comma in the URL
            script_url = script_url.split(',')[0]
            # Extract the file name from the link to use as the tag
            tag = os.path.splitext(os.path.basename(script_url))[0]
            # Construct the stoverride cron task section
            task_local_content = f'cron: \n  script: \n      - name: "{project_name}_{random_number}"\n      cron: "{cronexp}"\n      timeout: 60\n'
    # Return the task_local section content, if any
    return task_local_content


def mitm_to_stoverride(js_content):
    mitm_content = ''
    # search [MITM]/[mitm] section
    mitm_match = re.search(r'\[mitm\]\s*([^=\n]+=[^\n]+)\s*', js_content, re.DOTALL | re.IGNORECASE)
    # if found
    if mitm_match:
        mitm_block = mitm_match.group(1)
        # remove "hostname ="
        mitm_block = re.sub(r'hostname\s*=\s*', '', mitm_block)
        # Split hostname
        mitm_hosts = mitm_block.strip().split(',')
        # Add "-" prefix to each hostname so that it conforms to stoverride format
        mitm_content = '\n'.join([f'    - "{host.strip()}"' for host in mitm_hosts if host.strip()])
    # Returns the processed MITM string
    return mitm_content

def script_to_stoverride(js_content, project_name, random_number):
    script_content = ''
    # match rewrite_local part
    rewrite_matches = re.finditer(
        r'^(.*?)(?:\s*url\s+script-(response|request)-(body|header)\s+(.*))$', 
        js_content, 
        re.MULTILINE
    )
    for match in rewrite_matches:
        pattern, method, kind, path = match.groups()
        stoverride_method = 'request' if method == 'request' else 'response'
      # kind is not used for the time being, the actual process may need to change the script path according to 'body' and 'header'.
        script_content += f'  \n  - match: {pattern.strip()}\n'
        script_content += f'    name: {project_name}_{random_number}\n'
        script_content += f'    type: {stoverride_method}\n'
        script_content += f'    require-body: true\n'
        script_content += f'    max-size: -1\n'
        script_content += f'    timeout: 60\n'  
    
    return script_content

def script_providers_to_stoverride(project_name, script_path):
    # Use the same random_number for consistency
    name = f"{project_name}_{random_number}"
    # Use the correct script_path as url
    url = script_path.strip()
    interval = 86400  
    script_providers_content = (
        f'script-providers:\n'
        f'  "{project_name}_{random_number}":\n'
        f'    url: {url}\n'
        f'    interval: {interval}\n'
    )
    return script_providers_content


def js_to_stoverride(js_content):
    # Check for the presence of the [rewrite_local] and [mitm]/[MITM] sections
    if not (re.search(r'\[rewrite_local\]', js_content, re.IGNORECASE) or
            re.search(r'\[mitm\]', js_content, re.IGNORECASE) or
            re.search(r'\[MITM\]', js_content, re.IGNORECASE)):
        return None
    
    # Extract information from the JS content
    name_match = re.search(r'项目名称：(.*?)\n', js_content)
    desc_match = re.search(r'使用说明：(.*?)\n', js_content)

    # If there is no project name and description, use the last part of the matched URL as the project name
    if not (name_match and desc_match):
        url_pattern = r'url\s+script-(?:response-body|request-body|echo-response|request-header|response-header|analyze-echo-response)\s+(\S+.*?)$'
        last_part_match = re.search(url_pattern, js_content, re.MULTILINE)
        if last_part_match:
            project_name = os.path.splitext(os.path.basename(last_part_match.group(1).strip()))[0]
        else:
            raise ValueError("文件内容匹配错误，请按照要求修改，详情请按照levifree.tech文章内容修改")

        project_desc = f"{project_name} is automatically converted by LEVI SCRIPT; if not available plz use Script-Hub."

    else:
        project_name = name_match.group(1).strip()
        project_desc = desc_match.group(1).strip()

    # Create the final stoverride content string
    stoverride_content = (
        f"name: |-\n  {project_name}\ndesc: |-\n  {project_desc}\n\n"
        "http:\n\n"
    )

    # Process mitm content
    mitm_section = mitm_to_stoverride(js_content)
    if mitm_section:
        stoverride_content += f"  mitm:\n{mitm_section}\n"

    # Extract the script section
    script_section = script_to_stoverride(js_content, project_name, random_number)
    if script_section:
        stoverride_content += f"\n  script:{script_section}\n"

    # Search for the URL pattern in the rewrite_local section and retrieve the first match
    url_pattern = r'url\s+script-(?:response-body|request-body|response-header|request-header|echo-response|analyze-echo-response)\s+(\S+)'
    url_match = re.search(url_pattern, js_content, re.IGNORECASE)
    
    # If a URL match is not found, throw an error
    if not url_match:
        raise ValueError("未找到脚本路径。请确保在 js/conf/snippet 文件中包含了至少一个有效的链接.")

    script_path = url_match.group(1).strip()

    # Add the script-providers section with the project name and the extracted script path
    script_providers_section = script_providers_to_stoverride(project_name, script_path)
    stoverride_content += f"\n{script_providers_section}\n"

    # Process task_local section
    task_local_section = task_local_to_stoverride(js_content, project_name, random_number)
    if task_local_section:
        stoverride_content += f"\n{task_local_section}\n"

    # Return the final stoverride content
    return stoverride_content


def main():
    # Process files in the 'scripts' folder
    qx_folder_path = 'scripts'
    if not os.path.exists(qx_folder_path):
        print(f"Error: {qx_folder_path} does not exist.")
        return

    # Define the supported file extensions
    supported_extensions = ('.js', '.conf', '.snippet')

    for file_name in os.listdir(qx_folder_path):
        if file_name.endswith(supported_extensions):
            # File extension check for .js, .conf, or .snippet
            file_path = os.path.join(qx_folder_path, file_name)
            with open(file_path, 'r', encoding='utf-8') as file:
                js_content = file.read()
                stoverride_content = js_to_stoverride(js_content)
                
                if stoverride_content is not None:
                    # Write stoverride content to 'stash' folder if stoverride_content is not None
                    stash_folder_path = 'Stash'
                    os.makedirs(stash_folder_path, exist_ok=True)
                    stoverride_file_path = os.path.join(stash_folder_path, f"{os.path.splitext(file_name)[0]}.stoverride")
                    
                    with open(stoverride_file_path, "w", encoding="utf-8") as stoverride_file:
                        stoverride_file.write(stoverride_content)
                    print(f"Generated {stoverride_file_path}")
                else:
                    # Skip files without the required sections
                    print(f"跳过 {file_name} 由于文件缺失匹配内容，请仔细检查.")

                # Since we're simulating a git operation, we'll do this for all file types
                with open(file_path, 'a', encoding='utf-8') as file:
                    file.write("\n// Adding a dummy stoverride change to trigger git commit\n")
                os.system(f'git add {file_path}')
                os.system('git commit -m "Trigger update"')

if __name__ == "__main__":
    main()
```

上述内容需要修改的内容如图所示：
![05]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/05.png)

scripts，将其修改为工作流改动的文件夹名称（以qx为例，即scripts->qx）；

Stash也要修改为工作流改动的文件夹名称（以stash为例，即Stash->stash）。

第104行：project_desc双引号内容可以修改。（可选）

*Adding a dummy stoverride change to trigger git commit*可以修改，但注意保留双引号内其他内容。（可选）


添加完成之后你的分支如下图所示：
![06]({{site.baseurl}}/img/workflow_convert_js_to_stoverride/06.png)
手动运行一次检查是否运行成功，如运行失败则点开失败日志查看详情，如遇到*文件内容匹配错误*说明有某脚本出现问题，请自行移除即可。

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