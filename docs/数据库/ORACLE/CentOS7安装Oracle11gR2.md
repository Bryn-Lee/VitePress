# 安装过程

### 创建运行oracle数据库的系统用户和用户组

```bash
# 1.切换到root
su root

# 2.创建用户组oinstall
groupadd oinstall

# 3.创建用户组dba
groupadd dba

# 4.创建oracle用户，并加入到oinstall和dba用户组
useradd -g oinstall -g dba -m oracle

# 5.修改oracle密码
passwd oracle

＃ 6.查看用户组
id oracle
```

> 关于创建oinstall用户组及dba组的用途，可参考[此链接](http://www.oracle.com/technetwork/cn/articles/hunter-rac11gr2-iscsi-2-092412-zhs.html#13)。
> 
> - 理论上单例安装需要3种用户组，实际只建两个oinstall和dba，后面再安装oracle数据库的时候把OSOPER组也设置是dba组。
> - 下面是关于三个用户组的介绍:
> 
> > 1. **oracle清单组**（一般为oinstall):  
> >     被视为 Oracle 软件的**“所有者”**，拥有对 Oracle 中央清单 (oraInventory) 的写入权限。在一个 Linux 系统上首次安装 Oracle 软件时，OUI 会创建 **/etc/oraInst.loc** 文件。该文件指定 Oracle 清单组的名称（默认为 oinstall）以及 Oracle 中央清单目录的路径。
> > 2. **数据库管理员组**（OSDBA，一般为 dba）:  
> >     可通过操作系统身份验证使用 SQL 以 SYSDBA 身份连接到一个 Oracle 实例。该组的成员可执行关键的数据库管理任务，如创建数据库、启动和关闭实例。该组的默认名称为dba。**SYSDBA**系统权限甚至在数据库未打开时也允许访问数据库实例。对此权限的控制完全超出了数据库本身的范围。  
> >     不要混淆 **SYSDBA** 系统权限与数据库角色 **DBA** 。**DBA** 角色不包括 **SYSDBA** 或 **SYSOPER** 系统权限。
> > 3. **数据库操作员组**（OSOPER，一般为 oper）:  
> >     可通过操作系统身份验证使用 SQL 以 **SYSOPER** 身份连接到一个 Oracle 实例。这个可选组的成员拥有一组有限的数据库管理权限，如管理和运行备份。  
> >     该组的默认名称为**oper**，SYSOPER 系统权限甚至在数据库未打开时也允许访问数据库实例。对此权限的控制完全超出了数据库本身的范围。

### 创建oracle数据库安装目录

```bash
# 创建安装文件夹
# oracle:数据库安装目录
# oraInventory:数据库配置文件目录
# database:据库软件包解压目录
mkdir -p /data/{oracle,oraInventory,database}

#设置目录所有者为oinstall用户组的oracle用户
chown -R oracle:oinstall /data/oracle　　
chown -R oracle:oinstall /data/oraInventory
chown -R oracle:oinstall /data/database
```

### 修改操作系统系统标识

```bash
# 查看内核版本
cat /proc/version

# 查看发行版
cat /etc/redhat-release

# 修改发行版（若为centos7.xx 修改为 redhat-7）
vim /etc/redhat-release
```

> 修改系统标识的原因：oracle不支持centos，详情可参考[此链接](https://docs.oracle.com/cd/E11882_01/install.112/e47689/pre_install.htm#LADBI1106)。

### 安装相关依赖

```language
sudo yum -y install binutils* compat-libcap1* compat-libstdc++* gcc* gcc-c++* glibc* glibc-devel* ksh* libaio* libaio-devel* libgcc* libstdc++* libstdc++-devel* libXi* libXtst* make* sysstat* elfutils* unixODBC*

# 若 ceontos8 出现 There was an error trying to initialize the HPI library.
# 执行如下指令
sudo yum -y install xz wget gcc-c++ ncurses ncurses-devel \
cmake make perl openssl openssl-devel gcc* libxml2 \
libxml2-devel curl-devel libjpeg* libpng* freetype* \
make gcc-c++ cmake bison perl perl-devel perl perl-devel \
glibc-devel.i686 glibc-devel libaio readline-devel \
zlib.x86_64 zlib-devel.x86_64 libcurl-* net-tool* \
sysstat lrzsz dos2unix telnet.x86_64 iotop unzip \
ftp.x86_64 xfs* expect vim psmisc openssh-client* \
libaio bzip2 epel-release automake binutils bzip2 \
elfutils expat gawk gcc --skip-broken ksh less make openssh-server \
rpm sysstat unzip unzip cifs-utils libXext.x86_64 \
glibc.i686 binutils compat-libstdc++-33 \
elfutils-libelf elfutils-libelf-devel \
expat gcc gcc-c++ glibc glibc-common \
glibc-devel glibc-headers libaio \
libaio-devel libgcc libstdc++ libstdc++-devel \
make sysstat unixODBC unixODBC-devel libnsl
```

> 以上指令基本可以安装所有依赖，oracle11g所需依赖可参考该[链接](https://docs.oracle.com/cd/E11882_01/install.112/e47689/pre_install.htm#BABCFJFG)。

#### 安装过程中可能出现的错误

1. error in invoking target install of makefile ... **ins_ctx.mk**,需要安装如下依赖。

```bash
sudo yum install -y glibc-devel.i686
```

### 关闭防火墙

```bash
sudo systemctl stop firewalld
```

### 关闭selinux（需要重启系统）

```bash
#  修改配置文件
sudo vim /etc/selinux/config

# 修改如下配置，此处修改为disabled
SELINUX=disabled 

# 重启系统(若本身配置为disabled，无需重启)
sudo reboot
```

### 修改内核参数

```bash
# 编辑配置文件
sudo vim /etc/sysctl.conf

# 加入如下配置信息
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
fs.file-max = 6815744 #设置最大打开文件数
fs.aio-max-nr = 1048576
kernel.shmall = 2097152 #共享内存的总量，8G内存设置：2097152*4k/1024/1024
kernel.shmmax = 2147483648 #最大共享内存的段大小
kernel.shmmni = 4096 #整个系统共享内存端的最大数
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500 #可使用的IPv4端口范围
net.core.rmem_default = 262144
net.core.rmem_max= 4194304
net.core.wmem_default= 262144
net.core.wmem_max= 1048576

# 配置参数生效
sudo sysctl -p
```

### 对oracle用户设置限制，提高软件运行性能。

```bash
# 编辑配置文件
sudo vim /etc/security/limits.conf

#找到 @student 在 @student 和 End of file之间添加如下内容
#@student        -       maxlogins       4
oracle soft nproc 2047
oracle hard nproc 16384
oracle soft nofile 1024
oracle hard nofile 65536
# End of file
```

### 配置Oracle用户变量

```bash
# 编辑配置文件
vim /home/oracle/.bash_profile

# 文件末尾追加如下配置
export ORACLE_BASE=/data/oracle #oracle数据库安装目录
export ORACLE_HOME=$ORACLE_BASE/product/11.2.0/db_1 #oracle数据库路径
export ORACLE_SID=orcl #oracle启动数据库实例名
export ORACLE_TERM=xterm #xterm窗口模式安装
export PATH=$ORACLE_HOME/bin:/usr/sbin:$PATH #添加系统环境变量
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib #添加系统环境变量
export LANG=C #防止安装过程出现乱码
export NLS_LANG=AMERICAN_AMERICA.ZHS16GBK  #设置Oracle客户端字符集，必须与Oracle安装时设置的字符集保持一致，如：ZHS16GBK，否则出现

# 使配置立即生效
source /home/oracle/.bash_profile

#重启系统
sudo reboot
```

>  接下来的操作需要用到桌面系统，参考[本文](http://blog.rovan.site/archives/2020031901)进行安装

### 上传安装包并解压

```bash
# 逐个上传
scp linux.x64_11gR2_database_1of2.zip oracle@xxx.xxx.xxx.xxx:/home/oracle
scp linux.x64_11gR2_database_2of2.zip oracle@xxx.xxx.xxx.xxx:/home/oracle

# 解压到指定路径
unzip linux.x64_11gR2_database_1of2.zip -d /data/database/
unzip linux.x64_11gR2_database_2of2.zip -d /data/database/

# 修改所有权
chown -R oracle:oinstall /data/database/database/
```

### 安装Oracle

#### 1. 使用oracle用户登录桌面，安装

```bash
# 执行安装程序
cd /data/database/database && ./runInstaller
# 如果弹出对话框过小可以使用jdk8
./runInstaller -jreLoc /usr/local/jdk1.8.0_241/jre
```

#### 2. 设置不需要安全更新

![ora_install_step1](http://blog.rovan.site/upload/2020/3/ora_install_step1-c57cac8fe8a940d9bc8ec794d709a94b.png)

#### 3. 选择只安装数据库软件

![ora_install_step2](http://blog.rovan.site/upload/2020/3/ora_install_step2-b9d164a0be1a400cb578066094e35d04.png)

#### 4. 选择单例安装

![ora_install_step3](http://blog.rovan.site/upload/2020/3/ora_install_step3-bf0ae0e6ced44b6cb6e3941a34a2f7cb.png)

#### 5. 添加语言

![ora_install_step4](http://blog.rovan.site/upload/2020/3/ora_install_step4-83eade42532e49428e5d55f96db468ac.png))

#### 6. 选择安装企业版本

![ora_install_step5](http://blog.rovan.site/upload/2020/3/ora_install_step5-2c7dfd7ee2fb4f48a3040beae3689b83.jpg)

#### 7. 数据软件的安装路径，自动读取前面Oracle环境变量中配置的值。

![ora_install_step6](http://blog.rovan.site/upload/2020/3/ora_install_step6-660f2ceb52784c5b8546a400c48546e5.png)

#### 8.理论上要创建oper用户组,这里直接采用dba用户组

![ora_install_step7](http://blog.rovan.site/upload/2020/3/ora_install_step7-b5e889caec204d8a90443abc41956614.png)

#### 9. 安装检查，按照提示信息逐个解决（没有致命错误建议忽略）

> 虚拟内存可以根据实际情况选择添加，参见此[链接](http://blog.rovan.site/archives/2020022902)

![ora_install_step8](http://blog.rovan.site/upload/2020/3/ora_install_step8-d9013086fe8a41d382f2251592cc20e5.png)  
![ora_install_step9](http://blog.rovan.site/upload/2020/3/ora_install_step9-074e287606a8413e974e8335079de8d8.png)

#### 10. 准备完毕，点击“Finish”开始安装

![ora_install_step10](http://blog.rovan.site/upload/2020/3/ora_install_step10-df91d942251f49729f1ce52aa74a167a.png)

#### 11. 安过程中可能弹出几次提示，将提示窗口拉大才能看清，按照提示解决问题即可。

![ora_install_step11](http://blog.rovan.site/upload/2020/3/ora_install_step11-c4b311b58f6441328eb2bb4dada82e10.png)

- 关于 `Error in invoking target 'agent nmhs' of makefile /data/oracle/product/11.2.0/db_1/sysman/lib/ins_emagent.mk` 问题可以参照此[文章](http://blog.itpub.net/29475508/viewspace-2120836/)。

#### 12. 安装成功

![ora_install_step12](http://blog.rovan.site/upload/2020/3/ora_install_step12-ca6021762887466faa205a55b85b6025.png)

### 配置Oracle

#### 使用配置文件配置

```bash
# 启动监听器
lsnrctl start

# 创建实例（建库）
cd /data/oracle/product/11.2.0/db_1/inventory/response/
cp dbca.rsp dbca.rsp.bak
vim dbca.rsp

# 修改如下内容
GDBNAME= "orcl"
SID = "orcl"
CHARACTERSET = "AL32UTF8"
SYSPASSWORD = "123456"  #指定sys用户密码
SYSTEMPASSWORD = "123456" #指定system用户密码

#赋权限
chmod a+x dbca.rsp

# 创建实例
dbca -silent -responseFile etc/dbca.rsp
```

> 推荐有安装经验者直接使用配置文件进行安装，需要注意的是配置**密码**时不要包含 **“@”**，具体情况可参见[文章](https://stackoverflow.com/questions/4646752/ora-12532-tnsinvalid-argument)。

#### 使用图形化配置

- 图形化配置可参考此[文章](https://www.jianshu.com/p/74c677c49c82)。

2. 配置监听

```bash
netca
```

![ora_install_netca](http://blog.rovan.site/upload/2020/3/ora_install_netca-2b5e393a95a84b92b26bc79a9a2e0f3f.png)

3. 配置实例

```bash
dbca
```

![ora_install_dbca](http://blog.rovan.site/upload/2020/3/ora_install_dbca-dcd82b0d447a4f56a4a2ab7bf3c609b7.png)

#### 关于打补丁

在导入数据时可能会出现`Oracle ORA-14102: 只能指定一个 LOGGING 或 NOLOGGING 子句`的错误，需要打补丁。补丁安装教程参照此[文章](https://www.cnblogs.com/badmemoryneedbadpen/p/4642675.html)。

- 补丁下载大部分收费，知道具体补丁号可去此[网站](https://www.4shared.com/)下载。
- 关于 ORA-14102 解决补丁，可从此处下载。
    1. opatch`11.0.0.3.15` [p6880880_112000_Linux-x86-64.zip](http://blog.rovan.site/upload/2020/3/p6880880_112000_Linux-x86-64%2011.2.0.3.15-a1f556da06df4c08b5101783cd010235.zip)
    2. 补丁`12419378` [p12419378_112010_Linux-x86-64.zip](http://blog.rovan.site/upload/2020/3/p12419378_112010_Linux-x86-64-27e3d3be289d4383bcaf12bbca373c44.zip)
    3. 补丁`8795792`可不安装，在`12419378`中包含 [p8795792_112010_Generic.zip](http://blog.rovan.site/upload/2020/3/p8795792_112010_Generic-e2a3fc2fdbda42bdb46aa354338990f5.zip)

#### 设置数据库实例开机启动

```bash
# 编辑配置文件
sudo vim /etc/rc.d/rc.local

# 加入如下内容
su - oracle -c "lsnrctl start"
su - oracle -c "dbstart"

# 因为在centos7中rc.local的权限被降低了，所以需要赋予其可执行权限
sudo chmod +x /etc/rc.d/rc.local
```

#### 常见操作

```bash
# 启动监听
lsnrctl start

# 进入sqlplus
sqlplus /nolog

# 连接到sysdba
SQL> conn /as sysdba

# 启动数据库实例
SQL> startup 

# 数据库启动使用startup命令，有三种情况：
#    第一种：不带参数，启动数据库实例并打开数据库，以便用户使用数据库，在多数情况下，使用这种方式！
#    第二种：带nomount参数，只启动数据库实例，但不打开数据库，在你希望创建一个新的数据库时使用，或者在你需要这样的时候使用！
#    第三种：带mount参数，在进行数据库更名的时候采用。这个时候数据库就打开并可以使用了！

# 关闭数据库实例
SQL> shutdown immediate
#shutdown有四个参数，四个参数的含义如下：
#    Normal 需要在所有连接用户断开后才执行关闭数据库任务，所以有的时候看起来好象命令没有运行一样！在执行这个命令后不允许新的连接
#    Immediate 等待用户完成当前的语句，在用户执行完正在执行的语句后就断开用户连接，并不允许新用户连接。
#    Transactional 等待用户完成当前的事务，在拥护执行完当前事物后断开连接，并不允许新的用户连接数据库。
#    Abort 不做任何等待，直接关闭数据库，执行强行断开连接并直接关闭数据库。

# 查看实例名
> select name from v$database;
> select instance_name from v$instance;

# 查看当前使用的数据文件
> select name from v$datafile;

# 修改用户密码
alter user system identified by ******;

# 解锁用户
alter user system account unlock;
```

#### 配置备份目录及导入导出

4. 配置目录

```bash
# 创建数据备份还原使用的文件夹
su oracle && mkdir -p /data/oracle/bak_dir

# 使用数据库管理员用户登录
sqlplus / as sysdba

# 添加文件夹
SQL> create directory bak_dir as '/data/oracle/bak_dir';

# 查看文件夹
SQL> select * from dba_directories;

# 给普通用户赋使用权限
SQL> grant read,write on directory bak_dir to someone;
```

5. 导入导出

```bash
# 导入数据 方式一
# table_exists_action : SKIP、APPEND、REPLACE、TRUNCATE
impdp username/password directory=bak_dir table_exists_action=replace remap_schema=sourceUser:targetUser dumpfile=20200324.DMP logfile=20200324.log full=y remap_tablespace=sourceTableSpace:targetTablespace

# 导入数据 方式二
# transform=oid:n 生成新的oid 解决 ORA-02304 ORA-02304: invalid object identifier literal
impdp username/password directory=bak_dir table_exists_action=replace remap_schema=sourceUser:targetUser dumpfile=20200324.DMP logfile=20200324.log

# 导入示例：
grant IMP_FULL_DATABASE to bsft01;
grant read,write on directory bak_dir to bsft01;
impdp bsft01/bsft01@amoebadb directory=bak_dir remap_schema=amoeba02:bsft01 dumpfile=AMOEBA200324.DMP logfile=bsft01_imp.log TABLE_EXISTS_ACTION=REPLACE transform=oid:n remap_tablespace=EAS_D_AMOEBA02_STANDARD:EAS_D_BSFT01_STANDARD

# 导出数据 方式一
# 赋文件夹操作权限 grant read,write on directory bak_dir to user;
# 导入需要赋导入权限（及文件夹操作权限） grant IMP_FULL_DATABASE to user;
# 删除权限 revoke read,write on directory from user;
expdp username/password@orcl schemas=user directory=bak_dir dumpfile=20200323.dmp logfile=20200323.log
```

### 表空间操作

```bash
# 添加表空间示例
ALTER TABLESPACE  EAS_D_XXXX_STANDARD
ADD DATAFILE '/oracleData/EAS_D_XXXX_STANDARD1.ORA'
SIZE 500M
AUTOEXTEND 
ON  NEXT 100M 
MAXSIZE UNLIMITED;

ALTER TABLESPACE  EAS_D_XXXX_STANDARD
ADD DATAFILE '/oracleData/EAS_D_XXXX_STANDARD2.ORA'
SIZE 500M
AUTOEXTEND 
ON  NEXT 100M 
MAXSIZE UNLIMITED;

# 删除用户及表空间示例
select tablespace_name from dba_tablespaces;
drop user xxxx cascade;
DROP TABLESPACE EAS_D_XXXX_TEMP2 INCLUDING CONTENTS AND DATAFILES;
DROP TABLESPACE EAS_D_XXXX_STANDARD INCLUDING CONTENTS AND DATAFILES;
DROP TABLESPACE EAS_T_XXXX_STANDARD INCLUDING CONTENTS AND DATAFILES;
DROP TABLESPACE EAS_D_XXXX_INDEX INCLUDING CONTENTS AND DATAFILES;

# 添加临时表空间示例
create temporary tablespace EAS_D_XXX_TEMP3 tempfile '/oracleData/EAS_D_XXX_TEMP3.dbf' size 1024M autoextend on;
alter user xxx temporary tablespace EAS_D_XXX_TEMP3;


# 删除表空间的数据文件
alter tablespace EAS_D_XXX_STANDARD drop datafile  '/oracleData/EAS_D_XXX_STANDARD.ora';
```
