任何软件都会存在这样或者那样的缺陷、Bug，Oracle也不例外。对于生产运维人员来说，定期升级系统、打补丁是日常工作中不可缺少的部分。

相对于过去的版本，Oracle打补丁的方式已经变得比较简单，处理PSU的方法也发生了一些变化。在11g中，对于一些小bug的修复，我们可以使用OPatch工具进行补丁修复。对于大的版本升级，Oracle的PSU实际上就是一系列全新的安装文件，从MOS上下载之后就可以直接进行安装。

本篇主要介绍一下如何在11g下面使用OPatch进行打补丁。

## 1、环境介绍

我们选择11gR2作为实验环境。

```shell
SQL> select * from v$version;
BANNER
--------------------------------------------------------------------------------
Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - Production
PL/SQL Release 11.2.0.1.0 - Production
CORE        11.2.0.1.0         Production
```

在安装目录$ORACLE_HOME下，是自带一个OPatch工具包的。一般小版本的升级，都是通过OPatch来完成。

```shell
[oracle@bsplinux ~]$ cd $ORACLE_HOME
[oracle@bsplinux oracle]$ ls -l | grep OPatch
drwxr-xr-x  8 oracle oinstall    4096 Oct 23 20:00 OPatch
```

不过，同Oracle自带的Uninstall一样，11.2.0.1自带的OPatch的版本是不能提供升级功能的。所以，我们通常需要首先升级OPatch，之后才能进行打补丁。

## 2、OPatch升级

首先，我们需要确定当前的OPatch版本。进入OPatch目录之后，可以通过版本首先确认。

```shell
[oracle@bsplinux OPatch]$ ls -l
total 92
drwxr-xr-x 2 oracle oinstall  4096 May 22 16:16 docs
-rw-r--r-- 1 oracle oinstall 21576 May  6  2009 emdpatch.pl
drwxr-xr-x 2 oracle oinstall  4096 May 22 16:16 jlib
drwxr-xr-x 5 oracle oinstall  4096 May 22 16:16 ocm
-rwxr-xr-x 1 oracle oinstall  8709 May  6  2009 opatch
-rw-r--r-- 1 oracle oinstall    49 May 22 16:22 opatch.ini
-rw-r--r-- 1 oracle oinstall  2576 May  6  2009 opatch.pl
drwxr-xr-x 4 oracle oinstall  4096 May 22 16:16 opatchprereqs
[oracle@bsplinux OPatch]$ ./opatch version
Invoking OPatch 11.1.0.6.6
OPatch Version: 11.1.0.6.6
OPatch succeeded.
```

11.2.0.1自带的OPatch版本为11.1.0.6.6，我们需要首先升级OPatch。第一步是进行原有OPatch备份。

```shell
[oracle@bsplinux oracle]$ tar zcvf opatch_bk.tar OPatch
OPatch/
OPatch/opatchprereqs/
OPatch/opatchprereqs/prerequisite.properties
(篇幅原因，省略部分内容)
OPatch/jlib/opatchprereq.jar
OPatch/opatch
OPatch/opatch.ini
[oracle@bsplinux oracle]$ ls -l | grep opatch
-rw-r--r--  1 oracle oinstall 1187195 Oct 23 19:06 opatch_bk.tar
```



最新版本的OPatch可以从MOS上面下载到，补丁文件名称为：p6880880_112000_LINUX.zip(For Linux 32)。

```shell
[oracle@bsplinux upload]$ ls -l | grep p688
-rw-r--r-- 1 root root  32510812 Oct 23 19:58 p6880880_112000_LINUX.zip
```

--解压到ORACLE_HOME目录上

```shell
[oracle@bsplinux upload]$ unzip p6880880_112000_LINUX.zip -d $ORACLE_HOME

Archive:  p6880880_112000_LINUX.zip

creating: /u01/app/oracle/OPatch/oplan/

(篇幅原因，省略部分……)

inflating: /u01/app/oracle/OPatch/crs/s_crsconfig_defs

inflating: /u01/app/oracle/OPatch/crs/s_crsconfig_lib.pm

之后，验证OPatch安装成功。

[oracle@bsplinux OPatch]$ ./opatch version

OPatch Version: 11.2.0.3.0

OPatch succeeded.

[oracle@bsplinux OPatch]$


```

## 3、补丁安装
```shell
如果OPatch不是最新的版本，直接安装PSU可能会有各种的问题。更新OPatch之后，我们就可以下载对应的PSU进行更新。

[oracle@bsplinux upload]$ ls -l | grep p12
-rw-r--r-- 1 root root  18510829 Oct 23 19:35 p12419378_112010_LINUX.zip
[oracle@bsplinux upload]$ unzip p12419378_112010_LINUX.zip -d $ORACLE_HOME
(省略)
[oracle@bsplinux oracle]$ cd 12419378/
[oracle@bsplinux 12419378]$ ls -l
total 60
drwxr-xr-x  3 oracle oinstall  4096 Jul  8  2011 custom
drwxr-xr-x  4 oracle oinstall  4096 Jul  8  2011 etc
drwxr-xr-x 12 oracle oinstall  4096 Jul  8  2011 files
-rwxr-xr-x  1 oracle oinstall  2871 Jul  8  2011 patchmd.xml
-rw-rw-r--  1 oracle oinstall 40790 Jul 18  2011 README.html
-rw-r--r--  1 oracle oinstall    21 Jul  8  2011 README.txt
将数据库和监听程序关闭。
[oracle@bsplinux OPatch]$ sqlplus /nolog
SQL*Plus: Release 11.2.0.1.0 Production on Tue Oct 23 19:26:11 2012
Copyright (c) 1982, 2009, Oracle.  All rights reserved.
SQL> conn / as sysdba
Connected.
SQL> shutdown immediate
Database closed.
Database dismounted.
ORACLE instance shut down.
SQL> quit
Disconnected from Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
[oracle@bsplinux OPatch]$ lsnrctl stop
LSNRCTL for Linux: Version 11.2.0.1.0 - Production on 23-OCT-2012 19:26:55
Copyright (c) 1991, 2009, Oracle.  All rights reserved.
Connecting to (ADDRESS=(PROTOCOL=tcp)(HOST=)(PORT=1521))
The command completed successfully
进入安装目录，使用OPatch进行更新。
[oracle@bsplinux oracle]$ ls -l | grep 1241
drwxr-xr-x  5 oracle oinstall    4096 Jul  8  2011 12419378
[oracle@bsplinux oracle]$ cd 12419378/
[oracle@bsplinux 12419378]$
[oracle@bsplinux 12419378]$$ORACLE_HOME/OPatch/opatch apply
Oracle Interim Patch Installer version 11.2.0.3.0
Copyright (c) 2012, Oracle Corporation.  All rights reserved.
Oracle Home       : /u01/app/oracle
Central Inventory : /u01/oraInventory
from           : /u01/app/oracle/oraInst.loc
OPatch version    : 11.2.0.3.0
OUI version       : 11.2.0.1.0
Log file location : /u01/app/oracle/cfgtoollogs/opatch/12419378_Oct_23_2012_20_02_23/apply2012-10-23_20-02-22PM_1.log
Applying interim patch '12419378' to OH '/u01/app/oracle'
Verifying environment and performing prerequisite checks...
Patch 12419378: Optional component(s) missing : [ oracle.client, 11.2.0.1.0 ]
All checks passed.
Provide your email address to be informed of security issues, install and
initiate Oracle Configuration Manager. Easier for you if you use your My
Oracle Support Email address/User Name.
Visit http://www.oracle.com/support/policies.html for details.
Email address/User Name: realkid4@126.com
Provide your My Oracle Support password to receive security updates via your My Oracle Support account.
Password (optional):
Unable to establish connection to Oracle Configuration Manager server.
Hostname (https://ccr.oracle.com) is unknown.
Unable to establish a network connection to Oracle. Specify the URL for an
Oracle Support Hub in this format:
http[s]://:
If you do not wish to configure OCM through an Oracle Support Hub, enter NONE
Oracle Support Hub URL:
Invalid Oracle Support Hub address specified ().
Unable to establish a network connection to Oracle. Specify the URL for an
Oracle Support Hub in this format:
http[s]://:
If you do not wish to configure OCM through an Oracle Support Hub, enter NONE
Oracle Support Hub URL:
Invalid Oracle Support Hub address specified ().
Unable to establish a network connection to Oracle. Specify the URL for an
Oracle Support Hub in this format:
http[s]://:
If you do not wish to configure OCM through an Oracle Support Hub, enter NONE
Oracle Support Hub URL:
Invalid Oracle Support Hub address specified ().
Unable to establish a network connection to Oracle. Specify the URL for an
Oracle Support Hub in this format:
http[s]://:
If you do not wish to configure OCM through an Oracle Support Hub, enter NONE
Oracle Support Hub URL: NONE
Unable to establish a network connection to Oracle. If your systems require a
proxy server for outbound Internet connections, enter the proxy server details
in this format:
[@][:]
If you want to remain uninformed of critical security issues in your
configuration, enter NONE
Proxy specification: NONE
Please shutdown Oracle instances running out of this ORACLE_HOME on the local system.
(Oracle Home = '/u01/app/oracle')
Is the local system ready for patching? [y|n]y
User Responded with: Y
Backing up files...
Patching component oracle.rdbms.rsf, 11.2.0.1.0...
Patching component oracle.rdbms.dbscripts, 11.2.0.1.0...
Patching component oracle.rdbms, 11.2.0.1.0...
Patching component oracle.rdbms.dv, 11.2.0.1.0...
Patching component oracle.xdk.rsf, 11.2.0.1.0...
Patching component oracle.ldap.rsf.ic, 11.2.0.1.0...
Patching component oracle.ldap.rsf, 11.2.0.1.0...
Patching component oracle.sysman.plugin.db.main.repository, 11.2.0.1.0...
Verifying the update...
Patch 12419378 successfully applied
Log file location: /u01/app/oracle/cfgtoollogs/opatch/12419378_Oct_23_2012_20_02_23/apply2012-10-23_20-02-22PM_1.log
OPatch succeeded.
启动数据库，确定更新成功。
[oracle@bsplinux ~]$ sqlplus /nolog
SQL*Plus: Release 11.2.0.1.0 Production on Tue Oct 23 20:28:00 2012
Copyright (c) 1982, 2009, Oracle.  All rights reserved.
SQL> conn / as sysdba
Connected to an idle instance.
SQL> startup
ORACLE instance started.
Total System Global Area  422670336 bytes
Fixed Size                  1336960 bytes
Variable Size             327158144 bytes
Database Buffers           88080384 bytes
Redo Buffers                6094848 bytes
Database mounted.
Database opened.
SQL> @?/rdbms/admin/catbundle.sql psu apply
PL/SQL procedure successfully completed.
```
## 4、确定补丁成功

最后我们需要确定补丁安装成功。对小补丁的升级来说，我们是不能够v$version视图中看到的。

--------------------------------------------------------------------------------

```shell
SQL> select * from v$version;

BANNER
Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - Production
PL/SQL Release 11.2.0.1.0 - Production
CORE    11.2.0.1.0      Production
TNS for Linux: Version 11.2.0.1.0 - Production
NLSRTL Version 11.2.0.1.0 – Production
通过OPatch的信息库记录，可以看到补丁信息。
[oracle@bsplinux ~]$$ORACLE_HOME/OPatch/opatch lsinventory
Oracle Interim Patch Installer version 11.2.0.3.0
Copyright (c) 2012, Oracle Corporation.  All rights reserved.
Oracle Home       : /u01/app/oracle
Central Inventory : /u01/oraInventory
from           : /u01/app/oracle/oraInst.loc
OPatch version    : 11.2.0.3.0
OUI version       : 11.2.0.1.0
Log file location : /u01/app/oracle/cfgtoollogs/opatch/opatch2012-10-23_20-34-59PM_1.log
Lsinventory Output file location : /u01/app/oracle/cfgtoollogs/opatch/lsinv/lsinventory2012-10-23_20-34-59PM.txt
```

```shell
Installed Top-level Products (1):
Oracle Database 11g                                                  11.2.0.1.0
There are 1 products installed in this Oracle Home.
Interim patches (1) :
Patch  12419378     : applied on Tue Oct 23 20:24:06 CST 2012
Unique Patch ID:  13710328
Created on 8 Jul 2011, 02:48:54 hrs PST8PDT
Bugs fixed:(修复Bug的编号)
9068088, 9363384, 8865718, 8898852, 8801119, 9054253, 8725286, 8974548
9093300, 8909984, 8755082, 8780372, 9952216, 8664189, 8769569, 7519406
9302343, 9471411, 8822531, 7705591, 8650719, 10205230, 9637033, 8883722
8639114, 8723477, 8729793, 8919682, 8856478, 9001453, 8733749, 8565708
8735201, 8684517, 8870559, 8773383, 8981059, 8812705, 9488887, 12534742
8813366, 12534743, 9242411, 12534745, 12534746, 12534747, 8822832
12534748, 8897784, 8760714, 12534749, 8775569, 8671349, 8898589, 9714832
8642202, 9011088, 9369797, 9170608, 9165206, 8834636, 8891037, 8431487
8570322, 8685253, 8872096, 8718952, 8799099, 12534750, 9032717, 9399090
12534751, 12534752, 9713537, 9546223, 12534753, 12534754, 8588519
8783738, 12534755, 12534756, 8834425, 9454385, 8856497, 8890026, 8721315
10248516, 8818175, 8674263, 10249532, 9145541, 8720447, 9272086, 9467635
9010222, 9102860, 9197917, 8991997, 8661168, 8803762, 12419378, 8769239
9654983, 8706590, 8546356, 10408903, 8778277, 9058865, 8815639, 11724991
9971778, 9971779, 9027691, 9454036, 9454037, 9454038, 8761974, 9255542
9275072, 8496830, 8702892, 8818983, 8475069, 8875671, 9328668, 8891929
8798317, 9971780, 8782959, 8774868, 8820324, 8544696, 8702535, 9952260
9406607, 8268775, 9036013, 9363145, 8933870, 8405205, 9467727, 8822365
9676419, 11724930, 8761260, 8790767, 8795418, 8913269, 8717461, 8861700
9531984, 8607693, 8780281, 8330783, 8784929, 8780711, 9341448, 9015983
10323077, 8828328, 9119194, 10323079, 8832205, 8717031, 8665189, 9482399
9676420, 9399991, 8821286, 8633358, 9321701, 9655013, 9231605, 8796511
9167285, 8782971, 8756598, 8703064, 9390484, 9066116, 9007102, 9461782
10323080, 10323081, 10323082, 8753903, 8505803, 9382101, 9352237, 9216806
8918433, 11794163, 9057443, 8790561, 11794164, 8733225, 8795792, 11794165
11794167, 9067282, 8928276, 8837736, 9210925
```

```shell
--------------------------------------------------------------------------------
OPatch succeeded.
[oracle@bsplinux ~]$
在dba_registry_history中，我们也可以看到记录。
SQL> select version, id, bundle_series, comments from dba_registry_history;
VERSION            ID BUNDLE_SER COMMENTS
---------- ---------- ---------- --------------------
11.2.0.1            6 PSU        PSU 11.2.0.1.6
-----------------------------------
```

