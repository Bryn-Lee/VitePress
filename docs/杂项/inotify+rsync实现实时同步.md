## rsync服务端部署

1. 安装rsync，查看软件是否存在

   ```shell
   [root@localhost /]# rpm -qa |grep rsync
   rsync-3.1.2-10.el7.x86_64
   ```

   不存在使用 rpm包安装

   ```shell
   rpm -ivh rsync-3.1.2-10.el7.x86_64.rpm
   ```

2. 服务配置

   可参考 server/rsyncd.conf 

   ```shell
   [root@localhost /]# vim /etc/rsyncd.conf 
   #用户id 
   uid = root
   #组id
   gid = root
   #开启，禁锢在源目录
   use chroot = yes
   #监听地址
   #address = 192.168.1.1
   #默认端口号为873
   #port 873
   #日志文件存放位置
   log file = /var/log/rsyncd.log
   #存放进程id的文件位置
   #pid file = /var/run/rsyncd.pid
   #允许访问的主机网段
   #hosts allow = 192.168.1.0/24
   #共享模块的名称
   [unicenter]      
   #源目录路径，可以修改为自定义路径
   path = /unicenter_backup
   #
   comment = Document Root of unicenter
   #是否为只读
   read only = no
   #同步时不再压缩的文件类型
   dont comperss = *.gz *.bz2 *.tgz *.zip *.rar *.z
   #授权用户，多个账户以空格隔开
   auth users = rsync
   #存放账号信息的数据文件，一行一个，权限 600
   secrets file = /etc/rsyncd_users.db
   ```

   3.创建认证用户密码文件并进行授权

    固定格式为[名称:密码]，赋权600

   ```shell
   echo "rsync:unicenter" >>/etc/rsyncd_users.db
   chmod 600 /etc/rsyncd_users.db
   ```

   4.启动rsync服务

   ```shell
   rsync --daemon
   ```

   至此服务端配置完成

   ```shell
   [root@localhost /]#  ps -ef |grep rsync 
   root      4975 32099  0 16:11 pts/0    00:00:00 grep --color=auto rsync
   root     12361     1  0 15:48 ?        00:00:00 rsync --daemon
   ```

## rsync客户端配置

1. 安装rsync，查看软件是否存在

   ```shell
   [root@localhost /]# rpm -qa |grep rsync
   rsync-3.1.2-10.el7.x86_64
   ```

   不存在使用 rpm包安装

   ```shell
   rpm -ivh rsync-3.1.2-10.el7.x86_64.rpm
   ```

2. 上传 client中的 AutoBackup 文件夹 至服务器

3. 修改权限600

   ```shell
   chmod 600 /AutoBackup/rsync.password
   ```

   修改执行权限

   ```shell
   chmod +x /AutoBackup/unicenter_auto_backup.sh
   ```

   修改 config.sh

   ```shell
   [root@localhost AutoBackup]# vim config.sh 
   #需要备份路径
   SRC=/unicenter/unicenter-sync/
   #备份目标服务器
   Server=192.168.1.1
   #备份操作员
   User=rsync
   #
   Module=unicenter
   ```

## 部署inotify服务

1. 安装inotify，查看软件是否存在

   ```shell
   [root@localhost /]# rpm -qa |grep inotify-tools
   inotify-tools-3.14-9.el7.x86_64
   ```
   
   不存在使用 rpm包安装
   
   ```shell
   rpm -ivh inotify-tools-3.14-9.el7.x86_64.rpm
   ```

## 后台运行

1. 启动后台运行：

   ```shell
   [root@localhost AutoBackup]# nohup sh unicenter_auto_backup.sh &
   ```

2. 查看运行情况：

   ```shell
   [root@localhost AutoBackup]# jobs
   [1]+  Running                 nohup sh unicenter_auto_backup.sh &
   [root@localhost AutoBackup]# 
   ```

3. 终止后台运行

   ```shell
   [root@localhost AutoBackup]# ps -aux | grep unicenter_auto_backup
   root     11788  0.0  0.0 113284  1404 pts/2    S    16:44   0:00 sh unicenter_auto_backup.sh
   root     11790  0.0  0.0 113284   384 pts/2    S    16:44   0:00 sh unicenter_auto_backup.sh
   root     12119  0.0  0.0 112812   976 pts/2    R+   16:48   0:00 grep --color=auto unicenter_auto_backup
   [root@localhost AutoBackup]# kill -9 11788 11790
   [root@localhost AutoBackup]# ps -aux | grep unicenter_auto_backup
   root     12183  0.0  0.0 112812   976 pts/2    S+   16:49   0:00 grep --color=auto unicenter_auto_backup
   [1]+  Killed                  nohup sh unicenter_auto_backup.sh
   [root@localhost AutoBackup]# 
   ```

当备份路径下发生文件变更，会自动同步到目标服务器下。

## 设置开机启动

1. 添加开机自动执行脚本

   ```shell
   chmod +x /etc/rc.d/rc.local
   echo '/AutoBackup/unicenter_auto_backup.sh' >> /etc/rc.d/rc.local
   #添加开机自动执行脚本
   ```

   