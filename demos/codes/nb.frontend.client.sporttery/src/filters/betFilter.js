import Vue from 'vue';
import { numFmt, dateFmt, ellip } from '@/utils/betUtils';

const installBetFilters = () => {
  Vue.filter('NumFmt', numFmt);
  Vue.filter('DateFmt', dateFmt);
  Vue.filter('Ellip', ellip);
  Vue.prototype.numFmt = numFmt;
  Vue.prototype.dateFmt = dateFmt;
  Vue.prototype.ellip = ellip;
};

export default installBetFilters;
