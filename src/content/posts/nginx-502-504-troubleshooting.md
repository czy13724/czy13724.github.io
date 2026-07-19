---
title: "Nginx 502/504 排错指南：反向代理常见故障的定位与修复"
published: 2025-06-28
description: "从上游服务、超时配置到网络连通性，一步步排查 Bad Gateway 和 Gateway Timeout"
tags: ["Nginx", "排错", "运维", "Server"]
category: "Nginx"
---

`502 Bad Gateway` 和 `504 Gateway Timeout` 是反向代理场景最常见的故障。
很多人直接重启服务，但不定位根因，问题会反复出现。

## 1. 先区分 502 与 504

- 502：Nginx 能联系上游，但上游返回异常或连接失败。
- 504：Nginx 等待上游超时。

这一区分会决定你排查的方向。

## 2. 第一现场：看日志

```bash
sudo tail -n 200 /var/log/nginx/error.log
sudo tail -n 200 /var/log/nginx/access.log
```

重点关注：

- `connect() failed`
- `upstream timed out`
- `no live upstreams`

## 3. 验证上游服务是否存活

```bash
curl -I http://127.0.0.1:8080
ss -tulpen | rg 8080
```

如果本机都访问不到上游，先修上游应用，不要先改 Nginx。

## 4. 检查 proxy 配置

常见问题：

- `proxy_pass` 地址写错
- 上游端口变更未同步
- Host 头缺失导致上游路由失败

参考：

```nginx
location / {
  proxy_pass http://127.0.0.1:8080;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_connect_timeout 5s;
  proxy_read_timeout 60s;
}
```

## 5. 资源瓶颈排查

若故障偶发，重点看资源：

```bash
top
free -m
df -h
```

高频根因：

- 内存不足导致上游进程被 OOM
- CPU 打满导致响应超时
- 磁盘满导致日志或临时文件写入失败

## 6. Docker 场景补充

如果 Nginx 和上游在 Docker：

- 检查容器是否在同一 network
- `proxy_pass` 应指向服务名而非 `localhost`
- 容器重启策略是否合理

## 7. 修复后验证

1. `nginx -t` 检查配置合法
2. 平滑重载 `systemctl reload nginx`
3. 连续压测/访问 5-10 分钟观察是否复发

## 总结

502/504 的关键不是“重启好了”，而是建立稳定的排查顺序：日志 -> 上游 -> 配置 -> 资源。
流程固定后，故障恢复时间会显著缩短。

## 延伸阅读

- [Docker 部署 Nginx Proxy Manager](/2025/02/20/nginx-proxy-manager/)
- [Linux 服务器安全基线实战](/2024/06/18/linux-server-security-baseline/)
- [Docker Compose 网络与 DNS 故障排查](/2025/12/08/docker-compose-network-dns-troubleshooting/)
