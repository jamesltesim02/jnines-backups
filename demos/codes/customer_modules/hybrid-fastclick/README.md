### 介绍
在原fastclick基础上稍作修改，排除了select的事件处理，使用方法与fastclick一样  
fastclick地址：https://www.npmjs.com/package/fastclick

### GIT
http://10.66.72.20:8081/mobile-front-end/hybrid-fastclick.git

### 引入及使用

#### 1.安装
    npm install --save hybrid-fastclick

#### 2.页面引入  
    <script src="@module/hybrid-fastclick/dist/hybrid-fastclick.min.js"></script>

#### 3.使用
     FastClick.attach(document.body)