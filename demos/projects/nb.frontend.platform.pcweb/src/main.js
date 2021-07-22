import Vue from 'vue';

import AppInitial from './plugins/AppInitial';
import { initI18n } from './utils/I18nUtil';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// 公共组件过滤器及指令注册
Vue.use(AppInitial);

const start = async () => {
  new Vue({ // eslint-disable-line no-new
    i18n: await initI18n(),
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
};

// 开始渲染页面
start();
