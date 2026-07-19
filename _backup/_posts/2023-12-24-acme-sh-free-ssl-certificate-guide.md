---
layout: post
title: "acme.sh 证书申请指南：免费、自动续期的泛域名 SSL/TLS 证书"
subtitle: "从零开始：通过 Cloudflare API 实现全自动化 HTTPS 配置"
date: 2023-12-24 21:45:06
author: "Levi"
header-img: img/bg/image_24.jpg
catalog: true
tags:
    - Linux
    - SSL证书
    - 运维
    - 教程
---

> “After climbing a great hill, one only finds that there are many more hills to climb.”
> “登上高峰后，你会发现还有更多的山峰要翻越。”

<div class="alert alert-info" role="alert">
  <strong>核心知识点：</strong> 本文将详细介绍如何使用 <code>acme.sh</code> 脚本免费申请 <strong>泛域名 (Wildcard)</strong> 证书，并配置自动续期。重点推荐使用 Cloudflare API Token 进行 DNS 验证，这是目前最安全、便捷的方案。
</div>

## 什么是 acme.sh？

[acme.sh](https://github.com/acmesh-official/acme.sh) 是一个纯 Shell 编写的 ACME 协议客户端。与官方的 Certbot 相比，它有以下显著优势：
*   **轻量级**：无任何依赖，不需要安装 Python。
*   **兼容性**：支持几乎所有 Linux 发行版。
*   **功能全**：自动处理 cron 任务，支持自动注入证书到 Nginx/Apache，支持 Docker 部署。
*   **DNS 支持**：内置了 100+ 种 DNS 服务商的 API 支持。

---

## 第一步：安装 acme.sh

安装过程非常简单，只需要一行命令。建议切换到 `root` 用户执行。

```bash
# 替换为你的真实邮箱，用于接收证书过期提醒
curl https://get.acme.sh | sh -s email=my@example.com
```

安装完成后，脚本会自动完成以下操作：
1.  将 acme.sh 安装到 `~/.acme.sh/` 目录。
2.  创建 `alias acme.sh=~/.acme.sh/acme.sh` 别名。
3.  自动创建每日 Cron Job 以检查证书是否需要更新。

### 使命令生效
安装后，你需要刷新一下 Shell 环境：

```bash
source ~/.bashrc
```

---

## 第二步：切换默认 CA（推荐）

acme.sh 默认使用 ZeroSSL 作为证书颁发机构。如果你更习惯使用 **Let's Encrypt**，可以随时切换：

```bash
acme.sh --set-default-ca --server letsencrypt
```

---

## 第三步：申请证书（推荐 DNS 方式）

acme.sh 支持 HTTP 验证和 DNS 验证。**强烈推荐使用 DNS 验证**，因为：
1.  支持**泛域名**证书（如 `*.example.com`）。
2.  不需要依赖 Web 服务器，不需要公网 IP（内网服务器也能用）。
3.  如果不使用 API 自动验证，每 3 个月要手动解析一次 TXT 记录，非常麻烦。

### 准备：获取 DNS API 凭证

我们以 **Cloudflare** 为例。为了安全起见，我们不再使用 Global API Key，而是使用权限受限的 **API Token**。

1.  登录 Cloudflare 控制台 -> **My Profile** -> **API Tokens**。
2.  点击 **Create Token**。
3.  选择 **Edit zone DNS** 模板。
4.  **Zone Resources** 选择 `Include -> All zones` 或者指定你的域名。
5.  生成并复制你的 `Token`。
6.  同时在控制台首页右侧找到你的 `Account ID`。

### 执行申请

在终端中导入我们将才获取的凭证：

```bash
export CF_Token="你的_API_Token"
export CF_Account_ID="你的_Account_ID"

# 申请泛域名证书（包括主域名和所有子域名）
# --keylength ec-256 表示申请更现代、更快速的 ECC 证书
acme.sh --issue --dns dns_cf -d example.com -d *.example.com --keylength ec-256
```

> **注意**：脚本执行完毕后，你的 ID 和 Token 会被自动加密保存在 `~/.acme.sh/account.conf` 中，下次自动续期时无需再次输入。

---

## 第四步：安装证书到 Web 服务器

**千万不要**直接在 Nginx/Apache 配置文件中指向 `~/.acme.sh/` 目录下的文件。该目录结构随时可能变动。

你应该使用 `--install-cert` 命令将证书复制到指定位置，并告知脚本重载 Web 服务。

### Nginx 示例

假设你的 Nginx 证书目录在 `/etc/nginx/ssl`：

```bash
mkdir -p /etc/nginx/ssl

acme.sh --install-cert -d example.com --ecc \
--key-file       /etc/nginx/ssl/server.key  \
--fullchain-file /etc/nginx/ssl/fullchain.cer \
--reloadcmd     "systemctl force-reload nginx"
```

### Nginx 配置参考

在你的 Nginx 配置文件中（如 `/etc/nginx/conf.d/example.com.conf`），确保路径与上面一致：

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # 证书路径配置
    ssl_certificate     /etc/nginx/ssl/fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # 推荐的 SSL 安全参数
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    
    # ... 其他配置
}
```

---

## 进阶：如何更新证书？

### 自动更新（无需操作）
acme.sh 会每 60 天自动检测证书。如果发现证书即将过期，它会自动：
1.  调用 API 重新验证 DNS。
2.  重新签发证书。
3.  将新证书复制到 `/etc/nginx/ssl/`。
4.  执行 `systemctl force-reload nginx` 重载服务。

你完全不需要操心。

### 脚本本身的更新
建议开启 acme.sh 脚本的自动升级功能，以保持与最新的 ACME 协议兼容：

```bash
acme.sh --upgrade --auto-upgrade
```

---

## 常见问题排查

1.  **Unknown error (DNS 验证失败)**
    *   检查 API Token 权限是否正确（是否包含 **Zone.DNS** 的 **Edit** 权限）。
    *   检查 DNS 服务器是否生效，有时生效有延迟，可以加 `--dnssleep 60` 参数让脚本多等一会儿。

2.  **Web 验证失败**
    *   确保 80 端口开放且没有被防火墙拦截。
    *   如果你只是临时验证，没有 Nginx，可以使用 `--standalone` 模式（需临时停止占用 80 端口的服务）。

---

## 免责声明

<div class="well">
    <p>本项目提供的教程仅用于教育和测试目的。</p>
    <ul>
        <li>在使用脚本修改生产环境配置前，建议先备份相关配置文件。</li>
        <li>Token 和 Key 等敏感信息请妥善保管，切勿泄露。</li>
        <li>因使用不当导致的服务中断或数据丢失，作者不承担责任。</li>
    </ul>
</div>