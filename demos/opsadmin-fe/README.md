## 编译及运行环境  
* ### 编译环境要求  
    `nodejs 14.5.0` 以上  
    安装完成后修改仓库地址为国内镜像地址
    ```shell
    npm config set registry https://registry.npm.taobao.org
    ```
* ### 运行环境  
    `nginx` 任意版本

## 编译及发布步骤  
* ### 安装依赖包  
    在代码根目录运行 `npm install` 安装所需依赖  
* ### 修改配置  
    修改 `src/configs/config.ts` 中的 `API` 为接口域名地址  
    地址以 `/` 结尾
* ### 编译  
    在代码根目录运行 `npm run build` 命令编译代码  
    代码将会被编译到 `build` 目录下
* ### 发布  
    将 `build` 目录的所有文件拷贝到`nginx`的静态文件目录  
    并添加 `try_files $uri /index.html;` 配置  

    示例:  
    ```nginx
    server {
        listen 1874;
        server_name localhost;

        location / {
            root /Users/hank/Documents/parttimeWorkspace/opsadmin-fe/build;
            try_files $uri /index.html;
        }
    }
    ```

## 备注
如果已经弄好环境之后,今后每次更新只需要 `git pull` 再 `npm run build` 即可

# 原型设计  
https://www.xiaopiu.com/web/byId?type=project&id=5f698b7f1ebbb638f7f529ed&activePage=1  