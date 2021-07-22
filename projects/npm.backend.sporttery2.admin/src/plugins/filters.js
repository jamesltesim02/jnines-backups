import Vue from 'vue';
import sdf from '@/utils/simple-date-format'

export default {
  install () {
    Vue.filter('dateFormat', sdf);
  }
}
