# nbm.frontend.sporttery2  

# 运行环境  
    node13+  
# npm 仓库地址
    npm config set registry http://verdaccio.nbmm.co:34873/
### 相关命令  
    开发环境: npm run dev  
    生产编译: npm run build  
    生产运行: npm run start  

    * 生产环境需要先设置 PORT环境参数`env PORT=80`或`PORT=80` 或者在 `config/config.ops.js`中配置`PORT`属性  

### 发布  
##### 编译  
执行`npm run build`命令进行编译  
##### 启动  
执行`npm run start`命令进行启动  
端口号可以在启动之前执行`env PORT=80`来设置端口号, 也可以在`config/config.ops.js`文件中进行配置`DEFUALT_PORT`, 优先获取`env PORT=80`设置的端口号  
##### 使用PM2管理 
使用`PM2`运行`server/index.js`即可, 运行之前需要设置`NODE_ENV=production`和端口号  
##### 配置文件  
修改`config/config.ops.js`的配置内容后需要重新编译发布  


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

### 开发注意事项  

* 时区时间问题  

  由于服务器上都只能获取到UTC时间, 所以渲染接口响应数据时都需要使用`getLocaleDate`来将时间戳转换为`Date`对象  
  ```javascript
  import toLoaleDate, { dateFormat } from '../utils/get-locale-date'  
  // 转换为Date对象  
  const value = getLocaleDate(sourceTime)  
  // 转换为时间字符串
  const text = dateFormat(sourceTime, 'MM-dd HH:mm')  
  ```

### UAT相关  
* 访问地址  
http://uatm.nbmm.co/
* 添加`token`参数,默认为`3a52319172174dd0bca8736df1e7df78`  
http://uatm.nbmm.co/?token=3a52319172174dd0bca8736df1e7df78  
可选token  

    3a52319172174dd0bca8736df1e7df78          H88agrednet666  
    617052ec163b441b8dea1109eaf17243          H88agredbull10  
    fef54c46754c4248905343bb15905351          H88agredbruce5  
    fef54c46754c4248905343bb19361nf9          H88agredconnor  

### Server  
  nbmm 机器
  ```shell
  ssh nbmm-hk-2019@52.229.163.243
  nbmm-hk-2019/0i3!9qCQrSZj8jIzkxKEj1w6GitC@G7X
  sudo su - mmops
  ```
