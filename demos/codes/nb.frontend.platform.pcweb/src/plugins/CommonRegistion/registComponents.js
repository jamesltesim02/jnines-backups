import Vue from 'vue';

import IconArrow from '@/components/common/icons/IconArrow';
import IconLoading from '@/components/common/icons/IconLoading';

import Cimg from '@/components/common/Cimg';
import ExpandBox from '@/components/common/ExpandBox';
import RollingText from '@/components/common/RollingText';
import LoadingBar from '@/components/common/LoadingBar';
import NoMoreBar from '@/components/common/NoMoreBar';

/**
 * 注册全局组件
 */
export default () => {
  // 箭头图标
  Vue.component('icon-arrow', IconArrow);
  // loading 图标
  Vue.component('icon-loading', IconLoading);

  // cdn图片组件
  Vue.component('cimg', Cimg);
  // 滚动组件
  // 可展开收起组件
  Vue.component('expand-box', ExpandBox);
  // 滚动文本
  Vue.component('rolling-text', RollingText);
  // loading模块
  Vue.component('loading-bar', LoadingBar);
  // 没有相关数据
  Vue.component('no-more-bar', NoMoreBar);
};
