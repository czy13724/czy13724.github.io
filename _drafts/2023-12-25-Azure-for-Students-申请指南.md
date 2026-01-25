---
layout: post
title: "Azure for Students (Azure 100) 学生订阅申请与云服务入门指南"
subtitle: "大学生如何免费领取 $100 云计算额度及最佳实践"
date: 2023-12-25 17:25:06
author: "Levi"
header-img: "img/bg/image_26.jpg"
catalog: true
tags:
    - Azure
    - Microsoft
    - 学生福利
    - 云计算
---

> "Nothing can help us endure dark times better than our faith."
> "没有什么比信念更能支撑我们度过艰难的时光了。"

<div class="alert alert-info" role="alert">
  <strong>提示：</strong> 本文旨在指导在读大学生如何正规、合法地申请 Microsoft Azure 学生订阅。请务必使用您本人的真实校园身份信息，任何虚假注册行为都可能导致账户被封禁。
</div>

## 什么是 Azure for Students?

Azure for Students 是微软面向全球大学生推出的一项福利计划。验证通过后，你将获得：
*   **$100 (USD)** 的 Azure 云服务信用额度（有效期 12 个月）。
*   免费使用 **25+ 种** 常用云服务（如 Linux/Windows 虚拟机、SQL数据库、App Service 等）。
*   无需绑定信用卡（这是与 Azure 免费试用版最大的区别）。

这对于计算机专业的学生学习云计算、部署个人博客或运行小型项目来说是绝佳的资源。

---

## 申请前准备

为了顺利通过验证，你需要准备：
1.  **有效的 EDU 邮箱**：必须是学校官方分配的邮箱（如 `.edu.cn`）。
2.  **Microsoft 账号**：如果没有，可以用 EDU 邮箱注册一个。
3.  **手机号码**：用于接收短信验证码（支持中国大陆手机号）。
4.  **纯净的网络环境**：建议直接使用校园网或家庭宽带，避免使用高风险的代理 IP，否则容易因风控被拒。

---

## 详细申请流程

### 第一步：访问官网
前往 [Azure for Students 官方页面](https://azure.microsoft.com/en-us/free/students/)，点击醒目的绿色按钮 **"Start free" (免费开始)**。

![Azure for Students Landing Page]({{site.baseurl}}/img/Azure_for_Student/azure100_1.png)

### 第二步：登录与身份验证
1.  使用你的 Microsoft 账号登录。
2.  系统会跳转到 **Academic Verification (学术验证)** 页面。
3.  在验证方式中选择 **"School email address" (学校电子邮件地址)**。
4.  输入你的 EDU 邮箱，点击验证。

![Academic Verification]({{site.baseurl}}/img/Azure_for_Student/verify_student.png)

5.  登录你的 EDU 邮箱，查收来自 Microsoft 的验证邮件，点击邮件中的链接完成确认。

![Email Verification]({{site.baseurl}}/img/Azure_for_Student/verifymail.png)

> **注意**：如果学校邮箱系统拦截了邮件，请检查垃圾箱。如果多次尝试未收到，可能需要联系学校 IT 部门或尝试其他验证方式（如提供学生证扫描件，但这通常需要联系人工客服）。

### 第三步：填写个人信息
验证通过后，你需要补充个人资料：
*   **Country/Region**: 如实填写（如 China）。
*   **Phone**: 输入手机号并进行短信验证。
*   **Address**: 建议填写真实地址或学校地址。

### 第四步：签署协议
阅读《在线订阅协议》，勾选同意，最后点击 **Sign up**。

系统会进行短暂的处理（Setting up your account），你可能会看到类似下图的成功重定向提示：

![Success Redirect]({{site.baseurl}}/img/Azure_for_Student/MAV_success.png)

如果一切顺利，你将直接跳转到 Azure Portal（Azure 门户），并看到 $100 的额度已到账。

![Azure Portal Credit]({{site.baseurl}}/img/Azure_for_Student/azure100_entry.png)

---

## 如何使用你的 $100 额度？

申请成功只是第一步，如何合理规划这一百美金至关重要。

### 1. 创建虚拟机 (Virtual Machine)
这是最常用的功能。你可以创建 B1s 或 B2s 系列的 Linux 实例来托管网站、运行 Docker 或搭建开发环境。
*   **推荐配置**：Region 选择 East Asia (香港) 或 Japan East (日本) 可能延迟较低，但近期这两个区域资源紧张，US West (美国西部) 通常更稳定。
*   **成本控制**：B1s 实例每月仅需几美元，非常划算。

### 2. 免费服务 (Always Free)
Azure 提供了许多永久免费的服务（在额度用完后依然免费），包括：
*   **Azure App Service** (F1 Free Tier): 适合托管简单的 Web 应用。
*   **Azure Cosmos DB**: 每月 1000 请求单位。
*   **Bandwidth**: 每月前 15GB 数据传出免费。

### 3. 避免扣费陷阱
*   **未使用的资源及时删除**：虚拟机如果确实不用了，记得 **Delete** 而不仅仅是 Stop（存储磁盘依然会扣费）。
*   **关注额度有效期**：$100 额度有效期为一年。一年后，如果你的学生身份依然有效，可以申请续期（Renew），再次获得 $100。

---

## 常见问题 (FAQ)

**Q: 提示 "你没资格 (You're not eligible)" 怎么办？**

![Not Eligible Error]({{site.baseurl}}/img/Azure_for_Student/noeligible.png)

A:
1.  确认你的 EDU 邮箱是否在微软的白名单内。
2.  检查是否开启了代理工具，尝试关闭代理并在无痕模式下重试。
3.  该手机号或设备是否之前已经注册过。

**Q: 需要信用卡吗？**
A: **Azure for Students** 计划明确不需要信用卡。如果你看到的页面要求绑定卡，说明你进错了入口（可能进成了 Azure Free Trial）。请确保通过学生专属入口进入。

**Q: 额度用完了会发生什么？**
A: 你的订阅会被禁用（Disabled），服务停止运行。除非你手动升级到“即用即付”订阅并绑定信用卡，否则微软**不会**自动扣你的钱。

---

## 免责声明

<div class="well">
    <ul>
        <li>本文仅作为技术教程，旨在帮助学生利用微软提供的教育资源进行学习。</li>
        <li>严禁利用学生订阅从事挖矿、攻击行为或转售账号，这严重违反 Azure 服务条款，会导致账号及关联的学校域名被封禁。</li>
        <li>所有权益细则以 Microsoft 官方最新政策为准。</li>
    </ul>
</div>
