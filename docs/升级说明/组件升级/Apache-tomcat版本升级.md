本文档以升级9.0.80版本tomcat为示例，其他版本均可以参照此文档操作，文档内附有最新版本tomcat下载地址。

**步骤一：**

查看tomcat 的版本，方式如下：

进入到 tomcat的安装目录下bin的文件下输入：./version.sh

```shell
[root@localhost /]# cd /unicenter/tomcat/bin/
[root@localhost bin]# ./version.sh 
Using CATALINA_BASE:   /unicenter/tomcat
Using CATALINA_HOME:   /unicenter/tomcat
Using CATALINA_TMPDIR: /unicenter/tomcat/temp
Using JRE_HOME:        /usr/share/jdk1.8.0_202/
Using CLASSPATH:       /unicenter/tomcat/bin/bootstrap.jar:/unicenter/tomcat/bin/tomcat-juli.jar
Using CATALINA_OPTS:   
Server version: Apache Tomcat/9.0.63
Server built:   May 11 2022 07:52:11 UTC
Server number:  9.0.63.0
OS Name:        Linux
OS Version:     3.10.0-957.el7.x86_64
Architecture:   amd64
JVM Version:    1.8.0_202-b08
JVM Vendor:     Oracle Corporation
```

**步骤二：**

确定好自己的版本号之后，确认是否需要升级，升级不要跨大版本（<font color="#ff0000">Tomcat8只能升级更高版本的Tomcat8，不能跨版本升级到Tomcat9</font>）

包内附有linux版apache-tomcat-9.0.80.zip，需要其他版本可前往tomcat官网下载指定版本,注意区分系统版本，一般下载 

Core:

- [zip]
- [tar.gz]

最新版本下载地址:

Tomcat8: https://tomcat.apache.org/download-80.cgi

Tomcat9: https://tomcat.apache.org/download-90.cgi)

**步骤三：**

停止tomcat服务，

使用bin下的 shutdown.sh停止tomcat，shutdown可能会无法终止tomcat进程，可查询进程 kill

```bash
[root@localhost /]# cd /unicenter/tomcat/bin/
[root@localhost bin]# ./shutdown.sh 
Using CATALINA_BASE:   /unicenter/tomcat
Using CATALINA_HOME:   /unicenter/tomcat
Using CATALINA_TMPDIR: /unicenter/tomcat/temp
Using JRE_HOME:        /usr/share/jdk1.8.0_202/
Using CLASSPATH:       /unicenter/tomcat/bin/bootstrap.jar:/unicenter/tomcat/bin/tomcat-juli.jar
Using CATALINA_OPTS:  
[root@localhost bin]# ps -ef|grep tomcat
root      7905     1 32 11:25 pts/0    00:40:27 /usr/share/jdk1.8.0_202//bin/java -Djava.util.logging.config.file=/unicenter/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dorg.apache.catalina.security.SecurityListener.UMASK=0027 -Dignore.endorsed.dirs= -classpath /unicenter/tomcat/bin/bootstrap.jar:/unicenter/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/unicenter/tomcat -Dcatalina.home=/unicenter/tomcat -Djava.io.tmpdir=/unicenter/tomcat/temp org.apache.catalina.startup.Bootstrap start
root     19991  1455  0 13:28 pts/0    00:00:00 grep --color=auto tomcat
[root@localhost bin]# kill -9 7905
[root@localhost bin]# ps -ef|grep tomcat
root     20020  1455  0 13:29 pts/0    00:00:00 grep --color=auto tomcat
```


**步骤四：**

<font color="#ff0000">备份</font> /unicenter/tomcat/bin 目录后，删除 /unicenter/tomcat/bin  将新版本的tomcat下的bin目录上传至/unicenter/tomcat/bin

<font color="#ff0000">备份</font> /unicenter/tomcat/lib 目录后，删除 /unicenter/tomcat/lib  将新版本的tomcat下的lib目录上传至/unicenter/tomcat/lib


**步骤五：**

分配可执行权限，进入到 tomcat的安装目录下bin的文件下，查看版本，启动tomcat

```bash
[root@localhost /]# chmod a+x /unicenter/tomcat/bin/./*
[root@localhost /]# cd unicenter/tomcat/bin/
[root@localhost bin]# ./version.sh 
Using CATALINA_BASE:   /unicenter/tomcat
Using CATALINA_HOME:   /unicenter/tomcat
Using CATALINA_TMPDIR: /unicenter/tomcat/temp
Using JRE_HOME:        /usr/share/jdk1.8.0_202/
Using CLASSPATH:       /unicenter/tomcat/bin/bootstrap.jar:/unicenter/tomcat/bin/tomcat-juli.jar
Using CATALINA_OPTS:   
Server version: Apache Tomcat/9.0.80
Server built:   Feb 27 2023 15:33:40 UTC
Server number:  9.0.80.0
OS Name:        Linux
OS Version:     3.10.0-957.el7.x86_64
Architecture:   amd64
JVM Version:    1.8.0_202-b08
JVM Vendor:     Oracle Corporation
[root@localhost bin]# ./startup.sh 
Using CATALINA_BASE:   /unicenter/tomcat
Using CATALINA_HOME:   /unicenter/tomcat
Using CATALINA_TMPDIR: /unicenter/tomcat/temp
Using JRE_HOME:        /usr/share/jdk1.8.0_202/
Using CLASSPATH:       /unicenter/tomcat/bin/bootstrap.jar:/unicenter/tomcat/bin/tomcat-juli.jar
Using CATALINA_OPTS:   
Tomcat started.
```


 附：最新版本下载地址:

Tomcat8: https://tomcat.apache.org/download-80.cgi

Tomcat9: https://tomcat.apache.org/download-90.cgi

 