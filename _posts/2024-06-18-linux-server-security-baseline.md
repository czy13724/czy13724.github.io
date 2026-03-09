---
layout: post
title: "Linux 服务器安全基线实战：新机上线前必须完成的 12 项加固"
subtitle: "从账户、SSH、防火墙到日志审计，给个人站长一份可直接执行的上线清单"
date: 2024-06-18 20:30:00
author: "Levi"
header-img: "img/bg/image_33.jpg"
catalog: true
tags:
    - Linux
    - Security
    - 运维
    - 教程
---

刚买 VPS 时，很多人第一步是“装应用”，但正确顺序应该是“先加固，再上线”。
本文给你一份我自己长期使用的安全基线，适合个人博客、API 小服务、HomeLab 公网入口。

## 1. 账号与权限

1. 新建普通运维用户，禁用 `root` 直连。
2. 给运维用户最小化 sudo 权限。
3. 删除不必要系统账户，关闭无用登录 shell。

```bash
adduser levi
usermod -aG sudo levi
passwd -l root
```

## 2. SSH 最小暴露面

编辑 `/etc/ssh/sshd_config`：

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
MaxAuthTries 3
LoginGraceTime 20
```

重启前务必开一个新终端测试，确认密钥可登录，再执行：

```bash
sudo systemctl restart sshd
```

## 3. 防火墙白名单

默认拒绝入站，只放行必要端口（如 22/80/443）。

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 4. 自动安全更新

- Debian/Ubuntu：启用 `unattended-upgrades`
- RHEL 系：启用 dnf 自动更新策略

核心目的是降低“已知漏洞窗口期”。

## 5. 登录失败防护

安装 Fail2ban，拦截暴力破解来源 IP。

```bash
sudo apt install fail2ban -y
sudo systemctl enable --now fail2ban
```

建议至少启用 `sshd` jail，并设置合理封禁时长。

## 6. 服务最小化

执行一次服务盘点：

```bash
sudo ss -tulpen
sudo systemctl list-unit-files --type=service
```

任何你“不知道为何存在”的公网监听端口，都应先停用再确认。

## 7. 日志与审计

至少保证：

- SSH 登录日志可追踪
- sudo 操作可追踪
- 系统日志按周期轮转

建议保留最近 30-90 天安全日志，便于追溯异常。

## 8. 备份与恢复演练

安全不只是“防入侵”，也包括“可恢复”。

- 配置每日快照或异地备份
- 每月至少做一次恢复演练
- 备份内容包含站点、数据库、证书、关键配置

## 常见错误

1. 先关密码登录，后配密钥，导致自己被锁在门外。
2. 防火墙规则一次性改太多，误封 22 端口。
3. 只做备份，不做恢复验证。

## 总结

把基线做完再部署业务，你的服务器抗风险能力会提升一个量级。
对于个人站点，这 12 项已经能覆盖绝大多数常见攻击面。

## 延伸阅读

- [SSH 密钥安全指南]({{ site.baseurl }}/2025/11/05/ssh-key-security/)
- [Nginx 502/504 排错指南]({{ site.baseurl }}/2025/06/28/nginx-502-504-troubleshooting/)
- [Uptime Kuma 监控实战]({{ site.baseurl }}/2025/05/21/self-hosted-monitoring-uptime-kuma-guide/)
