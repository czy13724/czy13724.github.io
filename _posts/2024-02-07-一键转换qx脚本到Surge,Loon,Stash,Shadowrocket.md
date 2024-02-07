---
layout: post
title: 一键转换qx脚本到Surge,Loon,Stash,Shadowrocket
subtitle: " \"Automate convert Qx's js/conf/snippet to Surge,Loon,Stash,Shadowrocket‘s scripts\""
date: 2024-02-07 10:45:06
author: "Levi"
header-img: img/bg/image_32.jpg
catalog: true
tags:
    - 教程
    - 工作流
    - workflow
---

> “What is any ocean but a multitude of drops?”
> “没有众多的水滴又哪来的海洋呢？”


<span style="color:blue;">本文只针对习惯写qx脚本的作者。如你不是写qx脚本的作者请忽略本文。如转换有问题，请单独使用script-hub进行转换。</span>



## 脚本说明
本文章采用一条龙服务，各工作流之间互不冲突。如未使用该文章所述而采用之前的单独工作流，那么需要仅保留一项推送功能，即有且仅有一个工作流运行推送完毕后其他工作流才能依次运行。同时运行会导致仓库数据不匹配而失败。（如：同一个仓库内使用convert js to sgmodule.yml和convert js to plugin.yml而自动运行时，若同时达到推送步骤则会有一个报错，因此需要错开时间。）

### 脚本用途

- 脚本会将qx的js、conf、snippet格式的脚本自动转换为sgmodule，plugin，stoverride的文件并在原js、conf、snippet中添加链接注释。
- 脚本自动监测存放js、conf、snippet文件夹下的改动自动运行。只需要存放js、conf、snippet的文件夹，如监测不到存放的文件夹会自动创建文件夹。

将[链接1](https://github.com/czy13724/Quantumult-X/tree/main/.github/workflows/)和将[链接2](https://github.com/czy13724/Quantumult-X/tree/main/.github/scripts/)的内容进行下载编辑(共8个文件；推荐使用电脑编辑)。

## 配置脚本

### 添加工作流

按照图示注释内容进行编辑：
![01]({{site.baseurl}}/img/workflow_all_convert/01.png)
![02]({{site.baseurl}}/img/workflow_all_convert/02.png)
![03]({{site.baseurl}}/img/workflow_all_convert/03.png)
![04]({{site.baseurl}}/img/workflow_all_convert/04.png)


### 添加py脚本

按照图示注释内容进行编辑：
![05]({{site.baseurl}}/img/workflow_all_convert/05.png)
![06]({{site.baseurl}}/img/workflow_all_convert/06.png)
![07]({{site.baseurl}}/img/workflow_all_convert/07.png)
![08]({{site.baseurl}}/img/workflow_all_convert/08.png)

添加完成之后你的分支如下图所示：
![09]({{site.baseurl}}/img/workflow_all_convert/09.png)
手动运行一次检查是否运行成功，如运行失败则点开失败日志查看详情，如遇到*文件内容匹配错误*说明有某qx脚本出现问题，请自行移除该qx脚本或修改为正确的格式即可。

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