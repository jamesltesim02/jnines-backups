(function (
  {
    statics: {
      js,
      css
    }
  },
  readyFn
) {
  // 设置当前为组件模式
  window.__J9SPORT_WIDGET_MODE__ = true;

  // 获取head标签
  const headTag = document.querySelector('head')
  // 获取引入入口js的tag
  const tag = document.querySelector('script[src*="widgetloader.js"]');
  if (!tag) {
    return;
  }
  // 根据tag获取baseURL
  const scriptURL = new URL(tag.src);
  const baseURL = `${scriptURL.protocol}//${scriptURL.host}/`;

  /**
   * 加载静态资源
   *
   * @param {string} type 资源类型 js 或 css
   * @param {string} url 资源地址
   * 
   * @return Promise对象 加载完成为resolve, 失败为reject
   */
  const loadStatic = (type, url) => new Promise((resolve, reject) => {
    url = `${baseURL}${url}`
    let el
    if (type === 'css') {
      el = document.createElement('link')
      el.rel = 'stylesheet'
      el.href = url
    } else {
      el = document.createElement('script')
      el.src = url
    }
    el.addEventListener('load', resolve)
    el.addEventListener('error', reject)
    headTag.appendChild(el)
  });

  // 当前商户id
  let fid = 'default';
  // 获取域名的第一段
  let domainName = window.location.hostname.split('.')[0];
  // 判断是否是第三方商户
  if (/^(smart|10077)m?\d{5}$/i.test(domainName)) {
    fid = domainName.substr(-5);
  }

  // 静载资源加载列表
  const statics = [
    // 配置文件
    // ['js', 'configs/config.' + fid + '.js'],
    // 依赖的css
    ...css.map(url => ['css', url]),
    // 依赖的js
    ...js.map(url => ['js', url]),
  ]

  // 如果浏览器不支持Intl国际化, 则添加对应的polyfill
  if (!window.Intl) {
    statics.unshift(['js', 'assets/js/Intl.min.js'])
    statics.unshift(['js', 'assets/js/Intl.locale-data.zh.js'])
  }

  // 调试模式事件, 加载vconsole插件
  window.addEventListener(
    'openDebugConsole',
    () => {
      loadStatic(
        'js',
        `assets/js/vconsole.min.js`
      ).then(() => {
        new VConsole()
      })
    }
  );

  loadStatic(
    'js', 'configs/config.' + fid + '.js'
  ).then(
    () => Promise.all(
      statics.map(s => loadStatic(...s))
    ).then(
      () => readyFn({
        available: window.__J9S_CONFIG__.WIDGET_AVAILABLE,
        addWidget (widgetName, settings = {}) {
          settings.widgetName = widgetName;
          window.dispatchEvent(new CustomEvent(
            'J9SportAddWidget',
            {
              detail: {
                ...settings,
                j9sPath: baseURL
              }
            }
          ));
        },
        invoke (eventName, options) {
          window.dispatchEvent(new CustomEvent(
            `j9s-invoke-${eventName}`,
            { detail: options }
          ));
        }
      })
    )
  ).catch(
    console.error
  );
})(
  /**
   * 由编译环境自动注入补全配置信息及静态资源信息
   *
   * @attr {object} statics 依赖的静态文件列表
   *  {
   *    @attr {array} css: 样式文件列表
   *    @attr {array} js: js文件列表
   *  } 
   */
  __env_variables__,
  /**
   * 加载就绪回调函数
   * @param {object} J9Sport 九游体育入口对象
   */
  (J9Sport) => {
    window.J9Sport = J9Sport;
    if (J9Sport.available) {
      window.dispatchEvent(new CustomEvent('J9SportReady'));
    }
    if (window.location.search.indexOf('j9sDebugConsole=true') > -1) {
      window.dispatchEvent(new CustomEvent('openDebugConsole'));
    }
  }
);
