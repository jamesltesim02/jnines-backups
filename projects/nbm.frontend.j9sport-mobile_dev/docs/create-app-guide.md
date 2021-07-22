## 利用`create-react-app`创建项目  
```bash
npx create-react-app nbm.frontend.j9sport-mobile

# 如果是需要typescript则添加typescript模板
npx create-react-app nbm.frontend.j9sport-mobile --template typescript
```



## antd-mobile
### 参考文档
https://mobile.ant.design/docs/react/use-with-create-react-app-cn
https://mobile.ant.design/docs/react/introduce-cn#3.-%E4%BD%BF%E7%94%A8
### 安装`antd-mobile`
```bash
npm install antd-mobile --save
```
### 安装`react-app-rewired`、`babel-plugin-import`及`customize-cra`
```
npm install react-app-rewired customize-cra babel-plugin-import --save-dev
```
### 修改`package.json`中的`scripts`
```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test --env=jsdom"
}
```
### 添加自定义配置文件`config-overrides.js`
```javascript
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
);

```



## less
### 安装`less`和`less-loader`
```bash
npm install --save-dev less less-loader
```
### 修改`config-overrides.js`
```javascript
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  })
);
```


## FastClick
### 安装FastClick
```bash
npm install --save fastclick
```
### 编写类型声明文件
```typescript
declare module 'fastclick' {
  export function attach(layer: any, options?: FastClickOptions): FastClickObject;
}
```
#### typescript 类型生命文件参考文档
https://zhuanlan.zhihu.com/p/58123993
### fastclick文档
https://github.com/ftlabs/fastclick



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

### lodash
### 安装`lodash`
```bash
npm install lodash --save

npm install --save-dev @types/lodash
```

## router
## router  
### 安装`react-router`  
```bash
npm install react-router-dom @types/react-router-dom --save
```



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



## i18n  
### 安装`react-intl`  
```bash
npm install react-intl --save
```
### 添加`AppLocale`文件,其中定义`LocaleProvider`和`LocaleSwitcher`
```tsx
import React from 'react';
import { observer } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd-mobile';

// 可用语言枚举
import { Locales } from '../../consts/app';

// app store
import appStore from '../../stores/app';

// 系统自定义语言包
const appLocales = import('../../assets/locales');

// TODO 将antd-mobile的语言文件提取到assets/locales文件中

/** 语言提供者,根据store中的locale获取对应的语言包并显示 */
export const AppLocaleProvider = observer(({ children }: { children: any }) => {
  const { locale } = appStore;

  // antd-mobile 的语言包设置 (antd mobile 的英文语言包)
  const amProps:any = (
    locale === Locales.EN_US
    ? { locale: import('antd-mobile/lib/locale-provider/en_US') }
    : {}
  );

  const locales:any = appLocales || {}

  return (
    // 全局语言环境provider
    <IntlProvider
      messages={locales[locale]}
      locale={locale}
    >
      {/* antd-mobile 语言provider */}
      <LocaleProvider {...amProps}>
        {children}
      </LocaleProvider>
    </IntlProvider>
  );
});

export function LocaleSwitcher () {}
```
### 问题  
    问题内容  
    TypeScript error in ... /node_modules/react-intl/src/components/message.d.ts(2,13):'=' expected.  TS1005

    解决方法  
    在项目路径安装最新typescript `npm install typescript --save-dev`