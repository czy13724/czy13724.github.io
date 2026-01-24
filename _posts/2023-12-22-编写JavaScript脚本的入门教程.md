---
layout: post
title: "JavaScript 网络流量分析与调试入门：从抓包到脚本编写"
subtitle: "掌握 Quantumult X / Surge 脚本编写，实现 API 数据 Mock 与调试"
date: 2023-12-22 15:45:09
author: "Levi"
header-img: "img/bg/image_23.jpg"
catalog: true
tags:
    - JavaScript
    - 网络调试
    - 教程
    - 抓包
---

> "Act enthusiastic and you will be enthusiastic."
> "带着激情做事，你就会有激情。"

<div class="alert alert-info" role="alert">
  <strong>学习目标：</strong> 本教程将带你理解移动端网络调试工具（如 Quantumult X, Surge, Loon）的脚本工作原理。你将学会如何通过 JavaScript 拦截并修改 HTTP 响应（Response），用于前端开发调试、数据 Mock 或 UI 优化。
</div>

## 前言：为什么要编写脚本？

在移动端开发或测试过程中，我们经常需要模拟各种 API 响应场景（例如：测试服务器返回 500 错误时 APP 的表现，或测试特定数据字段为空时的 UI 布局）。传统的做法是让后端配合修改数据，而通过**中间人攻击 (MITM)** 技术配合 **JavaScript 脚本**，我们可以在本地直接修改服务器返回的数据，极大提高调试效率。

本文以 Quantumult X 为例，但所讲的 JavaScript 逻辑通用，同样适用于 Surge, Loon, Stash 等工具。

---

## 第一阶段：核心概念与准备

在开始写代码前，你需要理解三个关键概念：

### 1. 抓包 (Packet Capture)
要想修改数据，首先得能看到数据。你需要开启抓包工具的 **MITM (Man-in-the-Middle)** 功能，并安装信任 CA 证书。这允许工具解密 HTTPS 流量，查看 Request（请求）和 Response（响应）的明文内容。

### 2. 重写 (Rewrite)
这是“拦截”的规则。我们需要告诉工具：“当遇到 URL 包含 `api.example.com/user` 的请求时，不要直接把服务器的数据给 APP，先交给我的脚本处理一下。”

在 Quantumult X 中，这在 `[rewrite_local]` 模块配置：
```conf
# 匹配规则 匹配类型 脚本路径
^https:\/\/api\.example\.com\/user\/info url script-response-body local_script.js
```

### 3. MITM 主机名
为了让工具知道解密哪些域名的流量，必须在 `[mitm]` 模块声明域名：
```conf
[mitm]
hostname = api.example.com
```

---

## 第二阶段：JavaScript 脚本编写指南

脚本的核心逻辑非常简单：**获取数据 -> 修改数据 -> 返回数据**。

### 1. 获取响应体 ($response.body)
脚本执行时，环境会提供一个 `$response` 对象，其中 `$response.body` 就是服务器返回的原始数据（通常是 JSON 字符串）。

### 2. 解析 JSON (JSON.parse)
字符串无法直接修改字段，我们需要把它转换成 JavaScript 对象。

```javascript
// 声明 obj 变量，解析服务器返回的 JSON 字符串
let obj = JSON.parse($response.body);
```

### 3. 修改数据 (Object Manipulation)
现在 `obj` 是一个标准的 JS 对象，你可以像操作普通变量一样修改它。

```javascript
// 假设原数据是 { "username": "User1", "level": 1 }
// 我们想在本地把它改成 Level 99 来测试 UI 显示
obj.level = 99;
obj.username = "Debug Mode";
```

### 4. 重新打包 (JSON.stringify)
修改完成后，需要将对象转回字符串，并发送给 APP。

```javascript
// 将对象转回 JSON 字符串
let body = JSON.stringify(obj);

// 结束脚本，返回修改后的数据
$done({ body });
```

---

## 第三阶段：实战演练

### 案例一：Mock 天气数据（修改简单的 JSON）

假设某天气 APP 的 API 返回如下数据：
```json
{
  "city": "Beijing",
  "temp": 15,
  "weather": "Sunny"
}
```
我们想测试当温度显示为 -100 度时，UI 是否会崩坏。

**脚本编写 (`mock_weather.js`)**：

```javascript
// 1. 解析数据
let obj = JSON.parse($response.body);

// 2. 修改数据
obj.temp = -100;
obj.weather = "极寒风暴 (Debug)";

// 3. 输出日志 (方便在工具日志中调试)
console.log("已修改天气数据: " + obj.temp);

// 4. 返回数据
$done({body: JSON.stringify(obj)});
```

### 案例二：精简冗余信息（数组过滤器）

很多 APP 的启动页接口会返回一个包含广告的数组。我们可以通过脚本将这些无效数据过滤掉，净化网络环境。

假设 API 返回：
```json
{
  "items": [
    { "type": "content", "title": "正常新闻" },
    { "type": "ad", "title": "这是一个广告" },
    { "type": "content", "title": "正常新闻2" }
  ]
}
```

**脚本编写 (`filter_ads.js`)**：

```javascript
let obj = JSON.parse($response.body);

// 使用 array.filter 方法，只保留 type 不等于 'ad' 的项目
if (obj.items && obj.items.length > 0) {
    obj.items = obj.items.filter(item => item.type !== 'ad');
}

$done({body: JSON.stringify(obj)});
```

---

## 第四阶段：常见问题与技巧

### 1. `var`, `let`, `const` 怎么选？
*   **const**: 如果这个变量定义后不需要再修改（比如 `path`），优先用 const。
*   **let**: 如果变量需要重新赋值（比如 `body`），用 let。
*   **var**: 老旧语法，虽然通用但存在作用域问题，现代 JavaScript 开发**不推荐**使用。

### 2. 为什么脚本不生效？
*   **MITM 未开启**: 检查证书是否信任。
*   **Hostname 未添加**: 检查 `[mitm]` 列表是否包含目标域名。
*   **正则错误**: 检查 `[rewrite_local]` 的正则是否能匹配到 URL。
*   **缓存问题**: 很多 APP 有本地缓存，尝试卸载重装或清除缓存。

### 3. 如何调试？
使用 `console.log()` 是最有效的方法。
```javascript
console.log("原始数据: " + $response.body);
```
在 Quantumult X 或 Surge 的脚本日志管理器中查看输出，确认脚本是否被执行以及数据结构是否符合预期。

---

## 免责声明

<div class="well">
    <p>本项目提供的教程仅用于 Web 开发调试、数据 Mock 测试及技术学习交流。</p>
    <ul>
        <li>请勿利用脚本技术进行非法抓取、破解软件会员或绕过身份验证。</li>
        <li>修改特定 APP 的数据流可能违反其服务条款，风险由用户自行承担。</li>
        <li>文中涉及的代码逻辑均为通用 JavaScript 语法，不针对任何特定软件。</li>
    </ul>
</div>