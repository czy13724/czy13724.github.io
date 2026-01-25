---
layout: post
title: "Oracle Cloud (甲骨文云) 避坑指南：如何最大化利用 Always Free 免费层"
subtitle: "从实例创建到 Docker 部署：打造永久免费的高性能个人服务器"
date: 2023-05-13 12:00:00
author: "Levi"
header-img: "img/bg/image_31.jpg"
catalog: true
tags:
    - Oracle Cloud
    - VPS
    - Server
    - Docker
---

> "The best things in life are free."  
> "生活中最美好的事物往往是免费的。"

Oracle Cloud (OCI) 的 "Always Free" 计划因其慷慨的配置（4核 ARM CPU + 24GB 内存）而闻名于开发者圈子。然而，许多新手在申请和维护过程中由于不了解规则，导致账号被封或实例被回收。

本文将分享如何正规、长期地使用甲骨文云服务器来托管你的个人项目。

## 1. 什么是 Always Free？

Oracle 提供两类免费资源，如果你能抢到 ARM 资源，由于其性能强悍，甚至可以跑中型应用：
*   **AMD 实例**：2个 VM.Standard.E2.1.Micro 实例（1/8 OCPU, 1GB RAM）。适合跑简单的 VPN 或静态网页。
*   **ARM 实例 (Ampere)**：前 3000 OCPU 小时和 18000 GB 小时内存是免费的。这意味着你可以创建一个 **4 OCPU + 24GB RAM** 的怪兽级实例。
*   **存储**：总共 200GB 的块存储。

## 2. 避免封号与回收的核心原则

很多用户的账号莫名被封，大多是因为触犯了风控机制。

### ❌ 危险操作 (绝对禁止)
1.  **闲置回收**：Oracle 会回收长期闲置（CPU 占用低于 10%）的计算实例。
    *   *错误做法*：运行“挖矿脚本”或“死循环脚本”来伪造 CPU 占用。这是严重的违规行为（Abuse），会导致直接封号。
    *   *正确做法*：**部署真实的服务**。比如运行一个 Docker 容器，托管你的个人博客、RSS 阅读器 (FreshRSS) 或密码管理器 (Bitwarden)。真实的业务流量才是保活的最佳方式。
2.  **网络滥用**：不要进行 BT 下载、扫描端口或对外发起攻击。
3.  **虚假信息**：注册时必须使用真实的信用卡和地址信息。

## 3. 实战：部署 Docker 容器环境

拿到服务器后的第一件事，推荐安装 Docker。它能帮你快速部署应用，且容器本身会有一定的资源占用，有助于维持实例活跃。

### 步骤 1：更新系统与安装 Docker
```bash
# 更新软件源
sudo apt update && sudo apt upgrade -y

# 使用官方脚本一键安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 将当前用户加入 docker 组 (免 sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 步骤 2：部署 Portainer (可视化面板)
Portainer 是一个轻量级的 Docker 管理面板，非常适合新手。

```bash
docker run -d -p 8000:8000 -p 9000:9000 \
    --name=portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce
```
访问 `http://<你的IP>:9000`，设置管理员密码，你就有了一个可视化的控制台。

## 4. 推荐托管的合法服务

为了让服务器“动”起来，你可以部署以下服务：

1.  **Uptime Kuma**：一个精美的服务器监控工具，可以监控你其他网站的状态。
2.  **Halo / WordPress**：搭建个人博客。
3.  **Alist**：作为网盘文件列表程序。
4.  **Memos**：一个隐私优先的轻量级笔记服务。

## 5. 网络安全配置 (防火墙)

Oracle Cloud 默认的防火墙非常严格。除了在云控制台 (Security List) 开放端口外，别忘了 Linux 系统内部的防火墙 (`iptables` 或 `netfilter`)。

Ubuntu 系统默认使用 `iptables` 规则，建议安装 `ufw` 简化管理：

```bash
# 允许 SSH
sudo ufw allow 22/tcp
# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# 允许 Portainer 面板
sudo ufw allow 9000/tcp

# 启用防火墙
sudo ufw enable
```

## 总结

Oracle Cloud 的高配免费机是极好的学习资源，而非薅羊毛的工具。只要你遵守规则，用真实的业务去填充它，它就能稳定运行数年。

**拒绝脚本滥用，拥抱技术价值。**
