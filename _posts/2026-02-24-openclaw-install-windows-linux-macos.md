---
layout: post
title: "OpenClaw 跨平台安装实战：Windows / Linux / macOS 一次讲清"
subtitle: "按官方推荐路径完成安装、网关启动与基础健康检查，避免第一步就卡住"
date: 2026-02-24 20:30:00
author: "Levi"
header-img: "img/bg/image_21.jpg"
catalog: true
tags:
    - AI
    - OpenClaw
    - 安装
    - 教程
---

如果你想长期用 OpenClaw，第一步不是“先接一堆渠道”，而是把网关基础跑稳。
本文按官方文档给出跨平台安装路径，并覆盖 Windows、Linux、macOS 的差异点。

![OpenClaw Install Overview]({{ site.baseurl }}/img/openclaw/openclaw-install-og.png)
*图：OpenClaw 官方安装文档页面头图（Install overview）。*

## 1. 安装前准备

根据官方安装页，基础要求是：

- Node.js 22+
- macOS / Linux / Windows（Windows 推荐 WSL2）

官方推荐安装器会自动处理 Node 检测、CLI 安装和 onboarding。

## 2. macOS / Linux / WSL2 安装

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你跳过了 onboarding，可手动执行：

```bash
openclaw onboard --install-daemon
```

## 3. Windows 安装（PowerShell）

官方中文文档给出的 PowerShell 安装方式：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

注意：官方也建议在 Windows 上优先使用 WSL2 运行 Gateway，稳定性通常更好。

## 4. 安装后第一轮校验

建议依次检查：

```bash
openclaw gateway status
openclaw channels status --probe
openclaw logs --follow
```

如果你只想先验证基础链路，可先不接任何外部渠道，只看网关状态和日志是否正常。

## 5. 常见问题与修复

## 5.1 `openclaw: command not found`

多见于 PATH 没包含 npm 全局安装路径。

快速诊断：

```bash
node -v
npm -v
npm prefix -g
```

macOS/Linux 常见修复：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

## 5.2 Linux 网关“退出后就停了”

Linux/WSL2 常见是 systemd user service 在登出后停止。

可按官方建议启用 lingering：

```bash
sudo loginctl enable-linger $USER
```

## 5.3 一上来就公网暴露端口

默认网关是本地回环地址，保持这个默认更安全。
如果要远程访问，建议优先用 SSH 隧道或内网组网工具，而不是直接裸露公网端口。

## 6. 下一步建议

安装完成后，不要同时接多个渠道。
推荐顺序：

1. 先接 Telegram（通常最容易）
2. 再接 Discord
3. 最后再接插件渠道（如飞书）

这样排错成本最低。

## 7. 云平台部署怎么选（官方文档汇总）

如果你不想本机常驻，也可以直接上云。按官方文档，常见路线：

1. Railway（最快上手）
- 一键模板 + 浏览器 `/setup` 向导
- 关键点：挂载 `/data` 持久卷，否则重部署会丢状态

2. Render（更偏 IaC）
- 官方提供 `render.yaml` Blueprint
- 关键变量：`SETUP_PASSWORD`、`OPENCLAW_STATE_DIR`、`OPENCLAW_WORKSPACE_DIR`
- 免费层会休眠且无持久盘，适合演示不适合长期生产

3. Fly.io（可做私有化硬化）
- 适合需要更细粒度网络控制的人
- 官方有 private 模式（无公网 IP），安全性更高

4. VPS（通用）
- 官方 VPS hub 汇总了 Hetzner/GCP/Oracle/Fly/Railway 等路线
- 自由度最高，但需要你自己管监控、更新和备份

选择建议：
- 想最快体验：Railway
- 想声明式管理：Render
- 想做网络硬化：Fly.io private
- 想完全可控：VPS

## 总结

OpenClaw 的安装不复杂，难点在于“系统差异 + 运行方式 + 安全边界”。
把网关和日志先跑稳，再做渠道接入，你后面的效率会高很多。

## 参考链接

- 安装（中文）：https://docs.openclaw.ai/zh-CN/install/index
- 安装（英文）：https://docs.openclaw.ai/install/index
- 平台说明（中文）：https://docs.openclaw.ai/zh-CN/platforms
- Railway 部署：https://docs.openclaw.ai/install/railway
- Render 部署：https://docs.openclaw.ai/install/render
- Fly.io 部署：https://docs.openclaw.ai/install/fly
- VPS 总览：https://docs.openclaw.ai/vps

## 延伸阅读

- [OpenClaw 部署平台选择指南]({{ site.baseurl }}/2026/02/28/openclaw-deploy-platforms-comparison/)
- [OpenClaw 对接 Telegram 机器人]({{ site.baseurl }}/2026/02/25/openclaw-telegram-bot-integration/)
- [OpenClaw 对接 Discord 机器人]({{ site.baseurl }}/2026/02/26/openclaw-discord-bot-integration/)
- [OpenClaw 对接飞书机器人]({{ site.baseurl }}/2026/02/27/openclaw-feishu-bot-integration/)
