---
layout:     post
title:      "编写JavaScript脚本的入门教程" 
subtitle:   " \"how to create Quantumult X's JavaScript\""
date:       2023-12-22 15:45:09
author:     "Levi"
header-img: "img/bg/image_23.jpg"
catalog: true
tags:
    - 教程 
    - JavaScript
---

> Act enthusiastic and you will be enthusiastic.
> 带着激情做事，你就会有激情。

## 前言

如果你拥有Quantumult X(以下用qx代替)并且想学习如何写一个js脚本，你大可以看一下下方的教程。如果你拥有Surge，Stash，Loon，Shadowrocket等也可以适用，用ScriptHub转换即可。本篇不讲述加密和解密类型脚本。以下内容由本人理解编写，如有该专业的原则问题，请批评指正。

## 前提（开始之前）

*我先问你两个问题：*

> 你是否会使用抓包？

如果你不会，那么先学习怎么抓包，我会以抓取某节点的视频代替，你要做的就是将软件替换为你要抓包的软件或小程序。如果到这里听不懂看不懂那么不必继续往下看了。

开源免费抓包软件ProxyPin: [点击直达](https://github.com/wanghongenpin/network_proxy_flutter)

#### 以下是一个使用qx抓取VPN的抓包视频教学(前30s为抓包教程)，其他软件也类似：

<video width="640" height="360" controls>
  <source src="https://github.com/czy13724/czy13724.github.io/raw/master/img/How_to_cteate_qx_JavaScript/zhuabaojiaoxue.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

> 你是否认识代码中常见的英文单词？

如果你认识并且会抓包但是不会写脚本可以继续看；如果你不认识但会使用词典查询且会抓包只是不会写脚本也可以继续看。

<span style="color:brown;">值得注意的是：在代码中很多英文单词使用了简写，比如obj=object(对象)、var=variable(变量)等</span>。

## 操作流程：

其实你在用别人写的脚本时会发现有多种写法，比如有用`const`的，有用`var`的，还有用`let`的。这些都不要紧，基本都有模版。还有就是脚本里一般分为三部分：<span style="color:red;">[rewrite_local]、[Mitm]、修改的内容</span>。

下面我给你说一下口诀：

<span style="color:purple;">遇0改1，遇false改true，一抓二找三改四套</span>。
抓就是抓包内容；找就是在抓到的内容里找到要改的信息；改就是关键信息进行0改1，false改true；套就是套语法模版。

接下来我会给你举出例子，希望你能快速理解。

### [rewrite_local]

先说说这一部分，其实这一部分在抓包的内容里，对应的是获取会员的一个请求链接，一般会用正则匹配使用。如果你不会正则表达式，网络上有很多一键生成正则表达式的工具。

我们一般修改的内容是`响应体`，因此我们填写的类型为`url script-response-body`。而最后的链接是你存储这个脚本的位置`路径`。

比如你使用qx并且开启了iCloud，那么将你写好的js脚本放入iCloud的`Quantumult X文件夹`下的`Scripts文件夹`里，这样你的链接就可以只填写你的`脚本文件名.js`，例如：`test.js`。

如果你要将脚本存放到GitHub仓库，在你的仓库里找到脚本并获取脚本raw链接填写在`url script-response-body`后即可。

### [Mitm]

下面再来说说这一部分，这一部分简单。
一般就是在`[rewrite_local]`里的`url script-response-body`之前的内容。<span style="color:red;">注意：这里使用的只有主域名</span>。
例如：

```
[rewrite_local]
^https:\/\/api\.akiinas\.com\/api\/v1\/users\/vipInfo url script-response-body https://raw.githubusercontent.com/Aki.js

[mitm]
hostname = api.akiinas.com
```

```
[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/duanshi.js

[mitm]
hostname = buy.itunes.apple.com
```

观察上方两个例子`url script-response-body`之前的内容,你发现了什么？

说白了，一般就是将`[rewrite_local]`里`url script-response-body`之前的内容去掉正则只保留到`.com`。

### var

下面是一个var的`样本模版`：

```
// 双斜杠后的内容在js里是属于注释内容不会生效
var body = $response.body; // 声明一个变量body并以响应消息体赋值
var obj = JSON.parse(body); // JSON.parse()将json形式的body转变成对象处理
响应体内容 //这里填写改好的响应体
body = JSON.stringify(obj); // 重新打包回json字符串
$done(body); // 结束修改
```

你观察这个模版`第二行var后面的body(等号之前的body)`与`第三行最后的body`以及`最后两行的body`是不是一个东西。如果你觉得是，那么我将body替换为A或者Q或者其他的值可不可以？答案是可以。

再次观察你有没有发现`第三行var后(等号之前)`用的是`obj`，`第五行最后的括号里`也是`obj`，你觉得这两个`obj`是否也可以替换？答案依旧是可以。

你会发现既然这两处可以随便更改，只要修改时保持一致就可以，你有没有觉得这个就是一个你个性化的值，或者说这个变量的名称可以个性化。

---

那么我再给你一个var模版，记作`chxm1023模版`：

```
var chxm1023 = JSON.parse($response.body);
chxm1023 = {
"status" : 200,
"data" : {
"active_time" : "2023-12-05T16:41:31+0000",
"expire_time" : "2099-09-09T09:09:09+0000",
"now" : "2023-12-05T16:42:06+0000",
"user_product_total" : [
{
"freeze" : 0,
"total_limit" : "UNLIMITED",
"deduction_type" : "DURATIONS",
"user_id" : "1777777777777777777",
"product_item_type" : "TRANSLATOR_BENEFIT",
"total" : 0,
"balance" : 0,
"user_product_total_id" : "1777777777777777777"
}
],
"pro" : true
},
"code" : "OK"
};

$done({body : JSON.stringify(chxm1023)});
```

你观察这个模版，和刚才的`样本模版`做一下对比，你有没有发现这个`chxm1023模版`里对`样本模版(前两行)`原来的代码进行了部分修改，我们尝试提取这个脚本主干：

```
var chxm1023 = JSON.parse($response.body);
chxm1023 = 修改后的响应体内容
$done({body : JSON.stringify(chxm1023)});
```

它和第一个模版有什么不同？显而易见，你会发现只是将`obj`换为了`chxm1023`。这说明上面的结论是正确的。

那么我们继续观察这两个模版的开头：

```
//样本模版开头
var body = $response.body;
var obj = JSON.parse(body);

//chxm1023模版开头
var chxm1023 = JSON.parse($response.body);
```
其实样本模板开头可以写成：
```
var obj = JSON.parse($response.body);
```

这样只需要一行代码即可。


再看结尾部分：

```
//样本模版结尾
body = JSON.stringify(obj); 
$done(body); 

//chxm1023模版结尾
$done({body : JSON.stringify(chxm1023)});
```

你有没有发现这就是进行了一个变体，那么你想想能不能还原为上方模版那种？

```
//还原后的结果如下所示
body = JSON.stringify(chxm1023);
$done(body);
```

反过来上方的模版能不能换成下方模版这种呢？

```
//还原后的结果如下所示
$done({body : JSON.stringify(obj)});
```

现在开始理解这个模版了吗？
我们继续拆开来说，以上方`chxm1023模版`的代码为例：我们单独看`修改后的响应体`：

```
{
"status" : 200,
"data" : {
"active_time" : "2023-12-05T16:41:31+0000",
"expire_time" : "2099-09-09T09:09:09+0000",
"now" : "2023-12-05T16:42:06+0000",
"user_product_total" : [
{
"freeze" : 0,
"total_limit" : "UNLIMITED",
"deduction_type" : "DURATIONS",
"user_id" : "1777777777777777777",
"product_item_type" : "TRANSLATOR_BENEFIT",
"total" : 0,
"balance" : 0,
"user_product_total_id" : "1777777777777777777"
}
],
"pro" : true
},
"code" : "OK"
};
```

你会发现`"expire_time" : "2099-09-09T09:09:09+0000",`和`"pro" : true`的内容被改成了这样，一个修改了`时间为2099`（还有一种是用的一串数字作为时间的，专业术语叫做时间戳，这里不做解释），另一个就是将`pro后的false改为了true`。以此完成了响应体的修改。

你又有疑问了：我在抓包时有很多链接，我怎么知道这个数据在哪个里面，因此可以使用搜索工具检索软件会员会使用什么作为数据内容，比如这个模版用的`pro`，再比如用的`vip`，`svip`，`plus`，`subscription`等等可以表示开了会员的单词。

（这里值得注意的是：这是搜索的是要对会员数据的修改，而有些软件是需要`xx币`的，那么你可能需要搜索的内容也会不同。）

但是上面这种模版你会发现很复杂很详细，不够简洁并且有时候会泄露一些个人信息，那么还有几种方式，下面提供一个新的模版（记作`Q模版`）。

```
var Q = JSON.parse($response.body);
Q.data.user.lifetime_subscription = true;  //响应体内容
Q.data.user.store_subscription = true;   //响应体内容
Q.data.user.subscription = true;   //响应体内容
$done({body : JSON.stringify(Q)});
```

你发现了吗？`Q`应该可以随意替换，而修改好的响应体内容很简练。像这种模板就是把Q放在开始，后面写响应体树，最后输出。

响应体树就是主分支-各分支内容。

拿`chxm1023模版`为例：
我们只修改了两个值的内容，因此我们提取树内容：data-pro和data-expire_time。写的时候再前面加上`Q`即可。
即左边是`Q.data.pro`和`Q.data.expire-time`右边是修改的内容。

原响应体内容提出来如下：
```
data.expire-time = 2099-09-09T09:09:09+0000；
data.pro = true；
```

对比`原chxm1023模版的响应体`发现，最后这种就是将修改的内容单独拿出来了，并且在它们的内容前面加上了一个`Q.`内容，这种就比较简练好看，而且可以减少代码内容在一定程度上避免信息泄露。

到现在你是否能够看懂部分代码？这里有一个很长的模版，你看看你能不能看懂？能不能尝试还原它？

```
var Q = JSON.parse($response.body);
Q.data.user_area.vip_info = [];//会员字体
Q.data.user_area.base_info.year_vip_show = "1";//0改成1
Q.data.user_area.base_info.vip_show_type = "40";//3改成40
Q.data.user_area.base_info.user_other_data = [];//粉丝
Q.data.user_area.base_info.is_vip = "1";//加密改成1
Q.data.user_area.base_info.level_icon = "https://cdn.wtzw.com/bookimg/free/images/app/1_0_0/level/level_icon_50.png";//会员等级50
//Q.data.func_area.list = [];
Q.data.func_area.second_title = "Lovebabyforever";
Q.data.func_area.icon_url = "";//png删了
Q.data.func_area.link_url = "freereader://webview?param={\"url\":\"https://t.me/chxm1023", \"type\":\"invite\"}";//跳转url
Q.data.func_area.first_title = "作者TG频道";//填写邀请码改

$done({body : JSON.stringify(Q)});
```


### let

下面我们再来说说let这种类型的。

先贴出一个模版：

```
let obj = JSON.parse($response.body);

obj.data.pro = true;

$done({
body: JSON.stringify(obj)
});
```

let翻译过来就是“让，使“的意思，这就是说我命令等号后面的这一堆的内容记作`obj`。那么你是不是又发现了`obj`这个值？它是不是和`var`里的功能类似并且支持任意替换？显而易见，是的。

你有没有觉得这个`let模版`和上方var部分的`Q模版`类似？
它们原来的样子是否和你想的一样？你不妨尝试写写。

```
var Q = JSON.parse($response.body);
Q.data.pro = true;
$done({body : JSON.stringify(Q)});
```

或者类似下方这种详细的模版：

```
var Q = JSON.parse($response.body);
Q = {
"status" : 200,
"data" : {
"active_time" : "2023-12-05T16:41:31+0000",
"expire_time" : "2024-09-09T09:09:09+0000",
"now" : "2023-12-05T16:42:06+0000",
"user_product_total" : [
{
"freeze" : 0,
"total_limit" : "UNLIMITED",
"deduction_type" : "DURATIONS",
"user_id" : "1777777777777777777",
"product_item_type" : "TRANSLATOR_BENEFIT",
"total" : 0,
"balance" : 0,
"user_product_total_id" : "1777777777777777777"
}
],
"pro" : true
},
"code" : "OK"
};

$done({body : JSON.stringify(Q)});
```

这三种写法最终得到的效果是一样的。


## 注意与更新

* 主流大厂的软件会禁止MITM，就算不禁止被发现后也可能面临巨额罚款。
* 本篇内容旨在让小白理解一些内容，促进交流学习。
* 由于JavaScript的语法和书写方式多样，我们选择自己顺手的语法即可。
* 之后会在本文基础上增加`if` `for` 类型稍复杂一点的内容。

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

