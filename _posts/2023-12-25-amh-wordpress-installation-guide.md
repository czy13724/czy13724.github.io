---
layout: post
title: "AMH 面板建站实战：从零部署高性能 WordPress 博客"
subtitle: "基于 Azure B1s / VPS 的 Linux 环境配置与 AMH 面板使用全指南"
date: 2023-12-25 13:45:09
author: "Levi"
header-img: "img/bg/image_25.jpg"
catalog: true
tags:
    - WordPress
    - AMH面板
    - Linux
    - 建站教程
---

> "A man is not old until his regrets take place of his dreams."
> "只有当遗憾取代了梦想，人才算老。"

<div class="alert alert-info" role="alert">
  <strong>教程概览：</strong> 本文将手把手教你如何在一台全新的 Linux 服务器（如 Azure B1s）上，配置系统环境、安装 AMH 开源主机面板，并最终部署一个运行在 PHP 8.0 环境下的 WordPress 博客。
</div>

## 第一阶段：服务器基础环境配置

在安装面板之前，我们需要对 Linux 服务器进行一些必要的初始化设置。本教程以 **Azure B1s** (CentOS/AlmaLinux 系) 为例，其他 VPS 操作类似。

### 1. 更新系统与安装基础工具

```bash
# 安装 YUM 增强工具并更新系统
yum install -y yum-utils
yum update -y
```

### 2. 配置 Swap 虚拟内存 (关键)

对于像 Azure B1s 这样内存较小（1G）的服务器，开启 Swap 是防止数据库崩溃的关键，建议配置 4G - 8G Swap。

```bash
# 1. 停止并删除 Azure 默认的临时 Swap (如果有)
swapoff /mnt/resource/swapfile
rm -rf /mnt/resource/swapfile
sed -i "/'\/mnt/resource/swapfile swap swap defaults 0 0'//" /etc/fstab

# 2. 创建新的 Swap 文件 (8G)
dd if=/dev/zero of=/swapfile bs=1024 count=8388608

# 3. 设置权限并格式化
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 4. 设置开机自动挂载
echo '/swapfile swap swap sw 0 0' | tee -a /etc/fstab

# 5. 验证
free -m
```

### 3. 系统优化配置

```bash
# 设置时区为上海
timedatectl set-timezone Asia/Shanghai

# 关闭系统防火墙 (推荐使用云服务商的安全组管理端口)
systemctl stop firewalld
systemctl disable firewalld
```

---

## 第二阶段：安装 AMH 主机面板

AMH 是一款国内老牌的开源主机面板，特点是模块化、极简、占用资源少。

### 1. 执行安装脚本

访问 [AMH 官网安装页](https://amh.sh/install.htm) 获取最新命令，或直接使用以下定制命令（Nginx 1.20 + MySQL 5.6 + PHP 8.0）：

```bash
wget http://dl.amh.sh/amh.sh && bash amh.sh nginx-1.20,mysql-5.6,php-8.0
```

> **提示**：如果提示 `wget: command not found`，请先执行 `yum install -y wget`。安装过程大约需要 15-30 分钟。

### 2. 登录面板

安装完成后，通过浏览器访问 `http://你的IP:8888` 或 `https://你的IP:9999`。使用终端输出的默认账号密码登录。

![AMH登录界面]({{site.baseurl}}/img/AMH_Install_WordPress/34.png)

### 3. 安装必要软件扩展

登录面板后，进入 **软件商店**，建议安装以下扩展以支持 WordPress 运行：
*   **amrewrite**: 伪静态规则管理
*   **amssl**: SSL 证书自动申请
*   **pecl_redis / redis**: 缓存支持 (可选，性能优化)
*   **php-generic**: PHP 通用扩展管理

---

## 第三阶段：部署 WordPress 网站

### 1. 创建虚拟主机 (LNMP 环境)

进入 **网站** -> **虚拟主机** -> **新增虚拟主机**：
*   **主标识域名**: 填写你的域名 (如 `example.com`)
*   **运行环境**: 选择 `lnmp01`
*   **网络**: 勾选 `HTTPS`，端口自动设置为 443
*   **URL重写规则**: 这里选择 `wordpress2` 规则（非常重要，否则文章页 404）

> **WordPress Nginx 伪静态规则参考**:
> ```nginx
> location / {
>     try_files $uri $uri/ /index.php?$args;
> }
> rewrite /wp-admin$ $scheme://$host$uri/ permanent;
> ```

![新增虚拟主机]({{site.baseurl}}/img/AMH_Install_WordPress/2.png)

### 2. 申请 SSL 证书

进入 **网站** -> **SSL证书** -> **AMSSL**：
*   选择刚才创建的虚拟主机。
*   勾选 **一键自动配置** (推荐 Let's Encrypt)。
*   点击创建，等待证书签发并自动部署。

![SSL配置]({{site.baseurl}}/img/AMH_Install_WordPress/9.png)

### 3. 安装 PHP 扩展

WordPress 及其插件通常需要以下 PHP 扩展支持。进入 **网站** -> **PHP扩展**，为 `lnmp01` 环境安装：
*   `fileinfo`
*   `exif`
*   `imagick` (图像处理)
*   `opcache` (性能加速)
*   `curl`

---

## 第四阶段：安装 WordPress 程序

### 1. 下载与解压

点击面板上的 **文件** 管理，进入网站根目录（通常是 `/home/wwwroot/lnmp01/domain/你的域名/web/`）。

使用 **远程下载** 功能：
```text
https://cn.wordpress.org/latest-zh_CN.tar.gz
```

下载完成后，选择文件点击 **智能解压**。解压后将 `wordpress` 文件夹内的所有文件 **移动** 到 `web` 根目录下，并删除默认的 `index.html`。

### 2. 配置数据库连接

1.  将 `wp-config-sample.php` 重命名为 `wp-config.php`。
2.  在线编辑该文件，填入数据库信息：

```php
define( 'DB_NAME', 'wordpress_db' ); // 你的数据库名
define( 'DB_USER', 'root' );         // 你的数据库用户名
define( 'DB_PASSWORD', '你的密码' ); // 你的数据库密码
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8' );

// 性能优化参数
define( 'WP_MEMORY_LIMIT', '256M' );
define( 'FS_METHOD', 'direct' );
```

3.  回到面板 **数据库** 管理，创建一个名为 `wordpress_db` 的空数据库（名称需与配置文件一致）。

### 3. 权限修正

这一步至关重要：在 **文件** 管理中，勾选 `web` 目录，点击 **权限**，将所有者改为 `www`，用户组改为 `www`，并勾选 **递归处理**。

![权限设置]({{site.baseurl}}/img/AMH_Install_WordPress/25.png)

---

## 第五阶段：完成安装

打开浏览器访问你的域名，你应该能看到 WordPress 的安装欢迎界面。设置好站点标题、管理员账号密码，点击安装即可！

### 进阶优化建议：WWW 跳转

如果你希望访问 `www.example.com` 自动跳转到 `example.com`（或反之）：
1.  在 AMH 中创建一个 **子域主机** `www.example.com`。
2.  在 **伪静态规则** 中添加 301 跳转规则。
3.  或者直接使用 AMH 面板的 **AMRewrite** 模块设置域名 301 重定向。

---

## 免责声明

<div class="well">
    <p>本项目提供的教程仅用于技术交流与学习。</p>
    <ul>
        <li>文中涉及的云服务商（如 Azure）及软件面板（AMH）均为演示环境，作者与其无利益关联。</li>
        <li>请在合法合规的前提下搭建网站，并在正式上线前做好数据备份。</li>
        <li>作者不对因操作失误导致的服务器数据丢失承担责任。</li>
    </ul>
</div>
