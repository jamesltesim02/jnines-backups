((
  {
    config,
    statics: {
      js,
      css
    }
  },
  callback
) => {
  // 获取head标签
  const headTag = document.querySelector('head')

  // 将配置信息暴露到全局对象
  window.__AGYY_SPORTS_CONFIG__ = config

  /**
   * 加载静态资源
   *
   * @param {string} type 资源类型 js 或 css
   * @param {string} url 资源地址
   * 
   * @return Promise对象 加载完成为resolve, 失败为reject
   */
  const loadStatic = (type, url) => new Promise((resolve, reject) => {
    url = `${config.CDN_URL || ''}${url}`
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
  })

  // 静载资源加载列表
  const statics = [
    ...css.map(url => loadStatic('css', url)),
    ...js.map(url => loadStatic('js', url)),
  ]

  // 如果浏览器不支持Intl国际化, 则添加对应的polyfill
  if (!window.Intl) {
    statics.push(loadStatic('js', `assets/js/Intl.min.js`))
    statics.push(loadStatic('js', `assets/js/Intl.locale-data.zh.js`))
  }

  // 执行加载文件, 并执行初始化函数
  Promise.all(statics).then(
    () => callback(config)
  ).catch(
    err => console.error(err)
  )

  // 调试模式事件, 加载vconsole插件
  window.addEventListener(
    'openDebugConsole',
    () => {
      loadStatic(
        'js',
        `assets/vconsole.min.js`
      ).then(() => {
        new VConsole()
      })
    }
  )
})(
  /**
   * 由编译环境自动注入补全配置信息及静态资源信息
   * @attr {object} config 系统配置信息
   *  {
   *    CDN_URL: cdn地址,
   *  }
   * @attr {object} statics 依赖的静态文件列表
   *  {
   *    @attr {array} css: 样式文件列表
   *    @attr {array} js: js文件列表
   *  } 
   */
  __env_variables__,
  /**
   * 依赖的静态文件加载完成后执行的初始化操作
   *
   * @param {object} config 配置信息对象
   */
  (/* config */) => {
    const loaderTag = document.querySelector('script[src$="widgetloader.js"]')
    const entryName = loaderTag.getAttribute('entry')
    const waitingQueue = window[entryName].q

    const widgetInvoke = (method, options) => {
      const invokeEvent = new Event(`NBWidget:${method}`)
      invokeEvent.options = options
      window.dispatchEvent(invokeEvent)
    }

    while (waitingQueue.length) {
      widgetInvoke(...waitingQueue.shift())
    }

    window[entryName] = widgetInvoke
  }
)
