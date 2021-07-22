import Vue from 'vue';

import dateFormat from '@/filters/dateFormat';
import oddsFormat from '@/filters/oddsFormat';
import moneyFormat from '@/filters/moneyFormat';
import banknoFormat from '@/filters/banknoFormat';

import Cimg from '@/components/common/Cimg.vue';

const installFilters = () => {
  // 时间日期格式化
  Vue.filter('dateFormat', (source, pattern) => dateFormat(source, pattern));
  // 赔率显示转换
  Vue.filter('oddsFormat', oddsFormat);
  // 金额格式化
  Vue.filter('moneyFormat', moneyFormat);
  // 银行卡格式化
  Vue.filter('banknoFormat', banknoFormat);
};

const installComponents = () => {
  // cdn图片组件
  Vue.component('cimg', Cimg);
};

const install = () => {
  installFilters();
  installComponents();
};

export default { install };
