---
layout: post
title: "Docker 部署 Nginx Proxy Manager: 小白也能搞定反向代理"
subtitle: "告别繁琐的 Nginx 配置文件，用可视化面板轻松管理 SSL 证书与域名转发"
date: 2025-02-20 11:00:00
author: "Levi"
header-img: "img/bg/image_38.jpg"
catalog: true
tags:
    - Docker
    - Nginx
    - Server
    - 教程
---

如果你自己搭建过 Home Lab 或者 VPS 服务，一定遇到过这个问题：
我有多个服务（Portainer, Halo, Alist），它们运行在不同的端口（9000, 8090, 5244），但我只想用一个域名（如 `demo.com`）的不同子域名来访问它们，而且都要加上 HTTPS 小绿锁。

手写 Nginx 配置文件 (`nginx.conf`) 不仅容易出错，而且申请和续期 SSL 证书也非常麻烦。

今天推荐的神器 **Nginx Proxy Manager (NPM)**，能让你在图形化界面中几分钟搞定这一切。

## 1. 为什么选择 Nginx Proxy Manager?

*   **可视化 UI**：所有配置都在网页上点点点。
*   **自动 SSL**：内置 Let's Encrypt 支持，一键申请并自动续期证书。
*   **Docker 部署**：不污染宿主机环境，随时可以迁移。

### 架构示意图

```text
User (Browser)
      │
      ▼
[ Nginx Proxy Manager (Port 80/443) ] ────► [ Automatic SSL Management ]
      │
      ├───► demo.com      ────► [ Portainer (Port 9000) ]
      ├───► blog.demo.com ────► [ Halo Blog (Port 8090) ]
      └───► pan.demo.com  ────► [ Alist (Port 5244) ]
```

## 2. Docker Compose 部署

首先，确保你的服务器已经安装了 Docker 和 Docker Compose。
创建一个文件夹并新建 `docker-compose.yml`：

```yaml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'      # HTTP 流量
      - '81:81'      # 管理面板入口
      - '443:443'    # HTTPS 流量
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

启动服务：
```bash
docker-compose up -d
```

## 3. 初始化配置

1.  访问 `http://<服务器IP>:81`。
2.  默认登录账号：`admin@example.com`，密码：`changeme`。
3.  首次登录后务必修改邮箱和密码。

## 4. 实战：转发 Portainer 面板

假设你的 Portainer 运行在 `http://127.0.0.1:9000`，你想用 `portainer.你的域名.com` 访问。

1.  **添加 Proxy Host**：点击 Dashboard 的 "Proxy Hosts" -> "Add Proxy Host"。
2.  **Details 选项卡**：
    *   Domain Names: `portainer.你的域名.com`
    *   Scheme: `http`
    *   Forward Hostname / IP: `172.17.0.1` (这是 Docker 网桥的宿主机 IP，或者填公网 IP)
    *   Forward Port: `9000`
    *   勾选 `Block Common Exploits` (基础防护)。
3.  **SSL 选项卡**：
    *   SSL Certificate: 选择 "Request a new SSL Certificate"。
    *   勾选 `Force SSL` (强制 HTTPS)。
    *   填写 Email 并同意协议。
4.  **保存**：点击 Save。等待几秒钟，NPM 会自动验证域名并申请证书。

搞定！现在你可以通过安全的 HTTPS 链接访问你的面板了。

## 常见坑点与排查

1.  **SSL 申请失败 (Internal Error)**
    *   **检查端口**: 必须确保你服务器防火墙的 **80** 和 **443** 端口是对外开放的。
    *   **DNS 解析**: 确保你的域名已经正确解析到了服务器 IP，且生效（可以用 `ping` 检查）。
    *   **Email 未填**: 在申请证书时，Email 字段虽然可选，但建议填写，否则 Let's Encrypt 可能会拒绝请求。

2.  **502 Bad Gateway**
    *   **IP 填写错误**: 在 Forward Hostname 中，千万**不要填 `127.0.0.1`**（除非 NPM 网络模式为 host）。
    *   **正确做法**: 填写 Docker 容器的局域网 IP，或者宿主机的内网 IP（如 `172.17.0.1`）。

3.  **上传文件限制**
    *   默认 Nginx 配置限制了上传大小。如果遇到上传大文件失败，需要在 NPM 的 Proxy Host 配置 -> **Advanced** 中添加：
        ```nginx
        client_max_body_size 0;
        ```

## 5. 总结

Nginx Proxy Manager 极大降低了反向代理的门槛。对于个人开发者和家庭实验室用户来说，它兼顾了易用性和功能性，是必备的基础设施之一。
