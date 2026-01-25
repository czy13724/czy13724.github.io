---
layout: post
title: "SSH 密钥安全指南：五步防止服务器被黑"
subtitle: "扔掉密码登录！打造银行级的 Linux 登录防线"
date: 2025-11-05 14:00:00
author: "Levi"
header-img: "img/bg/image_40.jpg"
catalog: true
tags:
    - Linux
    - Security
    - SSH
    - Server
---

任何一台暴露在公网的 Linux 服务器，每天都会遭受成千上万次的暴力破解攻击。如果你还在使用 `root` 密码登录，那你就像是把家门钥匙放在了门口地垫下。

本文将教你通过配置 SSH 密钥对，彻底关闭密码登录入口，让黑客无门可入。

## 1. 原理：为什么密钥比密码安全？

*   **密码**：也就是 "Something you know"。可能被猜解、被字典甚至被中间人拦截。
*   **私钥**：也就是 "Something you have"。使用非对称加密算法（如 Ed25519 或 RSA）。只有拥有私钥文件的人才能解开服务器发来的挑战码。

## 2. 生成高强度密钥对 (Ed25519)

虽然 RSA 是老牌标准，但在 2026 年，推荐使用更短、更快且更安全的 **Ed25519** 算法。

在你的本机（Mac/Windows）终端运行：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
*   这会生成 `id_ed25519` (私钥，严禁泄露) 和 `id_ed25519.pub` (公钥)。
*   **强烈建议** 设置 passphrase（密钥密码），这样即使私钥文件被偷，没有密码也无法使用。

## 3. 将公钥部署到服务器

使用 `ssh-copy-id` 命令是最简单的方法：
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server_ip
```
如果手动配置，就是将公钥内容追加到服务器的 `~/.ssh/authorized_keys` 文件中。

## 4. 关键：禁用密码登录

上传完公钥并确认能成功登录后，必须**禁止密码登录**，否则以上工作白做。

编辑服务器的 `/etc/ssh/sshd_config`：

```bash
# 禁用 root 用户登录 (可选，建议)
PermitRootLogin no

# 禁用密码认证 (必须)
PasswordAuthentication no

# 禁用空密码
PermitEmptyPasswords no

# 启用公钥认证
PubkeyAuthentication yes
```

重启 SSH 服务：
```bash
sudo service ssh restart
```

sudo service ssh restart
```

### ⚠️ 关键安全警告 (保命技巧)

在执行 `restart` 重启 SSH 服务之前，**千万不要关闭当前的终端窗口！**
请新开一个终端窗口尝试连接服务器。
*   **如果成功**：恭喜，配置完成。
*   **如果失败**：你还有救！在原来的窗口中把 `sshd_config` 改回去并再次重启服务。

如果全关了且连不上，你只能去云服务商的网页控制台（VNC/Console）救急了。

## 5. 进阶防护

为了固若金汤，你还可以：
1.  **修改默认端口**：将 SSH 端口从 22 改为不常用的（如 22222），能过滤掉 99% 的脚本扫描。
2.  **Fail2Ban**：安装 Fail2Ban 软件，当检测到有人连续 N 次尝试登录失败时，自动在防火墙层面拉黑其 IP。

## 总结

安全没有绝对，只有成本。通过配置 SSH 密钥+禁用密码，我们将攻击者的破解成本从“跑字典”提升到了“攻破加密算法”的天文数字级别。这是每个服务器管理员的基本素养。
