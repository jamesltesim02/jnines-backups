
## ELK  
### 安装  
1. 针对生产环境需要添加peizhi  
  `sudo vim /etc/sysctl.conf`  
  添加如下配置:  
  `vm.max_map_count=262144`  
2. 创建名为`elknetwork`的网络模式  
  `docker network create elknetwork`  
3. 下载镜像  
    - elasticsearch  
      `docker pull elasticsearch:7.4.2`  
    - logstash  
      `docker pull logstash:7.4.2`    
    - kibana  
      `docker pull kibana:7.4.2`
    - redis
      `docker pull redis`
4. 创建logstash配置  
  地址: `/Users/connor/Documents/ELK/logstash/pipeline/logstash.conf`  

    ```conf
    input {
      redis {
        data_type => "pattern_channel"
        key => "logstash-chan"
        host => "elk-redis"
        port => 6379
        threads => 5
      }
    }

    output {
      elasticsearch {
        hosts => ["elasticsearch"]
        index => "logstash-redis-%{+YYYY.MM.dd}"
      }
    }
    ```
5. 启动镜像  
    - elasticsearch  
      `docker run -d --name elasticsearch --net elknetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.4.2`  
    - kibana  
      `docker run -d --name kibana --net elknetwork -p 5601:5601 kibana:7.4.2 -e ELASTICSEARCH_URL=http://elasticsearch:9200` 使用 `-e` 参数来指定elasticsearch  
    - redis  
      `docker run -d --name elk-redis --net elknetwork -p 6379:6379 redis`  
    - logstash  
      `docker run -d --name logstash --net elknetwork -v ~/Documents/ELK/logstash/pipeline/:/usr/share/logstash/pipeline/ logstash:7.4.2`  

