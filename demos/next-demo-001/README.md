# next-demo-001

### 相关命令 
    开发环境: npm run dev 
    生产编译: npm run build 
    生产运行: npm run start 

### CDN的NGINX配置 
    server {
      listen 3800;
      server_name localhost 10.96.17.107;

      location /_next/ {
        alias /Users/connor/workspaces/demos/next-demo-001/.next/;
      }
      location / {
        root /Users/connor/workspaces/demos/next-demo-001/public;
      }
    }


### 待完成项  
    ##### 完成接口调用封装
    ##### 添加日志输出框架 
    ##### 添加页面日志搜集
    ##### 添加统计代码

    ##### 搭建私服


    https://zhuanlan.zhihu.com/p/32262716