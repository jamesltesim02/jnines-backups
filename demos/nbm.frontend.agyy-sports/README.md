* # 命令  
* ### 网站开发模式  
    `npm run start`  
    或  
    `npm run start:web`  
* ### 快速投注组件开发模式  
    `npm run start:widget`  
* ### 编译为发布代码  
    `npm run build`  

* # 开发相关事项  
* ### 在页面代码中开启vconsole用以调试  
    ```javascript
    window.dispatchEvent(new Event('openDebugConsole'))
    ```
* ### 打开页面时打开vconsole调试面板  
    在请求地址上添加`?openDebugConsole=true`或`&openDebugConsole=true`参数  
* ### 查看当前开发模式编译结果  
    http://localhost:8600/webpack-dev-server  
* ### CDN中各功能图片对应的目录地址  
    联赛： /cdn/tournament/  
    球队： /cdn/competitor/  
    比赛： /cdn/match/  
    大图： /cdn/slide/  
    媒体： /cdn/movies/  (手动上传)  
* ### 跳转到主站相关页面的地址(PC, 手机)  
    用户中心: /back/?type=13  
    充币/存款/充值: /back/?type=6  
    提币/取款: /back/?type=4  
* ### 跳转其他游戏的对应地址  
    百家乐PC: /game/game_loading.html?/api/game/ag/load?platType=AGQ  
    百家乐手机: /game/play/agq/?gameType=NN  

    捕鱼PC: /game/game_loading.html?/api/game/ag/load?gameCode=6&gameName=fish&platType=AGIN&language=zh  
    捕鱼手机: /game/iframe/index.html?egames=1&g=ag&gameCode=6&gameName=Fish&platForm=AG&trial=false  

    电子游戏PC: /game/egames.html  
    电子游戏手机: /game/dygame/  

* # 二级页面  
* ### 测试预览地址  
    https://agm.nbmm.co/quickbet-preview.html   
* ### 接入地址  
    https://agm.nbmm.co/quickbet?clientType=2&frontId=10077100werw564wesfx&token=932CEFA1ABB6774A15B6E46F5529E30A23215794D706CB7861A2065ADB68CF138A3D8FE83E4FB04C35F16333B9C92D83&locale=zh&origin=https%3A%2F%2Fagm.nbmm.co%2F  


* # widgetloader加载代码模板  
* ### 源码未压缩  
    ``` javascript  
    (function (
      w,
      d,
      host,
      entryName
    ) {
      if (!w[entryName]) {
        w[entryName] = function (method, options) {
          if (!w[entryName].q) {
            w[entryName].q = []
          }
          options.t = Date.now()
          w[entryName].q.push([method, options])
        }
      }

      var el = d.createElement('script')
      el.async = true
      el.src = new URL('widgetloader.js', host).href
      el.setAttribute('entry', entryName)
      d.querySelector('head').appendChild(el)
    }) (
      window,
      document,
      'http://localhost:8600/',
      'BetWidget'
    )
    ```  
* ### 压缩后的代码  
    ```javascript  
    (function(w,d,r,n){var a;w[n]||(a=w[n]=function(m,o){a.q||(a.q=[]),o.t=Date.now(),a.q.push([m,o])});var i=d.createElement("script");i.async=1,i.src=new URL("widgetloader.js", r).href,i.setAttribute("entry",n),d.querySelector("head").appendChild(i)})(
      window,
      document,
      // 需要替换为 运营环境地址
      "http://localhost:8600/",
      // 入口函数名, 后续对组件操作时调用的函数名
      "BetWidget"
    )
    ```  

* # 涉及依赖模块配置及文档  
* ### .env 环境配置文件加载插件  
    npm install --save-dev dotenv  
    https://www.npmjs.com/package/dotenv  
* ### webpack  
    https://www.webpackjs.com/  
* ### webpack mode 配置development or production  
    https://webpack.js.org/configuration/mode/  
* ### webpack optimization 优化配置  
    https://webpack.docschina.org/configuration/optimization/  
* ### optimization.splitChunks(SplitChunksPlugin) 代码拆分  
    https://webpack.docschina.org/plugins/split-chunks-plugin/  
    https://www.jianshu.com/p/2cc8457f1a10  
* ### devtool source map配置  
    https://www.webpackjs.com/configuration/devtool/  
* ### stats 控制台输出级别控制  
    https://webpack.js.org/configuration/stats/#stats 
* ### devServer 开发环境webserver  
    https://www.webpackjs.com/configuration/dev-server/  
* ### html-webpack-plugin 配置 html 模板  
    https://github.com/jantimon/html-webpack-plugin  
    https://www.jianshu.com/p/08a60756ffda  
* ### babel 编译转换js  
    https://www.babeljs.cn/docs/usage  
* ### terser 压缩js  
    https://github.com/terser/terser  
* ### copy-webpack-plugin copy文件  
    https://github.com/webpack-contrib/copy-webpack-plugin   
* ### mini-css-extract-plugin 将css输出到文件  
    https://github.com/webpack-contrib/mini-css-extract-plugin  
* ### optimize-css-assets-webpack-plugin 压缩css  
    https://github.com/NMFR/optimize-css-assets-webpack-plugin  
* ### terser-webpack-plugin 压缩js针对webpack的插件  
    https://github.com/webpack-contrib/terser-webpack-plugin  
* ### css-loader 加载解析css文件  
    https://github.com/webpack-contrib/css-loader  
* ### eslint-loader 代码规范校验  
    https://github.com/webpack-contrib/eslint-loader  
* ### eslint-config-react-app 由create-react-app创建的eslint模板  
    https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app  
* ### 自定义插件编写  
    https://www.webpackjs.com/api/plugins/  
    https://juejin.im/post/5e71991c518825492442e99b  
    https://juejin.im/post/5e5309ece51d4526e03f9e53  
* ### chrome上提示安装应用  
    https://juejin.im/post/5d1c84e2e51d45773d468677  
* ### 编译性能优化  
    https://webpack.docschina.org/guides/build-performance/  

* # MAC解决 `gyp: No Xcode or CLT version detected!` 问题  
    ```shell
    sudo rm -rf /Library/Developer/CommandLineTools  
    xcode-select --install  
    ```

* # 布局相关事项  
* ### 栅格系统  
    https://material.io/design/layout/responsive-layout-grid.html#breakpoints  

    | Breakpoint Range (dp) | Portrait       | Landscape      | Window | Columns | Margins / Gutters |
    | --------------------- | -------------- | -------------- | ------ | ------- | ----------------- |
    | 0 – 359               | small handset  |                | xsmall | 4       | 16                |
    | 360 – 399             | medium handset |                | xsmall | 4       | 16                |
    | 400 – 479             | large handset  |                | xsmall | 4       | 16                |
    | 480 – 599             | large handset  | small handset  | xsmall | 4       | 16                |
    | 600 – 719             | small tablet   | medium handset | small  | 8       | 16                |
    | 720 – 839             | large tablet   | large handset  | small  | 8       | 24                |
    | 840 – 959             | large tablet   | large handset  | small  | 12      | 24                |
    | 960 – 1023            |                | small tablet   | small  | 12      | 24                |
    | 1024 – 1279           |                | large tablet   | medium | 12      | 24                |
    | 1280 – 1439           |                | large tablet   | medium | 12      | 24                |
    | 1440 – 1599           |                |                | large  | 12      | 24                |
    | 1600 – 1919           |                |                | large  | 12      | 24                |
    | 1920 +                |                |                | xlarge | 12      | 24                |  

    *Margins and gutters are flexible and don't need to be of equal size.  

