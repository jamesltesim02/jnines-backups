## Docker  
### 安装与运行  
    yum install docker-io  
    systemctl start docker  

### 基本使用  
* #### 搜索镜像  
  `docker search elasticsearch`  

  参数列表:  

  |   名称   |   默认   |   描述   |  
  |---------|----------|---------|  
  |`--automatied`  |false | 仅显示自动构建       |  
  |`--filter, -f`  |      |根据提供的条件过滤输出 |  
  |`limit`         |25    |最大搜索结果数       |  
  |`--no-trunc`    |false |不要截断输出         |  
  |`--stars, -s`   |0     |只显示至少有x颗星    |  

* #### 镜像管理  
  - 下载镜像  
    `docker pull elasticsearch:7.4.2`  
  - 查询所有镜像  
    `docker images`  
  - 删除镜像  
    `docker image rm -f redis`  

* #### 启动容器  
  `docker run [OPTIONS] IMAGE[:TAG] [COMMAND] [ARGS...]`  
  命令参数:  
    - `-d, --detach` 指定容器运行于前台还是后台，默认为`false`,eg: `-d` or `--detach=true` or `--detach=false`  
    - `--name` 指定容器名字，后续可以通过名字进行容器管理，links特性需要使用名字, eg: `--name my-redis`  
    - `--rm` 指定容器停止后自动删除容器(不支持以docker run -d启动的容器),eg: `--rm` or `--rm=false`  
    - `-i` 允许对容器进行标准输入交互  
    - `-t` 在新容器中指定一个伪终端  
    - `-p` 将容器内部使用的网络端口映射到主机上  
* #### 容器操作  
    - 查看容器列表  
      `docker container -ls [-1]`  
    - 删除容器  
      `docker container rm 2fd0dd2c60c3`  
* #### 容器命令行操作  
    - 链接并打开容器命令行  
      `docker exec -i -t elk-reids /bin/bash`  
* #### 容器日志查看  
    - 查看指定容器日志  
      `docker logs logstash`  
      命令参数:  
      + `-f, --follow` 跟踪日志输出  
      + `--details` 输出日志详情  
      + `--since` 显示某个时间或时间段的日志  
        如:  
        `docker logs --since 30m logstash`  
        或  
        `docker logs --since --since="2017-07-03T13:58:54.232003809Z" logstash`  
      + `--tail` 显示最后多少行日志, 默认为`all`  
        如:  
        `docker log --tail 10 logstash`  
      + `-t, --timestamps` 显示时间戳  

* #### volume  
  Volume就是目录或者文件，它可以绕过默认的联合文件系统，而以正常的文件或者目录的形式存在于宿主机上。  
  `docker run -d --name logstash --net elknetwork -v ~/Documents/ELK/logstash/pipeline/:/usr/share/logstash/pipeline/ logstash:7.4.2`  

### docker network  
#### 网络模式  
1. host  
容器将不会虚拟出自己的网卡,配置自己的IP等,而是使用宿主机的IP和端口  

2. Container  
创建的容器不会创建自己的网卡,配置自己的IP,而是和一个指定的容器共享IP、端口范围  

3. Bridge  
此模式会为每一个容器分配、设置IP等，讲容器链接到一个dokcer0虚拟网桥，通过docker0网桥以及iptables nat表配置与宿主机通信  

4. None  
该模式关闭了容器的网络功能   

#### 应用  
* ##### 创建网络  
  `docker network create elknetwork`  
* ##### 以指定网络环境运行  
  使用 --net xxx指定容器网络模式, 如:  
  `docker run --name nginx --net eilknetwork -p 80:80 -d nginx`  
