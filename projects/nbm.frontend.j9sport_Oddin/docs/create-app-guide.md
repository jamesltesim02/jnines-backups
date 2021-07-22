## 利用`create-react-app`创建项目  
```bash
npx create-react-app nbm.frontend.j9sport

# 如果是需要typescript则添加typescript模板
npx create-react-app nbm.frontend.j9sport --template typescript
```
## craco  
### 文档  
https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation  
### 安装craco  
```bash
npm install --save-dev @craco/craco
```
### 修改script  
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},

替换为

"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test"
},
```

### 添加`craco.config.js`配置文件,内容:  
```javascript
module.exports = {
}
```

## less  
### 安装`craco-less`  
```bash
npm install --save-dev craco-less
```
### 在`craco.config.js`配置文件中添加配置less  
```javascript
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
```

## antd  
### 安装`antd`模块  
```bash
npm install antd --save
```
### 在`App.tsx`中引入样式  
```javascript
import 'antd/dist/antd.css';
```
### 将`moment.js`替换为`dayjs`  
* #### 安装依赖包  
```bash
npm i dayjs --save
npm i antd-dayjs-webpack-plugin --save-dev
```
* #### 在`craco.config.js`配置文件中添加插件配置  
```javascript
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';

module.exports = {
  // ...
  webpack: {
    plugins: [
      new AntdDayjsWebpackPlugin()
    ],
  },
};
```
* #### 引入语言包   
```javascript
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en-us';
```
### 组件文档  
https://ant.design/components/overview-cn/  

## mobx  
### 安装`mobx`和`mobx-react`  
```bash
npm install mobx mobx-react --save
```
### 在`tsconfig.json`配置文件中添加装饰器支持  
```javascript
  {
    "compilerOptions": {
      "experimentalDecorators": true,
      ...
    }
    ...
  }
```
### `mobx`中文文档  
https://cn.mobx.js.org/
### `mobx`官方文档
https://mobx.js.org/README.html
### `mobx-react-lite`文档  
https://mu-xue.github.io/2019/08/11/front/mobx-react-lite/  

## axios  
### 安装`axios`  
```bash
npm install axios --save
```
### 安装`axios-mock-adapter`  
```bash
npm install axios-mock-adapter --save-dev
```
### `axios-mock-adapter`文档  
https://github.com/ctimmerm/axios-mock-adapter

## i18n  
### 安装`react-intl`  
```bash
npm install react-intl --save
```
### 问题  
    问题内容  
    TypeScript error in ... /node_modules/react-intl/src/components/message.d.ts(2,13):'=' expected.  TS1005

    解决方法  
    在项目路径安装最新typescript `npm install typescript --save-dev`

## router  
### 安装`react-router`  
```bash
npm install react-router-dom @types/react-router-dom --save
```

## 无限滚动`react-infinite-scroller`  
### 安装  
```bash
npm install react-infinite-scroller --save
```
### 文档 
https://danbovey.uk/react-infinite-scroller/

## Jarvis  

### 观察地址:  
http://localhost:3001/
### 文档地址:
https://github.com/zouhir/jarvis