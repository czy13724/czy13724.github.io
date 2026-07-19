---
title: "OpenClaw 对接 Discord 机器人：Developer Portal 配置全流程"
published: 2026-02-26
description: "从应用创建、权限和 intents 到 OpenClaw 接入与排错"
tags: ["AI", "OpenClaw", "Discord", "机器人"]
category: "AI"
---

Discord 接入步骤比 Telegram 多一些，关键在 Developer Portal 权限配置。
这篇文章按官方文档把“最容易漏掉的点”写全。

![OpenClaw Discord Channel Doc](/img/openclaw/openclaw-discord-og.png)
*图：OpenClaw 官方 Discord 渠道文档页面头图。*

## 1. 在 Discord Developer Portal 创建应用

1. New Application
2. 添加 Bot
3. 复制 Bot Token（妥善保管）

## 2. 开启必要 Intents

在 Bot 设置页开启：

- Message Content Intent（必需）
- Server Members Intent（推荐）
- Presence Intent（可选）

## 3. 生成邀请链接并拉入服务器

OAuth2 URL Generator 至少勾选：

- `bot`
- `applications.commands`

常用基础权限：

- View Channels
- Send Messages
- Read Message History
- Embed Links
- Attach Files

不要直接给 `Administrator`，除非你非常确定风险。

## 4. 拿到 IDs（用于配置与审计）

在 Discord 客户端开启 Developer Mode 后复制：

- server ID
- channel ID（可选）
- user ID

官方建议在 OpenClaw 配置中优先使用数字 ID，审计更稳定。

## 5. OpenClaw 侧接入

建议用 onboarding/configure 完成 token + 路由配置：

```bash
openclaw onboard
# 或
openclaw configure
```

接入后检查：

```bash
openclaw channels status --probe
openclaw logs --follow
```

## 6. 常见故障

1. bot 在线但不回复：多半是 intents 或权限缺失。
2. 命令可见但执行失败：常见是 OpenClaw 侧授权/allowlist 拒绝。
3. 群里可用私信不可用：检查“允许来自服务器成员私信”及策略配置。
4. 提示插件不可用：按官方渠道页提示，执行 `openclaw channels status --probe` 看具体缺失项。

## 7. 安全与运行建议

- 把 token 放在受控配置中，不入库。
- 默认保持命令鉴权打开。
- 先在单个测试频道灰度，再扩到全服务器。

## 总结

Discord 接入的核心不是“步骤多”，而是“权限要对齐”。
把 intents、scope、bot 权限和 OpenClaw 授权策略对齐后，运行会非常稳定。

## 参考链接

- Discord 渠道文档：https://docs.openclaw.ai/channels/discord
- Slash Commands：https://docs.openclaw.ai/slash-commands
- Channels 总览：https://docs.openclaw.ai/channels/index

## 延伸阅读

- [OpenClaw 跨平台安装实战](/2026/02/24/openclaw-install-windows-linux-macos/)
- [OpenClaw 对接 Telegram 机器人](/2026/02/25/openclaw-telegram-bot-integration/)
- [OpenClaw 对接飞书机器人](/2026/02/27/openclaw-feishu-bot-integration/)
