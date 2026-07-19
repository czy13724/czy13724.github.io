---
title: "Docker Compose 网络与 DNS 故障排查：容器互通失败怎么查"
published: 2025-12-08
description: "从服务名解析、端口映射到网络隔离，系统定位 `connection refused` 与 `name not resolved`"
tags: ["Docker", "Compose", "排错", "网络"]
category: "Docker"
---

Compose 项目最常见故障之一是“容器都启动了，但服务互相访问不到”。
这类问题通常集中在网络、DNS 和启动顺序。

## 1. 三个高频报错

1. `connection refused`
2. `temporary failure in name resolution`
3. `no route to host`

这些报错看起来类似，但根因完全不同。

## 2. 先看网络拓扑

```bash
docker compose ps
docker network ls
docker network inspect <network_name>
```

目标：确认服务是否在同一个 compose network。

## 3. 服务名解析规则

在 Compose 网络内，服务间应通过 `service name:port` 互访。

错误示例：

- 在容器 A 里访问 `localhost:5432` 连接数据库 B

正确示例：

- 使用 `db:5432`（`db` 为服务名）

## 4. `depends_on` 不是“服务就绪”

`depends_on` 只保证启动顺序，不保证数据库已经可连接。

建议加健康检查和重试逻辑：

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
  db:
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
```

## 5. 端口映射与容器内访问的区别

- `ports` 用于“宿主机 <-> 容器”
- 容器之间互访不依赖 `ports`，依赖内部网络

很多人误以为不映射端口就不能互访，这是典型误区。

## 6. 快速诊断命令

在容器内执行：

```bash
getent hosts db
nc -vz db 5432
curl -I http://api:8080
```

这三步能快速判断是 DNS、端口还是服务本身问题。

## 7. 常见修复动作

1. 统一服务到同一个 user-defined network
2. 把跨容器访问地址改为服务名
3. 为依赖服务加 healthcheck
4. 应用端加启动重试机制

## 总结

Compose 网络故障的本质是“认知模型错误”。
只要你把“容器内 localhost 只指向自己”这件事吃透，80% 的互访问题都能一次定位。

## 延伸阅读

- [Nginx 502/504 排错指南](/2025/06/28/nginx-502-504-troubleshooting/)
- [Cloudflare Pages 性能与安全优化](/2025/03/18/cloudflare-pages-performance-security/)
- [Linux 服务器安全基线实战](/2024/06/18/linux-server-security-baseline/)
