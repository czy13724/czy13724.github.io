---
layout: post
title: "OpenClaw 对接 Telegram 机器人：从 BotFather 到可用会话"
subtitle: "基于官方 Telegram 渠道文档，完成配置、连通性验证与常见故障排查"
date: 2026-02-25 20:40:00
author: "Levi"
header-img: "img/bg/image_20.jpg"
catalog: true
tags:
    - AI
    - OpenClaw
    - Telegram
    - 机器人
---

Telegram 通常是 OpenClaw 最容易跑通的渠道之一。
这篇文章专注于“可用链路”，从 token 到会话验证一步一步来。

![OpenClaw Telegram Channel Doc]({{ site.baseurl }}/img/openclaw/openclaw-telegram-og.png)
*图：OpenClaw 官方 Telegram 渠道文档页面头图。*

## 1. 先准备 Telegram Bot

1. 在 Telegram 中找到 `@BotFather`
2. 创建 bot 并拿到 Bot Token
3. 把 bot 拉进目标群（如果你要测试群消息）

## 2. 在 OpenClaw 中完成配置

最省心的方式是走官方 onboarding：

```bash
openclaw onboard
```

在向导里选择 Telegram，并填入 token/渠道配置。

如果你已经有现成环境，也可以通过 `openclaw configure` 调整渠道配置后重启网关。

## 3. 验证是否接入成功

```bash
openclaw channels status --probe
openclaw logs --follow
```

再用 CLI 发一条测试消息（官方示例）：

```bash
openclaw message send --channel telegram --target 123456789 --message "hi"
```

也支持用户名目标：

```bash
openclaw message send --channel telegram --target @name --message "hi"
```

## 4. 群消息不触发的典型原因

官方文档给出的高频问题是：

- 配置期望 bot 读取非 @mention 群消息
- 但 BotFather 隐私模式未关闭

处理方法：

1. 在 BotFather 执行 `/setprivacy`，关闭隐私
2. 把 bot 移出群再重新拉入
3. 再跑一次 `openclaw channels status --probe`

## 5. 安全建议

1. token 不要写进公开仓库。
2. 默认启用配对/白名单策略，避免陌生人直接驱动你的助手。
3. 先在私聊跑通，再扩到群。

## 6. 配对与审批（强烈建议开启）

如果你开启了配对（pairing），新用户首次发起会话需要审批。
常用命令：

```bash
openclaw pairings list --status pending
openclaw pairings approve <pairing-id>
```

这样可以显著降低陌生人触发高权限动作的风险。

## 总结

Telegram 渠道的核心是：
配置正确 + 群权限正确 + 状态探测通过。

只要这三步到位，后续做命令、投票、自动化动作会顺很多。

## 参考链接

- Telegram 渠道文档：https://docs.openclaw.ai/channels/telegram
- Channels 总览：https://docs.openclaw.ai/channels/index
- Pairing 机制：https://docs.openclaw.ai/channels/pairing

## 延伸阅读

- [OpenClaw 跨平台安装实战]({{ site.baseurl }}/2026/02/24/openclaw-install-windows-linux-macos/)
- [OpenClaw 对接 Discord 机器人]({{ site.baseurl }}/2026/02/26/openclaw-discord-bot-integration/)
- [OpenClaw 对接飞书机器人]({{ site.baseurl }}/2026/02/27/openclaw-feishu-bot-integration/)
