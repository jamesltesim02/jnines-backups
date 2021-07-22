import Vue from 'vue';
import Vue2Toast from 'vue2-toast';

import filters from './filters'
import components from './components'

import 'vue2-toast/lib/toast.css';

export default {
  install () {
    Vue.use(filters)
    Vue.use(components)
    Vue.use(Vue2Toast, {
      type: 'center',
      duration: 2500,
      wordWrap: true,
    });
  }
}
