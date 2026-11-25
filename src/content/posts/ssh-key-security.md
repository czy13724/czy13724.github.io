---
title: "SSH 密钥认证与登录加固实战：从生成 Ed25519 到防锁死验收"
published: 2025-11-05
updated: 2026-11-25
description: "通过 drop-in 配置、双终端热加载验证与 Fail2Ban 加固 Linux SSH，彻底关闭密码暴力破解入口并规避 cloud-init 覆盖与锁死风险。"
tags: ["Linux", "SSH", "安全加固", "运维"]
category: "Linux"
---

## 复盘背景

把公网 VPS 跑起来后的第一天，`/var/log/auth.log` 里几乎每分钟都会出现来自世界各地的 `Failed password for root` 爆破日志。以前图省事直接照着网上教程改 `/etc/ssh/sshd_config`，结果踩过两次坑：一次是 Ubuntu 云主机重装后忘了 `/etc/ssh/sshd_config.d/50-cloud-init.conf` 会覆盖主配置里的 `PasswordAuthentication no`，以为关掉了密码登录，其实门还敞开着；另一次是在 Ubuntu 24.04 上直接改了 `Port` 并重启 `ssh.service`，却没留意 `ssh.socket` 还在监听 22 端口。

把这篇旧笔记重构成一套完整的上线加固 SOP，目标只有一个：**一次配对、零锁死风险、可命令验证**。

## 前置条件与输入参数

- **本地终端**：macOS / Linux（OpenSSH 8.0+）或 Windows 11（内置 OpenSSH Client）。
- **目标主机**：Ubuntu 22.04 / 24.04 或 Debian 12，具备一个已创建且拥有 `sudo` 权限的非 root 运维账号（示例使用 `ops`）。
- **示例参数**：
  - 服务端公网地址：`203.0.113.10` 或 `bastion.example.com`
  - 自定义 SSH 端口：`22222`
  - 本地密钥文件：`~/.ssh/id_ed25519_prod`

## 操作步骤（SOP）

### 1. 在本地生成 Ed25519 密钥对并配置 Host 别名

```bash
ssh-keygen -t ed25519 -a 64 -C "ops@example.com" -f ~/.ssh/id_ed25519_prod
chmod 600 ~/.ssh/id_ed25519_prod
chmod 644 ~/.ssh/id_ed25519_prod.pub
```

生成时务必设置高强度 passphrase，避免私钥文件意外泄露后被直接使用。接着在 `~/.ssh/config` 中添加别名，减少后续命令拼写失误：

```text
Host prod-web
    HostName bastion.example.com
    User ops
    Port 22
    IdentityFile ~/.ssh/id_ed25519_prod
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

### 2. 上传公钥并锁定 `authorized_keys` 权限

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_prod.pub -p 22 ops@bastion.example.com
```

如果目标环境未提供 `ssh-copy-id`（例如部分救援控制台），手动登录服务器后执行：

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys <<'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyMaterialHere ops@example.com
EOF
chmod 600 ~/.ssh/authorized_keys
```

在禁用密码前，先用新参数显式测试密钥登录：

```bash
ssh -o PubkeyAuthentication=yes -o PasswordAuthentication=no -i ~/.ssh/id_ed25519_prod ops@bastion.example.com
```

### 3. 通过 drop-in 文件写入加固配置（防止被 cloud-init 覆盖）

现代 Debian / Ubuntu 在 `/etc/ssh/sshd_config` 顶部通过 `Include /etc/ssh/sshd_config.d/*.conf` 加载子配置，OpenSSH 遵循**先匹配生效（first-match-wins）**原则。因此要把加固文件放在数字更小、优先加载的位置，或直接检查并覆盖 `50-cloud-init.conf`。

先排查现有覆盖项：

```bash
sudo ls -la /etc/ssh/sshd_config.d/
sudo grep -rnE "PasswordAuthentication|PermitRootLogin|PubkeyAuthentication" /etc/ssh/sshd_config /etc/ssh/sshd_config.d/
```

创建高优先级配置 `/etc/ssh/sshd_config.d/01-hardening.conf`：

```bash
sudo tee /etc/ssh/sshd_config.d/01-hardening.conf > /dev/null <<'EOF'
Port 22222
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitEmptyPasswords no
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3
LoginGraceTime 30
AllowUsers ops
X11Forwarding no
AllowAgentForwarding no
EOF
```

检查语法是否合法：

```bash
sudo sshd -t
```

若提示端口或权限语法错误，先修正后再继续，命令无输出即代表语法通过。

### 4. 防火墙放行新端口并双终端安全重载

在切端口前先放行防火墙，并**保持当前已连接的终端窗口不关闭**：

```bash
sudo ufw allow 22222/tcp comment "SSH custom port"
sudo ufw status numbered
```

若是 Ubuntu 24.04 使用 `ssh.socket`（systemd socket activation），需同步覆盖监听端口或切回 `ssh.service`：

```bash
sudo systemctl status ssh.socket
sudo systemctl disable --now ssh.socket
sudo systemctl enable --now ssh.service
sudo systemctl reload ssh
```

此时**不要断开原终端**，另开一个本地终端，把 `~/.ssh/config` 中的 `Port` 改为 `22222`，然后执行：

```bash
ssh prod-web
```

确认新会话成功进入服务器后，再删掉旧的 22 端口防火墙规则并启用 Fail2Ban：

```bash
sudo ufw delete allow 22/tcp
sudo apt-get update && sudo apt-get install -y fail2ban
sudo tee /etc/fail2ban/jail.d/sshd.local > /dev/null <<'EOF'
[sshd]
enabled = true
port = 22222
maxretry = 4
findtime = 10m
bantime = 1h
EOF
sudo systemctl enable --now fail2ban
```

## 真实踩坑复盘与排查记录

1. **现象：`sshd_config` 改了 `PasswordAuthentication no`，密码仍然能登录**
   - **定位**：执行 `sudo sshd -T | grep passwordauthentication` 发现输出仍是 `yes`。顺着 `/etc/ssh/sshd_config.d/` 排查，发现云厂商镜像自带 `50-cloud-init.conf` 且在主配置顶部被优先 `Include`。
   - **解决**：将加固配置命名为 `01-hardening.conf` 抢占 first-match，并用 `sshd -T` 核验最终运行时生效值。

2. **现象：Ubuntu 24.04 修改端口后重启 `ssh`，22222 端口死活连不上**
   - **定位**：用 `sudo ss -tulpn | grep ssh` 发现监听仍在 `*:22`（由 systemd `ssh.socket` 托管）。
   - **解决**：停用 `ssh.socket` 改用传统 `ssh.service`，或通过 `systemctl edit ssh.socket` 覆写 `ListenStream=22222`。

3. **现象：公钥已经复制上去，客户端仍回退到密码提示**
   - **定位**：服务端 `ssh -vvv` 日志出现 `Authentication refused: bad ownership or modes for directory /home/ops/.ssh`，或目标机器开启了 SELinux 导致上下文标签错乱。
   - **解决**：严格执行 `chmod 700 ~/.ssh` 与 `chmod 600 ~/.ssh/authorized_keys`；RHEL/AlmaLinux 系列额外执行 `restorecon -Rv ~/.ssh`。

## 验收清单

执行以下命令逐项核验，全部满足才算加固完成：

```bash
# 1. 验证 sshd 最终生效配置（非仅仅看文件表面）
sudo sshd -T | grep -E "port |permitrootlogin|passwordauthentication|pubkeyauthentication|kbdinteractiveauthentication"

# 2. 验证实际监听端口
sudo ss -tulpn | grep 22222

# 3. 从本地确认禁止密码回退（应直接报 Permission denied (publickey)）
ssh -o PubkeyAuthentication=no -o PasswordAuthentication=yes -p 22222 ops@bastion.example.com

# 4. 确认 Fail2Ban jail 正常运转
sudo fail2ban-client status sshd
```

预期结果：`sshd -T` 输出 `permitrootlogin no`、`passwordauthentication no`、`pubkeyauthentication yes`；新端口 22222 处于 `LISTEN`；禁用公钥测试被服务端直接拒绝；`fail2ban-client status sshd` 返回激活状态。

## 延伸阅读

- [Linux 服务器安全基线实战：新机上线前必须完成的 12 项加固](/posts/linux-server-security-baseline/)
- [个人站监控实战：用 Uptime Kuma 建立可行动的故障告警](/posts/self-hosted-monitoring-uptime-kuma-guide/)
