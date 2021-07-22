import Vue from 'vue';

import betFilters from '@/filters/betFilter';
import dateFormat from '@/filters/dateFormat';
import oddsFormat from '@/filters/oddsFormat';
import moneyFormat from '@/filters/moneyFormat';
import banknoFormat from '@/filters/banknoFormat';

import Cimg from '@/components/common/Cimg';
import ExpandTransition from '@/components/common/ExpandTransition';
import RollingText from '@/components/common/RollingText';
import LoadingBar from '@/components/common/LoadingBar';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import ToggleButton from '@/components/common/ToggleButton';
import IconArrow from '@/components/common/icons/IconArrow';
import IconReport from '@/components/MatchDetail/icons/IconReport';
import NoRecords from '@/components/common/NoRecords';

const installFilters = () => {
  // 时间日期格式化
  Vue.filter('dateFormat', (source, pattern) => dateFormat(source, pattern));
  // 赔率显示转换
  Vue.filter('oddsFormat', oddsFormat);
  // 金额格式化
  Vue.filter('moneyFormat', moneyFormat);
  // 银行卡格式化
  Vue.filter('banknoFormat', banknoFormat);
  // 投注格式化
  betFilters();
};

const installComponents = () => {
  // cdn图片组件
  Vue.component('cimg', Cimg);
  // 展开收起组件
  Vue.component('expand-transition', ExpandTransition);
  // 文字走马灯组件
  Vue.component('rolling-text', RollingText);
  // loading行
  Vue.component('loading-bar', LoadingBar);
  // 上中下页面结构组件(中间区域可以滑动)
  Vue.component('list-page', ListPage);
  // 导航栏组件
  Vue.component('nav-bar', NavBar);
  // 切换按钮
  Vue.component('toggle-button', ToggleButton);
  // 无数据组件
  Vue.component('no-records', NoRecords);

  // 箭头图标组件
  Vue.component('icon-arrow', IconArrow);
  // 无数据图标
  Vue.component('icon-report', IconReport);
};

const install = () => {
  installFilters();
  installComponents();
};

export default { install };
