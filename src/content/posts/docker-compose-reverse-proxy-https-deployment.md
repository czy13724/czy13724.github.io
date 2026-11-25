---
title: "Docker Compose 生产级反向代理与 HTTPS 自动签发部署手册"
published: 2026-11-24
description: "单台 VPS 生产环境零痛点上线 SOP：用 Caddy + Docker Compose 实现内部网络隔离、ACME 自动 HTTPS、日志轮转与配置热重载。"
tags: ["Docker", "Docker Compose", "Caddy", "HTTPS", "运维"]
category: "Docker"
---

## 复盘背景

很多个人项目或小团队服务上云时，最常见也最危险的习惯是：在 `compose.yml` 里给每个后端容器都写上 `ports: - "3000:3000"`，然后再在宿主机装个 Nginx 去反代 `127.0.0.1:3000`。

这套做法在生产环境藏着两个大坑：第一，Docker 默认修改 `iptables` 的 `DOCKER` 链，**`ports: "3000:3000"` 会直接绕过 Ubuntu 的 UFW 防火墙**，把原本只该内网访问的端口直接暴露到公网；第二，每次手动续签证书、重载反代都要小心翼翼。改用 **Caddy + Docker Compose 内部网络隔离**后，TLS 证书全自动签发续期，后端端口完全不暴露到宿主机，配置热重载也是零中断。

## 前置条件与输入参数

- **服务器环境**：Ubuntu 22.04 / 24.04 或 Debian 12，已安装 Docker Engine 与 `docker compose` v2 插件。
- **域名解析**：`app.example.com` 的 DNS `A` / `AAAA` 记录已指向当前 VPS 公网 IP，且云安全组及本机防火墙已放行 `80/tcp`、`443/tcp`（可选 `443/udp` 支持 HTTP/3）。
- **目录约定**：统一部署目录 `/opt/stacks/web-prod`。

## 操作步骤（SOP）

### 1. 初始化目录结构

```bash
sudo mkdir -p /opt/stacks/web-prod/caddy
cd /opt/stacks/web-prod
```

### 2. 编写 `Caddyfile`（自动 HTTPS + 安全响应头 + 健康检查路由）

创建 `/opt/stacks/web-prod/caddy/Caddyfile`：

```text
{
	email ops@example.com
}

app.example.com {
	encode zstd gzip

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "SAMEORIGIN"
		Referrer-Policy "strict-origin-when-cross-origin"
		-Server
	}

	reverse_proxy app:3000 {
		health_uri /healthz
		health_interval 15s
		health_timeout 3s
	}
}
```

### 3. 编写生产级 `compose.yml`（网络隔离 + 日志轮转 + 仅暴露 80/443）

创建 `/opt/stacks/web-prod/compose.yml`：

```yaml
services:
  caddy:
    image: caddy:2.9-alpine
    container_name: prod-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      app:
        condition: service_healthy
    networks:
      - proxy_net
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  app:
    image: ghcr.io/example/web-app:1.0.0
    container_name: prod-app
    restart: unless-stopped
    # 关键：仅使用 expose 对 proxy_net 内网开放，绝不绑定到宿主机 ports
    expose:
      - "3000"
    environment:
      NODE_ENV: production
      PORT: "3000"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - proxy_net
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "5"

volumes:
  caddy_data:
  caddy_config:

networks:
  proxy_net:
    driver: bridge
```

### 4. 校验配置并启动服务

先在正式启动前验证 `Caddyfile` 与 Compose 配置语法：

```bash
docker compose config --quiet
docker run --rm -v "$PWD/caddy/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2.9-alpine caddy validate --config /etc/caddy/Caddyfile
```

验证无误后启动：

```bash
docker compose up -d
docker compose logs -f caddy
```

看到 `certificate obtained successfully` 后即表示 HTTPS 证书已签发并持久化在 `caddy_data` 卷中。后续修改 `Caddyfile` 时**无需重启容器**，直接热重载：

```bash
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

### 5. 备份 `caddy_data`（保护 ACME 账户与证书卷）

```bash
docker run --rm -v web-prod_caddy_data:/data -v "$PWD:/backup" alpine \
  tar czf /backup/caddy_data_backup.tar.gz -C /data .
```

## 真实踩坑复盘与排查记录

1. **现象：明明开了 UFW 防火墙只放行 80/443，公网却能直接访问 `http://IP:3000` 绕过反代**
   - **定位**：`compose.yml` 中写了 `ports: - "3000:3000"`，Docker 直接向 `iptables` 插入了 `DNAT` 规则，优先级高于 UFW 的 `INPUT` 拦截。
   - **解决**：删掉后端服务的 `ports` 映射，统一改用 `expose: ["3000"]`；若真需要调试端口，也只能绑定环回地址 `127.0.0.1:3000:3000`。

2. **现象：新容器重启瞬间，公网访问出现几秒 `502 Bad Gateway`**
   - **定位**：`depends_on` 默认只等容器进程启动，不等内部 HTTP 服务监听就绪。
   - **解决**：在后端服务定义 `healthcheck`，并让 `caddy` 通过 `condition: service_healthy` 等待健康检查通过后再接入流量。

3. **现象：跑了半年后 VPS 磁盘突然爆满 100%**
   - **定位**：Docker 默认 `json-file` 日志驱动**没有大小上限**，一个高频访问的容器日志能膨胀到几十 GB。
   - **解决**：在所有服务中强制写死 `max-size` 和 `max-file` 轮转上限。

4. **现象：折腾配置时反复重建删除 `caddy_data` 卷，触发 Let's Encrypt 限流 429**
   - **定位**：每次删除匿名卷重新签发都消耗每周 5 次的同域名证书配额。
   - **解决**：务必使用命名卷 `caddy_data` 持久化证书；调试阶段在全局配置块加上 `acme_ca https://acme-staging-v02.api.letsencrypt.org/directory` 测试通畅后再切回正式 CA。

## 验收清单

```bash
# 1. 所有容器均处于 Up (healthy) / running 状态
docker compose ps

# 2. 验证宿主机仅监听 80 / 443，不存在 3000 公网暴露
sudo ss -tulpn | grep -E ":(80|443|3000)\b"

# 3. 验证 HTTP -> HTTPS 自动跳转及安全头生效
curl -sSI http://app.example.com/ | head -n 5
curl -sSI https://app.example.com/ | grep -iE "^(HTTP/|strict-transport-security|x-content-type-options|x-frame-options)"

# 4. 校验证书签发主体与有效期
echo | openssl s_client -servername app.example.com -connect app.example.com:443 2>/dev/null | openssl x509 -noout -issuer -dates
```

预期结果：`ss` 输出中 `3000` 端口未出现在宿主机监听列表；`http://` 返回 `308` 跳转至 `https://`；HTTPS 返回 `200` 且包含全部安全响应头，证书签发方与有效日期正常。

## 延伸阅读

- [Docker Compose 网络与 DNS 故障排查：容器互通失败怎么查](/posts/docker-compose-network-dns-troubleshooting/)
- [Docker 部署 Nginx Proxy Manager: 小白也能搞定反向代理](/posts/nginx-proxy-manager/)
- [个人站监控实战：用 Uptime Kuma 建立可行动的故障告警](/posts/self-hosted-monitoring-uptime-kuma-guide/)
