import Vue from 'vue';
import Vue2Toast from 'vue2-toast';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import CommonRegistion from './CommonRegistion';
import RouterToStore from './RouterToStore';
import PortalParameter from './PortalParameter';
import PortalInfoInitial from './PortalInfoInitial';
import BetinfoInit from './BetinfoInit';
import Pusher from './Pusher';

import 'vue2-toast/lib/toast.css';
import 'swiper/dist/css/swiper.css';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import '@/assets/styles/reset.css';
import '@/assets/styles/common.less';

import '@/registerServiceWorker';

Vue.use(PerfectScrollbar, {
  useBothWheelAxes: true,
  suppressScrollX: true,
});
Vue.use(Vue2Toast, {
  type: 'center',
  duration: 2500,
  wordWrap: true,
});

Vue.use(CommonRegistion);
Vue.use(RouterToStore);
Vue.use(PortalParameter);
Vue.use(PortalInfoInitial);
Vue.use(BetinfoInit);
Vue.use(Pusher);

export default {
  install() {
    console.log('app initialed.');
  },
};
