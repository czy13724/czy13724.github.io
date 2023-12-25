---
author: Levi
catalog: "true"
date: "2023-12-25 13:45:09"
header-img: img/bg/image_25.jpg
layout: post
title: 如何使用AMH面板在线安装 WordPress
subtitle: " \"How To Install WordPress With AMH\""
tags: 
    - 教程 
---  
    
> “A man is not old until his regrets take place of his dreams.”  
> “只有当遗憾取代了梦想，人才算老。”



# 如何使用AMH面板在线安装 WordPress

在安装WordPress之前，在AMH面板中，将软件商店中的软件按需安装，PHP扩展安装需要先将软件商店中的php扩展安装完毕后，才可以在网站中操作安装，否则安装会失败。配置好缓存应用。

![]({{site.baseurl}}/img/AMH_Install_WordPress/1.png "fig:")

## 配置网站相关内容

  ### 将域名解析到服务器所在IP地址。

  ### 在AMH主机面板中点击**网站**菜单，在**虚拟主机**菜单下面新增虚拟主机。

![]({{site.baseurl}}/img/AMH_Install_WordPress/2.png "fig:")

新增虚拟主机时：

- 主标识域名：填写你的域名名称，这个用于在服务器上创建网站存放目录。

- 运行环境：默认选择，之前安装好的lnmp环境，lnmp01（AMH可以同时创建多个环境。）

- 监听IP端口：默认80端口，勾选设为环境的默认主机，然后点击IPV6按钮。

- 绑定域名：这里绑定你之前解析过来的域名，支持泛域名绑定。

- 默认主页：无需更改，默认静态页面和php

- URL重写规则：之前在AMH面板中安装过重写规则的软件，点击后面的管理规则。创建一个URL规则文件。

新增管理规则，在可选规则中，选择wordpress2，这条规则是WordPress的伪静态规则，如果你创建的WordPress不想使用静态页面访问的话，可以忽略这条规则。

``` bash
location / {
    try_files $uri $uri/ /index.php?$args;
}
# Add trailing slash to */wp-admin requests.
rewrite /wp-admin$ $scheme://$host$uri/ permanent;
```

这里的规则其实就是Nginx.conf文件里server模块内的规则，你可以在wordpress2中自定义其它规则，例如防盗链，反向代理等等。

你还可以将浏览器缓存的规则加进去。

``` bash
location ~* \.(css|js|png|jpg|jpeg|gif|gz|svg|ttf|webp|woff|woff2)$ {
access_log off;
add_header Cache-Control max-age=36000;
}
```

下面开始配置nginx规则。

![]({{site.baseurl}}/img/AMH_Install_WordPress/3.png "fig:")

规则新增完毕后，关闭窗口。在之前的窗口中，点击刷新列表，然后选择wordpress2.conf保存后，虚拟主机创建成功。

![]({{site.baseurl}}/img/AMH_Install_WordPress/4.png "fig:")

  ### 安装一些常用的PHP扩展。

在网站菜单下，点击扩展安装，勾选下面的PHP扩展后点击提交，安装扩展(fileinfo,intl,gettext,bcmath,opcache,pecl_imagick,exif,zbarcode)。

![]({{site.baseurl}}/img/AMH_Install_WordPress/5.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/6.png "fig:")

耐心等待代码全部跑完，PHP扩展全部安装完毕后，才可以进行下一步操作。

### SSL证书申请

点击网站菜单下的SSL证书，创建AMSSL网站证书。

- 选择一键自动配置应用，

- 创建方式选择使用文件验证。

- 所属环境选择lnmp01

- 所属主机选择你创建的主机名称。

- 点击创建

![]({{site.baseurl}}/img/AMH_Install_WordPress/7.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/8.png "fig:")

SSL证书已经创建成功了，点击证书管理下面的**应用**，将证书启用。

证书启用成功后，还需要进行简单的配置，开启强制https，优化加强提速，证书自动续期。

![]({{site.baseurl}}/img/AMH_Install_WordPress/9.png "fig:")

SSL证书已经申请成功了。有效期三个月，三个月自动续期。无需手工操作。

![]({{site.baseurl}}/img/AMH_Install_WordPress/10.png "fig:")

最后在环境变量中再做一些设置，这些设置因人而已，没有硬性要求如何修改。

![]({{site.baseurl}}/img/AMH_Install_WordPress/11.png "fig:")

接下来需要安装WordPress程序。

## 安装WordPress程序

点击**文件**菜单，在文件管理中可以看到，`/home/wwwroot/lnmp01/domain/freeccb/web/`
是当前存放的web文件的路径，将WordPress程序下载到web文件夹内。

![]({{site.baseurl}}/img/AMH_Install_WordPress/12.png "fig:")

在web文件夹下，点击下面的远程上传按钮，将WordPress程序的下载地址粘贴进去。点击确认，开始下载WordPress程序。

``` bash
#wordpress最新版下载地址，复制下面链接。
https://cn.wordpress.org/latest-zh_CN.tar.gz
```

![]({{site.baseurl}}/img/AMH_Install_WordPress/13.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/14.png "fig:")

WordPress程序下载完毕后，解压缩。

**勾选**
latest-zh_CN.tar.gz文件，然后在下面的**压缩类型**中选择tar.gz，这个压缩类型要跟解压缩文件的扩展名一致。之后点击**智能解压**。

![]({{site.baseurl}}/img/AMH_Install_WordPress/15.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/16.png "fig:")

解压缩后，需要将wordpress文件内的文件移动到web文件夹内，同时删除掉web文件夹里的index.html文件。

![]({{site.baseurl}}/img/AMH_Install_WordPress/17.png "fig:")

web文件夹内选择文件没然后点击**删除**，就可以删除掉文件，可视化删除，非常简单。

全选wordoress文件夹内的所有文件，然后点击**移动**

![]({{site.baseurl}}/img/AMH_Install_WordPress/18.png "fig:")

点击移动，将文件移动到上级目录web中，点击上级，自动切换到web目录，之后点击确认，进行移动。

![]({{site.baseurl}}/img/AMH_Install_WordPress/19.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/20.png "fig:")

文件已经移动成功了，接下来将wp-config-sample.php**改名**为wp-config.php，点击wp-config-sample.php文件后面的**重命名**进行修改。

修改完毕后，点击打开wp-config.php文件，编辑以下内容。

``` bash
WordPress数据库的名称：define( ‘DB_NAME', ‘WordPress' );
MySQL数据库用户名：define( ‘DB_USER', ‘root' );
MySQL数据库密码：define( ‘DB_PASSWORD', ‘mysql密码' );
MySQL主机：define( ‘DB_HOST', ‘localhost' );
创建数据表时默认的文字编码：define( ‘DB_CHARSET', ‘utf8' );
```

在文件末尾添加wp内存大小，建议设置128M或更高，和更新插件时免登录ftp

``` bash
define('WP_MEMORY_LIMIT', '128M');
define('FS_METHOD','direct');
```

![]({{site.baseurl}}/img/AMH_Install_WordPress/21.png "fig:")

当前的mysql密码还是默认的密码，这里需要修改一下mysql的密码，点击数据库，在数据库菜单下的用户管理中，选择修改密码，输入你设置的mysql密码，用户是默认的root，密码输入完毕后，点击提交即可。

![]({{site.baseurl}}/img/AMH_Install_WordPress/22.png "fig:")

修改完毕后，保存文件，之后在**数据库**菜单中的**快速建库**中，点击数据库后，输入数据库名称：**WordPress**，创建一个空库就可以了。

注意：这个数据库名称与上面wp-config.php中配置的要一样。

![]({{site.baseurl}}/img/AMH_Install_WordPress/23.png "fig:")

最后在数据库的**参数配置**中，将是否开启监听端口远程访问，选择**开启**，默认是关闭的，这里不开启的话，程序无法连接数据库。

![]({{site.baseurl}}/img/AMH_Install_WordPress/24.png "fig:")

设置web目录权限，wordpress解压缩后，文件的用户和用户组需要修改为www

勾选web目录，进行权限设置，否则在wordpress中无法安装插件和主题。

![]({{site.baseurl}}/img/AMH_Install_WordPress/25.png "fig:")

到这里WordPress的服务器端配置已经全部完成。

------------------------------------------------------------------------

## 如何将www域名跳转到主域名

在浏览器中，输入域名，然后按ctrl+回车，可以自动跳转到www.你的域名.com

在SEO中，搜索引擎把主域名和带www的域名会默认为两个网站，其实www域名是主域名的二级域名，在AMH中，需要将www域名跳转到主域名上。

你需要建立一个**子域主机**：

![]({{site.baseurl}}/img/AMH_Install_WordPress/26.png "fig:")

URL重写规则中，点击管理规则，新建一个www.conf的规则，用来跳转。新建一个域名跳转，类型选择301，匹配域名选择指定域名，输入你的www域名，下面跳转到不带www的主域名。

![]({{site.baseurl}}/img/AMH_Install_WordPress/27.png "fig:")

规则创建后，在子域主机中建立子域名主机。建立完毕后，还需要在**SSL证书**中，申请www域名的证书。

![]({{site.baseurl}}/img/AMH_Install_WordPress/28.png "fig:")

子域名WWW的SSL证书创建完毕后，点击**应用**，开启强制https和优化访问，开启自动续期后，就成功了。

这时候在浏览器中无论输入http还是https的www域名都会默认跳转到主域名上。

## 浏览器设置WordPress网站

接下来在浏览器中访问网站域名，在web端配置WordPress网站，按照步骤一步一步进行安装就可以了。建议使用谷歌浏览器进行访问。

![]({{site.baseurl}}/img/AMH_Install_WordPress/29.png "fig:")

![]({{site.baseurl}}/img/AMH_Install_WordPress/30.png "fig:")

------------------------------------------------------------------------

# Linux 自动部署LNMP环境 WebUI 开源主机面板

AMH官网：<https://amh.sh/>

### 使用AMH 自动部署LNMP环境

本文自动部署LNMP环境选用的是Azure的B1s服务器。

#### 配置好Linux基础环境

首先将Azure的B1s服务器配置好Linux基础环境。

逐条执行安装命令

``` bash
# 安装YUM增强工具
install yum-utils
yum update
```

``` bash
# 安装dnf
yum install dnf
```

``` bash
# 安装epel和remi软件源，dnf repolist all 命令可以查看全部的数据源
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
dnf install https://rpms.remirepo.net/enterprise/remi-release-7.rpm
dnf makecachea
```

``` bash
# 安装dnf命令自动更新
dnf install dnf-automatic
systemctl start dnf-automatic.timer
```

``` bash
# 安装开发工具软件包组
dnf group install 'Development Tools' -y
```

配置SWAP虚拟内存

Linux中的swap分区类似Windows的虚拟内存，当物理内存不足的情况下，可通过创建swap分区来解决内存过小的问题。

使用 `free -m`
查看服务器虚拟内存，微软的B1s默认启用了2G的虚拟内存，如果觉得2G的SWAP交换分区太小的话，删除掉Swap交换分区，重新创建一个4G的或者更大的虚拟内存SWAP交换分区。

使用 `swapon -s` 命令查看交换分区的位置。

``` bash
#停止Swap交换分区
swapoff /mnt/resource/swapfile
#删除交换分区
rm -rf /mnt/resource/swapfile
#删除开机启动/etc/fstab配置内容
sed -i "/'\/mnt/resource/swapfile swap swap defaults 0 0'//" /etc/fstab
```

创建Swap交换分区

``` bash
#创建8G大小的Swap交换分区虚拟内存
sudo dd if=/dev/zero of=/swapfile bs=1024 count=8388608
#查看Swap交换分区大小
ls -lh /swapfile
#更改swap文件的权限
sudo chmod 600 /swapfile
#格式化Swap文件
sudo mkswap /swapfile
#启用Swap文件
sudo swapon /swapfile
#设置开机启动
echo '/swapfile swap swap sw 0 0' | sudo tee -a /etc/fstab
```

修改服务器时区，这个很关键，有时候客户端和服务端的时间不一样，有些软件就会无法工作。

``` bash
sudo timedatectl set-timezone Asia/Shanghai
```

永久关闭防火墙，如果需要防火墙功能，可以在Azure的B1s服务器的云平台上的网络选项中设置防火墙，云平台上的防火墙设置更灵活一些。

``` bash
#查看防火墙状态
systemctl status firewalld
#关闭防火墙
systemctl stop firewalld
#永久关闭防火墙
systemctl disable firewalld
```

基本配置完毕之后，reboot重新启动服务器，开始安装LNMP环境。

#### 自动部署LNMP环境

进入AMH面板安装页面：<https://amh.sh/install.htm>

点击定制安装，选择需要安装的版本，这里选择web服务器软件使用nginx1.20，数据库软件使用musql5.6，php选择php8.0版本。

![]({{site.baseurl}}/img/AMH_Install_WordPress/31.png "fig:")

使用 root 账号登录 Linux 服务器，执行以下命令安装AMH：

``` bash
wget http://dl.amh.sh/amh.sh && bash amh.sh nginx-1.20,mysql-5.6,php-8.0
```

安装小提示

安装amh如果提示 **wget: command not found**

请先执行以下命令安装wget命令后再安装AMH：

``` bash
#centos系统
yum install -y wget
#Ubuntu系统
apt-get install -y wget
```

安装amh过程中如果服务器解析不了amh.sh域名的情况，请先更换服务器的DNS再安装AMH。执行以下命令完成更换DNS解析：

``` bash
echo -e "options timeout:1 attempts:1 rotate\nnameserver 8.8.8.8\nnameserver 114.114.114.114" >/etc/resolv.conf;
```

安装amh成功后无法访问面板情况，请您检查主机商是否有安全组/防火墙相关限制，请开放端口，如开放面板8888，9999端口。

![]({{site.baseurl}}/img/AMH_Install_WordPress/32.png "fig:")

中文安装界面，输入Y，然后回车进行AMH安装。

编译安装速度有些慢，耐心等待一会。

![]({{site.baseurl}}/img/AMH_Install_WordPress/33.png "fig:")

耗时37分钟LNMP环境的AMH面板安装成功。

输入访问地址登录主机面板：https://你的IP:9999，使用生成的账号密码验证码进行登录：

![]({{site.baseurl}}/img/AMH_Install_WordPress/34.png "fig:")

主面板上有五项内容，服务器CPU信息、服务器磁盘信息、服务器网卡流量图表、服务器内存信息、服务器系统信息。在服务器系统信息中先同步服务器的系统时间。

接下来你可以在AMH面板上管理服务器上的网站和数据库，不需要使用SSH连接服务器了，在主机面板上可以操控服务器上的一切设置。

![]({{site.baseurl}}/img/AMH_Install_WordPress/35.png "fig:")

点击右上角的设置，在设置中可以修改访问端口，以及注册授权账户，现在AMH的授权账户是免费申请的，只需要在官网注册即可。

![]({{site.baseurl}}/img/AMH_Install_WordPress/36.png "fig:")

授权账户的注册也很简单，输入账号密码后，验证手机就可以了！之后你就可以在软件商店中安装服务器应用软件，一些需要购买授权的软件都是些专业级别的软件，新手用户基本上用不上，需要的时候再充值购买。

![]({{site.baseurl}}/img/AMH_Install_WordPress/37.png "fig:")

在软件商店中，有些可以安装的软件，按需安装即可。

![]({{site.baseurl}}/img/AMH_Install_WordPress/38.png "fig:")

如果想成功搭建一个博客站点，你需要在软件商店中安装如下软件。

- **CDN反向代理**

- **伪静态规则**

- **SSL证书管理**

- **Memcached缓存软件**

- **Memcached PHP客户端加强版**

- **Redis缓存软件**

- **Redis PHP客户端**

- **dovecot+postfix+amsmtp(可选)**

下面详细说明一下软件功能：

**CDN反向代理**

更新升级至lngx-2.6版本。增加WebSocket(ws)反代选项，修复关闭或启动缓存https配置没更新问题，增加ipv6监听选项，修复网站存在并发限制、宽带限速或流量防护CDN模式时更换环境nginx出错问题，修复虚拟主机列表点击规则文件跳转切换了环境管理问题。AMH-LNGX反向代理的环境模块。LNGX即为Linux+Nginx+X，其中X为未限定。lngx网站环境提供支持缓存管理与设置反代站点，支持在线关键字添加、替换，支持设置不同类型文件替换、与支持添加自定义首尾html代码块等。您可以创建lngx环境做为其它环境应用前端，如在不同位置建立lngx环境并开启缓存做为站点的CDN加速镜像等。

**伪静态规则**

更新升级至amrewrite-2.0版本，增加防盗链规则设置选项，简化命令行运行，修复子域主机规则列表没显示关联问题，优化域名跳转、URL重写选项，调整与添加4个默认的新规则。AMRewrite是AMH面板环境主机URL重写模块，模块提供添加、编辑、删除规则、维护规则文件并校验规则正确性。

**SSL证书管理**

更新升级至amssl-3.6(v17)版本，更新修复应用证书默认站点没开启问题，修复有ipv6监听时，ipv4没能开启http2问题。AMSSL是AMH面板的HTTPS
/ SSL证书支持模块，支持自定义配置证书、支持Lets
Encrypt证书一建自动快速部署(文件验证或DNS验证泛域名通配证书)、自动续期功能，支持证书优化、http/2、强制https(HSTS)等功能，支持的AMH环境有LNMP、LAMP、LNMH、LNGX。HTTPS是以SSL为基础的创建安全加密的HTTP通道，即HTTP的安全版。AMSSL模块支持在线自定义生成KEY私钥、CSR签名、CRT证书文件，与支持数据输入方式管理证书，为环境的虚拟主机开通HTTPS
/ SSL访问支持。

**Memcached缓存软件**

更新至1.6.18版本兼容最新的gcc12.2安装。Memcached
是一个高性能的分布式内存对象缓存系统，用于动态Web应用以减轻数据库负载。它通过在内存中缓存数据和对象来减少读取数据库的次数，从而提高动态、数据库驱动网站的速度。

**Memcached PHP客户端加强版**

更新升级到pecl_memcached-3.1(v5)版本，支持最新PHP8.0。pecl_memcache与pecl_memcached都为Memcached软件的php扩展，两者功能有些差别后者为前者的增强版。Memcached(客户端/php扩展)是一个可以应对任意多个连接，使用非阻塞的网络IO的缓存项目。由于它的工作机制是在内存中开辟一块空间，然后建立一个HashTable，Memcached便会自管理这些HashTable。

**Redis缓存软件**

更新至最新Redis-6.2.6(v3)版本，优化停止程序，处理有使用密码时停止redis失败问题。Redis是一个高性能开源的key-value数据库，Redis使用ANSI
C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。Redis和Memcached类似，它支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(有序集合)和hash(哈希类型)。

**Redis PHP客户端**

升级至pecl_redis-5.3版本，兼容支持最新的php8.0，可选择安装pecl_redis2.2、4.3或5.3版本。pecl_redis是AMH面板Redis软件的php环境扩展模块。Redis是一个高性能开源的key-value数据库，pecl_redis为Redis的PHP环境接口扩展模块，PHP环境使用Redis需要安装此扩展。

**如需邮件服务，还需安装dovecot+postfix+amsmtp搭建SMTP邮局。**

## 免责声明

* 项目内所涉及脚本、LOGO 仅为资源共享、学习参考之目的，不保证其合法性、正当性、准确性；切勿使用项目做任何商业用途或牟利；
* 遵循避风港原则，若有图片和内容侵权，请在 Issues 告知，核实后删除，其版权均归原作者及其网站所有；
* 本人不对任何内容承担任何责任，包括但不限于任何内容错误导致的任何损失、损害;
* 其它人通过任何方式登陆本网站或直接、间接使用项目相关资源，均应仔细阅读本声明，一旦使用、转载项目任何相关教程或资源，即被视为您已接受此免责声明。
* 本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。
* 本项目涉及的数据由使用的个人或组织自行填写，本项目不对数据内容负责，包括但不限于数据的真实性、准确性、合法性。使用本项目所造成的一切后果，与本项目的所有贡献者无关，由使用的个人或组织完全承担。
* 本项目中涉及的第三方硬件、软件等，与本项目没有任何直接或间接的关系。本项目仅对部署和使用过程进行客观描述，不代表支持使用任何第三方硬件、软件。使用任何第三方硬件、软件，所造成的一切后果由使用的个人或组织承担，与本项目无关。
* 本项目中所有内容只供学习和研究使用，不得将本项目中任何内容用于违反国家/地区/组织等的法律法规或相关规定的其他用途。
* 所有基于本项目源代码，进行的任何修改，为其他个人或组织的自发行为，与本项目没有任何直接或间接的关系，所造成的一切后果亦与本项目无关。
* 所有直接或间接使用本项目的个人和组织，应24小时内完成学习和研究，并及时删除本项目中的所有内容。如对本项目的功能有需求，应自行开发相关功能。
* 本项目保留随时对免责声明进行补充或更改的权利，直接或间接使用本项目内容的个人或组织，视为接受本项目的特别声明。
