## 非JDBC或OCI(粗)JDBC客户端
客户端sqlnet.ora文件中增加配置

```properties
SQLNET.ENCRYPTION_CLIENT=accepted #表明客户端接受安全网络传输请求（默认值就是accepted）
```
可选值:

rejected: 客户端拒绝任何安全网络传输连接请求

requested: 如果另一方请求或需要安全服务，则该安全服务将被激活

required: 只有当另一端接受安全网络传输时，客户端才接受连接

服务端sqlnet.ora文件中增加配置
```properties
SQLNET.ENCRYPTION_SERVER=required
SQLNET.ENCRYPTION_TYPES_SERVER=<encryption algorithm>
```

## 瘦JDBC 客户端

```java
DriverManager.registerDriver(new oracle.jdbc.driver.OracleDriver());
Properties props = new Properties();
props.put("oracle.net.encryption_client", "accepted");
props.put("oracle.net.encryption_types_client", "RC4_128");
props.put("user", "XXX");
props.put("password", "YYY");
Connection conn = DriverManager.getConnection("jdbc:oracle:thin:@myhost:1521:mySID", props);
```
或
```properties
    <!-- 使用阿里巴巴的DruidDataSource配置针对Oracle数据库的JNDI数据源 -->
     <Resource
            name="jdbc/wb_oracle"
            factory="com.alibaba.druid.pool.DruidDataSourceFactory"
            auth="Container"
            type="javax.sql.DataSource"
            driverClassName="oracle.jdbc.OracleDriver"
            url="jdbc:oracle:thin:@myhost:1521:mySID?sqlnet.encryption_client=accepted&amp;sqlnet.encryption_types_client=AES256"
            username="wolf"
            password="wolf"
            initialSize="100"
            maxActive="5000"
            minIdle="10"
            maxWait="10000"
            maxOpenPreparedStatements="100"
            validationQuery="select 1 from dual"
            testOnBorrow="false"
            testWhileIdle="true"
            timeBetweenEvictionRunsMillis="60000"
            removeAbandoned="true"
            removeAbandonedTimeout="60"
            logAbandoned="false"
            filters="stat,wall"/>

```
## 数据完整性设置
MD5 or SHA-1 

客户端:
```properties
SQLNET.CRYPTO_CHECKSUM_CLIENT = [ accepted | rejected | requested | required ] 
SQLNET.CRYPTO_CHECKSUM_TYPES_CLIENT = <crypto_checksum_algorithms>
```
服务器端:

```properties

SQLNET.CRYPTO_CHECKSUM_SERVER = [ accepted | rejected | requested | required ] 
SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER = <crypto_checksum_algorithms>
```
Oracle用户密码加密方式
Oracle 11g版本的加密口令存放在SYS．USER$表中的SPARE4列中，而PASSWORD列中仍保留以前版本加密口令。由于客户端计算加密口令需要用到SALT，在建立连接时，服务器端将SALT明文传送给客户端程序。Oracle 11g中新的口令加密算法中区分大小写；由于加入了随机数SALT，两个不同用户的口令即便完全相同，计算得到的SHA1的散列值也不同；不同DB中相同用户相同口令，SHA1散列值也可能不同。

### 实际使用Oracle传输加密配置：

```properties
#sqlnet.ora文件中做如下配置
# 服务器端
SQLNET.ENCRYPTION_SERVER = REQUIRED #开启加密
SQLNET.ENCRYPTION_TYPES_SERVER = AES128 #采用AES对称加密算法
SQLNET.CRYPTO_CHECKSUM_SERVER = REQUIRED #需要对数据完整性进行验证
SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER = MD5 #签名算法
#客户端
SQLNET.CRYPTO_CHECKSUM_CLIENT = accepted
SQLNET.CRYPTO_CHECKSUM_TYPES_CLIENT = MD5
```
## 抓包测试截图

未加密：
![](attachments/Pasted%20image%2020250212161952.png)

配置加密后：
![](attachments/Pasted%20image%2020250212162039.png)


官网：[https://docs.oracle.com](https://docs.oracle.com/cd/B28359_01/network.111/b28530/asoappd.htm#g635886)

wiki资源：[http://www.orafaq.com/wiki/Network_Encryption](http://www.orafaq.com/wiki/Network_Encryption)

https://docs.oracle.com/en/database/oracle/oracle-database/19/dbseg/release-changes.html#GUID-D394F71C-1D9F-41F1-A8FA-FCDED20666FD