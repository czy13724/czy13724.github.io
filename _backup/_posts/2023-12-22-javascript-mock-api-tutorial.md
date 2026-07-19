---
layout: post
title: "前端开发实战：如何使用 Charles 脚本进行 API 数据 Mock"
subtitle: "告别后端依赖，利用本地代理工具自行构造测试场景"
date: 2023-12-22 15:45:09
author: "Levi"
header-img: "img/bg/image_23.jpg"
catalog: true
tags:
    - JavaScript
    - 前端开发
    - API调试
    - Mock
---

> "Quality is not an act, it is a habit."  
> "质量不是一种行为，而是一种习惯。"

<div class="alert alert-info" role="alert">
  <strong>面向人群：</strong> 本文主要面向 Web 前端和移动端开发者。你将学习如何配合抓包工具（如 Charles 或 Fiddler），利用简单的脚本逻辑，在本地拦截并修改服务器响应，从而高效地测试 App 或网页的 UI 表现。
</div>

## 前言：前端开发的痛点

在项目开发过程中，前后端通常是并行开发的。但我们经常遭遇以下尴尬：
1.  **后端接口未就绪**：后端还在写 CRUD，前端页面已经切好了，却只能填假数据。
2.  **异常场景难复现**：想自测“服务器返回空列表”或“超长文本截断”，需要后端配合改库，非常麻烦。
3.  **数据覆盖不全**：测试环境造数据成本高，甚至还需要删库重跑。

这时，**本地 Mock** 技术就派上用场了。通过在网络层拦截请求，我们可以运行一段简单的代码来实时修改 Response（响应体），让客户端以为服务器返回了我们要的数据。

---

## 核心原理：中间人 (MITM) 脚本

大多数专业的网络调试工具（如 Charles, Fiddler, Proxyman）都支持 **Scripting (脚本)** 功能。

流程如下：
1.  **拦截 (Intercept)**：工具捕获特定的 URL 请求（例如 `api.myapp.com/user`）。
2.  **执行 (Execute)**：工具运行你编写的 `.js` 脚本。
3.  **篡改 (Modify)**：脚本读取原始 Response JSON，修改特定字段。
4.  **返回 (Return)**：客户端接收到修改后的数据。

---

## JavaScript 脚本编写实战

脚本的核心逻辑通常分为三步：`Parse` (解析) -> `Modify` (修改) -> `Stringify` (重组)。

### 场景一：Mock 长文本 (测试 UI 布局)

假设后端返回的标准用户信息如下：
```json
{
  "id": 101,
  "nickname": "Levi",
  "bio": "Frontend Developer"
}
```

我们需要测试当用户昵称特别长时，UI 是否会正确换行或显示省略号。

**脚本代码示例**：

```javascript
// 1. 获取原始响应体
// 大多数工具会将响应体暴露为 response.body 或类似变量
let obj = JSON.parse($response.body);

// 2. 修改数据：注入超长文本，测试边界情况
obj.nickname = "这是一段非常非常长的测试文本，用于验证 UI 组件在极端情况下的布局表现是否正常";

// 3. 重组并返回
// 将修改后的对象转回字符串
$done({ body: JSON.stringify(obj) });
```

### 场景二：模拟服务器错误 (测试健壮性)

App 需要能够优雅地处理服务器报错（如 500 错误或网络超时）。我们可以编写脚本，强制把正常的成功响应改为错误信息。

**脚本代码示例**：

```javascript
// 注意：这次我们不解析原数据，直接构造错误响应

let errorResponse = {
    "code": 500,
    "status": "error",
    "message": "Internal Server Error: 模拟服务器内部错误"
};

$done({ 
    status: 500, // 修改 HTTP 状态码
    body: JSON.stringify(errorResponse) 
});
```

---

## 进阶技巧：条件断点与随机化

为了测试更真实的场景，我们可以引入随机逻辑，模拟不稳定的数据返回。

```javascript
let obj = JSON.parse($response.body);

// 随机生成 50% 的概率让列表为空，测试“空状态”页面 (Empty State)
if (Math.random() > 0.5) {
    obj.data_list = []; 
}

console.log("当前 Mock 状态: " + (obj.data_list.length === 0 ? "空列表" : "有数据"));

$done({ body: JSON.stringify(obj) });
```

---

## 最佳实践与注意事项

1.  **异常捕获**：在解析 JSON 时最好包裹在 `try-catch` 块中，防止原始数据解析失败导致脚本报错。
    ```javascript
    try {
        let obj = JSON.parse($response.body);
        // ... modifications
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("JSON Parse Error: " + e);
        $done({}); // 保持原状
    }
    ```
2.  **仅用于开发自测**：此类脚本仅应在本地开发环境或测试环境使用，严禁用于生产环境或恶意攻击。
3.  **仅处理已授权流量**：请确保你拦截和调试的是自己负责的应用、测试域名或已获得授权的接口，不要触碰第三方未授权系统。
4.  **避免真实用户数据**：调试环境应尽量使用脱敏数据，避免在脚本、日志或截图中暴露手机号、邮箱、Token 等敏感信息。

## 总结

掌握基于脚本的网络层 Mock 技术，能极大减少前端开发对后端的依赖。你不需要等待后端部署，也不需要求人改数据，几行代码就能构建出你想要的任何测试场景，大幅提升开发效率。

Happy Coding!
