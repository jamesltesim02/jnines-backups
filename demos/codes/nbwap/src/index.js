import 'vue2-toast/lib/toast.css'
import '@/assets/less/common.less'

import Vue from 'vue'
import App from '@/App'
import router from '@/router'

// import Vue2TouchEvents from 'vue2-touch-events'
import VueTouch from 'vue-touch'
import VueI18n from 'vue-i18n'
import VueI18nAsync from 'vue-i18n-async'
import Vue2Toast from 'vue2-toast'

import CommonComponents from '@/plugins/CommonComponents'
import RestREM from '@/plugins/ResetREM'

import {loadScript, loadStyle, writeStyle} from '@/utils/ResourceUtils'
import {getLanguage} from '@/utils/LanguageUtils'
import {setClientSettings} from '@/utils/ClientAdapter'

import api from '@/api'
import store from '@/store'

// 获取页面中的配置文件内容
const config = window.NBConfig

// 为vue对象绑定api调用入口对象
Vue.prototype.$api = api

// 初始化REM值
Vue.use(RestREM)

// vue2-touch事件支持插件
// Vue.use(Vue2TouchEvents)
Vue.use(VueTouch)

// vue-i18n本地化支持插件
Vue.use(VueI18n)
// vue-i18n异步语言文件加载插件
Vue.use(VueI18nAsync, {
  async (lang, resolve, reject) {
    loadScript(config.URL_LANGUAGE[lang])
      .then(() => resolve(lang, window.NBLang[lang]))
      .catch(reject)
  },
  failback (lang, resolve) {
    loadScript(config.URL_LANGUAGE[getLanguage()])
      .then(() => resolve(lang, window.NBLang[getLanguage()]))
  }
})

// vue-toast 弹窗
Vue.use(Vue2Toast, {
  type: 'center',
  duration: 3000,
  wordWrap: true
})

// 公共组件
Vue.use(CommonComponents)

/**
 * window.NBBet入口类
 */
class NBBetEntry {
  /**
   * 初始化资源
   */
  initResource () {
    Promise.all([
      // 字体图标字体文件
      writeStyle(
        '@font-face{' +
          'font-family:nbicon;' +
          'src:url(' + config.URL_STATIC + 'img/nbicon/nb.eot?v=1.101);\n' +
          'src:url(' + config.URL_STATIC + 'img/nbicon/nb.eot?v=1.101) format("embedded-opentype"),' +
          'url(' + config.URL_STATIC + 'img/nbicon/nb.ttf?v=1.101) format("truetype"),' +
          'url(' + config.URL_STATIC + 'img/nbicon/nb.woff?v=1.101) format("woff"),' +
          'url(' + config.URL_STATIC + 'img/nbicon/nb.svg?v=1.101) format("svg");\n' +
          'font-weight:400;\n' +
          'font-style:normal' +
        '}'
      ),
      // 主体样式
      loadStyle(config.URL_STYLE),
      // 语言文件
      loadScript(config.URL_LANGUAGE[getLanguage()])
    ]).then(window.NBBet.ready.bind(window.NBBet)) // 触发准备就绪事件
  }

  /**
   * 渲染ui到现金网页面
   * @param settings
   *    商户接入配置信息
   */
  render (settings) {
    // 设置适配器中的商户自定义配置
    setClientSettings(settings)

    // 初始化UI对象并渲染
    new Vue({
      i18n: new VueI18n({
        locale: getLanguage(),
        messages: Object.assign(
          {
            'zh-cn': undefined,
            'en-us': undefined
          },
          {
            [getLanguage()]: window.NBLang[getLanguage()]
          }
        )
      }),
      router,
      store,
      render: h => h(App)
    }).$mount(settings.selector || '#nb_content')
  }
}

// 创建nbbet entry对象
let nbe = new NBBetEntry()
// 对NBBet暴露渲染入口
window[config.NB_RENDER_FUNCTION] = nbe.render.bind(nbe)
// 初始化
nbe.initResource()
