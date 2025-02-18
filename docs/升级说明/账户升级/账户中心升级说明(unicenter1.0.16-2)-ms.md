# 账户中心系统版本

| 模块    | 升级前版本号            | 升级后版本号            |
| ----- | ----------------- | ----------------- |
| 系统版本号 | unicenter1.0.16-1 | unicenter1.0.16-2 |
| v8s   | v1.1.0.1_P2       |                   |

# 升级说明

## 1.  升级时间

当天开户部门工作结束。

# 升级步骤

## 2.  停止账户中心应用服务

执行/unicenter/unicenter_stop.sh 停止所有的进程。执行ps -ef|grep java检查是否存在遗留进程。
```shell
[root@localhost /]# cd /
[root@localhost /]# cd unicenter/
[root@localhost unicenter]# ./unicenter_stop.sh
[root@localhost unicenter]# ps -ef|grep java
```

## 3.  备份应用程序

1)   登录应用程序服务器，执行/unicenter/backup/backup.sh备份所有程序包。
```shell
[root@localhost /]# cd /
[root@localhost /]# cd unicenter/backup/
[root@localhost backup]# ./backup.sh
```
2)   将 脚本/应用服务 中 update.sh 上传至/unicenter/update/中，存在则替换。

## 4.  升级数据库

1)   登录数据库服务器，将 脚本/数据库 中的ora_backup文件夹上传至根目录，存在则替换。并用oracle用户赋权限；

2)   执行/ora_backup/unicenter_expdp.sh 备份数据库；备份成功会在/ora_backup中产生一个日期文件夹，里面存在一个dmp数据文件，文件不存在或文件过小则备份不成功。
```shell
[oracle@localhost ~]$ cd /
[oracle@localhost /]$ cd ora_backup
[oracle@localhost ora_backup]$ ./unicenter_expdp.sh
```
3)   将 脚本/数据库 中的ora_update文件夹上传至根目录，存在则删除替换。并用oracle用户赋权限；
```shell
[oracle@localhost /]$ chown oracle:oinstall –R /ora_update
[oracle@localhost /]$ chmod  +x  /ora_update/unicenter_database_update.sh
```
4)   将 数据库 中的所有文件上传至/ora_update/update下

5)   oracle用户执行/ora_update/unicenter_database_update.sh
```shell
[oracle@localhost /]$ cd /
[oracle@localhost /]$ cd ora_update/
[oracle@localhost ora_update]$ ./unicenter_database_update.sh
```
## 5.  升级应用程序

1)   登录应用程序服务器，将tomcat文件夹上传至/unicenter/update/中

2)   执行/unicenter/update/update.sh
```shell
[root@localhost /]# cd unicenter/update/
[root@localhost update]# ./update.sh
```

## 6.  启动所有程序

执行/unicenter/unicenter_start.sh 启动所有的程序，升级完成。执行ps -ef|grep java检查进程是否正常启动。
```shell
[root@localhost /]# cd /
[root@localhost /]# cd unicenter/
[root@localhost unicenter]# ./unicenter_start.sh
[root@localhost unicenter]# ps -ef|grep java
```