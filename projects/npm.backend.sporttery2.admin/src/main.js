import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import plugins from '@/plugins'

import '@/assets/styles/common.css'
Vue.use(plugins)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
