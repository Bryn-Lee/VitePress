# 升级 Nginx 到 1.24.0-1 版本操作示例

本文以升级 Nginx 版本为 1.24.0-1 为例，其他版本可参考此文档进行操作。

## 步骤：

### 1. 备份 Nginx 配置文件及证书

在进行升级前，备份以下重要文件：

- Nginx 配置文件
- SSL 证书文件

### 2. 检查 Nginx 服务状态

使用以下命令检查 Nginx 服务是否在运行，并停止服务：

```shell
ps -ef | grep nginx
```

若 Nginx 正在运行，停止 Nginx 服务：

```shell
systemctl stop nginx
```

### 3. 查找并删除 Nginx 相关文件

- 查找 Nginx 文件位置：

```shell
whereis nginx
```

示例输出：

```shell
nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz
```

- 使用 `find` 命令查找所有 Nginx 相关文件：

```shell
find / -name nginx
```

示例输出：

```shell
/usr/lib64/perl5/vendor_perl/auto/nginx
/usr/lib64/nginx
/usr/share/nginx
/usr/sbin/nginx
/etc/nginx
/var/lib/nginx
/var/log/nginx
```

- 逐一删除查找到的相关文件和目录：

```shell
rm -rf /usr/sbin/nginx
rm -rf /usr/lib64/nginx
rm -rf /usr/share/nginx
rm -rf /etc/nginx
rm -rf /var/lib/nginx
rm -rf /var/log/nginx
```

### 4. 下载 RPM 离线安装包

从 Nginx 官方网站下载对应版本的 RPM 包：

- 下载地址：[http://nginx.org/packages/centos/7/x86_64/RPMS/](http://nginx.org/packages/centos/7/x86_64/RPMS/)
- 下载文件：`nginx-1.24.0-1.el7.ngx.x86_64.rpm`

### 5. 安装 Nginx 新版本

- 将下载好的 RPM 包上传至服务器，进入对应目录，执行安装命令：

```shell
rpm -ivh nginx-1.24.0-1.el7.ngx.x86_64.rpm
```

- 将之前备份的配置文件放回 `/etc/nginx/conf.d/` 目录。
- 将备份的证书文件放入 `/etc/nginx/certs/` 目录。
- 修改配置文件中的证书路径为新文件位置。

### 6. 安装目录

- Nginx 安装目录：`/etc/nginx/`
- Nginx 配置目录：`/etc/nginx/conf.d/`
- Nginx 证书目录：`/etc/nginx/certs/`
- Nginx 可执行文件：`/usr/bin/nginx`

### 7. 后续版本升级

若需要升级到新版本，使用以下命令：

```shell
rpm -Uvh 新版本rpm包
```

### 8. 常用命令

- 查看 Nginx 版本及安装路径：

```shell
nginx -V
```

- 查看 Nginx 服务状态：

```shell
systemctl status nginx
```

- 启动 Nginx 服务：

```shell
systemctl start nginx
```

- 重启 Nginx 服务：

```shell
systemctl restart nginx
```

- 停止 Nginx 服务：

```shell
systemctl stop nginx
```

- 卸载 Nginx：

```shell
rpm -e nginx
```
