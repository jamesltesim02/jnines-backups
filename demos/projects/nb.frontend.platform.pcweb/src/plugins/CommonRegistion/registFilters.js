import Vue from 'vue';
import dateFormat from '@/filters/dateFormat';
import oddsFormat from '@/filters/oddsFormat';
import moneyFormat from '@/filters/moneyFormat';
import banknoFormat from '@/filters/banknoFormat';

/**
 * 注册全局过滤器
 */
export default () => {
  // 时间日期格式化
  Vue.filter('dateFormat', (source, pattern) => dateFormat(source, pattern));
  // 赔率显示转换
  Vue.filter('oddsFormat', oddsFormat);
  // 金额格式化
  Vue.filter('moneyFormat', moneyFormat);
  // 银行卡格式化
  Vue.filter('banknoFormat', banknoFormat);
};
