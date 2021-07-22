import Vue from 'vue'
import App from './App'
import {api} from './utils/api.js'

import VueI18n from 'vue-i18n'
import i18n from './common/lang'

Vue.use(uView)
Vue.use(VueI18n)

/*全局组件引入*/
import uView from "uview-ui"
import navBar from 'components/nav-bar.vue'
import hoverView from 'components/hover-view.vue'
import ifooter from 'components/ifooter.vue'
import tips from 'components/tips.vue'
import share from 'components/share/share.vue'

/*小程序中,参数一需静态字符串*/
Vue.component('navBar',navBar)
Vue.component('hoverView',hoverView)
Vue.component('iFooter',ifooter)
Vue.component('tips',tips)
Vue.component('share',share)

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype._i18n = i18n

App.mpType = 'app'

const app = new Vue({
	i18n,
	...App
})

app.$mount(); 

